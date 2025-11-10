// user-profile.ts
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AhorroVistaForm } from '../ahorro-vista-form/ahorro-vista-form';
import { AhorroProgramadoForm } from '../crear-ahorro-programado/crear-ahorro-programado';
import { CuentaDetalleComponent } from '../cuenta-detalle/cuenta-detalle';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AhorroVistaForm,
    AhorroProgramadoForm,
    CuentaDetalleComponent
  ],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  sidebarActive = false;
  currentTime: string = '';
  private timeInterval: any;

  // Control de vistas
  vistaActual: 'dashboard' | 'ahorro' | 'ahorroProgramado' | 'detalle' = 'dashboard';
  numeroCuentaSeleccionada: number | null = null; // <-- guardamos aquí el número recibido

  // Datos del usuario
  nombreUsuario: string = '';
  clienteId: number | null = null;
  mensajeBienvenida: string = '';

  // Datos de cuenta (para el detalle) — opcional
  datosCuentaSeleccionada: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 60000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  loadUserData(): void {
    this.nombreUsuario = localStorage.getItem('nombre') || 'Usuario';
    this.mensajeBienvenida = localStorage.getItem('mensaje') || '';
    const id = localStorage.getItem('clienteId');
    this.clienteId = id ? Number(id) : null;

    console.log('👤 Usuario logueado:', {
      nombre: this.nombreUsuario,
      clienteId: this.clienteId,
      mensaje: this.mensajeBienvenida
    });

    if (!this.clienteId) {
      console.warn('⚠️ No hay sesión activa. Redirigiendo al login...');
      this.router.navigate(['/login']);
    }
  }

  updateTime(): void {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    this.currentTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  toggleSidebar(): void { this.sidebarActive = !this.sidebarActive; }
  closeSidebar(): void { this.sidebarActive = false; }
  preventDefault(e: Event): void { e.preventDefault(); }

  irAFormularioAhorro(): void { this.vistaActual = 'ahorro'; this.closeSidebar(); }
  irAFormularioAhorroProgramado(): void { this.vistaActual = 'ahorroProgramado'; this.closeSidebar(); }
  volverAlDashboard(): void { this.vistaActual = 'dashboard'; this.closeSidebar(); }

  // --------- AQUÍ: recibe el número de cuenta emitido por el formulario -----------
  abrirDetalleCuenta(numeroCuenta: number): void {
    console.log('📘 Número de cuenta recibido del formulario:', numeroCuenta);
    this.numeroCuentaSeleccionada = numeroCuenta;
    this.vistaActual = 'detalle';
  }
  // -----------------------------------------------------------------------------

  cerrarDetalleCuenta(): void {
    this.datosCuentaSeleccionada = null;
    this.numeroCuentaSeleccionada = null;
    this.volverAlDashboard();
  }

  cerrarSesion(): void {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth <= 768) { this.sidebarActive = false; }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.sidebarActive && keyboardEvent.key === 'Escape') {
      this.closeSidebar();
    }
  }
}
