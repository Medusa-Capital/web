import { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { TrackRecordCard } from './TrackRecordCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BackgroundEffects } from './VisualEffects';
import { ThesisPrivateModal } from './ThesisPrivateModal';

const trackRecordProjects = [
  {
    screenshotUrl: 'https://s2.coinmarketcap.com/static/img/coins/200x200/38146.png',
    timestamp: '14/01/24 09:32',
    projectName: 'MetaDAO',
    ticker: '$META',
    roi: '+1.100%',
    duration: '5 meses',
    entryPrice: '$1',
    exitPrice: '$11',
    startDate: 'Enero 2024',
    endDate: 'Junio 2024',
    reasons: [
      'Propuesta única de gobernanza on-chain',
      'Equipo técnico con historial probado',
      'Timing perfecto en ciclo alcista'
    ],
    thesisLink: '#'
  },
  {
    screenshotUrl: 'https://s2.coinmarketcap.com/static/img/coins/200x200/32196.png',
    timestamp: '08/03/24 14:15',
    projectName: 'Hyperliquid',
    ticker: '$HYPE',
    roi: '+500%',
    duration: '8 meses',
    entryPrice: '$10',
    exitPrice: '$60',
    startDate: 'Marzo 2024',
    endDate: 'Noviembre 2024',
    reasons: [
      'Tesis sólida (DEX sin VCs)',
      'Tracción real ($2B TVL)',
      'Plan de salida disciplinado'
    ],
    thesisLink: '#'
  },
  {
    screenshotUrl: 'https://s2.coinmarketcap.com/static/img/coins/200x200/33824.png',
    timestamp: '22/05/24 11:48',
    projectName: 'Syrup',
    ticker: '$SYRUP',
    roi: '+250%',
    duration: '6 meses',
    entryPrice: '$0.20',
    exitPrice: '$0.70',
    startDate: 'Mayo 2024',
    endDate: 'Noviembre 2024',
    reasons: [
      'Nicho desatendido en DeFi',
      'Community building excepcional',
      'Tokenomics favorables a largo plazo'
    ],
    thesisLink: '#'
  }
];

export function TrackRecordCarousel() {
  const sliderRef = useRef<Slider>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inject styles on mount
  useEffect(() => {
    const styleId = 'slick-carousel-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Slick Slider Base Styles */
        .slick-slider {
          position: relative;
          display: block;
          box-sizing: border-box;
          user-select: none;
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
        }
        .slick-list {
          position: relative;
          display: block;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        .slick-list:focus {
          outline: none;
        }
        .slick-track {
          position: relative;
          top: 0;
          left: 0;
          display: flex;
        }
        .slick-slide {
          display: none;
          float: left;
          height: 100%;
          min-height: 1px;
        }
        .slick-slide > div {
          height: 100%;
        }
        .slick-initialized .slick-slide {
          display: block;
        }
        
        /* Dots Styles */
        .slick-dots {
          position: relative;
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .slick-dots li {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }
        .slick-dots li button {
          font-size: 0;
          line-height: 0;
          display: block;
          width: 20px;
          height: 20px;
          padding: 5px;
          cursor: pointer;
          color: transparent;
          border: 0;
          outline: none;
          background: transparent;
        }
        .slick-dots li button:before {
          font-size: 10px;
          line-height: 20px;
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          content: '•';
          text-align: center;
          color: rgba(185, 184, 235, 0.4);
        }
        .slick-dots li.slick-active button:before {
          color: #ff7a4d;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="w-full relative px-4">
      <div className="max-w-[1280px] mx-auto">
        {/* Carousel */}
        <div className="relative">
          {/* Botón anterior */}
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-10 bg-gradient-to-t from-[#e85c30] to-[#ff7a4d] p-3 rounded-full hover:opacity-90 transition-opacity shadow-lg"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Slider */}
          <Slider ref={sliderRef} {...settings}>
            {trackRecordProjects.map((project, index) => (
              <div key={index} className="px-4">
                <TrackRecordCard {...project} onThesisClick={() => setIsModalOpen(true)} />
              </div>
            ))}
          </Slider>

          {/* Botón siguiente */}
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-10 bg-gradient-to-t from-[#e85c30] to-[#ff7a4d] p-3 rounded-full hover:opacity-90 transition-opacity shadow-lg"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
      <ThesisPrivateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}