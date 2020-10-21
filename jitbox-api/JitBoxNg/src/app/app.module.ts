import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import {HttpClientModule} from '@angular/common/http';
import {MsalModule} from '@azure/msal-angular'

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MsalModule.forRoot({
      auth:{
        clientId:"92f48668-a10b-4d89-b7d2-7d355dbf3e59", // Application Id of Application registered in B2C
        authority:"https://jitbox.b2clogin.com/jitbox.onmicrosoft.com/B2C_1_susi", //signup-signin userflow
        validateAuthority:false,
        redirectUri:"http://localhost:4200/"
      },
      cache:{
        cacheLocation:"sessionStorage",
        storeAuthStateInCookie:false
      }
    },{
      consentScopes:[
        "user.read","openid","profile"
      ]
    })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
