export default function MeasureGuide() {
  return (
    <section className="section-padding bg-gray-50" id="measure">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
            Як правильно зробити заміри
          </h2>
          <p className="text-gray-600 leading-relaxed">
            <strong>Відкрийте створку вікна та виміряйте відстань
            від ущільнювача до ущільнювача (світловий проєм) по ширині та висоті в
            міліметрах. Саме ці параметри потрібні для прорахунку.</strong>
            <br />
            Таким шляхом Ви отримаєте розміри для віконних москітних сіток.
            <br />
            Для дверних, ролетних та плісе потрібно габаритні розміри
            <br />
            Щоб взнати габаритний розмір слід додати по 2 см з кожного боку для дверних москітних сіток
            <br />
            та по 4 см з кожного боку для ролетних та плісе.
          </p>
        </div>
        <div className="aspect-video bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <img 
            src="/images/window-scheme.JPG" 
            alt="Схема заміру вікна" 
            className="w-full h-full object-contain" 
          />
        </div>
      </div>
    </section>
  );
}
