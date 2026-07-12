const CANVASES = [
  { name: "Сіре (стандарт)", desc: "Входить у вартість (Економ, Стандарт, Ексклюзив)" },
  { name: "Чорне (стандарт)", desc: "Входить у вартість (Преміум, Еліт)" },
  { name: "Невидимка", desc: "На 20% прозоріша за звичайну" },
  { name: "Антикішка", desc: "У 7 разів міцніша, витримує кігті тварин" },
  { name: "Антиалергенна", desc: "Наддрібні комірки затримують пилок і пил" },
  { name: "Алюмінієва", desc: "Максимальна стійкість до зовнішнього середовища" },
];

const PROFILE_COLORS = [
  { name: "Білий", hex: "#f5f5f0" },
  { name: "Коричневий", hex: "#6b4a2f" },
  { name: "Антрацит", hex: "#343a40" },
  { name: "Золотий дуб", hex: "#c9a06a" },
  { name: "Вінчестер", hex: "#8a5a34" },
  { name: "Графіт", hex: "#4b4f52" },
];

export default function PolotnaColors() {
  return (
    <section className="section-padding bg-white" id="polotna">
      <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
        Типи полотна та кольори профілю
      </h2>

      <div className="max-w-5xl mx-auto mb-14">
        <h3 className="text-xl font-medium mb-6">Типи полотна</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CANVASES.map((c) => (
            <div key={c.name} className="border border-gray-100 rounded-xl p-5 hover:border-anthracite/30 transition">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <h3 className="text-xl font-medium mb-6">Кольори профілю</h3>
        <div className="flex flex-wrap gap-6">
          {PROFILE_COLORS.map((c) => (
            <div key={c.name} className="flex flex-col items-center gap-2">
              <span
                className="w-12 h-12 rounded-full border border-gray-200"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-xs text-gray-500">{c.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Набір доступних кольорів залежить від обраного класу — уточнюється в калькуляторі.
        </p>
      </div>
    </section>
  );
}
