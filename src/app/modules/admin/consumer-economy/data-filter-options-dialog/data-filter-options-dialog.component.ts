import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-data-filter-options-dialog',
  templateUrl: './data-filter-options-dialog.component.html',
  styleUrls: ['./data-filter-options-dialog.component.scss']
})
export class DataFilterOptionsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DataFilterOptionsDialogComponent>) { }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }
}
