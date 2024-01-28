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
  borrowedCount = 6;
  borrowedTotalPercentage = 0;
  displayedColumns: string[] = ['cover', 'title', 'author', 'numberOfPages', 'year', 'availableCopies'];
  dataSource = new MatTableDataSource<Book>;

  constructor(private authService: AuthService,
    private bookService: BookService) {
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  private initDataSource() {
    this.bookService.getAllBooks().subscribe((books) => {
      this.books = books;
      this.dataSource.data = books;
    });

    const userId = this.authService.user.id;
    this.bookService.getUserBorrowedBooks(userId).subscribe((borrowedBooks) => {
      this.borrowedBooks = borrowedBooks;

      if (this.borrowedBooks.length !== 0) {
        this.borrowedTotalPercentage = this.borrowedBooks.length / 6 * 100;
        this.borrowedCount = 6 - this.borrowedBooks.length;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
