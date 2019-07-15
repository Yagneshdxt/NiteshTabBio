import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WebApiConnectService } from '../web-api-connect.service';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  //styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;
  constructor(private webApiService: WebApiConnectService, private activatedRoute: ActivatedRoute) { }

  registerUser(registerform: NgForm) {
    this.errors = new Array();
    this.loading = true;
    if (!this.loading) {
      return;
    }
    this.SuccessMessage = null;

    //Api call
    this.webApiService.postAnonymous('/api/Account/Register', registerform.value)
      .subscribe(
        (data) => {
          registerform.resetForm();
          this.SuccessMessage = "You have successfully registerd. We have send you an email with weblink in it. Please click on the link to confirm your email Id";
          console.log(data)
        },
        (errorResponse) => {
          console.log('oops', errorResponse);
          this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
          this.loading = false;
        }, () => { this.loading = false; }
      );
  }

  googleSignIn() {
     
    let externalLogin = this.webApiService.baseUrl + "/api/Account/ExternalLogin?provider=Google&response_type=token&client_id=self&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2FRegister&state=NiDr-oUcCdvS_983qFfctjL3OgKX64LQAkjBQFB12M01";
    console.log(externalLogin);
    window.location.href = externalLogin;
    // let headerOption = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    // this.webApiService.getWithHeader(externalLogin, headerOption).subscribe((data)=>{console.log(data)},(errorResponse)=>{console.log(errorResponse)});
  }

  ngOnInit() {
    if (location.hash) {
      if (location.hash.split('access_token=')) {
        console.log(location.hash);
        let accessToken = location.hash.split('access_token=')[1].split('&')[0];
        console.log(location);
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          this.isUserRegistered(accessToken);
        }
      }
    }
  }

  isUserRegistered(accessToken: string) {
    //http get call
    this.webApiService.get('/api/Account/UserInfo').subscribe((response: { Email: string, HasRegistered: boolean, LoginProvider: string }) => {
      console.log(response);
      if (response.HasRegistered) {
        console.log("isUserRegistered  " + response)
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userName', response.Email);
        window.location.href = "/";
      }
      else {
        this.signupExternalUser();
      }
    }, (errorResponse) => {
      this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
    })
  }

  signupExternalUser() {
    this.webApiService.post('/api/Account/RegisterExternal', null).subscribe(
      () => {
        window.location.href = encodeURI(this.webApiService.baseUrl + "/api/Account/ExternalLogin?provider=Google&response_type=token&client_id=self&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2FRegister&state=NiDr-oUcCdvS_983qFfctjL3OgKX64LQAkjBQFB12M01");
      },
      (errorResponse) => 
      {
        this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
      }
    )
  }

}
