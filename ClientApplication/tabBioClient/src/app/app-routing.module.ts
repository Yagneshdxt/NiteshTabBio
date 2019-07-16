import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { AuthGuard } from './auth.guard';
import { EditSMLinkComponent } from './edit-smlink/edit-smlink.component';
import { AddImageComponent } from './add-image/add-image.component';
import { ViewImageComponent } from './view-image/view-image.component';
import { EditImageComponent } from './edit-image/edit-image.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';


const routes: Routes = [
  { path: 'Home', component: HomeComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'editProfile', component: ProfilComponent, canActivate: [AuthGuard], },
  { path: 'editLink', component: EditSMLinkComponent, canActivate: [AuthGuard], },
  { path: 'addImage', component: AddImageComponent, canActivate: [AuthGuard], },
  { path: 'viewsImage', component: ViewImageComponent },
  { path: 'EditImage', component: EditImageComponent, canActivate: [AuthGuard], },
  { path: ':profileName', component: ViewProfileComponent },
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
