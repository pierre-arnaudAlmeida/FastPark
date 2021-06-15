import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { Address } from '../../shared/Address';
import { AddressUtil } from '../../classes/AddressUtil';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalAddAddressPage } from '../../components/modal-add-address/modal-add-address.page';
import { ModalAddManagerPage } from '../../components/modal-add-manager/modal-add-manager.page';


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
    //TODO Ajouter des vérification pour les différents champs et afficher un message d'erreur
    await this.entityService.create(this.park, ParkUtil.parkCollectionName).then(
      id => {
        this.park.id = id;
      });
    this.park = ParkUtil.getEmptyPark();
    this.navCtrl.navigateForward('/home');
  }

  async addManager() {
    const modalAddManager = await this.modal.create({
      component: ModalAddManagerPage,
      componentProps: { 
        park: this.park
      }
    });
    
    modalAddManager.onDidDismiss().then((manager_selected) => {
      if (manager_selected !== null && manager_selected.data.id !== "") {
        console.log(manager_selected.data);
        console.log(manager_selected.data.id);
        this.park.managerId = manager_selected.data.id
      }
    });

    return await modalAddManager.present();
  }

  //TODO gerer le changement d'adresse
  async addAddress() {
    const modalAddAddress = await this.modal.create({
      component: ModalAddAddressPage
    });
    
    modalAddAddress.onDidDismiss().then((address_created) => {
      if (address_created !== null) {
        this.address = address_created.data;
        this.entityService.create(this.address, AddressUtil.addressCollectionName).then(
          id => {
            this.address.id = id;
          });
      }
    });

    return await modalAddAddress.present();
  }

}
