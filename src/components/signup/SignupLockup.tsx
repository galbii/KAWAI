import Image from 'next/image'

/**
 * Header lockup: KMS logo │ hairline rule │ storefront name.
 *
 * The asset is 1430×128 — an 11:1 ratio — so it gets an explicit height and
 * auto width, and the rule and city wrap beneath it on narrow screens. The red
 * PNG is used as-is on this light header; it must not be placed on a dark
 * background without a proper white/mono asset (a CSS invert() fringes on the
 * curves).
 */
export function SignupLockup({ storeName }: { storeName: string }) {
  return (
    <header className="border-b border-kawai-neutral bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
        <Image
          src="/images/kms/KMS Logo.png"
          alt="Kawai Music School"
          width={1430}
          height={128}
          priority
          className="h-5 w-auto sm:h-6"
        />
        <span aria-hidden="true" className="hidden h-5 w-px bg-kawai-neutral sm:block" />
        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-kawai-black">
          {storeName}
        </span>
      </div>
    </header>
  )
}
