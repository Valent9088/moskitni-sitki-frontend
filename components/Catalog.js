const PRODUCTS = [
  {
    title: "Віконні москітні сітки",
    desc: "Рамкові на Z-подібних гачках. Серії: Стандарт, Ексклюзив, Преміум та Еліт.",
    image: "/images/window.JPG"
  },
  {
    title: "Дверні москітні сітки",
    desc: "На завісах для дверей. Серії: Стандарт, Ексклюзив, Преміум, Еліт.",
    image: "/images/door.JPG"
  },
  {
    title: "Ролетні москітні сітки",
    desc: "Компактні системи виробника AluProf, що згортаються в короб. Звичайна та Гакова (мансардна).",
    image: "/images/roller.JPG"
  },
  {
    title: "Сітки Плісе",
    desc: "Преміум-серія виробника AluPfor для терасових/панорамних дверей та серія «Стандарт» для віконних конструкцій.",
    image: "/images/plice.jpg"
  },
];

export default function Catalog() {
  return (
    <section className="section-padding bg-gray-50" id="catalog">
      <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">Каталог</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {PRODUCTS.map((p) => (
          <div key={p.title} className="fade-in-up bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
            {/* TODO: замінити на реальне фото товару */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center text-xs text-gray-400 p-4 text-center">
              {p.imgHint}
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
