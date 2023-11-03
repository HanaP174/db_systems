import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AdminModule} from "./admin/admin.module";
import {UserModule} from "./user/user.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AdminModule, UserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
