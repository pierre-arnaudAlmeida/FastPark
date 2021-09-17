import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { UserUtil } from '../../classes/UserUtil';
import { User } from '../../shared/User';
import { Util } from '../../classes/Util';
import { Address } from '../../shared/Address';
import { AddressUtil } from '../../classes/AddressUtil';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-park',
  templateUrl: './park.page.html',
  styleUrls: ['./park.page.scss'],
})
export class ParkPage implements OnInit {

  park: Park = ParkUtil.getEmptyPark();
  user: User = UserUtil.getEmptyUser();
  address: Address = AddressUtil.getEmptyAddress();

  constructor(private entityService: EntityService, private actRoute: ActivatedRoute) {
    this.park.id = this.actRoute.snapshot.paramMap.get('id');
   }

  async ngOnInit() {
    await this.entityService.getById(this.park.id, ParkUtil.parkCollectionName).subscribe(data => {
      this.park = ParkUtil.mapItem(data.payload, ParkUtil.parkCollectionName);
    });

    await this.entityService.getById(Util.$currentUserId, UserUtil.userCollectionName).subscribe(data => {
      this.user = UserUtil.mapItem(data.payload, UserUtil.userCollectionName);
    });
  }

}
