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
  { key: "doorPliseStandard", label: "Дверна/Віконна Плісе Стандарт" },
];

const isDoorLike = (k) => ["doorFrame", "doorPliseElite", "doorPliseStandard"].includes(k);

function StepButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-full text-sm border transition ${
        active
          ? "bg-anthracite text-white border-anthracite"
          : "bg-white text-anthracite border-gray-300 hover:border-anthracite"
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
  impostHeightCm: "",
  quantity: 1,
};

export default function Calculator() {
  const [form, setForm] = useState(DEFAULTS);
  const [cart, setCart] = useState([]); // [{ id, selection, result, quantity, itemTotal, label }]
  const [justAddedId, setJustAddedId] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState("review"); // review -> done
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
      if (model.colorGroups) {
        return Object.values(model.colorGroups).flatMap((g) => g.colors);
      }
      return Object.keys(model.colors);
    }
    if (form.categoryKey === "windowRoller") {
      return Object.keys(category.types[form.typeKey]?.colors || {});
    }
    return Object.keys(category.colors || {});
  }, [form.categoryKey, form.modelKey, form.typeKey, category]);

  const availableCanvases = useMemo(() => {
    if (form.categoryKey === "windowFrame" || form.categoryKey === "doorFrame") {
      const model = category.models[form.modelKey];
      return model?.canvases ? Object.keys(model.canvases) : [];
    }
    return [];
  }, [form.categoryKey, form.modelKey, category]);

  const handleCategoryChange = (key) => {
    const cat = CATEGORIES[key];
    const patch = { categoryKey: key, colorKey: "white", canvasKey: "standard", metalHinges: false, brakeMechanism: false };
    if (cat.models) patch.modelKey = Object.keys(cat.models)[0];
    if (cat.types) patch.typeKey = Object.keys(cat.types)[0];
    set(patch);
  };

  const unitResult = useMemo(() => {
    if (!form.widthMm || !form.heightMm) return null;
    try {
      return calculatePrice(form);
    } catch (e) {
      return null;
    }
  }, [JSON.stringify(form)]);

  const quantity = Math.max(1, Number(form.quantity) || 1);
  const itemTotal = unitResult ? unitResult.total * quantity : null;

  const addToCart = () => {
    if (!unitResult) return;
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
    set({ widthMm: "", heightMm: "", quantity: 1 });

    // короткочасне підсвічення підтвердження додавання
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
      // повне скидання після успішної відправки
      setOrderData({ fullName: "", phone: "", messenger: "viber", contactLink: "", address: "" });
      setModalStage("review");
    }
  };

  // блокуємо скрол фону, коли модалка відкрита
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <section className="section-padding bg-white" id="calculator">
      <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">Калькулятор вартості</h2>
      <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-10">
        Розміри вказуйте в міліметрах (мм). Оберіть опції виробу (виробів), вкажіть розміри,
        додайте його (їх) в кошик та в кінці надішліть все одним замовленням.
      </p>

      <div className="max-w-3xl mx-auto">
        {/* Панель кошика — завжди видима, липне під час скролу */}
        <div className="sticky top-2 sm:top-3 z-20 mb-6 bg-anthracite text-white rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-center sm:text-left">
            {cart.length === 0 ? (
              <span className="text-gray-300">🛒 Кошик порожній — додайте перший виріб</span>
            ) : (
              <span>
                🛒 {cart.length} {cart.length === 1 ? "виріб" : "виробів"} ·{" "}
                <strong>{cartTotal.toLocaleString("uk-UA")} грн</strong>
              </span>
            )}
          </div>
          <button
            onClick={openReview}
            disabled={cart.length === 0}
            className="w-full sm:w-auto bg-white text-anthracite px-4 py-2.5 sm:py-2 rounded-full text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition whitespace-nowrap"
          >
            Надіслати замовлення
          </button>
        </div>

        <div className="bg-gray-50 rounded-3xl p-5 sm:p-6 md:p-10 fade-in-up">
          {/* Крок 1: Категорія */}
          <div className="mb-8">
            <p className="font-medium mb-3">1. Категорія</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => (
                <StepButton key={c.key} active={form.categoryKey === c.key} onClick={() => handleCategoryChange(c.key)}>
                  {c.label}
                </StepButton>
              ))}
            </div>
          </div>

          {(form.categoryKey === "windowFrame" || form.categoryKey === "doorFrame") && (
            <div className="mb-8">
              <p className="font-medium mb-3">2. Клас</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(category.models).map(([key, m]) => (
                  <StepButton key={key} active={form.modelKey === key} onClick={() => set({ modelKey: key, colorKey: "white", canvasKey: "standard" })}>
                    {m.name}
                  </StepButton>
                ))}
              </div>
            </div>
          )}

          {form.categoryKey === "windowRoller" && (
            <div className="mb-8">
              <p className="font-medium mb-3">2. Тип системи</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(category.types).map(([key, t]) => (
                  <StepButton key={key} active={form.typeKey === key} onClick={() => set({ typeKey: key, colorKey: "white" })}>
                    {t.name}
                  </StepButton>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <p className="font-medium mb-3">Колір профілю</p>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((c) => (
                <StepButton key={c} active={form.colorKey === c} onClick={() => set({ colorKey: c })}>
                  {COLOR_LABELS[c] || c}
                </StepButton>
              ))}
            </div>
          </div>

          {availableCanvases.length > 0 && (
            <div className="mb-8">
              <p className="font-medium mb-3">3. Полотно</p>
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
            <div className="mb-8">
              <p className="font-medium mb-3">4. Ручки</p>
              <div className="flex flex-wrap gap-2">
                <StepButton active={form.handleKey === "plastic"} onClick={() => set({ handleKey: "plastic" })}>Пластик (+0 грн)</StepButton>
                <StepButton active={form.handleKey === "metal"} onClick={() => set({ handleKey: "metal" })}>Метал (+90 грн)</StepButton>
              </div>
            </div>
          )}

          {form.categoryKey === "doorFrame" && form.modelKey === "exclusive" && (
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.metalHinges} onChange={(e) => set({ metalHinges: e.target.checked })} />
                Металеві завіси з автодотягуванням (+400 грн за 2 шт)
              </label>
            </div>
          )}

          {form.categoryKey === "windowRoller" && (
            <div className="mb-8">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.brakeMechanism} onChange={(e) => set({ brakeMechanism: e.target.checked })} />
                Гальмівний механізм (+800 грн, доступно лише при ширині ≥ 50 см)
              </label>
            </div>
          )}

          {form.categoryKey === "doorFrame" && (
            <div className="mb-8">
              <label className="text-sm font-medium block mb-2">Висота імпосту (перегородки), см — опціонально</label>
              <input
                type="number"
                inputMode="numeric"
                value={form.impostHeightCm}
                onChange={(e) => set({ impostHeightCm: e.target.value })}
                className="border border-gray-300 rounded-lg px-4 py-2.5 w-40 text-base"
                placeholder="0"
              />
            </div>
          )}

          <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg">
            <div>
              <label className="text-sm font-medium block mb-2">Ширина, мм</label>
              <input
                type="number"
                inputMode="numeric"
                value={form.widthMm}
                onChange={(e) => set({ widthMm: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-2 w-full text-base"
                placeholder="напр. 900"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Висота, мм</label>
              <input
                type="number"
                inputMode="numeric"
                value={form.heightMm}
                onChange={(e) => set({ heightMm: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-2 w-full text-base"
                placeholder="напр. 1400"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-sm font-medium block mb-2">Кількість, шт</label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                value={form.quantity}
                onChange={(e) => set({ quantity: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2.5 sm:px-4 sm:py-2 w-full text-base"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.mounted} onChange={(e) => set({ mounted: e.target.checked })} />
              Потрібен монтаж ({isDoorLike(form.categoryKey) ? "+700 грн/шт" : "+100 грн/шт"} — враховується на кожну одиницю)
            </label>
          </div>

          <div className="bg-anthracite/5 border border-anthracite/10 rounded-xl p-4 text-sm text-gray-600 mb-8">
            Мінімальна площа для цього типу: <strong>{category.sMin} м²</strong>. Якщо
            розрахована площа менша — у формулу підставляється мінімально допустима площа.
          </div>

          {/* Панель результату — завжди на екрані, навіть без розмірів */}
          <div className="fade-in-up bg-white border border-gray-200 rounded-2xl p-6 mb-2">
            {unitResult ? (
              <>
                <p className="text-sm text-gray-500 mb-2">
                  Площа: {unitResult.rawArea} м²
                  {unitResult.sMinApplied && (
                    <span className="text-orange-500"> → застосовано мінімально допустиму площу {unitResult.sMin} м²</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 mb-1">Ціна за 1 шт: {unitResult.total.toLocaleString("uk-UA")} грн</p>
                <p className="text-2xl font-semibold mb-4">
                  {quantity} шт × {unitResult.total.toLocaleString("uk-UA")} грн ={" "}
                  {itemTotal.toLocaleString("uk-UA")} грн
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {unitResult.breakdown.map((b, i) => (
                    <li key={i}>{b.label}: {b.pricePerM2} грн/м²</li>
                  ))}
                  {unitResult.fixedAddons.map((a, i) => (
                    <li key={`fixed-${i}`}>{a.label}: +{a.price} грн/шт</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                Вкажіть ширину і висоту вище, щоб побачити ціну
              </p>
            )}
            <button
              onClick={addToCart}
              disabled={!unitResult}
              className="mt-5 w-full bg-anthracite text-white py-3 rounded-full font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              + Додати до кошика
            </button>
          </div>
        </div>

        {/* Список кошика — завжди видимий блок під калькулятором */}
        <div className="fade-in-up mt-6 bg-gray-50 rounded-3xl p-5 sm:p-6 md:p-8">
          <p className="font-medium mb-4">Ваш кошик {cart.length > 0 && `(${cart.length})`}</p>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Тут з'являться вироби, які ви додасте. Налаштуйте виріб вище і
              натисніть «Додати до кошика».
            </p>
          ) : (
            <>
              <ul className="space-y-3 mb-6">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className={`flex justify-between items-start bg-white border rounded-xl p-4 text-sm transition ${
                      justAddedId === item.id ? "border-green-400 ring-2 ring-green-200" : "border-gray-200"
                    }`}
                  >
                    <div>
                      {justAddedId === item.id && (
                        <p className="text-green-600 text-xs font-medium mb-1">✓ Додано</p>
                      )}
                      <p className="font-medium">{item.label}</p>
                      <p className="text-gray-500">{item.quantity} шт × {item.result.total.toLocaleString("uk-UA")} грн</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-medium">{item.itemTotal.toLocaleString("uk-UA")} грн</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline mt-1">
                        Видалити
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center text-lg font-semibold mb-6">
                <span>Разом:</span>
                <span>{cartTotal.toLocaleString("uk-UA")} грн</span>
              </div>
              <button
                onClick={openReview}
                className="w-full bg-anthracite text-white py-4 rounded-full font-medium hover:opacity-90 transition"
              >
                Надіслати замовлення
              </button>
            </>
          )}
        </div>
      </div>

      {/* Модальне вікно: підсумок + форма + фінальна відправка */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 md:p-8 fade-in-up">
            {modalStage === "review" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-lg">Підсумок замовлення</h3>
                  <button onClick={closeModal} className="text-gray-400 hover:text-anthracite text-xl leading-none">
                    ✕
                  </button>
                </div>

                <ul className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between bg-gray-50 rounded-xl p-4 text-sm">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-gray-500">{item.quantity} шт × {item.result.total.toLocaleString("uk-UA")} грн</p>
                      </div>
                      <p className="font-medium">{item.itemTotal.toLocaleString("uk-UA")} грн</p>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center text-xl font-semibold mb-6 pb-6 border-b border-gray-200">
                  <span>Разом:</span>
                  <span>{cartTotal.toLocaleString("uk-UA")} грн</span>
                </div>

                <h4 className="font-medium mb-3">Ваші контакти</h4>
                <div className="grid gap-3 mb-4">
                  <input
                    placeholder="Ім'я"
                    value={orderData.fullName}
                    onChange={(e) => setOrderData({ ...orderData, fullName: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                  />
                  <input
                    placeholder="Номер телефону"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                  />
                  <select
                    value={orderData.messenger}
                    onChange={(e) => setOrderData({ ...orderData, messenger: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                  >
                    <option value="viber">Viber</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                  </select>
                  <input
                    placeholder="Посилання на Instagram-профіль або нікнейм"
                    value={orderData.contactLink}
                    onChange={(e) => setOrderData({ ...orderData, contactLink: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                  />
                  <input
                    placeholder="Адреса доставки (місто, вулиця, будинок, квартира)"
                    value={orderData.address}
                    onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                  />
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  Зверніть увагу: всі вироби виготовляються за індивідуальними
                  розмірами. Після обробки заявки менеджер зв'яжеться з вами в
                  Instagram або в соцмережах для уточнення деталей. Запуск у
                  виробництво здійснюється після внесення 50% передоплати.
                </p>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={submitOrder}
                    disabled={submitting}
                    className="w-full sm:flex-1 order-1 sm:order-2 bg-anthracite text-white py-4 rounded-full font-medium disabled:opacity-40 hover:opacity-90 transition"
                  >
                    {submitting ? "Надсилання..." : "Надіслати замовлення"}
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full sm:flex-1 order-2 sm:order-1 border border-anthracite text-anthracite py-3.5 sm:py-4 rounded-full font-medium hover:bg-anthracite/5 transition"
                  >
                    ← Редагувати кошик
                  </button>
                </div>
              </>
            )}

            {modalStage === "done" && (
              <div className="text-center py-8">
                <p className="text-xl font-medium mb-2">Дякуємо за замовлення! 🎉</p>
                <p className="text-gray-500 text-sm mb-6">
                  Менеджер зв'яжеться з вами в Instagram або в соцмережах для
                  уточнення деталей.
                </p>
                <button
                  onClick={closeModal}
                  className="bg-anthracite text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition"
                >
                  Закрити
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
