import Hero from "../components/Hero";
import Catalog from "../components/Catalog";
import PolotnaColors from "../components/PolotnaColors";
import MeasureGuide from "../components/MeasureGuide";
import Calculator from "../components/Calculator";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Catalog />
      <PolotnaColors />
      <MeasureGuide />
      <Calculator />
      <Footer />
    </main>
  );
}
