import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { TranslateService } from '@ngx-translate/core';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { NavController } from '@ionic/angular';

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

  constructor(private entityService: EntityService, translateS: TranslateService, private navCtrl: NavController) {
   }

  async ngOnInit() {
  }

  async createPark() {
    //TODO Ajouter le manager, l'adresse via un modal
    await this.entityService.create(this.park, ParkUtil.parkCollectionName).then(
      id => {
        this.park.id = id;
      });
    this.park = ParkUtil.getEmptyPark();
    this.navCtrl.navigateForward('/home');
  }
}
