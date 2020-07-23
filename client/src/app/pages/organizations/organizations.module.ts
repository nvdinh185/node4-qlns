import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OrganizationsPage } from './organizations.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    SharedModule,
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
