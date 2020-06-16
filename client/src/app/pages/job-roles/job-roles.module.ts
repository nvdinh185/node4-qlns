import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobRolesPageRoutingModule } from './job-roles-routing.module';

import { JobRolesPage } from './job-roles.page';
import { TreeList } from 'src/app/components/tree-list/tree-list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobRolesPageRoutingModule
  ],
  declarations: [JobRolesPage, TreeList]
})
export class JobRolesPageModule {}
