import { Component } from '@angular/core';
import { AuthService } from 'ngxi4-dynamic-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private apiAuth: AuthService) { this.init(); }

  init() {
    this.apiAuth.serviceUrls.RESOURCE_SERVER = 'http://localhost:9239/bsc-kpi/db'
  }
}
