import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/auth.guard';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'dashboard'
}, {
  path: 'sign-in',
  loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule)
}, {
  path: 'dashboard',
  canActivate: [AuthGuard],
  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
}, {
  path: 'form',
  loadChildren: () => import('./form/form.module').then(m => m.FormModule)
}, {
  path: '**',
  redirectTo: 'dashboard'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRouting { }
