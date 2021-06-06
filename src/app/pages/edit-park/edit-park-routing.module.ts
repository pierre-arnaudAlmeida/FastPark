import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditParkPage } from './edit-park.page';

const routes: Routes = [
  {
    path: '',
    component: EditParkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditParkPageRoutingModule {}
