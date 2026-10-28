"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui";
import { FormAlert } from "@/components/ui/form-alert";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { submitRentalInquiry } from "@/lib/actions/rental-inquiry";
import {
  RENTAL_TYPES,
  RENTAL_TYPE_LABELS,
  RENTAL_PIANO_TYPES,
  RENTAL_PIANO_TYPE_LABELS,
  RENTAL_INQUIRY_ANCHOR,
  type RentalType,
  type RentalPianoType,
} from "@/lib/rentals";

const formSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name"),
  lastName: z.string().trim().min(1, "Please enter your last name"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().optional(),
  rentalType: z.enum(RENTAL_TYPES),
  pianoType: z.enum(RENTAL_PIANO_TYPES, {
    message: "Please choose a piano type",
  }),
  timeframe: z.string().trim().optional(),
  message: z.string().trim().max(2000).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SERIF = "var(--font-crimson), Georgia, serif";

const controlClass =
  "w-full rounded-md border border-input bg-white px-3 py-2 text-base md:text-sm text-kawai-black outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive";

interface RentalInquiryFormProps {
  storeslug: string;
  storeName: string;
  phone?: string | null;
}

export function RentalInquiryForm({
  storeslug,
  storeName,
  phone,
}: RentalInquiryFormProps) {
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { rentalType: "monthly" },
  });

  // Preselect from the link that brought the visitor here — the Facility
  // Rentals CTA (?type=facility) or a piano tile (?piano=grand).
  useEffect(() => {
    const type = searchParams.get('type')
    if (type && (RENTAL_TYPES as readonly string[]).includes(type)) {
      setValue('rentalType', type as RentalType)
    }
    const piano = searchParams.get('piano')
    if (piano && (RENTAL_PIANO_TYPES as readonly string[]).includes(piano)) {
      setValue('pianoType', piano as RentalPianoType)
    }
  }, [searchParams, setValue]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await submitRentalInquiry({
      ...values,
      phone: values.phone || undefined,
      timeframe: values.timeframe || undefined,
      message: values.message || undefined,
      storeslug,
    });
    if (result.ok) {
      setStatus("success");
      return;
    }
    for (const [key, message] of Object.entries(result.fieldErrors ?? {})) {
      if (key in formSchema.shape && message)
        setError(key as keyof FormValues, { message });
    }
    setServerError(result.error ?? "Something went wrong. Please try again.");
    setStatus("error");
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div
          key="sent"
          role="status"
          className="border-t border-kawai-black/15 pt-10 text-kawai-black"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span aria-hidden className="mb-6 block h-px w-10 bg-kawai-red" />
          <h3
            className="text-4xl font-light leading-tight mb-4"
            style={{ fontFamily: SERIF }}
          >
            Inquiry sent
          </h3>
          <p className="max-w-md text-kawai-black/70 leading-relaxed">
            {storeName} has your details and will reply within one business day.
            A copy is on its way to your inbox.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          id={`${RENTAL_INQUIRY_ANCHOR}-form`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6 text-kawai-black"
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -8, transition: { duration: 0.2 } }
          }
        >
          {status === "error" && serverError && (
            <FormAlert variant="error" message={serverError} />
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              name="firstName"
              label="First name"
              required
              register={register}
              error={errors.firstName}
            />
            <FormField
              name="lastName"
              label="Last name"
              required
              register={register}
              error={errors.lastName}
            />
            <FormField
              name="email"
              label="Email"
              type="email"
              required
              register={register}
              error={errors.email}
            />
            <FormField
              name="phone"
              label="Phone"
              type="tel"
              register={register}
              error={errors.phone}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rentalType">
                Type of rental<span className="text-kawai-red ml-1">*</span>
              </Label>
              <select
                id="rentalType"
                className={controlClass}
                {...register("rentalType")}
              >
                {RENTAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {RENTAL_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pianoType">
                Piano of interest<span className="text-kawai-red ml-1">*</span>
              </Label>
              <select
                id="pianoType"
                defaultValue=""
                aria-invalid={!!errors.pianoType}
                className={controlClass}
                {...register("pianoType")}
              >
                <option value="" disabled>
                  Select a piano type
                </option>
                {RENTAL_PIANO_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {RENTAL_PIANO_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              {errors.pianoType && (
                <p className="text-sm text-kawai-red">
                  {errors.pianoType.message}
                </p>
              )}
            </div>
          </div>

          <FormField
            name="timeframe"
            label="When would you like the piano?"
            placeholder="e.g. Next month, or event date"
            register={register}
            error={errors.timeframe}
          />

          <div className="space-y-2">
            <Label htmlFor="message">Questions or details</Label>
            <textarea
              id="message"
              rows={4}
              placeholder="Tell us about the player, your space, or anything else we should know."
              className={cn(controlClass, "resize-y")}
              {...register("message")}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center bg-kawai-red hover:bg-kawai-black disabled:opacity-60 text-white rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
            >
              {isSubmitting ? "Sending…" : "Send rental inquiry"}
            </button>
            {phone && (
              <p className="text-sm text-kawai-black/65">
                Prefer to talk?{" "}
                <a
                  href={`tel:${phone}`}
                  className="text-kawai-red font-medium hover:text-kawai-black"
                >
                  Call {phone}
                </a>
              </p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
