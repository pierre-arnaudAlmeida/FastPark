import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  selectedTheme: String;
  isToggled : boolean;
 
  constructor(private router: Router, private theme: ThemeService) {
    this.theme.getActiveTheme().subscribe(val => this.selectedTheme = val);
    if (this.selectedTheme === 'theme-dark') {  
      this.isToggled = true;
    } else {
      this.isToggled = false;
    }
  }
  
  async ngOnInit() {
  }

  toggleAppTheme() {
    if (this.selectedTheme === 'theme-dark') {  
      this.theme.setActiveTheme('theme-light');
      this.isToggled = false;
    } else {
      this.theme.setActiveTheme('theme-dark');
      this.isToggled = true;
    }
  }
}
