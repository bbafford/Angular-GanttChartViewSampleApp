import { Component, Output, OnDestroy, OnInit,AfterViewInit  } from '@angular/core';
import GanttChartView = DlhSoft.Controls.GanttChartView;
import GanttChartItem = GanttChartView.Item;
import GanttChartSettings = GanttChartView.Settings;
import PredecessorItem = GanttChartView.PredecessorItem;
import { HttpClient } from '@angular/common/http';
import { StaffingService } from './staffing-list.service';
import { Subscription } from 'rxjs';
import { Staff } from '../models/staffing.model';

//angular material buttons
import {MatButtonModule} from '@angular/material/button';
import { PropertyRead } from '@angular/compiler';

@Component({
  selector: 'app-staffing-list',
  templateUrl: './staffing-list.component.html',
  styleUrls: ['./staffing-list.component.css']
})

export class StaffingListComponent implements OnInit,OnDestroy{
  
  onItemChanged: (item: GanttChartItem, propertyName: string, isDirect: boolean, isFinal: boolean) => void;
  
  testfunction(item: GanttChartItem, propertyName: string, isDirect: boolean, isFinal: boolean){
    console.log("testing")
  }
  
  title = 'GanttChartView sample';
  public items:GanttChartItem[]=[];
  public settings: GanttChartSettings;
  private gcv = DlhSoft.Controls.GanttChartView

  private ganttChartView;
  private http:HttpClient
  staffing: Staff[] = []
  staffingService: StaffingService
  private staffingSubs: Subscription
  
  constructor(ticketService: StaffingService, http:HttpClient) {
    this.staffingService = ticketService
    this.http = http
  }
  


  ngOnInit(): void {
 
    this.staffing = this.staffingService.getStaff();
    this.drawChart() 
      

    this.http.get<any>('http://localhost:3000/staffing').subscribe(data => {
    this.staffing = data
      console.log("staffing object", this.staffing.length, this.staffing)

      for(let i=0;i< this.staffing.length;i++){
        console.log("engineering ",i, this.staffing[i].engineer)
        this.items.push({ content: this.staffing[i].engineer,indentation: 0, start: new Date (2022,1,1,0)})
        

        for (let j=0;j<this.staffing[i].projects.length;j++) {
          console.log("projects", this.staffing[i].projects[j])
          this.items.push({ 
            content: this.staffing[i].projects[j].project,
            indentation: 1, 
            start: new Date(this.staffing[i].projects[j].start), 
            finish: new Date( this.staffing[i].projects[j].finish)})
        }
      }
      console.log("after items is setup: ", this.items)
     DlhSoft.Controls.GanttChartView.initialize(this.ganttChartView, this.items, this.settings).refresh;
      })      
    
    this.staffingSubs = this.staffingService.getTicketUpdateListener().subscribe((staffing:any) => {
     /*
      console.log("staffing object", this.staffing.length, this.staffing)

      for(let i=0;i< this.staffing.length;i++){
        console.log("engineering ", this.staffing[i].engineer)

        this.items.push({ content: this.staffing[i].engineer,indentation: 1, start: new Date (2022,1,1,0)})
        
       // for (let project of this.staffing[i].engineer.projects) {
       //   console.log("projects", project)
       //   this.items.push({ content: project.project,indentation: 2, start: project.start, finish: project.finish})
       // }
      }
      console.log("after items is setup: ", this.items)
     DlhSoft.Controls.GanttChartView.initialize(this.ganttChartView, this.items, this.settings).refresh;
    */
    });
  
    
  }


  setupItems(){
    
    console.log("before setup item", this.staffing)
    for(let engineer of this.staffing){
      console.log("engineering ", engineer)
      this.items.push({ content: engineer,indentation: 1, start: new Date (2022,1,1,0)})
      for (let project of engineer.projects) {
        console.log("projects", project)
        this.items.push({ content: project.project,indentation: 2, start: project.start, finish: project.finish})
      }
   }
   console.log("setup items:",this.items)
  }

  ngOnDestroy(): void {
    this.staffingSubs.unsubscribe();
    
  }
  drawChart(){

   // this.items.push(
   //   { content: 'VTA', indentation: 1, start: new Date(2022, 4, 1, 8), finish: new Date(2022, 5, 1, 12), assignmentsContent: 'Resource 2 [50%]'})
      /*
      { content: 'SAT Milestone', indentation: 2,  finish: new Date(2022, 4 , 12, 16), isMilestone:true },
      { content: 'Missolua', indentation: 1, start: new Date(2022, 4, 1, 8), finish: new Date(2022, 7, 1, 12)},
      { content: 'Brent Clayton' },
      { content: 'JTA', indentation: 1, start: new Date(2022, 4, 1, 8), finish: new Date(2022, 5, 1, 12)},
      { content: 'GRTC', indentation: 1, start: new Date(2022, 4, 1, 8), finish: new Date(2022, 7, 1, 12)},
      { content: 'XXXX', indentation: 1, start: new Date(2022, 4, 1, 8), finish: new Date(2022, 7, 1, 12)},
      { content: 'Nate G' },
      { content: 'PHX', indentation: 1, start: new Date(2022, 4, 1, 8), finish: new Date(2022, 7, 1, 12)},
      { content: 'Arnaud' },
      { content: 'BBB', indentation: 1, start: new Date(2022, 4, 1, 8), finish: new Date(2022, 7, 1, 12)},
      { content: 'Santa Cruz', indentation: 1, start: new Date(2022, 4, 1, 8), finish: new Date(2022, 7, 1, 12)},
    ];
    
/*
      { content: 'Pierce System Acceptance', indentation: 2,start: new Date(2020, 2 - 1, 16, 8), finish: new Date(2021,5 - 1, 16,8), isMilestone: true },
      { content: 'CloseOut', indentation: 2, finish: new Date(2021,5 - 1, 16,8), isMilestone: true }

      { content: 'Branded Responsive Website', indentation: 1, start: new Date(2020, 2 - 1, 11, 8), finish: new Date(2020, 2 - 1, 12, 12), completedFinish: new Date(2020, 2 - 1, 12, 12), assignmentsContent: 'Resource 1', baselineStart: new Date(2020, 2 - 1, 10, 8), baselineFinish: new Date(2016, 2 - 1, 11, 16) },
      { content: 'Pierce Branded Responsive Website part 1', indentation: 2, start: new Date(2020, 2 - 1, 12, 8), finish: new Date(2020, 2 - 1, 12, 16), assignmentsContent: 'Landon' },
      { content: 'Pierce Branded Responsive Website part 2', indentation: 2, start: new Date(2020, 5 - 1, 12, 8), finish: new Date(2020, 2 - 1, 12, 16), assignmentsContent: 'Landon' },
      
      { content: 'Story B' },
      { content: 'Task 3', indentation: 1, start: new Date(2020, 2 - 1, 15, 8), finish: new Date(2020, 2 - 1, 15, 16), completedFinish: new Date(2020, 2 - 1, 15, 12), assignmentsContent: 'Resource 2 [50%]'},
      { content: 'Task 4', indentation: 1, start: new Date(2020, 2 - 1, 15, 8), finish: new Date(2020, 2 - 1, 16, 16), assignmentsContent: 'Resource 2' },
      { content: 'Task 5', indentation: 1, start: new Date(2020, 2 - 1, 16, 8), finish: new Date(2020, 2 - 1, 17, 16) },
      { content: 'Task 6', indentation: 1, start: new Date(2020, 2 - 1, 16, 8), finish: new Date(2020, 2 - 1, 19, 16) }
      */
  //  ];
  //  items[2].predecessors = <PredecessorItem[]>[{item: items[1], dependencyType: 'StartStart' } ]
   // items[2].predecessors = <PredecessorItem[]>[{ item: items[1] }]; // Task 2 depends on Task 1.
   // items[7].predecessors = <PredecessorItem[]>[{ item: items[6], dependencyType: 'StartStart' }]; // Task 6 depends on Task 5 using Start-Start dependency type.
   // items[8].predecessors = <PredecessorItem[]>[{ item: items[0] }, { item: items[3] }]; // Milestone depends on Story A and Story B.

    //this.items = items;
    
    var settings = <GanttChartSettings>{
      // Auto-scheduling is initially turned on.
      areTaskDependencyConstraintsEnabled: true,

      // Other settings that you can enable and customize as needed in your application.
      // isGridVisible: false,
      // gridWidth: '30%',
      // chartWidth: '70%',
      // isGridReadOnly: true,
      // isChartReadOnly: true,
      // isVirtualizing: false,
      // isTaskEffortPreservedWhenStartChangesInGrid: true,
      // border: 'Gray',
      // gridLines: 'LightGray',
      // standardBarStyle: 'stroke: Green; fill: LightGreen',
      // standardCompletedBarStyle: 'stroke: DarkGreen; fill: DarkGreen',
      // dependencyLineStyle: 'stroke: Green; fill: none; marker-end: url(#ArrowMarker)',
      // alternativeItemStyle: 'background-color: #f9f9f9', alternativeChartItemStyle: 'fill: #f9f9f9',
      // itemTemplate: (item) => {
      //     var toolTip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      //     var toolTipContent = item.content + ' • ' + 'Start: ' + item.start.toLocaleString();
      //     if (!item.isMilestone)
      //         toolTipContent += ' • ' + 'Finish: ' + item.finish.toLocaleString();
      //     toolTip.appendChild(document.createTextNode(toolTipContent));
      //     return toolTip;
      // },
      currentTime: new Date(2022, 4 - 1, 12) // Display the current time vertical line of the chart at the project start date.
    };

    // Define schedule.
    // settings.schedule = {
    //      workingWeekStart: 1, workingWeekFinish: 5, // Monday - Friday
    //      visibleDayStart: 8 * 60 * 60 * 1000, visibleDayFinish: 16 * 60 * 60 * 1000 // 8 AM - 4 PM
    //      // , specialNonworkingDays: [new Date(2016, 2 - 1, 19), new Date(2016, 2 - 1, 21)] // excluded
    // };
    // var specialSchedule = <GanttChartView.Schedule>{
    //      workingWeekStart: 0, workingWeekFinish: 3, // Sunday - Wednesday
    //      workingDayStart: 9 * 60 * 60 * 1000, workingDayFinish: 19 * 60 * 60 * 1000 // 9 AM - 7 PM, exceeding visible 4 PM
    //      // , specialNonworkingDays: [new Date(2016, 2 - 1, 18), new Date(2016, 2 - 1, 21), new Date(2016, 2 - 1, 22)] // partial replacement for excluded dates
    // };
    // items[4].schedule = specialSchedule;
    // items[5].schedule = specialSchedule;

    // Configure selection.
    // settings.selectionMode = 'Extended'; // Supported values: None, Focus (default), Single, Extended, ExtendedFocus.
    // settings.selectedItemStyle = 'background: LightCyan';
    // items[6].isSelected = true;

    // Customize columns.
    var columns = GanttChartView.getDefaultColumns(this.items, settings);
    var indexOffset = columns[0].isSelection ? 1 : 0;
    // columns[0 + indexOffset].header = 'Work items';
    // columns[0 + indexOffset].width = 240;
    columns.splice(0 + indexOffset, 0, { header: '', width: 40, cellTemplate: GanttChartView.getIndexColumnTemplate() });
    columns.splice(3 + indexOffset, 0, { header: 'Effort (h)', width: 80, cellTemplate: GanttChartView.getTotalEffortColumnTemplate(64) });
    columns.splice(4 + indexOffset, 0, { header: 'Duration (d)', width: 80, cellTemplate: GanttChartView.getDurationColumnTemplate(64, 8) });
    columns.splice(8 + indexOffset, 0, { header: '%', width: 80, cellTemplate: GanttChartView.getCompletionColumnTemplate(64) });
    columns.splice(9 + indexOffset, 0, { header: 'Predecessors', width: 100, cellTemplate: GanttChartView.getPredecessorsColumnTemplate(84) });
    columns.push({ header: 'Cost ($)', width: 100, cellTemplate: GanttChartView.getCostColumnTemplate(84) });
    columns.push({ header: 'Est. start', width: 140, cellTemplate: GanttChartView.getBaselineStartColumnTemplate(124, true, true, 8 * 60 * 60 * 1000) }); // 8 AM
    columns.push({ header: 'Est. finish', width: 140, cellTemplate: GanttChartView.getBaselineFinishColumnTemplate(124, true, true, 16 * 60 * 60 * 1000) }); // 4 PM
    // items[7]['description'] = 'Custom description';
    // columns.push({ header: 'Description', width: 200, cellTemplate: (item) => { return item['ganttChartView'].ownerDocument.createTextNode(item['description']); } });
    // columns[10 + indexOffset].cellTemplate = GanttChartView.getAssignmentSelectorColumnTemplate(184, (item) { return ['Resource 1', 'Resource 2'] });
    // items[7]['targetDate'] = new Date(2016, 2 - 1, 28, 12, 0, 0);
    // columns.push({ header: 'Target date', width: 140, cellTemplate: (item)  => {
    //     return GanttChartView.datePickerInputColumnTemplateBase(item['ganttChartView'].ownerDocument, 140,
    //         function () { return GanttChartView.getInputDate(item['targetDate']); }, 
    //         function (value) { item['targetDate'] = GanttChartView.getOutputDate(value); }); } });
    settings.columns = columns;

    this.settings = settings;
    //var ganttChartView = document.querySelector('#ganttChartView');
   
    //this.gcv=DlhSoft.Controls.GanttChartView.initialize(ganttChartView, this.items, settings)
    //DlhSoft.Controls.GanttChartView.initialize(this.ganttChartView, this.items, settings).refresh;
    this.ganttChartView = document.getElementById("staffing-gnattViewChart") as HTMLImageElement
 
    this.onItemChanged = (item, propertyName, isDirect, isFinal) => {
      
      if (!isDirect || !isFinal) // Skip internal changes, and changes occurred during drag operations.
        return;
      console.log(propertyName + ' changed for ' + item.content + '.');
      switch (propertyName ){
          case 'start': {
            //index +1 gets you the entry within the table for the item we are updating.  Once 
            //the item is modified, we should push the change to a json object to 
            //enable a post to the json server to make the change.  For that, we'll need the ID from the engineering
            console.log(item.index)
          }
          case 'finish':{

          }
      }
    }
    
  }
}
