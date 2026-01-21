import { useState } from 'react';
import { Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import imgAlexAxelCuesta from "figma:asset/042269d2af714c1627e1e04e49b57d73326df1ae.png";
import imgAlejandroGarcia from "figma:asset/858861522cde8283ba04fc9dbe48ab01ceba77db.png";
import imgBorjaNeira from "figma:asset/6f88945f5df80ae321d21f3512c9900e340b994e.png";
import imgAlejandroGilabert from "figma:asset/2953af3a127c5d349962b83a439ebed99bb481a6.png";
import imgEstebanRivero from "figma:asset/e9072eccdf1513b31dd2cace19822372c340a084.png";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  linkedinUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Alejandro García',
    role: 'PROFESOR',
    description: 'Economista con máster en mercados financieros, lleva desde 2018 analizando el ecosistema cripto con foco en protocolos DeFi y métricas on-chain. Ha formado a decenas de alumnos en programas académicos y trabajó como líder de operaciones en la startup Depasify, ayudando a levantar +2M€ en financiación.',
    imageUrl: imgAlejandroGarcia,
    linkedinUrl: 'https://www.linkedin.com/'
  },
  {
    name: 'Borja Neira',
    role: 'PROFESOR',
    description: 'Especialista en tokenización de activos y analista financiero. Candidato a CFA y Proxy Product Owner en Mercedes-Benz, trabaja investigando cómo los activos tokenizados impactan en la lógica tradicional de asignación de carteras.',
    imageUrl: imgBorjaNeira,
    linkedinUrl: 'https://www.linkedin.com/'
  },
  {
    name: 'Alex "Axel" Cuesta',
    role: 'FUNDADOR',
    description: 'Más de 7 años de experiencia analizando mercados financieros, he desarrollado un enfoque propio que combina fundamentos macroeconómicos, lectura institucional y análisis fundamental para entender las claves para que un activo digital triunfe.',
    imageUrl: imgAlexAxelCuesta,
    linkedinUrl: 'https://www.linkedin.com/in/alejandro-cuesta/'
  },
  {
    name: 'Alejandro Gilabert',
    role: 'PROFESOR',
    description: 'Especialista en análisis técnico y trading de criptomonedas. Con amplia experiencia en mercados financieros, combina análisis de datos con estrategias de inversión para ayudar a los alumnos a entender los movimientos del mercado.',
    imageUrl: imgAlejandroGilabert,
    linkedinUrl: 'https://www.linkedin.com/'
  },
  {
    name: 'Esteban Rivero',
    role: 'PROFESOR',
    description: 'Experto en blockchain y tecnologías descentralizadas. Desarrollador y analista con profundo conocimiento técnico del ecosistema cripto, especializado en la evaluación de protocolos y proyectos desde una perspectiva técnica y económica.',
    imageUrl: imgEstebanRivero,
    linkedinUrl: 'https://www.linkedin.com/'
  }
];

export function TeamSectionOptions() {
  const [selectedIndex, setSelectedIndex] = useState(2);
  const member = teamMembers[selectedIndex];

  return (
    <div className="min-h-screen bg-[#010052] w-full px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="font-['Cormorant_Garamond',serif] font-bold text-[60px] leading-[57px] text-white mb-6">
          Conoce al Equipo
        </h2>
        <p className="font-['Inter:Regular',sans-serif] text-[18px] leading-[30px] text-[rgba(185,184,235,0.5)] max-w-[800px] mx-auto">
          El elenco de profesores, a diferencia del resto de escuelas, no está compuesto por "apasionados de las criptomonedas". Llevamos en el sector de las criptomonedas desde 2017 y sumamos más de 30 años de experiencia profesional combinada entre finanzas tradicionales y digitales.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex gap-8 items-start justify-center">
              {/* Barra vertical de thumbnails a la izquierda */}
              <div className="flex flex-col gap-4">
                {teamMembers.map((m, index) => (
                  <button
                    key={m.name}
                    onClick={() => setSelectedIndex(index)}
                    className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
                      index === selectedIndex 
                        ? 'w-24 h-24 ring-4 ring-white/50' 
                        : 'w-20 h-20 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={m.imageUrl} 
                      alt={m.name}
                      className="w-full h-full object-cover brightness-100"
                    />
                  </button>
                ))}
              </div>

              {/* Contenido principal */}
              <div className="flex-1 max-w-[900px]">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  {/* Imagen - 2 columnas */}
                  <div className="md:col-span-2">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name}
                        className="w-full h-full object-cover brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#010052]/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-6 left-6">
                        <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                          <span className="text-xs font-['Inter:Semi_Bold',sans-serif] font-semibold text-white uppercase tracking-wider">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info - 3 columnas */}
                  <div className="md:col-span-3 flex flex-col justify-center space-y-6">
                    <div>
                      <h3 className="font-['Cormorant_Garamond',serif] font-bold text-[38px] leading-tight text-white mb-4">
                        {member.name}
                      </h3>
                      
                      <p className="font-['Inter:Regular',sans-serif] text-[15px] leading-[26px] text-white/70">
                        {member.description}
                      </p>
                    </div>

                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-[#0077b5] hover:border-[#0077b5] transition-all duration-300 w-fit"
                    >
                      <Linkedin className="w-5 h-5 text-white" />
                      <span className="font-['Inter:Medium',sans-serif] text-white">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}