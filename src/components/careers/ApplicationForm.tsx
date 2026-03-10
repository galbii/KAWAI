'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'

// ---- Types ----------------------------------------------------------------

type SubmitApplicationFn = (formData: FormData) => Promise<{ success: boolean; message: string }>

// Lazy-loaded so the build doesn't fail when the action file doesn't exist yet
async function callSubmitApplication(formData: FormData): Promise<{ success: boolean; message: string }> {
  const mod = await import('@/lib/actions/submit-application') as { submitApplication: SubmitApplicationFn }
  return mod.submitApplication(formData)
}

// ---- Zod schema -----------------------------------------------------------

const schema = z.object({
  applicantName: z.string().min(2, 'Full name is required'),
  email: z.string().email('A valid email address is required'),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

// ---- Sub-components -------------------------------------------------------

type ToolbarButtonProps = {
  active: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}

function ToolbarButton({ active, onClick, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'px-2.5 py-1.5 rounded text-sm font-medium font-[family-name:var(--font-brand-sans)] transition-colors duration-150',
        'hover:bg-kawai-pearl focus:outline-none focus-visible:ring-1 focus-visible:ring-kawai-red',
        active ? 'text-kawai-red bg-kawai-pearl' : 'text-kawai-charcoal',
      )}
    >
      {children}
    </button>
  )
}

// ---- TipTap Editor --------------------------------------------------------

type RichTextEditorProps = {
  onChange: (html: string) => void
  hasError: boolean
}

function RichTextEditor({ onChange, hasError }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Tell us about yourself, your experience, and why you want to join KAWAI...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
    onUpdate({ editor: ed }) {
      onChange(ed.isEmpty ? '' : ed.getHTML())
    },
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div
      className={cn(
        'border rounded-md overflow-hidden bg-white transition-colors duration-150',
        hasError ? 'border-red-400' : 'border-kawai-neutral',
        'focus-within:border-kawai-red focus-within:ring-1 focus-within:ring-kawai-red',
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-kawai-neutral bg-kawai-pearl/50">
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <div className="w-px h-5 bg-kawai-neutral mx-1" aria-hidden="true" />
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          {/* Bullet list icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="2" cy="3.5" r="1" fill="currentColor" />
            <circle cx="2" cy="7" r="1" fill="currentColor" />
            <circle cx="2" cy="10.5" r="1" fill="currentColor" />
            <path d="M5 3.5h7M5 7h7M5 10.5h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          {/* Ordered list icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1.5 2v3M1 4.5h1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M1 8.5c0-.83.5-1.5 1-1.5s1 .5 1 1c0 .83-1 1.5-2 2.5h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 3.5h7M5 7h7M5 10.5h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}

// ---- Main component -------------------------------------------------------

type ApplicationFormProps = {
  jobId: string
  jobTitle: string
  onSuccess?: () => void
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function ApplicationForm({ jobId, jobTitle, onSuccess }: ApplicationFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [coverLetterHtml, setCoverLetterHtml] = useState('')
  const [coverLetterError, setCoverLetterError] = useState('')
  const [fileList, setFileList] = useState<File[]>([])
  const [fileError, setFileError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const handleCoverLetterChange = useCallback((html: string) => {
    setCoverLetterHtml(html)
    if (html) setCoverLetterError('')
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 3) {
      setFileError('Maximum 3 files allowed')
      setFileList(files.slice(0, 3))
    } else {
      setFileError('')
      setFileList(files)
    }
  }

  async function onSubmit(values: FormValues) {
    if (!coverLetterHtml) {
      setCoverLetterError('Cover letter is required')
      return
    }

    setSubmitState('submitting')
    setServerMessage('')

    try {
      const formData = new FormData()
      formData.append('jobId', jobId)
      formData.append('jobTitle', jobTitle)
      formData.append('applicantName', values.applicantName)
      formData.append('email', values.email)
      if (values.phone) formData.append('phone', values.phone)
      if (values.linkedin) formData.append('linkedin', values.linkedin)
      if (values.portfolio) formData.append('portfolio', values.portfolio)
      formData.append('coverLetter', coverLetterHtml)
      fileList.forEach((file) => formData.append('documents', file))

      const result = await callSubmitApplication(formData)

      if (result.success) {
        setSubmitState('success')
        setServerMessage(result.message)
        onSuccess?.()
      } else {
        setSubmitState('error')
        setServerMessage(result.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubmitState('error')
      setServerMessage('An unexpected error occurred. Please try again later.')
    }
  }

  // ---- Success state -------------------------------------------------------
  if (submitState === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M6 14l5.5 5.5L22 8"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-[family-name:var(--font-brand-luxury)] text-kawai-black mb-3">
          Application Submitted
        </h3>
        <p className="text-kawai-charcoal font-[family-name:var(--font-brand-sans)] max-w-sm leading-relaxed">
          {serverMessage || 'Thank you! Your application has been submitted. We\'ll be in touch soon.'}
        </p>
      </div>
    )
  }

  // ---- Form ----------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* Hidden job fields (visual confirmation) */}
      <div className="bg-kawai-pearl border border-kawai-neutral rounded-md px-4 py-3 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-sm bg-kawai-black flex items-center justify-center shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="2" y="4" width="10" height="8" rx="1" stroke="#d5c78c" strokeWidth="1.2" />
            <path d="M5 4V3a2 2 0 014 0v1" stroke="#d5c78c" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)]">Applying for</p>
          <p className="text-sm font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]">
            {jobTitle}
          </p>
        </div>
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="applicantName"
            className="text-sm font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]"
          >
            Full Name <span className="text-kawai-red">*</span>
          </label>
          <input
            id="applicantName"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            {...register('applicantName')}
            className={cn(
              'border rounded-md px-4 py-2.5 w-full font-[family-name:var(--font-brand-sans)] text-sm text-kawai-black placeholder:text-kawai-charcoal/40',
              'transition-colors duration-150 bg-white',
              'focus:outline-none focus:border-kawai-red focus:ring-1 focus:ring-kawai-red',
              errors.applicantName ? 'border-red-400' : 'border-kawai-neutral',
            )}
          />
          {errors.applicantName && (
            <p className="text-red-500 text-xs font-[family-name:var(--font-brand-sans)]">
              {errors.applicantName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]"
          >
            Email Address <span className="text-kawai-red">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            {...register('email')}
            className={cn(
              'border rounded-md px-4 py-2.5 w-full font-[family-name:var(--font-brand-sans)] text-sm text-kawai-black placeholder:text-kawai-charcoal/40',
              'transition-colors duration-150 bg-white',
              'focus:outline-none focus:border-kawai-red focus:ring-1 focus:ring-kawai-red',
              errors.email ? 'border-red-400' : 'border-kawai-neutral',
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-[family-name:var(--font-brand-sans)]">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="phone"
          className="text-sm font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]"
        >
          Phone Number{' '}
          <span className="font-normal text-kawai-charcoal/50">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 (555) 000-0000"
          {...register('phone')}
          className={cn(
            'border border-kawai-neutral rounded-md px-4 py-2.5 w-full font-[family-name:var(--font-brand-sans)] text-sm text-kawai-black placeholder:text-kawai-charcoal/40',
            'transition-colors duration-150 bg-white',
            'focus:outline-none focus:border-kawai-red focus:ring-1 focus:ring-kawai-red',
          )}
        />
      </div>

      {/* LinkedIn + Portfolio row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="linkedin"
            className="text-sm font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]"
          >
            LinkedIn{' '}
            <span className="font-normal text-kawai-charcoal/50">(optional)</span>
          </label>
          <input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/yourname"
            {...register('linkedin')}
            className={cn(
              'border border-kawai-neutral rounded-md px-4 py-2.5 w-full font-[family-name:var(--font-brand-sans)] text-sm text-kawai-black placeholder:text-kawai-charcoal/40',
              'transition-colors duration-150 bg-white',
              'focus:outline-none focus:border-kawai-red focus:ring-1 focus:ring-kawai-red',
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="portfolio"
            className="text-sm font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]"
          >
            Portfolio / Website{' '}
            <span className="font-normal text-kawai-charcoal/50">(optional)</span>
          </label>
          <input
            id="portfolio"
            type="url"
            placeholder="https://yourwebsite.com"
            {...register('portfolio')}
            className={cn(
              'border border-kawai-neutral rounded-md px-4 py-2.5 w-full font-[family-name:var(--font-brand-sans)] text-sm text-kawai-black placeholder:text-kawai-charcoal/40',
              'transition-colors duration-150 bg-white',
              'focus:outline-none focus:border-kawai-red focus:ring-1 focus:ring-kawai-red',
            )}
          />
        </div>
      </div>

      {/* Cover Letter / CV — TipTap */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]">
          Cover Letter / CV <span className="text-kawai-red">*</span>
        </label>
        <RichTextEditor onChange={handleCoverLetterChange} hasError={Boolean(coverLetterError)} />
        {coverLetterError && (
          <p className="text-red-500 text-xs font-[family-name:var(--font-brand-sans)]">
            {coverLetterError}
          </p>
        )}
      </div>

      {/* File upload */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="documents"
          className="text-sm font-semibold text-kawai-black font-[family-name:var(--font-brand-sans)]"
        >
          Upload Documents{' '}
          <span className="font-normal text-kawai-charcoal/50">
            (Resume, References, etc. — up to 3 files)
          </span>
        </label>
        <label
          htmlFor="documents"
          className={cn(
            'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md py-8 px-4 cursor-pointer',
            'transition-colors duration-150',
            fileError ? 'border-red-400 bg-red-50/30' : 'border-kawai-neutral hover:border-kawai-red/50 hover:bg-kawai-pearl/40',
          )}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-kawai-charcoal/40">
            <path d="M12 16V8M8 12l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 16.7A4 4 0 0017 9h-1.26A8 8 0 104 16.73" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] text-center">
            {fileList.length > 0
              ? fileList.map((f) => f.name).join(', ')
              : 'Click to upload or drag and drop'}
          </span>
          <span className="text-xs text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
            PDF, DOC, DOCX, TXT — max 3 files
          </span>
        </label>
        <input
          id="documents"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="sr-only"
        />
        {fileError && (
          <p className="text-red-500 text-xs font-[family-name:var(--font-brand-sans)]">{fileError}</p>
        )}
      </div>

      {/* Server error */}
      {submitState === 'error' && serverMessage && (
        <div className="border border-red-200 bg-red-50 rounded-md px-4 py-3">
          <p className="text-red-600 text-sm font-[family-name:var(--font-brand-sans)]">{serverMessage}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitState === 'submitting'}
        className={cn(
          'w-full bg-kawai-red text-white font-[family-name:var(--font-brand-sans)] font-semibold py-3.5 rounded-md text-sm tracking-wide uppercase',
          'transition-all duration-200 hover:bg-kawai-red-700 hover:shadow-[0_0_20px_rgba(225,25,34,0.3)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-kawai-red disabled:hover:shadow-none',
        )}
      >
        {submitState === 'submitting' ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Submitting Application...
          </span>
        ) : (
          'Submit Application'
        )}
      </button>

      <p className="text-center text-xs text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
        By submitting, you agree that KAWAI may store and process your information for recruitment purposes.
      </p>
    </form>
  )
}
