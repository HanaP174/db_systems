import {Component, OnInit} from '@angular/core';
import {Book} from "../../shared/model/LibraryModel";
import {MatTableDataSource} from "@angular/material/table";
import {AuthService} from "../../shared/services/auth-service";
import {BookService} from "../../shared/services/book.service";

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

  }

}
