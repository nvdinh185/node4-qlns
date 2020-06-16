import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaffsPageRoutingModule } from './staffs-routing.module';

import { StaffsPage } from './staffs.page';
import { TreeList } from 'src/app/components/tree-list/tree-list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaffsPageRoutingModule
  ],
  declarations: [StaffsPage, TreeList]
})
export class StaffsPageModule {}
