import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditParkPageRoutingModule } from './edit-park-routing.module';

import { EditParkPage } from './edit-park.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditParkPageRoutingModule,
    TranslateModule
  ],
  declarations: [EditParkPage]
})
export class EditParkPageModule {}
