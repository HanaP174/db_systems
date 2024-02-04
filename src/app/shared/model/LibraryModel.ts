export class UserAuth {
  username: string = '';
  password: string = '';
}

export class User {
  id: string = '';
  name: string = '';
  surname: string = '';
  role: string = '';
  birthNumber: string = '';
  address: Address = new Address();
  username: string = '';
  password: string = '';
  activated: boolean = false;
}

export class Address {
  street: string = '';
  zipcode: string = '';
  city: string = '';
  streetNumber: string = '';
}

export class Book {
  id: string = '';
  title: string = '';
  author: string = '';
  numberOfPages: number = 0;
  year: number = 0;
  cover: string = '';
  availableCopies: number = 0;
  totalCopies: number = 0;
}

export class BorrowedBook {
  id?: string;
  bookId: string = '';
  userId: string = '';
  borrowDate: Date = new Date(Number.MIN_SAFE_INTEGER);
  returnDate?: Date;
  isReturned: boolean = false;
}

export interface BorrowedBookModel {
  bookId: string;
  cover: string;
  title: string;
  author: string;
  borrowDate: Date;
  returnDate?: Date;
  isReturned: boolean;
}

export class Notification {
  id: string = '';
  userId: string = '';
  description: string = '';
  published: boolean = false;
  type: string = '';
}

export enum NotificationType {
  NEW_ACCOUNT = 'NEW_ACCOUNT',
  ACCOUNT_CHANGE = 'ACCOUNT_CHANGE',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED' // toto sme asi mysleli pre usera aj s approved ale vyprdla by som sa na to
}
