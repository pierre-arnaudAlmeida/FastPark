import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParkPage } from './park.page';

const routes: Routes = [
  { path: '', component: ParkPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParkPageRoutingModule {}
