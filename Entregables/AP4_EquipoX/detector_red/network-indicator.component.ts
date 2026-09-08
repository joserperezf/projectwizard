import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NetworkService } from './network.service';
import { Observable } from 'rxjs';

/**
 * Componente visual que muestra un banner indicando si la aplicación
 * se encuentra en línea o fuera de línea.
 */
@Component({
  selector: 'app-network-indicator',
  templateUrl: './network-indicator.component.html',
  styleUrls: ['./network-indicator.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class NetworkIndicatorComponent implements OnInit {
  /** Observable que emite el estado de conexión actual */
  public isOnline$!: Observable<boolean>;

  constructor(private networkService: NetworkService) {}

  /**
   * Inicializa el componente y se suscribe al estado de red.
   */
  ngOnInit() {
    this.isOnline$ = this.networkService.getOnlineStatus();
  }
}
