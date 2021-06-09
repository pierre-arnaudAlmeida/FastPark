import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EntityService } from '../../services/entity.service';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { Util } from '../../classes/Util';
import { property } from '../../app.property';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  allParks = [];
  park: Park = ParkUtil.getEmptyPark();

  constructor(private entityService: EntityService, translateS: TranslateService) {
  }

  ngOnInit() {
    this.entityService.getAll(property.collectionName.park).subscribe(data => {
      this.allParks = ParkUtil.mapCollection(data, property.collectionName.park);
    });
  }
}
