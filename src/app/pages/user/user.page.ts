import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserUtil } from '../../classes/UserUtil';
import { User } from '../../shared/User';
import { Util } from '../../classes/Util';
import { EntityService } from '../../services/entity.service';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { ParkUtil } from 'src/app/classes/ParkUtil';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  userDetails: User = UserUtil.getEmptyUser();
  user: User = UserUtil.getEmptyUser();
  allParks = [];

  processingMessage: any;
  alertEmailHeader: any;
  alertEmailMessage: any;
  alertEmailError: any;

  constructor(private entityService: EntityService, public afAuth: AngularFireAuth, private actRoute: ActivatedRoute, public alertController: AlertController, translateS: TranslateService, private loadingController: LoadingController) {
    this.user.id = this.actRoute.snapshot.paramMap.get('id');
    translateS.get('PROFILE.processing-message').subscribe((value: any) => { this.processingMessage = value; });
    translateS.get('PROFILE.popup-email-changed-header').subscribe((value: any) => { this.alertEmailHeader = value; });
    translateS.get('PROFILE.popup-email-changed-message').subscribe((value: any) => { this.alertEmailMessage = value; });
    translateS.get('UTILS.popup-email-error').subscribe((value: any) => { this.alertEmailError = value; });
    
   }

  async ngOnInit() {
    await this.entityService.getById(this.user.id, UserUtil.userCollectionName).subscribe(data => {
      this.userDetails = UserUtil.mapItem(data.payload, UserUtil.userCollectionName);
    });

    await this.entityService.getById(Util.$currentUserId, UserUtil.userCollectionName).subscribe(data => {
      this.user = UserUtil.mapItem(data.payload, UserUtil.userCollectionName);
    });
  }

  async onChangeUserEmail(new_email: string) {
    const loading = await this.loadingController.create({
      message: this.processingMessage
    });

    if (new_email.indexOf('@') != -1) {
      this.userDetails.email = new_email.trim();
      this.updateUserAccount();
      this.showAlertMessage(this.alertEmailHeader, this.alertEmailMessage);
    } else {
      this.showAlertMessage(this.alertEmailHeader, this.alertEmailError);
    }
  }

  onChangeUserFirstName() {
    let firstName = this.userDetails.firstName.trim();
    const size: number = firstName.length;

    if (size > 0) {
      if (size > 1) {
        firstName = firstName.charAt(0).toUpperCase() + firstName.substring(1, size).toLowerCase();
      }
      else {
        firstName = firstName.toUpperCase();
      }
    }
    this.userDetails.firstName = firstName;
    this.updateUserAccount();
  }

  onChangeUserLastName() {
    this.userDetails.lastName = this.userDetails.lastName.toUpperCase().trim();
    this.updateUserAccount();
  }

  async updateUserAccount() {
    this.userDetails.updateDate = new Date().toISOString();
    await this.entityService.update(this.userDetails.id, this.userDetails, UserUtil.userCollectionName);
  }

  async showAlertMessage(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async deleteUserAccount() {
    await this.entityService.delete(this.userDetails.id, UserUtil.userCollectionName);
  }

  async deleteUserManager() {
    await this.entityService.getAll(ParkUtil.parkCollectionName).subscribe(data => {
      this.allParks = ParkUtil.mapCollection(data, ParkUtil.parkCollectionName);
    });
    this.allParks.forEach(async park => {
      if (park.managerId == this.userDetails.id) {
        park.managerId = "";
        await this.entityService.update(park.id, park, ParkUtil.parkCollectionName);
      }
    });
  }
}
