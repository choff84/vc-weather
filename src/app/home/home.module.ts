import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { PrecipitationListComponent } from './precipitation-list/precipitation-list.component';
import { BlizzardComponent } from './blizzard/blizzard.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, PrecipitationListComponent, BlizzardComponent]
})
export class HomePageModule {}
