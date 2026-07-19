export default function MeasureGuide() {
  return (
    <section className="section-padding bg-gray-50" id="measure">
      {/* Розширили загальну ширину блоку до 6xl, щоб дати більше простору */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* ЛІВА КОЛОНКА З ТЕКСТОМ (займає 5 колонок з 12) */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-900 tracking-tight">
            Як правильно зробити заміри
          </h2>

          {/* Головне правило: велике, елегантне, без Word-ефекту */}
          <p className="text-xl text-gray-800 leading-relaxed font-normal tracking-tight">
            Відкрийте створку вікна та виміряйте відстань від ущільнювача до ущільнювача (світловий проєм) по ширині та висоті в міліметрах.
          </p>
          
          <p className="text-base text-gray-500 mt-3 font-light leading-relaxed">
            Таким чином Ви отримаєте точні розміри для віконних москітних сіток.
          </p>

          {/* Додаткова інформативна зона: компактна, акуратна, з меншим відступом */}
          <div className="mt-8 pt-6 border-t border-gray-200/60 flex flex-col gap-3.5">
            <div className="flex items-start gap-3">
              <span className="text-gray-400 mt-1 text-xs">•</span>
              <p className="text-sm text-gray-500 leading-relaxed">
                Для <span className="font-medium text-gray-700">дверних, ролетних та плісе</span> потрібні габаритні розміри.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-gray-400 mt-1 text-xs">•</span>
              <p className="text-sm text-gray-500 leading-relaxed">
                Щоб дізнатися габаритний розмір, додайте <span className="font-medium text-gray-700">+2 см</span> з кожного боку для дверних сіток та <span className="font-medium text-gray-700">+4 см</span> з кожного боку для ролетних та плісе.
              </p>
            </div>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА З КАРТИНКОЮ */}
        <div className="md:col-span-7 w-full flex items-center justify-center">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 w-full">
            <img 
              src="/images/window-scheme.jpg" 
              alt="Схема заміру вікна" 
              className="w-full h-auto object-cover" 
            />
          </div>
        </div>

      </div>
    </section>
  );
}
