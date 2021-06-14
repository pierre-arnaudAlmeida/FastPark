import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { Address } from '../../shared/Address';
import { AddressUtil } from '../../classes/AddressUtil';
import { NavController } from '@ionic/angular';
import { Util } from '../../classes/Util';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalAddAddressPage } from '../../components/modal-add-address/modal-add-address.page';

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
  address: Address = AddressUtil.getEmptyAddress();
  
  constructor(private router: Router, private entityService: EntityService, private navCtrl: NavController, private modal: ModalController) {
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

  async addAddress() {
    const modalAddAddress = await this.modal.create({
      component: ModalAddAddressPage
    });
    
    modalAddAddress.onDidDismiss().then((address_created) => {
      if (address_created !== null) {
        this.address = address_created.data;
      }
    });

    return await modalAddAddress.present();
  }

}
