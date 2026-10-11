import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import HowItWorks from './components/HowItWorks';
import ModelInfo from './components/ModelInfo';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';
import { scrollToId } from './utils/scroll';

export default function App() {
  const [result, setResult] = useState(null); // { prediction, payload }
  const [formKey, setFormKey] = useState(0);
  const resultRef = useRef(null);

  // Reveal the result in place and move focus to it for keyboard and screen reader users.
  useEffect(() => {
    if (!result || !resultRef.current) return;
    scrollToId('results');
    resultRef.current.focus({ preventScroll: true });
  }, [result]);

  const handleEdit = () => scrollToId('predict');

  const handleReset = () => {
    setResult(null);
    setFormKey((key) => key + 1); // remounting clears every field
    requestAnimationFrame(() => scrollToId('predict'));
  };

  return (
    <>
      <a
        href="#predict"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink-800 focus:px-4 focus:py-2"
      >
        Skip to the prediction form
      </a>
      <Navbar />
      <main>
        <HeroSection />
        <PredictionForm key={formKey} onPredict={setResult} />
        {result && (
          <PredictionResult
            ref={resultRef}
            prediction={result.prediction}
            payload={result.payload}
            onEdit={handleEdit}
            onReset={handleReset}
          />
        )}
        <HowItWorks />
        <ModelInfo />
        <Disclaimer />
      </main>
      <Footer />
    </>
  );
}
