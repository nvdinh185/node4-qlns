import { NgModule } from '@angular/core';

import { JobRolesPageRoutingModule } from './job-roles-routing.module';

import { JobRolesPage } from './job-roles.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    SharedModule,
    JobRolesPageRoutingModule
  ],
  declarations: [JobRolesPage]
})
export class JobRolesPageModule {}
