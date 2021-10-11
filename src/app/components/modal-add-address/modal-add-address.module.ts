import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalAddAddressPageRoutingModule } from './modal-add-address-routing.module';
import { ModalAddAddressPage } from './modal-add-address.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddAddressPageRoutingModule,
    TranslateModule
  ],
  declarations: [ModalAddAddressPage]
})
export class ModalAddAddressPageModule {}
