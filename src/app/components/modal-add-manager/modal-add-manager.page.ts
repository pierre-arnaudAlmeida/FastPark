import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/User';
import { UserUtil } from '../../classes/UserUtil';
import { property } from '../../app.property';
import { EntityService } from '../../services/entity.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-add-manager',
  templateUrl: './modal-add-manager.page.html',
  styleUrls: ['./modal-add-manager.page.scss'],
})
export class ModalAddManagerPage implements OnInit {

  park;
  users = [];
  user: User = UserUtil.getEmptyUser();

  constructor(private router: Router, private modal: ModalController, private entityService: EntityService) {
  }

  async ngOnInit() {
    this.entityService.getAll(property.collectionName.users).subscribe(data => {
      this.users = UserUtil.mapCollection(data, property.collectionName.users);
    });
  }

  closeModal() {
    this.modal.dismiss(this.user);
    this.router.navigateByUrl("/add-park");
  }

  async validate(user_selected) {
    this.user = user_selected;
    this.closeModal();
  }
}
