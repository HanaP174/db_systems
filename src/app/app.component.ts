import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthService} from "./shared/services/auth-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'library';

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private authService: AuthService) {
    this.matIconRegistry.addSvgIcon('app-books',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/books.svg'));
  }

  ngOnInit() {
    this.authService.authenticateFromLocalStorage();
  }
}
