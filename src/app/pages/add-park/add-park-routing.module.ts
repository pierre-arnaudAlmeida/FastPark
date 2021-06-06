import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddParkPage } from './add-park.page';

const routes: Routes = [
  {
    path: '',
    component: AddParkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddParkPageRoutingModule {}
