import { Component, Output, OnDestroy, OnInit,AfterViewInit  } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { TicketService } from './ticket-list.service';
import { Subscription } from 'rxjs';

// imports for the Gantt chart control
import GanttChartView = DlhSoft.Controls.GanttChartView;
import GanttChartItem = GanttChartView.Item;
import GanttChartSettings = GanttChartView.Settings;
import PredecessorItem = GanttChartView.PredecessorItem;

//models
import { Ticket } from '../models/ticket.model';
import { Milestones } from '../models/milestones.model';
//import { isNull } from 'util';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit, OnDestroy {
  private http:HttpClient
  private tickets:Ticket
  private mapProgressbyMilestone = new Map();
  private mapMilestoneDates = new Map();
  private milestone:string
  private milestones:Milestones[] =[]
  private projects =[]  
  //Project milestones and the amount of expected work
  private itemsMilestones: GanttChartItem[]=[]
  private milestoneslist=[]

  title = 'Tickets and Milestones';
  private items:GanttChartItem[]=[];
  private settings: GanttChartSettings;
  private gcv = DlhSoft.Controls.GanttChartView
  onItemChanged: (item: GanttChartItem, propertyName: string, isDirect: boolean, isFinal: boolean) => void;
  
   
  ticketService: TicketService
  
  private ticketSubs: Subscription
  private milestoneSubs: Subscription

  constructor(ticketService: TicketService, http:HttpClient) {
    this.ticketService = ticketService
    this.http = http
  }
  
  ngOnInit() {
    
    this.configureSettings();

    this.projects = ["Pierce Transit - Lakewood, WA",
     "VTA - Santa Clara",
    "AC Transit - Oakland - California", 
    "WMATA - Washington DC Transit", 
    "METRA Transit -  Metropolitan Rail Corporation", 
    "CCB - Culver City", 
    "TTC - Toronto"
  ]

    this.getMilestoneHoursList();


  }

  getMilestoneHoursList(){
    this.http.get<Milestones[]>('http://localhost:3000/milestones').subscribe(data => {
      this.milestoneslist=data
      console.log("MILESTONE LIST: ", this.milestoneslist)
      this.drawTickets();
    });
  }

  drawTickets(){
    var localitems:GanttChartItem[]=[];
    var k;
    var milestoneDate:Date;
    const ganttChartView = document.getElementById("ganttChartView") as HTMLImageElement

    for (let i=0; i<this.projects.length; i++){

      //run through the list of projects, for each of the projects, query the server and pull down the tickets for that project.
      
      this.http.get<Ticket>('http://localhost:3001/tickets?customers='+this.projects[i]).subscribe(data => {
        //Clear the milestone list of before working on this project
        localitems = []
        this.mapProgressbyMilestone.clear()
        //push the project into the list of items for the map
        localitems.push({'content': this.projects[i], indentation: 0, start:new Date(2022,1,1)})
        
        this.tickets = data;
       // console.log("in ticket list:",data.issues)
        let running_total=0  
        //Get a list of time by project and milestone  
        //sum the projects by 
        for (let i=0; i < data.issues.length;i++){
             
          if ((data.issues[i].fields.customfield_15761) != null) {
            //get the milestone name
            this.milestone = data.issues[i].fields.customfield_15761[0].value
          } 
          else{
            this.milestone = "empty"
          }
          //find the estimated time required to complete the ticket
          let estimate = data.issues[i].fields.progress.total
          //find out if the set
          if(this.mapProgressbyMilestone.has(this.milestone)){
            running_total= this.mapProgressbyMilestone.get(this.milestone)
          }
          else{
            running_total=0
          }
          //console.log("ticket number:", data.issues[i].key, " estimate: ", estimate, " running totle:" , running_total)
          this.mapProgressbyMilestone.set(this.milestone,estimate+running_total)
        }
        console.log(this.mapProgressbyMilestone)
        
        console.log("about to hit setup milestones hours")
        //loop through the milesstones you've just created and add them to the map
        k=0;
  
        for (let entry of this.mapProgressbyMilestone.entries() ){
          //find the milestone date by looking throught milestone list and comparing the project and milestone to what we are looking at 
          //right now
  
          for(let j=0; j< this.milestoneslist.length;j++){
            console.log("milestone name: ",this.milestoneslist[j].milestone, " milestone project", this.milestoneslist[j].project)
  
            if (entry[0]==this.milestoneslist[j].milestone ||
                this.projects[i] == this.milestoneslist[j].project){
                  milestoneDate = this.milestoneslist[j].start
                  console.log("The Milestone date is:", milestoneDate)
                }   
          }
  
          k++;
         // console.log("entry is key: ", entry[0])  
         // console.log("entry is value: ", entry[1])  
          console.log(localitems)
          localitems.push({'content':entry[0], indentation: 1,start: milestoneDate, isMilestone:true})
          localitems[k]['hours'] =entry[1]/3600
  
        } 
        this.items = [...this.items, ...localitems]
        console.log("the combined array is", this.items)
  
        //this.setupMilestoneHours();
        DlhSoft.Controls.GanttChartView.initialize(ganttChartView, this.items, this.settings).refresh;
       });
      }
  }
  drawMilestoneIcons(){
    //build a list of unique projects first - prob a cleaner way of doing this using a lamba function and map...
    
    var projects = new Set();
    var p;
    var key;
    var values;

    console.log("drawMilestoneIcons: this.mapMilestoneDates",this.mapMilestoneDates)
    
    for (let entry of this.mapMilestoneDates.entries() ){
      console.log("entry is key: ", entry[0])  
      console.log("entry is value: ", entry[1])  
      if(projects.has(entry[0].project) == false){
        projects.add(entry[0].project)
      }
    }
    console.log("drawMilestoneIcons: projects set", projects)
    

    for (let p of projects.entries()){
      console.log("Looping through projects Set- project",p[0])
      this.itemsMilestones.push({'content': p[0], indentation: 0, start:new Date(2022,1,1)})
      for (let entry of this.mapMilestoneDates.entries()){
          console.log("drawMilestoneIcons - milestone loop",entry[0], " - ", entry[1])
          key = entry[0]
          values = entry[1]
          //console.log("key.project", key.project, " p", p[0], "valuation - ",key.project == p[0])
          if (key.project == p[0] ){
            console.log("actually in this if loop")
            this.itemsMilestones.push({'content': key.milestone, indentation: 1, start:new Date(key.start), finish:new Date(key.start),  isMilestone:true})
            this.itemsMilestones[this.itemsMilestones.length-1]['hours']=values
          }
        
        }
     }
     console.log("drawMilestoneIcons - after building items milestone list", this.itemsMilestones)
     const ganttChartView = document.getElementById("ganttChartView") as HTMLImageElement
     DlhSoft.Controls.GanttChartView.initialize(ganttChartView, this.itemsMilestones, this.settings).refresh;

  }
  
  setupMilestoneHours(){
 
    this.http.get<Milestones[]>('http://localhost:3000/milestones').subscribe(data => {
        this.milestones = data
        console.log(data)
        console.log("check the progress by milestone map",this.mapProgressbyMilestone )
        for (let i = 0; i<data.length;i++){
          console.log("milestone name", data[i].milestone)
          let m = data[i].milestone
          if (this.mapProgressbyMilestone.has(m)){
              this.mapMilestoneDates.set(data[i],this.mapProgressbyMilestone.get(data[i].milestone))
              console.log(this.mapMilestoneDates)
          }
          else{

          }
        }
          //draw the milestones on the chart and make it so when you hover over, it tells you the hours
      this.drawMilestoneIcons();
    });

  }
  getMilestoneHoursListener(){
    
  }

  configureSettings(){
    this.settings = {
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
       itemTemplate: (item) => {
           var toolTip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
           var toolTipContent = item.content + ' • ' + 'Start: ' + item.start.toLocaleString();
           if (!item.isMilestone)
               toolTipContent += ' • ' + 'Finish: ' + item.finish.toLocaleString();
           toolTip.appendChild(document.createTextNode(toolTipContent));
           return toolTip;
       },
      currentTime: new Date() // Display the current time vertical line of the chart at the project start date.
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
    var columns = GanttChartView.getDefaultColumns(this.items, this.settings);
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
    
     
    //this.items['description'] = 'Custom description';
     columns.push({ header: 'Description', width: 200, cellTemplate: (item) => { return item['ganttChartView'].ownerDocument.createTextNode(item['description']); } });
     columns.push({ header: 'hours', width: 200, cellTemplate: (item) => { return item['ganttChartView'].ownerDocument.createTextNode(item['hours']); } });
     //columns[10 + indexOffset].cellTemplate = GanttChartView.getAssignmentSelectorColumnTemplate(184, (item) { return ['Resource 1', 'Resource 2'] });
     //items[7]['targetDate'] = new Date(2016, 2 - 1, 28, 12, 0, 0);
     //columns.push({ header: 'Target date', width: 140, cellTemplate: (item)  => {
     //    return GanttChartView.datePickerInputColumnTemplateBase(item['ganttChartView'].ownerDocument, 140,
     //        function () { return GanttChartView.getInputDate(item['targetDate']); }, 
     //        function (value) { item['targetDate'] = GanttChartView.getOutputDate(value); }); } });
    this.settings.columns = columns;

    //var ganttChartView = document.querySelector('#ganttChartView');
    const ganttChartView = document.getElementById("ganttChartView") as HTMLImageElement
    //this.gcv=DlhSoft.Controls.GanttChartView.initialize(ganttChartView, this.items, settings)
    DlhSoft.Controls.GanttChartView.initialize(ganttChartView, this.items, this.settings).refresh;

    this.onItemChanged = (item, propertyName, isDirect, isFinal) => {
      if (!isDirect || !isFinal) // Skip internal changes, and changes occurred during drag operations.
        return;
      console.log(propertyName + ' changed for ' + item.content + '.' + item.index + item[propertyName] +'.');
    }
  }
  ngOnDestroy(): void {
    this.ticketSubs.unsubscribe();
    this.milestoneSubs.unsubscribe();
    
  }
}