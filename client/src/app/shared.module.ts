import { NgModule } from '@angular/core';
import { TreeList } from './components/tree-list/tree-list';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        IonicModule
        , CommonModule
    ],
    declarations: [TreeList],
    exports: [TreeList]
})
export class SharedModule { }