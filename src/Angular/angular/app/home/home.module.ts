import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        HomeRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule
    ],
    declarations: [
        HomeComponent
    ]
})
export class HomeModule { }
