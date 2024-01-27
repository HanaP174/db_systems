import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/model/LibraryModel";
import {AuthService} from "../../shared/services/auth-service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = new FormGroup({});
  hide = true;

  constructor (private formBuilder: FormBuilder,
               private authService: AuthService) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      birthNumber: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      streetNumber: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  signUser() {
    const user = new User();
    user.name = this.signUpForm.get('firstName')?.value;
    user.surname = this.signUpForm.get('lastName')?.value;
    user.birthNumber = this.signUpForm.get('birthNumber')?.value;
    user.address.street = this.signUpForm.get('street')?.value;
    user.address.street = this.signUpForm.get('streetNumber')?.value;
    user.address.street = this.signUpForm.get('city')?.value;
    user.address.street = this.signUpForm.get('zipcode')?.value;
    user.username = this.signUpForm.get('username')?.value;
    user.password = this.signUpForm.get('password')?.value;

    this.authService.signUpUser(user);
  }
}
