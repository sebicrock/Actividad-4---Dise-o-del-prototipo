import { Routes } from '@angular/router';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { AhorroVistaForm } from './components/ahorro-vista-form/ahorro-vista-form';
import { AhorroProgramadoForm } from './components/crear-ahorro-programado/crear-ahorro-programado';

export const routes: Routes = [
  { path: '', component: ClientFormComponent },
  { path: 'login', component: LoginComponent },

  { 
    path: 'perfil',
    component: UserProfileComponent,
    children: [
      { path: '', redirectTo: 'crear-ahorro', pathMatch: 'full' }, // redirección por defecto
      { path: 'crear-ahorro', component: AhorroVistaForm },
      { path: 'ahorro-programado', component: AhorroProgramadoForm}
    ]
  },

  { path: '**', redirectTo: '/login' } // ruta comodín
];
