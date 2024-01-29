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

  public addBook(book: Book) {
    const apirUrl = `${this.API_BASE}/book/add`;

    this.httpClient.post(apirUrl, book);
  }

  public getAllBooks(): Observable<Book[]> {
    const apiUrl = `${this.API_BASE}/book/list`;

    return this.httpClient.get<Book[]>(apiUrl);
  }

  public getBook(bookId: string): Observable<Book> {
    const apirUrl = `${this.API_BASE}/book/${bookId}`;

    return this.httpClient.get<Book>(apirUrl);
  }

  public updateBook(bookId: string, book: Book) {
    const apirUrl = `${this.API_BASE}/book/${bookId}`;

    this.httpClient.put(apirUrl, book);
  }

  public deleteBook(bookId: string) {
    const apirUrl = `${this.API_BASE}/book/${bookId}`;

    this.httpClient.delete(apirUrl);
  }

  public insertUpdateBorrowedBook(bookId: string, borrowedBook: BorrowedBook) {
    const apirUrl = `${this.API_BASE}/book/userBorrowed/${bookId}`;

    this.httpClient.post(apirUrl, borrowedBook);
  }

  public getUserBorrowedBooks(userId: string): Observable<BorrowedBook[]> {
    const apirUrl = `${this.API_BASE}/book/userBorrowed/${userId}`;

    return this.httpClient.get<BorrowedBook[]>(apirUrl);
  }
}
