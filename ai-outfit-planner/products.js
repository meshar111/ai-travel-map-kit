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

  function fallbackProducts(card) {
    const links = [...card.querySelectorAll(".retail-links a")];
    const ounass = links.find((link) => link.textContent.includes("Ounass"))?.href || "#";
    const bloomingdales = links.find((link) => link.textContent.includes("Bloomingdale"))?.href || ounass;
    const harrods = links.find((link) => link.textContent.includes("Harrods"))?.href || ounass;

    return [
      { type: "dress", title: "اختيارات فساتين مشابهة", source: "Ounass", link: ounass },
      { type: "bag", title: "شنط تناسب اللوك", source: "Bloomingdale's", link: bloomingdales },
      { type: "shoe", title: "أحذية وإكسسوارات", source: "Harrods", link: harrods },
    ];
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
            ${
              product.image
                ? `<img src="${product.image}" alt="${product.title}" loading="lazy" />`
                : `<div class="product-fallback-art product-${product.type}" aria-hidden="true"></div>`
            }
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

    const products = await fetchProducts(query);
    renderProducts(strip, products.length ? products : fallbackProducts(card));
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
