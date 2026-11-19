/**
 * The store sale page's path segment and the one it replaced
 * (kawai-holiday-financing-landing v6, Nov 19, 2026). One module, so the
 * canonical, the sitemap and the redirect cannot name different paths.
 * next.config.ts spells the redirect out (it cannot import app code);
 * sale-content.test.ts asserts it matches these.
 */
export const STORE_SALE_PATH = 'holiday-sale-event'
export const RETIRED_STORE_SALE_PATH = 'fall-financing'
