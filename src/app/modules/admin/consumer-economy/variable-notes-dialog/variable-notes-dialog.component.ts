import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-variable-notes-dialog',
  templateUrl: './variable-notes-dialog.component.html',
  styleUrls: ['./variable-notes-dialog.component.scss']
})
export class VariableNotesDialogComponent implements OnInit, AfterViewInit {

  variableNotes;
  pageTitle: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<VariableNotesDialogComponent>) {
    if(data) {
      this.variableNotes = data.variableNotes;
      this.pageTitle = data.pageTitle;
      
    }
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const notes = document.getElementById('notes');
    const description = document.getElementById('description')
    notes.innerHTML = this.variableNotes.notes? this.variableNotes.notes:  '--';
    description.innerHTML = this.variableNotes.description? this.variableNotes.description : '--';
  }

  onClose() {
    this.dialogRef.close();
  }

}
