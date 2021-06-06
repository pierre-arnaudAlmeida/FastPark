import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntityService } from '../../services/entity.service';
import { TranslateService } from '@ngx-translate/core';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-park',
  templateUrl: './add-park.page.html',
  styleUrls: ['./add-park.page.scss'],
})
export class AddParkPage implements OnInit {

  alertNewGroupHeader: any;
  alertLaunchGroupHeader: any;
  alertNewGroupTitle: any;
  alertCancel: any;
  alertValid: any;
  toastCreationMessage: any;

  park: Park = ParkUtil.getEmptyPark();

  constructor(private entityService: EntityService, translateS: TranslateService) {
   }

  ngOnInit() {
  }

  async createPark() {
    //TODO Ajouter d'autres informations que le nom du parking
    // ajouter le manager, l'adresse, le nombre de place
    await this.entityService.create(this.park, ParkUtil.parkCollectionName).then(
      id => {
        this.park.id = id;
        console.log(this.park.id);
      });
  }
}
