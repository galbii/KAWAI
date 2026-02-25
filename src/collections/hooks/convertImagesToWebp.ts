import type { CollectionBeforeOperationHook } from 'payload'
import sharp from 'sharp'

const CONVERTIBLE_TYPES: Record<string, { ext: RegExp; mime: string }> = {
  'image/tiff': { ext: /\.tiff?$/i, mime: 'image/tiff' },
  'image/png': { ext: /\.png$/i, mime: 'image/png' },
}

/**
 * Converts PNG and TIFF uploads to WebP before Payload processes them.
 *
 * Respects the `convertToWebp` field on the Media document — if the user
 * unchecks it in the editor, the original format is preserved.
 *
 * Runs only when a file is actually being uploaded (req.file present), so
 * editing metadata on an existing record never triggers conversion.
 *
 * Sharp handles both formats natively — no extra packages required.
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

  const webpBuffer = await sharp(req.file.data).webp({ quality: 90 }).toBuffer()

  req.file.data = webpBuffer
  req.file.mimetype = 'image/webp'
  req.file.size = webpBuffer.length
  req.file.name = (name ?? 'image').replace(/\.(png|tiff?)$/i, '.webp')
}
