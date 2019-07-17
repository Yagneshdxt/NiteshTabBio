import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebApiConnectService } from '../web-api-connect.service';
import { AddVideo } from '../Models/add-video';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css']
})
export class AddVideoComponent implements OnInit {
  model: AddVideo = new AddVideo();
  iframeSrc: SafeResourceUrl = null;
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;

  constructor(private webApiService: WebApiConnectService, private routes: Router,private sanitizer: DomSanitizer) { }

  FormReset(AddVideoForm:NgForm){
    AddVideoForm.reset();
    this.iframeSrc = null;
  }

  SubmitAddVideo(AddVideoForm:NgForm){
    this.errors = new Array();
    this.loading = true;
    if (!this.loading) {
      return;
    }
    this.SuccessMessage = null;
    this.webApiService.post("/api/userVideos", this.model).subscribe((data) => {
      this.SuccessMessage = "Record updated successfully";
      this.FormReset(AddVideoForm);
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

  setIframeUrl(modelUrl:string) {
    this.iframeSrc = null;
    if (modelUrl != "") {
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + modelUrl);
    }
  }

  ngOnInit() {
  }

}
