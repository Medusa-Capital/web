import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const quotes = [
  {
    text: "Bitcoin es oro digital. Es una clase de activo legítima.",
    author: "Larry Fink",
    position: "CEO de BlackRock",
    company: "$10 trillones bajo gestión",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGiyZdHxk5nxZmTQgx9-eF_hCQFrvXybrEuw&s"
  },
  {
    text: "Creemos que Bitcoin alcanzará los $1.5 millones para 2030.",
    author: "Cathie Wood",
    position: "CEO de ARK Invest",
    company: "Gestora institucional",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8yuorO7LkTCEiE6ukb2swyDOwAt6vyrh6Kw&s"
  },
  {
    text: "Bitcoin es la salida de emergencia de un sistema monetario fallido.",
    author: "Michael Saylor",
    position: "CEO de MicroStrategy",
    company: "$5.9B invertidos en BTC",
    image: "https://www.strategy.com/_next/image?url=https%3A%2F%2Fimages.contentstack.io%2Fv3%2Fassets%2Fbltf8d808d9b8cebd37%2Fblta9597547a826a86f%2F6889293550671cc10fc38564%2Fexecutive-team_michael-saylor.jpg&w=3840&q=100"
  },
  {
    text: "Las monedas digitales están aquí para quedarse.",
    author: "Christine Lagarde",
    position: "Presidenta del BCE",
    company: "Banco Central Europeo",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLwnNHhXspAs8joJlsTBG3R2LeBgaWEQA3OA&s"
  },
  {
    text: "Adoptar Bitcoin fue la mejor decisión económica de El Salvador.",
    author: "Nayib Bukele",
    position: "Presidente de El Salvador",
    company: "Primer país en adoptar BTC",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Nayib_Bukele_in_the_White_House%2C_2025_%28cropped%29.jpg/330px-Nayib_Bukele_in_the_White_House%2C_2025_%28cropped%29.jpg"
  },
  {
    text: "Los bancos deben evolucionar hacia blockchain o desaparecer.",
    author: "Jamie Dimon",
    position: "CEO de JP Morgan",
    company: "Banco más grande de EEUU",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkDyGkGgaBE4JqiO2EYiXMedDKLXQ5ua9HpA&s"
  }
];

// OPCIÓN 1: Carrusel horizontal con flechas y autoplay
export function QuotesCarouselOption1() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % quotes.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);

  return (
    <div 
      className="relative my-12 px-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[rgba(197,191,230,0.03)] rounded-[24px] blur-2xl"></div>
      
      <div className="relative backdrop-blur-[25px] bg-[rgba(197,191,230,0.02)] border border-[rgba(197,191,230,0.15)] rounded-[24px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            {/* Quote icon */}
            <div className="w-12 h-12 rounded-full bg-[rgba(197,191,230,0.08)] flex items-center justify-center mb-6">
              <Quote className="w-6 h-6 text-[#c5bfe6]" />
            </div>

            {/* Quote text */}
            <p className="font-['Cormorant_Garamond'] text-2xl italic text-white mb-6 max-w-[700px] leading-relaxed">
              "{quotes[currentIndex].text}"
            </p>

            {/* Author info */}
            <div className="space-y-1">
              <h4 className="font-['Inter'] text-lg font-bold text-white">
                {quotes[currentIndex].author}
              </h4>
              <p className="font-['Inter'] text-sm text-[rgba(197,191,230,0.9)]">
                {quotes[currentIndex].position}
              </p>
              <p className="font-['Inter'] text-xs text-[rgba(204,204,224,0.7)]">
                {quotes[currentIndex].company}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-6">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-[#c5bfe6] w-8' 
                  : 'bg-[rgba(197,191,230,0.3)] hover:bg-[rgba(197,191,230,0.5)]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[rgba(197,191,230,0.1)] hover:bg-[rgba(197,191,230,0.2)] border border-[rgba(197,191,230,0.3)] flex items-center justify-center transition-all duration-300 backdrop-blur-md"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[rgba(197,191,230,0.1)] hover:bg-[rgba(197,191,230,0.2)] border border-[rgba(197,191,230,0.3)] flex items-center justify-center transition-all duration-300 backdrop-blur-md"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

// OPCIÓN 2: Fade transition simple y elegante (más minimalista)
export function QuotesCarouselOption2() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative my-12 max-w-[900px] mx-auto">
      <div className="relative backdrop-blur-[20px] bg-[rgba(197,191,230,0.02)] border border-[rgba(197,191,230,0.15)] rounded-[20px] p-10 shadow-[0_15px_50px_rgba(0,0,0,0.4)] min-h-[200px] flex items-center justify-center">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            {/* Quote */}
            <p className="font-['Cormorant_Garamond'] text-[26px] italic text-white mb-5 leading-relaxed">
              "{quotes[currentIndex].text}"
            </p>

            {/* Divider */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#c5bfe6] to-transparent mx-auto mb-4"></div>

            {/* Author */}
            <p className="font-['Inter'] text-base font-semibold text-[#c5bfe6]">
              {quotes[currentIndex].author}
            </p>
            <p className="font-['Inter'] text-sm text-[rgba(204,204,224,0.8)]">
              {quotes[currentIndex].position}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[rgba(197,191,230,0.1)] rounded-b-[20px] overflow-hidden">
          <motion.div
            key={currentIndex}
            className="h-full bg-gradient-to-r from-[#c5bfe6] to-[#8b7fd8]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {quotes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'bg-[#c5bfe6] scale-125' 
                : 'bg-[rgba(197,191,230,0.3)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// OPCIÓN 3: Ticker horizontal continuo (más compacto)
export function QuotesCarouselOption3() {
  const [offset, setOffset] = useState(0);

  // Duplicar quotes 4 veces para efecto infinito suave
  const duplicatedQuotes = [...quotes, ...quotes, ...quotes, ...quotes];
  
  // Ancho aproximado de cada quote card (500px min-width + 48px gap)
  const cardWidth = 548;
  const resetPoint = quotes.length * cardWidth;

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - 1;
        // Reset suave cuando llegamos al punto de repetición
        if (Math.abs(newOffset) >= resetPoint) {
          return 0;
        }
        return newOffset;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [resetPoint]);

  return (
    <div className="relative my-10 overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#010052] to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#010052] to-transparent z-10"></div>

      <div className="relative backdrop-blur-[15px] bg-[rgba(197,191,230,0.02)] border-y border-[rgba(197,191,230,0.15)] py-6">
        <motion.div
          className="flex gap-12"
          animate={{ x: offset }}
          transition={{ duration: 0, ease: "linear" }}
        >
          {duplicatedQuotes.map((quote, idx) => (
            <div key={idx} className="flex items-center gap-4 min-w-[500px] px-4">
              {/* Profile Image */}
              <div className="relative shrink-0">
                {/* Outer glow effect - más grande y visible */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-[rgba(197,191,230,0.4)] to-[rgba(139,127,216,0.3)] blur-xl"></div>
                
                {/* White background circle for better contrast */}
                <div className="relative w-16 h-16 rounded-full bg-white/95 p-[3px] shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-[rgba(197,191,230,0.6)]">
                    <img 
                      src={quote.image} 
                      alt={quote.author}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              {/* Quote Content */}
              <div className="flex-1">
                <p className="font-['Inter'] text-[15px] text-white mb-1.5 leading-relaxed">
                  "{quote.text}"
                </p>
                <p className="font-['Inter'] text-xs font-semibold text-[rgba(197,191,230,0.95)]">
                  {quote.author}
                </p>
                <p className="font-['Inter'] text-xs text-[rgba(204,204,224,0.7)]">
                  {quote.position}
                </p>
              </div>

              {/* Quote Icon */}
              <Quote className="w-5 h-5 text-[rgba(197,191,230,0.3)] shrink-0" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// OPCIÓN 4: Grid de 3 citas visible con rotación
export function QuotesCarouselOption4() {
  const [visibleIndices, setVisibleIndices] = useState([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndices((prev) =>
        prev.map((idx) => (idx + 1) % quotes.length)
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-12">
      <div className="grid grid-cols-3 gap-4">
        {visibleIndices.map((quoteIdx, position) => (
          <AnimatePresence mode="wait" key={position}>
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-[20px] bg-[rgba(197,191,230,0.02)] border border-[rgba(197,191,230,0.15)] rounded-[16px] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
              <Quote className="w-5 h-5 text-[#c5bfe6] mb-3" />
              <p className="font-['Inter'] text-sm text-white mb-3 leading-relaxed min-h-[60px]">
                "{quotes[quoteIdx].text}"
              </p>
              <div className="border-t border-[rgba(197,191,230,0.2)] pt-3">
                <p className="font-['Inter'] text-xs font-semibold text-[#c5bfe6]">
                  {quotes[quoteIdx].author}
                </p>
                <p className="font-['Inter'] text-xs text-[rgba(204,204,224,0.7)]">
                  {quotes[quoteIdx].position}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>

      {/* Indicator */}
      <div className="flex justify-center gap-1 mt-4">
        {quotes.map((_, idx) => (
          <div
            key={idx}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              visibleIndices.includes(idx)
                ? 'bg-[#c5bfe6]'
                : 'bg-[rgba(197,191,230,0.2)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// OPCIÓN 5: Featured single quote - Editorial style
export function QuotesCarouselFeatured() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const DURATION = 6000; // 6 seconds per quote

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= DURATION) {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setProgress(0);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const quote = quotes[currentIndex];

  return (
    <div
      className="relative py-16 px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main content container */}
      <div className="max-w-[900px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            {/* Quote mark */}
            <div className="mb-8">
              <Quote className="w-10 h-10 text-[#c5bfe6] opacity-40 mx-auto" />
            </div>

            {/* Quote text */}
            <blockquote className="font-['Cormorant_Garamond'] text-[28px] md:text-[36px] italic text-white leading-relaxed mb-10">
              "{quote.text}"
            </blockquote>

            {/* Author section */}
            <div className="flex items-center justify-center gap-5">
              {/* Photo */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[rgba(197,191,230,0.3)] shadow-lg">
                  <img
                    src={quote.image}
                    alt={quote.author}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name and credentials */}
              <div className="text-left">
                <h4 className="font-['Inter'] text-lg font-semibold text-white">
                  {quote.author}
                </h4>
                <p className="font-['Inter'] text-sm text-[#c5bfe6]">
                  {quote.position}
                </p>
                <p className="font-['Inter'] text-xs text-[rgba(204,204,224,0.6)]">
                  {quote.company}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="mt-12 h-[2px] bg-[rgba(197,191,230,0.1)] rounded-full overflow-hidden max-w-[400px] mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#c5bfe6] to-[#8b7fd8]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mt-6">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setProgress(0);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-[#c5bfe6] scale-125'
                  : 'bg-[rgba(197,191,230,0.25)] hover:bg-[rgba(197,191,230,0.5)]'
              }`}
              aria-label={`Ver cita de ${quotes[idx].author}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}