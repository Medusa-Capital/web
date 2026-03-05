---
title: "ARTÍCULO: ¿EL PRINCIPIO DEL FIN? VIERNES NEGRO"
date: "2025-10-12"
description: "Vamos a intentar explicar lo que sucedió el viernes, 10 de octubre."
tags: ["mercado", "macro", "defi", "onchain", "analisis"]
type: "Análisis"
author: "Axel_mnvn"
featured: false
published: true
category: "market-analysis"
---

Vamos a intentar explicar lo que sucedió el viernes, 10 de octubre.


Antes de empezar me gustaría enfatizar en que actualmente no hay una verdad absoluta. Están recorriendo por X multitud de hipótesis las cuales se están dando por hecho. Considero que es un error. Estamos hablando de una catástrofe multifactorial en la que están involucrados muchos actores de gran calado. Dar por cierto cualquier hipótesis es, bajo mi punto de vista, un gran error.


Por tanto, aquí os expondré una de las hipótesis que considero que mejor cuadra con lo sucedido. Os dejaré las fuentes originales al final para que podáis consultar todo con mayor exactitud.


## La pregunta del millón. ¿Se podría haber anticipado el calado de este movimiento?


La respuesta corta es: NO.


Ahora bien, sí que había señales que nos mostraban una mala salud del mercado.


→ Open Interest en máximos (Divergencia vs. precio)
→ Funding Rate sustancialmente positivas
→ Asimetría posicional extrema (78% de posiciones abiertas eran largas)
→ Apalancamiento promedio >10x


![](/img/blog/articulo-el-principio-del-fin-viernes-negro/image-0.png)


Open Interest


![](/img/blog/articulo-el-principio-del-fin-viernes-negro/image-1.png)


## Todo está bien, hasta que algo se rompe.


Los niveles de complacencia en el mercado eran extremos. Los índices daban la sensación de "imparables":


**Desde el flash-crash Liberation Day:**


→ SPX +39,9%
→ NDX +51,9%
→ IWM +43,7%


**Desde el ATH (20/2/25):**


→ SPX +10,2%
→ NDX +13,4%


![](/img/blog/articulo-el-principio-del-fin-viernes-negro/image-2.png)


![](/img/blog/articulo-el-principio-del-fin-viernes-negro/image-3.png)


## ¿Manipulación? La realidad es mucho más compleja


Ahora que ya conocemos el pretexto, vamos a explicar más a fondo lo sucedido.


Lo más leído estos días por X ha sido "Las ballenas manipularon el mercado". La realidad es más compleja: el ecosistema cripto actúa como **"banca en la sombra sintética"** sin respaldo de bancos centrales.


Cuando falla algo, falla TODO.


El concepto de **"banca en la sombra sintética"** se lo he escuchado a @trader_zona y me parece una representación perfecta del sector cripto. Luego os dejará más info para que podáis entenderlo mejor. Vamos a explicarlo por encima:


El concepto de "banca en la sombra" hace referencia a que los CEX, MMs etc. realizan funciones económicas equivalentes a instituciones bancarizadas tradicionales:

1. **Intermediarios de liquidez**
2. **Transformación de plazos**
3. **Absorción temporal de riesgo**

Todo esto fuera del marco regulatorio. La catástrofe del viernes tiene que ver con estas funciones de banca en la sombra y se resume en 4 componentes críticos:


## 1. Financiación mediante crédito privado


Los CEX obtienen liquidez operativa a través de acuerdos de crédito privado caracterizados por cláusulas no estandarizadas. A diferencia de los mercados de crédito públicos, donde los términos están relativamente estandarizados, cada acuerdo de financiación cripto incluye cláusulas únicas que pueden activar cierres automáticos de financiación bajo condiciones específicas.


Si se activan estas cláusulas pueden cortar la financiación:

- "Si VIX > 35, reducir exposición cripto 50%"
- "Si credit spreads aumentan > 100bp, liquidar posiciones de riesgo"
- "Si USD strengthens > 5% vs. basket, cortar financiación marginal"

Estas cláusulas crean mecanismos automáticos de contagio donde eventos en mercados tradicionales activan restricciones en financiación cripto.


La noticia de las tarifas de USA a China parece ser que cerró el grifo. La financiación se restringió y el mercado cripto se quedó sin liquidez.


## 2. Mercados Repo sintéticos


Los acuerdos repo en el ecosistema cripto utilizan activos digitales como colateral para obtener efectivo a corto plazo, pero sin la infraestructura de settlement y las garantías regulatorias de los repos tradicionales operados a través de la infraestructura de Fedwire y Tri-Party Repo.


La alta volatilidad inherente de los activos digitales utilizados como colateral incrementa significativamente los haircuts (descuentos de valoración) y márgenes de seguridad exigidos por prestamistas.


Esto encarece el acceso al crédito y crea vulnerabilidad durante eventos de estrés cuando el valor del colateral colapsa simultáneamente.


Es decir, con un colateral de baja calidad (volatilidad) el acceso a crédito se complica en momentos de estrés.


## 3. Dealers privados como fuente de liquidez


Los dealers que proporcionan liquidez a CEX operan según principios de optimización riesgo-beneficio dinámicos, reasignando capital entre diferentes mercados (tradicionales y cripto) basándose en evaluaciones de riesgo en tiempo real.


Esta dinámica crea vulnerabilidades sistémicas cuando múltiples dealers simultáneamente retiran liquidez de mercados de riesgo.


Esto fue lo que sucedió el viernes. Ante la noticia de las tarifas de EE.UU. a China, cerraron el grifo.



<!-- newsletter -->

## 4. Ausencia de backstops regulatorios


Crucialmente, todo este sistema opera sin acceso a facilidades de emergencia como el Standing Repo Facility de la Fed, ventana de descuento, o seguros de depósitos, creando vulnerabilidades sistémicas únicas durante períodos de estrés.


A diferencia de TradFi, aquí no había salvavidas al que agarrarse.


## Cronología de eventos:


1. Anuncio Trump → algoritmos de riesgo activados
2. Dealers desvían dinero a "activos seguros"
3. CEX sin financiación → ampliación spreads
4. MMs desaparecen → No hay precios
5. Liquidaciones en cascada imparables


Una vez que la financiación desaparece y el mercado pasa a ser ilíquido, comienza la fiesta (ironía) en los CEX.


Aquí tenemos los niveles de protección que fallaron:


## 1. Mark Price vs Last Price


El desfalco comenzó en @binance. No voy a meterme aquí porque es enredar mucho. Aquí os dejo un hilo sobre una hipótesis que cuadra mucho:


[https://x.com/yq_acc/status/1977057301673787716](https://x.com/yq_acc/status/1977057301673787716)


Lo importante es entender que el principal punto de falla fue Binance. Solo hace falta ver los gráficos vs. cualquier otro venue para entenderlo.


![](/img/blog/articulo-el-principio-del-fin-viernes-negro/image-4.png)


Gráfico spot $ATOM  (1D) - Binance vs. Coinbase


El mecanismo a través del cual los CEX para las liquidaciones fue el principal problema. Los CEX utilizan **Mark Price** (promedio ponderado de múltiples fuentes) en lugar de **Last Price** para determinar liquidaciones, diseñado para prevenir manipulaciones localizadas.


Sin embargo, durante el evento del viernes, este mecanismo contribuyó involuntariamente a la sincronización de crashes entre CEX, amplificando la velocidad y magnitud de liquidaciones. Las caídas iniciales en Binance se expandieron rápidamente lo que provocó el Mark Price cayer dra


## 2. Liquidation Price vs. Bankruptcy Price


El precio de liquidación todo el mundo lo conocemos. Sin embargo, el Bankruptcy Price no es tan conocido. Este representa el umbral donde el CEX comienza a asumir pérdidas directas.


La diferencia entre Liquidation Price y Bankruptcy Price constituye el margen de seguridad del CEX.


Durante eventos de volatilidad extrema, liquidaciones pueden ejecutarse por debajo del Bankruptcy Price debido a falta de liquidez, generando "deuda mala" para el CEX.


## 4. Insurance Fund (fondo de emergencia)


SI el CEX se convierte en la contraparte de posiciones tóxicas (deuda mala) tiene que recurrir al Fondo de Emergencia para hacer frente. La efectividad de este fondo depende críticamente de su tamaño relativo al Open Interest y apalancamiento promedio del sistema.


Este eventos, entre otros, ha demostrado 2 cosas:


1. Los CEX/DEX no tienen un fondo de emergencia suficientemente liquido para eventos de cola larga.


2. Cuando estos eventos suceden, prefieren socializar pérdidas recurriendo a su último nivel de protección: Auto-Deleveraging (ADL)


## 5. ADL (Auto-Deleveraging)


Cuando el Insurance Fund es insuficiente, el ADL activa el cierre forzado de posiciones rentables para cubrir deuda mala. El proceso de selección típicamente prioriza posiciones con mayor rentabilidad y apalancamiento:


**El ADL no "roba" ganancias directamente como muchos están alegando. Lo que hace es:**

1. **Identifica posiciones ganadoras** (típicamente shorts con mucho beneficio no realizado)
2. **Las cierra forzosamente** a precio de mercado actual
3. **Usa estas posiciones cerradas como CONTRAPARTE** para las posiciones que generaron deuda mala

**Ejemplo Práctico para entenderlo**


Situación antes del ADL

- **Usuario A:** Tiene un long liquidado que generó $100,000 de deuda mala (se liquidó muy por debajo del Bankruptcy Price)
- **Usuario B:** Tiene un short ganador con $80,000 de beneficio no realizado
- **Insurance Fund:** Solo tiene $30,000 disponibles
- **Déficit:** $70,000 que no se puede cubrir

**Lo que hace el ADL:**

1. **Cierra forzosamente** el short del Usuario B
2. **El Usuario B recibe** sus $80,000 de ganancia (no se las confiscan)
3. **PERO**: Su posición cerrada **se usa como contraparte** para "compensar" matemáticamente la deuda del Usuario A

¿De dónde Sale el dinero entonces?


**La clave está en la contabilidad del CEX:**


**Antes del ADL:**

- Exchange debe: $100,000 (deuda del Usuario A)
- Exchange tiene: $30,000 (Insurance Fund)
- **Déficit neto: $70,000**

**Después del ADL:**

- Usuario B cobra sus $80,000 de ganancia
- **Pero su posición se "netea" contra la deuda del Usuario A**
- Exchange ahora debe: $100,000 - $80,000 = $20,000
- Insurance Fund cubre: $20,000
- **Déficit eliminado**
- **Compras forzadas y presión alcista artificial**

Al cerrar posiciones cortas masivamente, el ADL genera demanda de compra concentrada que crea presión alcista temporal. Esta presión, aunque temporal, puede desencadenar liquidaciones adicionales de posiciones cortas menores que no fueron seleccionadas para ADL.


**5.1. Problemática Sistémica del ADL**


El mecanismo ADL genera efectos sistémicos perversos que exacerban la volatilidad durante su activación:

- **Socialización de pérdidas entre participantes correctos**

El ADL efectivamente transfiere el coste de malas decisiones de trading desde perdedores hacia ganadores, creando incentivos perversos y erosionando la confianza en la integridad del mercado.

- **Pérdida de señales de precio eficientes**

Las compras forzadas del ADL distorsionan señales de precio naturales, potencialmente retrasando el proceso de descubrimiento de precios eficiente que permitiría estabilización orgánica del mercado.


## ¿Se ha acabado el mercado alcista?


Es una pregunta bastante complicada de responder. Sin embargo, considero que este evento de cola larga ha sido más un problema con la microestructura de mercado que con un cambio radical en los fundamentales.


Aún no ha cerrado la semana, pero muchos de los tokens han recuperado parte del terreno perdido y alguno incluso está por encima de los niveles previos a la caída.


Las Funding Rates y el Open Interest se han reseteado, por tanto, estamos en un momento de mercado más sano que antes. Eso si, salud =! risk-on.


Los ciclos de mercado suelen acabar con un climax donde los activos más sensibles a la beta del mercado suben indiscriminadamente. Y esa fase aún no la hemos visto. Por tanto, tendremos que vigilar como se comportan los activos de riesgo esta semana ya que el IWM, nuestro canario en la mina, ha rechazado de nuevo ATH.
