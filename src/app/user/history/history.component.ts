import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, catchError, forkJoin, of } from 'rxjs';
import { BorrowedBook } from 'src/app/shared/model/LibraryModel';
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
  borrowedBooks: BorrowedBook[] = [];
  displayedColumns: string[] = ['cover', 'title', 'author', 'numberOfPages', 'year', 'availableCopies'];
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

    const data$ = forkJoin({
      books: this.bookService.getAllBooks(),
      borrowedBooks: this.bookService.getUserBorrowedBooks(userId)
    }).pipe(catchError((error) => of(error)));

    this.dataSubscription = data$.subscribe(({books, borrowedBooks}) => {

      this.dataSource.data.push();
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
}

export interface BorrowedBookModel {
  cover: string;
  title: string;
  author: string;
  borrowDate: Date;
  ReturnDate?: Date;
}
