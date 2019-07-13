import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { MaterialModule } from '../material.module';

import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRoutingModule,
    MaterialModule
  ]
})
export class HomeModule { }
