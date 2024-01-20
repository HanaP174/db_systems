import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {SignUpComponent} from "./view/sign-up/sign-up.component";
import {HomePageComponent} from "./view/home-page/home-page.component";

const routes: Routes = [
  {path: '', component:HomePageComponent},
  {path: 'sign-up', component:SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  // providers: [RouteGuard] // todo
})
export class AppRoutingModule {}
