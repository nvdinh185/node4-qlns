import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { Ngxi4DynamicServiceModule } from 'ngxi4-dynamic-service';

@NgModule({
  imports: [
    IonicModule,
    Ngxi4DynamicServiceModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
