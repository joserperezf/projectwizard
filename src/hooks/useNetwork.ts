import { useState, useEffect } from 'react';

/**
 * Hook para detectar el estado de la red en tiempo real.
 * Usa la Web API nativa del navegador (window online/offline events).
 * En producción con Capacitor, se puede reemplazar el listener por Network.addListener.
 * @returns {boolean} true si hay conexión, false si no.
 */
export function useNetwork() {
  const [isOnline, setIsOnline] = useState<boolean>(
    // Valor inicial: si estamos en browser usamos navigator.onLine, si no, true
    typeof window !== 'undefined' ? window.navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Solo se registra una vez al montar

  return isOnline;
}
