import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguageService } from './services/language.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  selectedTheme: String;

  constructor(private languageService: LanguageService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private theme: ThemeService) {
    this.initializeApp();
  }

  initializeApp() {
    this.theme.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.languageService.setInitialAppLanguage();
    });
  }
}
