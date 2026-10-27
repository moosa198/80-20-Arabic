const SOURCES = {
  // Official Al-Qalam Institute Google Drive sources. These defaults can be
  // replaced in Cloudflare Pages Variables without changing the repository.
  nahw: "https://drive.google.com/uc?export=download&id=12G3XxRit9JqYDKB0dw_hAj7z1Ngv2Kg",
  sarf: "https://drive.google.com/uc?export=download&id=19kCNLtds9ggGQCXoVLkf0AbE444q3OYB"
};

export async function onRequestGet(context) {
  const book = String(context.params.book || "").toLowerCase();
  if (!SOURCES[book]) return new Response("Unknown FSTU source.", { status: 404 });

  const envKey = book === "nahw" ? "FSTU_NAHW_SOURCE_URL" : "FSTU_SARF_SOURCE_URL";
  const source = context.env[envKey] || SOURCES[book];
  let url;
  try { url = new URL(source); } catch (e) { return new Response("Invalid FSTU source URL.", { status: 500 }); }
  if (url.hostname !== "drive.google.com") {
    return new Response("FSTU source must be an official Google Drive URL.", { status: 500 });
  }

  const upstream = await fetch(url.toString(), {
    headers: { "User-Agent": "80-20-Arabic educational source loader" },
    redirect: "follow",
    cf: { cacheTtl: 86400, cacheEverything: true }
  });
  if (!upstream.ok) {
    return new Response("The official FSTU source could not be fetched.", { status: 502 });
  }

  const headers = new Headers(upstream.headers);
  headers.set("Content-Type", "application/pdf");
  headers.set("Cache-Control", "public, max-age=86400");
  headers.set("X-Content-Source", "Al-Qalam Institute official educational resource");
  headers.set("Content-Disposition", `inline; filename="FSTU-${book}.pdf"`);
  return new Response(upstream.body, { status: 200, headers });
}
