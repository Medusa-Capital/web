import Image from "next/image";

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
    <section className="relative py-[100px] px-6 mt-0">
      <div className="max-w-6xl mx-auto text-center">
        {/* Content wrapper with gradient border - matching legacy content-sec */}
        <div
          className="relative rounded-[clamp(30px,4vw,44px)] px-[clamp(40px,6vw,96px)] py-[70px] gradient-border"
          style={{
            background: "linear-gradient(0deg, rgba(1, 0, 82, 1) 0%, rgba(185, 184, 235, 0.1) 100%)",
          }}
        >
          {/* Medusa coin logo */}
          <div className="mb-10 flex justify-center">
            <Image
              src="/img/content-logo.webp"
              alt="Medusa Capital"
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24"
            />
          </div>

          {/* Headline - matching legacy styling */}
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,4.5vw,60px)] font-bold text-white leading-tight mb-16 max-w-4xl mx-auto">
            Ayudamos a inversores tradicionales a entender cripto con el mismo
            rigor con el que analizan acciones o ETFs
          </h2>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-[family-name:var(--font-heading)] text-[clamp(40px,5vw,60px)] font-bold text-[#B9B8EB] mb-4">
                  {stat.value}
                </div>
                <p className="text-[#cccce0]/60 text-sm leading-relaxed max-w-[200px] mx-auto">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
