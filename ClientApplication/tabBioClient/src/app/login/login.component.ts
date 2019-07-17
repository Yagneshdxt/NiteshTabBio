import { Component, OnInit } from '@angular/core';
import { WebApiConnectService } from '../web-api-connect.service';
import { NgForm } from '@angular/forms';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;
  constructor(private webApiService: WebApiConnectService, private router: Router) { }

  ngOnInit() {
  }

  LoginUser(LoginForm: NgForm) {
    this.errors = new Array();
    this.loading = true;
    if (!this.loading) {
      return;
    }
    this.SuccessMessage = null;
    this.webApiService.isUserLoggedIn = false;
    let headerOption = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    const payLoad = new HttpParams()
      .set("grant_type", "password")
      .set("username", LoginForm.value.Email)
      .set("password", LoginForm.value.Password);
    //Api call
    this.webApiService.postAnonymousWithHeader('/Token', payLoad,
    headerOption)
      .subscribe(
        (data: { access_token: string, expires_in: number, userName: string }) => {
          LoginForm.resetForm();
          localStorage.setItem('accessToken', data.access_token);
          localStorage.setItem('userName', data.userName);
          let Redirecturl: string = "/Home";
          if (this.webApiService.Redirecturl) {
            Redirecturl = this.webApiService.Redirecturl;
          }
          this.webApiService.isUserLoggedIn = true;
          this.router.navigateByUrl(Redirecturl);
          
        },
        (errorResponse) => {
          console.log('oops', errorResponse);
          this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
          this.loading = false;
        }, () => { this.loading = false; }
      );
  }

}
