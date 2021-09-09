import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { Address } from '../../shared/Address';
import { AddressUtil } from '../../classes/AddressUtil';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ModalAddAddressPage } from '../../components/modal-add-address/modal-add-address.page';
import { ModalAddManagerPage } from '../../components/modal-add-manager/modal-add-manager.page';


@Component({
  selector: 'app-add-park',
  templateUrl: './add-park.page.html',
  styleUrls: ['./add-park.page.scss'],
})
export class AddParkPage implements OnInit {

  alertAddressErrorTitle: any;
  alertAddressErrorMessage: any;
  alertManagerErrorTitle: any;
  alertManagerErrorMessage: any;
  alertFieldsErrorTitle: any;
  alertFieldsErrorMessage: any;
  alertPlaceNumberErrorTitle: any;
  alertPlaceNumberErrorMessage: any;

  park: Park = ParkUtil.getEmptyPark();
  address: Address = AddressUtil.getEmptyAddress();
  
  constructor(private entityService: EntityService, private navCtrl: NavController, private modal: ModalController, public alertController: AlertController, translateS: TranslateService) {
    translateS.get('PARK.address-error-title').subscribe((value: any) => { this.alertAddressErrorTitle = value; });
    translateS.get('PARK.address-error-message').subscribe((value: any) => { this.alertAddressErrorMessage = value; });
    translateS.get('PARK.manager-error-title').subscribe((value: any) => { this.alertManagerErrorTitle = value; });
    translateS.get('PARK.manager-error-message').subscribe((value: any) => { this.alertManagerErrorMessage = value; });
    translateS.get('PARK.fields-error-title').subscribe((value: any) => { this.alertFieldsErrorTitle = value; });
    translateS.get('PARK.fields-error-message').subscribe((value: any) => { this.alertFieldsErrorMessage = value; });
    translateS.get('PARK.place-number-error-title').subscribe((value: any) => { this.alertPlaceNumberErrorTitle = value; });
    translateS.get('PARK.place-number-error-message').subscribe((value: any) => { this.alertPlaceNumberErrorMessage = value; });
  }

  async ngOnInit() {
  }

  async createPark() {
    //TODO Créer un vérificateur de numero de téléphone
    if (this.park.addressId === "" || this.park.addressId === null) {
      await this.showAlertMessage(this.alertAddressErrorTitle, this.alertAddressErrorMessage);
    }
    else if (this.park.managerId === "" || this.park.managerId === null) {
      await this.showAlertMessage(this.alertManagerErrorTitle, this.alertManagerErrorMessage);
    }
    else if (this.park.name.trim().length== 0) {
      await this.showAlertMessage(this.alertFieldsErrorTitle, this.alertFieldsErrorMessage);
    }
    else if (this.park.freePlaces > this.park.totalPlaces) {
      await this.showAlertMessage(this.alertPlaceNumberErrorTitle, this.alertPlaceNumberErrorMessage);
    }
    else {
      await this.entityService.create(this.park, ParkUtil.parkCollectionName).then(
        id => {
          this.park.id = id;
        });
      this.park = ParkUtil.getEmptyPark();
      this.navCtrl.navigateForward('/home');
    }
  }

  async addManager() {
    const modalAddManager = await this.modal.create({
      component: ModalAddManagerPage,
      componentProps: { 
        park: this.park,
        source: "/add-park"
      }
    });
    
    modalAddManager.onDidDismiss().then((manager_selected) => {
      if (manager_selected !== null && manager_selected.data.id !== "") {
        this.park.managerId = manager_selected.data.id
      }
    });

    return await modalAddManager.present();
  }

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
            this.park.addressId = id;
          });
      }
    });

    return await modalAddAddress.present();
  }

  async showAlertMessage(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
