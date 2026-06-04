const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const root = __dirname;
const port = Number(process.env.PORT || 4173);

loadEnv();

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}

function productTypeFor(query, fallback = "outfit") {
  const lowered = query.toLowerCase();
  if (lowered.includes("bag") || lowered.includes("clutch")) return "bag";
  if (lowered.includes("shoe") || lowered.includes("heel") || lowered.includes("sandal")) return "shoe";
  if (lowered.includes("dress")) return "dress";
  return fallback;
}

function normalizeProduct(item, type) {
  return {
    type,
    title: item.title || "منتج مناسب للوك",
    price: item.price || item.extracted_price ? item.price || `${item.extracted_price}` : "",
    source: item.source || item.seller || item.merchant || "Google Shopping",
    image: item.thumbnail || item.serpapi_thumbnail || item.image || "",
    link: item.link || item.product_link || item.serpapi_product_api || "",
  };
}

async function fetchShoppingProducts(query, type) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return { ok: false, error: "SERPAPI_KEY is missing", products: [] };
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_shopping");
  url.searchParams.set("q", query);
  url.searchParams.set("gl", "sa");
  url.searchParams.set("hl", "en");
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    return { ok: false, error: `SerpApi returned ${response.status}`, products: [] };
  }

  const data = await response.json();
  const shoppingResults = Array.isArray(data.shopping_results) ? data.shopping_results : [];
  const products = shoppingResults
    .map((item) => normalizeProduct(item, type))
    .filter((item) => item.image && item.link)
    .slice(0, 3);

  return { ok: true, products };
}

async function handleProducts(req, res, url) {
  const baseQuery = (url.searchParams.get("q") || "women outfit").slice(0, 120);
  const type = productTypeFor(baseQuery);
  const searches = [
    [baseQuery, type],
    [`${baseQuery} bag`, "bag"],
    [`${baseQuery} heels`, "shoe"],
  ];

  try {
    const results = await Promise.all(searches.map(([query, itemType]) => fetchShoppingProducts(query, itemType)));
    const products = results.flatMap((result) => result.products);
    const uniqueProducts = [...new Map(products.map((item) => [item.link, item])).values()].slice(0, 5);
    sendJson(res, 200, {
      ok: uniqueProducts.length > 0,
      products: uniqueProducts,
      error: uniqueProducts.length ? "" : results.find((result) => result.error)?.error || "No products found",
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, products: [], error: "Could not fetch products" });
  }
}

function serveStatic(req, res, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/api/products") {
      handleProducts(req, res, url);
      return;
    }

    serveStatic(req, res, url);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`AI Outfit Planner running at http://127.0.0.1:${port}`);
  });
