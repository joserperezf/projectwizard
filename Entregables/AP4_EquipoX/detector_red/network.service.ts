import { Injectable, OnDestroy } from '@angular/core';
import { Network, ConnectionStatus } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio encargado de gestionar el estado de la red de la aplicación.
 * Utiliza @capacitor/network para detectar cambios en la conectividad.
 */
@Injectable({
  providedIn: 'root'
})
export class NetworkService implements OnDestroy {
  /** 
   * BehaviorSubject que mantiene el estado actual de la red. 
   * Inicializado en true (asumiendo conexión hasta que se compruebe lo contrario).
   */
  private onlineStatus = new BehaviorSubject<boolean>(true);
  
  /** Referencia al listener de red para poder limpiarlo al destruir el servicio */
  private networkListener: any = null;

  constructor() {
    this.initNetworkListener();
  }

  /**
   * Inicializa la comprobación del estado de la red y establece el listener
   * para escuchar cambios en tiempo real.
   */
  private async initNetworkListener(): Promise<void> {
    try {
      // 1. Obtener el estado actual al arrancar la app
      const status: ConnectionStatus = await Network.getStatus();
      this.onlineStatus.next(status.connected);
      console.log('Estado inicial de red:', status.connected ? 'Online' : 'Offline');

      // 2. Escuchar cambios de red en tiempo real
      this.networkListener = await Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
        console.log('Cambio en estado de red:', status.connected ? 'Online' : 'Offline');
        this.onlineStatus.next(status.connected);
      });
    } catch (error) {
      console.error('Error al inicializar el Network Listener:', error);
    }
  }

  /**
   * Obtiene un Observable con el estado de la conexión.
   * @returns {Observable<boolean>} Emite true si está conectado, false en caso contrario.
   */
  public getOnlineStatus(): Observable<boolean> {
    return this.onlineStatus.asObservable();
  }

  /**
   * Método síncrono/inmediato para saber si actualmente hay conexión.
   * @returns {boolean} true si está conectado
   */
  public isOnline(): boolean {
    return this.onlineStatus.getValue();
  }

  /**
   * Limpia el listener cuando el servicio se destruye para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    if (this.networkListener) {
      this.networkListener.remove();
    }
  }
}
