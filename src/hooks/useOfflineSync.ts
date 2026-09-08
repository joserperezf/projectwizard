import { useEffect, useRef } from 'react';
import { useNetwork } from './useNetwork';
import { dataQueue } from '../utils/dataQueue';

/**
 * Hook para manejar la sincronización offline.
 * @param onToast Callback estable (useCallback en el padre) para emitir mensajes visuales.
 */
export function useOfflineSync(onToast?: (msg: string, type: 'info' | 'success' | 'warning') => void) {
  const isOnline = useNetwork();
  const isSyncingRef = useRef(false);
  // Ref para poder leer el valor más reciente dentro de funciones async
  const isOnlineRef = useRef(isOnline);
  isOnlineRef.current = isOnline; // Actualizar en cada render (sin useEffect extra)

  const onToastRef = useRef(onToast);
  onToastRef.current = onToast; // Actualizar en cada render (sin useEffect extra)

  useEffect(() => {
    const syncPendingData = async () => {
      if (isSyncingRef.current) return;

      const queue = await dataQueue.getQueue();
      if (queue.length === 0) return;

      isSyncingRef.current = true;
      onToastRef.current?.('Sincronizando datos pendientes...', 'info');

      for (const req of queue) {
        if (!isOnlineRef.current) {
          console.warn('Conexión perdida durante sincronización. Abortando.');
          break;
        }
        try {
          await new Promise((resolve) => setTimeout(resolve, 800));
          await dataQueue.removeRequest(req.id);
          console.log(`Sincronizada: ${req.url}`);
        } catch (error) {
          console.error(`Error al sincronizar ${req.id}`, error);
        }
      }

      isSyncingRef.current = false;
      const remaining = await dataQueue.getQueue();
      if (remaining.length === 0) {
        onToastRef.current?.('¡Todos los datos han sido sincronizados!', 'success');
      }
    };

    if (isOnline) {
      syncPendingData();
    } else {
      onToastRef.current?.("Modo offline activado. Podrás seguir trabajando.", 'warning');
    }
  // Solo depende de isOnline para re-ejecutarse
  }, [isOnline]);

  /**
   * Envía datos al servidor o los encola localmente si no hay conexión.
   */
  const sendDataOrQueue = async (url: string, method: 'POST' | 'PUT' | 'DELETE', body: any) => {
    if (isOnlineRef.current) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`Guardado online: ${url}`);
      } catch {
        await dataQueue.enqueueRequest({ url, method, body });
      }
    } else {
      await dataQueue.enqueueRequest({ url, method, body });
      onToastRef.current?.('Datos guardados localmente.', 'info');
    }
  };

  return { sendDataOrQueue };
}
