export interface Staff{
    engineer:string,
    projects:Project[]
}

export interface Project{
    project:string,
    start:Date,
    finish:Date,
    load:number
}