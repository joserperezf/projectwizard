# figma-make-app

Proyecto de React + Vite + Tailwind CSS ejecutándose dentro de Figma Make.

## Development Server

Un servidor de desarrollo de Vite **ya se está ejecutando** en `$PORT` (por defecto 8443). No necesitas iniciarlo manualmente.

- URL de vista previa: El usuario puede acceder a la aplicación en ejecución a través del panel de vista previa
- Recarga en caliente: Los cambios en los archivos fuente se reflejan inmediatamente

## Project Structure

Esta es la estructura canónica del proyecto. Comienza con los archivos relevantes para la tarea a continuación. Solo sigue las importaciones o inspecciona otros archivos cuando sea necesario, cuando falte una ruta documentada o cuando el repositorio contradiga esta guía.

- `src/main.tsx` - Punto de entrada de React; importa `src/index.css` y monta `src/App.tsx` en el elemento `#root`
- `src/App.tsx` - Componente principal de la aplicación y el punto de partida habitual para el trabajo de UI
- `src/index.css` - Punto de entrada global de CSS e importación de Tailwind CSS v4
- `index.html` - Plantilla HTML de Vite que contiene el elemento `#root` y carga `src/main.tsx`
- `package.json` - Dependencias del proyecto y los scripts de construcción, desarrollo, vista previa y formateo de Vite
- `vite.config.ts` - Configuración de Vite con los plugins de React, Tailwind CSS v4 y Figma Make, además del alias `@` para `src`
- `.mise.toml` - Versiones del conjunto de herramientas para Node.js y pnpm

## Dependencies

- Entorno de ejecución: React 19 y React DOM 19
- Estilos: Tailwind CSS v4 con el plugin `@tailwindcss/vite`
- Herramientas de construcción: Vite 8, TypeScript 5.7 y `@vitejs/plugin-react`
- Formateo: oxfmt

## Styling

Este proyecto utiliza **Tailwind CSS v4** a través del plugin `@tailwindcss/vite` configurado en `vite.config.ts`. `src/index.css` importa Tailwind con `@import 'tailwindcss';`. Usa las clases de utilidad de Tailwind directamente en el JSX y coloca el CSS global o la personalización del tema de Tailwind v4 en `src/index.css`. Esta estructura base no necesita un archivo de configuración de Tailwind ni de PostCSS.

`src/main.tsx` importa `src/index.css`, por lo que la configuración global de las fuentes debe ir en `src/index.css`. Mantén las declaraciones `@import` de CSS al principio, y luego añade cualquier regla `@font-face` y los valores predeterminados de `font-family` allí mismo.

## Code quality

- Usa comillas dobles para las cadenas de texto que contengan apóstrofos (`"We're here to help"`), o escápalos si usas comillas simples. Un apóstrofo no escapado en una cadena con comillas simples rompe la compilación.
- Asegúrate de que las etiquetas JSX estén cerradas y las llaves estén balanceadas.
- Exporta los componentes como exportaciones por defecto (default exports).
