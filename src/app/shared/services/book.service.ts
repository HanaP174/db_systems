import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book, BorrowedBook } from '../model/LibraryModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly API_BASE = 'http://localhost:8080/api/library';

  constructor(private httpClient: HttpClient) { }

  public getAllBooks(): Observable<Book[]> {
    const apirUrl = `${this.API_BASE}/book/list`;

    return this.httpClient.get<Book[]>(apirUrl);
  }

  public getUserBorrowedBooks(userId: string): Observable<BorrowedBook[]> {
    const apirUrl = `${this.API_BASE}/book/userBorrowed/${userId}`;

    return this.httpClient.get<BorrowedBook[]>(apirUrl);
  }
}
