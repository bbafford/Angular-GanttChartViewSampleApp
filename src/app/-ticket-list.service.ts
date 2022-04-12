import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { Ticket } from "./models/ticket.model";

@Injectable({providedIn:'root'})

export class TicketService{
    private tickets: Ticket ;
    private numTickets: number;
    private ticketsUpdated = new Subject<Ticket>();
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
        console.log("created obserable")
        return this.ticketsUpdated.asObservable()
    }



}