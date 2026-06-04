(function () {
  const cache = new Map();
  const keyStorageName = "serpapi_demo_key";
  const bundledSerpApiKey = "e8a3ef578fbc1e06a76cde01799a487d2ebb21cdda7bc94ffcebb519c461fc4b";

  function getSerpApiKey() {
    const params = new URLSearchParams(window.location.search);
    const keyFromUrl = params.get("serpapi_key");
    if (keyFromUrl) {
      localStorage.setItem(keyStorageName, keyFromUrl.trim());
      return keyFromUrl.trim();
    }

    return (localStorage.getItem(keyStorageName) || bundledSerpApiKey).trim();
  }

  function productLabel(type) {
    return {
      dress: "الفستان",
      bag: "الشنطة",
      shoe: "الحذاء",
      outfit: "القطعة",
    }[type] || "القطعة";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function extractQuery(card) {
    const ounassLink = [...card.querySelectorAll(".retail-links a")].find((link) =>
      link.textContent.includes("Ounass"),
    );
    if (!ounassLink) return "";
    return new URL(ounassLink.href).searchParams.get("q") || "";
  }

  function searchPlans(query) {
    const cleanQuery = query.replace(/\s+/g, " ").trim();
    return [
      { type: "dress", q: cleanQuery },
      { type: "bag", q: `${cleanQuery} luxury handbag` },
      { type: "shoe", q: `${cleanQuery} heels shoes` },
    ];
  }

  async function fetchProducts(query) {
    if (!query) return [];

    const cacheKey = `${query}:${Boolean(getSerpApiKey())}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const request = fetchLocalProducts(query).then(async (localProducts) => {
      if (localProducts.length) return localProducts;
      return fetchSerpApiProducts(query);
    });

    cache.set(cacheKey, request);
    return request;
  }

  async function fetchLocalProducts(query) {
    return fetch(`/api/products?q=${encodeURIComponent(query)}`)
      .then((response) => (response.ok ? response.json() : { products: [] }))
      .then((data) => (Array.isArray(data.products) ? data.products : []))
      .catch(() => []);
  }

  async function fetchSerpApiProducts(query) {
    const apiKey = getSerpApiKey();
    if (!apiKey) return [];

    const results = await Promise.all(
      searchPlans(query).map(async (plan) => {
        const url = new URL("https://serpapi.com/search.json");
        url.searchParams.set("engine", "google_shopping");
        url.searchParams.set("q", plan.q);
        url.searchParams.set("gl", "sa");
        url.searchParams.set("hl", "ar");
        url.searchParams.set("api_key", apiKey);

        return fetch(url)
          .then((response) => (response.ok ? response.json() : null))
          .then((data) => normalizeSerpApiProduct(data, plan.type))
          .catch(() => null);
      }),
    );

    return results.filter(Boolean);
  }

  function normalizeSerpApiProduct(data, type) {
    const items = [
      ...(data?.shopping_results || []),
      ...(data?.inline_shopping_results || []),
      ...(data?.categorized_shopping_results || []).flatMap((group) => group.shopping_results || []),
    ];

    const item = items.find((candidate) => candidate.thumbnail || candidate.serpapi_thumbnail);
    if (!item) return null;

    return {
      type,
      title: item.title || "اختيار مناسب للوك",
      price: item.price || "",
      source: item.source || item.seller || "Google Shopping",
      link: item.link || item.product_link || item.serpapi_link || "#",
      image: item.thumbnail || item.serpapi_thumbnail,
    };
  }

  function fallbackProducts(card) {
    const links = [...card.querySelectorAll(".retail-links a")];
    const ounass = links.find((link) => link.textContent.includes("Ounass"))?.href || "#";
    const bloomingdales = links.find((link) => link.textContent.includes("Bloomingdale"))?.href || ounass;
    const harrods = links.find((link) => link.textContent.includes("Harrods"))?.href || ounass;

    return [
      { type: "dress", title: "اختيارات فساتين مشابهة", source: "Ounass", link: ounass, image: fallbackImage("dress") },
      { type: "bag", title: "شنط تناسب اللوك", source: "Bloomingdale's", link: bloomingdales, image: fallbackImage("bag") },
      { type: "shoe", title: "أحذية وإكسسوارات", source: "Harrods", link: harrods, image: fallbackImage("shoe") },
    ];
  }

  function fallbackImage(type) {
    const art = {
      dress: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">
          <defs>
            <linearGradient id="bg" x1="0" x2="1"><stop stop-color="#fff7fb"/><stop offset="1" stop-color="#eef9ff"/></linearGradient>
            <linearGradient id="dress" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#251321"/><stop offset="1" stop-color="#d9447f"/></linearGradient>
          </defs>
          <rect width="360" height="240" rx="22" fill="url(#bg)"/>
          <circle cx="70" cy="46" r="54" fill="#ffe0ed"/>
          <path d="M167 52h26l17 43 38 88c3 8-3 17-12 17H124c-9 0-15-9-12-17l38-88 17-43Z" fill="url(#dress)"/>
          <path d="M160 52c5 17 13 27 20 27s15-10 20-27" fill="#fff7fb" opacity=".95"/>
          <path d="M151 96h58" stroke="#f5c4d8" stroke-width="6" stroke-linecap="round"/>
          <circle cx="261" cy="82" r="18" fill="#c9a24b"/>
          <text x="180" y="224" fill="#735f6b" text-anchor="middle" font-size="18" font-family="Arial">صورة الفستان</text>
        </svg>`,
      bag: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">
          <defs><linearGradient id="bg" x1="0" x2="1"><stop stop-color="#fff8ed"/><stop offset="1" stop-color="#f8fcff"/></linearGradient><linearGradient id="bag" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff0c5"/><stop offset="1" stop-color="#d9447f"/></linearGradient></defs>
          <rect width="360" height="240" rx="22" fill="url(#bg)"/>
          <rect x="120" y="92" width="120" height="82" rx="20" fill="url(#bag)"/>
          <path d="M148 96c0-30 64-30 64 0" fill="none" stroke="#7c6040" stroke-width="12" stroke-linecap="round"/>
          <circle cx="88" cy="60" r="38" fill="#ffd5e6"/>
          <text x="180" y="218" fill="#735f6b" text-anchor="middle" font-size="18" font-family="Arial">شنطة مناسبة</text>
        </svg>`,
      shoe: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240">
          <defs><linearGradient id="bg" x1="0" x2="1"><stop stop-color="#f8fcff"/><stop offset="1" stop-color="#fff7fb"/></linearGradient><linearGradient id="shoe" x1="0" x2="1"><stop stop-color="#d8d0d8"/><stop offset="1" stop-color="#315b7c"/></linearGradient></defs>
          <rect width="360" height="240" rx="22" fill="url(#bg)"/>
          <path d="M98 145c42 0 78-14 106-42 9 30 28 43 58 43 12 0 20 9 18 20-2 10-10 16-22 16H105c-18 0-28-13-23-25 3-8 8-12 16-12Z" fill="url(#shoe)"/>
          <path d="M215 104l22 66" stroke="#735f6b" stroke-width="10" stroke-linecap="round"/>
          <circle cx="76" cy="58" r="34" fill="#dff3ff"/>
          <text x="180" y="218" fill="#735f6b" text-anchor="middle" font-size="18" font-family="Arial">حذاء مناسب</text>
        </svg>`,
    }[type];

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(art)}`;
  }

  function renderProducts(strip, products) {
    if (!products.length) {
      strip.hidden = true;
      return;
    }

    strip.hidden = false;
    strip.innerHTML = products
      .slice(0, 3)
      .map(
        (product) => `
          <a class="product-card" href="${escapeHtml(product.link)}" target="_blank" rel="noreferrer">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy" referrerpolicy="no-referrer" />
            <span>${productLabel(product.type)}</span>
            <strong>${escapeHtml(product.title)}</strong>
            <small>${escapeHtml([product.price, product.source].filter(Boolean).join(" · "))}</small>
          </a>
        `,
      )
      .join("");
  }

  async function hydrateCard(card) {
    if (card.dataset.productsReady === "true") return;
    card.dataset.productsReady = "true";

    const query = extractQuery(card);
    if (!query) return;

    let strip = card.querySelector(".product-strip");
    if (!strip) {
      strip = document.createElement("div");
      strip.className = "product-strip";
      card.querySelector(".style-visual")?.after(strip);
    }

    strip.hidden = false;
    strip.innerHTML = "<span>جاري جلب صور المنتجات...</span>";

    const products = await fetchProducts(query);
    renderProducts(strip, products.length ? products : fallbackProducts(card));
  }

  function hydrate() {
    document.querySelectorAll(".outfit-card").forEach(hydrateCard);
  }

  const outfits = document.querySelector("#outfits");
  if (outfits) {
    new MutationObserver(hydrate).observe(outfits, {
      childList: true,
      subtree: true,
    });
  }

  hydrate();
})();
