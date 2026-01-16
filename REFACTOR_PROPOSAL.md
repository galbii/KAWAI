# SimpleCustomerSignup Refactor Proposal

## Current Issues
- 370 lines in one component
- Multiple responsibilities (modal + form + success + analytics)
- Duplicated code (modal backdrop, form fields)
- Can't reuse form without modal
- Can't reuse modal for other purposes

## Proposed Component Structure

```
src/components/
├── ui/
│   ├── modal/
│   │   ├── index.ts
│   │   ├── Modal.tsx              # Generic modal wrapper
│   │   ├── ModalBackdrop.tsx      # Reusable backdrop
│   │   ├── ModalContent.tsx       # Content wrapper
│   │   └── useModal.ts            # Modal state hook
│   │
│   ├── form/
│   │   ├── index.ts
│   │   ├── FormInput.tsx          # Input with label, icon, error
│   │   ├── FormLabel.tsx
│   │   └── FormError.tsx
│   │
│   └── feedback/
│       ├── index.ts
│       ├── SuccessMessage.tsx     # Generic success display
│       └── ErrorAlert.tsx         # Generic error display
│
└── forms/
    ├── SimpleCustomerSignup/
    │   ├── index.ts
    │   ├── SimpleCustomerSignupModal.tsx    # Orchestrator (modal wrapper)
    │   ├── SimpleCustomerSignupForm.tsx     # Form only (reusable)
    │   └── SimpleCustomerSignupSuccess.tsx  # Success state
    │
    └── shared/
        └── CustomerFormFields.tsx   # Reusable name/email fields

```

## Example Refactored Components

### 1. Generic Modal Component
```tsx
// src/components/ui/modal/Modal.tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, children, size = 'md' }: ModalProps) {
  // Handle body scroll, backdrop click, ESC key
  return isOpen ? (
    <>
      <ModalBackdrop onClick={onClose} />
      <ModalContent size={size} onClose={onClose}>
        {children}
      </ModalContent>
    </>
  ) : null
}
```

### 2. Reusable Form Input Component
```tsx
// src/components/ui/form/FormInput.tsx
interface FormInputProps {
  label: string
  name: string
  type?: string
  icon?: React.ComponentType<{ className?: string }>
  placeholder?: string
  error?: string
  required?: boolean
  register: UseFormRegister<any>
}

export function FormInput({
  label,
  name,
  type = 'text',
  icon: Icon,
  error,
  required,
  register,
  ...props
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-kawai-black mb-2">
        {label} {required && '*'}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-kawai-black/40" />
        )}
        <input
          type={type}
          {...register(name)}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${
            error ? 'border-red-500' : 'border-kawai-black/20'
          } rounded-md focus:border-kawai-red focus:outline-none transition-colors`}
          {...props}
        />
      </div>
      {error && <FormError message={error} />}
    </div>
  )
}
```

### 3. Separated Form Component (Reusable)
```tsx
// src/components/forms/SimpleCustomerSignup/SimpleCustomerSignupForm.tsx
interface SimpleCustomerSignupFormProps {
  storefrontSlug: string
  customTags?: Array<{ tag: string }> | null
  onSuccess?: () => void
  onError?: (error: string) => void
  submitButtonText?: string
}

export function SimpleCustomerSignupForm({
  storefrontSlug,
  customTags,
  onSuccess,
  onError,
  submitButtonText = 'Sign Up'
}: SimpleCustomerSignupFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupFormSchema)
  })

  const [formState, formAction] = useFormState(submitSimpleCustomerSignup, null)

  const onSubmit = async (data: SignupFormData) => {
    // Form submission logic
  }

  useEffect(() => {
    if (formState?.success) {
      onSuccess?.()
      trackLead({ /* ... */ })
    } else if (formState && !formState.success) {
      onError?.(formState.message)
    }
  }, [formState, onSuccess, onError])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="First Name"
        name="firstName"
        icon={UserIcon}
        placeholder="John"
        required
        register={register}
        error={errors.firstName?.message}
      />

      <FormInput
        label="Last Name"
        name="lastName"
        icon={UserIcon}
        placeholder="Smith"
        required
        register={register}
        error={errors.lastName?.message}
      />

      <FormInput
        label="Email Address"
        name="email"
        type="email"
        icon={EnvelopeIcon}
        placeholder="john.smith@example.com"
        required
        register={register}
        error={errors.email?.message}
      />

      <Button type="submit" fullWidth loading={isSubmitting}>
        {submitButtonText}
      </Button>
    </form>
  )
}
```

### 4. Modal Orchestrator (Combines Everything)
```tsx
// src/components/forms/SimpleCustomerSignup/SimpleCustomerSignupModal.tsx
export function SimpleCustomerSignupModal({
  storefrontSlug,
  title = 'Stay Connected',
  description = 'Sign up to receive updates...',
  showDelay = 1000,
  successTitle = 'Thank You!',
  successMessage = "We'll be in touch soon.",
  imageUrl,
  customTags,
  submitButtonText
}: SimpleCustomerSignupProps) {
  const { isOpen, open, close } = useModal({ autoOpenDelay: showDelay })
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <Modal isOpen={isOpen} onClose={close} size={imageUrl ? 'xl' : 'md'}>
      {isSubmitted ? (
        <SuccessMessage
          title={successTitle}
          message={successMessage}
          onClose={close}
        />
      ) : (
        <div className={imageUrl ? 'flex flex-row' : ''}>
          {imageUrl && (
            <div className="w-[70%]">
              <Image src={imageUrl} alt="..." fill className="object-cover" />
            </div>
          )}
          <div className={imageUrl ? 'w-[30%] p-8' : 'p-8'}>
            <h3 className="text-3xl font-serif mb-2">{title}</h3>
            <p className="text-kawai-black/70 mb-6">{description}</p>

            <SimpleCustomerSignupForm
              storefrontSlug={storefrontSlug}
              customTags={customTags}
              onSuccess={() => setIsSubmitted(true)}
              submitButtonText={submitButtonText}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
```

## Benefits of Refactor

✅ **Modular**: Each component has one responsibility
✅ **Organized**: Clear file structure, easy to find components
✅ **Reusable**:
  - `<Modal>` can be used for any modal
  - `<FormInput>` can be used in any form
  - `<SimpleCustomerSignupForm>` can be used without modal
  - `<SuccessMessage>` can be used anywhere

✅ **Testable**: Each component can be tested independently
✅ **Maintainable**: Changes to modal don't affect form logic
✅ **Flexible**: Easy to create variations (inline form, different modal styles)

## Usage Examples After Refactor

```tsx
// 1. As a modal popup (current use case)
<SimpleCustomerSignupModal storefrontSlug="dallas" />

// 2. Inline form (new capability)
<SimpleCustomerSignupForm
  storefrontSlug="chicago"
  onSuccess={() => router.push('/thank-you')}
/>

// 3. In a different modal context
<Modal isOpen={isOpen} onClose={close}>
  <h2>Special Offer</h2>
  <SimpleCustomerSignupForm storefrontSlug="nashville" />
</Modal>

// 4. Reuse modal for other purposes
<Modal isOpen={showVideo} onClose={() => setShowVideo(false)}>
  <VideoPlayer src="/piano-demo.mp4" />
</Modal>
```

## Migration Strategy

1. Create new components in parallel (don't break existing)
2. Test each component individually
3. Gradually replace old usage with new components
4. Remove old component once fully migrated

## Estimated Refactor Scope

- **New files**: ~10 new component files
- **Lines of code**: ~500 total (more files, but simpler per file)
- **Breaking changes**: None (old component works until removed)
- **Time estimate**: 3-4 hours for full refactor + testing
