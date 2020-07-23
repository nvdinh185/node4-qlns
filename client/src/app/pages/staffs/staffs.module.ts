import { NgModule } from '@angular/core';

import { StaffsPageRoutingModule } from './staffs-routing.module';

import { StaffsPage } from './staffs.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    SharedModule,
    StaffsPageRoutingModule
  ],
  declarations: [StaffsPage]
})
export class StaffsPageModule {}
