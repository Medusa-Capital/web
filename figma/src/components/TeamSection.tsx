import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import imgAlexAxelCuesta from "figma:asset/3b7b42ba077cb8858388263b267e2ad2f73eeb5a.png";
import imgAlejandroGarcia from "figma:asset/19a52a1c4e3f84d1f4d9e7123f7607a63a282e26.png";
import imgBorjaNeira from "figma:asset/bae1dd69a8dc3f8d23f310a33551e305b0dc5222.png";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  linkedinUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Alex "Axel" Cuesta',
    role: 'FUNDADOR',
    description: 'Más de 7 años de experiencia analizando mercados financieros, he desarrollado un enfoque propio que combina fundamentos macroeconómicos, lectura institucional y análisis fundamental para entender las claves para que un activo digital triunfe.',
    imageUrl: imgAlexAxelCuesta,
    linkedinUrl: 'https://www.linkedin.com/in/alejandro-cuesta/'
  },
  {
    name: 'Alejandro García',
    role: 'PROFESOR',
    description: 'Economista con máster en mercados financieros, lleva desde 2018 analizando el ecosistema cripto con foco en protocolos DeFi y métricas on-chain. Ha formado a decenas de alumnos en programas académicos y trabajó como líder de operaciones en la startup Depasify, ayudando a levantar +2M€ en financiación. Combina visión académica y experiencia práctica para enseñar cómo interpretar los activos digitales con lógica económica y sin depender del ruido del mercado.',
    imageUrl: imgAlejandroGarcia,
    linkedinUrl: 'https://www.linkedin.com/'
  },
  {
    name: 'Borja Neira',
    role: 'PROFESOR',
    description: 'Especialista en tokenización de activos y analista financiero. Candidato a CFA y Proxy Product Owner en Mercedes-Benz, trabaja investigando cómo los activos tokenizados impactan en la lógica tradicional de asignación de carteras. Combina formación financiera rigurosa con un enfoque puramente económico sobre cripto, centrado en DeFi, RWAs y la transformación estructural de los mercados privados.',
    imageUrl: imgBorjaNeira,
    linkedinUrl: 'https://www.linkedin.com/'
  }
];

export function TeamSection() {
  return (
    <div className="w-full px-[384px] py-[80px]">
      {/* Título y descripción */}
      <div className="text-center mb-20">
        <h2 className="font-['Cormorant_Garamond',serif] font-bold text-[60px] leading-[57px] text-white mb-6">
          Conoce al Equipo
        </h2>
        <p className="font-['Inter:Regular',sans-serif] text-[24px] leading-[32px] text-[rgba(185,184,235,0.5)] max-w-[576px] mx-auto">
          Llevamos en el sector de las criptomonedas desde 2018 y sumamos más de 15 años de experiencia combinada en finanzas tradicionales y digitales.
        </p>
      </div>

      {/* Grid de tarjetas del equipo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative group"
          >
            {/* Borde exterior con gradiente */}
            <div className="absolute inset-[-2px] rounded-[22px] bg-gradient-to-br from-[rgba(185,184,235,0.3)] via-[rgba(99,102,241,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Tarjeta principal */}
            <div className="relative rounded-[22px] overflow-hidden backdrop-blur-xl bg-[rgba(1,0,82,0.6)] border border-[rgba(185,184,235,0.1)] transition-all duration-300 group-hover:border-[rgba(185,184,235,0.2)]">
              {/* Efectos de fondo */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[rgba(99,102,241,0.1)] blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-[rgba(185,184,235,0.08)] blur-[40px] rounded-full" />
              </div>

              {/* Contenido */}
              <div className="relative p-6">
                {/* Imagen */}
                <div className="relative w-full aspect-square mb-6 rounded-[16px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(185,184,235,0.1)] to-transparent" />
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* LinkedIn badge */}
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#4355d9] flex items-center justify-center shadow-lg hover:bg-[#5466ea] transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>

                  {/* Badge de rol */}
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1.5 rounded-full bg-[rgba(67,85,217,0.2)] backdrop-blur-sm border border-[rgba(99,102,241,0.3)]">
                      <span className="text-xs font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#b9b8eb] uppercase tracking-wider">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información */}
                <div>
                  <h3 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[24px] leading-tight text-white mb-3">
                    {member.name}
                  </h3>
                  
                  <p className="font-['Inter:Regular',sans-serif] text-[14px] leading-[22.75px] text-[rgba(185,184,235,0.6)]">
                    {member.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}