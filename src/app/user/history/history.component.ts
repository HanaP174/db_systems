import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, catchError, forkJoin, of } from 'rxjs';
import {Book, BorrowedBook, BorrowedBookModel} from 'src/app/shared/model/LibraryModel';
import { AuthService } from 'src/app/shared/services/auth-service';
import { BookService } from 'src/app/shared/services/book.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {

  private dataSubscription: Subscription = new Subscription;
  private userBorrowedBooks: BorrowedBook[] = [];

  borrowedBooks: BorrowedBookModel[] = [];
  displayedColumns: string[] = ['cover', 'title', 'author', 'borrowDate', 'returnDate', 'return'];
  dataSource = new MatTableDataSource<BorrowedBookModel>;

  constructor(private authService: AuthService,
    private bookService: BookService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  private initDataSource() {
    const userId = this.authService.user.id;
    this.userBorrowedBooks = [];

    const data$ = forkJoin([
      this.bookService.getAllBooks(),
      this.bookService.getUserBorrowedBooks(userId)
    ]).pipe(catchError((error) => of(error)));

    this.dataSubscription = data$.subscribe(([books, borrowedBooks]: [Book[], BorrowedBook[]]) => {
      this.userBorrowedBooks = borrowedBooks;
      books = this.bookService.convertCover(books);
      borrowedBooks.forEach((borrowedBook) => {
        const book = books.find(b => b.id === borrowedBook.bookId);

        if (book !== undefined) {
          this.borrowedBooks.push({
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
      this.dataSource.data = this.borrowedBooks;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/home'])
  }

  returnBook(bookToReturn: BorrowedBookModel) {
    let borrowedBook = this.userBorrowedBooks.find(b => b.bookId === bookToReturn.bookId);
    if (borrowedBook === undefined) {
      return;
    }

    borrowedBook.returnDate = new Date();
    borrowedBook.isReturned = true;

    this.bookService.insertUpdateBorrowedBook(bookToReturn.bookId, borrowedBook).subscribe(d => {
      if (isNaN(d)) {
        console.log(d.message);
      }
    });
  }
}
