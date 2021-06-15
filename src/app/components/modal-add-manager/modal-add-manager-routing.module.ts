import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddManagerPage } from './modal-add-manager.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddManagerPageRoutingModule {}
