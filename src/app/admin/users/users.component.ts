import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../shared/model/LibraryModel";
import {UserService} from "../../shared/services/user.service";
import {AuthService} from "../../shared/services/auth-service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDeleteUserComponent} from "./confirm-delete-user/confirm-delete-user.component";
import {EditUserDialogComponent} from "./edit-user-dialog/edit-user-dialog.component";

export enum DialogType {
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['name', 'surname', 'birthNumber', 'username', 'activated'];
  dataSource = new MatTableDataSource<User>;
  showId = false;

  private allUsers: User[] = [];
  readonly DialogType = DialogType;

  constructor(private userService: UserService,
              private authService: AuthService,
              private dialog: MatDialog,) {
  }

  ngOnInit() {
    this.initDataSource();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(user: User, dialogType: DialogType) {
    if (dialogType === DialogType.DELETE) {
      this.deleteUser(user);
    } else if (dialogType === DialogType.EDIT) {
      this.editUser(user);
    }
  }

  logout() {
    this.authService.logout();
  }

  private initDataSource() {
    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = this.filterUsers(users);
      this.dataSource.data = this.allUsers;
    })
  }

  private filterUsers(users: User[]) {
    return users.filter(user => user.id != this.authService.user.id);
  }

  private deleteUser(user: User) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(ConfirmDeleteUserComponent, dialogConfig);

    dialogOutput.afterClosed().subscribe(shouldDelete => {
      // todo delete user;
    });
  }

  private editUser(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = user;
    dialogConfig.width = '85rem';

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(EditUserDialogComponent, dialogConfig);

    dialogOutput.afterClosed().subscribe(editedUser => {
      // todo edit user;
    });
  }
}
