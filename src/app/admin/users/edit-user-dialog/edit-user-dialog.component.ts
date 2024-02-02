import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../shared/model/LibraryModel";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export class UserModel {
  id: string = '';
  name: string = '';
  surname: string = '';
  birthNumber: string = '';
  username: string = '';
  password: string = '';
  street: string = '';
  zipcode: string = '';
  city: string = '';
  streetNumber: string = '';
  activated = false;
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent {

  personalDataForm: FormGroup = new FormGroup({});
  hide = true;

  private readonly user: User = new User();

  constructor (private formBuilder: FormBuilder,
               private dialogRef: MatDialogRef<EditUserDialogComponent>,
               @Inject(MAT_DIALOG_DATA) user: User) {
    this.user = user;
  }

  ngOnInit() {
    const userModel = this.getUserModel();
    this.personalDataForm = this.formBuilder.group({
      name: new FormControl(userModel.name, [Validators.required]),
      surname: new FormControl(userModel.surname, [Validators.required]),
      birthNumber: new FormControl(userModel.birthNumber, [Validators.required]),
      street: new FormControl(userModel.street, [Validators.required]),
      zipcode: new FormControl(userModel.zipcode, [Validators.required]),
      city: new FormControl(userModel.city, [Validators.required]),
      streetNumber: new FormControl(userModel.streetNumber, [Validators.required]),
      username: new FormControl(userModel.username, [Validators.required]),
      password: new FormControl(userModel.password, [Validators.required]),
      activated: new FormControl(userModel.activated, [Validators.required])
    })
  }

  close() {
    this.dialogRef.close();
  }

  changeData() {
    const user = new User();
    user.name = this.personalDataForm.get('name')?.value;
    user.surname = this.personalDataForm.get('surname')?.value;
    user.birthNumber = this.personalDataForm.get('birthNumber')?.value;
    user.address = {
      street: this.personalDataForm.get('street')?.value,
      streetNumber: this.personalDataForm.get('streetNumber')?.value,
      city: this.personalDataForm.get('city')?.value,
      zipcode: this.personalDataForm.get('zipcode')?.value
    };
    user.password = this.personalDataForm.get('password')?.value;
    user.activated = this.personalDataForm.get('activated')?.value;
    user.role = this.user.role;
    user.id = this.user.id;

    this.dialogRef.close(user);
  }

  private getUserModel() {
    return {
      id: this.user.id,
      name: this.user.name,
      surname: this.user.surname,
      birthNumber: this.user.birthNumber,
      username: this.user.username,
      password: this.user.password,
      street: this.user.address.street,
      zipcode: this.user.address.zipcode,
      city: this.user.address.city,
      streetNumber: this.user.address.streetNumber,
      activated: this.user.activated
    } as UserModel;
  }
}
