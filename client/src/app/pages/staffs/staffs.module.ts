import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaffsPageRoutingModule } from './staffs-routing.module';

import { StaffsPage } from './staffs.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    StaffsPageRoutingModule
  ],
  declarations: [StaffsPage]
})
export class StaffsPageModule {}
