import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

type TrackRecordCardProps = {
  screenshotUrl: string;
  timestamp: string;
  projectName: string;
  ticker: string;
  roi: string;
  duration: string;
  entryPrice: string;
  exitPrice: string;
  startDate: string;
  endDate: string;
  reasons: string[];
  onThesisClick: () => void;
};

export function TrackRecordCard({ 
  screenshotUrl,
  timestamp,
  projectName,
  ticker,
  roi,
  duration,
  entryPrice,
  exitPrice,
  startDate,
  endDate,
  reasons,
  onThesisClick
}: TrackRecordCardProps) {
  return (
    <div className="relative bg-[rgba(27,26,100,0.5)] rounded-[24px] border border-[rgba(185,184,235,0.2)] overflow-hidden w-full max-w-[400px] mx-auto transition-all duration-300 hover:border-[rgba(185,184,235,0.4)] hover:bg-[rgba(27,26,100,0.6)] group">
      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-transparent pointer-events-none" />
      
      {/* Screenshot con timestamp */}
      <div className="relative h-[260px] overflow-hidden bg-gradient-to-br from-[rgba(27,26,100,0.6)] to-[rgba(1,0,82,0.8)] flex items-center justify-center">
        <ImageWithFallback
          src={screenshotUrl}
          alt={`${projectName} logo`}
          className="w-32 h-32 object-contain"
        />
        
        {/* Timestamp badge */}
        <div className="absolute top-4 right-4 bg-[rgba(1,0,82,0.9)] border border-[rgba(185,184,235,0.3)] px-3 py-1.5 rounded-[8px]">
          <p className="text-white text-xs font-['Inter'] font-medium">{timestamp}</p>
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="relative p-6 space-y-4">
        {/* Título y ROI */}
        <div className="space-y-2">
          <h3 className="text-white font-['Cormorant_Garamond'] text-[28px] font-bold leading-tight">
            {projectName} <span className="text-[#b9b8eb]">{ticker}</span>
          </h3>
          <div className="inline-block bg-gradient-to-r from-[rgba(34,197,94,0.2)] to-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-[8px] px-3 py-1.5">
            <p className="text-[#4dff88] text-[20px] font-['Inter'] font-bold">
              {roi}
            </p>
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[rgba(185,184,235,0.05)] rounded-[8px] p-2">
              <p className="text-[rgba(185,184,235,0.6)] font-['Inter'] text-xs mb-0.5">Entrada</p>
              <p className="text-white font-['Inter'] text-sm font-semibold">{entryPrice}</p>
            </div>
            <div className="bg-[rgba(185,184,235,0.05)] rounded-[8px] p-2">
              <p className="text-[rgba(185,184,235,0.6)] font-['Inter'] text-xs mb-0.5">Salida</p>
              <p className="text-white font-['Inter'] text-sm font-semibold">{exitPrice}</p>
            </div>
          </div>
          
          <div className="bg-[rgba(185,184,235,0.05)] rounded-[8px] p-2">
            <p className="text-[rgba(185,184,235,0.6)] font-['Inter'] text-xs mb-0.5">Duración</p>
            <p className="text-white font-['Inter'] text-sm font-semibold">{duration}</p>
          </div>
        </div>

        {/* Razones */}
        <div className="space-y-2">
          <p className="text-[rgba(185,184,235,0.6)] font-['Inter'] text-xs uppercase tracking-wider">Por qué funcionó</p>
          <div className="space-y-1.5">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#6366f1] mt-0.5 shrink-0">✓</span>
                <p className="text-[rgba(204,204,224,0.85)] font-['Inter'] text-xs leading-relaxed">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Botón */}
        <button 
          onClick={onThesisClick}
          className="w-full mt-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-[12px] px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-[1.02] group/btn"
        >
          <span className="text-white font-['Inter'] font-semibold text-sm">
            Ver Tesis Completa
          </span>
          <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}