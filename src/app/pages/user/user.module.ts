import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserPageRoutingModule } from './user-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { UserPage } from './user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule,
    TranslateModule
  ],
  declarations: [UserPage]
})
export class UserPageModule {}
