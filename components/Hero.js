export default function Hero() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center section-padding bg-white">
      <h1 className="fade-in-up text-4xl md:text-6xl font-semibold tracking-tight text-anthracite max-w-3xl">
        Москітні сітки під замовлення
      </h1>
      <p className="fade-in-up mt-6 text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
        Індивідуальне виготовлення москітних сіток для вікон та дверей.
        Надійний захист від комах, пуху та пилу. За ціною виробника
        <br />
        Безкоштовна доставка по Львову. Виготовлення до 5 робочих днів.
      </p>
      <button
        onClick={scrollToCalculator}
        className="fade-in-up mt-10 bg-anthracite text-white px-8 py-4 rounded-full text-base font-medium hover:opacity-90 transition"
      >
        Розрахувати вартість
      </button>
    </section>
  );
}
