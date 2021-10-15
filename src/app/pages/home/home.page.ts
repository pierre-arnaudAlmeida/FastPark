import { Component, OnInit, OnDestroy, NgModule, ViewChild, ElementRef} from '@angular/core';
import { latLng, tileLayer, Icon, icon, Marker } from "leaflet";
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
import { antPath } from 'leaflet-ant-path';
import { AdminGuard } from '../../guards/admin.guard';
import { ManagerGuard } from '../../guards/manager.guard';
import { UserGuard } from '../../guards/user.guard';
import { AngularFirestore } from '@angular/fire/firestore';

//Leaflet
import * as Leaflet from 'leaflet';
import 'leaflet';
import 'leaflet-routing-machine';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
declare let L;

declare global {
  var directions: null;
  var srchBarParkLat: 0.0;
  var srchBarParkLng: 0.0;
  var map : Leaflet.map;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  elements = [];
  allParks = [];
  searchedParks = [];
  user: User = UserUtil.getEmptyUser();
  park: Park = ParkUtil.getEmptyPark();
  address: Address = AddressUtil.getEmptyAddress();
  userBeforeUpdate: User;
  hasVerifiedEmail = true;
  latitude: any = 0;
  longitude: any = 0; 
  // map: Leaflet.Map;
  searchInput='';

  constructor(private firestore: AngularFirestore, public aGuard: AdminGuard, public mGuard: ManagerGuard, public uGuard: UserGuard, private entityService: EntityService, public alertController: AlertController, private geolocation: Geolocation, public afAuth: AngularFireAuth) {
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

    await this.firestore.collection(ParkUtil.parkCollectionName).get().toPromise().then(res => this.allParks = res.docs.map(doc => doc.data()));
    //this.allParks = snapshot.docs.map(doc => doc.data());
    this.allParks.forEach(async park => {
      await this.entityService.getAll(AddressUtil.addressCollectionName).subscribe(data => {
        this.elements = AddressUtil.mapCollection(data, AddressUtil.addressCollectionName, park.addressId);
        park.addressDetails = this.elements[0];
      });
    });
    
    // await this.entityService.getAll(ParkUtil.parkCollectionName).subscribe(data => {
    //   this.allParks = ParkUtil.mapCollection(data, ParkUtil.parkCollectionName);
      
    //   this.allParks.forEach(async park => {
    //     await this.entityService.getAll(AddressUtil.addressCollectionName).subscribe(data => {
    //       this.elements = AddressUtil.mapCollection(data, AddressUtil.addressCollectionName, park.addressId);
    //       park.addressDetails = this.elements[0];
    //     });
    //   });
    // }); 
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

  distance(lat1, lon1, lat2, lon2) {
		if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		}
		else {
			var radlat1 = Math.PI * lat1/180;
			var radlat2 = Math.PI * lat2/180;
			var theta = lon1-lon2;
			var radtheta = Math.PI * theta/180;
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = dist * 180/Math.PI;
			dist = dist * 60 * 1.1515;
			dist = dist * 1.609344 // miles en Km
			return dist;
		}
	}

  showDir(_parkLat, _parkLng, map) {

    var blueIcon = new Leaflet.Icon({
		  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
		  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		  iconSize: [25, 41],
		  iconAnchor: [12, 41],
		  popupAnchor: [1, -34],
		  shadowSize: [41, 41]
    });
    
    var redIcon = new Leaflet.Icon({
		  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
		  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		  iconSize: [25, 41],
		  iconAnchor: [12, 41],
		  popupAnchor: [1, -34],
		  shadowSize: [41, 41]
    });
    
    var directions = Leaflet.Routing.control({
      createMarker: function(i,wp, n) {
        if (i == 0) {
          var mark = L.marker(wp.latLng, {opacity: 10, icon: redIcon});
        } else {
          var mark = L.marker(wp.latLng, {opacity: 10, icon: blueIcon});
        }
        return mark;
      },
      waypoints: [
        Leaflet.latLng(this.latitude, this.longitude),
        Leaflet.latLng(_parkLat, _parkLng)
      ],
      lineOptions: {addWaypoints:false, styles: [{ color: 'black', opacity: 1, weight: 3 }]},
      router: Leaflet.Routing.osrmv1({
        language: 'fr',
        profile: 'car'
      }),
      routeWhileDragging: true,
      show: false
    }).addTo(map);

    return directions;
  }
  
  ionViewDidEnter() { this.leafletMap(); }
  
  leafletMap() {
    var parkMarker;
    var parkLat;
    var parkLng;    

    if (globalThis.map != null) 
      return;
      
    globalThis.map = Leaflet.map('mapId', {attributionControl: false, zoomControl: false}).setView([this.latitude, this.longitude], 5);
    // Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // Leaflet.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
    // Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    //Leaflet.tileLayer('	https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', { // Positron
    //Leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', { // Dark
    Leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', { // Light
      // attribution: 'edupala.com © Angular LeafLet',
    }).addTo(globalThis.map);
    
    var redIcon = new Leaflet.Icon({
		  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
		  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		  iconSize: [25, 41],
		  iconAnchor: [12, 41],
		  popupAnchor: [1, -34],
		  shadowSize: [41, 41]
	  });

    var greyIcon = new Leaflet.Icon({
		  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
		  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		  iconSize: [25, 41],
		  iconAnchor: [12, 41],
		  popupAnchor: [1, -34],
		  shadowSize: [41, 41]
	  });

	  console.log(this.allParks);

	  this.allParks.map( address =>{		
		  let distance = this.distance(address.addressDetails.position._lat, address.addressDetails.position._long, this.latitude, this.longitude);
		 // if(distance <= 50){
		  	parkMarker = Leaflet.marker([address.addressDetails.position._lat, address.addressDetails.position._long]).addTo(globalThis.map);
        parkMarker.dragging.disable();
        parkMarker.setIcon(greyIcon);
        parkMarker.bindPopup('<p>'+address.name+'</p><p>'+address.freePlaces+'/'+address.totalPlaces+' Available Places </p>');
        parkLat = address.addressDetails.position._lat;
        parkLng = address.addressDetails.position._long;
        parkMarker.on('click', (e) => {
          parkMarker.openPopup();
          parkLat = address.addressDetails.position._lat;
          parkLng = address.addressDetails.position._long;
          
          if (globalThis.directions != null) {
            globalThis.map.removeControl(globalThis.directions);
          }
          globalThis.directions = this.showDir(parkLat, parkLng, globalThis.map);
        });	
    });
    Leaflet.marker([this.latitude, this.longitude], {icon: redIcon}).addTo(globalThis.map).bindPopup('My Position').openPopup();
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    console.log("Remove map when we have multiple map object");
    globalThis.map.remove();
  }

  /** Get parks searched in search bar by name */
  getItems(ev) {
    var val = ev.target.value;

    if (val && val.trim() != '') {
      this.searchedParks = this.allParks;
      this.searchedParks = this.searchedParks.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  showParkFromSearch(mon_p : Park) {
    console.log(mon_p);
    this.allParks.forEach(element => {
      if (element.addressId === mon_p.addressId) {
        globalThis.srchBarParkLat = element.addressDetails.position._lat;
        globalThis.srchBarParkLng = element.addressDetails.position._long;

        if (globalThis.directions != null) {
          globalThis.map.removeControl(globalThis.directions);
        }
        globalThis.directions = this.showDir(globalThis.srchBarParkLat, globalThis.srchBarParkLng, globalThis.map);
      }
    });
  }
}
