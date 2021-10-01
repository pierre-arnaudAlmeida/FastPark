import { Component, OnInit, OnDestroy, NgModule, ViewChild, ElementRef} from '@angular/core';
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

import { BrowserModule } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { } from '@angular/google-maps';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

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
  map: Leaflet.Map;
  searchInput='';

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
      
      this.allParks.forEach(async park => {
        await this.entityService.getAll(AddressUtil.addressCollectionName).subscribe(data => {
          this.elements = AddressUtil.mapCollection(data, AddressUtil.addressCollectionName, park.addressId);
          park.addressDetails = this.elements[0];
        });
      });
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

  ionViewDidEnter() { this.leafletMap(); }

  leafletMap() {
    var parkMarker;

    this.map = Leaflet.map('mapId').setView([this.latitude, this.longitude], 5);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'edupala.com © Angular LeafLet',
    }).addTo(this.map);

	var redIcon = new Leaflet.Icon({
		iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	  });

	  console.log(this.allParks);
    
	this.allParks.map( address =>{		
		let distance = this.distance(address.addressDetails.position._lat, address.addressDetails.position._long, this.latitude, this.longitude);
		if(distance <= 5){
			parkMarker = Leaflet.marker([address.addressDetails.position._lat, address.addressDetails.position._long]).addTo(this.map)
			parkMarker.bindPopup('<p>'+address.name+'</p><p>'+address.freePlaces+'/'+address.totalPlaces+' Available Places </p>');
			parkMarker.on('click', function(e){
				this.openPopup();
			});
		}		
  });
  
    Leaflet.marker([this.latitude, this.longitude], {icon: redIcon}).addTo(this.map).bindPopup('My Position').openPopup();
    
    // Choose park with direction on click
    // parkMarker.on('click', function(e){
    //   var angular: any
    //   var app = angular.module('plunker', ['google-maps']);

    //   app.controller('MainCtrl', function($scope, $document) {
    //     // map object
    //     $scope.map = {
    //       control: {},
    //       center: {
    //           latitude: -37.812150,
    //           longitude: 144.971008
    //       },
    //       zoom: 14
    //     };
        
    //     // marker object
    //     $scope.marker = {
    //       center: {
    //           latitude: -37.812150,
    //           longitude: 144.971008
    //       }
    //     }
        
    //     // instantiate google map objects for directions
    //     var directionsDisplay = new google.maps.DirectionsRenderer();
    //     var directionsService = new google.maps.DirectionsService();
    //     var geocoder = new google.maps.Geocoder();
        
    //     // directions object -- with defaults
    //     $scope.directions = {
    //       origin: "Collins St, Melbourne, Australia",
    //       destination: "MCG Melbourne, Australia",
    //       showList: false
    //     }
        
    //     // get directions using google maps api
    //     $scope.getDirections = function () {
    //       var request = {
    //         origin: $scope.directions.origin,
    //         destination: $scope.directions.destination,
    //         // travelMode: google.maps.DirectionsTravelMode.DRIVING
    //       };
    //       directionsService.route(request, function (response, status) {
    //         if (status === google.maps.DirectionsStatus.OK) {
    //           directionsDisplay.setDirections(response);
    //           directionsDisplay.setMap($scope.map.control.getGMap());
    //           directionsDisplay.setPanel(document.getElementById('directionsList'));
    //           $scope.directions.showList = true;
    //         } else {
    //           alert('Google route unsuccesfull!');
    //         }
    //       });
    //     }
    //   });
    // });
  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
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
}
