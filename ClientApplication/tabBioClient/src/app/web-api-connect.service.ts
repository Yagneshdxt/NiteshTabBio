import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from '../environments/environment'
import { Observable, throwError } from 'rxjs';
// Import Observable from rxjs/Observable

@Injectable({
  providedIn: 'root'
})
export class WebApiConnectService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };
  public baseUrl: string = environment.baseUrl;
  public Redirecturl: string;
  setHttpContentTypeWithToken(contentType: string = 'application/json') {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': contentType,
        'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
      })
    };
    //console.log(this.httpOptions);
    return this.httpOptions;
  }

  setCustomeHeader(contentType: string) {
    this.httpOptions = {
      headers: new HttpHeaders(JSON.parse(contentType))
    };
    console.log(this.httpOptions);
    return this.httpOptions;
  }

  constructor(private _http: HttpClient, @Optional() private token: string = null) {
    if (token && (token != null || token != '')) {
      this.httpOptions.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    }
    this.baseUrl = environment.baseUrl
  }

  get(UrlPath: string): Observable<Object> {
    return this._http.get(this.baseUrl + UrlPath, this.setHttpContentTypeWithToken());
  }

  getAnonymous(UrlPath: string): Observable<Object> {
    return this._http.get(this.baseUrl + UrlPath);
  }

  getWithHeader(UrlPath: string, headerObject: HttpHeaders): Observable<Object> {
    return this._http.get(this.baseUrl + UrlPath, { headers: headerObject });
  }

  post(UrlPath: string, payload: Object): Observable<Object> {
    return this._http.post(this.baseUrl + UrlPath, payload, this.setHttpContentTypeWithToken());
  }

  postAnonymous(UrlPath: string, payload: Object): Observable<Object> {
    return this._http.post(this.baseUrl + UrlPath, payload);
  }

  postAnonymousWithHeader(UrlPath: string, payload: Object, headerObject: HttpHeaders): Observable<Object> {
    return this._http.post(this.baseUrl + UrlPath, payload, { headers: headerObject });
  }
  postWithFile(UrlPath: string, payload: Object): Observable<Object> {
    return this._http.post(this.baseUrl + UrlPath, payload,
      this.setCustomeHeader(JSON.stringify({
        //'Content-Type': 'multipart/form-data',
        //'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
      }))
    );
  }

  delete(UrlPath: string): Observable<Object>{
    return this._http.delete(this.baseUrl + UrlPath, this.setHttpContentTypeWithToken());
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

  getMaxItem(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
        max = arr[i];
    }
    return max;
  }

  ModelStateErrorToErrorList(errorResponse: HttpErrorResponse): string[] {
    let errors = new Array();
    console.log(errorResponse);
    if (errorResponse.status === 400) {
      // handle validation error
      if (errorResponse.error) {
        if (errorResponse.error.Message) {
          errors.push(errorResponse.error.Message);
        }
        if (errorResponse.error.error) {
          errors.push(errorResponse.error.error);
        }
        if (errorResponse.error.error_description) {
          errors.push(errorResponse.error.error_description);
        }
        let modelStateProperyErrorLst: string[];
        for (var modelStateError in errorResponse.error.ModelState) {
          if (errorResponse.error.ModelState.hasOwnProperty(modelStateError)) {
            modelStateProperyErrorLst = errorResponse.error.ModelState[modelStateError];
            modelStateProperyErrorLst.forEach(modelErrorMsg => {
              errors.push(modelErrorMsg);
            });
          }
        }
      }
    } if (errorResponse.status === 401) {
      errors.push(errorResponse.statusText);
      errors.push(errorResponse.error.message);
    }
    else {
      errors.push("something went wrong!");
    }

    return errors;
  }

}
