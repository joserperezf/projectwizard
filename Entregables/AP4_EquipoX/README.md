# MÃ³dulo de Conectividad y Modo Offline (AP4_JosePerez100016540)

Este entregable contiene la implementaciÃ³n completa para la detecciÃ³n del estado de red y un modo offline funcional para una aplicaciÃ³n mÃ³vil basada en Ionic 8+, Angular 18+ y Capacitor 6+.

## Estructura del Entregable

- `/detector_red/`: LÃ³gica para detectar si hay conexiÃ³n (Capacitor Network) y banner visual de aviso.
- `/modo_offline/`: LÃ³gica de encolamiento (Ionic Storage) y sincronizaciÃ³n asÃ­ncrona de datos.
- `/documentacion/`: ExplicaciÃ³n de la arquitectura, diagrama de flujo, justificaciÃ³n de uso de Storage vs LocalStorage y capturas.

## Instrucciones de InstalaciÃ³n y Uso

1. **Integrar los archivos a tu proyecto Ionic/Angular:**
   Copia el contenido de los directorios `detector_red` y `modo_offline` a la carpeta `src/app/services` o `src/app/shared` de tu proyecto.

2. **Instalar Dependencias Requeridas:**
   Ejecuta el siguiente comando en la raÃ­z de tu proyecto para instalar los plugins de Capacitor y el Storage de Ionic.
   ```bash
   npm install @capacitor/network @ionic/storage-angular
   npx cap sync
   ```

3. **Configurar `app.module.ts` o Standalone Config:**
   Debes importar el `IonicStorageModule` en tu configuraciÃ³n principal.
   ```typescript
   import { IonicStorageModule } from '@ionic/storage-angular';
   // ...
   imports: [
     IonicStorageModule.forRoot()
   ]
   ```

4. **Uso del Componente Visual:**
   Importa `NetworkIndicatorComponent` en tus pÃ¡ginas/componentes y agrÃ©galo a tu HTML:
   ```html
   <app-network-indicator></app-network-indicator>
   ```

5. **Uso del Servicio Offline:**
   Cuando necesites enviar datos hacia un servidor, utiliza `OfflineService.sendDataOrQueue()` en lugar del `HttpClient` directo. Esto garantiza que si el usuario estÃ¡ sin conexiÃ³n, los datos se guardarÃ¡n localmente para ser enviados mÃ¡s tarde.
