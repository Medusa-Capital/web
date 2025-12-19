export function Stats() {
  const stats = [
    {
      value: "+200",
      label: "Alumnos han aprendido a gestionar su cartera con nosotros",
    },
    {
      value: "+50",
      label: "Reseñas positivas avalan el método utilizado durante estos dos años",
    },
    {
      value: "+20.000",
      label: "Seguidores interesados en formación referente a activos digitales",
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#0a0a2e] to-[#050520]">
      <div className="max-w-5xl mx-auto text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 34 35"
              fill="none"
            >
              <circle cx="17" cy="17.5" r="14" fill="white" />
              <path
                d="M7 27C1.5 21.5 1.5 12.6 7 7.1"
                stroke="#9392DF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold text-[#CCCCE0] leading-tight mb-16 max-w-4xl mx-auto">
          Ayudamos a inversores tradicionales a entender cripto con el mismo
          rigor con el que analizan acciones o ETFs
        </h2>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-bold text-[#CCCCE0] mb-3">
                {stat.value}
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
