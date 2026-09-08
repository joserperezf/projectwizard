import { Injectable } from '@angular/core';
import { NetworkService } from '../detector_red/network.service';
import { DataQueueService, QueuedRequest } from './data-queue.service';
import { OfflineMessageComponent } from './offline-message.component';

/**
 * Servicio orquestador del Modo Offline.
 * Se encarga de interceptar intentos de guardado si se está offline, y de
 * sincronizar automáticamente cuando la red se recupera.
 */
@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  /** Bandera para evitar sincronizaciones concurrentes */
  private isSyncing = false;

  constructor(
    private networkService: NetworkService,
    private dataQueue: DataQueueService,
    private offlineMessage: OfflineMessageComponent
  ) {
    this.listenForReconnect();
  }

  /**
   * Escucha los cambios de conectividad para disparar la sincronización.
   */
  private listenForReconnect() {
    this.networkService.getOnlineStatus().subscribe(isOnline => {
      if (isOnline) {
        this.syncPendingData();
      } else {
        this.offlineMessage.showOfflineToast();
      }
    });
  }

  /**
   * Método público usado por otros servicios de la app para intentar enviar datos.
   * Si hay red, se envía. Si no, se guarda en la cola.
   * @param url Endpoint
   * @param method Verbo HTTP
   * @param body Payload
   */
  public async sendDataOrQueue(url: string, method: 'POST'|'PUT'|'DELETE', body: any): Promise<void> {
    if (this.networkService.isOnline()) {
      try {
        await this.performApiRequest(url, method, body);
      } catch (error) {
        // Si hay error (ej. timeout), guardamos en cola para reintentar.
        console.warn('Error enviando, guardando en cola offline.');
        await this.dataQueue.enqueueRequest({ url, method, body });
      }
    } else {
      await this.dataQueue.enqueueRequest({ url, method, body });
      this.offlineMessage.showQueuedToast();
    }
  }

  /**
   * Procesa la cola de datos pendientes cuando se recupera la conexión.
   */
  private async syncPendingData(): Promise<void> {
    if (this.isSyncing) return;
    
    const queue = await this.dataQueue.getQueue();
    if (queue.length === 0) return;

    this.isSyncing = true;
    this.offlineMessage.showSyncingToast();

    console.log(`Iniciando sincronización de ${queue.length} elementos...`);

    for (const req of queue) {
      if (!this.networkService.isOnline()) {
        console.warn('Conexión perdida durante la sincronización. Abortando.');
        break;
      }

      try {
        await this.performApiRequest(req.url, req.method, req.body);
        await this.dataQueue.removeRequest(req.id);
      } catch (error) {
        console.error(`Fallo al sincronizar petición ${req.id}`, error);
        // Podríamos implementar lógicas de reintentos máximos aquí.
      }
    }

    this.isSyncing = false;
    const remaining = await this.dataQueue.getQueue();
    if (remaining.length === 0) {
      this.offlineMessage.showSyncSuccessToast();
    }
  }

  /**
   * Simula una llamada HTTP (Se debe reemplazar por HttpClient de Angular en producción).
   */
  private async performApiRequest(url: string, method: string, body: any): Promise<any> {
    // Simulación de delay de red
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
  }
}
