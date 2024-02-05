import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {Option, User} from "../../../shared/model/LibraryModel";

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  hide = false;
  newUserForm: FormGroup = new FormGroup({});
  activatedOptions: Option[] = [
    {value: false, viewValue: 'not activated'},
    {value: true, viewValue: 'activated'}];

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<AddUserDialogComponent>) {
  }

  ngOnInit() {
    this.newUserForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      birthNumber: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      streetNumber: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      activated: new FormControl(false, [Validators.required])
    })
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.mapNewUser());
  }

  private mapNewUser() {
    const user = new User();
    user.name = this.newUserForm.get('firstName')?.value;
    user.surname = this.newUserForm.get('lastName')?.value;
    user.birthNumber = this.newUserForm.get('birthNumber')?.value;
    user.address = {
      street: this.newUserForm.get('street')?.value,
      streetNumber: this.newUserForm.get('streetNumber')?.value,
      city: this.newUserForm.get('city')?.value,
      zipcode: this.newUserForm.get('zipcode')?.value
    }
    user.username = this.newUserForm.get('username')?.value;
    user.password = this.newUserForm.get('password')?.value;
    user.activated = this.newUserForm.get('activated')?.value;

    return user;
  }

}
