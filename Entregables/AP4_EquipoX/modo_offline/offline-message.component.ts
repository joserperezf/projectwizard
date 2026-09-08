import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

/**
 * Servicio encargado de mostrar notificaciones visuales (Toasts)
 * al usuario relacionadas con el estado offline y la sincronización.
 */
@Injectable({
  providedIn: 'root'
})
export class OfflineMessageComponent {
  
  constructor(private toastController: ToastController) {}

  /**
   * Muestra un Toast indicando que se entró a modo offline.
   */
  async showOfflineToast() {
    const toast = await this.toastController.create({
      message: 'Modo offline activado. Podrás seguir trabajando.',
      duration: 3000,
      color: 'warning',
      icon: 'wifi-outline',
      position: 'bottom'
    });
    toast.present();
  }

  /**
   * Muestra un Toast indicando que un dato fue encolado.
   */
  async showQueuedToast() {
    const toast = await this.toastController.create({
      message: 'Datos guardados localmente.',
      duration: 2000,
      color: 'medium',
      position: 'bottom'
    });
    toast.present();
  }

  /**
   * Muestra un Toast indicando que la sincronización comenzó.
   */
  async showSyncingToast() {
    const toast = await this.toastController.create({
      message: 'Sincronizando datos pendientes...',
      duration: 2000,
      color: 'primary',
      icon: 'sync-outline',
      position: 'top'
    });
    toast.present();
  }

  /**
   * Muestra un Toast indicando que la sincronización finalizó con éxito.
   */
  async showSyncSuccessToast() {
    const toast = await this.toastController.create({
      message: '¡Todos los datos han sido sincronizados!',
      duration: 3000,
      color: 'success',
      icon: 'checkmark-circle-outline',
      position: 'top'
    });
    toast.present();
  }
}
