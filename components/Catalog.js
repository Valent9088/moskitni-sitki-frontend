const PRODUCTS = [
  {
    title: "Віконні москітні сітки",
    desc: "Рамкові моделі: Економ, Стандарт, Ексклюзив, Преміум, Еліт.",
    imgHint: "Фото: віконна рамкова сітка на пластиковому вікні, крупний план кутового кріплення",
  },
  {
    title: "Дверні москітні сітки",
    desc: "На завісах для дверей: Стандарт, Ексклюзив, Преміум, Еліт.",
    imgHint: "Фото: дверна сітка на завісах у відкритому стані, видно ручку та магнітну стрічку",
  },
  {
    title: "Ролетні москітні сітки",
    desc: "Компактні системи AluProf, що згортаються в короб. Звичайна та Гакова (мансардна).",
    imgHint: "Фото: ролетна сітка у зібраному вигляді в коробі + окремо розгорнута на вікні",
  },
  {
    title: "Сітки Плісе",
    desc: "Преміум-серія «Еліт» (гармошкою) для терасових/панорамних дверей та бюджетна «Стандарт».",
    imgHint: "Фото: сітка плісе на розсувних терасових дверях, складена гармошкою збоку",
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
