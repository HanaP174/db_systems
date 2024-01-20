import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  formLogin: FormGroup = new FormGroup({});
  hide = true;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)
    })
  }
}
