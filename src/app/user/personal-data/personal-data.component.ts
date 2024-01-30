import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth-service";
import {User} from "../../shared/model/LibraryModel";
import {Router} from "@angular/router";

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
}

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {

  personalDataForm: FormGroup = new FormGroup({});
  hide = true;

  private user: User = new User();

  constructor (private formBuilder: FormBuilder,
               private authService: AuthService,
               private router: Router) {}

  ngOnInit() {
    this.user = this.authService.user;
    console.log(this.user);
    const userModel = this.getUserModel();
    this.personalDataForm = this.formBuilder.group({
      name: new FormControl(userModel.name, [Validators.required]),
      surname: new FormControl(userModel.surname, [Validators.required]),
      birthNumber: new FormControl(userModel.birthNumber, [Validators.required]),
      street: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      streetNumber: new FormControl('', [Validators.required]),
      username: new FormControl(userModel.username, [Validators.required]),
      password: new FormControl(userModel.password, [Validators.required])
    })
  }

  changeData() {
    const user = new User();
    user.name = this.personalDataForm.get('name')?.value;
    user.surname = this.personalDataForm.get('surname')?.value;
    user.birthNumber = this.personalDataForm.get('birthNumber')?.value;
    user.address.street = this.personalDataForm.get('street')?.value;
    user.address.street = this.personalDataForm.get('streetNumber')?.value;
    user.address.street = this.personalDataForm.get('city')?.value;
    user.address.street = this.personalDataForm.get('zipcode')?.value;
    user.username = this.personalDataForm.get('username')?.value;
    user.password = this.personalDataForm.get('password')?.value;

    // todo change user
    // todo address is not mapped properly....
  }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/home'])
  }

  private getUserModel() {
    return {
      id: this.user.id,
      name: this.user.name,
      surname: this.user.surname,
      birthNumber: this.user.birthNumber,
      username: this.user.username,
      password: this.user.password
      // street: this.user.address.street,
      // zipcode: this.user.address.zipcode,
      // city: this.user.address.city,
      // streetNumber: this.user.address.streetNumber
    } as UserModel;
  }
}
