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
/**
   * Définition des différentes variables
   */
  toastLanguageMessage: any;

  languages = [];
  selected = '';
 
  constructor(private languageService: LanguageService, public toastController: ToastController, translateS: TranslateService) {
    /**
     * Récupération des différentes traductions pour les messages à afficher
     */
    translateS.get('UTILS.language-message').subscribe((value: any) => { this.toastLanguageMessage = value; });
   }
 
  /**
   * Initialisation de la langue en fonction des paramètres précédent
   */
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

  /**
   * Crée un toast pour dire que le changement de langue a été correctement réaliser
   */
  async presentToast() {
    const toast = await this.toastController.create({
      message: this.toastLanguageMessage,
      duration: 2000
    });
    toast.present();
  }
}
