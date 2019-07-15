import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WebApiConnectService } from '../web-api-connect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  Name: string;
  Title: string;
  Bio: string;
  website: string;
  Email: string;
  profilePicturePath: string;
  uploadedImage: File;
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;
  // public FormGroupForm = new FormGroup({
  //   uploadImage: ['']
  // })

  // FormGroupForm = this.formBuilder.group({
  //   profile: ['']
  // });

  //public formFields : { Title: string, Bio: string, Website: string, AspNetUser: { Email: string, FirstName: string } } = null;
  constructor(private webApiService: WebApiConnectService, private routes: Router) { }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.uploadedImage = file;
      //this.EditProfileFormGroup.get('profile').setValue(file);
    }
  }

  CreateUpdateProfile(EditProfileForm: NgForm) {
    this.errors = new Array();
    this.loading = true;
    if (!this.loading) {
      return;
    }
    this.SuccessMessage = null;

    let formFields: { Title: string, Bio: string, website: string, profilePicturePath: string, /*profilePicture:File ,*/AspNetUser: { /*Email?: string,*/ FirstName: string } } = {
      "website": EditProfileForm.value.website,
      "Bio": EditProfileForm.value.Bio,
      "Title": EditProfileForm.value.Title,
      "profilePicturePath": "",
      //"profilePicture" : EditProfileForm.value.File["uploadImage"],
      "AspNetUser": {
        //"Email": EditProfileForm.value.Email,
        "FirstName": EditProfileForm.value.Name
      }
    }

    let formData: FormData = new FormData();
    //const payLoad = new HttpParams()
    // formData.append("website", EditProfileForm.value.website);
    // formData.append("Bio", EditProfileForm.value.Bio);
    // formData.append("Title", EditProfileForm.value.Title);
    // formData.append("profilePicturePath", "");//"profilePicture" : EditProfileForm.value.File["uploadImage"],
    // formData.append("AspNetUser.FirstName",EditProfileForm.value.Name);
    if (this.uploadedImage && this.uploadedImage != null) {
      formData.append("profilePicture", this.uploadedImage, this.uploadedImage.name);
    }
    formData.append("userBioBindingModel", JSON.stringify(formFields))
    //formData.append("profilePicture", this.uploadedImage);
    //.set(  "FirstName", EditProfileForm.value.Name)
    //let headerOption = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    //Api call
    this.webApiService.postWithFile('/api/UserBios/AddUpdateUserBio', formData)
      .subscribe(
        (data) => {
          //EditProfileForm.resetForm();
          this.SuccessMessage = "Record updated successful";
          console.log(data)
        },
        (errorResponse) => {
          this.errors = [...this.webApiService.ModelStateErrorToErrorList(errorResponse)];
          this.loading = false;
        }, () => { this.loading = false; }
      );

  }

  AddSocialMediaLink(){
    this.routes.navigateByUrl("/editLink");
  }

  ngOnInit() {
    this.loading = true;
    this.webApiService.get('/api/UserBios').subscribe(
      (data: { Title: string, Bio: string, website: string, profilePicturePath: string, AspNetUser: { Email: string, FirstName: string } }) => {
        console.log(data);
        if (data && data != null) {
          this.Name = data.AspNetUser.FirstName;
          this.Title = data.Title;
          this.Bio = data.Bio;
          this.website = data.website;
          this.Email = data.AspNetUser.Email;
          this.profilePicturePath = data.profilePicturePath;
        }
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
