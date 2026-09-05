/**
 * A plain <script>, not next/script: Script defaults to afterInteractive,
 * which injects client-side after hydration and is invisible to any crawler
 * that reads the server response rather than executing JS.
 */
export function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
