import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-run',
  templateUrl: './run.page.html',
  styleUrls: ['./run.page.scss'],
})
export class RunPage implements OnInit {

  logoUrl : string = 'assets/imgs/FastParkLogo.png';

  constructor() { }

  ngOnInit() {
  }

}
