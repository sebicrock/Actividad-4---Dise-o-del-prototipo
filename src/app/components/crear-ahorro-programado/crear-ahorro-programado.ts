import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ahorro-programado-form',
  standalone: true,
  templateUrl: './crear-ahorro-programado.html',
  styleUrls: ['./crear-ahorro-programado.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class AhorroProgramadoForm {

  // ✅ Emite el número de cuenta al componente padre
  @Output() irACuenta = new EventEmitter<number>();

  // Datos del formulario
  savingsData: any = {
    goalType: '',
    customGoal: "",
    targetAmount: 0,
    termMonths: 0,
    sourceAccount: 0,
    debitDay: 0,
    allowExtraDeposits: false,
    autoRenew: false,
    notifications: true,
    idCliente: null
  };

  mensaje: string = '';
  loading: boolean = false;

  monthlyAmount: number = 0;
  estimatedInterest: number = 0;
  totalWithInterest: number = 0;

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    if (!this.savingsData.idCliente || !this.savingsData.targetAmount || !this.savingsData.termMonths) {
      this.mensaje = 'Por favor completa los campos obligatorios antes de continuar.';
      return;
    }

    this.loading = true;
    const url = 'http://localhost:8080/api/ahorro-programado/crear';

    this.http.post(url, this.savingsData).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('✅ Respuesta del backend:', res);
        this.mensaje = res.mensaje || '¡Ahorro programado creado exitosamente!';

        // ✅ Emitir el número de cuenta creado al componente padre
        if (res.numberAccount) {
          this.irACuenta.emit(res.numberAccount);
        }

        // ✅ Guardar en localStorage (opcional para persistir los datos)
        localStorage.setItem('nuevaCuenta', JSON.stringify(res));
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error al crear el ahorro programado:', err);
        this.mensaje = err.error?.mensaje || 'Ocurrió un error al crear el ahorro.';
      }
    });
  }

  volverAlDashboard() {
    this.router.navigate(['/perfil']);
  }
}
