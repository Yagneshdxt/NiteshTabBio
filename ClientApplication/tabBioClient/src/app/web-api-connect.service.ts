import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import {environment} from '../environments/environment'
import { Observable, throwError } from 'rxjs';
// Import Observable from rxjs/Observable

@Injectable({
  providedIn: 'root'
})
export class WebApiConnectService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private _http: HttpClient, private baseUrl: string = environment.baseUrl, private token?: string) { 

    if(token !== null || token !== ''){
      this.httpOptions.headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': token
      })
    }
  }
  
  get(UrlPath:string) : Observable<Object> {
    return this._http.get(this.baseUrl + UrlPath);
  }

  post(UrlPath:string, payload:Object) : Observable<Object> {
    return this._http.post(this.baseUrl + UrlPath, payload, this.httpOptions);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}
