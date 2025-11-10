import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../service/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.html',
  styleUrls: ['./client-form.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ClientFormComponent {
  clientData = {
    fullNames: '',
    fullSurNames: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    gender: '',
    age: '',
    mobilePhone: '',
    address: '',
    city: '',
    department: '',
    email: '',
    income: 0,
    employmentStatus: '',
    occupation: '',
    companyName: '',
    yearsOfExperience: 0,
    acceptTerms: false,
    user: [
      {
        userName: '',
        password: '',
        role: 'Cliente'
      }
    ]
  };

  confirmPassword: string = '';
  mensaje: string = '';

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  /**
   * Calcula la edad automáticamente basándose en la fecha de nacimiento
   */
  calculateAge(): void {
    if (this.clientData.birthDate) {
      const birth = new Date(this.clientData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      this.clientData.age = age.toString();
    }
  }

  /**
   * Valida que las contraseñas coincidan
   */
  passwordsMatch(): boolean {
    return this.clientData.user[0].password === this.confirmPassword;
  }

  /**
   * Envía el formulario al backend
   */
  onSubmit(): void {
    // Validar contraseñas antes de enviar
    if (!this.passwordsMatch()) {
      this.mensaje = '⚠️ Las contraseñas no coinciden. Por favor, verifíquelas.';
      return;
    }

    // Validar edad mínima
    if (Number(this.clientData.age) < 18) {
      this.mensaje = '⚠️ Debe ser mayor de 18 años para registrarse.';
      return;
    }

    // Preparar datos para enviar
    const clientToSend = {
      ...this.clientData,
      age: Number(this.clientData.age),
      mobilePhone: Number(this.clientData.mobilePhone),
      income: Number(this.clientData.income),
      yearsOfExperience: Number(this.clientData.yearsOfExperience)
    };

    console.log('📤 Enviando datos al backend:', clientToSend);
    
    this.clientService.createClient(clientToSend).subscribe({
      next: (response) => {
        console.log('✅ Respuesta exitosa del servidor:', response);

        if (response.mensaje && response.mensaje.includes('éxito')) {
          this.mensaje = `✅ ${response.mensaje}: el cliente ${response.nombre || this.clientData.fullNames} con el usuario ${response.usuario || this.clientData.user[0].userName} fue creado correctamente.`;

          // Redirigir al login después de 2.5 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);
        } else {
          this.mensaje = `⚠️ ${response.mensaje || 'Registro procesado pero con advertencias.'}`;
        }
      },
      error: (error) => {
        console.error('❌ Error al crear cliente:', error);
        
        if (error.error) {
          // Mensaje principal
          this.mensaje = `⚠️ ${error.error.mensaje || 'Error al crear el cliente.'}`;

          // Si hay errores detallados, los agregamos
          if (Array.isArray(error.error.errores) && error.error.errores.length > 0) {
            const detalles = error.error.errores.join(', ');
            this.mensaje += ` Detalle: ${detalles}`;
          }
        } else if (error.status === 0) {
          this.mensaje = '❌ No se pudo conectar con el servidor. Verifique su conexión.';
        } else {
          this.mensaje = '❌ Ocurrió un error inesperado al crear el cliente.';
        }
      }
    });
  }

  /**
   * Resetea el formulario a su estado inicial
   */
  resetForm(): void {
    this.clientData = {
      fullNames: '',
      fullSurNames: '',
      documentType: '',
      documentNumber: '',
      birthDate: '',
      gender: '',
      age: '',
      mobilePhone: '',
      address: '',
      city: '',
      department: '',
      email: '',
      income: 0,
      employmentStatus: '',
      occupation: '',
      companyName: '',
      yearsOfExperience: 0,
      acceptTerms: false,
      user: [
        {
          userName: '',
          password: '',
          role: 'Cliente'
        }
      ]
    };
    this.confirmPassword = '';
    this.mensaje = '';
  }
}