import { Component, OnInit } from '@angular/core';
import { Book } from "../../shared/model/LibraryModel";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "../../shared/services/auth-service";
import { BookService } from "../../shared/services/book.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../shared/components/confirm-dialog/confirm-dialog.component";
import {AddBookDialogComponent} from "./add-book-dialog/add-book-dialog.component";
import {WarningDialogComponent} from "../../shared/components/warning-dialog/warning-dialog.component";
import {EditBookDialogComponent} from "./edit-book-dialog/edit-book-dialog.component";
import {Router} from "@angular/router";
import {BorrowBookDialogComponent} from "./borrow-book-dialog/borrow-book-dialog.component";

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
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/admin'])
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
      this.handleBorrow(book);
    }
  }

  addBook() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '85rem';

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(AddBookDialogComponent, dialogConfig);

    dialogOutput.afterClosed().subscribe(book => {
      if (book) {
        this.addNewBook(book);
      }
    });
  }

  editBook(book: Book) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = book;
    dialogConfig.width = '85rem';

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(EditBookDialogComponent, dialogConfig);

    dialogOutput.afterClosed().subscribe(book => {
      if (book) {
        this.bookService.updateBook(book.id, book).subscribe(d => {
          if (!isNaN(d)) {
            const idx = this.dataSource.data.findIndex(b => b.id === book.id);
            this.dataSource.data[idx].title = book.title;
            this.dataSource.data[idx].author = book.author;
            this.dataSource.data[idx].numberOfPages = book.numberOfPages;
            this.dataSource.data[idx].cover = book.cover;
            this.dataSource.data[idx].year = book.year;
            this.dataSource.data[idx].availableCopies = book.availableCopies;
            this.dataSource.data[idx].totalCopies = book.totalCopies;
          } else {
            console.log(d)
          }
        });
      }
    });
  }

  private initDataSource() {
    this.bookService.getAllBooks().subscribe((books) => {
      this.books = this.bookService.convertCover(books);
      this.dataSource.data = this.books;
    });
  }

  private deleteBook(book: Book) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = 'Are you sure you want to delete this book?';

    dialogConfig.disableClose = true;
    const dialogOutput = this.dialog.open(ConfirmDialogComponent, dialogConfig);

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

  private handleBorrow(book: Book) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = book;
    dialogConfig.width = '85rem';

    dialogConfig.disableClose = true;
    this.dialog.open(BorrowBookDialogComponent, dialogConfig);
  }
}
