import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Book} from "../../../shared/model/LibraryModel";

@Component({
  selector: 'app-edit-book-dialog',
  templateUrl: './edit-book-dialog.component.html',
  styleUrls: ['./edit-book-dialog.component.css']
})
export class EditBookDialogComponent implements OnInit {

  bookToEdit = new Book();
  bookForm: FormGroup = new FormGroup({});
  cover: string = '';

  constructor(private dialogRef: MatDialogRef<EditBookDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) book: Book) {
    this.bookToEdit = book;
  }

  ngOnInit() {
    this.bookForm = this.formBuilder.group({
      title: new FormControl(this.bookToEdit.title, [Validators.required]),
      author: new FormControl(this.bookToEdit.author, [Validators.required]),
      numberOfPages: new FormControl(this.bookToEdit.numberOfPages, [Validators.required]),
      year: new FormControl(this.bookToEdit.year, [Validators.required]),
      availableCopies: new FormControl(this.bookToEdit.availableCopies, [Validators.required]),
      totalCopies: new FormControl(this.bookToEdit.totalCopies, [Validators.required])
    })
    this.cover = this.bookToEdit.cover;
  }

  loadImage(image: string) {
    this.cover = image;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.mapBook());
  }

  private mapBook() {
    const book = new Book();
    book.id = this.bookToEdit.id;
    book.title = this.bookForm.get('title')?.value;
    book.author = this.bookForm.get('author')?.value;
    book.numberOfPages = this.bookForm.get('numberOfPages')?.value;
    book.year = this.bookForm.get('year')?.value;
    book.availableCopies = this.bookForm.get('availableCopies')?.value;
    book.totalCopies = this.bookForm.get('totalCopies')?.value;
    book.cover = this.cover;

    return book;
  }
}
