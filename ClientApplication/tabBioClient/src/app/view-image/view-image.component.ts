import { Component, OnInit } from '@angular/core';
import { WebApiConnectService } from '../web-api-connect.service';
import { Router } from '@angular/router';
import { AddImage } from '../Models/add-image';
@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css']
})
export class ViewImageComponent implements OnInit {
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;
  public model: AddImage = new AddImage();
  constructor(private webApiService: WebApiConnectService, private routes: Router) {}

  aClick(){
    return false;
  }

  ngOnInit() {
    this.loading = true;
    this.webApiService.get('/api/UserImages/GetAllImagesOfUser').subscribe(
      (data:AddImage) => {
        this.model = data;
        console.log(this.model);
      },
      (errorResponse) => {
        if (errorResponse.status === 401) {
          if (errorResponse.statusText && errorResponse.statusText == "Unauthorized") {
            this.routes.navigateByUrl("/Login");
          }
          this.errors.push(errorResponse.statusText);
          this.errors.push(errorResponse.error.message);
        }
        this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
        this.loading = false;
      }, () => { this.loading = false; }
    )
  }

}
