const CANVASES = [
  { 
    name: "Сіре", 
    desc: "Входить у вартість (Стандарт, Ексклюзив)", 
    image: "/images/gray.jpg" 
  },
  { 
    name: "Чорне", 
    desc: "Естетичніший вигляд.Входить у вартість (Преміум, Еліт)", 
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
    desc: "На 20% прозоріша за звичайну за допомогою технології BetterVue", 
    image: "/images/invisible.jpg" 
  },
];

const PROFILE_COLORS = [
  { name: "Білий", hex: "#f1f1ea" },
  { name: "Коричневий", hex: "#442f29" },
  { name: "Антрацит", hex: "#383e42" },
  { name: "Золотий дуб", hex: "#c9a06a", image: "/images/golden-oak.jpg" },
  { name: "Горіх", hex: "#6b4c35", image: "/images/walnut.jpg" },
];

export default function PolotnaColors() {
  return (
    <section className="section-padding bg-white" id="polotna">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-10 md:mb-12 text-center">
        Типи полотна та кольори профілю
      </h2>

  {/* БЛОК 1: ТИПИ ПОЛОТНА */}
<div className="max-w-5xl mx-auto mb-20">
  <h3 className="text-xl font-medium mb-8 text-gray-800 tracking-tight">Типи полотна</h3>
  
  {/* Збільшили відступи між картками за допомогою gap-8 */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {CANVASES.map((c) => (
      <div 
        key={c.name} 
        className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px]"
      >
        
        {/* Фото стало елегантною вузькою смугою aspect-[21/9] замість великого квадрата */}
        <div className="relative aspect-[21/9] bg-gray-50 overflow-hidden rounded-lg border border-gray-100">
          <img 
            src={c.image} 
            alt={c.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>

        {/* Текстовий блок без зайвих ліній, чистий мінімалізм */}
        <div className="pt-4 pb-2 flex flex-col">
          <p className="font-semibold text-base text-gray-900 tracking-tight transition-colors duration-300 group-hover:text-black">
            {c.name}
          </p>
          <p className="text-sm text-gray-400 mt-1.5 leading-relaxed font-light">
            {c.desc}
          </p>
        </div>

      </div>
    ))}
  </div>
</div>

<div className="max-w-5xl mx-auto">
        <h3 className="text-xl font-medium mb-6">Кольори профілю</h3>
        <div className="flex flex-wrap gap-4 sm:gap-6">
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
