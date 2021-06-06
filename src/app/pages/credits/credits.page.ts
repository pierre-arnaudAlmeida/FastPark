import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.page.html',
  styleUrls: ['./credits.page.scss'],
})
export class CreditsPage implements OnInit {

  /**
   * Définition des différentes variables
   */
  imageUrl : string = 'assets/imgs/pegasus.png';
  
  constructor() { }

  ngOnInit() {
  }

}
