import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { User } from '../../shared/User';
import { Util } from '../../classes/Util';
import { UserUtil } from '../../classes/UserUtil';

@Component({
  selector: 'app-parks',
  templateUrl: './parks.page.html',
  styleUrls: ['./parks.page.scss'],
})
export class ParksPage implements OnInit {

  allParks = [];
  user: User = UserUtil.getEmptyUser();
  park: Park = ParkUtil.getEmptyPark();

  constructor(private entityService: EntityService) {
  }

  async ngOnInit() { 
    await this.entityService.getById(Util.$currentUserId, UserUtil.userCollectionName).subscribe(data => {
      this.user = UserUtil.mapItem(data.payload, UserUtil.userCollectionName);
    });

    await this.entityService.getAll(ParkUtil.parkCollectionName).subscribe(data => {
      this.allParks = ParkUtil.mapCollection(data, ParkUtil.parkCollectionName);
    });
  }
}
