import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { User } from '../../shared/User';
import { Util } from '../../classes/Util';
import { UserUtil } from '../../classes/UserUtil';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  allUsers = [];
  user: User = UserUtil.getEmptyUser();

  constructor(private entityService: EntityService) { }

  async ngOnInit() {
    await this.entityService.getById(Util.$currentUserId, UserUtil.userCollectionName).subscribe(data => {
      this.user = UserUtil.mapItem(data.payload, UserUtil.userCollectionName);
    });

    await this.entityService.getAll(UserUtil.userCollectionName).subscribe(data => {
      this.allUsers = UserUtil.mapCollection(data, UserUtil.userCollectionName);
    });
  }
}
