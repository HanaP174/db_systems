import {NgModule} from "@angular/core";
import {UserComponent} from "./user.component";
import {AppModule} from "../app.module";

@NgModule({
  declarations: [UserComponent],
  imports: [
    AppModule
  ]
})
export class UserModule {}
