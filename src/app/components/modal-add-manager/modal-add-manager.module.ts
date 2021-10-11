import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalAddManagerPageRoutingModule } from './modal-add-manager-routing.module';
import { ModalAddManagerPage } from './modal-add-manager.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddManagerPageRoutingModule,
    TranslateModule
  ],
  declarations: [ModalAddManagerPage]
})
export class ModalAddManagerPageModule {}
