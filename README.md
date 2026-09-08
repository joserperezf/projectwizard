# ProjectWizard 📱

**ProjectWizard** es una aplicación móvil de gestión de proyectos de desarrollo de software, diseñada y prototipada en Figma Make y desarrollada con **React + Vite + TypeScript**.

Además del diseño de pantallas, el proyecto incluye el **AP4: Módulo de Conectividad WiFi y Modo Offline**, implementado como parte de la evaluación del curso de Programación de Dispositivos Móviles.

---

## 📋 ¿Qué incluye este proyecto?

### Diseño de Wireframes (Figma → React)
El directorio `src/` contiene la aplicación React generada desde Figma Make con tres pantallas funcionales:

| Pantalla | Descripción |
|---|---|
| **01 — Dashboard** | Resumen del proyecto activo, progreso del equipo y miembros |
| **02 — Tablero** | Tablero tipo Kanban con tareas organizadas por estado (Por Hacer / En Proceso / Hecho) |
| **03 — Mis Tareas** | Lista de tareas personales con checkboxes interactivos y progreso diario |

### AP4 — Módulo de Conectividad WiFi (Entregable)
La carpeta `Entregables/AP4_EquipoX/` contiene tres entregables evaluables:

#### 📡 Entregable 1 — Detector de Estado de Red
- **`detector_red/network.service.ts`**: Servicio Angular con `@capacitor/network` que usa `Network.addListener('networkStatusChange', ...)` y `Network.getStatus()` para detectar cambios en tiempo real.
- **`detector_red/network-indicator.component.*`**: Componente visual que muestra un banner rojo cuando la app detecta que no hay conexión.
- **Adaptación React** (integrada en `src/`): El hook `src/hooks/useNetwork.ts` replica la misma lógica con la Web API nativa (`window.online/offline events`), compatible con el entorno de navegador del proyecto Figma.

#### 💾 Entregable 2 — Modo Offline Funcional
- **`modo_offline/data-queue.service.ts`**: Servicio de cola persistente usando `@ionic/storage-angular` (SQLite/IndexedDB) para guardar peticiones fallidas localmente.
- **`modo_offline/offline.service.ts`**: Orquestador que evalúa si hay red antes de enviar datos. Si no hay conexión, encola la operación. Al recuperar red, hace *flush* automático de la cola.
- **`modo_offline/offline-message.component.ts`**: Toasts de Ionic con mensajes amigables ("Modo offline activado", "Sincronizando...", "¡Sincronización exitosa!").
- **Adaptación React** (integrada en `src/`): Los hooks `src/hooks/useOfflineSync.ts` y `src/utils/dataQueue.ts` (con `localforage`) replican toda esta lógica en el entorno React.

#### 📄 Entregable 3 — Documentación Técnica
- **`documentacion/diagrama-flujo.md`**: Diagrama Mermaid (sequence diagram) del flujo completo de detección y sincronización.
- **`documentacion/arquitectura.md`**: Justificación de por qué `@ionic/storage-angular` es superior a `localStorage` en entornos móviles Capacitor.
- **`documentacion/codigo-comentado.md`**: Guía de las prácticas JSDoc aplicadas en todo el código.
- **`documentacion/capturas/`**: Directorio reservado para capturas de pantalla online/offline.
- **`ENLACE_GITHUB.txt`**: Enlace al repositorio público del proyecto.

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- **Node.js** versión 18 o superior → [descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js)

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/joserperezf/projectwizard.git
cd projectwizard

# 2. Instalar todas las dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:8443**

---

## 🧪 Cómo probar el Módulo de Conectividad

Una vez que la app esté corriendo en el navegador:

1. Abre las **DevTools** del navegador (`F12`).
2. Ve a la pestaña **Network** (Red).
3. Cambia la conexión a **Offline**.
4. Observa cómo aparece el **banner rojo** de "Modo offline" en los prototipos de teléfono.
5. Haz click en un checkbox en la **Pantalla 03 (Mis Tareas)**.
6. Verás el **Toast** indicando: *"Datos guardados localmente."*
7. Vuelve a poner la red en **Online**.
8. La app mostrará automáticamente: *"Sincronizando datos pendientes..."* → *"¡Todos los datos han sido sincronizados!"*

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Propósito |
|---|---|
| React 19 + TypeScript | Framework principal de la UI |
| Vite 8 | Build tool y servidor de desarrollo |
| Tailwind CSS v4 | Sistema de estilos |
| `@capacitor/network` | Detección nativa de conectividad WiFi |
| `localforage` | Persistencia local (IndexedDB/WebSQL) |
| Figma Make | Herramienta de diseño y exportación de prototipos |

---

## 📁 Estructura del Proyecto

```
📦 projectwizard/
├── src/
│   ├── App.tsx                    # Aplicación principal con las 3 pantallas
│   ├── hooks/
│   │   ├── useNetwork.ts          # Hook: detector de red en tiempo real
│   │   └── useOfflineSync.ts      # Hook: orquestador de sincronización offline
│   ├── utils/
│   │   └── dataQueue.ts           # Cola persistente con localforage
│   └── components/
│       ├── NetworkIndicator.tsx   # Banner visual de estado offline
│       └── Toast.tsx              # Notificaciones flotantes
├── Entregables/
│   └── AP4_EquipoX/
│       ├── detector_red/          # Entregable 1: Servicios Angular/Ionic
│       ├── modo_offline/          # Entregable 2: Modo offline y cola
│       ├── documentacion/         # Entregable 3: Diagramas y arquitectura
│       ├── ENLACE_GITHUB.txt      # URL del repositorio
│       └── README.md              # Instrucciones del entregable
└── README.md                      # Este archivo
```

---

*Desarrollado por José Pérez — Programación de Dispositivos Móviles*
