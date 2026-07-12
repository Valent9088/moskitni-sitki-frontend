export default function MeasureGuide() {
  return (
    <section className="section-padding bg-gray-50" id="measure">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Як правильно зробити заміри
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Відкрийте світловий проріз вікна (створку) та виміряйте відстань
            від ущільнювача до ущільнювача по ширині та висоті в
            міліметрах. Саме ці параметри потрібні для прорахунку.
          </p>
        </div>
        {/* TODO: замінити на реальне креслення-схему заміру вікна зі стрілками */}
        <div className="aspect-video bg-white border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-xs text-gray-400 p-6 text-center">
          Схема: креслення вікна зі стрілками "Ширина" (горизонтально) та
          "Висота" (вертикально), від ущільнювача до ущільнювача
        </div>
      </div>
    </section>
  );
}
