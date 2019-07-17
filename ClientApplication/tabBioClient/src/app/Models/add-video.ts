import { Optional } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

export class AddVideo {

    public  Id:number
    public userId :string 
    public videoUrl :string 
    public  title :string
    public  description :string
    public  videoOrder :string
    public SanitizedVideoUrl : SafeResourceUrl
}
