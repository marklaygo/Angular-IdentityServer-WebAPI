import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { AccountModule } from './account/account.module';
import { ApiModule } from './api/api.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';

@NgModule({
    imports: [
        AccountModule,
        ApiModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        HomeModule,
        MaterialModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
