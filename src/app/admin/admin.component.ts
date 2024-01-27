import {Component} from "@angular/core";
import {AuthService} from "../shared/services/auth-service";

@Component({
  selector: 'admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css']
})
export class AdminComponent {

  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }
}
