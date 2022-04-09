import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { Staff } from "../models/staffing.model";

@Injectable({providedIn:'root'})

export class StaffingService{
    private staff: Staff[] =[] ;
    private numTickets: number;
    private ticketsUpdated = new Subject<Staff[]>();
    constructor(private http:HttpClient){

    }
    getStaff(){
        console.log("getStaff")
        this.http.get<Staff>('http://localhost:3000/staffing').subscribe((staffData:any)=>{
            this.staff = staffData
            this.ticketsUpdated.next(this.staff);
            console.log("from get staff",this.staff)

          
              
        });

        return this.staff;
    }
    getTicketUpdateListener() {
        console.log("created obserable staff")
        return this.ticketsUpdated.asObservable()
    }



}