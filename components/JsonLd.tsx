/**
 * Structured data for search engines, rendered as a JSON-LD script on the server.
 * `<` is escaped so text from the data can never close the script tag.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((item, index) => (
    <script key={index} type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }} />
  ));
}
