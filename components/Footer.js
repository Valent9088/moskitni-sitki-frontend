import { useState } from "react";

export default function Footer() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quick-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
    } catch (err) {
      console.error(err);
    }
    setSent(true);
  };

  return (
    <footer className="section-padding bg-anthracite text-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-medium mb-4">Швидка консультація</h3>
          <p className="text-gray-300 mb-6 text-sm">
            Не хочете користуватись калькулятором? Залиште контакти — ми
            зателефонуємо.
          </p>
          {sent ? (
            <p className="text-green-400">Дякуємо! Ми з вами зв'яжемось найближчим часом.</p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 max-w-sm">
              <input
                required
                placeholder="Ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 rounded-lg text-anthracite outline-none text-base"
              />
              <input
                required
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-4 py-3 rounded-lg text-anthracite outline-none text-base"
              />
              <button className="bg-white text-anthracite rounded-lg py-3 font-medium hover:opacity-90 transition">
                Надіслати
              </button>
            </form>
          )}
        </div>
        <div className="flex flex-col items-start md:items-end justify-center gap-4">
          <p className="text-gray-300 text-sm">Слідкуйте за нами та замовляйте в Instagram</p>
          <a
            href="https://instagram.com/YOUR_INSTAGRAM_HANDLE"
            target="_blank"
            rel="noreferrer"
            className="bg-white text-anthracite px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            Instagram →
          </a>
        </div>
      </div>
    </footer>
  );
}
