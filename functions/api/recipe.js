// Cloudflare Pages Function: GET /api/recipe?url=<recipe page>
// Recipe Studio's "Import from URL" uses this because most recipe sites
// don't allow cross-origin fetches from the browser. It doesn't send back the
// whole page, just the JSON-LD blocks (where sites put schema.org/Recipe data)
// and a few meta tags, so it can't be used as a general-purpose proxy.

const MAX_JSONLD = 2_000_000; // chars, plenty for even the chattiest food blog

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 ? 'public, max-age=3600' : 'no-store',
    },
  });

export async function onRequestGet({ request }) {
  const raw = new URL(request.url).searchParams.get('url') || '';
  let target;
  try { target = new URL(raw); } catch { return json({ error: "That doesn't look like a URL." }, 400); }
  if (!/^https?:$/.test(target.protocol)) return json({ error: 'Only http(s) links, please.' }, 400);
  if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[?::1\]?$)/i.test(target.hostname))
    return json({ error: 'Nice try. No local addresses.' }, 400);

  let res;
  try {
    res = await fetch(target.toString(), {
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 RecipeStudio/1.0',
        'accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
      },
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
  } catch {
    return json({ error: "Couldn't reach that site." }, 502);
  }
  if (!res.ok) return json({ error: `The site answered ${res.status}. It may block robots (even friendly potato ones).` }, 502);
  if (!/html/i.test(res.headers.get('content-type') || ''))
    return json({ error: "That link isn't a web page." }, 415);

  const out = { url: res.url, jsonld: [], title: '', meta: {} };
  let total = 0, inTitle = false, gotTitle = false;
  await new HTMLRewriter()
    .on('script[type*="ld+json"]', {
      element() { out.jsonld.push(''); },
      text(t) {
        if (total > MAX_JSONLD) return;
        total += t.text.length;
        out.jsonld[out.jsonld.length - 1] += t.text;
      },
    })
    .on('head title', {
      element(e) { if (!gotTitle) { inTitle = true; gotTitle = true; e.onEndTag(() => { inTitle = false; }); } },
      text(t) { if (inTitle) out.title += t.text; },
    })
    .on('meta', {
      element(e) {
        const key = (e.getAttribute('property') || e.getAttribute('name') || '').toLowerCase();
        const val = e.getAttribute('content');
        if (val && ['og:title', 'og:description', 'og:site_name', 'og:image', 'description', 'author'].includes(key))
          out.meta[key] = val.slice(0, 2000);
      },
    })
    .transform(res)
    .arrayBuffer();

  return json(out);
}
