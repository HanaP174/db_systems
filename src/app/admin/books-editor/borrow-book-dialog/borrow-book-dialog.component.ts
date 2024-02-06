import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {Book, BorrowedBook, User} from "../../../shared/model/LibraryModel";
import {UserService} from "../../../shared/services/user.service";
import {AuthService} from "../../../shared/services/auth-service";
import {BookService} from "../../../shared/services/book.service";
import {catchError, forkJoin, Observable, of, Subscription} from "rxjs";
import {ConfirmDialogComponent} from "../../../shared/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-borrow-book',
  templateUrl: './borrow-book-dialog.component.html',
  styleUrls: ['./borrow-book-dialog.component.css']
})
export class BorrowBookDialogComponent implements OnInit, OnDestroy {

  book: Book = new Book();
  displayedColumns: string[] = ['name', 'surname', 'birthNumber', 'username'];
  dataSource = new MatTableDataSource<User>;
  loaded = false;
  subscription: Subscription = new Subscription;

  private allUsers: User[] = [];

  constructor(private dialogRef: MatDialogRef<BorrowBookDialogComponent>,
              private userService: UserService,
              private authService: AuthService,
              private bookService: BookService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) book: Book) {
    this.book = book;
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  close() {
    this.dialogRef.close();
  }

  borrow(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = 'Do you want to borrow the book to this user: ' + user.surname + ' ?';

    const output = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    output.afterClosed().subscribe(borrow => {
      if (borrow) {
        this.borrowBook(user);
      }
    })

  }

  private initDataSource() {
    this.userService.getAllUsers().subscribe(users => {
      this.filterUsers(users);
      this.dataSource.data = this.allUsers;
    });
  }

  private filterUsers(users: User[]) {
    const usersWithoutAdmin = users.filter(user => user.id != this.authService.user.id);
    const observables: Observable<BorrowedBook[]>[] = []
    for (const user of usersWithoutAdmin) {
      this.allUsers.push(user);
      observables.push(this.bookService.getUserBorrowedBooks(user.id));
    }

    const data$ = forkJoin(observables).pipe(catchError((error) => of(error)));
    this.subscription = data$.subscribe((borrowedBooks: BorrowedBook[]) => {
        const relevantBooks = this.filterRelevantBorrowedBooks(borrowedBooks);
        if (relevantBooks.some(book => book.bookId === this.book.id) || relevantBooks.length >= 6) {
          this.removeUser(relevantBooks[0].userId);
        }
      this.loaded = true;
    })
  }

  private filterRelevantBorrowedBooks(borrowedBooks: BorrowedBook[]) {
    return borrowedBooks.filter(book => !book.isReturned);
  }

  private removeUser(userId: string) {
    const user = this.allUsers.find(user => user.id === userId);
    if (user) {
      const index = this.allUsers.indexOf(user);
      this.allUsers.splice(index, 1);
    }
  }

  private borrowBook(user: User) {
    const borrowedBook = {} as BorrowedBook;
    borrowedBook.bookId = this.book.id;
    borrowedBook.userId = user.id;
    borrowedBook.borrowDate = new Date();
    borrowedBook.isReturned = false;

    this.bookService.insertUpdateBorrowedBook(this.book.id, borrowedBook).subscribe(d => {
      if (!isNaN(d)) {
        this.removeUser(user.id);
        this.dataSource.data = this.allUsers;
        this.book.availableCopies--;
        this.bookService.updateBook(this.book.id, this.book);
      } else {
        console.log(d.message);
      }
    });
  }
}
