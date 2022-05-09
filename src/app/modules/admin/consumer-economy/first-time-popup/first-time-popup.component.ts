import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { OCCUPATIONS } from '../constant';

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
    isChecked: false
  }
  loading: boolean;
  occupations = OCCUPATIONS;

  constructor(public dialogRef: MatDialogRef<FirstTimePopupComponent>, private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  submitForm(): void {
    this.cookieService.set('cena', 'user-details')
    this.dialogRef.close();
  }

}
