const CACHE = "line-ready-v15";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-180.png", "./icon-512.png", "./par.html", "./app.css", "./common.js", "./settings.html", "./themes.css", "./knowledge.html", "./targets.js"];

// Precache with cache: "reload" so files come from the server, not the browser's HTTP cache
// (GitHub Pages lets files be cached for about 10 minutes).
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(ASSETS.map(url =>
        fetch(new Request(url, { cache: "reload" })).then(res => {
          if (!res.ok) throw new Error("Precache failed: " + url);
          return cache.put(url, res);
        }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (revalidated against the server), falling back to the cache when offline.
// New versions therefore show up on the next load while online, and the app still works offline.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: "no-cache" })
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match("./index.html")))
  );
});
