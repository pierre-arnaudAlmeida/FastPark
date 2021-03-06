import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationPage } from './authorization.page';

const routes: Routes = [
  {
    path: '',
    component: AuthorizationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationPageRoutingModule {}
