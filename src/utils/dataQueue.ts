import localforage from 'localforage';

export interface QueuedRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  timestamp: number;
}

const QUEUE_KEY = 'offline_requests_queue';

/**
 * Utilidad para gestionar la cola de peticiones offline usando localforage.
 */
export const dataQueue = {
  /**
   * Añade una nueva petición a la cola persistente.
   */
  enqueueRequest: async (request: Omit<QueuedRequest, 'id' | 'timestamp'>): Promise<void> => {
    try {
      const currentQueue = await dataQueue.getQueue();
      const newRequest: QueuedRequest = {
        ...request,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      };
      
      currentQueue.push(newRequest);
      await localforage.setItem(QUEUE_KEY, currentQueue);
      console.log(`Petición ${newRequest.id} encolada localmente.`);
    } catch (error) {
      console.error('Error al encolar petición:', error);
    }
  },

  /**
   * Obtiene la cola actual de peticiones pendientes.
   */
  getQueue: async (): Promise<QueuedRequest[]> => {
    try {
      const queue = await localforage.getItem<QueuedRequest[]>(QUEUE_KEY);
      return queue || [];
    } catch (error) {
      console.error('Error al obtener cola:', error);
      return [];
    }
  },

  /**
   * Limpia toda la cola de peticiones.
   */
  clearQueue: async (): Promise<void> => {
    await localforage.removeItem(QUEUE_KEY);
  },

  /**
   * Remueve una petición específica de la cola.
   */
  removeRequest: async (id: string): Promise<void> => {
    try {
      let currentQueue = await dataQueue.getQueue();
      currentQueue = currentQueue.filter(req => req.id !== id);
      await localforage.setItem(QUEUE_KEY, currentQueue);
    } catch (error) {
      console.error('Error al remover petición de la cola:', error);
    }
  }
};
