import posthog from "posthog-js"
import { isConsentRestricted } from "@/lib/consent-region"

if (!posthog.__loaded) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: '2025-05-24',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
    // Opt-out model: capture by default, except EEA/UK/CH (opt-in via banner).
    opt_out_capturing_by_default: isConsentRestricted(),
    // Session recording is disabled at init and enabled only after the user's
    // first interaction (click/scroll) in providers.tsx — prevents the
    // 6-second recording beacon from firing on every page load.
    disable_session_recording: true,
  })
}