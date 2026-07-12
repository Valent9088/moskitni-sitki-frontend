import { useMemo, useState } from "react";
import {
  CATEGORIES,
  COLOR_LABELS,
  CANVAS_LABELS,
  calculatePrice,
} from "../lib/pricing";

const CATEGORY_OPTIONS = [
  { key: "windowFrame", label: "Віконна рамкова" },
  { key: "windowRoller", label: "Віконна ролетна" },
  { key: "aluminumElite", label: "Для алюмінієвих вікон (Еліт)" },
  { key: "doorFrame", label: "Дверна рамкова" },
  { key: "doorPliseElite", label: "Дверна Плісе Еліт" },
  { key: "doorPliseStandard", label: "Дверна/Віконна Плісе Стандарт" },
];

const isDoorLike = (k) => ["doorFrame", "doorPliseElite", "doorPliseStandard"].includes(k);

function StepButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition ${
        active
          ? "bg-anthracite text-white border-anthracite"
          : "bg-white text-anthracite border-gray-300 hover:border-anthracite"
      }`}
    >
      {children}
    </button>
  );
}

export default function Calculator() {
  const [categoryKey, setCategoryKey] = useState("windowFrame");
  const [modelKey, setModelKey] = useState("standard");
  const [typeKey, setTypeKey] = useState("normal");
  const [colorKey, setColorKey] = useState("white");
  const [canvasKey, setCanvasKey] = useState("standard");
  const [handleKey, setHandleKey] = useState("plastic");
  const [metalHinges, setMetalHinges] = useState(false);
  const [brakeMechanism, setBrakeMechanism] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [widthMm, setWidthMm] = useState("");
  const [heightMm, setHeightMm] = useState("");
  const [impostHeightCm, setImpostHeightCm] = useState("");

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    fullName: "",
    phone: "",
    messenger: "viber",
    contactLink: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const category = CATEGORIES[categoryKey];

  // Доступні кольори для поточного вибору
  const availableColors = useMemo(() => {
    if (categoryKey === "windowFrame" || categoryKey === "doorFrame") {
      const model = category.models[modelKey];
      if (!model) return [];
      if (model.colorGroups) {
        return Object.values(model.colorGroups).flatMap((g) => g.colors);
      }
      return Object.keys(model.colors);
    }
    if (categoryKey === "windowRoller") {
      return Object.keys(category.types[typeKey]?.colors || {});
    }
    return Object.keys(category.colors || {});
  }, [categoryKey, modelKey, typeKey, category]);

  const availableCanvases = useMemo(() => {
    if (categoryKey === "windowFrame" || categoryKey === "doorFrame") {
      const model = category.models[modelKey];
      return model?.canvases ? Object.keys(model.canvases) : [];
    }
    return [];
  }, [categoryKey, modelKey, category]);

  // reset dependent fields on category change
  const handleCategoryChange = (key) => {
    setCategoryKey(key);
    const cat = CATEGORIES[key];
    if (cat.models) {
      const firstModel = Object.keys(cat.models)[0];
      setModelKey(firstModel);
    }
    if (cat.types) {
      setTypeKey(Object.keys(cat.types)[0]);
    }
    setColorKey("white");
    setCanvasKey("standard");
    setMetalHinges(false);
    setBrakeMechanism(false);
  };

  const selection = {
    categoryKey,
    modelKey,
    typeKey,
    colorKey,
    canvasKey,
    handleKey,
    widthMm,
    heightMm,
    mounted,
    metalHinges,
    brakeMechanism,
    impostHeightCm,
  };

  const result = useMemo(() => {
    if (!widthMm || !heightMm) return null;
    try {
      return calculatePrice(selection);
    } catch (e) {
      return null;
    }
  }, [JSON.stringify(selection)]);

  const submitOrder = async () => {
    setError("");
    if (!orderData.fullName || !orderData.phone) {
      setError("Заповніть, будь ласка, ім'я та телефон.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: orderData,
          selection,
          priceResult: result,
        }),
      });
      if (!res.ok) throw new Error("Помилка сервера");
      setSubmitted(true);
    } catch (e) {
      setError("Не вдалося надіслати замовлення. Спробуйте ще раз або напишіть нам в Instagram.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-white" id="calculator">
      <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">Калькулятор вартості</h2>
      <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-10">
        Розміри вказуйте в міліметрах (мм) — калькулятор автоматично
        переведе їх у метри для розрахунку.
      </p>

      <div className="max-w-3xl mx-auto bg-gray-50 rounded-3xl p-6 md:p-10 fade-in-up">
        {/* Крок 1: Категорія */}
        <div className="mb-8">
          <p className="font-medium mb-3">1. Категорія</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((c) => (
              <StepButton key={c.key} active={categoryKey === c.key} onClick={() => handleCategoryChange(c.key)}>
                {c.label}
              </StepButton>
            ))}
          </div>
        </div>

        {/* Крок 2: Модель/тип */}
        {(categoryKey === "windowFrame" || categoryKey === "doorFrame") && (
          <div className="mb-8">
            <p className="font-medium mb-3">2. Клас</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(category.models).map(([key, m]) => (
                <StepButton key={key} active={modelKey === key} onClick={() => { setModelKey(key); setColorKey("white"); setCanvasKey("standard"); }}>
                  {m.name}
                </StepButton>
              ))}
            </div>
          </div>
        )}

        {categoryKey === "windowRoller" && (
          <div className="mb-8">
            <p className="font-medium mb-3">2. Тип системи</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(category.types).map(([key, t]) => (
                <StepButton key={key} active={typeKey === key} onClick={() => { setTypeKey(key); setColorKey("white"); }}>
                  {t.name}
                </StepButton>
              ))}
            </div>
          </div>
        )}

        {/* Колір */}
        <div className="mb-8">
          <p className="font-medium mb-3">Колір профілю</p>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((c) => (
              <StepButton key={c} active={colorKey === c} onClick={() => setColorKey(c)}>
                {COLOR_LABELS[c] || c}
              </StepButton>
            ))}
          </div>
        </div>

        {/* Крок 3: Полотно */}
        {availableCanvases.length > 0 && (
          <div className="mb-8">
            <p className="font-medium mb-3">3. Полотно</p>
            <div className="flex flex-wrap gap-2">
              {availableCanvases.map((c) => (
                <StepButton key={c} active={canvasKey === c} onClick={() => setCanvasKey(c)}>
                  {CANVAS_LABELS[c] || c}
                </StepButton>
              ))}
            </div>
          </div>
        )}

        {/* Крок 4: Додатки */}
        {categoryKey === "windowFrame" && (
          <div className="mb-8">
            <p className="font-medium mb-3">4. Ручки</p>
            <div className="flex flex-wrap gap-2">
              <StepButton active={handleKey === "plastic"} onClick={() => setHandleKey("plastic")}>Пластик (+0 грн)</StepButton>
              <StepButton active={handleKey === "metal"} onClick={() => setHandleKey("metal")}>Метал (+90 грн)</StepButton>
            </div>
          </div>
        )}

        {categoryKey === "doorFrame" && modelKey === "exclusive" && (
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={metalHinges} onChange={(e) => setMetalHinges(e.target.checked)} />
              Металеві завіси з автодотягуванням (+400 грн за 2 шт)
            </label>
          </div>
        )}

        {categoryKey === "windowRoller" && (
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={brakeMechanism} onChange={(e) => setBrakeMechanism(e.target.checked)} />
              Гальмівний механізм (+800 грн, доступно лише при ширині ≥ 50 см)
            </label>
          </div>
        )}

        {categoryKey === "doorFrame" && (
          <div className="mb-8">
            <label className="text-sm font-medium block mb-2">Висота імпосту (перегородки), см — опціонально</label>
            <input
              type="number"
              value={impostHeightCm}
              onChange={(e) => setImpostHeightCm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-40"
              placeholder="0"
            />
          </div>
        )}

        {/* Розміри */}
        <div className="mb-8 grid grid-cols-2 gap-4 max-w-sm">
          <div>
            <label className="text-sm font-medium block mb-2">Ширина, мм</label>
            <input
              type="number"
              value={widthMm}
              onChange={(e) => setWidthMm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="напр. 900"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Висота, мм</label>
            <input
              type="number"
              value={heightMm}
              onChange={(e) => setHeightMm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              placeholder="напр. 1400"
            />
          </div>
        </div>

        {/* Монтаж */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={mounted} onChange={(e) => setMounted(e.target.checked)} />
            Потрібен монтаж ({isDoorLike(categoryKey) ? "+700 грн/шт" : "+100 грн/шт"})
          </label>
        </div>

        <div className="bg-anthracite/5 border border-anthracite/10 rounded-xl p-4 text-sm text-gray-600 mb-8">
          Мінімальна площа для цього типу: <strong>{category.sMin} м²</strong>. Якщо
          розрахована площа менша — у формулу підставляється Smin.
        </div>

        {/* Результат */}
        {result && (
          <div className="fade-in-up bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">
              Площа: {result.rawArea} м²
              {result.sMinApplied && (
                <span className="text-orange-500"> → застосовано Smin {result.sMin} м²</span>
              )}
            </p>
            <p className="text-2xl font-semibold mb-4">{result.total.toLocaleString("uk-UA")} грн</p>
            <ul className="text-sm text-gray-500 space-y-1">
              {result.breakdown.map((b, i) => (
                <li key={i}>{b.label}: {b.pricePerM2} грн/м²</li>
              ))}
              {result.fixedAddons.map((a, i) => (
                <li key={`fixed-${i}`}>{a.label}: +{a.price} грн</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-anthracite text-white rounded-xl p-4 text-sm mb-8">
          Працюємо за передоплатою 50%. Замовлення запускається в роботу
          одразу після підтвердження менеджером.
        </div>

        {!showOrderForm ? (
          <button
            disabled={!result}
            onClick={() => setShowOrderForm(true)}
            className="w-full bg-anthracite text-white py-4 rounded-full font-medium disabled:opacity-40 hover:opacity-90 transition"
          >
            Прорахунок
          </button>
        ) : submitted ? (
          <div className="text-center py-8">
            <p className="text-xl font-medium mb-2">Дякуємо за замовлення! 🎉</p>
            <p className="text-gray-500 text-sm">
              Менеджер зв'яжеться з вами в Instagram або в соцмережах для
              уточнення деталей.
            </p>
          </div>
        ) : (
          <div className="fade-in-up border-t border-gray-200 pt-8 mt-2">
            <h3 className="font-medium text-lg mb-4">Оформлення замовлення</h3>
            <div className="grid gap-3 mb-4">
              <input
                placeholder="Ім'я"
                value={orderData.fullName}
                onChange={(e) => setOrderData({ ...orderData, fullName: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-3"
              />
              <input
                placeholder="Номер телефону"
                value={orderData.phone}
                onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-3"
              />
              <select
                value={orderData.messenger}
                onChange={(e) => setOrderData({ ...orderData, messenger: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-3"
              >
                <option value="viber">Viber</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
              </select>
              <input
                placeholder="Посилання на Instagram-профіль або нікнейм"
                value={orderData.contactLink}
                onChange={(e) => setOrderData({ ...orderData, contactLink: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-3"
              />
              <input
                placeholder="Адреса доставки (місто, вулиця, будинок, квартира)"
                value={orderData.address}
                onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Зверніть увагу: всі вироби виготовляються за індивідуальними
              розмірами. Після обробки заявки менеджер зв'яжеться з вами в
              Instagram або в соцмережах для уточнення деталей. Запуск у
              виробництво здійснюється після внесення 50% передоплати.
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              onClick={submitOrder}
              disabled={submitting}
              className="w-full bg-anthracite text-white py-4 rounded-full font-medium disabled:opacity-40 hover:opacity-90 transition"
            >
              {submitting ? "Надсилання..." : "Підтвердити та надіслати замовлення"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
