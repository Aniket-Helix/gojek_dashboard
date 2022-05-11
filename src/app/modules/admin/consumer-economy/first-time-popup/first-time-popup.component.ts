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
      const payload = {
        "email_address": this.userDetails.emailAddress,
        "status":"subscribed",
        "tags": ["Careers", "Events", "Newsletter"]
      }
      this._dashboardService.addUserToMailingList(payload).subscribe(res=> {
        if (res.type === 'success' && res.status) {
          this.cookieService.set('cena', 'user-details')
          this.dialogRef.close();
          this._snackBar.open("User added in mailchimp", "Cancel", {
            duration: 3000
          })
        }else{
          this._snackBar.open("Error occured at the time of adding User in mailchimp", "Cancel", {
            duration: 3000
          })
        }
      })
    }else{
      this._snackBar.open("Please provide Email", "Cancel", {
        duration: 3000
      })
    }
  }
}


