import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
})
export class LanguagesPage implements OnInit {

  toastLanguageMessage: any;

  languages = [];
  selected = '';
 
  constructor(private languageService: LanguageService, public toastController: ToastController, translateS: TranslateService) {
    translateS.get('UTILS.language-message').subscribe((value: any) => { this.toastLanguageMessage = value; });
  }
 
  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.selected = this.languageService.selected;
  }
 
  /**
   * Change la langue de l'application
   * @param lng 
   */
  select(lng) {
    this.languageService.setLanguage(lng);
    this.selected = this.languageService.selected;
    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.toastLanguageMessage,
      duration: 2000
    });
    toast.present();
  }
}
