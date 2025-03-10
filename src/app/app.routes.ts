//app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MenuComponent } from './pages/menu/menu.component';
import { OrdenComponent } from './pages/orden/orden.component';

export const routes: Routes = [

    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent},
    { path: 'admin', component: AdminComponent },
    { path: 'menu', component: MenuComponent},
    { path: 'orden', component: OrdenComponent},
];
