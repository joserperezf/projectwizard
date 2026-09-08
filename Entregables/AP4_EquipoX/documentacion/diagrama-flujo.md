# Diagrama de Flujo del Detector de Red y Modo Offline

A continuación se muestra el diagrama Mermaid que explica cómo la aplicación detecta la pérdida de red, almacena la información localmente, y sincroniza una vez que vuelve el internet.

```mermaid
sequenceDiagram
    participant UI as Componente (UI)
    participant NS as NetworkService
    participant OS as OfflineService
    participant DQ as DataQueue (Storage)
    participant API as API Remota

    %% Inicialización
    Note over NS: Inicializa Listener
    NS->>NS: App inicia (getStatus)

    %% Escenario Online
    UI->>OS: sendDataOrQueue(datos)
    OS->>NS: isOnline()
    NS-->>OS: true
    OS->>API: HTTP Request
    API-->>OS: 200 OK
    OS-->>UI: Éxito

    %% Escenario Offline
    Note over NS: Falla conexión WiFi/Datos
    NS->>NS: networkStatusChange(false)
    NS-->>OS: Evento Offline
    OS->>UI: Toast: "Modo Offline Activado"

    UI->>OS: sendDataOrQueue(datos)
    OS->>NS: isOnline()
    NS-->>OS: false
    OS->>DQ: enqueueRequest(datos)
    DQ-->>OS: Petición guardada
    OS->>UI: Toast: "Datos guardados localmente"

    %% Recuperación de Red
    Note over NS: Conexión recuperada
    NS->>NS: networkStatusChange(true)
    NS-->>OS: Evento Online
    OS->>UI: Toast: "Sincronizando..."
    OS->>DQ: getQueue()
    DQ-->>OS: [peticiones pendientes]
    
    loop Sincronización en bloque
        OS->>API: HTTP Request (pendientes)
        API-->>OS: 200 OK
        OS->>DQ: removeRequest(id)
    end
    
    OS->>UI: Toast: "Sincronización Exitosa"
```
