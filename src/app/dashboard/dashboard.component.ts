import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AdminService } from '../services/admin.service';
import { QuestionManipulationService } from '../services/question-manipulation.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  invitationErr: boolean;
  invitationSuccess: boolean;
  errMessage: string;
  topPlayers: any[] = [];
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
  }
  setErrorMessage(message: string) {
    this.invitationErr = true;
    this.errMessage = message;
  }
}
