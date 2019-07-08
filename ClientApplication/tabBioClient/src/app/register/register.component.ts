import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WebApiConnectService } from '../web-api-connect.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  //styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private webApiService:WebApiConnectService) { }

  registerUser(registerform:NgForm){
    this.webApiService.post('/api/Account/Register',registerform).subscribe((data)=>{console.log(data)});
  }

  ngOnInit() {
  }

}
