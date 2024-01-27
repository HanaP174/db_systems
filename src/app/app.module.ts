import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AdminModule} from "./admin/admin.module";
import {AppRoutingModule} from "./app-routing.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { SignUpComponent } from './view/sign-up/sign-up.component';
import { HomePageComponent } from './view/home-page/home-page.component';
import { HeaderComponent } from './view/header/header.component';

@NgModule({
  declarations: [AppComponent, SignUpComponent, HomePageComponent, HeaderComponent],
  imports: [BrowserModule, AdminModule, AppRoutingModule, MatIconModule, BrowserAnimationsModule,
    HttpClientModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  providers: [],
  exports: [
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
