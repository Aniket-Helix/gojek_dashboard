import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { OCCUPATIONS } from '../constant';
import { DashboardService } from '../services/analytics.service';

@Component({
  selector: 'app-first-time-popup',
  templateUrl: './first-time-popup.component.html',
  styleUrls: ['./first-time-popup.component.scss']
})
export class FirstTimePopupComponent implements OnInit {

  userDetails = {
    Occupation: '',
    Affiliation: '',
    emailAddress: '',
    isChecked: false,
    isSubscribedToNewsLetter: true,
    isSubscribedToEventUpdate: false,
    isSubscribedToCareerOpportunities: false
  }
  loading: boolean;
  occupations = OCCUPATIONS;

  constructor(public dialogRef: MatDialogRef<FirstTimePopupComponent>, private cookieService: CookieService, private _dashboardService: DashboardService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  submitForm(): void {
    if(this.userDetails.emailAddress !== ''){
      const tags = [];
      if (this.userDetails.isSubscribedToCareerOpportunities){
        tags.push("Careers")
      }
      if (this.userDetails.isSubscribedToNewsLetter){
        tags.push("Newsletter")
      }
      if (this.userDetails.isSubscribedToEventUpdate){
        tags.push("Events")
      }
      const payload = {
        "email_address": this.userDetails.emailAddress,
        "status":"subscribed",
        "tags": tags
      }
  
      if(this.cookieService.get('token')){
        this.addUserToMailChimp(payload)
      }else{
        this._dashboardService.signup(this.userDetails.emailAddress).subscribe(res => {
          if (res.type === 'success' && res.status) {
            this.cookieService.set('token', res.data);
            this.addUserToMailChimp(payload)
          }else{
            this._snackBar.open("Error occured at the time of generating token", "Cancel", {
              duration: 3000
            })
          }
        })
      }
    }
  }

  addUserToMailChimp(payload){
    this._dashboardService.addUserToMailingList(payload).subscribe(res=> {
      if (res.type === 'success' && res.status) {
        this.cookieService.set('cena', 'user-details');
        this.dialogRef.close();
        window.location.reload();
      }
      else{
        this._snackBar.open("Error occured at the time of adding User in mailchimp", "Cancel", {
          duration: 3000
        })
      }
    })
  }
}