import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobRolesPage } from './job-roles.page';

const routes: Routes = [
  {
    path: '',
    component: JobRolesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRolesPageRoutingModule {}
