import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OrganizationsPage } from './organizations.page';
import { Ngxi4DynamicServiceModule } from 'ngxi4-dynamic-service';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
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
