import posthog from "posthog-js"

if (!posthog.__loaded) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: '2025-05-24',
    capture_exceptions: true, // This enables capturing exceptions using Error Tracking
    debug: process.env.NODE_ENV === "development",
    opt_out_capturing_by_default: true,
  })
}