import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Address } from '../../shared/Address';
import { AddressUtil } from '../../classes/AddressUtil';
import { HttpClient } from '@angular/common/http';
import { EntityService } from '../../services/entity.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-modal-add-address',
  templateUrl: './modal-add-address.page.html',
  styleUrls: ['./modal-add-address.page.scss'],
})
export class ModalAddAddressPage implements OnInit {

  address: Address = AddressUtil.getEmptyAddress();

  constructor(private router: Router, private modal: ModalController, private http: HttpClient, private entityService: EntityService) { }

  ngOnInit() {
  }

  closeModal() {
    this.modal.dismiss(this.address);
    this.router.navigateByUrl("/add-park");
  }

  async validate() {
    let string_address = this.address.street_number.toString()+",+"+this.address.street_name.trim()+",+"+this.address.postal_code.trim()+"+"+this.address.city.trim()+",+"+this.address.country.trim();
    string_address.replace(" ", "+");

    this.http.get('https://api-adresse.data.gouv.fr/search/?q='+string_address).subscribe((response) => {
      this.address.city = response['features'][0]['properties']['city'];
      this.address.postal_code = response['features'][0]['properties']['postcode'];
      this.address.street_name = response['features'][0]['properties']['street'];
      this.address.street_number = response['features'][0]['properties']['housenumber'];
      this.address.country = this.address.country[0].toUpperCase() + this.address.country.slice(1);
      this.address.position = new firebase.firestore.GeoPoint(response['features'][0]['geometry']['coordinates'][1],response['features'][0]['geometry']['coordinates'][0]);
    });
    this.closeModal();
  }
}
