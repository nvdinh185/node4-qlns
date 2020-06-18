import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobRolesPageRoutingModule } from './job-roles-routing.module';

import { JobRolesPage } from './job-roles.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    JobRolesPageRoutingModule
  ],
  declarations: [JobRolesPage]
})
export class JobRolesPageModule {}
