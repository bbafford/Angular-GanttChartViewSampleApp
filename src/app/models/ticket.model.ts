export interface Ticket {
    total:number,
    issues:Issue[]

}
export interface Issue{
    key:string
    fields:Field
}
interface Field{
    summary:string,
    progress:Progress,
    customfield_15761:Milestones[]
}

interface Progress{
    progress:number,
    total:number
}
interface Milestones{
    self:string,
    value:string,
    id: number
}