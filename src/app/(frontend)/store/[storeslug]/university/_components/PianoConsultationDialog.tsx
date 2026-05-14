'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { captureBookingLead } from '@/lib/actions/booking-lead';

interface PianoConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyUrl: string;
  eventName?: string;
  tags?: string[];
}

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type FormErrors = Partial<Record<keyof ContactForm, string>>;

function toE164US(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+1${digits}`;
}

function buildCalendlyUrl(base: string, form: ContactForm): string {
  const phone = toE164US(form.phone);
  const params = new URLSearchParams({
    name: `${form.firstName} ${form.lastName}`.trim(),
    email: form.email,
    ...(phone ? { a1: phone } : {}),
    hide_gdpr_banner: '1',
    embed_type: 'Inline',
    embed_domain: window.location.hostname,
  });
  return `${base}${base.includes('?') ? '&' : '?'}${params.toString()}`;
}

function validate(form: ContactForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'Required';
  if (!form.lastName.trim()) errors.lastName = 'Required';
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address';
  return errors;
}

function Field({
  label,
  required,
  error,
  children,
  half,
}: {
  label: string;
  required?: boolean;
  error?: string | undefined;
  children: React.ReactNode;
  half?: boolean;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', half && 'min-w-0')}>
      <label className="text-[0.65rem] tracking-[0.18em] uppercase font-semibold select-none" style={{ color: 'rgba(77,25,121,0.7)' }}>
        {label}
        {required && <span style={{ color: '#4D1979' }} className="ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function PurpleInput({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-4 py-3 text-[16px] sm:text-sm rounded-sm outline-none transition-all duration-200',
        error
          ? 'bg-[#F8F7FF] border border-red-400 ring-1 ring-red-400/20 text-[#1a0d2e] placeholder:text-[rgba(26,13,46,0.35)]'
          : 'bg-[#F8F7FF] border border-[#E5E0F0] hover:border-[rgba(77,25,121,0.3)] focus:border-[rgba(77,25,121,0.6)] focus:ring-1 focus:ring-[rgba(77,25,121,0.12)] text-[#1a0d2e] placeholder:text-[rgba(26,13,46,0.35)]',
        className,
      )}
    />
  );
}

function ProgressBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-[2px] overflow-hidden rounded-full" style={{ background: 'rgba(77,25,121,0.12)' }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: step === 1 ? '50%' : '100%', background: '#4D1979' }}
        />
      </div>
      <span className="text-[0.62rem] tracking-[0.15em] uppercase font-medium whitespace-nowrap" style={{ color: '#4D1979' }}>
        {step} / 2
      </span>
    </div>
  );
}

export default function PianoConsultationDialog({
  isOpen,
  onClose,
  calendlyUrl,
  eventName = 'Piano Sale',
  tags = [],
}: PianoConsultationDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<ContactForm>({ firstName: '', lastName: '', email: '', phone: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [iframeLoading, setIframeLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pixelFiredRef = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (!isOpen) {
      pixelFiredRef.current = false;
      setStep(1);
      setForm({ firstName: '', lastName: '', email: '', phone: '' });
      setErrors({});
      setIframeLoading(true);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== 2) return;

    function handleMessage(e: MessageEvent) {
      let data = e.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch { return; }
      }
      if (!data?.event || typeof data.event !== 'string') return;
      if (!data.event.startsWith('calendly')) return;
      if (data.event === 'calendly.event_scheduled' && !pixelFiredRef.current) {
        pixelFiredRef.current = true;
        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push({
          event: 'calendly_booking_confirmed',
          event_category: 'booking',
          event_label: eventName,
        });
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, step, eventName]);

  if (!isOpen || !mounted) return null;

  const embedUrl = buildCalendlyUrl(calendlyUrl, form);

  type StringFormField = 'firstName' | 'lastName' | 'email' | 'phone';

  function update(field: StringFormField) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };
  }

  function handleContinue() {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIframeLoading(true);
    setStep(2);
    captureBookingLead({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone ? toE164US(form.phone) : undefined,
      customTags: tags,
      note: `${eventName} — booking appointment inquiry`,
    });
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: 'booking_lead_captured',
      event_category: 'booking',
      event_label: eventName,
    });
  }

  function handleBack() { setStep(1); }

  function handleClose() {
    setStep(1);
    setForm({ firstName: '', lastName: '', email: '', phone: '' });
    setErrors({});
    setIframeLoading(true);
    onClose();
  }

  return createPortal(
    <>
      <style>{`
        @keyframes bm-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bm-panel-in {
          0%   { opacity: 0; transform: scale(0.91) translateY(28px); }
          60%  { opacity: 1; transform: scale(1.018) translateY(-4px); }
          78%  { transform: scale(0.996) translateY(1px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes bm-step-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bm-overlay { animation: bm-overlay-in 0.22s ease both; }
        .bm-panel   { animation: bm-panel-in 0.5s cubic-bezier(0.34,1.2,0.64,1) both; }
        .bm-step    { animation: bm-step-in 0.38s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
      `}</style>

      <div
        className="bm-overlay fixed inset-0 z-[9010] bg-black/60 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden
      />

      <div
        className="fixed inset-0 z-[9011] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label={`Book Your ${eventName} Appointment`}
      >
        <div
          className="bm-panel pointer-events-auto w-full max-w-[440px] rounded-2xl overflow-hidden flex flex-col border border-[rgba(77,25,121,0.15)]"
          style={{ background: '#FFFFFF', maxHeight: '90dvh', boxShadow: '0 40px 100px rgba(0,0,0,0.45), 0 12px 32px rgba(77,25,121,0.2)' }}
        >
          <div className="h-[3px] flex-shrink-0" style={{ background: '#4D1979' }} />

          <div className="relative px-6 pt-5 pb-5 flex-shrink-0 border-b" style={{ borderColor: 'rgba(77,25,121,0.15)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <span className="text-[0.62rem] tracking-[0.22em] uppercase font-semibold" style={{ color: '#4D1979' }}>
                    {eventName}
                  </span>
                </div>

                <h2
                  className="font-heading italic leading-tight mb-4"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', color: '#1a0d2e' }}
                >
                  {step === 1 ? 'Book Your Appointment' : 'Select a Time'}
                </h2>

                <ProgressBar step={step} />
              </div>

              <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
                {step === 2 && (
                  <button
                    onClick={handleBack}
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(77,25,121,0.08)]"
                    style={{ color: 'rgba(26,13,46,0.5)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4D1979'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(26,13,46,0.5)'; }}
                    aria-label="Back to contact details"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(77,25,121,0.08)]"
                  style={{ color: 'rgba(26,13,46,0.5)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4D1979'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(26,13,46,0.5)'; }}
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">

            {step === 1 && (
              <div className="bm-step px-6 py-7">

                <div className="flex items-start gap-3 rounded-lg px-4 py-3 mb-7 border" style={{ background: 'rgba(77,25,121,0.06)', borderColor: 'rgba(77,25,121,0.2)' }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#4D1979' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(26,13,46,0.55)' }}>
                    Your appointment confirmation will be sent to your email address.
                  </p>
                </div>

                <div className="space-y-5 mb-7">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" required error={errors.firstName} half>
                      <PurpleInput
                        type="text"
                        placeholder="Jane"
                        value={form.firstName}
                        onChange={update('firstName')}
                        error={!!errors.firstName}
                        autoComplete="given-name"
                        autoFocus
                      />
                    </Field>
                    <Field label="Last Name" required error={errors.lastName} half>
                      <PurpleInput
                        type="text"
                        placeholder="Smith"
                        value={form.lastName}
                        onChange={update('lastName')}
                        error={!!errors.lastName}
                        autoComplete="family-name"
                      />
                    </Field>
                  </div>

                  <Field label="Email Address" required error={errors.email}>
                    <PurpleInput
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={update('email')}
                      error={!!errors.email}
                      autoComplete="email"
                    />
                  </Field>

                  <Field label="Phone Number">
                    <PurpleInput
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={form.phone}
                      onChange={update('phone')}
                      autoComplete="tel"
                    />
                  </Field>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full flex items-center justify-between px-6 py-4 text-sm tracking-[0.15em] uppercase font-semibold transition-colors rounded-sm group relative overflow-hidden"
                  style={{ background: '#4D1979', color: '#FFFFFF' }}
                >
                  <span className="relative z-10">Continue to Book</span>
                  <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                <p className="mt-4 text-[0.68rem] leading-relaxed text-center" style={{ color: 'rgba(26,13,46,0.38)' }}>
                  By submitting this form, you agree to receive promotional emails and
                  updates from Kawai Piano. You may unsubscribe at any time.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="bm-step">
                <div className="relative" style={{ background: '#120B1E' }}>
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ minHeight: 520, background: '#120B1E' }}>
                      <div className="w-6 h-6 rounded-full border-2 animate-spin mb-3" style={{ borderColor: 'rgba(77,25,121,0.25)', borderTopColor: '#4D1979' }} />
                      <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(77,25,121,0.7)' }}>
                        Loading your calendar…
                      </p>
                    </div>
                  )}
                  <iframe
                    src={embedUrl}
                    className={cn('w-full border-0 block', iframeLoading && 'invisible')}
                    style={{ minHeight: 580 }}
                    title={`Book a ${eventName} appointment`}
                    onLoad={() => setIframeLoading(false)}
                    allow="camera; microphone"
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
