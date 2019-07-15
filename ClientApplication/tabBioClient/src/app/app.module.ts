import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import {SortablejsModule} from 'ngx-sortablejs'

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import {WebApiConnectService} from './web-api-connect.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { EditSMLinkComponent } from './edit-smlink/edit-smlink.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    PageNotFoundComponent,
    HomeComponent,
    LoginComponent,
    ProfilComponent,
    EditSMLinkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SortablejsModule.forRoot({ animation: 150 }),
  ],
  providers: [WebApiConnectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
