/**
 * The old FAQ page has been removed. A 410 "Gone" response tells search engines
 * the page is gone on purpose, so they drop it sooner than they would for a 404.
 */
export function GET() {
  return new Response("This page has been removed.", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
