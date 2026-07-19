export const CATEGORIES = {
  windowFrame: {
    key: "windowFrame",
    name: "Віконна рамкова",
    sMin: 0.7,
    models: {
      standard: {
        name: "Стандарт",
        colors: { white: 780, brown: 800, anthracite: 880 },
        canvases: { standard: 0 },
        handles: { plastic: 0, metal: 90 },
      },
      exclusive: {
        name: "Ексклюзив",
        colors: { white: 899.85, brown: 899.85, anthracite: 899.85 },
        canvases: { standard: 0, black: 100 },
        handles: { plastic: 0, metal: 90 },
      },
      premium: {
        name: "Преміум",
        colors: { white: 1050, anthracite: 1050, goldenOak: 1050, walnut: 1050 },
        canvases: {
          black: 0, // Тільки чорне за замовчуванням (сірого немає)
          antiCat: 1500,
          antiAllergen: 1200,
          aluminum: 900,
          invisible: 600,
        },
        handles: { plastic: 0, metal: 90 },
      },
      elite: {
        name: "Еліт",
        colors: { white: 1200, brown: 1200, anthracite: 1200, goldenOak: 1200, walnut: 1200 },
        canvases: {
          black: 0, // Тільки чорне за замовчуванням
          antiCat: 1500,
          antiAllergen: 1200,
          aluminum: 900,
          invisible: 600,
        },
        handles: { plastic: 0, metal: 90 },
      },
    },
  },

  windowRoller: {
    key: "windowRoller",
    name: "Віконна ролетна (профіль Еліт)",
    sMin: 0.75,
    canvases: { black: 0 },
    types: {
      normal: {
        name: "Звичайна",
        colors: { white: 4500, brown: 4900, anthracite: 5200, goldenOak: 5550, walnut: 5550 },
      },
      hook: {
        name: "Гакова (мансардне вікно)",
        colors: { white: 4900, brown: 5200, anthracite: 5550, goldenOak: 6000, walnut: 6000 },
      },
    },
    brakeMechanism: { price: 800, minWidthM: 0.5 },
  },

  aluminumElite: {
    key: "aluminumElite",
    name: "Для алюмінієвих вікон Еліт",
    sMin: 0.7,
    canvases: { black: 0 },
    colors: { white: 2400, brown: 2500, anthracite: 2700, black: 2900 },
  },

  doorFrame: {
    key: "doorFrame",
    name: "Дверна рамкова",
    sMin: 1.2,
    hasImpost: true,
    models: {
      standard: {
        name: "Стандарт",
        colors: { white: 1100, brown: 1160 },
        canvases: { standard: 0 },
        extras: { metalAutoHinges: 400 }, // Додано для Стандарту
      },
      exclusive: {
        name: "Ексклюзив",
        colors: { white: 1700, brown: 1750, anthracite: 1900 },
        canvases: { standard: 0, black: 100 },
        extras: { metalAutoHinges: 400 }, 
      },
      premium: {
        name: "Преміум",
        colors: { white: 3300, lightBrown: 3450, brown: 3450, anthracite: 3800 },
        canvases: { standard: 0, black: 0, antiCat: 1500, antiAllergen: 1200, aluminum: 900, invisible: 600 },
      },
      eliteRegular: {
        name: "Еліт",
        colors: { anthracite: 5050, goldenOakWalnut: 5800 },
        canvases: { standard: 0, black: 0, antiCat: 1500, antiAllergen: 1200, aluminum: 900, invisible: 600 },
      },
    },
  },

  doorPliseElite: {
    key: "doorPliseElite",
    name: "Плісе Еліт (двері)",
    sMin: 1.5,
    canvases: { black: 0 },
    colors: { white: 6800, brown: 7050, anthracite: 7100, black: 7300 },
  },

  doorPliseStandard: {
    key: "doorPliseStandard",
    name: "Плісе Стандарт (вікна/двері)",
    sMin: 0.9,
    canvases: { black: 0 },
    colors: { white: 4450, brown: 4600 },
  },
};

export const COLOR_LABELS = {
  white: "Білий",
  brown: "Коричневий",
  lightBrown: "Світло-коричневий",
  anthracite: "Антрацит",
  darkBrown: "Темно-коричневий",
  goldenOak: "Золотий дуб",
  walnut: "Горіх",
  winchester: "Вінчестер",
  mahogany: "Махонь",
  black: "Чорний",
  silver: "Срібний",
  gray: "Сірий",
  graphite: "Графіт",
  goldenOakWalnut: "Золотий дуб / Горіх",
};

export const CANVAS_LABELS = {
  standard: "Сіре полотно",
  black: "Чорне полотно",
  antiCat: "Антикішка",
  antiAllergen: "Антиалергенна",
  aluminum: "Алюмінієва",
  invisible: "Невидимка",
};

export const MOUNTING = {
  window: 100, 
  windowRoller: 700, 
  doorOrPlise: 700, 
};

export function computeArea(widthMm, heightMm, sMin) {
  const wM = (Number(widthMm) || 0) / 1000;
  const hM = (Number(heightMm) || 0) / 1000;
  const rawArea = wM * hM;
  const area = rawArea > 0 ? Math.max(rawArea, sMin) : 0;
  return { rawArea, area, widthM: wM, heightM: hM, sMinApplied: rawArea > 0 && rawArea < sMin };
}

export function calculatePrice(selection) {
  const { categoryKey, modelKey, typeKey, colorKey, canvasKey, handleKey, widthMm, heightMm, mounted, metalHinges, brakeMechanism, impostHeightMm } = selection;

  const category = CATEGORIES[categoryKey];
  if (!category) return null;

  const breakdown = [];
  let pricePerM2 = 0;

  if (categoryKey === "windowFrame" || categoryKey === "doorFrame") {
    const model = category.models[modelKey];
    if (!model) return null;
    pricePerM2 = model.colors[colorKey] || 0;
    breakdown.push({ label: `${category.name} — ${model.name} — ${COLOR_LABELS[colorKey] || colorKey}`, pricePerM2 });

    if (model.canvases && canvasKey) {
      const addon = model.canvases[canvasKey] || 0;
      if (addon > 0) {
        pricePerM2 += addon;
        breakdown.push({ label: `Полотно: ${CANVAS_LABELS[canvasKey] || canvasKey}`, pricePerM2: addon });
      }
    }
  } else {
    if (categoryKey === "windowRoller") {
      const type = category.types[typeKey];
      if (!type) return null;
      pricePerM2 = type.colors[colorKey] || 0;
      breakdown.push({ label: `${category.name} — ${type.name} — ${COLOR_LABELS[colorKey] || colorKey}`, pricePerM2 });
    } else {
      pricePerM2 = category.colors[colorKey] || 0;
      breakdown.push({ label: `${category.name} — ${COLOR_LABELS[colorKey] || colorKey}`, pricePerM2 });
    }
  }

  const { area, rawArea, sMinApplied } = computeArea(widthMm, heightMm, category.sMin);
  let total = pricePerM2 * area;

  const fixedAddons = [];

  if (categoryKey === "windowFrame" && handleKey) {
    const model = category.models[modelKey];
    const handlePrice = model.handles ? model.handles[handleKey] || 0 : 0;
    if (handlePrice > 0) fixedAddons.push({ label: `Ручки: ${handleKey === "metal" ? "Метал" : "Пластик"}`, price: handlePrice });
  }

  // Обробка завіс для дверей
  if (categoryKey === "doorFrame" && metalHinges) {
    if (modelKey === "standard" || modelKey === "exclusive") {
      const hingePrice = category.models[modelKey].extras?.metalAutoHinges || 400;
      fixedAddons.push({ label: "Металеві завіси з автодотягуванням (2 шт)", price: hingePrice });
    }
    // Для преміум/еліт ціна завіс вже врахована в квадратному метрі, тому ми не додаємо суму
  }

  if (categoryKey === "windowRoller" && brakeMechanism) {
    const widthM = (Number(widthMm) || 0) / 1000;
    if (widthM >= category.brakeMechanism.minWidthM) {
      fixedAddons.push({ label: "Гальмівний механізм", price: category.brakeMechanism.price });
    }
  }

  if (mounted) {
    let mountPrice = MOUNTING.window;
    if (categoryKey === "windowRoller") mountPrice = MOUNTING.windowRoller; 
    else if (["doorFrame", "doorPliseElite", "doorPliseStandard"].includes(categoryKey)) mountPrice = MOUNTING.doorOrPlise; 
    fixedAddons.push({ label: "Монтаж", price: mountPrice });
  }

  const fixedTotal = fixedAddons.reduce((s, a) => s + a.price, 0);
  total += fixedTotal;

  return {
    breakdown,
    fixedAddons,
    pricePerM2,
    rawArea: Number(rawArea.toFixed(3)),
    area: Number(area.toFixed(3)),
    sMinApplied,
    sMin: category.sMin,
    total: Math.round(total),
    impostHeightMm: impostHeightMm || null,
  };
}

export function describeSelection(selection) {
  const category = CATEGORIES[selection.categoryKey];
  if (!category) return "";
  const parts = [category.name];

  if (selection.modelKey && category.models) parts.push(category.models[selection.modelKey]?.name || selection.modelKey);
  if (selection.typeKey && category.types) parts.push(category.types[selection.typeKey]?.name || selection.typeKey);
  if (selection.colorKey) parts.push(COLOR_LABELS[selection.colorKey] || selection.colorKey);
  if (selection.canvasKey) parts.push(CANVAS_LABELS[selection.canvasKey] || selection.canvasKey);
  parts.push(`${selection.widthMm}×${selection.heightMm} мм`);
  return parts.join(" — ");
}