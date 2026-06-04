const form = document.querySelector("#plannerForm");
const outfitsEl = document.querySelector("#outfits");
const copyAllButton = document.querySelector("#copyAll");

const styleProfiles = {
  soft: {
    label: "ناعم وفخم",
    colors: ["أسود", "أوف وايت", "وردي باهت", "ذهبي خفيف"],
    texture: "قماش ناعم مع لمعة بسيطة",
    makeup: "مكياج ناعم بدرجات وردية وإضاءة خفيفة",
  },
  practical: {
    label: "عملي ومرتب",
    colors: ["كحلي", "أبيض", "رمادي", "زيتي"],
    texture: "قصة مريحة وخامة سهلة الحركة",
    makeup: "مكياج يومي مرتب وحواجب طبيعية",
  },
  bold: {
    label: "جريء وأنيق",
    colors: ["عنابي", "أسود", "فضي", "أخضر زمردي"],
    texture: "قطعة بارزة مع تفاصيل معدنية",
    makeup: "آيلاينر واضح وروج أغمق بدرجة أنيقة",
  },
  modest: {
    label: "محتشم وراقي",
    colors: ["بيج", "بني هادئ", "أخضر فاتح", "أسود"],
    texture: "طبقات مرتبة وقصة واسعة",
    makeup: "مكياج هادئ وبشرة مضيئة",
  },
};

const budgetProfiles = {
  low: {
    label: "اقتصادية",
    shopping: "استخدمي أغلب القطع الموجودة واشتري قطعة واحدة فقط تكمل اللوك",
    accessory: "إكسسوار بسيط يرفع الشكل بدون تكلفة عالية",
  },
  medium: {
    label: "متوسطة",
    shopping: "اخلطي قطعة أساسية من دولابك مع قطعة جديدة بجودة جيدة",
    accessory: "شنطة أو حذاء بدرجة محايدة يخدمك أكثر من مرة",
  },
  high: {
    label: "فخمة",
    shopping: "اختاري قطعة أساسية بجودة عالية وخلي باقي التنسيق هادئ",
    accessory: "إكسسوار معدني أو شنطة صغيرة تعطي اللوك قيمة أعلى",
  },
};

const retailers = [
  {
    name: "Ounass",
    hint: "فساتين وشنط وماركات فخمة",
    url: (query) => `https://en-saudi.ounass.com/search?q=${encodeURIComponent(query)}`,
  },
  {
    name: "Bloomingdale's",
    hint: "بدائل راقية وإكسسوارات",
    url: (query) => `https://www.bloomingdales.ae/search?q=${encodeURIComponent(query)}`,
  },
  {
    name: "Harrods",
    hint: "اختيارات فاخرة عالمية",
    url: (query) => `https://www.harrods.com/en-sa/search?q=${encodeURIComponent(query)}`,
  },
];

const occasionRules = [
  {
    match: ["زواج", "ملكة", "خطوبة", "عرس"],
    base: "فستان ميدي أو طويل بقصة مرتبة",
    hair: "ويفي ناعم أو كعكة منخفضة",
    note: "خلي اللمعة في قطعة واحدة فقط عشان اللوك يبقى راقي",
  },
  {
    match: ["جامعة", "دوام", "عمل", "مقابلة"],
    base: "بنطال واسع أو تنورة مريحة مع بلوزة مرتبة",
    hair: "شعر مرتب أو ذيل حصان منخفض",
    note: "اختاري حذاء مريح لأن اليوم غالبًا طويل",
  },
  {
    match: ["سفر", "مطار", "رحلة"],
    base: "طقم مريح بطبقات خفيفة",
    hair: "تسريحة بسيطة ما تتعب مع الحركة",
    note: "خلي الشنطة عملية وفيها مساحة للجوال والجواز",
  },
  {
    match: ["كافيه", "مطعم", "عزيمة", "طلعة"],
    base: "قطعة علوية مميزة مع جينز أو تنورة هادئة",
    hair: "ويفي سريع أو شعر مفرود",
    note: "اللوك يكون جميل بالتصوير ومريح في نفس الوقت",
  },
  {
    match: ["عيد", "تخرج", "مناسبة"],
    base: "طقم أنثوي مرتب مع لون واضح",
    hair: "تسريحة فيها حجم خفيف",
    note: "اختاري لون يطلع حلو في الصور والإضاءة",
  },
];

function findOccasionRule(occasion) {
  const normalized = occasion.trim();
  return (
    occasionRules.find((rule) => rule.match.some((word) => normalized.includes(word))) ||
    occasionRules[occasionRules.length - 1]
  );
}

function pick(arr, index) {
  return arr[index % arr.length];
}

function shoppingQuery(occasion, profile, color) {
  const base = occasion.base.includes("فستان") ? "evening dress" : occasion.base.includes("طقم") ? "co ord set" : "women outfit";
  const colorMap = {
    "أسود": "black",
    "أوف وايت": "white",
    "وردي باهت": "pink",
    "ذهبي خفيف": "gold",
    "كحلي": "navy",
    "أبيض": "white",
    "رمادي": "grey",
    "زيتي": "olive",
    "عنابي": "burgundy",
    "فضي": "silver",
    "أخضر زمردي": "green",
    "بيج": "beige",
    "بني هادئ": "brown",
    "أخضر فاتح": "green",
  };
  const styleWord = profile.label.includes("محتشم") ? "modest" : profile.label.includes("فخم") ? "luxury" : "";
  return [colorMap[color] || "", styleWord, base].filter(Boolean).join(" ");
}

const visualThemes = {
  "أسود": ["#171118", "#4f3d49", "#d8d0d8", "#c9a24b"],
  "أوف وايت": ["#f8f3ea", "#d7c9b2", "#b8a890", "#c9a24b"],
  "وردي باهت": ["#f4bfd3", "#e1a0bb", "#f8d8e5", "#b76b8a"],
  "ذهبي خفيف": ["#f4dc9a", "#c9a24b", "#fff3ca", "#8a6a25"],
  "كحلي": ["#173350", "#315b7c", "#cfd9e4", "#6f879b"],
  "أبيض": ["#ffffff", "#e5e9ef", "#cfd9e4", "#8d9aaa"],
  "رمادي": ["#aeb6c1", "#6e7887", "#e7ebef", "#4f5965"],
  "زيتي": ["#5f6f44", "#87956b", "#d9dec8", "#3f4c32"],
  "عنابي": ["#641434", "#9a3158", "#f3c6d8", "#4a0f26"],
  "فضي": ["#d9dde5", "#a6afbd", "#f6f8fb", "#687386"],
  "أخضر زمردي": ["#0f6b58", "#2a9b81", "#d8f2ea", "#06483b"],
  "بيج": ["#d7c1a5", "#aa8e6c", "#f8efe4", "#7c6040"],
  "بني هادئ": ["#7a543c", "#b18a6a", "#f0ddd0", "#533624"],
  "أخضر فاتح": ["#b8d8bf", "#79aa83", "#eff8f1", "#3e7048"],
};

function visualStyle(color, occasion, profile) {
  const [main, accent, soft, deep] = visualThemes[color] || visualThemes["أسود"];
  const height = occasion.base.includes("فستان") ? "128px" : profile.label.includes("عملي") ? "108px" : "118px";
  return `--main:${main};--accent:${accent};--soft:${soft};--deep:${deep};--garment-height:${height};`;
}

function createOutfits(data) {
  const profile = styleProfiles[data.style];
  const budget = budgetProfiles[data.budget];
  const occasion = findOccasionRule(data.occasion);
  const items = data.items
    .split(/[،,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const cityHint = data.city ? `مناسب لـ ${data.city}` : "مناسب للمدينة المختارة";

  return [0, 1, 2].map((index) => {
    const color = pick(profile.colors, index);
    const ownedItem = items[index] || items[0] || "قطعة أساسية من دولابك";
    const shoe = index === 0 ? "حذاء بلون محايد" : index === 1 ? "هيل ناعم أو باليرينا" : "حذاء بلون معدني خفيف";
    const bag = index === 0 ? "شنطة صغيرة" : index === 1 ? "شنطة كتف عملية" : "كلتش مرتب";
    const shopQuery = shoppingQuery(occasion, profile, color);
    return {
      title: ["لوك ناعم", "لوك عملي", "لوك ملفت"][index],
      visual: ["visual-soft", "visual-practical", "visual-bold"][index],
      visualStyle: visualStyle(color, occasion, profile),
      badge: cityHint,
      description: `${occasion.base} بدرجة ${color} مع ${ownedItem}. الخامة المقترحة: ${profile.texture}.`,
      details: [
        `الحذاء: ${shoe}`,
        `الشنطة: ${bag}`,
        `المكياج: ${profile.makeup}`,
        `الشعر: ${occasion.hair}`,
        `الميزانية: ${budget.shopping}`,
      ],
      tip: `${budget.accessory}. ${occasion.note}.`,
      shopQuery,
    };
  });
}

function renderOutfits(outfits) {
  outfitsEl.innerHTML = outfits
    .map(
      (outfit) => `
        <article class="outfit-card">
          <div class="style-visual ${outfit.visual}" style="${outfit.visualStyle}" aria-hidden="true">
            <div class="look-piece dress"></div>
            <div class="look-piece shoe"></div>
            <div class="look-piece bag"></div>
            <div class="look-piece palette"></div>
          </div>
          <div class="outfit-top">
            <h3>${outfit.title}</h3>
            <span class="badge">${outfit.badge}</span>
          </div>
          <p>${outfit.description}</p>
          <div class="chips">
            ${outfit.details.map((detail) => `<span>${detail}</span>`).join("")}
          </div>
          <p>${outfit.tip}</p>
          <div class="retail-block">
            <h4>تسوقي اللوك</h4>
            <div class="retail-links">
              ${retailers
                .map(
                  (retailer) => `
                    <a href="${retailer.url(outfit.shopQuery)}" target="_blank" rel="noreferrer">
                      <strong>${retailer.name}</strong>
                      <span>${retailer.hint}</span>
                    </a>
                  `,
                )
                .join("")}
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function getData() {
  const formData = new FormData(form);
  return {
    occasion: formData.get("occasion") || "مناسبة",
    city: formData.get("city") || "",
    style: formData.get("style") || "soft",
    budget: formData.get("budget") || "medium",
    items: formData.get("items") || "",
  };
}

function resultText() {
  const data = getData();
  const outfits = createOutfits(data);
  return [
    `ستايلستك الذكي - ${data.occasion} في ${data.city}`,
    `الستايل: ${styleProfiles[data.style].label}`,
    `الميزانية: ${budgetProfiles[data.budget].label}`,
    "",
    ...outfits.flatMap((outfit, index) => [
      `${index + 1}. ${outfit.title}`,
      outfit.description,
      ...outfit.details,
      outfit.tip,
      "روابط بحث:",
      ...retailers.map((retailer) => `${retailer.name}: ${retailer.url(outfit.shopQuery)}`),
      "",
    ]),
    "بواسطة فهد العساف @Alassafme",
  ].join("\n");
}

function update() {
  renderOutfits(createOutfits(getData()));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

copyAllButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(resultText());
  copyAllButton.textContent = "تم النسخ";
  setTimeout(() => {
    copyAllButton.textContent = "نسخ النتيجة";
  }, 1400);
});

update();
