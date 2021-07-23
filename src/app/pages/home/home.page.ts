import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { property } from '../../app.property';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../shared/User';
import { Util } from '../../classes/Util';
import { UserUtil } from '../../classes/UserUtil';
import firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  allParks = [];
  user: User = UserUtil.getEmptyUser();
  park: Park = ParkUtil.getEmptyPark();
  userBeforeUpdate: User;
  hasVerifiedEmail = true;
  latitude: any = 0;
  longitude: any = 0; 

  constructor(private entityService: EntityService, public alertController: AlertController, private geolocation: Geolocation, public afAuth: AngularFireAuth) {
    this.afAuth.currentUser.then((user) => {
      if(user === null || user === undefined) return false
        this.hasVerifiedEmail = user.emailVerified;
    });
  }

  async ngOnInit() { 
    await this.entityService.getById(Util.$currentUserId, UserUtil.userCollectionName).subscribe(data => {
      this.user = UserUtil.mapItem(data.payload, UserUtil.userCollectionName);
      this.userBeforeUpdate = Object.assign({}, this.user);
    });

    await this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude
      this.longitude = resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });

    await this.entityService.getAll(property.collectionName.parks).subscribe(data => {
      console.log(this.latitude);
      console.log(this.longitude);
      this.allParks = ParkUtil.mapCollection(data, property.collectionName.parks);
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

}
