import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'job-roles', pathMatch: 'full' },
  {
    path: 'organizations',
    loadChildren: () => import('./pages/organizations/organizations.module').then(m => m.OrganizationsPageModule)
  },
  {
    path: 'job-roles',
    loadChildren: () => import('./pages/job-roles/job-roles.module').then(m => m.JobRolesPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }