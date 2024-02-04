import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Notification, User } from "../../shared/model/LibraryModel";
import { AuthService } from "../../shared/services/auth-service";
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = new FormGroup({});
  hide = true;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService) { }

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
    user.address = {
      street: this.signUpForm.get('street')?.value,
      streetNumber: this.signUpForm.get('streetNumber')?.value,
      city: this.signUpForm.get('city')?.value,
      zipcode: this.signUpForm.get('zipcode')?.value
    }
    user.username = this.signUpForm.get('username')?.value;
    user.password = this.signUpForm.get('password')?.value;

    let notification = new Notification();
    notification.userId = user.id;
    notification.description = `A new user ${user.username} completed the signup form.`;
    notification.published = new Date();
    notification.type = 'UserFormAdded';

    this.notificationService.addNotification(notification).subscribe(d => {
      if (!isNaN(d)) {
        console.log(d);
      }
    });

    this.authService.signUpUser(user);
  }
}
