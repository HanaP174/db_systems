import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Book, BorrowedBook, BorrowedBookModel, User} from "../../shared/model/LibraryModel";
import {UserService} from "../../shared/services/user.service";
import {AuthService} from "../../shared/services/auth-service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDeleteUserComponent} from "./confirm-delete-user/confirm-delete-user.component";
import {EditUserDialogComponent} from "./edit-user-dialog/edit-user-dialog.component";
import {catchError, forkJoin, of, Subscription} from "rxjs";
import {BookService} from "../../shared/services/book.service";
import {
  UserBorrowingHistoryDialogComponent
} from "./user-borrowing-history-dialog/user-borrowing-history-dialog.component";

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
              private bookService: BookService) {
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
      this.showUserBorrowingHistory(userBookHistory);
    });
  }

  private showUserBorrowingHistory(userBookHistory: BorrowedBookModel[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = userBookHistory;
    dialogConfig.width = '85rem';

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(UserBorrowingHistoryDialogComponent, dialogConfig);

    dialogOutput.afterClosed().subscribe(() => {
      // todo possibility to return books? or in the dialog?
    });
  }
}
