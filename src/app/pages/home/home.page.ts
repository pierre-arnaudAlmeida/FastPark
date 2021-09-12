import { Component, OnInit, OnDestroy } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { Park } from '../../shared/Park';
import { Address } from '../../shared/Address';
import { ParkUtil } from '../../classes/ParkUtil';
import { AddressUtil } from '../../classes/AddressUtil';
import { property } from '../../app.property';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../shared/User';
import { Util } from '../../classes/Util';
import { UserUtil } from '../../classes/UserUtil';
import firebase from 'firebase/app';
import * as Leaflet from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import { AdminGuard } from '../../guards/admin.guard';
import { ManagerGuard } from '../../guards/manager.guard';
import { UserGuard } from '../../guards/user.guard';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  allParks = [];
  allAddresses = [];
  user: User = UserUtil.getEmptyUser();
  park: Park = ParkUtil.getEmptyPark();
  address: Address = AddressUtil.getEmptyAddress();
  userBeforeUpdate: User;
  hasVerifiedEmail = true;
  latitude: any = 0;
  longitude: any = 0; 
  map: Leaflet.Map;

  constructor(public aGuard: AdminGuard, public mGuard: ManagerGuard, public uGuard: UserGuard, private entityService: EntityService, public alertController: AlertController, private geolocation: Geolocation, public afAuth: AngularFireAuth) {
    this.afAuth.currentUser.then((user) => {
      if(user === null || user === undefined) return false
        this.hasVerifiedEmail = user.emailVerified;
    });
  }

  async ngOnInit() { 
    await this.entityService.getById(Util.$currentUserId, UserUtil.userCollectionName).subscribe(data => {
      this.user = UserUtil.mapItem(data.payload, UserUtil.userCollectionName);
      this.userBeforeUpdate = Object.assign({}, this.user);
      if (this.user.role === "ADMIN") {
        this.aGuard.isAdmin = true;
        this.mGuard.isManager = true;
        this.uGuard.isUser = true;
      } else if (this.user.role === "MANAGER") {
        this.mGuard.isManager = true;
        this.uGuard.isUser = true;
      } else if (this.user.role === "USER") {
        this.uGuard.isUser = true;
      }
    });

    await this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude
      this.longitude = resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });

    await this.entityService.getAll(ParkUtil.parkCollectionName).subscribe(data => {
      this.allParks = ParkUtil.mapCollection(data, ParkUtil.parkCollectionName);
    });

	await this.entityService.getAll(AddressUtil.addressCollectionName).subscribe(data => {
		this.allAddresses = AddressUtil.mapCollection(data, AddressUtil.addressCollectionName);
	  });
  }

  async updateAccount() {
    this.user.updateDate = new Date().toISOString();
    await this.entityService.update(Util.$currentUserId, this.user, UserUtil.userCollectionName);
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
  }

  ionViewDidEnter() { this.leafletMap(); }

  leafletMap() {
    this.map = Leaflet.map('mapId').setView([this.latitude, this.longitude], 5);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'edupala.com © Angular LeafLet',
    }).addTo(this.map);

	this.allAddresses.map( address =>{
		Leaflet.marker([address.position._lat, address.position._long]).addTo(this.map);
	});
	

    Leaflet.marker([this.latitude, this.longitude]).addTo(this.map).bindPopup('My Position').openPopup();
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }

}
