// cuenta-detalle.ts
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cuenta-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cuenta-detalle.html',
  styleUrls: ['./cuenta-detalle.css']
})
export class CuentaDetalleComponent implements OnChanges {

  @Input() numeroCuenta: number | null = null;
  @Output() volverClick = new EventEmitter<void>();

  datosCuenta: any = {
    mensaje: '',
    name: '',
    numberAccount: 0,
    numberDebitCard: null,
    tipoCuenta: '',
    depositoInicial: 0,
    includeDebitCard: false,
    CurrentAccountBalance: 0,
    creationData: '',
    linkedDebitCard: null,
    cards: []
  };

  saldo: number = 0;
  transacciones: any[] = [];
  cargando = false;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['numeroCuenta'] && this.numeroCuenta != null) {
      this.cargarCuenta(this.numeroCuenta);
    }
  }

  cargarCuenta(numeroCuenta: number) {
    this.cargando = true;
    console.log(`📥 Cargando cuenta número ${numeroCuenta}...`);
    const apiUrl = `http://localhost:8080/bank/cuentas/${numeroCuenta}`;
    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.datosCuenta = {
          mensaje: 'Cuenta cargada con éxito',
          name: data.userCreate || data.name || '',
          numberAccount: data.accountNumber ?? numeroCuenta,
          numberDebitCard: data.linkendDebitCard || (data.cards?.length > 0 ? data.cards[0].numberCard : null),
          tipoCuenta: data.typeAccount || data.tipoCuenta || '',
          depositoInicial: data.initialDeposit ?? 0,
          includeDebitCard: !!(data.linkendDebitCard || (data.cards?.length > 0 ? data.cards[0].numberCard : null)),
          CurrentAccountBalance: data.currentAccountBalance ?? 0,
          creationData: data.creationData || '',
          linkedDebitCard: data.linkendDebitCard,
          cards: data.cards || []
        };

        this.saldo = this.datosCuenta.CurrentAccountBalance || 0;
        this.cargarTransacciones();
        this.cargando = false;
        console.log('📊 Datos de la cuenta cargados:', this.datosCuenta);
      },
      error: (err) => {
        console.error('❌ Error al cargar cuenta:', err);
        this.cargando = false;
      }
    });
  }

  cargarTransacciones() {
    const accountNumber = this.datosCuenta?.numberAccount;
    if (!accountNumber) {
      this.transacciones = [];
      return;
    }
    const apiUrl = `http://localhost:8080/bank/cuentas/${accountNumber}/transacciones`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.transacciones = data || [];
        console.log('✅ Transacciones cargadas:', data);
      },
      error: (error) => {
        console.error('❌ Error al cargar transacciones:', error);
        this.transacciones = [];
      }
    });
  }

  volver() { this.volverClick.emit(); }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(monto);
  }

  obtenerTipoCuenta(): string {
    const tipos: any = { 'basic': 'Básica', 'premium': 'Premium', 'empresarial': 'Empresarial', 'AHORROS': 'Ahorros', 'CORRIENTE': 'Corriente' };
    return tipos[this.datosCuenta.tipoCuenta] || this.datosCuenta.tipoCuenta;
  }
}
