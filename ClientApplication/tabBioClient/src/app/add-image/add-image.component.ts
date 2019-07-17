import { Component, OnInit } from '@angular/core';
import { WebApiConnectService } from '../web-api-connect.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AddImage } from '../Models/add-image';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.css']
})
export class AddImageComponent implements OnInit {
  model: AddImage = new AddImage();
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;
  public uploadedImage: File;
  constructor(private webApiService: WebApiConnectService, private routes: Router) { }

  ngOnInit() {
    this.model.httphttps = "https://";
    this.model.IsProfileImg = false;
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadedImage = file;
    }
  }

  FormReset(AddImgForm: NgForm){
    AddImgForm.reset();
    this.uploadedImage = null;
    this.ngOnInit();
  }

  CreateUpdateSmLink(AddImgForm: NgForm) {
    this.errors = new Array();
    this.loading = true;
    if (!this.loading) {
      return;
    }
    this.SuccessMessage = null;

    let formData: FormData = new FormData();
    if (this.uploadedImage && this.uploadedImage != null) {
      formData.append("uploadedImage", this.uploadedImage, this.uploadedImage.name);
    }
    formData.append("UserImage", JSON.stringify(this.model))

    this.webApiService.postWithFile("/api/UserImages/AddUserImage", formData).subscribe(
      (data) => {
        this.SuccessMessage = "Record updated successful";
        this.FormReset(AddImgForm);
        console.log(data);
      },
      (errorResponse) => {
        this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
        this.loading = false;
      },
      () => {
        this.loading = false;
      });
  }

}
