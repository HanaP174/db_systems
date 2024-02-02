import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BorrowedBook, BorrowedBookModel } from "../../../shared/model/LibraryModel";
import { MatTableDataSource } from "@angular/material/table";
import { BookService } from 'src/app/shared/services/book.service';

@Component({
  selector: 'app-user-borrowing-history-dialog',
  templateUrl: './user-borrowing-history-dialog.component.html',
  styleUrls: ['./user-borrowing-history-dialog.component.css']
})
export class UserBorrowingHistoryDialogComponent implements OnInit {

  userId: string = '';
  history: BorrowedBookModel[] = [];
  displayedColumns: string[] = ['cover', 'title', 'author', 'borrowDate', 'returnDate', 'return'];
  dataSource = new MatTableDataSource<BorrowedBookModel>;

  constructor(private dialogRef: MatDialogRef<UserBorrowingHistoryDialogComponent>,
    private bookService: BookService,
    @Inject(MAT_DIALOG_DATA) data: { userId: string, borrowedBooks: BorrowedBookModel[] }) {
    this.userId = data.userId;
    this.history = data.borrowedBooks;
  }

  ngOnInit() {
    this.dataSource.data = this.history;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  returnBook(event: any, book: BorrowedBook, idx: number) {
    event.preventDefault();

    const borrowedBook: BorrowedBook = {
      bookId: book.bookId,
      userId: this.userId,
      borrowDate: book.borrowDate,
      returnDate: new Date(),
      isReturned: true
    }

    this.bookService.insertUpdateBorrowedBook(book.bookId, borrowedBook).subscribe(d => {
      if (!isNaN(d)) {
        this.dataSource.data[idx].returnDate = borrowedBook.returnDate;
        this.dataSource.data[idx].isReturned = borrowedBook.isReturned;
      } else {
        console.log(d.message);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
