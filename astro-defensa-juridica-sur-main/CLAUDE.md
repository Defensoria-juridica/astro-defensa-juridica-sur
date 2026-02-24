# CLAUDE.md - Guía Completa para Proyecto Defensa Jurídica Sur

## 🚨 REGLAS CRÍTICAS - LEER PRIMERO

### IDIOMA OBLIGATORIO
- **SIEMPRE** responder en **ESPAÑOL**
- Todos los comentarios del código en español
- Mensajes de commit en español
- Documentación en español

### WORKFLOW OBLIGATORIO - NUNCA SALTAR PASOS
1. **ANALIZAR** → Entender el problema y revisar código existente
2. **PLANIFICAR** → Crear lista detallada de cambios
3. **SOLICITAR APROBACIÓN** → "¿Procedo con estos cambios?"
4. **EJECUTAR** → Cambios mínimos e incrementales
5. **DOCUMENTAR** → Explicar qué se cambió y por qué

> ⛔ **Si omites algún paso, el usuario debe recordarte: "Check CLAUDE.md rules"**

## 📁 ESTRUCTURA ACTUAL DEL PROYECTO

```
astro-juridica/
├── public/              # Assets estáticos
├── src/
│   ├── assets/         # Imágenes y recursos
│   ├── components/     # Componentes Astro y React
│   │   ├── slider/     # Componente slider con estilos propios
│   │   └── ...        
│   ├── layouts/        # Layouts principales
│   ├── pages/          # Rutas del sitio
│   └── styles/         
│       └── global.css  # Estilos globales con Tailwind v4
├── dist/               # Build de producción
├── astro.config.mjs    # Config con React y Tailwind
├── package.json        # Dependencies definidas
├── biome.json         # Linter Biome (no ESLint)
└── CLAUDE.md          # Este documento
```

### ⚠️ IMPORTANTE SOBRE LA ESTRUCTURA
- **NO** crear carpetas nuevas sin justificación
- **NO** cambiar la estructura existente
- **RESPETAR** el patrón actual de organización
- **VERIFICAR** siempre antes de crear archivos

## 🎨 STACK TECNOLÓGICO ESPECÍFICO

### Versiones Actuales (NO CAMBIAR)
```json
{
  "astro": "^5.13.2",
  "@astrojs/react": "^4.3.0",
  "tailwindcss": "^4.1.12",  // ⚠️ Tailwind v4 con @theme
  "react": "^19.1.1",
  "motion": "^12.23.12",      // Para animaciones
  "@lucide/astro": "^0.541.0", // Iconos Lucide para Astro
  "sharp": "^0.34.3"          // Procesamiento de imágenes
}
```

### Herramientas de Desarrollo
- **Linter**: Biome (NO Prettier para linting)
- **Formatter**: Prettier para formato
- **TypeScript**: Configurado y activo
- **Bundler**: Vite (integrado en Astro)

## 🎯 SISTEMA DE DISEÑO ESTABLECIDO

### Variables CSS Definidas (@theme de Tailwind v4)
```css
/* COLORES PRINCIPALES - NO MODIFICAR */
--color-primary: #c18f59;        /* Marrón/Dorado */
--color-secondary: #212529;       /* Negro secundario */
--color-background: #ffffff;
--color-foreground: #212529;

/* ALIASES DEL SISTEMA */
--color-marron: #c18f59;         /* = primary */
--color-gris-text: #898989;
--color-gris-border: #eaeaea;
--color-gris-bg: #f8f9fa;

/* NAVEGACIÓN */
--nav-bg-default: rgba(0, 0, 0, 0.4);
--nav-bg-scrolled: #323232;
```

### Clases Personalizadas Existentes
```css
.tituloH1    /* Títulos principales con gradiente */
.tituloH3    /* Subtítulos */
.tituloH4    /* Títulos menores */
.parrafo     /* Texto de párrafo estándar */
.btn-slider  /* Botón del slider */
```

### Componentes de Navegación
```css
/* Header */
.header-juridico
.topbar
.nav-sticky
.nav-scrolled

/* Mobile */
.nav-sidebar
.sidebar-open
.sidebar-overlay
```

## 💻 REGLAS PARA COMPONENTES

### Componentes Astro (.astro)
```astro
---
// SIEMPRE en español los comentarios
interface Props {
  titulo: string;
  descripcion?: string;
}

// Desestructuración con valores por defecto
const { 
  titulo, 
  descripcion = "Texto por defecto" 
} = Astro.props;

// Importaciones al inicio
import { Icon } from '@lucide/astro';
---

<!-- HTML semántico -->
<section class="componente-nombre">
  <h2 class="tituloH3">{titulo}</h2>
  {descripcion && <p class="parrafo">{descripcion}</p>}
</section>

<style>
  /* Estilos locales si son necesarios */
</style>
```

### Componentes React (solo cuando es necesario)
```jsx
// ⚠️ USAR SOLO para interactividad del cliente
import { useState } from 'react';
import { motion } from 'motion'; // Usar motion para animaciones

export default function ComponenteInteractivo() {
  // Lógica aquí
}
```

### Directivas de Cliente para React
```astro
<!-- Analizar cuál es apropiada -->
<ComponenteReact client:load />     <!-- Carga inmediata -->
<ComponenteReact client:idle />     <!-- Cuando el navegador está libre -->
<ComponenteReact client:visible />  <!-- Cuando es visible -->
<ComponenteReact client:media="(min-width: 1024px)" /> <!-- Media query -->
```

## 🖼️ MANEJO DE IMÁGENES

### Optimización con Sharp
```astro
---
import { Image } from 'astro:assets';
import imagenHero from '../assets/hero.jpg';
---

<Image 
  src={imagenHero}
  alt="Descripción accesible en español"
  width={1920}
  height={1080}
  format="webp"
  quality={85}
  loading="lazy"
/>
```

### Imágenes de Background
```css
/* Usar la clase existente */
.bg-testimonios {
  background-image: url("src/assets/testimonials.jpg");
}
```

## 🎨 TAILWIND v4 - CONFIGURACIÓN ACTUAL

### IMPORTANTE: Sintaxis de Tailwind v4
```css
/* global.css usa @theme en lugar de tailwind.config.js */
@theme {
  /* Variables personalizadas */
  --breakpoint-2xl: 1320px; /* Máximo personalizado */
}

/* Layers de componentes */
@layer components {
  .clase-personalizada {
    @apply flex items-center; /* Aplicar utilidades */
  }
}
```

### Clases de Utilidad Disponibles
- Usar clases nativas de Tailwind
- Respetar las variables definidas en @theme
- NO usar arbitrary values si existe una clase

## 📝 SCRIPTS DISPONIBLES

```bash
# Desarrollo (con Bun preferido)
bun dev          # Servidor de desarrollo con Bun
npm run dev      # Alternativa con npm

# Build
bun:build        # Build optimizado con Bun
npm run build    # Build estándar

# Linting y Formato
npm run lint     # Verificar con Biome
npm run lint:fix # Corregir con Biome
npm run prettier # Formatear código
```

## 🚀 OPTIMIZACIONES CONFIGURADAS

### En astro.config.mjs
- `compressHTML: true` - HTML comprimido
- `inlineStylesheets: "auto"` - CSS crítico inline
- `format: "file"` - Archivos HTML estáticos
- `prefetch` configurado para viewport
- Sharp para optimización de imágenes

### Build Configuration
```javascript
build: {
  assets: "assets",
  cssCodeSplit: false, // Un solo archivo CSS
}
```

## 🔍 PROCESO DE DEBUGGING

### Pasos Ordenados
1. **Verificar consola del navegador** - Errores de cliente
2. **Revisar terminal** - Errores del servidor
3. **Validar rutas** - Que existan y sean correctas
4. **Comprobar importaciones** - Paths correctos
5. **Verificar TypeScript** - `astro check`

### Comandos de Diagnóstico
```bash
astro check      # Verificar TypeScript
astro info       # Información del entorno
astro sync       # Sincronizar tipos
```

## ✅ CHECKLIST ANTES DE CAMBIOS

### Pre-Análisis
- [ ] He leído el código existente relacionado
- [ ] He verificado que no duplico funcionalidad
- [ ] He identificado las dependencias afectadas
- [ ] He revisado el archivo global.css

### Durante Desarrollo
- [ ] Uso las clases CSS existentes (tituloH1, parrafo, etc.)
- [ ] Respeto el sistema de colores definido
- [ ] Mantengo comentarios en español
- [ ] Uso las herramientas configuradas (Biome, no ESLint)

### Pre-Commit
- [ ] He ejecutado `bun:build` exitosamente
- [ ] He probado en navegador
- [ ] He verificado responsive design
- [ ] He ejecutado `npm run lint`

## 🛑 PROHIBICIONES ABSOLUTAS

1. **NUNCA** cambiar versiones de dependencias sin aprobación
2. **NUNCA** modificar el sistema de colores base
3. **NUNCA** crear componentes duplicados
4. **NUNCA** usar localStorage/sessionStorage en el build
5. **NUNCA** ignorar errores de TypeScript
6. **NUNCA** modificar archivos sin entender su propósito
7. **NUNCA** cambiar de Biome a ESLint
8. **NUNCA** actualizar Tailwind sin verificar breaking changes
9. **NUNCA** eliminar las clases personalizadas existentes
10. **NUNCA** actuar sin seguir el workflow de 5 pasos

## 🔄 FLUJO DE TRABAJO DETALLADO

### 1. ANALIZAR (5-10 min)
```markdown
- [ ] Leer el problema completo
- [ ] Revisar archivos afectados
- [ ] Identificar dependencias
- [ ] Verificar soluciones existentes
```

### 2. PLANIFICAR (5 min)
```markdown
Plan de cambios:
1. Archivo: component.astro - Agregar prop X
2. Archivo: global.css - Añadir clase Y
3. Archivo: page.astro - Importar componente
```

### 3. SOLICITAR APROBACIÓN
```markdown
"He analizado el problema. Mi plan es:
1. [Cambio 1]
2. [Cambio 2]
¿Procedo con estos cambios?"
```

### 4. EJECUTAR
- Cambios mínimos
- Un archivo a la vez
- Probar cada cambio

### 5. DOCUMENTAR
```markdown
Cambios realizados:
✅ Archivo X - [descripción del cambio]
✅ Archivo Y - [descripción del cambio]
Estado: Funcionando correctamente
```

## 📚 REFERENCIAS RÁPIDAS

### Documentación
- [Astro Docs](https://docs.astro.build)
- [Tailwind v4](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons/)
- [Motion](https://motion.dev/)

### Archivos Clave del Proyecto
- `src/styles/global.css` - Sistema de diseño
- `astro.config.mjs` - Configuración principal
- `src/components/slider/` - Componente slider personalizado
- `package.json` - Dependencias exactas

## 🆘 CUANDO ALGO FALLA

### Error: "Cannot find module"
```bash
# Verificar:
1. Path exacto con .astro/.tsx
2. Importación desde 'astro:assets'
3. Alias configurados
```

### Error: "Hydration mismatch"
```astro
<!-- Usar client:only para componentes dinámicos -->
<ComponenteDinamico client:only="react" />
```

### Error de Tailwind
```bash
# Verificar sintaxis de v4
# NO usar tailwind.config.js
# Revisar @theme en global.css
```

---

## ⚡ RECORDATORIO FINAL

**Este documento es LEY para el proyecto. Si algo no está claro:**
1. PREGUNTAR antes de asumir
2. REVISAR el código existente
3. SEGUIR el workflow de 5 pasos
4. MANTENER la simplicidad

**Si Claude Code omite estas reglas, recordarle inmediatamente:**
> "Check CLAUDE.md rules - Follow the 5-step workflow"