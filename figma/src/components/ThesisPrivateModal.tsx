import { X } from 'lucide-react';

type ThesisPrivateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ThesisPrivateModal({ isOpen, onClose }: ThesisPrivateModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-[rgba(1,0,82,0.9)] backdrop-blur-md" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-[500px] bg-gradient-to-br from-[rgba(27,26,100,0.95)] to-[rgba(1,0,82,0.95)] backdrop-blur-lg rounded-[24px] border-2 border-[rgba(185,184,235,0.3)] overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.1)] via-transparent to-[rgba(139,92,246,0.1)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-[rgba(99,102,241,0.2)] rounded-full blur-[100px] pointer-events-none" />
        
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(185,184,235,0.1)] hover:bg-[rgba(185,184,235,0.2)] transition-all duration-300 group"
        >
          <X className="w-5 h-5 text-[rgba(185,184,235,0.7)] group-hover:text-white transition-colors" />
        </button>

        {/* Contenido */}
        <div className="relative p-8 space-y-6">
          {/* Icono */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(99,102,241,0.3)] to-[rgba(139,92,246,0.3)] border-2 border-[rgba(185,184,235,0.3)] flex items-center justify-center">
              <span className="text-5xl">🔒</span>
            </div>
          </div>

          {/* Título */}
          <h2 className="text-white font-['Cormorant_Garamond'] text-4xl font-bold text-center leading-tight">
            Tesis Privadas
          </h2>

          {/* Mensaje */}
          <p className="text-[rgba(204,204,224,0.8)] font-['Inter'] text-base text-center leading-relaxed">
            Las tesis de inversión completas son <span className="text-white font-semibold">contenido exclusivo</span> para los miembros de Medusa Capital.
          </p>

          {/* Detalles adicionales */}
          <div className="bg-[rgba(99,102,241,0.1)] border border-[rgba(185,184,235,0.2)] rounded-[16px] p-4">
            <p className="text-[rgba(185,184,235,0.7)] font-['Inter'] text-sm text-center leading-relaxed">
              Incluyen análisis detallado, contexto de mercado, métricas clave y estrategias de entrada/salida validadas.
            </p>
          </div>

          {/* Botón de acción */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-[12px] px-6 py-4 text-white font-['Inter'] font-semibold text-base transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-[1.02]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
