import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WebApiConnectService } from '../web-api-connect.service';
import { ProfileView } from '../Models/profile-view';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;
  profileCode: string;
  model:ProfileView
  constructor(private webApiService: WebApiConnectService, private routes: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.params.subscribe(params => this.profileCode = params['profileName']);
    this.webApiService.get("/api/UserBios/ViewUserBios/" + this.profileCode).subscribe((data:ProfileView) => { 
      this.model = data;
      console.log(this.model);
    },(errorResponse)=>{
      if (errorResponse.status === 401) {
        if (errorResponse.statusText && errorResponse.statusText == "Unauthorized") {
          this.routes.navigateByUrl("/Login");
        }
        this.errors.push(errorResponse.statusText);
        this.errors.push(errorResponse.error.message);
      }
      this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
      this.loading = false;
    },()=>{this.loading = false;})

  }

}
