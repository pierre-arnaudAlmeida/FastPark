import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'home', redirectTo: '/home', pathMatch: 'full' },
  { path: 'add-park', redirectTo: '/add-park', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'settings', redirectTo: '/settings', pathMatch: 'full' },
  { path: 'parks', redirectTo: '/parks', pathMatch: 'full' },
  { path: 'users', redirectTo: '/users', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
