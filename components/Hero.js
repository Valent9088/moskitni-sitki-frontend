export default function Hero() {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center section-padding text-white overflow-hidden">
  
  {/* Фото на весь екран як задній фон */}
  <img 
    src="/images/IMG_4373(1).JPG" 
    alt="Віконна сітка" 
    className="absolute inset-0 w-full h-full object-cover -z-10" 
  />
  
  {/* Напівпрозоре затемнення фону, щоб текст легко читався */}
  <div className="absolute inset-0 bg-black/40 -z-10" />

  {/* Контент сайту поверх картинки */}
  <div className="z-10 max-w-3xl px-4 flex flex-col items-center">
    <h1 className="fade-in-up text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">
      Москітні сітки під замовлення
    </h1>
    
    <p className="fade-in-up mt-6 text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
      Індивідуальне виготовлення москітних сіток для вікон та дверей. <br />
      Надійний захист від комах, пуху та пилу. За ціною виробника. <br />
      Безкоштовна доставка по Львову. Виготовлення до 5 робочих днів.
    </p>
    
    <button
      onClick={scrollToCalculator}
      className="fade-in-up mt-10 bg-white text-black px-8 py-4 rounded-full text-base font-medium hover:bg-opacity-90 transition shadow-lg"
    >
      Розрахувати вартість
    </button>
  </div>

</section>
  );
}
