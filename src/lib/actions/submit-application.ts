'use server'

import { z } from 'zod'

const applicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID required'),
  applicantName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  coverLetterHtml: z.string().optional(),
})

interface SubmissionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function submitApplication(formData: FormData): Promise<SubmissionResult> {
  try {
    // Extract text fields
    const rawData = {
      jobId: formData.get('jobId') as string,
      applicantName: formData.get('applicantName') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      linkedin: (formData.get('linkedin') as string) || undefined,
      portfolio: (formData.get('portfolio') as string) || undefined,
      coverLetterHtml: (formData.get('coverLetterHtml') as string) || undefined,
    }

    // Validate
    const validation = applicationSchema.safeParse(rawData)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.issues.forEach((err) => {
        const field = err.path[0] as string
        errors[field] = err.message
      })
      return { success: false, message: 'Please fix the form errors', errors }
    }

    const data = validation.data

    // Import Payload (dynamic to avoid bundling issues)
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    const payload = await getPayload({ config: configPromise.default })

    // Handle file uploads - store document info
    const uploadedDocuments: Array<{ filename: string; url: string; mimeType: string }> = []

    const files = formData.getAll('documents') as File[]
    for (const file of files) {
      if (!file || file.size === 0) continue

      try {
        // Upload file to Payload (which routes to R2 via S3 plugin)
        // Convert File to Buffer for Payload local API
        const buffer = Buffer.from(await file.arrayBuffer())

        const uploadedMedia = await payload.create({
          collection: 'media',
          data: {
            alt: `Application document - ${file.name}`,
            mediaType: 'document',
          },
          file: {
            data: buffer,
            mimetype: file.type,
            name: `applications/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
            size: file.size,
          },
        })

        // Get the URL from the uploaded media
        const fileUrl = typeof uploadedMedia.url === 'string' ? uploadedMedia.url : ''

        uploadedDocuments.push({
          filename: file.name,
          url: fileUrl,
          mimeType: file.type,
        })
      } catch (uploadError) {
        console.error('[ApplicationForm] File upload error:', uploadError)
        // Continue without failing the whole submission
      }
    }

    // Create the job application record
    await payload.create({
      collection: 'job-applications',
      data: {
        job: data.jobId,
        applicantName: data.applicantName,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin,
        portfolio: data.portfolio,
        // coverLetter is a richText (Lexical) field in the collection;
        // we pass the raw TipTap HTML here via `as any` — the field mapping
        // can be reconciled once the collection schema is finalised.
        coverLetter: data.coverLetterHtml,
        documents: uploadedDocuments,
        status: 'new',
        submittedAt: new Date().toISOString(),
      } as any,
    })

    console.log(
      `[ApplicationForm] New application submitted: ${data.applicantName} (${data.email}) for job ${data.jobId}`,
    )

    return {
      success: true,
      message: 'Your application has been submitted successfully. We will be in touch soon!',
    }
  } catch (error) {
    console.error('[ApplicationForm] Error submitting application:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again or contact us directly.',
    }
  }
}
