import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Book} from "../../../shared/model/LibraryModel";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-book-dialog',
  templateUrl: './add-book-dialog.component.html',
  styleUrls: ['./add-book-dialog.component.css']
})
export class AddBookDialogComponent implements OnInit {

  bookForm: FormGroup = new FormGroup({});
  cover: string = '';

  constructor(private dialogRef: MatDialogRef<AddBookDialogComponent>,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.bookForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      numberOfPages: new FormControl('', [Validators.required]),
      year: new FormControl(1990, [Validators.required]),
      availableCopies: new FormControl(0, [Validators.required]),
      totalCopies: new FormControl(0, [Validators.required])
    })
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
