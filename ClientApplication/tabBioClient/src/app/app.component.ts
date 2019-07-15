import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebApiConnectService } from './web-api-connect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tabBioClient';
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  constructor(private router: Router, private webApiServices: WebApiConnectService) { }
  signOut() {

    if (localStorage.getItem("accessToken") === null) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userName');
      sessionStorage.removeItem('accessToken');
      this.router.navigateByUrl("/Login");
      return;
    }
    if (localStorage.getItem("accessToken") && localStorage.getItem("accessToken") != null) {
      this.webApiServices.post('/api/Account/Logout', null).subscribe((data) => {
      },
        (errorResponse) => {
          console.log('oops', errorResponse);
          //this.errors = [...this.webApiServices.ModelStateErrorToErrorList(errorResponse)];
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userName');
          sessionStorage.removeItem('accessToken');
          this.router.navigateByUrl("/Login");
        },
        ()=>{
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userName');
          sessionStorage.removeItem('accessToken');
          this.router.navigateByUrl("/Login");
        }
      )
    }



  }

}
