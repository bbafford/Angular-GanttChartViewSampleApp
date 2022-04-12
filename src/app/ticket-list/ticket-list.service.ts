import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { Ticket } from "../models/ticket.model";
import { Milestones } from "../models/milestones.model";

@Injectable({providedIn:'root'})

export class TicketService{
    private tickets: Ticket ;
    private milestones: Milestones;
    private numTickets: number;
    private ticketsUpdated = new Subject<Ticket>();
    private milestonesUpdated = new Subject<Milestones>();

    constructor(private http:HttpClient){

    }
    getTickets(){
        console.log("getTickets")
        this.http.get<Ticket>('http://localhost:3000/tickets').subscribe((ticketData)=>{
            this.tickets = ticketData
            this.numTickets = ticketData.total
            this.ticketsUpdated.next(this.tickets);
            console.log(this.tickets)
        });

        return this.tickets;
    }
    getTicketUpdateListener() {
        console.log("created ticket obserable")
        return this.ticketsUpdated.asObservable()
    }

    getMilestones(){
        console.log("getMilestones")
        this.http.get<Milestones>('http://localhost:3000/milestones').subscribe((data)=>{
            this.milestones=data
            this.milestonesUpdated.next(this.milestones);
            console.log(this.tickets)
        });

        return this.milestones;
    }
    getMilestoneUpdateListener() {
        console.log("created milestones obserable")
        return this.milestonesUpdated.asObservable()
    }


}