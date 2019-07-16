import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebApiConnectService } from '../web-api-connect.service';
import { AddImage } from '../Models/add-image';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css']
})
export class EditImageComponent implements OnInit {
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;
  public model: AddImage = new AddImage();
  constructor(private webApiService: WebApiConnectService, private routes: Router) { }

  aClick() {
    return false;
  }

  deleteImage(ImageId: number) {
    this.loading = true;
    this.errors = new Array();
    this.SuccessMessage = "";
    this.webApiService.delete("/api/UserImages/DeleteUserImage/" + ImageId).subscribe((data) => {
      this.SuccessMessage = "Record deleted successfully";
      this.ngOnInit();
    }, (errorResponse) => {
      if (errorResponse.status === 401) {
        if (errorResponse.statusText && errorResponse.statusText == "Unauthorized") {
          this.routes.navigateByUrl("/Login");
        }
        this.errors.push(errorResponse.statusText);
        this.errors.push(errorResponse.error.message);
      }
      this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
      this.loading = false;
    }, () => { this.loading = false; })
  }

  saveOrder() {
    this.loading = true;
    this.errors = new Array();
    this.SuccessMessage = "";
    this.webApiService.post("/api/UserImages/UpdateImageOrder/", this.model).subscribe((data) => {
      this.SuccessMessage = "Record updated successfully";
      this.ngOnInit();
    }, (errorResponse) => {
      if (errorResponse.status === 401) {
        if (errorResponse.statusText && errorResponse.statusText == "Unauthorized") {
          this.routes.navigateByUrl("/Login");
        }
        this.errors.push(errorResponse.statusText);
        this.errors.push(errorResponse.error.message);
      }
      this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
      this.loading = false;
    }, () => { this.loading = false; })
  }

  ngOnInit() {
    this.loading = true;
    this.webApiService.get('/api/UserImages/GetAllImagesOfUser').subscribe(
      (data: AddImage) => {
        this.model = data;
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
