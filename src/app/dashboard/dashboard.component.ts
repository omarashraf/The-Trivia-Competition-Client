import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AdminService } from '../services/admin.service';
import { QuestionManipulationService } from '../services/question-manipulation.service';
import { NgForm, FormControl, Validators, FormGroup } from '@angular/forms';
import { NgModule } from '@angular/core';
import { QuestionComponent } from '../question/question.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  timer: any;
  stats: any = {};
  invitationErr: boolean;
  invitationSuccess: boolean;
  timerErr: boolean;
  timerSuccess: boolean;
  errMessage: string;
  topPlayers: any[] = [];
  timerForm = new FormGroup({
    minutes: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern("[0-9]+")]),
    seconds: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2), , Validators.pattern("[0-9]+")])

  });
  constructor(
    private http: Http,
    private adminService: AdminService,
    private questionManipulation: QuestionManipulationService
  ) { }

  ngOnInit() {
    this.adminService.getStats().subscribe((res) => {
      this.stats = res.json()['body'];
    });
    this.questionManipulation.topPlayers("10").subscribe((res) => {
      this.topPlayers = res.json();
    });
  }
  inviteAdmin(invitationForm: NgForm) {
    this.hideAlerts();
    if (invitationForm.valid) {
      let email = invitationForm.value.email;
      this.adminService.iniviteAdmin(email).subscribe((res) => {
        this.invitationSuccess = true;
      }, (err) => {
        this.setErrorMessage(err.json()['body']);
      });
    }
  }
  hideAlerts() {
    this.invitationErr = false;
    this.invitationSuccess = false;
    this.timerSuccess = false;
    this. timerErr = false;
  }
  setErrorMessage(message: string) {
    this.invitationErr = true;
    this.errMessage = message;
  }
  onTimerChangeFormSubmit() {
    this.hideAlerts();
    if (this.timerForm.valid) {
      let timer = this.timerForm.value.minutes + ":" + this.timerForm.value.seconds;
      console.log("TIMER!!", timer);
      this.adminService.setTimer(timer).subscribe((res) => {
        this.timerSuccess = true;
      }, (err) => {
        this.timerErr = true;
      })
    }
  }
}
