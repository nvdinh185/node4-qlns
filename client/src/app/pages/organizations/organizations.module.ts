import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OrganizationsPage } from './organizations.page';
import { Ngxi4DynamicServiceModule } from 'ngxi4-dynamic-service';
import { TreeList } from 'src/app/components/tree-list/tree-list';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    Ngxi4DynamicServiceModule,
    RouterModule.forChild([
      {
        path: '',
        component: OrganizationsPage
      }
    ])
  ],
  declarations: [OrganizationsPage, TreeList]
})
export class OrganizationsPageModule {}
