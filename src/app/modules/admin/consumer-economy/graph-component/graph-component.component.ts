import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlotlyService } from 'angular-plotly.js';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { CookieService } from 'ngx-cookie-service';
import { ReportUtils } from '../common-report-util';
import { REGIONS } from '../constant';
import { DataFilterOptionsDialogComponent } from '../data-filter-options-dialog/data-filter-options-dialog.component';
import { FirstTimePopupComponent } from '../first-time-popup/first-time-popup.component';
import { DashboardService } from '../services/analytics.service';
import { VariableNotesDialogComponent } from '../variable-notes-dialog/variable-notes-dialog.component';

@Component({
  selector: 'app-graph-component',
  templateUrl: '../report-template.html',
  styleUrls: ['../report-template.scss']
})
export class GraphComponentComponent extends ReportUtils implements OnInit {
  defaultRegion = 'national';
  regions = REGIONS;
  pageTitle = 'Component';
  variableNotes: any;

  constructor(
    private _dashboardService: DashboardService,
    private _navigationService: NavigationService,
    public plotlyService: PlotlyService,
    public matDialog: MatDialog,
    public _snackBar: MatSnackBar,
    private cookieService: CookieService) {
      super(plotlyService, matDialog, _snackBar);
      if(!this.userCookie) {
        //show first time pop up.
        this.showFirstTimePopup();
      }
    }

  ngOnInit(): void {
    this._navigationService.currentActiveRoute.subscribe((routeDetails) => {
      this.varId = routeDetails.var_id;
      this.pageTitle = routeDetails.title;
      if(this.varId) {
        this.getVariableNotes();
        this.getReportData();
      }
    })
  }

  getReportData() {
    var creditNote = 'Source: --'
    this.loading = true;
    this._dashboardService.getData(this.varId).subscribe(res => {
      if (res.type === 'success' && res.data && Object.keys(res.data).length > 0) {
        this.graphData = res.data;
        creditNote = this.variableNotes["credits"] != undefined ? `Source: ${this.variableNotes["credits"]}` : creditNote      
        this._prepareChartData({}, this.graphData?.unit, 'Date', this.pageTitle, creditNote);
        const { x, y } = res.data;
        this.chartConfig.name = this.graphData.unit;
        this.graph.data.push({x,y, ...this.chartConfig});
        this.availableFilters = [];
        this.selectedFilters = {};
        this._prepareFilters(res.data);
      }
      else{
        this.loading = false;
        this._snackBar.open(res.message, 'Cancel');
      }
    });
  }

  getVariableNotes() {
    this._dashboardService.getVariableNotes(this.varId).subscribe(res=> {
      if (res.type === 'success' && res.data) {
        this.variableNotes = res.data;
      }
    })
  }

  showVariableNotes(): any {
    this.matDialog.open(VariableNotesDialogComponent, {
        width: '70%',
        data: {pageTitle: this.pageTitle, variableNotes: this.variableNotes},
    });
  }

  showFirstTimePopup(): any {
    this.matDialog.open(FirstTimePopupComponent, {
      width: '70%',
      disableClose: true
    })
  }

  showDataFilterOptionsDialog(): any{
    this.matDialog.open(DataFilterOptionsDialogComponent,{
      width: '30%',
      position: {top: '60px'},
      panelClass: "custom-color"
    })
  }

  _prepareFilters(data) {
    const dates = (data.x || []).map((x) => new Date(x));
    this.filters.maxDate = new Date(Math.max.apply(null, dates));
    this.filters.selectedMaxDate = new Date(Math.max.apply(null, dates));
    this.filters.minDate = new Date(Math.min.apply(null, dates));
    this.filters.selectedMinDate = new Date(Math.min.apply(null, dates));
    if(JSON.stringify(this.graphData?.type[0]) === '{}' || this.graphData?.type[0] === null) {
        delete this.graphData.type;
        this.loading = false;
    }
    else {
      this.showDataFilterOptionsDialog();
      const objKeys = Object.keys(this.graphData.type[0])
      for (let i = 0; i < objKeys.length; i++) {
        this.selectedFilters[objKeys[i]] = this.graphData.type[0][objKeys[i]];
      }
      let keys = Object.keys(this.selectedFilters);
      let parsedFilters = {};
      keys.forEach((key) => {
        parsedFilters[key] = [this.selectedFilters[key]]
      })
      if(this.varId == 23){
        parsedFilters["Data"] = ["Tag Issuance"] 
        this.selectedFilters ={Data: 'Tag Issuance'} 
      }
      this._dashboardService.getFilteredData(parsedFilters, this.varId).subscribe((res) => {
        if (res.type === 'success' && res.data && Object.keys(res.data).length > 0){
          this.graph.data = [];
          this.graphData.x = res.data.x;
          this.graphData.y = res.data.y;
          let hovertemplate = `%{y}`
          const { x, y } = res.data;
          let name = '';
          const keys = Object.keys(this.selectedFilters);
          keys.forEach((key) => {
            if (name != '') {
              name += ', '
            }
            name += `${key} : ${this.selectedFilters[key]}`
          })
          if (name.length > 80) {
            name = name.substring(0, 50) + '<br>' + name.substring(50, name.length);
          }
          this.graph.data.push({ x, y, name, hovertemplate });
          this.loading = false;
        }else{
          this.loading = false;
        }
      })
      this.graphData.type.forEach(x => {
          if(!this.availableFilters.some(y => JSON.stringify(y) === JSON.stringify(x))){
            this.availableFilters.push(x)
          }
      })
    }
  }

  get userCookie() {
    return this.cookieService.get('cena')
  }
}
