import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { ApiRoutingModule } from './api-routing.module';

import { ApiComponent } from './api.component';

@NgModule({
    imports: [
        ApiRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule
    ],
    declarations: [
        ApiComponent
    ]
})
export class ApiModule { }
