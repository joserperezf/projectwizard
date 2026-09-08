import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Interfaz que define la estructura de una petición encolada.
 */
export interface QueuedRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  timestamp: number;
}

/**
 * Servicio responsable de interactuar con la base de datos local
 * utilizando @ionic/storage-angular para mantener una cola de peticiones
 * que fallaron o se hicieron cuando la app estaba offline.
 */
@Injectable({
  providedIn: 'root'
})
export class DataQueueService {
  private _storage: Storage | null = null;
  private readonly QUEUE_KEY = 'offline_requests_queue';

  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Inicializa la instancia de almacenamiento local.
   */
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /**
   * Añade una nueva petición a la cola persistente.
   * @param {Omit<QueuedRequest, 'id' | 'timestamp'>} request Datos de la petición a encolar.
   */
  public async enqueueRequest(request: Omit<QueuedRequest, 'id' | 'timestamp'>): Promise<void> {
    if (!this._storage) await this.init();

    const currentQueue = await this.getQueue();
    const newRequest: QueuedRequest = {
      ...request,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    currentQueue.push(newRequest);
    await this._storage?.set(this.QUEUE_KEY, currentQueue);
    console.log(`Petición ${newRequest.id} encolada localmente.`);
  }

  /**
   * Obtiene la cola actual de peticiones pendientes.
   * @returns {Promise<QueuedRequest[]>} Arreglo de peticiones encoladas.
   */
  public async getQueue(): Promise<QueuedRequest[]> {
    if (!this._storage) await this.init();
    const queue = await this._storage?.get(this.QUEUE_KEY);
    return queue || [];
  }

  /**
   * Limpia toda la cola de peticiones.
   */
  public async clearQueue(): Promise<void> {
    if (!this._storage) await this.init();
    await this._storage?.remove(this.QUEUE_KEY);
    console.log('Cola de peticiones vaciada.');
  }

  /**
   * Remueve una petición específica de la cola.
   * @param {string} id ID de la petición a remover.
   */
  public async removeRequest(id: string): Promise<void> {
    if (!this._storage) await this.init();
    let currentQueue = await this.getQueue();
    currentQueue = currentQueue.filter(req => req.id !== id);
    await this._storage?.set(this.QUEUE_KEY, currentQueue);
  }
}
