import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule } from "@angular/common/http";

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { AccountModule } from './account/account.module';
import { ApiModule } from './api/api.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    HomeModule,
    AccountModule,
    ApiModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("access_token");
        },
        whitelistedDomains: ["localhost:5000", "localhost:5001"],
        blacklistedRoutes: ["localhost:5000/connect/token"]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
