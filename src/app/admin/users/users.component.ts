import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Book, BorrowedBook, BorrowedBookModel, User } from "../../shared/model/LibraryModel";
import { UserService } from "../../shared/services/user.service";
import { AuthService } from "../../shared/services/auth-service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmDeleteComponent } from "../../shared/components/confirm-delete-user/confirm-delete.component";
import { EditUserDialogComponent } from "./edit-user-dialog/edit-user-dialog.component";
import { catchError, forkJoin, of, Subscription } from "rxjs";
import { BookService } from "../../shared/services/book.service";
import {
  UserBorrowingHistoryDialogComponent
} from "./user-borrowing-history-dialog/user-borrowing-history-dialog.component";
import {Router} from "@angular/router";
import {AddUserDialogComponent} from "./add-user-dialog/add-user-dialog.component";

export enum DialogType {
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  HISTORY = 'HISTORY'
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['name', 'surname', 'birthNumber', 'username', 'activated'];
  dataSource = new MatTableDataSource<User>;
  showId = false;

  private allUsers: User[] = [];
  private subscription: Subscription = new Subscription;
  readonly DialogType = DialogType;

  constructor(private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private bookService: BookService,
    private router: Router) {
  }

  ngOnInit() {
    this.initDataSource();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    } else if (dialogType === DialogType.HISTORY) {
      this.getBorrowedBooks(user.id);
    }
  }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/admin'])
  }

  addNewUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '85rem';

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(AddUserDialogComponent, dialogConfig);

    dialogOutput.afterClosed().subscribe(user => {
      if (user) {
        this.addUser(user);
      }
    });
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

  // TODO Get user from a form
  private addUser(user: User) {
    this.userService.addUser(user).subscribe(d => {
      if (isNaN(d)) {
        this.dataSource.data.push(d);
        this.dataSource._updateChangeSubscription();
      } else {
        console.log(d)
      }
    });
  }

  private deleteUser(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = 'Are you sure you want to delete user?';

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(ConfirmDeleteComponent, dialogConfig);

    dialogOutput.afterClosed().subscribe(shouldDelete => {
      if (shouldDelete) {
        this.userService.deleteUser(user.id).subscribe(d => {
          if (!isNaN(d)) {
            const idx = this.dataSource.data.indexOf(user);
            this.dataSource.data.splice(idx, 1);
            this.dataSource._updateChangeSubscription();
          } else {
            console.log(d.message);
          }
        });
      }
    });
  }

  private editUser(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = user;
    dialogConfig.width = '85rem';

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(EditUserDialogComponent, dialogConfig);

    dialogOutput.afterClosed().subscribe(editedUser => {
      if (editedUser) {
        this.userService.updateUser(user.id, editedUser).subscribe(d => {
          if (!isNaN(d)) {
            const idx = this.dataSource.data.findIndex(u => u.id === user.id);
            this.dataSource.data[idx].name = editedUser.name;
            this.dataSource.data[idx].surname = editedUser.surname;
            this.dataSource.data[idx].birthNumber = editedUser.birthNumber;
            this.dataSource.data[idx].address.street = editedUser.address.street;
            this.dataSource.data[idx].address.zipcode = editedUser.address.zipcode;
            this.dataSource.data[idx].address.city = editedUser.address.city;
            this.dataSource.data[idx].address.streetNumber = editedUser.address.streetNumber;
            this.dataSource.data[idx].password = editedUser.password;
            this.dataSource.data[idx].activated = editedUser.activated
          } else {
            console.log(d.message);
          }
        });
      }
    });
  }

  private getBorrowedBooks(userId: string) {
    const userBookHistory: BorrowedBookModel[] = [];

    const data$ = forkJoin([
      this.bookService.getAllBooks(),
      this.bookService.getUserBorrowedBooks(userId)
    ]).pipe(catchError((error) => of(error)));

    this.subscription = data$.subscribe(([books, borrowedBooks]: [Book[], BorrowedBook[]]) => {
      borrowedBooks.forEach((borrowedBook) => {
        const book = books.find(b => b.id === borrowedBook.bookId);

        if (book !== undefined) {
          userBookHistory.push({
            bookId: book.id,
            cover: book.cover,
            title: book.title,
            author: book.author,
            borrowDate: borrowedBook.borrowDate,
            returnDate: borrowedBook.returnDate,
            isReturned: borrowedBook.isReturned
          });
        }
      });
      this.showUserBorrowingHistory(userId, userBookHistory);
    });
  }

  private showUserBorrowingHistory(userId: string, borrowedBooks: BorrowedBookModel[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { userId, borrowedBooks };
    dialogConfig.width = '85rem';

    dialogConfig.disableClose = true;
    this.dialog.open(UserBorrowingHistoryDialogComponent, dialogConfig);
  }
}
