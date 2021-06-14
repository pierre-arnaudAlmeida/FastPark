import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { NavController } from '@ionic/angular';
import { Util } from '../../classes/Util';
import { Router } from '@angular/router';

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
  
  constructor(private router: Router, private entityService: EntityService, private navCtrl: NavController) {
  }

  async ngOnInit() {
    if (!Util.isUserConnected()) {
      this.router.navigateByUrl("/login");
    }
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

  addAddress() {
  }

}
