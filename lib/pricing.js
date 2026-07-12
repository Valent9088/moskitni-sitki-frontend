// ============================================================
// PRICING DATA — moskitni_sitki
// Всі ціни вже включають націнку дилера +50% (як вказано у ТЗ)
// ============================================================

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
        canvases: { standard: 0, premiumBlack: 100 },
        handles: { plastic: 0, metal: 90 },
      },
      premium: {
        name: "Преміум",
        colors: { white: 1050, anthracite: 1050, goldenOak: 1050, walnut: 1050 },
        canvases: {
          standard: 0,
          antiCat: 1500,
          antiAllergen: 1200,
          aluminum: 900,
          invisible: 600,
        },
        handles: { plastic: 0, metal: 90 },
      },
      elite: {
        name: "Еліт",
        colorGroups: {
          group1: {
            colors: [
              "white",
              "brown",
              "darkBrown",
              "anthracite",
              "goldenOak",
              "walnut",
              "winchester",
              "mahogany",
            ],
            price: 1200,
          },
          group2: {
            colors: ["black", "silver", "gray", "graphite"],
            price: 1350,
          },
        },
        canvases: {
          standard: 0,
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
    note: "Полотно завжди преміум чорне і входить у вартість",
    types: {
      normal: {
        name: "Звичайна (без нижньої планки)",
        colors: { white: 4500, brown: 4900, anthracite: 5200, goldenOakWalnut: 5550 },
      },
      hook: {
        name: "Гакова (мансардне вікно)",
        colors: { white: 4900, brown: 5200, anthracite: 5550, goldenOakWalnut: 6000 },
      },
    },
    brakeMechanism: { price: 800, minWidthM: 0.5 },
  },

  aluminumElite: {
    key: "aluminumElite",
    name: "Для алюмінієвих вікон Еліт",
    sMin: 0.7,
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
      },
      exclusive: {
        name: "Ексклюзив",
        colors: { white: 1700, brown: 1750, anthracite: 1900 },
        note: "Базова комплектація: магніти, 3 пластикові завіси, ручки",
        canvases: { standard: 0, premiumBlack: 100 },
        extras: { metalAutoHinges: 400 }, // за 2 шт
      },
      premium: {
        name: "Преміум",
        colors: { white: 3300, lightBrown: 3450, brown: 3450, anthracite: 3800 },
        note: "Базова комплектація: магніти, 3 пластикові завіси, ручки",
        canvases: { standard: 0, antiCat: 1500, antiAllergen: 1200, aluminum: 900, invisible: 600 },
      },
      eliteRegular: {
        name: "Еліт (звичайні двері)",
        colors: { anthracite: 5050, goldenOakWalnut: 5800 },
      },
      eliteUShape: {
        name: "Еліт (з П-подібною рамою)",
        colors: { anthracite: 8400, goldenOakWalnut: 9300 },
      },
      eliteFullFrame: {
        name: "Еліт (із суцільною рамою)",
        colors: { anthracite: 9300, goldenOakWalnut: 9900 },
      },
    },
  },

  doorPliseElite: {
    key: "doorPliseElite",
    name: "Плісе Еліт (двері)",
    sMin: 1.5,
    colors: { white: 6800, brown: 7050, anthracite: 7100, black: 7300 },
  },

  doorPliseStandard: {
    key: "doorPliseStandard",
    name: "Плісе Стандарт (вікна/двері)",
    sMin: 0.9,
    colors: { white: 4450, brown: 4600, anthracite: 4750 },
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
  standard: "Стандартне (сіре/чорне)",
  premiumBlack: "Преміум чорне",
  antiCat: "Антикішка",
  antiAllergen: "Антиалергенна",
  aluminum: "Алюмінієва",
  invisible: "Невидимка",
};

// Mounting (монтаж) prices
export const MOUNTING = {
  window: 100, // за шт
  doorOrPlise: 700, // за шт
};

/**
 * Обчислює площу в м2 за шириною/висотою в мм, застосовуючи Smin.
 */
export function computeArea(widthMm, heightMm, sMin) {
  const wM = (Number(widthMm) || 0) / 1000;
  const hM = (Number(heightMm) || 0) / 1000;
  const rawArea = wM * hM;
  const area = rawArea > 0 ? Math.max(rawArea, sMin) : 0;
  return { rawArea, area, widthM: wM, heightM: hM, sMinApplied: rawArea > 0 && rawArea < sMin };
}

/**
 * Головна функція розрахунку ціни замовлення.
 * selection – об'єкт, що описує вибір користувача на кожному кроці калькулятора.
 * Повертає { breakdown: [...], total, area, sMinApplied }
 */
export function calculatePrice(selection) {
  const {
    categoryKey,
    modelKey, // для windowFrame / doorFrame
    typeKey, // для windowRoller (normal/hook)
    colorKey,
    canvasKey,
    handleKey, // plastic/metal
    widthMm,
    heightMm,
    mounted, // boolean
    metalHinges, // boolean, doorFrame.exclusive only
    brakeMechanism, // boolean, windowRoller only
    impostHeightCm, // doorFrame optional
  } = selection;

  const category = CATEGORIES[categoryKey];
  if (!category) return null;

  const breakdown = [];
  let pricePerM2 = 0;
  let isDoorLike = ["doorFrame", "doorPliseElite", "doorPliseStandard"].includes(categoryKey);

  if (categoryKey === "windowFrame" || categoryKey === "doorFrame") {
    const model = category.models[modelKey];
    if (!model) return null;

    if (model.colorGroups) {
      // Еліт з групами кольорів
      let groupPrice = null;
      for (const g of Object.values(model.colorGroups)) {
        if (g.colors.includes(colorKey)) groupPrice = g.price;
      }
      pricePerM2 = groupPrice || 0;
    } else {
      pricePerM2 = model.colors[colorKey] || 0;
    }
    breakdown.push({
      label: `${category.name} — ${model.name} — ${COLOR_LABELS[colorKey] || colorKey}`,
      pricePerM2,
    });

    if (model.canvases && canvasKey) {
      const addon = model.canvases[canvasKey] || 0;
      if (addon > 0) {
        pricePerM2 += addon;
        breakdown.push({ label: `Полотно: ${CANVAS_LABELS[canvasKey] || canvasKey}`, pricePerM2: addon });
      }
    }
  } else if (categoryKey === "windowRoller") {
    const type = category.types[typeKey];
    if (!type) return null;
    pricePerM2 = type.colors[colorKey] || 0;
    breakdown.push({
      label: `${category.name} — ${type.name} — ${COLOR_LABELS[colorKey] || colorKey}`,
      pricePerM2,
    });
  } else if (categoryKey === "aluminumElite" || categoryKey === "doorPliseElite" || categoryKey === "doorPliseStandard") {
    pricePerM2 = category.colors[colorKey] || 0;
    breakdown.push({
      label: `${category.name} — ${COLOR_LABELS[colorKey] || colorKey}`,
      pricePerM2,
    });
  }

  const { area, rawArea, sMinApplied } = computeArea(widthMm, heightMm, category.sMin);
  let total = pricePerM2 * area;

  const fixedAddons = [];

  // Ручки (window/door frame)
  if ((categoryKey === "windowFrame") && handleKey) {
    const model = category.models[modelKey];
    const handlePrice = model.handles ? model.handles[handleKey] || 0 : 0;
    if (handlePrice > 0) fixedAddons.push({ label: `Ручки: ${handleKey === "metal" ? "Метал" : "Пластик"}`, price: handlePrice });
  }

  // Металеві завіси з автодотягуванням (doorFrame.exclusive)
  if (categoryKey === "doorFrame" && modelKey === "exclusive" && metalHinges) {
    fixedAddons.push({ label: "Металеві завіси з автодотягуванням (2 шт)", price: category.models.exclusive.extras.metalAutoHinges });
  }

  // Гальмівний механізм (windowRoller), лише якщо ширина >= 0.5 м
  if (categoryKey === "windowRoller" && brakeMechanism) {
    const widthM = (Number(widthMm) || 0) / 1000;
    if (widthM >= category.brakeMechanism.minWidthM) {
      fixedAddons.push({ label: "Гальмівний механізм", price: category.brakeMechanism.price });
    }
  }

  // Монтаж
  if (mounted) {
    const mountPrice = isDoorLike ? MOUNTING.doorOrPlise : MOUNTING.window;
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
    impostHeightCm: impostHeightCm || null,
  };
}
