import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Address } from '../../shared/Address';
import { AddressUtil } from '../../classes/AddressUtil';

@Component({
  selector: 'app-modal-add-address',
  templateUrl: './modal-add-address.page.html',
  styleUrls: ['./modal-add-address.page.scss'],
})
export class ModalAddAddressPage implements OnInit {

  address: Address = AddressUtil.getEmptyAddress();

  constructor(private router: Router, private modal: ModalController) { }

  ngOnInit() {
  }

  closeModal() {
    this.modal.dismiss(this.address);
    this.router.navigateByUrl("/add-park");
  }

  validate() {
    //create new address
    //stock address infos into this.address
    //calculate geopoint with address
    this.closeModal();
  }
}
