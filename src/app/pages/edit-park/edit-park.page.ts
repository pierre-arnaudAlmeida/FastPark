import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Park } from '../../shared/Park';
import { ParkUtil } from '../../classes/ParkUtil';
import { EntityService } from '../../services/entity.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-park',
  templateUrl: './edit-park.page.html',
  styleUrls: ['./edit-park.page.scss'],
})

export class EditParkPage implements OnInit {

  park: Park = ParkUtil.getEmptyPark();
  parkBeforeUpdate: Park;
  
  constructor(translateS: TranslateService, private entityService: EntityService, private actRoute: ActivatedRoute, private navCtrl: NavController) {
    this.park.id = this.actRoute.snapshot.paramMap.get('id');
   }
    
  async ngOnInit() {
    await this.entityService.getById(this.park.id, ParkUtil.parkCollectionName).subscribe(data => {
      this.park = ParkUtil.mapItem(data.payload, ParkUtil.parkCollectionName);
      this.parkBeforeUpdate = Object.assign({}, this.park);
    });
  }

  onChangeName() {
    let name = this.park.name.trim();
    const size: number = name.length;

    if (size > 0) {
      if (size > 1) {
        name = name.charAt(0).toUpperCase() + name.substring(1, size).toLowerCase();
      }
      else {
        name = name.toUpperCase();
      }
    }
    this.park.name = name;
    this.updatePark();
  }

  async updatePark() {
    await this.entityService.update(this.park.id, this.park, ParkUtil.parkCollectionName);
  }

  async deletePark() {
    await this.entityService.delete(this.park.id, ParkUtil.parkCollectionName);
    this.navCtrl.navigateForward('/home');
  }

}
