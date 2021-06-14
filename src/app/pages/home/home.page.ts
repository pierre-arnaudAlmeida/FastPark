import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntityService } from '../../services/entity.service';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { Util } from '../../classes/Util';
import { property } from '../../app.property';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  allParks = [];
  park: Park = ParkUtil.getEmptyPark();

  constructor(private router: Router, private entityService: EntityService, public alertController: AlertController) {
  }

  async ngOnInit() {
    if (!Util.isUserConnected()) {
      this.router.navigateByUrl("/login");
    }
    
    await this.entityService.getAll(property.collectionName.parks).subscribe(data => {
      this.allParks = ParkUtil.mapCollection(data, property.collectionName.parks);
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
