import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AdminService } from '../services/admin.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'ct-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public current: String;
  public isAdmin: boolean;
  public modalRef: ModalDirective;
  public successfulAlert: boolean;
  public failedAlert: boolean;
  public failedMessage: String;
  public changePasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    new_password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
    confirm_password: new FormControl('')
  });
  formSubmitted: boolean;

  constructor(
    private loginService: LoginService,
    private adminService: AdminService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.changePasswordForm.get('confirm_password').setValidators([Validators.required, NavbarComponent.passwordMatch(this.changePasswordForm.get('new_password'))]);
  }

  // get current user stored in localStorage
  getCurrentUser(): void {
    this.current = JSON.parse(localStorage.getItem('current'))["username"];
  }

  // username is set in nav bar if the user is now playing/viewing leaderboard
  ngOnInit(): void {
    this.hideAlerts();
    this.isAdmin = this.loginService.isAdmin();
    if (this.router.url === "/leaderboard" || this.router.url === "/register") {
      this.current = "";
    }
    else {
      this.getCurrentUser();
    }
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['./admin/login']);
  }
  changePasswordPopup(modal: ModalDirective): void {
    this.hideAlerts();
    this.modalRef = modal;
    this.modalRef.show();
  }
  onChangePasswordFormSubmit(): void {
    this.hideAlerts();
    if (this.changePasswordForm.valid) {
      this.adminService.changePassword(this.changePasswordForm.value).subscribe((res) => {
        res = res.json();
        console.log(res);
        localStorage.setItem('jwtToken', res.token);
        this.resetForm();
        this.successfulAlert = true;
      }, (err) => {
        err = err.json();
        console.log(err);
        this.failedAlert = true;
        this.failedMessage = err.body ? err.body : 'Something went wrong please try again!';
        this.resetForm();
      });
    }
  }
  close(): void {
    this.hideAlerts();
    this.resetForm();
    this.modalRef.hide();
  }
  static passwordMatch(new_password: AbstractControl): ValidatorFn {
    return (confirm_password) => confirm_password.value == new_password.value ? null : { matched: true };
  }
  resetForm(): void {
    let control: AbstractControl = null;
    this.changePasswordForm.reset();
    this.changePasswordForm.markAsUntouched();
    Object.keys(this.changePasswordForm.controls).forEach((name) => {
      control = this.changePasswordForm.controls[name];
      control.setErrors({ "required": true });
    });
  }
  hideAlerts(): void {
    this.successfulAlert = false;
    this.failedAlert = false;
  }
}
