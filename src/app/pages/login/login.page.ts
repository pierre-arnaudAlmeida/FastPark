import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Util } from '../../classes/Util';
import { User } from '../../shared/User';
import { UserCredential } from '@firebase/auth-types';
import { UserUtil } from '../../classes/UserUtil';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  alertSignInErrorTitle: any;
  alertSignInErrorMessage: any;
  accountConnectionLoadingMessage: any;

  user: User = UserUtil.getEmptyUser();

  emailErrorCode: number;

  constructor(public aGuard: AuthGuard, public afAuth: AngularFireAuth, public alertController: AlertController, private router: Router, translateS: TranslateService, private loadingController: LoadingController) {
    translateS.get('LOGIN.signin-error-title').subscribe((value: any) => { this.alertSignInErrorTitle = value; });
    translateS.get('LOGIN.signin-error-message').subscribe((value: any) => { this.alertSignInErrorMessage = value; });
    translateS.get('LOGIN.account-connection-loading-message').subscribe((value: any) => { this.accountConnectionLoadingMessage = value; });
  }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingController.create({
      message: this.accountConnectionLoadingMessage,
      spinner: "bubbles",
    });

    await loading.present();
    await this.afAuth.signInWithEmailAndPassword(this.user.email.trim().toLocaleLowerCase(), this.user.password).then(
      async data => {
        let userCredential: UserCredential = data;
        Util.$currentUserId = userCredential.user.displayName;
        this.aGuard.isLoggedIn = true;
        loading.dismiss();
        this.user = UserUtil.getEmptyUser();
        this.router.navigateByUrl('/home');
      }
    ).catch(async error => {
      await this.showAlertMessage(this.alertSignInErrorTitle, this.alertSignInErrorMessage);
      loading.dismiss();
    });
  }

  /**
   * Affiche une popup avec un message précis
   * @param title 
   * @param message 
   */
  async showAlertMessage(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
