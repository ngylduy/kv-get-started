export interface Env {
  USER_NOTIFICATION: KVNamespace;
}

const ONE_YEAR = 60 * 60 * 24 * 365;

const STATIC_FILES = new Set([
  "sw.js",
  "manifest.webmanifest",

  "favicon.ico",
  "favicon.svg",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "favicon-96x96.png",
  "favicon-192x192.png",
  "favicon-512x512.png",

  "apple-touch-icon-57x57.png",
  "apple-touch-icon-60x60.png",
  "apple-touch-icon-72x72.png",
  "apple-touch-icon-76x76.png",
  "apple-touch-icon-114x114.png",
  "apple-touch-icon-120x120.png",
  "apple-touch-icon-144x144.png",
  "apple-touch-icon-152x152.png",
  "apple-touch-icon-180x180.png"
]);

function guessCT(path: string): string {
  const p = path.toLowerCase();
  if (p.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (p.endsWith(".webmanifest")) return "application/manifest+json; charset=utf-8";
  if (p.endsWith(".json")) return "application/json; charset=utf-8";
  if (p.endsWith(".ico")) return "image/x-icon";
  if (p.endsWith(".svg")) return "image/svg+xml";
  if (p.endsWith(".png")) return "image/png";
  if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
  if (p.endsWith(".css")) return "text/css; charset=utf-8";
  return "application/octet-stream";
}

function isHtmlRequest(req: Request, url: URL): boolean {
  if (/\.(?:js|css|png|jpg|jpeg|svg|ico|json|webmanifest|txt|xml|wasm)$/i.test(url.pathname)) {
    return false;
  }
  const accept = req.headers.get("Accept") || "";
  return accept.includes("text/html");
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const key = url.pathname.replace(/^\//, "");
    if (isHtmlRequest(req, url)) {
      return fetch(req);
    }

    if (STATIC_FILES.has(key)) {
      try {
        const value = await env.USER_NOTIFICATION.get(key, { type: "arrayBuffer" });
        if (value) {
          const headers = new Headers({
            "content-type": guessCT(key),
            "cache-control": `public, max-age=${ONE_YEAR}, immutable`
          });

          // if (key === "sw.js") headers.set("Service-Worker-Allowed", "/");

          return new Response(value, { headers });
        }
      } catch (err) {
        console.error("KV read error:", err);
        return fetch(req);
      }
    }

    return fetch(req);
  }
};
