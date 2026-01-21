# Medusa Capital - Web Oficial

Web oficial de Medusa Capital desarrollada con React, TypeScript, Tailwind CSS y Vite.

## 🚀 Deploy en Vercel

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Sube tu proyecto a GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit - Medusa Capital"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración
   - Click en "Deploy"

### Opción 2: Deploy con Vercel CLI

1. **Instala Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Inicia sesión:**

   ```bash
   vercel login
   ```

3. **Despliega:**

   ```bash
   vercel
   ```

   - Sigue las instrucciones en pantalla
   - Para producción: `vercel --prod`

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📦 Estructura del Proyecto

```
/
├── components/          # Componentes React reutilizables
│   ├── figma/          # Componentes de Figma
│   └── ui/             # Componentes UI base
├── imports/            # Assets importados de Figma
├── styles/             # Estilos globales CSS
├── App.tsx             # Página principal
├── TrackRecord.tsx     # Página Track Record
├── Colaboradores.tsx   # Página Colaboradores
├── Blog.tsx            # Página Blog
└── index.tsx           # Router principal
```

## 🎨 Diseño

- **Colores:**
  - Fondo: `#010052`
  - Púrpura: `#6366f1`
  - Lavanda: `#b9b8eb`

- **Tipografías:**
  - Títulos: Cormorant Garamond Bold
  - UI/Body: Inter

- **Efectos:**
  - Glassmorphism
  - Gradientes radiales
  - Transparencias
  - Sin backdrop-blur (optimizado para rendimiento)

## 🔧 Tecnologías

- React 18
- TypeScript
- Tailwind CSS v4
- Vite
- React Router
- Recharts (gráficos)
- React Slick (carruseles)
- Lucide React (iconos)

## 📝 Variables de Entorno

No se requieren variables de entorno para el funcionamiento básico.

## 🌐 Dominios Personalizados en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Añade tu dominio personalizado
4. Configura los DNS según las instrucciones

## 🐛 Troubleshooting

### Problema: Rutas no funcionan después del deploy

- **Solución:** El archivo `vercel.json` ya está configurado para manejar el routing de React Router.

### Problema: Imágenes no cargan

- **Solución:** Verifica que las URLs de Unsplash/Coinmarketcap sean accesibles públicamente.

### Problema: Fuentes no cargan

- **Solución:** Las fuentes de Google Fonts se cargan desde `/styles/globals.css`.

## 📧 Contacto

Para más información: [medusacapital.com](https://medusacapital.com)