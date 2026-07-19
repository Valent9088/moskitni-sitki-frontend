import { useMemo, useState, useEffect } from "react";
import {
  CATEGORIES,
  COLOR_LABELS,
  CANVAS_LABELS,
  calculatePrice,
  describeSelection,
} from "../lib/pricing";

const CATEGORY_OPTIONS = [
  { key: "windowFrame", label: "Віконна рамкова" },
  { key: "windowRoller", label: "Віконна ролетна" },
  { key: "aluminumElite", label: "Для алюмінієвих вікон (Еліт)" },
  { key: "doorFrame", label: "Дверна рамкова" },
  { key: "doorPliseElite", label: "Дверна Плісе Еліт" },
  { key: "doorPliseStandard", label: "Віконна Плісе Стандарт" },
];

const isDoorLike = (k) => ["doorFrame", "doorPliseElite", "doorPliseStandard"].includes(k);

function StepButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
        active
          ? "bg-black text-white border-black shadow-sm scale-[1.01]"
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

const DEFAULTS = {
  categoryKey: "windowFrame",
  modelKey: "standard",
  typeKey: "normal",
  colorKey: "white",
  canvasKey: "standard",
  handleKey: "plastic",
  metalHinges: false,
  brakeMechanism: false,
  mounted: false,
  widthMm: "",
  heightMm: "",
  impostHeightMm: "",
  quantity: 1,
};

export default function Calculator() {
  const [form, setForm] = useState(DEFAULTS);
  const [cart, setCart] = useState([]);
  const [justAddedId, setJustAddedId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState("review");
  const [orderData, setOrderData] = useState({
    fullName: "",
    phone: "",
    messenger: "viber",
    contactLink: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const category = CATEGORIES[form.categoryKey];

  const availableColors = useMemo(() => {
    if (form.categoryKey === "windowFrame" || form.categoryKey === "doorFrame") {
      const model = category.models[form.modelKey];
      if (!model) return [];
      if (model.colorGroups) return Object.values(model.colorGroups).flatMap((g) => g.colors);
      return Object.keys(model.colors);
    }
    if (form.categoryKey === "windowRoller") return Object.keys(category.types[form.typeKey]?.colors || {});
    return Object.keys(category.colors || {});
  }, [form.categoryKey, form.modelKey, form.typeKey, category]);

  const availableCanvases = useMemo(() => {
    if (form.categoryKey === "windowFrame" || form.categoryKey === "doorFrame") {
      const model = category.models[form.modelKey];
      if (!model?.canvases) return [];
      const allKeys = Object.keys(model.canvases);

      // Логіка підтягування полотен (залежить від наявності в pricing.js)
      if (form.modelKey === "standard") return allKeys.filter(k => k === "standard"); 
      if (form.modelKey === "exclusive") return allKeys.filter(k => k === "standard" || k === "black");
      return allKeys;
    }
    return category.canvases ? Object.keys(category.canvases) : [];
  }, [form.categoryKey, form.modelKey, category]);

  const handleCategoryChange = (key) => {
    const cat = CATEGORIES[key];
    const patch = { categoryKey: key, colorKey: "white", canvasKey: "standard", metalHinges: false, brakeMechanism: false };
    if (cat.models) patch.modelKey = Object.keys(cat.models)[0];
    if (cat.types) patch.typeKey = Object.keys(cat.types)[0];
    
    if (key === "doorPliseStandard") patch.colorKey = "white"; 
    if (key !== "windowFrame" && key !== "doorFrame") patch.canvasKey = "black";
    
    set(patch);
  };

  const unitResult = useMemo(() => {
    if (!form.widthMm || !form.heightMm) return null;
    try { return calculatePrice(form); } catch (e) { return null; }
  }, [JSON.stringify(form)]);

  // ВАЛІДАЦІЯ: перевірка чи заповнені всі обов'язкові поля
  const isImpostValid = form.categoryKey !== "doorFrame" || !!form.impostHeightMm;
  const isSizesValid = !!form.widthMm && !!form.heightMm && !!form.quantity && form.quantity > 0;
  const canAddToCart = !!unitResult && isImpostValid && isSizesValid;

  const quantity = Math.max(1, Number(form.quantity) || 1);
  const itemTotal = unitResult ? unitResult.total * quantity : null;

  const addToCart = () => {
    if (!canAddToCart) return;
    const id = Date.now() + Math.random().toString(36).slice(2);
    const item = {
      id,
      selection: { ...form },
      result: unitResult,
      quantity,
      itemTotal: unitResult.total * quantity,
      label: describeSelection(form),
    };
    setCart((c) => [...c, item]);
    set({ widthMm: "", heightMm: "", quantity: 1, impostHeightMm: "" });
    setJustAddedId(id);
    setTimeout(() => setJustAddedId((cur) => (cur === id ? null : cur)), 2500);
  };

  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const cartTotal = cart.reduce((s, i) => s + i.itemTotal, 0);

  const openReview = () => {
    if (cart.length === 0) return;
    setError("");
    setModalStage("review");
    setModalOpen(true);
  };

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
          items: cart.map((i) => ({
            selection: i.selection,
            result: i.result,
            quantity: i.quantity,
            itemTotal: i.itemTotal,
            label: i.label,
          })),
          total: cartTotal,
        }),
      });
      if (!res.ok) throw new Error("Помилка сервера");
      setModalStage("done");
      setCart([]);
    } catch (e) {
      setError("Не вдалося надіслати замовлення. Спробуйте ще раз або напишіть нам в Instagram.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    if (modalStage === "done") {
      setOrderData({ fullName: "", phone: "", messenger: "viber", contactLink: "", address: "" });
      setModalStage("review");
    }
  };

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  return (
    <section className="py-20 bg-gray-50/50" id="calculator">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center text-gray-900 tracking-tight">Калькулятор вартості</h2>
        <p className="text-center text-base text-gray-500 max-w-xl mx-auto mb-12 font-light leading-relaxed">
          Вкажіть розміри в міліметрах, оберіть потрібні параметри виробу, додайте його до кошика та надішліть готове замовлення.
        </p>

        <div className="sticky top-4 z-30 mb-8 bg-black/95 backdrop-blur text-white rounded-2xl px-5 py-4 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300">
          <div className="text-sm font-medium text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
            {cart.length === 0 ? (
              <span className="text-gray-400 font-light">🛒 Кошик порожній — налаштуйте та додайте перший виріб</span>
            ) : (
              <span className="tracking-tight">
                🛒 У кошику: <span className="text-gray-300 font-normal">{cart.length} {cart.length === 1 ? "виріб" : "вироби"}</span> · <strong className="text-white text-base font-semibold">{cartTotal.toLocaleString("uk-UA")} грн</strong>
              </span>
            )}
          </div>
          <button
            onClick={openReview}
            disabled={cart.length === 0}
            className="w-full sm:w-auto bg-white text-black px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-20 disabled:cursor-not-allowed hover:bg-gray-100 transition whitespace-nowrap active:scale-[0.99]"
          >
            Оформити замовлення
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-8">
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-tight">Оберіть категорію виробу</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {CATEGORY_OPTIONS.map((c) => (
                <StepButton key={c.key} active={form.categoryKey === c.key} onClick={() => handleCategoryChange(c.key)}>
                  {c.label}
                </StepButton>
              ))}
            </div>
          </div>

          {(form.categoryKey === "windowFrame" || form.categoryKey === "doorFrame") && (
            <div className="pt-2">
              <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-tight">Клас конструкції</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(category.models).map(([key, m]) => (
                  <StepButton key={key} active={form.modelKey === key} onClick={() => set({ modelKey: key, colorKey: "white", canvasKey: (key === "standard" ? "standard" : form.canvasKey) })}>
                    {m.name}
                  </StepButton>
                ))}
              </div>
            </div>
          )}

          {form.categoryKey === "windowRoller" && (
            <div className="pt-2">
              <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-tight">Тип ролетної системи</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(category.types).map(([key, t]) => (
                  <StepButton key={key} active={form.typeKey === key} onClick={() => set({ typeKey: key, colorKey: "white" })}>
                    {t.name}
                  </StepButton>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-tight">Колір профілю рами</label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((c) => (
                <StepButton key={c} active={form.colorKey === c} onClick={() => set({ colorKey: c })}>
                  {COLOR_LABELS[c] || c}
                </StepButton>
              ))}
            </div>
          </div>

          {availableCanvases.length > 0 && (
            <div className="pt-2">
              <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-tight">Тип захисного полотна</label>
              <div className="flex flex-wrap gap-2">
                {availableCanvases.map((c) => (
                  <StepButton key={c} active={form.canvasKey === c} onClick={() => set({ canvasKey: c })}>
                    {CANVAS_LABELS[c] || c}
                  </StepButton>
                ))}
              </div>
            </div>
          )}

          {form.categoryKey === "windowFrame" && (
            <div className="pt-2">
              <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-tight">Матеріал вушок (ручок)</label>
              <div className="flex flex-wrap gap-2">
                <StepButton active={form.handleKey === "plastic"} onClick={() => set({ handleKey: "plastic" })}>Пластикові ручки (+0 грн)</StepButton>
                <StepButton active={form.handleKey === "metal"} onClick={() => set({ handleKey: "metal" })}>Металеві ручки (+90 грн)</StepButton>
              </div>
            </div>
          )}

          {/* Додаткові опції: Завіси (двері), Гальма (ролети) */}
          {(form.categoryKey === "doorFrame" || form.categoryKey === "windowRoller") && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              
              {/* Логіка завіс для дверей */}
              {form.categoryKey === "doorFrame" && (
                <label className={`flex items-center gap-3 text-sm select-none ${["standard", "exclusive"].includes(form.modelKey) ? "cursor-pointer text-gray-700" : "cursor-default text-gray-500"}`}>
                  <input
                    type="checkbox"
                    checked={["standard", "exclusive"].includes(form.modelKey) ? form.metalHinges : true}
                    onChange={(e) => {
                      if (["standard", "exclusive"].includes(form.modelKey)) set({ metalHinges: e.target.checked });
                    }}
                    disabled={!["standard", "exclusive"].includes(form.modelKey)}
                    className="rounded border-gray-300 text-black focus:ring-black w-4 h-4 disabled:bg-gray-200 disabled:border-gray-300"
                  />
                  Металеві завіси з автоматичним дотягуванням ({["standard", "exclusive"].includes(form.modelKey) ? "+400 грн за 2 шт" : "входять у вартість"})
                </label>
              )}

              {/* Відновлений чекбокс Гальмівного механізму для ролет */}
              {form.categoryKey === "windowRoller" && (
                <label className="flex items-center gap-3 text-sm text-gray-700 select-none cursor-pointer">
                  <input type="checkbox" checked={form.brakeMechanism} onChange={(e) => set({ brakeMechanism: e.target.checked })} className="rounded border-gray-300 text-black focus:ring-black w-4 h-4" />
                  Плавний гальмівний механізм (+800 грн, доступно при ширині ≥ 500 мм)
                </label>
              )}

              {form.categoryKey === "doorFrame" && (
                <div className="w-full max-w-xs mt-4">
                  <label className="text-sm font-semibold block mb-2 text-gray-700">Висота перегородки (імпосту), мм *</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form.impostHeightMm}
                    onChange={(e) => set({ impostHeightMm: e.target.value })}
                    className={`border focus:ring-0 rounded-xl px-4 py-2.5 w-full text-base transition ${
                      !form.impostHeightMm 
                        ? "border-amber-300 focus:border-amber-500 bg-amber-50/30" 
                        : "border-gray-200 focus:border-gray-900"
                    }`}
                    placeholder="напр. 900"
                  />
                  {!form.impostHeightMm && (
                    <p className="text-[11px] text-amber-600 mt-1.5 font-medium">Обов'язкове поле</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="pt-6 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-800 mb-4 tracking-tight">Вкажіть розміри виробу та кількість *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl">
              <div>
                <span className="text-xs text-gray-400 block mb-1.5 uppercase tracking-wider font-medium">Ширина (мм)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form.widthMm}
                  onChange={(e) => set({ widthMm: e.target.value })}
                  className={`border focus:ring-0 rounded-xl px-4 py-3 w-full text-base font-medium placeholder-gray-300 transition shadow-sm ${
                    !form.widthMm ? "border-amber-300 focus:border-amber-500 bg-amber-50/30" : "border-gray-200 focus:border-gray-900"
                  }`}
                  placeholder="напр. 850"
                />
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1.5 uppercase tracking-wider font-medium">Висота (мм)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form.heightMm}
                  onChange={(e) => set({ heightMm: e.target.value })}
                  className={`border focus:ring-0 rounded-xl px-4 py-3 w-full text-base font-medium placeholder-gray-300 transition shadow-sm ${
                    !form.heightMm ? "border-amber-300 focus:border-amber-500 bg-amber-50/30" : "border-gray-200 focus:border-gray-900"
                  }`}
                  placeholder="напр. 1450"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-gray-400 block mb-1.5 uppercase tracking-wider font-medium">Кількість (шт)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => set({ quantity: e.target.value })}
                  className={`border focus:ring-0 rounded-xl px-4 py-3 w-full text-base font-semibold text-center transition shadow-sm ${
                    !form.quantity || form.quantity < 1 ? "border-amber-300 focus:border-amber-500 bg-amber-50/30" : "border-gray-200 focus:border-gray-900"
                  }`}
                />
              </div>
            </div>
            {(!form.widthMm || !form.heightMm) && (
              <p className="text-[11px] text-amber-600 mt-2 font-medium">Будь ласка, заповніть обов'язкові поля розмірів</p>
            )}
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 text-sm text-gray-700 select-none cursor-pointer font-medium">
              <input type="checkbox" checked={form.mounted} onChange={(e) => set({ mounted: e.target.checked })} className="rounded border-gray-300 text-black focus:ring-black w-4 h-4" />
              Потрібна послуга монтажу ({form.categoryKey === "windowRoller" || isDoorLike(form.categoryKey) ? "+700 грн/шт" : "+100 грн/шт"})
            </label>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100/50">
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              * Мінімальна розрахункова площа для обраної категорії становить <strong>{category.sMin} м²</strong>. Якщо площа виробу за замірами менша — розрахунок автоматично здійснюється за мінімальним тарифом площі.
            </p>
            <p className="text-xs text-amber-600/90 font-light leading-relaxed flex items-start gap-1.5">
              <span className="shrink-0">⚠️</span>
              <span>
                Зверніть увагу: інформація про комплектацію може бути неповною через індивідуальні особливості вікон. Для точного прорахунку та детальної консультації напишіть нам у <strong>Direct (Instagram)</strong> або вкажіть деталі менеджеру.
              </span>
            </p>
          </div>

          {/* Динамічний екран ціни */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 transition-all duration-300">
            {unitResult ? (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <p className="text-2xl font-semibold text-gray-900 tracking-tight">
                    {quantity} шт × {unitResult.total.toLocaleString("uk-UA")} грн ={" "}
                    <span className="text-3xl font-bold">{itemTotal.toLocaleString("uk-UA")} грн</span>
                  </p>
                  <p className="text-xs text-gray-400 font-light">
                    Площа: {unitResult.rawArea} м² {unitResult.sMinApplied && `(застосовано s-min: ${unitResult.sMin} м²)`}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400 font-light">
                  <div>
                    <span className="font-medium text-gray-500 block mb-0.5">Базова вартість:</span>
                    {unitResult.breakdown.map((b, i) => (
                      <p key={i}>{b.label}: {b.pricePerM2} грн/м²</p>
                    ))}
                  </div>
                  {unitResult.fixedAddons.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-500 block mb-0.5">Комплектація та опції:</span>
                      {unitResult.fixedAddons.map((a, i) => (
                        <p key={`fixed-${i}`}>{a.label}: +{a.price} грн</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6 font-light">
                Введіть розміри вище та заповніть обов'язкові поля для прорахунку ціни
              </p>
            )}
            
            <button
              onClick={addToCart}
              disabled={!canAddToCart}
              className="mt-6 w-full bg-black text-white py-4 rounded-xl font-semibold text-base shadow-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-900 transition active:scale-[0.99]"
            >
              + Додати виріб до кошика
            </button>
          </div>

        </div>

        {/* Список кошика */}
        <div className="mt-8 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <p className="font-semibold text-gray-900 text-base mb-4 tracking-tight">Ваш кошик {cart.length > 0 && `(${cart.length})`}</p>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8 font-light">
              У кошику немає збережених виробів. Налаштуйте комплектацію вище та додайте її сюди.
            </p>
          ) : (
            <div className="space-y-6">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`py-4 flex justify-between items-start text-sm transition-all duration-300 rounded-xl px-2 ${
                      justAddedId === item.id ? "bg-green-50/60 ring-1 ring-green-100" : ""
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      {justAddedId === item.id && (
                        <span className="inline-block bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded mb-1">✓ Успішно додано</span>
                      )}
                      <p className="font-medium text-gray-900 leading-snug">{item.label}</p>
                      <p className="text-xs text-gray-400 font-light">{item.quantity} шт × {item.result.total.toLocaleString("uk-UA")} грн</p>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end justify-between h-full min-h-[50px]">
                      <p className="font-semibold text-gray-900">{item.itemTotal.toLocaleString("uk-UA")} грн</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-400 hover:text-red-600 hover:underline transition mt-2">
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </ul>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-bold text-gray-950 tracking-tight">
                <span>Загальна сума:</span>
                <span>{cartTotal.toLocaleString("uk-UA")} грн</span>
              </div>
              
              <button
                onClick={openReview}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold text-base shadow-sm hover:bg-gray-900 transition active:scale-[0.99]"
              >
                Надіслати замовлення менеджерам
              </button>
            </div>
          )}
        </div>
      </div>

      {/* МОДАЛЬНЕ ВІКНО */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-300"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            {modalStage === "review" && (
              <>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 tracking-tight">Підтвердження замовлення</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-black transition text-lg p-1">
                    ✕
                  </button>
                </div>

                <ul className="divide-y divide-gray-50 max-h-40 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <li key={item.id} className="py-2.5 flex justify-between text-xs font-light text-gray-500">
                      <span className="truncate max-w-[240px] font-normal text-gray-700">{item.label}</span>
                      <span className="shrink-0 font-medium text-gray-900">{item.quantity} шт · {item.itemTotal.toLocaleString("uk-UA")} грн</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-lg font-bold text-gray-950 tracking-tight">
                  <span>До сплати:</span>
                  <span>{cartTotal.toLocaleString("uk-UA")} грн</span>
                </div>

                <div className="space-y-3.5 pt-2">
                  <h4 className="font-semibold text-sm text-gray-800 tracking-tight">Контактні дані для зв'язку</h4>
                  <input
                    placeholder="Ваше ім'я та прізвище"
                    value={orderData.fullName}
                    onChange={(e) => setOrderData({ ...orderData, fullName: e.target.value })}
                    className="border border-gray-200 focus:border-gray-900 focus:ring-0 rounded-xl px-4 py-3 text-sm w-full transition placeholder-gray-300"
                  />
                  <input
                    placeholder="Номер телефону"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                    className="border border-gray-200 focus:border-gray-900 focus:ring-0 rounded-xl px-4 py-3 text-sm w-full transition placeholder-gray-300"
                  />
                  
                  <div>
                    <span className="text-xs text-gray-400 block mb-1.5 font-medium uppercase tracking-wide">Бажаний месенджер для зв'язку</span>
                    <select
                      value={orderData.messenger}
                      onChange={(e) => setOrderData({ ...orderData, messenger: e.target.value })}
                      className="border border-gray-200 focus:border-gray-900 focus:ring-0 rounded-xl px-4 py-3 text-sm w-full bg-white transition"
                    >
                      <option value="viber">Viber</option>
                      <option value="telegram">Telegram</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                  
                  <input
                    placeholder="Нікнейм в Instagram (необов'язково)"
                    value={orderData.contactLink}
                    onChange={(e) => setOrderData({ ...orderData, contactLink: e.target.value })}
                    className="border border-gray-200 focus:border-gray-900 focus:ring-0 rounded-xl px-4 py-3 text-sm w-full transition placeholder-gray-300"
                  />
                  <input
                    placeholder="Адреса доставки (Місто, Нова Пошта / Вулиця)"
                    value={orderData.address}
                    onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                    className="border border-gray-200 focus:border-gray-900 focus:ring-0 rounded-xl px-4 py-3 text-sm w-full transition placeholder-gray-300"
                  />
                </div>

                {error && <p className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl">{error}</p>}

                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    onClick={submitOrder}
                    disabled={submitting}
                    className="w-full sm:flex-1 order-1 sm:order-2 bg-black text-white py-3.5 rounded-xl font-semibold text-sm shadow-md disabled:opacity-40 hover:bg-gray-900 transition active:scale-[0.99]"
                  >
                    {submitting ? "Надсилання..." : "Надіслати замовлення"}
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full sm:flex-1 order-2 sm:order-1 border border-gray-200 text-gray-500 py-3.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                  >
                    Повернутись
                  </button>
                </div>
              </>
            )}

            {modalStage === "done" && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">✓</div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">Заявку успішно надіслано! 🎉</p>
                <p className="text-gray-500 text-sm font-light leading-relaxed px-4">
                  Дякуємо! Наш менеджер вже отримав деталі прорахунку вашого кошика і зв'яжеться з вами у вказаному месенджері найближчим часом.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-2 bg-black text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-gray-900 transition shadow-md"
                >
                  Зрозуміло
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}