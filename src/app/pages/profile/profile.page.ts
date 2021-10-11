import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../shared/User';
import { Util } from '../../classes/Util';
import { EntityService } from '../../services/entity.service';
import { UserUtil } from '../../classes/UserUtil';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { ParkUtil } from 'src/app/classes/ParkUtil';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  alertEmailHeader: any;
  alertEmailMessage: any;
  alertEmailError: any;
  alertPasswordHeader: any;
  alertOldPasswordFieldHeader: any;
  alertNewPasswordFieldHeader: any;
  alertConfirmNewPasswordFieldHeader: any;
  alertPasswordCancel: any;
  alertPasswordValid: any;
  alertDisconnectionHeader: any;
  alertDisconnectionMessage: any;
  alertVerifiedEmailSendHeader: any;
  alertVerifiedEmailSendMessage: any;
  alertErrorHeader: any;
  alertSuccessHeader: any;
  processingMessage: any;
  actionDisconnectionMessage: any;
  actionVerifiedEmailSendMessage: any;
  actionDeleteAccountHeader: any;
  actionDeleteAccountMessage: any;
  alertPasswordMessage: any;
  alertPasswordSizeMessage: any;
  alertPasswordErrorHeader: any;
  alertPasswordDifferentMessage: any;

  allParks = [];
  user: User = UserUtil.getEmptyUser();
  userBeforeUpdate: User;
  hasVerifiedEmail = true;
  empty_string = "";

  constructor(public aGuard: AuthGuard, private router: Router, public alertController: AlertController, public afAuth: AngularFireAuth, translateS: TranslateService, private loadingController: LoadingController,
    private entityService: EntityService) {
    translateS.get('PROFILE.popup-logout-header').subscribe((value: any) => { this.alertDisconnectionHeader = value; });
    translateS.get('PROFILE.popup-logout-message').subscribe((value: any) => { this.alertDisconnectionMessage = value; });
    translateS.get('PROFILE.popup-email-changed-header').subscribe((value: any) => { this.alertEmailHeader = value; });
    translateS.get('PROFILE.popup-email-changed-message').subscribe((value: any) => { this.alertEmailMessage = value; });
    translateS.get('UTILS.popup-email-error').subscribe((value: any) => { this.alertEmailError = value; });
    translateS.get('PROFILE.popup-password-header').subscribe((value: any) => { this.alertPasswordHeader = value; });
    translateS.get('PROFILE.popup-old-password-field-header').subscribe((value: any) => { this.alertOldPasswordFieldHeader = value; });
    translateS.get('PROFILE.popup-new-password-field-header').subscribe((value: any) => { this.alertNewPasswordFieldHeader = value; });
    translateS.get('PROFILE.popup-confirm-new-password-field-header').subscribe((value: any) => { this.alertConfirmNewPasswordFieldHeader = value; });
    translateS.get('UTILS.cancel').subscribe((value: any) => { this.alertPasswordCancel = value; });
    translateS.get('UTILS.valid').subscribe((value: any) => { this.alertPasswordValid = value; });
    translateS.get('PROFILE.processing-message').subscribe((value: any) => { this.processingMessage = value; });
    translateS.get('PROFILE.popup-email-verification-header').subscribe((value: any) => { this.alertVerifiedEmailSendHeader = value; });
    translateS.get('PROFILE.popup-email-verification-message').subscribe((value: any) => { this.alertVerifiedEmailSendMessage = value; });
    translateS.get('UTILS.error').subscribe((value: any) => { this.alertErrorHeader = value; });
    translateS.get('UTILS.success').subscribe((value: any) => { this.alertSuccessHeader = value; });
    translateS.get('PROFILE.popup-before-logout-message').subscribe((value: any) => { this.actionDisconnectionMessage = value; });
    translateS.get('PROFILE.popup-before-email-verification-message').subscribe((value: any) => { this.actionVerifiedEmailSendMessage = value; });
    translateS.get('PROFILE.delete-account').subscribe((value: any) => { this.actionDeleteAccountHeader = value; });
    translateS.get('PROFILE.popup-before-delete-account-message').subscribe((value: any) => { this.actionDeleteAccountMessage = value; });
    translateS.get('PROFILE.popup-password-changed-message').subscribe((value: any) => { this.alertPasswordMessage = value; });
    translateS.get('PROFILE.popup-password-size-error-message').subscribe((value: any) => { this.alertPasswordSizeMessage = value; });
    translateS.get('PROFILE.popup-password-error-header').subscribe((value: any) => { this.alertPasswordErrorHeader = value; });
    translateS.get('PROFILE.popup-password-different-message').subscribe((value: any) => { this.alertPasswordDifferentMessage = value; });

    this.afAuth.currentUser.then((user) => {
      if(user === null || user === undefined) return false
        this.hasVerifiedEmail = user.emailVerified;
    });
  }
  
  async ngOnInit() {
    await this.entityService.getById(Util.$currentUserId, UserUtil.userCollectionName).subscribe(data => {
      this.user = UserUtil.mapItem(data.payload, UserUtil.userCollectionName);
      this.userBeforeUpdate = Object.assign({}, this.user);
    });
  }

  async sendVerificationEmail() {
    const alert = await this.alertController.create({
      header: this.alertVerifiedEmailSendHeader,
      message: this.actionVerifiedEmailSendMessage,
      buttons: [{
        text: this.alertPasswordCancel,
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: this.alertPasswordValid,
        handler: () => {
          this.afAuth.currentUser.then((user) => {
            return user.sendEmailVerification();
          });
          this.showAlertMessage(this.alertVerifiedEmailSendHeader, this.alertVerifiedEmailSendMessage);
          this.hasVerifiedEmail = true;
        }
      }
      ]
    });
    await alert.present();
  }

  async onChangeEmail(new_email: string) {
    const loading = await this.loadingController.create({
      message: this.processingMessage
    });

    if (new_email.indexOf('@') != -1) {
      this.user.email = new_email.trim();
      this.afAuth.currentUser.then((user) => {
        return user.updateEmail(new_email.trim());
      });
      await this.entityService.update(Util.$currentUserId, this.user, UserUtil.userCollectionName);
      this.sendVerificationEmail();
      this.showAlertMessage(this.alertEmailHeader, this.alertEmailMessage);
    } else {
      this.showAlertMessage(this.alertEmailHeader, this.alertEmailError);
    }
  }

  async onChangePassword() {
    const alert = await this.alertController.create({
      header: this.alertPasswordHeader,
      inputs: [
        {
          placeholder: this.alertOldPasswordFieldHeader,
          name: 'oldPassword',
          type: 'password'
        },
        {
          placeholder: this.alertNewPasswordFieldHeader,
          name: 'newPassword',
          type: 'password'
        },
        {
          placeholder: this.alertConfirmNewPasswordFieldHeader,
          name: 'confirmNewPassword',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: this.alertPasswordCancel,
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: this.alertPasswordValid,
          handler: async (data) => {
            if (data.newPassword == data.confirmNewPassword) {
              await this.afAuth.signInWithEmailAndPassword(this.userBeforeUpdate.email.trim(), data.oldPassword).then(
                async (connectedUser) => {
                  connectedUser.user.updatePassword(data.newPassword).then(
                    () => {
                      this.showAlertMessage(this.alertPasswordMessage, this.empty_string);
                    }
                  ).catch((error) => {
                    this.showAlertMessage(this.alertErrorHeader, this.alertPasswordSizeMessage);
                  });
                }
              ).catch(async error => {
                await this.showAlertMessage(this.alertPasswordErrorHeader, this.empty_string);
              });
            }
            else {
              this.showAlertMessage(this.alertPasswordDifferentMessage, this.empty_string);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  onChangeFirstName() {
    let firstName = this.user.firstName.trim();
    const size: number = firstName.length;

    if (size > 0) {
      if (size > 1) {
        firstName = firstName.charAt(0).toUpperCase() + firstName.substring(1, size).toLowerCase();
      }
      else {
        firstName = firstName.toUpperCase();
      }
    }
    this.user.firstName = firstName;
    this.updateAccount();
  }

  onChangeLastName() {
    this.user.lastName = this.user.lastName.toUpperCase().trim();
    this.updateAccount();
  }

  async updateAccount() {
    this.user.updateDate = new Date().toISOString();
    await this.entityService.update(Util.$currentUserId, this.user, UserUtil.userCollectionName);
  }

  async logout() {
    this.afAuth.signOut().then(async () => {
      Util.$currentUserId = null;
      this.aGuard.isLoggedIn = false;
    }).finally(
      () => {
        this.router.navigateByUrl('/login');
      }
    );
  }

  async showAlertMessage(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async deleteAccount() {
    //TODO supprimer le managerId du parking
    await this.afAuth.currentUser.then((user) => {
      return user.delete();
    });
    await this.entityService.delete(this.user.id, UserUtil.userCollectionName);
  }

  async deleteManager() {
    await this.entityService.getAll(ParkUtil.parkCollectionName).subscribe(data => {
      this.allParks = ParkUtil.mapCollection(data, ParkUtil.parkCollectionName);
    });
    this.allParks.forEach(async park => {
      if (park.managerId == this.user.id) {
        park.managerId = "";
        await this.entityService.update(park.id, park, ParkUtil.parkCollectionName);
      }
    });
  }
}
