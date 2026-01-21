export const blogPosts = [
  {
    id: 1,
    title: '¿Es Lighter el Fin de Hyperliquid?',
    excerpt: 'Análisis profundo sobre la competencia entre Hyperliquid y Lighter. Comparamos métricas, sostenibilidad económica y modelos de negocio para determinar si la caída del precio de $HYPE está justificada.',
    category: 'Análisis',
    date: '11 Diciembre 2024',
    readTime: '15 min',
    image: 'https://pbs.twimg.com/media/G7vYzWBWoAA4UvJ?format=jpg&name=large',
    featured: true,
    link: 'https://x.com/Axel_Mnvn/status/1999128511018135802'
  },
  {
    id: 2,
    title: 'Cómo Identificar Proyectos con Potencial 10x',
    excerpt: 'Descubre la metodología exacta que usamos en Medusa para detectar gemas antes del pump.',
    category: 'Análisis',
    date: '10 Enero 2025',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop',
    featured: true
  },
  {
    id: 3,
    title: 'Gestión de Riesgo en Criptomonedas: La Guía Definitiva',
    excerpt: 'Aprende a proteger tu capital mientras maximizas las oportunidades en el mercado cripto.',
    category: 'Educación',
    date: '8 Enero 2025',
    readTime: '12 min',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop',
    featured: true
  },
  {
    id: 4,
    title: 'Análisis: El Ecosistema Solana en 2025',
    excerpt: 'Desglosamos las mejores oportunidades DeFi en Solana y por qué sigue siendo relevante.',
    category: 'Research',
    date: '5 Enero 2025',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=500&fit=crop',
    featured: true
  },
  {
    id: 5,
    title: 'Tokenomics: Cómo Leer Entre Líneas',
    excerpt: 'Las red flags más importantes que debes detectar antes de invertir en cualquier proyecto.',
    category: 'Análisis',
    date: '3 Enero 2025',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=500&fit=crop',
    featured: false
  },
  {
    id: 6,
    title: 'DeFi en 2025: Tendencias y Oportunidades',
    excerpt: 'Los protocolos DeFi que están transformando las finanzas descentralizadas este año.',
    category: 'DeFi',
    date: '1 Enero 2025',
    readTime: '9 min',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=500&fit=crop',
    featured: false
  },
  {
    id: 7,
    title: 'Psicología del Trading: Evita Errores Emocionales',
    excerpt: 'Cómo mantener la disciplina y evitar las trampas mentales más comunes en trading.',
    category: 'Trading',
    date: '28 Diciembre 2024',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&h=500&fit=crop',
    featured: false
  }
];

export const articleContents: { [key: number]: JSX.Element } = {
  1: (
    <div className="article-content">
      {/* Introducción */}
      <div className="mb-12">
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Siempre que el precio de un token cae salen narrativas que buscan apoyar el movimiento. Al igual que los mercados son yonkis de la liquidez o los gobiernos del déficit, nosotros, los inversores, somos unos completos yonkis de los precios. Si el precio sube, el proyecto es mejor percibido a ojos del público. ¿Las métricas? No importan si no siguen al precio, los inversores solo tienen ojos para el gráfico.
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Nuestra percepción sobre un proyectos mejora o empeora en base al precio. Esto se conoce como <span className="text-[#b9b8eb] font-semibold">reflexividad</span> y explica muchas de las burbujas financieras ya que crea distorsiones en el corto plazo.
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Este punto es justamente el que discutiremos a continuación. Durante estas semanas hemos visto como Hyperliquid ha cedido terreno a competidores. Ligher, principalmente, ha sido el DEX de perpetuos que está eclipsando el precio de $HYPE. Pero el punto clave es determinar si está acción del precio (-53% desde ATH) es justificada o si, por el contrario, el precio está siendo reflejo de ruido de corto plazo.
        </p>
        
        {/* CTA para interacción */}
        <div className="backdrop-blur-md bg-[rgba(99,102,241,0.1)] rounded-[16px] p-6 border border-[rgba(99,102,241,0.3)] mb-6">
          <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.9)] text-center">
            Antes de ponernos manos a la obra, déjate un <span className="text-[#b9b8eb] font-semibold">RT & MG</span> que es gratis 😉
          </p>
        </div>
        
        <p className="font-['Inter'] text-[18px] leading-[32px] text-white font-semibold text-center">
          Vamos al lío.
        </p>
      </div>

      {/* Sección: Comparación */}
      <div className="mb-12">
        <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[42px] leading-[52px] text-white mb-6">
          ¿Podemos Comparar Hyperliquid & Ligher?
        </h2>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Aquí es donde deberíamos fijar el tiro antes de seguir avanzando. Al igual que no tendría sentido comparar una acción tecnológica con una empresa de uranio, no tiene sentido comparar un DEX de perpetuos (@Lighter_xyz) con el AWS de liquidez (@HyperliquidX).
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)]">
          Antes de comparar ambos protocolos, vamos a hacer unas distinciones clave.
        </p>
      </div>

      {/* Hyperliquid */}
      <div className="mb-12 backdrop-blur-md bg-[rgba(27,26,100,0.3)] rounded-[24px] p-8 border border-[rgba(185,184,235,0.2)]">
        <h3 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[32px] leading-[42px] text-[#b9b8eb] mb-4">
          Hyperliquid
        </h3>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          Hyperliquid es una blockchain de alto rendimiento construida con la visión de un sistema financiero abierto totalmente onchain. La liquidez, las aplicaciones de usuario y la actividad comercial se sinergian en una plataforma unificada que, en última instancia, albergará todas las finanzas.
        </p>
        <p className="font-['Inter'] text-[20px] leading-[32px] text-white font-semibold italic mb-4 text-center">
          "House of all Finance"
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          La visión largoplacista de Hyperliquid no tiene nada que ver con cualquier proyecto que se esté desarrollando actualmente. Jeff, el fundador de HL, lo dejo claro hace escasas semanas en una conferencia. No son un mero de DEX de perpetuos, por tanto, encasillarlos como tal pretendiendo compararlos con sus pares, no tiene sentido.
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)]">
          El equipo de HL se centró en crear una blockchain especifica de alto rendimiento enfocada en trading HFT donde los incentivos están alineados para que traders minoristas, traders profesionales, LPs y MMs convivan en una misma plataforma donde las reglas sean equitativas para cada uno de ellos.
        </p>
      </div>

      {/* Lighter */}
      <div className="mb-12 backdrop-blur-md bg-[rgba(27,26,100,0.3)] rounded-[24px] p-8 border border-[rgba(185,184,235,0.2)]">
        <h3 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[32px] leading-[42px] text-[#b9b8eb] mb-4">
          Lighter
        </h3>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          Lighter es una plataforma de comercio descentralizada construida para una seguridad y escala inigualables. Es el primer DEX que ofrece order matching y liquidaciones verificables, al tiempo que ofrece el mejor rendimiento de su clase a la par con los CEX.
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          A diferencia de HL, Ligther no ha creado una blockchain específica para trading de alta frecuencia. Sin embargo, ofrece una ejecución tipo CEX, pero de forma verificable onchain.
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)]">
          Ligther opera sobre Ethereum mediante pruebas ZK con un order book centralizado en su L2. Las transacciones se ordenan siguiendo el método FIFO, es decir, primer orden que entra, primera que se ejecuta. Los fondos de los usuarios permanecen en contratos inteligentes de Ethereum y tiene un mecanismo de "escape de emergencia" (escape hatch) a traes del cual los usuarios pueden retirar fondos si la L2 falla.
        </p>
      </div>

      {/* Nota técnica */}
      <div className="mb-12 backdrop-blur-md bg-[rgba(99,102,241,0.05)] rounded-[16px] p-6 border border-[rgba(99,102,241,0.2)]">
        <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.8)] italic">
          Simplificando mucho, Lighter se apoya en la seguridad de Ethereum y permite verificar las operaciones en cadena (con cierto retraso). Por el lado de HL, se depende de la confianza en validadores e incentivos de su L1.
        </p>
      </div>

      <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-12">
        Una vez hemos discernido está diferenciación clave entre ambas plataformas, podemos proceder a analizar la competencia que supone Ligther para Hyperliquid en la rama de DEX de perpetuos.
      </p>

      {/* Competencia */}
      <div className="mb-12">
        <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[42px] leading-[52px] text-white mb-6">
          Competencia: Ligther Coge la Delantera
        </h2>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Durante estas últimas semanas hemos visto como Hyperliquid perdía dominancia en el mercado de perpetuos. Vamos a analizar estos números para determinar como ha evolucionado.
        </p>

        <h3 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[28px] leading-[38px] text-white mb-4">
          1. Evolución de la Cuota de Mercado
        </h3>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          Este primer gráfico muestra claramente cómo el mercado pasó de ser un monopolio de Hyperliquid a un escenario fragmentado a finales de 2025.
        </p>
        <ul className="list-disc list-inside space-y-3 mb-6 font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)]">
          <li><span className="text-[#b9b8eb] font-semibold">Hyperliquid:</span> Mantuvo una posición dominante (&gt;66%) durante gran parte del año, pero sufrió una erosión significativa en el Q4 debido a las copias que nacieron a raíz del éxito de Hyperliquid.</li>
          <li><span className="text-[#b9b8eb] font-semibold">Lighter:</span> Su crecimiento fue repentino en abril donde irrumpió en el mercado capturando una cuota de mercado del 20% en apenas un mes. Esto se debió a la especulación de un airdrop estilo Hyperliquid y su equipo destacado dentro del sector de perps.</li>
        </ul>

        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          El mercado ha pasado de ser un monopolio de Hyperliquid a un oligopolio fragmentado en tres partes casi iguales.
        </p>

        <div className="backdrop-blur-md bg-[rgba(99,102,241,0.1)] rounded-[16px] p-6 border border-[rgba(99,102,241,0.3)] mb-6">
          <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.9)] mb-3">
            <span className="font-semibold text-white">Datos semana 1/12/2025:</span>
          </p>
          <ul className="space-y-2 font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.9)]">
            <li>• Ligther: <span className="text-[#b9b8eb] font-semibold">23%</span></li>
            <li>• Aster: <span className="text-[#b9b8eb] font-semibold">19.4%</span></li>
            <li>• Hyperliquid: <span className="text-[#b9b8eb] font-semibold">16.34%</span></li>
            <li>• EdgeX: <span className="text-[#b9b8eb] font-semibold">11.6%</span></li>
          </ul>
        </div>

        <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.7)] italic mb-6">
          Voy a añadir Aster y EdgeX por ser fiel a los datos proporcionados por Defillama, pero dado los ingresos que está generando Hyperliquid soy más partidario de que estos datos estén falseados o no sean orgánicos.
        </p>
      </div>

      {/* Trayectoria de Lighter */}
      <div className="mb-12">
        <h3 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[28px] leading-[38px] text-white mb-4">
          2. Trayectoria de Lighter: Crecimiento Explosivo
        </h3>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          El crecimiento del volumen de Lighter es un hecho. Ha pasado de mover en Mar '25 $12,1B a situarse en Nov '25 en $90B. Esto supone un incremento del <span className="text-[#b9b8eb] font-semibold">+850%</span> en apenas 8 meses.
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          Aquí es donde entra la comparación: Lighter ha logrado equiparar e incluso superar el volumen mensual de Hyperliquid en Octubre/Noviembre 2025
        </p>

        <div className="backdrop-blur-md bg-[rgba(27,26,100,0.4)] rounded-[24px] p-8 border border-[rgba(185,184,235,0.3)] mb-6">
          <ul className="space-y-3 font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)]">
            <li><span className="text-white font-semibold">Oct '25:</span> Hyperliquid $308B vs. Lighter $272B.</li>
            <li><span className="text-white font-semibold">Nov '25:</span> Hyperliquid $243B vs. Lighter $292B</li>
          </ul>
        </div>

        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          Si miramos el TVL, Ligther ha visto también como sus métricas se disparaban hasta llegar, ahora mismo a tener su LLP (Ligther Liquidty Provider) un capital total bloqueado de $619M.
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Es cierto que el último repunte fue propiciado, en parte, por el deposito de $50M de @justinsuntron con el objetivo, presumiblemente, de capturar puntos en la última season pre-TGE.
        </p>

        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Por el lado de HL, el TVL se vio mermado desde Oct '25 y ha caído entorno a un 30% desde ATH ($602M). Se debe recalcar que el vault de HL ha conseguido un PNL desde sus inicios de +$118M con un DD máximo del 5,68%.
        </p>
      </div>

      {/* Eficiencia de Capital */}
      <div className="mb-12">
        <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[42px] leading-[52px] text-white mb-6">
          3. Eficiencia de Capital y Señales de Wash Trading
        </h2>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Esta es la métrica más importante. Nos confirma que el FUD entorno a la viabilidad de que Hyperliquid mantenga su cuota de mercado no tiene sentido. No lo tiene al menos por el momento. Con los datos encima de la mesa no se pueden sacar resultados debido a los subsidios por parte de Lighter.
        </p>

        <h3 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[28px] leading-[38px] text-white mb-4">
          Calidad del Volumen (OI/Volumen)
        </h3>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-4">
          Este ratio es clave para determinar la calidad del volumen que se mueve en ambas plataformas. Un mayor volumen no denota mayor calidad per se. La métrica a tener en cuenta siempre debe ser el Open Interest, es decir, la cantidad total de posiciones apalancadas abiertas. El volumen es muy fácil de falsear. El OI, por el contrario, es una métrica mucho más fidedigna.
        </p>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Para saber como de sostenible es el volumen, usaremos el ratio OI/VOL, de esta manera podremos observar como de mercenario es el capital.
        </p>

        <div className="backdrop-blur-md bg-[rgba(27,26,100,0.4)] rounded-[24px] p-8 border border-[rgba(185,184,235,0.3)] mb-6">
          <p className="font-['Inter'] text-[18px] leading-[32px] text-white mb-4 font-semibold">
            Análisis de 48 semanas de datos (Enero-Noviembre 2025):
          </p>
          <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)]">
            Hyperliquid mantiene un ratio OI/Volume de <span className="text-[#b9b8eb] font-semibold">0.127</span> versus <span className="text-[#b9b8eb] font-semibold">0.024</span> de Lighter, una diferencia de <span className="text-white font-semibold">5.4 veces</span> que deja claro el compromiso de capital fundamentalmente diferente.
          </p>
        </div>

        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Por cada $100 en volumen tradado, Hyperliquid retiene $12.73 en posiciones abiertas mientras Lighter solo $2.37. Esto significa que <span className="text-[#b9b8eb] font-semibold">97.6% del volumen de Lighter es rotación inmediata</span>, el patrón característico de wash trading y farming sistemático debido al inminente airdrop.
        </p>

        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          La tasa de rotación (turnover) es de 42x en Lighter (vs. 7.9x en HL) requiere que cada dólar de Open Interest genere $42 en volumen. Este nivel de velocidad es técnicamente imposible un humano y es evidencia directa de bots ejecutando farming de volumen.
        </p>
      </div>

      {/* Sostenibilidad Económica */}
      <div className="mb-12">
        <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[42px] leading-[52px] text-white mb-6">
          4. Sostenibilidad Económica (Monetización)
        </h2>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          El análisis de ingresos (Revenue) revela dos modelos de negocio opuestos.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="backdrop-blur-md bg-[rgba(99,102,241,0.1)] rounded-[16px] p-6 border border-[rgba(99,102,241,0.3)]">
            <h4 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[24px] text-white mb-3">Hyperliquid</h4>
            <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.9)] mb-3">
              Ha generado consistentemente entre <span className="text-[#b9b8eb] font-semibold">$80M y $110M mensuales</span> en ingresos por perpetuos desde junio.
            </p>
            <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.9)]">
              Además, su comisión efectiva (take rate): Se mantiene saludable entre 2.5 y 3.5 puntos básicos (bps). Los usuarios están dispuestos a pagar por la ejecución. Es decir, <span className="text-white font-semibold">Hyperliquid tienen Product-Market Fit.</span>
            </p>
          </div>

          <div className="backdrop-blur-md bg-[rgba(185,184,235,0.1)] rounded-[16px] p-6 border border-[rgba(185,184,235,0.3)]">
            <h4 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[24px] text-white mb-3">Lighter (El Subsidio)</h4>
            <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.9)] mb-3">
              Sus ingresos son una fracción de su volumen. En Octubre generó solo <span className="text-[#b9b8eb] font-semibold">$7M</span> a pesar de mover $272B. Su take rate es extremadamente bajo, oscilando entre 0.25 bps y 0.84 bps.
            </p>
            <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.9)]">
              Lighter está operando con márgenes mínimos (o negativos si consideramos costes de incentivos no mostrados). Cobra <span className="font-semibold">10 veces menos</span> que Hyperliquid por dólar movido. Su crecimiento está "comprado" mediante tarifas baratas e incentivos.
            </p>
          </div>
        </div>

        <div className="backdrop-blur-md bg-[rgba(99,102,241,0.05)] rounded-[16px] p-6 border border-[rgba(99,102,241,0.2)] mb-6">
          <p className="font-['Inter'] text-[18px] leading-[32px] text-white font-semibold mb-3">
            ¿Es esto negativo?
          </p>
          <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.8)]">
            Depende de por donde lo miremos. Es bien sabido que las start-ups en etapas iniciales deben realizar movimientos agresivos con el objetivo de capturar cuota de mercado. En el caso de Ligther el reclamo y slogan es claro: <span className="text-[#b9b8eb] font-semibold">0% fees para el retail</span>. Sin embargo, eso, como vemos en el gráfico, tiene sus consecuencias.
          </p>
        </div>
      </div>

      {/* Conclusiones */}
      <div className="mb-12">
        <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[42px] leading-[52px] text-white mb-6">
          Conclusiones
        </h2>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Hyperliquid captura <span className="text-[#b9b8eb] font-semibold">$285.1 en revenue por cada $1B</span> de volumen negociado, comparado con solo $53.5 de Lighter, una diferencia de efectividad de <span className="font-semibold text-white">5.3 veces</span>. Con un take rate de 0.0285% por debajo del rango estándar de la industria, HL generó $807.5M en revenue durante 2025 de manera consistente (12/12 meses). Lighter, con take rate de 0.0054%, solo generó $35.1M desde octubre.
        </p>

        <div className="backdrop-blur-md bg-[rgba(27,26,100,0.4)] rounded-[24px] p-8 border-2 border-[rgba(99,102,241,0.4)] mb-6">
          <p className="font-['Inter'] text-[18px] leading-[32px] text-white font-semibold mb-4">
            Si Lighter cobrara fees a las mismas tasas que HL (0.0285% vs 0.0054%), habría generado $187M en revenue durante Oct-Dic en lugar de los $35M reportados.
          </p>
          <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)]">
            Para que nos entendamos, esto representa un <span className="text-[#b9b8eb] font-semibold">subsidio implícito de $152M en solo tres meses</span>. Este análisis de la comisión efectiva entre ambos protocolos nos confirma que Lighter está subsidiando 81% de su revenue potencial para capturar market share mediante modelo 0% fees.
          </p>
        </div>

        <div className="backdrop-blur-md bg-[rgba(99,102,241,0.05)] rounded-[16px] p-6 border border-[rgba(99,102,241,0.2)] mb-8">
          <p className="font-['Inter'] text-[18px] leading-[32px] text-white font-semibold mb-3">
            Volvemos a lo mismo, ¿Es esto negativo?
          </p>
          <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.8)] mb-4">
            En un momento de mercado donde cada día prima más la capacidad de generar revenue, sobre todo, ser capaz de trasladar ese valor al token, un proyecto que subsidia fuertemente al retail está dejando encima de la mesa mucho revenue, por tanto, se está capando el posible upside.
          </p>
          <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.8)]">
            El modelo de negocio que está intentando replicar es el que ha llevado a cabo Robinhood, curiosamente backer de Lighter. Este modelo de basa en fijar una fee implícita 0% para el retail, pero perjudicarlo mediante latencia (maker/cancel 0 ms, taker 150 ms). Aquí he de decir que lighter no oculta nada. Deja bien claro lo que ofrece la cuenta estándar (0% fees) y premium con fees de 0.002% para makers y 0.02% para takers, pero sin apenas latencia. La cuenta premium está enfocada en HFT y actores profesionales, pero cualquiera puede usarla.
          </p>
        </div>
      </div>

      {/* Incentivos */}
      <div className="mb-12">
        <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[42px] leading-[52px] text-white mb-6">
          Incentivos
        </h2>
        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Este es, sin duda, el punto más crucial para entender donde falla el modelo de Ligther. Quieren ser todo en 1:
        </p>

        <ul className="list-disc list-inside space-y-3 mb-6 font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)]">
          <li>0% fees</li>
          <li>Evitar Maximal Extractable Value</li>
          <li>Ejecución justa</li>
        </ul>

        <p className="font-['Inter'] text-[18px] leading-[32px] text-[rgba(204,204,224,0.9)] mb-6">
          Sin embargo, el modelo actual...
        </p>

        {/* CTA Substack */}
        <div className="backdrop-blur-md bg-[rgba(99,102,241,0.2)] rounded-[24px] p-8 border-2 border-[rgba(99,102,241,0.4)] text-center">
          <p className="font-['Inter'] text-[18px] leading-[32px] text-white font-semibold mb-4">
            Este apartado lo dejo en Substack, es gratis. Regístrate si quieres recibir análisis de calidad 👇🏻
          </p>
          <a 
            href="https://substack.com/@axelmnvn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-[12px] font-['Inter'] font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-105"
          >
            Leer análisis completo en Substack
          </a>
        </div>
      </div>

      {/* Fuentes */}
      <div className="mt-16 pt-8 border-t border-[rgba(185,184,235,0.2)]">
        <h3 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[24px] text-white mb-4">
          Fuentes
        </h3>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.7)] font-semibold mb-2">Lighter:</p>
            <ul className="space-y-2 font-['Inter'] text-[14px] leading-[24px] text-[rgba(204,204,224,0.6)]">
              <li>• <a href="https://docs.lighter.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[#b9b8eb] transition-colors">Lighter Docs</a></li>
              <li>• <a href="https://lighter.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[#b9b8eb] transition-colors">Lighter App</a></li>
              <li>• <a href="https://twitter.com/lighter_xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[#b9b8eb] transition-colors">Lighter Twitter/X</a></li>
              <li>• Ericonomic Research sobre Lighter</li>
            </ul>
          </div>
          <div>
            <p className="font-['Inter'] text-[16px] leading-[28px] text-[rgba(204,204,224,0.7)] font-semibold mb-2">Hyperliquid:</p>
            <ul className="space-y-2 font-['Inter'] text-[14px] leading-[24px] text-[rgba(204,204,224,0.6)]">
              <li>• <a href="https://docs.hyperliquid.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[#b9b8eb] transition-colors">Hyperliquid Docs</a></li>
              <li>• <a href="https://hyperliquid.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[#b9b8eb] transition-colors">Hyperliquid App</a></li>
              <li>• <a href="https://twitter.com/HyperliquidX" target="_blank" rel="noopener noreferrer" className="hover:text-[#b9b8eb] transition-colors">Hyperliquid Twitter/X</a></li>
              <li>• <a href="https://defillama.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#b9b8eb] transition-colors">DefiLlama – TVL & Fees</a></li>
              <li>• Dune Dashboards comunitarios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};