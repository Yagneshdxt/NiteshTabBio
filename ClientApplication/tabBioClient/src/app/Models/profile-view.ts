import { Optional } from '@angular/core';
import { SiteLink } from './site-link';
import { AddImage } from './add-image';
import { AddVideo } from './add-video';

export class ProfileView {

    Title: string
    Bio: string
    website: string
    profilePicturePath: string
    FirstName: string
    LastName: string
    UserUniqueCode: string
    userSiteLinks: SiteLink[]
    userImages: AddImage[]
    userVedio: AddVideo[]
}
