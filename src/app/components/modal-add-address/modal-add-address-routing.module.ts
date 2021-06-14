import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddAddressPage } from './modal-add-address.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddAddressPageRoutingModule {}
