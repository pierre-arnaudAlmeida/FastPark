import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddParkPage } from './add-park.page';

const routes: Routes = [
  { path: '', component: AddParkPage },
  { path: 'home', redirectTo: '/home', pathMatch: 'full' },
  { path: 'add-park', redirectTo: '/add-park', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'settings', redirectTo: '/settings', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddParkPageRoutingModule {}
