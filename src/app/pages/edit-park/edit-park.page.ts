import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { Address } from '../../shared/Address';
import { AddressUtil } from '../../classes/AddressUtil';
import { EntityService } from '../../services/entity.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController, ModalController } from '@ionic/angular';
import { ModalAddAddressPage } from '../../components/modal-add-address/modal-add-address.page';
import { ModalAddManagerPage } from '../../components/modal-add-manager/modal-add-manager.page';

@Component({
  selector: 'app-edit-park',
  templateUrl: './edit-park.page.html',
  styleUrls: ['./edit-park.page.scss'],
})

export class EditParkPage implements OnInit {

  park: Park = ParkUtil.getEmptyPark();
  address: Address = AddressUtil.getEmptyAddress();
  parkBeforeUpdate: Park;
  
  constructor(translateS: TranslateService, private entityService: EntityService, private actRoute: ActivatedRoute, private navCtrl: NavController, private modal: ModalController) {
    this.park.id = this.actRoute.snapshot.paramMap.get('id');
   }
    
  async ngOnInit() {
    await this.entityService.getById(this.park.id, ParkUtil.parkCollectionName).subscribe(data => {
      this.park = ParkUtil.mapItem(data.payload, ParkUtil.parkCollectionName);
      this.parkBeforeUpdate = Object.assign({}, this.park);
    });
  }

  onChangeName() {
    let name = this.park.name.trim();
    const size: number = name.length;

    if (size > 0) {
      if (size > 1) {
        name = name.charAt(0).toUpperCase() + name.substring(1, size).toLowerCase();
      }
      else {
        name = name.toUpperCase();
      }
    }
    this.park.name = name;
    this.updatePark();
  }

  async updateManager() {
    const modalAddManager = await this.modal.create({
      component: ModalAddManagerPage,
      componentProps: { 
        park: this.park
      }
    });
    
    modalAddManager.onDidDismiss().then((manager_selected) => {
      if (manager_selected !== null && manager_selected.data.id !== "") {
        this.park.managerId = manager_selected.data.id
      }
    });
    this.updatePark();

    return await modalAddManager.present();
  }

  //TODO gerer le changement d'adresse
  async updateAddress() {
    const modalAddAddress = await this.modal.create({
      component: ModalAddAddressPage
    });
    
    modalAddAddress.onDidDismiss().then((address_created) => {
      if (address_created !== null) {
        this.address = address_created.data;
        this.entityService.create(this.address, AddressUtil.addressCollectionName).then(
          id => {
            this.address.id = id;
            this.park.addressId = id;
          });
      }
    });
    this.updatePark();

    return await modalAddAddress.present();
  }
  
  //TODO vérifier l'update des places
  //verifier que l'id de l'adresse est renseigné
  //telephone non vide
  //nom non vide
  async updatePark() {
    this.park.updateDate = new Date().toISOString();
    await this.entityService.update(this.park.id, this.park, ParkUtil.parkCollectionName);
  }

  async deletePark() {
    await this.entityService.delete(this.park.id, ParkUtil.parkCollectionName);
    this.navCtrl.navigateForward('/home');
  }

}
