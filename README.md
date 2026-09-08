# ProjectWizard ðŸ“±

**ProjectWizard** es una aplicaciÃ³n mÃ³vil de gestiÃ³n de proyectos de desarrollo de software, diseÃ±ada y prototipada en Figma Make y desarrollada con **React + Vite + TypeScript**.

AdemÃ¡s del diseÃ±o de pantallas, el proyecto incluye el **AP4: MÃ³dulo de Conectividad WiFi y Modo Offline**, implementado como parte de la evaluaciÃ³n del curso de ProgramaciÃ³n de Dispositivos MÃ³viles.

---

## ðŸ“‹ Â¿QuÃ© incluye este proyecto?

### DiseÃ±o de Wireframes (Figma â†’ React)
El directorio `src/` contiene la aplicaciÃ³n React generada desde Figma Make con tres pantallas funcionales:

| Pantalla | DescripciÃ³n |
|---|---|
| **01 â€” Dashboard** | Resumen del proyecto activo, progreso del equipo y miembros |
| **02 â€” Tablero** | Tablero tipo Kanban con tareas organizadas por estado (Por Hacer / En Proceso / Hecho) |
| **03 â€” Mis Tareas** | Lista de tareas personales con checkboxes interactivos y progreso diario |

### AP4 â€” MÃ³dulo de Conectividad WiFi (Entregable)
La carpeta `Entregables/AP4_JosePerez100016540/` contiene tres entregables evaluables:

#### ðŸ“¡ Entregable 1 â€” Detector de Estado de Red
- **`detector_red/network.service.ts`**: Servicio Angular con `@capacitor/network` que usa `Network.addListener('networkStatusChange', ...)` y `Network.getStatus()` para detectar cambios en tiempo real.
- **`detector_red/network-indicator.component.*`**: Componente visual que muestra un banner rojo cuando la app detecta que no hay conexiÃ³n.
- **AdaptaciÃ³n React** (integrada en `src/`): El hook `src/hooks/useNetwork.ts` replica la misma lÃ³gica con la Web API nativa (`window.online/offline events`), compatible con el entorno de navegador del proyecto Figma.

#### ðŸ’¾ Entregable 2 â€” Modo Offline Funcional
- **`modo_offline/data-queue.service.ts`**: Servicio de cola persistente usando `@ionic/storage-angular` (SQLite/IndexedDB) para guardar peticiones fallidas localmente.
- **`modo_offline/offline.service.ts`**: Orquestador que evalÃºa si hay red antes de enviar datos. Si no hay conexiÃ³n, encola la operaciÃ³n. Al recuperar red, hace *flush* automÃ¡tico de la cola.
- **`modo_offline/offline-message.component.ts`**: Toasts de Ionic con mensajes amigables ("Modo offline activado", "Sincronizando...", "Â¡SincronizaciÃ³n exitosa!").
- **AdaptaciÃ³n React** (integrada en `src/`): Los hooks `src/hooks/useOfflineSync.ts` y `src/utils/dataQueue.ts` (con `localforage`) replican toda esta lÃ³gica en el entorno React.

#### ðŸ“„ Entregable 3 â€” DocumentaciÃ³n TÃ©cnica
- **`documentacion/diagrama-flujo.md`**: Diagrama Mermaid (sequence diagram) del flujo completo de detecciÃ³n y sincronizaciÃ³n.
- **`documentacion/arquitectura.md`**: JustificaciÃ³n de por quÃ© `@ionic/storage-angular` es superior a `localStorage` en entornos mÃ³viles Capacitor.
- **`documentacion/codigo-comentado.md`**: GuÃ­a de las prÃ¡cticas JSDoc aplicadas en todo el cÃ³digo.
- **`documentacion/capturas/`**: Directorio reservado para capturas de pantalla online/offline.
- **`ENLACE_GITHUB.txt`**: Enlace al repositorio pÃºblico del proyecto.

---

## ðŸš€ CÃ³mo ejecutar el proyecto

### Requisitos previos
- **Node.js** versiÃ³n 18 o superior â†’ [descargar aquÃ­](https://nodejs.org/)
- **npm** (viene incluido con Node.js)

### Pasos de instalaciÃ³n

```bash
# 1. Clonar el repositorio
git clone https://github.com/joserperezf/projectwizard.git
cd projectwizard

# 2. Instalar todas las dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

La aplicaciÃ³n estarÃ¡ disponible en: **http://localhost:8443**

---

## ðŸ§ª CÃ³mo probar el MÃ³dulo de Conectividad

Una vez que la app estÃ© corriendo en el navegador:

1. Abre las **DevTools** del navegador (`F12`).
2. Ve a la pestaÃ±a **Network** (Red).
3. Cambia la conexiÃ³n a **Offline**.
4. Observa cÃ³mo aparece el **banner rojo** de "Modo offline" en los prototipos de telÃ©fono.
5. Haz click en un checkbox en la **Pantalla 03 (Mis Tareas)**.
6. VerÃ¡s el **Toast** indicando: *"Datos guardados localmente."*
7. Vuelve a poner la red en **Online**.
8. La app mostrarÃ¡ automÃ¡ticamente: *"Sincronizando datos pendientes..."* â†’ *"Â¡Todos los datos han sido sincronizados!"*

---

## ðŸ› ï¸ TecnologÃ­as utilizadas

| TecnologÃ­a | PropÃ³sito |
|---|---|
| React 19 + TypeScript | Framework principal de la UI |
| Vite 8 | Build tool y servidor de desarrollo |
| Tailwind CSS v4 | Sistema de estilos |
| `@capacitor/network` | DetecciÃ³n nativa de conectividad WiFi |
| `localforage` | Persistencia local (IndexedDB/WebSQL) |
| Figma Make | Herramienta de diseÃ±o y exportaciÃ³n de prototipos |

---

## ðŸ“ Estructura del Proyecto

```
ðŸ“¦ projectwizard/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ App.tsx                    # AplicaciÃ³n principal con las 3 pantallas
â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ useNetwork.ts          # Hook: detector de red en tiempo real
â”‚   â”‚   â””â”€â”€ useOfflineSync.ts      # Hook: orquestador de sincronizaciÃ³n offline
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â””â”€â”€ dataQueue.ts           # Cola persistente con localforage
â”‚   â””â”€â”€ components/
â”‚       â”œâ”€â”€ NetworkIndicator.tsx   # Banner visual de estado offline
â”‚       â””â”€â”€ Toast.tsx              # Notificaciones flotantes
â”œâ”€â”€ Entregables/
â”‚   â””â”€â”€ AP4_JosePerez100016540/
â”‚       â”œâ”€â”€ detector_red/          # Entregable 1: Servicios Angular/Ionic
â”‚       â”œâ”€â”€ modo_offline/          # Entregable 2: Modo offline y cola
â”‚       â”œâ”€â”€ documentacion/         # Entregable 3: Diagramas y arquitectura
â”‚       â”œâ”€â”€ ENLACE_GITHUB.txt      # URL del repositorio
â”‚       â””â”€â”€ README.md              # Instrucciones del entregable
â””â”€â”€ README.md                      # Este archivo
```

---

*Desarrollado por JosÃ© PÃ©rez â€” ProgramaciÃ³n de Dispositivos MÃ³viles*
