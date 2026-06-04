(function () {
  const cache = new Map();
  const keyStorageName = "serpapi_demo_key";
  const bundledSerpApiKey = "e8a3ef578fbc1e06a76cde01799a487d2ebb21cdda7bc94ffcebb519c461fc4b";

  const catalog = [
    {
      type: "dress",
      title: "Ethereal Elegance Luxe Draped Evening Gown",
      price: "199.00 SAR",
      source: "Montania Shop",
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQWMDyge0IKbpyBNpJ6C8kzdnxTYVSxmQlg3vjJSJx6WzL2tGgIhEMpobD5AMD_c85Q5ZJaf4isZTFxHhkiHq67lIw2BlM2s5cqexil9lnlmmAcmneqosd7Eg",
    },
    {
      type: "bag",
      title: "Tyler Ellis Luxury Black Wedding Clutch Bag",
      price: "7698.30 SAR",
      source: "Tyler Ellis",
      image:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSbFJJzQ69m2iMg_vABAoBhhHeAH0DRmYSDf3lR5JcS4GTb7kFtr7O2h7pCVp8Qq3KKJ7Pd1noDQGDmuK0UiK7h3Uj0PbQJ2gg2WtsXHN8lRqrUjTGDFHbj5qg",
    },
    {
      type: "shoe",
      title: "Monaco Suede 10 cm Stiletto Women's Heeled Shoes",
      price: "1239.98 SAR",
      source: "Jabotter",
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ560JEPfjff9U_6fsOPK5mZZk0cldGUEFe1dPe63-484dLnuHcMvLsj7V9U96KvqokkTUR9n90HwmiZzTid9XV32ftFxqI_hf1QQUYJX5oTc7ew6d8JYyH1A",
    },
  ];

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

  function catalogProducts(card) {
    const links = [...card.querySelectorAll(".retail-links a")];
    const linkByType = {
      dress: links.find((link) => link.textContent.includes("Ounass"))?.href,
      bag: links.find((link) => link.textContent.includes("Bloomingdale"))?.href,
      shoe: links.find((link) => link.textContent.includes("Harrods"))?.href,
    };

    return catalog.map((product) => ({
      ...product,
      link: linkByType[product.type] || links[0]?.href || "#",
    }));
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
    if (location.hostname.includes("github.io")) return [];

    const results = await Promise.all(
      searchPlans(query).map(async (plan) => {
        const url = new URL("https://serpapi.com/search.json");
        url.searchParams.set("engine", "google_shopping");
        url.searchParams.set("q", plan.q);
        url.searchParams.set("gl", "sa");
        url.searchParams.set("hl", "ar");
        url.searchParams.set("api_key", apiKey);

        return fetchJsonWithCorsFallback(url)
          .then((data) => normalizeSerpApiProduct(data, plan.type))
          .catch(() => null);
      }),
    );

    return results.filter(Boolean);
  }

  async function fetchJsonWithCorsFallback(url) {
    const direct = await fetch(url).catch(() => null);
    if (direct?.ok) return direct.json();

    const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url.toString())}`;
    const proxied = await fetch(proxiedUrl).catch(() => null);
    if (!proxied?.ok) return null;
    return proxied.json();
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
    renderProducts(strip, products.length ? products : catalogProducts(card));
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
