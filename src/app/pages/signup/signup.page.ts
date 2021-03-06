import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, NavController, LoadingController, ToastController } from '@ionic/angular';
import { Util } from '../../classes/Util';
import { User } from '../../shared/User';
import { TranslateService } from '@ngx-translate/core';
import { EntityService } from '../../services/entity.service';
import { UserUtil } from 'src/app/classes/UserUtil';
import { AuthGuard } from '../../guards/auth.guard';
import { UserCredential } from '@firebase/auth-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  alertEmailErrorTitle: any;
  alertEmailErrorMessage: any;
  alertPasswordErrorTitle: any;
  alertPasswordErrorMessage: any;
  alertDifferentPasswordErrorMessage: any;
  alertAccountCreationTitle: any;
  alertAccountCreationErrorTitle: any;
  alertAccountCreationErrorMessage: any;
  accountCreationLoadingMessage: any;
  alertFieldsErrorMessage: any;
  alertFieldsErrorTitle:any;
  passwordConfirmation: any;

  user: User = UserUtil.getEmptyUser();

  constructor(private router: Router, public aGuard: AuthGuard, public afAuth: AngularFireAuth, private navCtrl: NavController, public alertController: AlertController, translateS: TranslateService,
    private entityService: EntityService, private loadingController: LoadingController,public toastController: ToastController) {
    translateS.get('SIGNUP.email-error-title').subscribe((value: any) => { this.alertEmailErrorTitle = value; });
    translateS.get('SIGNUP.email-error-message').subscribe((value: any) => { this.alertEmailErrorMessage = value; });
    translateS.get('SIGNUP.password-error-title').subscribe((value: any) => { this.alertPasswordErrorTitle = value; });
    translateS.get('SIGNUP.password-error-message').subscribe((value: any) => { this.alertPasswordErrorMessage = value; });
    translateS.get('SIGNUP.account-creation-title').subscribe((value: any) => { this.alertAccountCreationTitle = value; });
    translateS.get('SIGNUP.account-creation-error-title').subscribe((value: any) => { this.alertAccountCreationErrorTitle = value; });
    translateS.get('SIGNUP.account-creation-error-message').subscribe((value: any) => { this.alertAccountCreationErrorMessage = value; });
    translateS.get('SIGNUP.account-creation-loading-message').subscribe((value: any) => { this.accountCreationLoadingMessage = value; });
    translateS.get('SIGNUP.different-password-error-message').subscribe((value: any) => { this.alertDifferentPasswordErrorMessage = value; });
    translateS.get('SIGNUP.fields-error-title').subscribe((value: any) => { this.alertFieldsErrorMessage = value; });
    translateS.get('SIGNUP.fields-error-message').subscribe((value: any) => { this.alertFieldsErrorTitle = value; });
  }

  ngOnInit() {
  }

  async createAccount() {

    const loading = await this.loadingController.create({
      message: this.accountCreationLoadingMessage
    });
    var email: string = this.user.email.trim().toLocaleLowerCase();

    if (!Util.emailRegex.test(email)) {
      await this.showAlertMessage(this.alertEmailErrorTitle, this.alertEmailErrorMessage);
    }
    else if (this.user.password.length < 6) {
      await this.showAlertMessage(this.alertPasswordErrorTitle, this.alertPasswordErrorMessage);
    }
    else if (this.user.password != this.passwordConfirmation) {
      await this.showAlertMessage(this.alertPasswordErrorTitle, this.alertDifferentPasswordErrorMessage);
    }
    else if (this.user.firstName.length== 0 || this.user.lastName.length == 0) {
      await this.showAlertMessage(this.alertFieldsErrorTitle, this.alertFieldsErrorMessage);
    }
    else {
      await loading.present();
      var password = this.user.password;

      await this.afAuth.createUserWithEmailAndPassword(email, this.user.password).then(
        async (newUser) => {
          this.user.password = "";
          this.user.role = "USER"
          await this.entityService.create(this.user, UserUtil.userCollectionName).then(
            id => {
              newUser.user.updateProfile({
                displayName: id,
              });
              loading.dismiss();
            });
          this.presentToast();
          this.afAuth.currentUser.then((user) => {
            return user.sendEmailVerification();
          });

          await this.afAuth.signInWithEmailAndPassword(email, password).then(
            async data => {
              let userCredential: UserCredential = data;
              Util.$currentUserId = userCredential.user.displayName;
              this.aGuard.isLoggedIn = true;
              loading.dismiss();
              this.router.navigateByUrl('/home');
            }
          ).catch(async error => {
            this.navCtrl.navigateForward('/login');
          });
        }
      ).catch(async error => {
        await this.showAlertMessage(this.alertAccountCreationErrorTitle, this.alertAccountCreationErrorMessage);
      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  async showAlertMessage(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.alertAccountCreationTitle,
      duration: 2000
    });
    toast.present();
  }
}
