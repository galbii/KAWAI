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

  // Validate preview secret
  if (previewSecret !== process.env.PREVIEW_SECRET) {
    console.error('[Preview] Invalid preview secret')
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

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

  // Authenticate user
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

  const draft = await draftMode()

  if (!user?.user) {
    draft.disable()
    console.error('[Preview] User not authenticated')
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

  console.log(`[Preview] Enabling draft mode for user: ${user.user.email || 'unknown'}, path: ${path}`)

  // Enable draft mode
  draft.enable()

  redirect(path)
}
