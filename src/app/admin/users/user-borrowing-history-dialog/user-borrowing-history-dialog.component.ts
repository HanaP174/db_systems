import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BorrowedBookModel} from "../../../shared/model/LibraryModel";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-user-borrowing-history-dialog',
  templateUrl: './user-borrowing-history-dialog.component.html',
  styleUrls: ['./user-borrowing-history-dialog.component.css']
})
export class UserBorrowingHistoryDialogComponent implements OnInit {

  history: BorrowedBookModel[] = [];
  displayedColumns: string[] = ['cover', 'title', 'author', 'borrowDate', 'returnDate'];
  dataSource = new MatTableDataSource<BorrowedBookModel>;

  constructor(private dialogRef: MatDialogRef<UserBorrowingHistoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) history: BorrowedBookModel[]) {
    this.history = history;
  }

  ngOnInit() {
    this.dataSource.data = this.history;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  close() {
    this.dialogRef.close();
  }
}
