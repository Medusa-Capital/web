import { useEffect, useRef } from 'react';

const testimonialsColumn1 = [
  {
    name: 'Jailum0',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    text: 'Ya tenía conocimientos y portafolio, me he formado en otras academias y tenía algo de experiencia, lo que he encontrado aquí es muy top, la formación no había visto de esta calidad ni de cerca y si día a día aquí es muy top, hay gente con conocimientos brutales y con ganas de ayudarte las 1000 dudas que puedas tener.'
  },
  {
    name: 'osadiafranx',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    text: 'La cantidad de valor que da Axel, ya sea en el aspecto macroeconómico con gente top, análisis semanales del mercado, defi, airdrops y prácticamente cualquier sector relacionado con este mundo, es muy muy grande. Si alguien está dudando si entrar, mi recomendación es que lo prueben sin duda porque, si invierte el tiempo necesario, va a aprender el triple de rápido que si lo hiciese por su cuenta.'
  },
  {
    name: 'SrSantos',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    text: 'Aunque parece que no estoy mucho en el discord, soy como un adicto a este canal y he tenido el placer de hablar con algunos de ustedes, no se pierden nada en el mercado. No me arrepiento de lo que pagué para estar aquí.'
  }
];

const testimonialsColumn2 = [
  {
    name: 'Isaac B1.',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    text: 'Ya tenía conocimientos y portafolio, me he formado en otras academias y tenía algo de experiencia, lo que he encontrado aquí es muy top, la formación no había visto de esta calidad ni de cerca y si día a día aquí es muy top, hay gente con conocimientos brutales y con ganas de ayudarte las 1000 dudas que puedas tener.'
  },
  {
    name: 'SrSantos',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    text: 'Aunque parece que no estoy mucho en el discord, soy como un adicto a este canal y he tenido el placer de hablar con algunos de ustedes, no se pierden nada en el mercado. No me arrepiento de lo que pagué para estar aquí, al contrario, si no lo hubiera hecho quien sabe que tan estúpido hubiera sido esta bullrun jajaja aprovechemos lo que queda del ciclo del mercado LFG'
  },
  {
    name: 'osadiafranx',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    text: 'La cantidad de valor que da Axel, ya sea en el aspecto macroeconómico con gente top, análisis semanales del mercado, defi, airdrops y prácticamente cualquier sector relacionado con este mundo, es muy muy grande.'
  }
];

const testimonialsColumn3 = [
  {
    name: 'Jailum0',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    text: 'Hablaba sobre macroeconomía y análisis técnicos.'
  },
  {
    name: 'Isaac B1.',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    text: 'Ya tenía conocimientos y portafolio, me he formado en otras academias y tenía algo de experiencia, lo que he encontrado aquí es muy top, la formación no había visto de esta calidad ni de cerca y si día a día aquí es muy top, hay gente con conocimientos brutales y con ganas de ayudarte las 1000 dudas que puedas tener.'
  },
  {
    name: 'Doni',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    text: 'Fue gracias a la trinchera que encontré el segundo token que mas he estado acumulando y que mejores ganancias espero de él, creo que no es un spoiler pues Axel lo comparte bastante en sus redes, pero sin la trinchera no hubiese podido pillar HYPE a tiempo.'
  },
  {
    name: 'Jordi77',
    role: 'Alumno',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
    text: 'Material de primera y comunidad muy activa.'
  }
];

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-gradient-to-br from-[rgba(79,70,229,0.15)] via-[rgba(99,102,241,0.1)] to-[rgba(139,92,246,0.08)] backdrop-blur-md border border-[rgba(139,92,246,0.25)] rounded-2xl p-5 mb-4 transition-all duration-300 hover:border-[rgba(185,184,235,0.4)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.25)]">
      {/* Header: Avatar + Nombre */}
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name}
          className="w-12 h-12 rounded-full border-2 border-[rgba(185,184,235,0.3)]"
        />
        <div>
          <p className="font-['Inter'] text-sm font-semibold text-white leading-tight">
            {testimonial.name}
          </p>
          <p className="font-['Inter'] text-xs text-[rgba(185,184,235,0.6)] leading-tight">
            {testimonial.role}
          </p>
        </div>
      </div>

      {/* Texto del testimonio */}
      <p className="font-['Inter'] text-sm leading-relaxed text-[rgba(204,204,224,0.8)]">
        {testimonial.text}
      </p>
    </div>
  );
}

export function TestimonialsOption3() {
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let scrollPosition1 = 0;
    let scrollPosition2 = 0;
    let scrollPosition3 = 0;

    const animate = () => {
      // Velocidades más lentas y diferentes para efecto parallax suave
      scrollPosition1 += 0.2;
      scrollPosition2 += 0.35;
      scrollPosition3 += 0.25;

      if (column1Ref.current) {
        const maxScroll = column1Ref.current.scrollHeight / 2;
        if (scrollPosition1 >= maxScroll) scrollPosition1 = 0;
        column1Ref.current.style.transform = `translateY(-${scrollPosition1}px)`;
      }

      if (column2Ref.current) {
        const maxScroll = column2Ref.current.scrollHeight / 2;
        if (scrollPosition2 >= maxScroll) scrollPosition2 = 0;
        column2Ref.current.style.transform = `translateY(-${scrollPosition2}px)`;
      }

      if (column3Ref.current) {
        const maxScroll = column3Ref.current.scrollHeight / 2;
        if (scrollPosition3 >= maxScroll) scrollPosition3 = 0;
        column3Ref.current.style.transform = `translateY(-${scrollPosition3}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="w-full relative py-24 px-8 overflow-hidden">
      {/* Título y descripción */}
      <div className="text-center mb-16 max-w-[896px] mx-auto">
        <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[60px] leading-[75px] not-italic text-white mb-4">
          Qué dicen Nuestros Alumnos
        </h2>
        <p className="font-['Inter'] text-base leading-relaxed text-[rgba(204,204,224,0.7)]">
          Nuestra formación ha cambiado la manera en la que nuestros alumnos perciben
          el sistema monetario. Ahora conocen el sistema y tienen las herramientas para
          rentabilizar su dinero. Aquí tienes algunos testimonios sobre su aprendizaje.
        </p>
      </div>

      {/* Masonry Layout con Parallax */}
      <div className="max-w-[1200px] mx-auto relative">
        {/* Máscaras de fade superior e inferior */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#010052] via-[#010052] to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#010052] via-[#010052] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 h-[700px] overflow-hidden">
          {/* Columna 1 */}
          <div className="flex-1">
            <div ref={column1Ref}>
              {[...testimonialsColumn1, ...testimonialsColumn1].map((testimonial, index) => (
                <TestimonialCard key={`col1-${index}`} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* Columna 2 */}
          <div className="flex-1">
            <div ref={column2Ref}>
              {[...testimonialsColumn2, ...testimonialsColumn2].map((testimonial, index) => (
                <TestimonialCard key={`col2-${index}`} testimonial={testimonial} />
              ))}
            </div>
          </div>

          {/* Columna 3 */}
          <div className="flex-1">
            <div ref={column3Ref}>
              {[...testimonialsColumn3, ...testimonialsColumn3].map((testimonial, index) => (
                <TestimonialCard key={`col3-${index}`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}