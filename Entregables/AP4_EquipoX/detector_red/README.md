# Detector de Red (Entregable 1)

Este directorio contiene los componentes y servicios responsables de monitorizar el estado de la conexión a internet en la aplicación móvil.

## Archivos

- `network.service.ts`: Servicio Angular que encapsula la API de `@capacitor/network`. Mantiene el estado en un `BehaviorSubject` para permitir programación reactiva a lo largo de la app.
- `network-indicator.component.ts`: Componente visual Standalone de Angular. Se suscribe al `NetworkService`.
- `network-indicator.component.html/.scss`: UI y estilos para el banner de advertencia "Modo offline".

## Funcionamiento

1. Al iniciarse, `NetworkService` obtiene el estado actual síncronamente vía `Network.getStatus()`.
2. Posteriormente, registra un listener mediante `Network.addListener('networkStatusChange', ...)` para notificar cualquier cambio en tiempo real.
3. El componente visual utiliza un `async` pipe para observar el estado y mostrar automáticamente el banner de error cuando la conexión cae.
