import { TrendingDown, Clock } from 'lucide-react';
import { BackgroundEffects } from './VisualEffects';
import Vector from '../imports/Vector-7-305';
import { motion } from 'motion/react';

export function ProblemSection() {
  const problems = [
    {
      icon: <Vector />,
      title: "SIGUEN SEÑALES SIN CRITERIO",
      items: [
        "Compran por FOMO lo que dice un anónimo en Twitter",
        "No entienden QUÉ compraron ni POR QUÉ",
        "Venden en pánico cuando cae -20% (justo antes de la subida)",
        "Pierden 60-80% por no gestionar el riesgo"
      ]
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-[#c5bfe6] stroke-[2.5]" />,
      title: "SABEN PERO EJECUTAN MAL",
      items: [
        "Están +457% arriba y acaban cerrando la posición en negativo",
        "Saben identificar oportunidades pero no cuándo salir",
        "Holdean cadáveres esperando \"la vuelta\"",
        "Saben de DeFi, métricas on-chain... pero no tienen SISTEMA"
      ]
    },
    {
      icon: <Clock className="w-6 h-6 text-[#c5bfe6] stroke-[2.5]" />,
      title: "DAN SU VIDA SIN VER RESULTADOS",
      items: [
        "Investigan 40h a la semana proyectos que nunca despegan",
        "Pagan 5 comunidades, 3 newsletters y leen a 20 analistas distintos",
        "No tienen tiempo para familia, solo para cripto",
        "Resultado: estrés y 0 resultados mientras otros SÍ ganan"
      ]
    }
  ];

  return (
    <section className="w-full py-24 px-8 relative">
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Heading Principal */}
        <h2 className="font-['Cormorant_Garamond'] text-[60px] leading-[57px] font-bold text-white text-center mb-12">
          ¿Por Qué el 90% de los Inversores en Cripto Pierden Dinero?
        </h2>

        {/* Grid de 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {problems.map((problem, index) => (
          <div key={index} className="flex flex-col">
            {/* Icon + Title + Description */}
            <div 
              className="rounded-[30px] p-8 min-h-[280px] bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(255,68,68,0.3)] hover:shadow-[0_0_20px_rgba(255,68,68,0.3)] transition-all duration-300"
            >
              <div className="mb-6 w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)] hover:shadow-[0_0_20px_rgba(197,191,230,0.5)] transition-shadow duration-300">
                <div className="w-6 h-6 text-[#c5bfe6]">
                  {problem.icon}
                </div>
              </div>
              <div className="border-b border-[rgba(255,255,255,0.1)] mb-4 pb-1"></div>
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-white mb-4 leading-tight">
                {problem.title}
              </h3>
              <div className="space-y-3">
                {problem.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <span className="text-[#ff4444] mt-1 shrink-0 text-lg">✗</span>
                    <p className="font-['Inter'] text-base text-[rgba(204,204,224,0.9)] leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        </div>

        {/* CTA Card Full Width */}
        <div className="max-w-[1200px] mx-auto mt-8">
          {/* TESTIMONIOS - Opción 4: Diseño Minimalista Premium */}
          <div className="relative">
            {/* Background layers para profundidad */}
            <div className="absolute -inset-4 bg-[rgba(197,191,230,0.03)] rounded-[30px] blur-2xl"></div>
            
            <div className="relative bg-[rgba(197,191,230,0.04)] rounded-[28px] p-8 border border-[rgba(197,191,230,0.15)] shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
              
              {/* Title con gradiente y shadow */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h3 className="font-['Cormorant_Garamond'] text-4xl font-bold mb-2 relative inline-block">
                  <span className="bg-gradient-to-r from-white via-[#c5bfe6] to-white bg-clip-text text-transparent">
                    LO QUE DICEN NUESTROS ALUMNOS
                  </span>
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5bfe6] to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  ></motion.div>
                </h3>
              </motion.div>
              
              {/* Quick quotes - Bento Grid Style */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  '"Ahora las inversiones hacen lo suyo mientras duermo tranquilo"',
                  '"Aprendí a filtrar el ruido y a medir riesgos de verdad"',
                  '"Estáis en el lugar adecuado para desarrollaros como inversores"'
                ].map((quote, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                    whileHover={{ 
                      y: -8,
                      transition: { type: "spring", stiffness: 400 }
                    }}
                    className="relative group"
                  >
                    {/* Card glow on hover */}
                    <div className="absolute -inset-2 bg-[rgba(197,191,230,0.15)] rounded-[20px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative h-full bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] rounded-[16px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover:border-[rgba(197,191,230,0.3)] transition-all duration-300">
                      {/* Shine effect */}
                      <div className="absolute top-0 left-0 right-0 h-[40%] bg-[rgba(197,191,230,0.03)] rounded-t-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-[rgba(197,191,230,0.08)] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-sm">💬</span>
                        </div>
                        <p className="font-['Inter'] text-sm text-[rgba(204,204,224,0.95)] leading-relaxed font-medium">
                          {quote}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Featured testimonial - Hero Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                {/* Outer glow */}
                <div className="absolute -inset-2 bg-[rgba(197,191,230,0.08)] rounded-[24px] blur-xl opacity-50"></div>
                
                <div className="relative bg-[rgba(197,191,230,0.04)] border-2 border-[rgba(197,191,230,0.2)] rounded-[22px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                  
                  {/* Profile */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative">
                      <motion.div 
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        className="w-14 h-14 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(197,191,230,0.4)] relative ring-2 ring-[rgba(197,191,230,0.4)]"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODE1NDc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                          alt="Bruno"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        {/* Inner shine overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
                      </motion.div>
                      
                      {/* Animated rings */}
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-[rgba(197,191,230,0.3)]"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold text-white">Bruno, 51 años</h4>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <motion.span 
                            key={i}
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 1 + i * 0.08, type: "spring" }}
                            whileHover={{ scale: 1.3, rotate: 20 }}
                            className="text-yellow-400 text-sm cursor-pointer"
                          >⭐</motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Review text - Resumido */}
                  <div className="pl-4 border-l-2 border-[rgba(197,191,230,0.3)]">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="font-['Inter'] text-sm text-[rgba(204,204,224,0.95)] leading-relaxed mb-4"
                    >
                      "Siendo muy sincero, he dejado de ganar mucho dinero por hacer el TONTO durante 3 ciclos de BTC. Perdiendo con ICOs, altcoins, con memes...  Doy las gracias por haber encontrado este equipo que me facilita la vida y me da tiempo para otras cosas más importantes, las inversiones siguen haciendo lo suyo mientras duermo plácidamente, cosas que antes ni podía hacer tranquilo por jugármela directamente en el casino día tras día.
                    </motion.p>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="font-['Inter'] text-sm text-[rgba(204,204,224,0.95)] leading-relaxed mb-4"
                    >
                      GRACIAS DE VERDAD, aquí nada de peloteo, el trabajo que hace no vale lo que cuesta. (Que por cierto ya está más que rentabilizado)
                    </motion.p>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                      className="font-['Inter'] text-sm text-[rgba(204,204,224,0.95)] leading-relaxed"
                    >
                      Seguramente entren muchos en fomo, pero <strong className="text-white">el momento de hacer patrimonio es AHORA</strong>"
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
