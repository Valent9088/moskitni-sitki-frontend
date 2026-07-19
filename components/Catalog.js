const PRODUCTS = [
  {
    title: "Віконна рамкова",
    desc: "Рамкові на Z-подібних гачках. Серії: Стандарт, Ексклюзив, Преміум та Еліт.",
    image: "/images/window.jpg"
  },
  {
    title: "Дверна рамкова",
    desc: "На завісах для дверей. Серії: Стандарт, Ексклюзив, Преміум, Еліт.",
    image: "/images/door1.jpg"
  },
  {
    title: "Ролетні москітні сітки",
    desc: "Компактні системи виробника AluProf, що згортаються в короб. Звичайна та Гакова (мансардна).",
    image: "/images/roller.jpg"
  },
  {
    title: "Сітки Плісе",
    desc: "Преміум-серія виробника AluPfor для терасових/панорамних дверей та серія «Стандарт» для віконних конструкцій.",
    image: "/images/plice.jpg"
  },
  {
    title: "Москітні сітки для алюмінієвих вікон",
    desc: "Спеціальні системи для профілів з європазом. Надійне кріплення, що не пошкоджує раму.",
    image: "/images/aluminum-windows.jpg"
  }
];

export default function Catalog() {
  return (
    <section className="section-padding bg-gray-50" id="catalog">
      <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">Каталог</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {PRODUCTS.map((p) => (
          <div key={p.title} className="fade-in-up bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
            {/* TODO: замінити на реальне фото товару */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <img 
              src={p.image} 
              alt={p.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
              />
            </div>
            <div className="p-5">
              <h3 className="font-medium text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
