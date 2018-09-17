import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

// imported services
import { LoginService } from '../services/login.service';
import { LocalStorageService } from 'angular-2-local-storage';

import { environment } from '../../environments/environment';

@Component({
  selector: 'register-comp',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public username: string;
  public email: string;
  public score: number;
  public errorRegistration: boolean = false;
  public errorRegistrationMessage:string;
  public verificationCodeInput: boolean = false;
  public verificationCode: number;
  public verficationCodeNotification: boolean;
  public enteredCode: number;
  public verificationError: boolean = false;
  public headers: Headers = new Headers();

  constructor(
    private http: Http,
    private loginService: LoginService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  homePage(): void {
    window.location.href = 'http://b1-screen.cec.lab.emc.com';
  }

  /*
    register new user in case of a valid registration. Otherwise,
    an error is prompted to the user.
  */
  onSubmit(): void {
    this.hideAlerts();
    if (this.email !== "" && this.email !== undefined) {
      let registrationData = {"email": this.email};
      this.errorRegistration = false;
      this.registerNewUser(registrationData, this.email);
    }
    else {
      this.errorRegistration = true;
    }
  }

  // register new user and validate that there is no error
  registerNewUser(registrationData, email): void {
    this.hideAlerts();
    //add registerationFlag (true) to getCurrentUserInfo inputs incase a user can play multiple times.
    this.loginService.getCurrentUserInfo(email).subscribe((res) => {
      this.errorRegistration = true;
      this.errorRegistrationMessage = "You can only play once!";
      // ** for when a user can play multiple times **
      // this.verificationCode = JSON.parse(res["_body"])["verificationCode"];
      // localStorage.setItem('current', JSON.stringify({ email: email, qIndex: 0 }));
      // this.verificationCodeInput = true;
      // this.verficationCodeNotification = true;
      // this.errorRegistration = false;
    }, (err) => {
      err = err.json();
      if (err['status'] == '404') {
        this.errorRegistration = false;
        this.loginService.registerNewUser(registrationData).subscribe((res) => {
          this.errorRegistration = false;
          localStorage.setItem('current', JSON.stringify({ email: email, qIndex: 0 }));
          this.verificationCode = res.json()["verificationCode"];
          this.verificationCodeInput = true;
          this.verficationCodeNotification = true;
        }, (err) => {
          err = err.json();
          this.errorRegistration = true;
          if(err['body'] == null) {
            this.errorRegistrationMessage = 'Please insert valid/unique email dell domain!';
          } else {
            this.errorRegistrationMessage = err['body'];
          }
        });
      } else {
        this.errorRegistration = true;
        if(err['body'] == null) {
          this.errorRegistrationMessage = 'An error has occured please try again!';
        } else {
          this.errorRegistrationMessage = err['body'];
        }
      }
    });
  }

  validateUser(): void {
    if (this.enteredCode == this.verificationCode) {
      this.verificationCodeInput = false;
      this.router.navigate(['./question']);
    } else {
      this.hideAlerts();
      this.verificationError = true;
    }
  }
   hideAlerts() {
     this.verficationCodeNotification = false;
     this.errorRegistration = false;
     this.verificationError = false;
   }

  // destroy the previous session and remove error message if there is any
  ngOnInit(): void {
    localStorage.setItem('current', JSON.stringify({ email: '', qIndex: '' }));
    this.hideAlerts();
  }
}
