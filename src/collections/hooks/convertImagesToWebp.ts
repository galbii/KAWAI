import type { CollectionBeforeOperationHook } from 'payload'
import { APIError } from 'payload'
import sharp from 'sharp'

const CONVERTIBLE_TYPES: Record<string, { ext: RegExp; mime: string }> = {
  'image/tiff': { ext: /\.tiff?$/i, mime: 'image/tiff' },
  'image/png': { ext: /\.png$/i, mime: 'image/png' },
}

/**
 * Strip oversized binary IFD entries from a regular TIFF buffer before Sharp
 * processes it. libvips hard-limits cumulative custom-tag allocation to 50 MB;
 * large professional TIFFs can carry >80 MB of embedded ICC profiles and camera
 * maker notes. Those entries are pure metadata — stripping them leaves pixel data
 * and essential image tags untouched.
 *
 * Only handles regular TIFF (version 42). BigTIFF (version 43) is returned as-is
 * and will fail naturally if too large.
 *
 * @param buf        Raw TIFF bytes
 * @param maxTagBytes Strip any single BYTE/UNDEFINED IFD entry larger than this
 */
function stripOversizedTiffTags(buf: Buffer, maxTagBytes: number): Buffer {
  // Validate TIFF byte-order mark
  const bom = buf.readUInt16LE(0)
  if (bom !== 0x4949 && bom !== 0x4D4D) return buf

  const le = bom === 0x4949
  const r16 = (o: number) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o))
  const r32 = (o: number) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o))

  // Only handle classic TIFF (42); skip BigTIFF (43)
  if (r16(2) !== 42) return buf

  const out = Buffer.from(buf)
  const w32 = (v: number, o: number) => (le ? out.writeUInt32LE(v, o) : out.writeUInt32BE(v, o))

  let ifd = r32(4)
  while (ifd > 0 && ifd + 2 <= buf.length) {
    const entryCount = r16(ifd)
    for (let i = 0; i < entryCount; i++) {
      const e = ifd + 2 + i * 12
      if (e + 12 > buf.length) break

      const type = r16(e + 2)
      const count = r32(e + 4)

      // BYTE (1) or UNDEFINED (7) — the only types that produce raw binary blobs
      if ((type === 1 || type === 7) && count > maxTagBytes) {
        w32(0, e + 4) // zero count  → entry points to nothing
        w32(0, e + 8) // zero offset → no dangling pointer
      }
    }

    const nextPtr = ifd + 2 + entryCount * 12
    if (nextPtr + 4 > buf.length) break
    ifd = r32(nextPtr)
  }

  return out
}

/**
 * Converts PNG and TIFF uploads to WebP before Payload processes them.
 *
 * For TIFFs that exceed libvips' 50 MB cumulative binary-tag limit, the hook
 * automatically strips the oversized metadata entries and retries. This handles
 * professional TIFFs that embed large ICC profiles or camera maker notes.
 *
 * Respects the `convertToWebp` field on the Media document — if the user
 * unchecks it in the editor, the original format is preserved.
 *
 * Runs only when a file is actually being uploaded (req.file present), so
 * editing metadata on an existing record never triggers conversion.
 */
export const convertImagesToWebp: CollectionBeforeOperationHook = async ({
  req,
  operation,
}) => {
  if ((operation !== 'create' && operation !== 'update') || !req.file) return

  // Default to converting unless user explicitly unchecked the option
  const shouldConvert = req.data?.convertToWebp !== false
  if (!shouldConvert) return

  const { mimetype, name } = req.file
  const isConvertible =
    mimetype in CONVERTIBLE_TYPES ||
    Object.values(CONVERTIBLE_TYPES).some(({ ext }) => ext.test(name ?? ''))

  if (!isConvertible) return

  const isTiff = mimetype === 'image/tiff' || /\.tiff?$/i.test(name ?? '')

  let webpBuffer: Buffer

  // ── First attempt: lenient read, ignore unreadable metadata ─────────────
  // failOn:'none' tells libvips to continue even when it can't allocate memory
  // for oversized binary IFD entries (ICC profiles, camera maker notes, etc.).
  // Pixel data is unaffected — only the unloadable metadata tags are skipped.
  try {
    webpBuffer = await sharp(req.file.data, { limitInputPixels: false, failOn: 'none' })
      .webp({ quality: 90 })
      .toBuffer()
  } catch {
    // ── Second attempt (TIFFs only): strip oversized main-IFD tags and retry ─
    if (!isTiff) {
      console.warn('[convertImagesToWebp] WebP conversion failed for PNG — uploading original format.')
      return
    }

    const stripped = stripOversizedTiffTags(req.file.data as Buffer, 10_000_000)

    try {
      webpBuffer = await sharp(stripped, { limitInputPixels: false, failOn: 'none' })
        .webp({ quality: 90 })
        .toBuffer()
      console.info('[convertImagesToWebp] TIFF converted after stripping oversized metadata tags.')
    } catch (err2) {
      // Both attempts failed — the TIFF pixels themselves are unreadable.
      // Reject cleanly rather than letting Payload's createImageSizes hit the same error.
      throw new APIError(
        'This TIFF image could not be processed automatically. ' +
        'Please export it as JPEG or PNG before uploading.',
        400,
        null,
        true,
      )
    }
  }

  req.file.data = webpBuffer
  req.file.mimetype = 'image/webp'
  req.file.size = webpBuffer.length
  req.file.name = (name ?? 'image').replace(/\.(png|tiff?)$/i, '.webp')
}
