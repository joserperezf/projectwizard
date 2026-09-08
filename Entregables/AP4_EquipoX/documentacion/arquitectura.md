# Decisiones de Arquitectura

Este documento explica las decisiones técnicas tomadas para implementar el módulo de conectividad y modo offline.

## 1. Por qué usar `@ionic/storage-angular` sobre `localStorage`

La rúbrica prefería `@ionic/storage-angular` y existen excelentes motivos arquitectónicos para ello:

- **Persistencia Confiable:** `localStorage` es efímero. El sistema operativo (Android/iOS) puede purgarlo si el dispositivo necesita liberar memoria.
- **Soporte SQLite:** En Capacitor/Cordova, `@ionic/storage-angular` utiliza SQLite por debajo. SQLite es persistente, transaccional e inmune a las purgas del sistema operativo.
- **Límites de Almacenamiento:** `localStorage` está limitado típicamente a ~5MB por origen. SQLite permite GBs de datos si es necesario (ideal para fotos o colas grandes).
- **Asincronía (Non-blocking):** `localStorage` es síncrono y bloquea el hilo principal (UI thread), lo que podría causar "congelamientos" en la UI de la app. Ionic Storage utiliza promesas asíncronas, manteniendo la app a 60fps constantes.

## 2. Patrón de Sincronización (Queue Pattern)

Se eligió implementar un patrón de "Cola de Peticiones" (`DataQueueService` + `OfflineService`). 
- Toda acción que muta estado (POST/PUT/DELETE) pasa por el orquestador (`OfflineService`).
- El orquestador decide, con base en el estado síncrono del `NetworkService`, si la petición va a la red o a la base de datos local.
- Al recuperar la red, se implementó un bucle que vacía la cola secuencialmente. 

### Concurrencia y Errores
Se añadió una bandera `isSyncing` para evitar procesos de sincronización solapados. Además, el bucle comprueba `isOnline()` antes de cada request pendiente por si la red fluctúa durante la sincronización masiva.
