import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GanttChartView } from './DlhSoft/DlhSoft.ProjectData.GanttChart.Angular.Components';
import { ScheduleChartView } from './DlhSoft/DlhSoft.ProjectData.GanttChart.Angular.Components';
import { LoadChartView } from './DlhSoft/DlhSoft.ProjectData.GanttChart.Angular.Components';
import { PertChartView } from './DlhSoft/DlhSoft.ProjectData.PertChart.Angular.Components';
import { NetworkDiagramView } from './DlhSoft/DlhSoft.ProjectData.PertChart.Angular.Components';
import { HttpClientModule } from '@angular/common/http';
import { StaffingListComponent } from './staffing-list/staffing-list.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GanttChartView, ScheduleChartView, LoadChartView,
    PertChartView, NetworkDiagramView, StaffingListComponent, TicketListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
