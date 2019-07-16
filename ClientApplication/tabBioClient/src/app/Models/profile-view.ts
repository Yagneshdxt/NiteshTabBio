import { Optional } from '@angular/core';
import { SiteLink } from './site-link';

export class ProfileView {

    Title: string
    Bio: string
    website: string
    profilePicturePath: string
    FirstName: string
    LastName: string
    userSiteLinks: SiteLink[]
}
