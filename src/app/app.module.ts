import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { SignUpComponent } from './view/sign-up/sign-up.component';
import { HomePageComponent } from './view/home-page/home-page.component';
import { HeaderComponent } from './view/header/header.component';
import {UserComponent} from "./user/user.component";
import {AdminComponent} from "./admin/admin.component";
import {MatMenuModule} from "@angular/material/menu";
import { BooksViewComponent } from './user/books-view/books-view.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatTableModule} from "@angular/material/table";
import { HistoryComponent } from './user/history/history.component';
import {MatBadgeModule} from "@angular/material/badge";
import { NotificationsComponent } from './admin/notifications/notifications.component';
import { BooksEditorComponent } from './admin/books-editor/books-editor.component';
import { UsersComponent } from './admin/users/users.component';
import {MatDialogModule} from "@angular/material/dialog";
import { ConfirmDeleteComponent } from './shared/components/confirm-delete-user/confirm-delete.component';
import { EditUserDialogComponent } from './admin/users/edit-user-dialog/edit-user-dialog.component';
import { PersonalDataComponent } from './user/personal-data/personal-data.component';
import { UserBorrowingHistoryDialogComponent } from './admin/users/user-borrowing-history-dialog/user-borrowing-history-dialog.component';
import { ImageInputComponent } from './admin/books-editor/image-input/image-input.component';
import { AddBookDialogComponent } from './admin/books-editor/add-book-dialog/add-book-dialog.component';
import { EditBookDialogComponent } from './admin/books-editor/edit-book-dialog/edit-book-dialog.component';
import { WarningDialogComponent } from './shared/components/warning-dialog/warning-dialog.component';
import {MatListModule} from "@angular/material/list";
import { AddUserDialogComponent } from './admin/users/add-user-dialog/add-user-dialog.component';
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [AppComponent, SignUpComponent, HomePageComponent, HeaderComponent, UserComponent, AdminComponent, BooksViewComponent, HistoryComponent, NotificationsComponent, BooksEditorComponent, UsersComponent, ConfirmDeleteComponent, EditUserDialogComponent, PersonalDataComponent, UserBorrowingHistoryDialogComponent, ImageInputComponent, AddBookDialogComponent, EditBookDialogComponent, WarningDialogComponent, AddUserDialogComponent],
  imports: [BrowserModule, AppRoutingModule, MatIconModule, BrowserAnimationsModule,
    HttpClientModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatMenuModule, MatProgressBarModule, MatTableModule, MatBadgeModule, MatDialogModule, MatListModule, MatSelectModule, FormsModule],
  providers: [],
  exports: [
    HeaderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
