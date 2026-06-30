/**
 * Renders a schema.org JSON-LD `<script>` tag. Pass a single object (typically a
 * `{ '@context': 'https://schema.org', '@graph': [...] }`). Server component —
 * no client JS shipped.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
