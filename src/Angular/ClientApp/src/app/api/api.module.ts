import { NgModule } from '@angular/core';

import { ApiRoutingModule } from './api-routing.module';
import { MaterialModule } from '../material.module';

import { ApiComponent } from './api.component';

@NgModule({
  declarations: [ApiComponent],
  imports: [
    ApiRoutingModule,
    MaterialModule
  ]
})
export class ApiModule { }
