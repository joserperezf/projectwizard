# Modo Offline (Entregable 2)

Este directorio contiene los componentes y servicios que orquestan el Modo Offline de la aplicación, permitiendo continuar usando funcionalidades clave aunque no haya conexión a Internet.

## Archivos

- `data-queue.service.ts`: Interactúa con `@ionic/storage-angular` para persistir las operaciones (POST, PUT, DELETE) que fallan o se realizan estando sin conexión.
- `offline.service.ts`: Es el "Service Worker" lógico. Intercepta los intentos de red y los encola si es necesario. Cuando detecta que la red vuelve, hace un *flush* (vacía la cola) de manera asíncrona hacia la API original.
- `offline-message.component.ts`: Utiliza `ToastController` de Ionic para brindar feedback UX suave e inmediato (e.g., "Modo offline activado", "Guardado localmente", "Sincronizando...").

## Flujo de Trabajo

1. Cuando un componente requiere enviar datos, llama a `OfflineService.sendDataOrQueue()`.
2. Si `NetworkService.isOnline()` es `true`, intenta enviarlo. Si falla (o si es `false`), lo pasa a `DataQueueService`.
3. Al reconectar, `OfflineService` lee la cola y envía en bloque una a una las peticiones.
