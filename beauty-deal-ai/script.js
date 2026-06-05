const translations = {
  ar: {
    "nav.demo": "التجربة",
    "nav.alerts": "تنبيهات السعر",
    "nav.pricing": "الباقات",
    "nav.cta": "جرّب الآن",
    "hero.eyebrow": "مساعد شراء ذكي للميك أب",
    "hero.title": "وفّري قبل كل طلبية ميك أب.",
    "hero.text": "اكتبي اسم المنتج أو ارفعي صورته، وخلي الذكاء الاصطناعي يقارن المتاجر، يراقب هبوط السعر، ويقترح بدائل أرخص بنسبة تطابق واضحة.",
    "hero.primary": "ابدئي 10 محاولات مجانية",
    "hero.secondary": "شوفي الباقات",
    "hero.metric1": "محاولات مجانية",
    "hero.metric2": "تنبيه هبوط سعر",
    "hero.metric3": "تطابق البديل",
    "phone.search": "صوري المنتج أو اكتبي اسمه",
    "phone.cheapest": "أرخص سعر",
    "phone.alt": "بديل أرخص",
    "phone.free": "10 محاولات مجانية",
    "strip.one": "مقارنة متاجر",
    "strip.two": "بدائل أرخص",
    "strip.three": "تنبيهات Pro",
    "strip.four": "اشتراكات جاهزة",
    "demo.eyebrow": "تجربة المنتج",
    "demo.title": "اكتبي منتج وشوفي النتيجة فورًا",
    "side.search": "البحث",
    "side.saved": "المحفوظات",
    "side.alerts": "تنبيهات السعر",
    "side.billing": "الفواتير",
    "demo.label": "اسم المنتج",
    "demo.upload": "رفع صورة",
    "demo.search": "قارن الأسعار",
    "demo.attempts": "محاولات مجانية",
    "results.best": "أفضل سعر",
    "results.open": "افتح العرض",
    "results.stores": "المتاجر",
    "results.alt": "بديل أرخص",
    "results.altText": "قريب في اللون واللمعة والاستخدام اليومي.",
    "results.match": "نسبة التطابق",
    "results.pro": "Pro",
    "results.alertTitle": "راقبي السعر",
    "results.alertText": "احفظي المنتج ويوصلك تنبيه إذا نزل سعره.",
    "results.notification": "الحقّي! المنتج نزل سعره 35 بالمية",
    "pricing.eyebrow": "نموذج دخل واضح",
    "pricing.title": "جرّبي مجانًا، واشتركي لما يصير مفيد.",
    "pricing.currency": "ريال",
    "pricing.glow": "للاستخدام الخفيف",
    "pricing.glow1": "10 عمليات بحث شهريًا",
    "pricing.glow2": "بدائل أساسية",
    "pricing.glow3": "مقارنة المتاجر",
    "pricing.choose": "اختاري الباقة",
    "pricing.popular": "الأكثر مناسبة",
    "pricing.pro": "الأفضل للمشتريات المتكررة",
    "pricing.pro1": "بحث غير محدود",
    "pricing.pro2": "تنبيهات هبوط السعر",
    "pricing.pro3": "منتجات محفوظة",
    "pricing.startPro": "ابدئي Pro",
    "pricing.studio": "لصانعات المحتوى والمتاجر",
    "pricing.studio1": "قوائم حملات",
    "pricing.studio2": "تقارير ترند",
    "pricing.studio3": "متابعة منتجات بالجملة"
  },
  en: {
    "nav.demo": "Demo",
    "nav.alerts": "Price alerts",
    "nav.pricing": "Pricing",
    "nav.cta": "Try now",
    "hero.eyebrow": "AI shopping assistant for makeup",
    "hero.title": "Save money before every makeup order.",
    "hero.text": "Type a product name or upload a photo. Beauty Deal AI compares stores, watches price drops, and suggests cheaper alternatives with a clear match score.",
    "hero.primary": "Start 10 free attempts",
    "hero.secondary": "View plans",
    "hero.metric1": "free attempts",
    "hero.metric2": "price drop alert",
    "hero.metric3": "alternative match",
    "phone.search": "Take a photo or type the product",
    "phone.cheapest": "Cheapest price",
    "phone.alt": "Cheaper alternative",
    "phone.free": "10 free attempts",
    "strip.one": "Store comparison",
    "strip.two": "Cheaper alternatives",
    "strip.three": "Pro alerts",
    "strip.four": "Ready subscriptions",
    "demo.eyebrow": "Product demo",
    "demo.title": "Type a product and see the result instantly",
    "side.search": "Search",
    "side.saved": "Saved",
    "side.alerts": "Price alerts",
    "side.billing": "Billing",
    "demo.label": "Product name",
    "demo.upload": "Upload photo",
    "demo.search": "Compare prices",
    "demo.attempts": "free attempts",
    "results.best": "Best price",
    "results.open": "Open deal",
    "results.stores": "Stores",
    "results.alt": "Cheaper alternative",
    "results.altText": "Similar shade, finish, and everyday use.",
    "results.match": "match score",
    "results.pro": "Pro",
    "results.alertTitle": "Watch the price",
    "results.alertText": "Save the product and get notified when the price drops.",
    "results.notification": "Heads up! The product dropped by 35 percent",
    "pricing.eyebrow": "Clear revenue model",
    "pricing.title": "Free to try. Paid when it becomes useful.",
    "pricing.currency": "SAR",
    "pricing.glow": "For light shoppers",
    "pricing.glow1": "10 searches per month",
    "pricing.glow2": "Basic alternatives",
    "pricing.glow3": "Store comparison",
    "pricing.choose": "Choose plan",
    "pricing.popular": "Best fit",
    "pricing.pro": "Best for regular buyers",
    "pricing.pro1": "Unlimited searches",
    "pricing.pro2": "Price drop alerts",
    "pricing.pro3": "Saved products",
    "pricing.startPro": "Start Pro",
    "pricing.studio": "For creators and stores",
    "pricing.studio1": "Campaign lists",
    "pricing.studio2": "Trend reports",
    "pricing.studio3": "Bulk product watch"
  }
};

const products = [
  { keyword: "dior", price: "89 SAR", store: "Nice One", alt: "Maybelline Lifter Gloss", match: "86%", stores: [["Nice One", "89 SAR"], ["Sephora", "112 SAR"], ["Faces", "119 SAR"]] },
  { keyword: "palette", price: "188 SAR", store: "Boutiqaat", alt: "Revolution Reloaded Palette", match: "82%", stores: [["Boutiqaat", "188 SAR"], ["Sephora", "249 SAR"], ["Faces", "289 SAR"]] },
  { keyword: "foundation", price: "74 SAR", store: "Golden Scent", alt: "L'Oreal True Match", match: "88%", stores: [["Golden Scent", "74 SAR"], ["Nice One", "81 SAR"], ["Amazon", "96 SAR"]] }
];

let currentLang = "ar";
let attempts = 7;

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.dataset.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (translations[lang][key]) node.textContent = translations[lang][key];
  });
  document.querySelectorAll("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === lang));
  document.querySelector("#productInput").value = lang === "ar" ? "Dior Lip Glow وردي" : "Dior Lip Glow pink";
}

function renderStores(stores) {
  const list = document.querySelector("#storesList");
  list.innerHTML = "";
  stores.forEach(([name, price]) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${name}</span><strong>${price}</strong>`;
    list.appendChild(item);
  });
}

function runSearch() {
  const query = document.querySelector("#productInput").value.toLowerCase();
  const product = products.find((item) => query.includes(item.keyword)) || products[0];
  attempts = Math.max(0, attempts - 1);
  document.querySelector("#attemptCount").textContent = attempts;
  document.querySelector("#bestPrice").textContent = product.price;
  document.querySelector("#bestStore").textContent = product.store;
  document.querySelector("#altName").textContent = product.alt;
  document.querySelector("#matchScore").textContent = product.match;
  renderStores(product.stores);
  document.querySelectorAll(".deal-card").forEach((card) => {
    card.animate([{ transform: "translateY(10px)", opacity: 0.55 }, { transform: "translateY(0)", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" });
  });
}

document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => setLang(button.dataset.lang)));
document.querySelector("#searchBtn").addEventListener("click", runSearch);
document.querySelector("#productInput").addEventListener("keydown", (event) => { if (event.key === "Enter") runSearch(); });
document.querySelector("#uploadBtn").addEventListener("click", () => {
  document.querySelector("#productInput").value = currentLang === "ar" ? "باليت آيشادو" : "Eyeshadow palette";
  runSearch();
});
document.querySelectorAll(".side-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".side-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

renderStores(products[0].stores);
setLang("ar");
