import { Component } from '@angular/core';
import { AuthService } from 'ngxi4-dynamic-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  treeMenu: any = [];
  constructor(private apiAuth: AuthService) { this.init() }

  init() {
    this.apiAuth.serviceUrls.RESOURCE_SERVER = 'http://localhost:9239/bsc-kpi/db'
    // this.apiAuth.serviceUrls.RESOURCE_SERVER = 'https://dinh-qlns.herokuapp.com/bsc-kpi/db'
  }

  ngOnInit() {
    this.treeMenu = [
      {
        id: 1,
        name: 'Trang chủ',
        size: '1.1em',
        type: 'route',
        url: '/home',
        icon: 'home'
      }
      ,
      {
        id: 1,
        name: 'Mô hình tổ chức',
        size: '1.1em',
        type: 'route',
        url: '/organizations',
        icon: 'globe'
      }
      ,
      {
        id: 2,
        name: 'Cây chức danh',
        type: 'route',
        url: '/job-roles',
        icon: 'card'
      }
      ,
      {
        id: 3,
        name: 'Cây nhân sự',
        type: 'route',
        url: '/staffs',
        icon: 'contacts'
      }
    ];

  }
}
