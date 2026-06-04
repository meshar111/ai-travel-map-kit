(function () {
  const cache = new Map();

  function productLabel(type) {
    return {
      dress: "الفستان",
      bag: "الشنطة",
      shoe: "الحذاء",
      outfit: "القطعة",
    }[type] || "القطعة";
  }

  function extractQuery(card) {
    const ounassLink = [...card.querySelectorAll(".retail-links a")].find((link) =>
      link.textContent.includes("Ounass"),
    );
    if (!ounassLink) return "";
    return new URL(ounassLink.href).searchParams.get("q") || "";
  }

  async function fetchProducts(query) {
    if (!query) return [];
    if (cache.has(query)) return cache.get(query);

    const request = fetch(`/api/products?q=${encodeURIComponent(query)}`)
      .then((response) => (response.ok ? response.json() : { products: [] }))
      .then((data) => (Array.isArray(data.products) ? data.products : []))
      .catch(() => []);

    cache.set(query, request);
    return request;
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
          <a class="product-card" href="${product.link}" target="_blank" rel="noreferrer">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
            <span>${productLabel(product.type)}</span>
            <strong>${product.title}</strong>
            <small>${[product.price, product.source].filter(Boolean).join(" · ")}</small>
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
      strip.innerHTML = "<span>جاري جلب صور منتجات حقيقية...</span>";
      card.querySelector(".style-visual")?.after(strip);
    }

    renderProducts(strip, await fetchProducts(query));
  }

  function hydrate() {
    document.querySelectorAll(".outfit-card").forEach(hydrateCard);
  }

  new MutationObserver(hydrate).observe(document.querySelector("#outfits"), {
    childList: true,
    subtree: true,
  });
  hydrate();
})();
