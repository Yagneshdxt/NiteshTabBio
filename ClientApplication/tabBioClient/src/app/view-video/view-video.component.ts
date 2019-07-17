import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { WebApiConnectService } from '../web-api-connect.service';
import { AddVideo } from '../Models/add-video';

@Component({
  selector: 'app-view-video',
  templateUrl: './view-video.component.html',
  styleUrls: ['./view-video.component.css']
})
export class ViewVideoComponent implements OnInit {
  model: AddVideo[] = new Array();
  iframeSrc: SafeResourceUrl = null;
  public errors: String[] = new Array();
  public SuccessMessage: string = null;
  public loading: boolean = false;

  constructor(private webApiService: WebApiConnectService, private routes: Router,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.errors = new Array();
    this.loading = true;
    if (!this.loading) {
      return;
    }
    this.SuccessMessage = null;
    this.webApiService.get("/api/userVideos").subscribe((data:AddVideo[])=>{
      data.forEach(element => {
        element.SanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + element.videoUrl);
      });
      console.log(data);
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
    }, () => { this.loading = false; })
  }

}
