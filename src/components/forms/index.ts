/**
 * Form Components
 *
 * Central barrel export for all form components in the KAWAI Piano website.
 * Includes forms for email capture, customer signup, and CRM integrations.
 *
 * @example Basic Usage
 * ```tsx
 * import { SimpleCustomerSignup } from '@/components/forms'
 *
 * function StorefrontPage({ slug }: { slug: string }) {
 *   return <SimpleCustomerSignup storefrontSlug={slug} />
 * }
 * ```
 *
 * @example Constant Contact Integration
 * ```tsx
 * import { ConstantContactForm, getSignatureFormConfig } from '@/components/forms'
 *
 * function SignupForm() {
 *   return (
 *     <ConstantContactForm
 *       constantContactConfig={{ targetList: 'Newsletter' }}
 *       formConfig={getSignatureFormConfig()}
 *       onSuccess={(data) => console.log('Success:', data)}
 *     />
 *   )
 * }
 * ```
 */

// ============================================================================
// Constant Contact Form Components
// ============================================================================

export {
  ConstantContactForm,
  getSignatureFormConfig,
  type FormField,
  type FormConfig,
  type ConstantContactFormProps
} from './ConstantContactForm'

// ============================================================================
// Refactored Form Components
// ============================================================================

export { RefactoredEmailForm } from './RefactoredEmailForm'

// ============================================================================
// Customer Signup Components
// ============================================================================

export { SimpleCustomerSignup } from './SimpleCustomerSignup'
export { SimpleCustomerSignupForm, type SimpleCustomerSignupFormProps } from './SimpleCustomerSignupForm'

// ============================================================================
// Form Examples (for reference/documentation)
// ============================================================================

export {
  SignatureExperienceForm,
  NewsletterSignupForm,
  ContactForm,
  CustomStyledForm,
  AdvancedForm
} from './ConstantContactFormExamples'
