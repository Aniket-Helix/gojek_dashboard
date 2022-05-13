import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataFilterOptionsDialogComponent } from 'app/modules/admin/consumer-economy/data-filter-options-dialog/data-filter-options-dialog.component';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DataFilterOptionsDialogComponent>) { }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }
  
}
