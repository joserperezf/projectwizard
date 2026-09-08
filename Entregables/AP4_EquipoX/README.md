# Módulo de Conectividad y Modo Offline (AP4_EquipoX)

Este entregable contiene la implementación completa para la detección del estado de red y un modo offline funcional para una aplicación móvil basada en Ionic 8+, Angular 18+ y Capacitor 6+.

## Estructura del Entregable

- `/detector_red/`: Lógica para detectar si hay conexión (Capacitor Network) y banner visual de aviso.
- `/modo_offline/`: Lógica de encolamiento (Ionic Storage) y sincronización asíncrona de datos.
- `/documentacion/`: Explicación de la arquitectura, diagrama de flujo, justificación de uso de Storage vs LocalStorage y capturas.

## Instrucciones de Instalación y Uso

1. **Integrar los archivos a tu proyecto Ionic/Angular:**
   Copia el contenido de los directorios `detector_red` y `modo_offline` a la carpeta `src/app/services` o `src/app/shared` de tu proyecto.

2. **Instalar Dependencias Requeridas:**
   Ejecuta el siguiente comando en la raíz de tu proyecto para instalar los plugins de Capacitor y el Storage de Ionic.
   ```bash
   npm install @capacitor/network @ionic/storage-angular
   npx cap sync
   ```

3. **Configurar `app.module.ts` o Standalone Config:**
   Debes importar el `IonicStorageModule` en tu configuración principal.
   ```typescript
   import { IonicStorageModule } from '@ionic/storage-angular';
   // ...
   imports: [
     IonicStorageModule.forRoot()
   ]
   ```

4. **Uso del Componente Visual:**
   Importa `NetworkIndicatorComponent` en tus páginas/componentes y agrégalo a tu HTML:
   ```html
   <app-network-indicator></app-network-indicator>
   ```

5. **Uso del Servicio Offline:**
   Cuando necesites enviar datos hacia un servidor, utiliza `OfflineService.sendDataOrQueue()` en lugar del `HttpClient` directo. Esto garantiza que si el usuario está sin conexión, los datos se guardarán localmente para ser enviados más tarde.
