import { Component, OnInit } from '@angular/core';
import { WebApiConnectService } from '../web-api-connect.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-smlink',
  templateUrl: './edit-smlink.component.html',
  styleUrls: ['./edit-smlink.component.css']
})
export class EditSMLinkComponent implements OnInit {
  model: smlinkModel = new smlinkModel();
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;
  constructor(private webApiService: WebApiConnectService, private routes: Router) { }

  backToEditProfile() {
    this.routes.navigateByUrl("/editProfile");
  }
  AddLink() {
    let maxOrderNumber = this.model.userSiteLinks.length + 1;///this.webApiService.getMax(this.model.userSiteLinks, "OrderNumber"); //Math.max.apply(Math, this.model.userSiteLinks.map(function (o) { return o.OrderNumber; }))
    this.model.userSiteLinks.push(
      {
        Id: null,
        isAdded: true,
        siteUrls: "",
        OrderNumber: null
      }
    )
    return false;
  }
  DeleteLink(siteLink: { Id: number, siteUrls: string, OrderNumber: number, isAdded: boolean }) {
    this.errors = new Array();
    this.loading = true;
    if (!this.loading) {
      return;
    }
    this.SuccessMessage = null;
    if (siteLink != null && siteLink.Id != null) {
      this.webApiService.delete("/api/UserSiteLinks/DeleteUserSiteLink/"+siteLink.Id).subscribe(
        (data) => { 
          this.SuccessMessage = "Record deleted successful";
          const index: number = this.model.userSiteLinks.indexOf(siteLink);
          if (index !== -1) {
            this.model.userSiteLinks.splice(index, 1);
          }
        }, 
        (errorResponse) => { 
          this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
          this.loading = false;
        }, () => { 
          this.loading = false;
        });
    } else {
      const index: number = this.model.userSiteLinks.indexOf(siteLink);
      if (index !== -1) {
        this.model.userSiteLinks.splice(index, 1);
      }
    }
    return false;
  }

  CreateUpdateSmLink(EditSmLinkForm: NgForm) {
    this.errors = new Array();
    this.loading = true;
    if (!this.loading) {
      return;
    }
    this.SuccessMessage = null;
    this.webApiService.post("/api/UserSiteLinks/AddUpdateSiteLink", this.model).subscribe(
      (data) => {
        this.SuccessMessage = "Record updated successful";
        //console.log(data)
      },
      (errorResponse) => {
        this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
        this.loading = false;
      },
      () => {
        this.loading = false;
      });
  }

  ngOnInit() {
    this.loading = true;
    this.webApiService.get("/api/UserSiteLinks").subscribe(
      (data: smlinkModel) => {
        this.model = data;
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
      }, () => { this.loading = false; });
  }

}

class smlinkModel {
  profilePicturePath: string
  userSiteLinks: [{ Id: number, siteUrls: string, OrderNumber: number, isAdded: boolean }]
};
