import { Component, OnInit } from '@angular/core';
import { Book } from "../../shared/model/LibraryModel";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "../../shared/services/auth-service";
import { BookService } from "../../shared/services/book.service";

@Component({
  selector: 'app-books-editor',
  templateUrl: './books-editor.component.html',
  styleUrls: ['./books-editor.component.css']
})
export class BooksEditorComponent implements OnInit {

  books: Book[] = [];
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addBook() {
    // TODO Get book from a form
    const bookToAdd = new Book();

    this.bookService.addBook(bookToAdd).subscribe(d => {
      if (isNaN(d)) {
        this.dataSource.data.push(d);
        this.dataSource._updateChangeSubscription();
      } else {
        console.log(d)
      }
    });
  }

  editBook() {
    // TODO Get bookId and book from a form
    const bookId = '65bf5b0daec404630b13df15';
    const bookToEdit = new Book();

    this.bookService.updateBook(bookId, bookToEdit).subscribe(d => {
      if (!isNaN(d)) {
        const idx = this.dataSource.data.findIndex(b => b.id === bookId);
        this.dataSource.data[idx].title = bookToEdit.title;
        this.dataSource.data[idx].author = bookToEdit.author;
        this.dataSource.data[idx].numberOfPages = bookToEdit.numberOfPages;
        this.dataSource.data[idx].cover = bookToEdit.cover;
        this.dataSource.data[idx].year = bookToEdit.year;
        this.dataSource.data[idx].availableCopies = bookToEdit.availableCopies;
        this.dataSource.data[idx].totalCopies = bookToEdit.totalCopies;
      } else {
        console.log(d)
      }
    });
  }

  deleteBook() {
    // TODO Get bookId
    const bookId = '65bf5b0daec404630b13df15';

    this.bookService.deleteBook(bookId).subscribe(d => {
      if (!isNaN(d)) {
        const idx = this.dataSource.data.findIndex(b => b.id === bookId);
        this.dataSource.data.splice(idx, 1);
        this.dataSource._updateChangeSubscription();
      } else {
        console.log(d.message);
      }
    });
  }

}
