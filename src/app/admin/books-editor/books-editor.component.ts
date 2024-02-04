import { Component, OnInit } from '@angular/core';
import { Book } from "../../shared/model/LibraryModel";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "../../shared/services/auth-service";
import { BookService } from "../../shared/services/book.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDeleteComponent} from "../../shared/components/confirm-delete-user/confirm-delete.component";
import {AddBookDialogComponent} from "./add-book-dialog/add-book-dialog.component";
import {WarningDialogComponent} from "../../shared/components/warning-dialog/warning-dialog.component";

export enum DialogType {
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  BORROW = 'BORROW'
}

@Component({
  selector: 'app-books-editor',
  templateUrl: './books-editor.component.html',
  styleUrls: ['./books-editor.component.css']
})
export class BooksEditorComponent implements OnInit {

  books: Book[] = [];
  displayedColumns: string[] = ['cover', 'title', 'author', 'numberOfPages', 'year', 'availableCopies'];
  dataSource = new MatTableDataSource<Book>;

  readonly DialogType = DialogType;

  constructor(private authService: AuthService,
              private bookService: BookService,
              private dialog: MatDialog) {
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

  openDialog(book: Book, dialogType: DialogType) {
    if (dialogType === DialogType.DELETE) {
      this.deleteBook(book);
    } else if (dialogType === DialogType.EDIT) {
      this.editBook(book);
    } else if (dialogType === DialogType.BORROW) {
    }
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

  private initDataSource() {
    this.bookService.getAllBooks().subscribe((books) => {
      this.books = books;
      this.dataSource.data = books;
    });
  }

  private deleteBook(book: Book) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = 'Are you sure you want to delete this book?';

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(ConfirmDeleteComponent, dialogConfig);

    dialogOutput.afterClosed().subscribe(shouldDelete => {
      if (shouldDelete) {
        this.deleteExistingBook(book);
      }
    });
  }

  private addNewBook(book: Book) {
    this.bookService.addBook(book).subscribe(d => {
      if (isNaN(d)) {
        this.dataSource.data.push(d);
        this.dataSource._updateChangeSubscription();
      } else {
        console.log(d)
      }
    });
  }

  private deleteExistingBook(book: Book) {
    if (book.availableCopies !== book.totalCopies) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = 'The operation was abandoned because not all books were returned.';

      dialogConfig.disableClose = true;
      this.dialog.open(WarningDialogComponent, dialogConfig);
    } else {
      this.bookService.deleteBook(book.id).subscribe(d => {
        if (!isNaN(d)) {
          const idx = this.dataSource.data.findIndex(b => b.id === book.id);
          this.dataSource.data.splice(idx, 1);
          this.dataSource._updateChangeSubscription();
        } else {
          console.log(d.message);
        }
      });
    }
  }
}
