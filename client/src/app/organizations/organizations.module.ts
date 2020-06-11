import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { OrganizationsPage } from './organizations.page';
import { Ngxi4DynamicServiceModule } from 'ngxi4-dynamic-service';

@NgModule({
  imports: [
    IonicModule,
    Ngxi4DynamicServiceModule,
    RouterModule.forChild([
      {
        path: '',
        component: OrganizationsPage
      }
    ])
  ],
  declarations: [OrganizationsPage]
})
export class OrganizationsPageModule {}
