import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserUtil } from '../../classes/UserUtil';
import { Util } from '../../classes/Util';
import { User } from '../../shared/User';
import * as firebase from 'firebase';
import { AlertController, NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  alertEmailErrorMessage: any;
  resetEmailTitle: any;
  resetEmailMessage: any;

  user: User = UserUtil.getEmptyUser();

  constructor(private navCtrl: NavController, translateS: TranslateService, public alertController: AlertController, private toastController: ToastController) {
    translateS.get('UTILS.popup-email-error').subscribe((value: any) => { this.alertEmailErrorMessage = value; });
    translateS.get('UTILS.email-reset-title').subscribe((value: any) => { this.resetEmailTitle = value; });
    translateS.get('RESET-PASSWORD.email-reset-message').subscribe((value: any) => { this.resetEmailMessage = value; });
  }

  ngOnInit() {
  }

  async resetPassword() {
    var email: string = this.user.email.trim().toLocaleLowerCase();

    if (!Util.emailRegex.test(email)) {
      await this.showAlertMessage(this.resetEmailTitle, this.alertEmailErrorMessage);
    }
    var auth = firebase.default.auth();
    return auth.sendPasswordResetEmail(email)
      .then(() => this.presentToast())
  }

  async showAlertMessage(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * Crée un toast pour dire que la suppression a été correctement réaliser
   */
  async presentToast() {
    const toast = await this.toastController.create({
      message: this.resetEmailMessage,
      duration: 2000
    });
    this.navCtrl.navigateForward('/login');
    toast.present();
  }
}
