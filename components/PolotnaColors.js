const CANVASES = [
  { 
    name: "Сіре (стандарт)", 
    desc: "Входить у вартість (Стандарт, Ексклюзив)", 
    image: "/images/gray.jpg" 
  },
  { 
    name: "Чорне (стандарт)", 
    desc: "Входить у вартість (Преміум, Еліт)", 
    image: "/images/black.jpg" 
  },
  { 
    name: "Антикішка", 
    desc: "У 7 разів міцніша, витримує кігті тварин", 
    image: "/images/anticat.jpg" 
  },
  { 
    name: "Антиалергенна", 
    desc: "Наддрібні комірки затримують пилок і пил", 
    image: "/images/antialerg.jpg" 
  },
  { 
    name: "Алюмінієва", 
    desc: "Максимальна стійкість до зовнішнього середовища", 
    image: "/images/alumin.jpg" 
  },
  { 
    name: "Невидимка", 
    desc: "На 20% прозоріша за звичайну", 
    image: "/images/invisible.jpg" 
  },
];

const PROFILE_COLORS = [
  { name: "Білий", hex: "#f1f1ea" },
  { name: "Коричневий", hex: "#442f29" },
  { name: "Антрацит", hex: "#383e42" },
  { name: "Золотий дуб", hex: "#c9a06a", image: "/images/golden-oak.jpg" },
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
      <div key={c.name} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-anthracite/30 transition flex flex-col">
        {/* Квадратне фото полотна сітки */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img 
            src={c.image} 
            alt={c.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
          />
        </div>

        {/* Текстовий блок під фото */}
        <div className="p-5 flex flex-col flex-grow">
          <p className="font-medium text-lg text-black">{c.name}</p>
          <p className="text-sm text-gray-500 mt-2 flex-grow">{c.desc}</p>
        </div>
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
               className="w-12 h-12 rounded-full border border-gray-200 bg-cover bg-center"
               style={{ 
               backgroundColor: c.hex,
               backgroundImage: c.image ? `url(${c.image})` : 'none' 
              }}
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
