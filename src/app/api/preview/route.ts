import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import configPromise from '@payload-config'

export async function GET(
  req: {
    cookies: {
      get: (name: string) => {
        value: string
      }
    }
  } & Request,
): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')
  const previewSecret = searchParams.get('previewSecret')

  if (!path || !collection || !slug) {
    console.error('[Preview] Missing required parameters:', { path, collection, slug })
    return new Response('Insufficient search params', {
      status: 404,
    })
  }

  if (!path.startsWith('/')) {
    return new Response(
      'This endpoint can only be used for relative previews',
      { status: 500 },
    )
  }

  const draft = await draftMode()

  // Shareable preview path — a valid previewSecret enables draft mode for
  // anyone with the link (no admin login required). Used for sending drafts
  // to external reviewers. Anyone with the secret in the URL gets access;
  // rotate PREVIEW_SECRET to revoke all outstanding share links.
  const expectedSecret = process.env.PREVIEW_SECRET
  if (previewSecret && expectedSecret && previewSecret === expectedSecret) {
    console.log(`[Preview] Enabling draft mode via share link, path: ${path}`)
    draft.enable()
    redirect(path)
  }

  // Admin auth path — used by Payload's live preview iframe and admin "View"
  // buttons. Requires a logged-in user.
  let user
  try {
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
  } catch (error) {
    payload.logger.error(
      { err: error },
      'Error verifying token for live preview',
    )
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

  if (!user?.user) {
    draft.disable()
    console.error('[Preview] User not authenticated and no valid previewSecret')
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

  console.log(`[Preview] Enabling draft mode for user: ${user.user.email || 'unknown'}, path: ${path}`)
  draft.enable()
  redirect(path)
}
