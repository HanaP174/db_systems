import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { Book, BorrowedBook } from 'src/app/shared/model/LibraryModel';
import { AuthService } from 'src/app/shared/services/auth-service';
import { BookService } from 'src/app/shared/services/book.service';

@Component({
  selector: 'app-books-view',
  templateUrl: './books-view.component.html',
  styleUrls: ['./books-view.component.css']
})
export class BooksViewComponent implements OnInit {

  books: Book[] = [];
  borrowedBooks: BorrowedBook[] = [];
  borrowedCount = 0;
  borrowedTotalPercentage = 0;
  displayedColumns: string[] = ['cover', 'title', 'author', 'numberOfPages', 'year', 'availableCopies', 'borrow'];
  dataSource = new MatTableDataSource<Book>;
  buttonText = 'Borrow';
  disableBorrowing = false;

  constructor(private authService: AuthService,
    private bookService: BookService) {
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  private initDataSource() {
    this.bookService.getAllBooks().subscribe((books) => {
      this.books = this.bookService.convertCover(books);
      this.dataSource.data = this.books;
    });

    const userId = this.authService.user.id;
    this.bookService.getUserBorrowedBooks(userId).subscribe((borrowedBooks) => {
      this.borrowedBooks = borrowedBooks.filter(book => !book.isReturned);

      if (this.borrowedBooks.length !== 0) {
        this.borrowedTotalPercentage = this.borrowedBooks.length / 6 * 100;
        this.borrowedCount = this.borrowedBooks.length;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getButtonColor(book: Book) {
    if (this.isBorrowed(book)) {
      this.buttonText = 'Return';
      this.disableBorrowing = false;
      return 'warn';
    } else {
      this.buttonText = 'Borrow';
      this.disableBorrowing = this.borrowedCount >= 6 || book.availableCopies <= 0;
      return 'primary';
    }
  }

  borrowOrReturnBook(book: Book) {
    if (this.isBorrowed(book)) {
      this.returnBook(book);
    } else {
      this.borrowBook(book);
    }
  }

  borrowBook(bookToBorrow: Book) {
    if (this.borrowedCount === 6) {
      return;
    }

    let borrowedBook = this.borrowedBooks.find(b => b.bookId === bookToBorrow.id);
    if (borrowedBook === undefined) {
      borrowedBook = {} as BorrowedBook;
      borrowedBook.bookId = bookToBorrow.id;
      borrowedBook.userId = this.authService.user.id;
    }

    borrowedBook.borrowDate = new Date();
    borrowedBook.isReturned = false;

    this.bookService.insertUpdateBorrowedBook(bookToBorrow.id, borrowedBook).subscribe(d => {
      if (!isNaN(d)) {
        this.borrowedCount++;
        this.borrowedTotalPercentage = this.borrowedCount / 6 * 100;

        let book = this.books.find(b => b.id = bookToBorrow.id);
        if (book !== undefined) {
          book.availableCopies = book.availableCopies - 1;
        }
      } else {
        console.log(d.message);
      }
    });
  }

  returnBook(bookToReturn: Book) {
    if (this.borrowedCount === 0) {
      return;
    }

    let borrowedBook = this.borrowedBooks.find(b => b.bookId === bookToReturn.id);
    if (borrowedBook === undefined) {
      return;
    }

    borrowedBook.returnDate = new Date();
    borrowedBook.isReturned = true;

    this.bookService.insertUpdateBorrowedBook(bookToReturn.id, borrowedBook).subscribe(d => {
      if (!isNaN(d)) {
        this.borrowedCount--;
        this.borrowedTotalPercentage = this.borrowedCount / 6 * 100

        let book = this.books.find(b => b.id = bookToReturn.id);
        if (book !== undefined) {
          book.availableCopies++;
        }
      } else {
        console.log(d.message);
      }
    });
  }

  isBorrowed(bookToCheck: Book) {
    const borrowedBook = this.borrowedBooks.find(book => book.bookId === bookToCheck.id);
    return borrowedBook == null ? false : !borrowedBook.isReturned;
  }
}
