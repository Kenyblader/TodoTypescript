export enum Statut{
    "new", "en court", "terminer"
}

export interface SubTask{
    id:number
    text:string
    dateDebut:Date
    dateFinReel?:Date
    dateFin:Date
    statut:Statut
}

export interface iTask{
 id:number
 text:string
 dateDebut:Date
 dateFinReel?:Date
 dateFin:Date
 subtask:SubTask[]
 statut:Statut
}

export function interfaceToTask(task:iTask):Task{
    return new Task(task.id,task.text,task.dateDebut,task.dateFin,task.statut,task.dateFinReel,task.subtask)
}

export class Task{
    private id:number
    private text:string
    private dateDebut:Date
    private dateFinReel?:Date
    private dateFin:Date
    private subtasks: SubTask[]
    private statut:Statut
    constructor(id:number, text:string,dateDebut:Date,dateFin:Date,statut?:Statut,dateFinReel?:Date ,subtask?:SubTask[]){
        this.id=id;
        this.text=text
        this.subtasks=subtask??[]
        this.dateFinReel=dateFinReel
        this.dateDebut=dateDebut
        this.dateFin=dateFin
        this.statut=statut??Statut.new  
    }

    
    public getId():number{
        return this.id
    }

    public getText():string {
        return this.text
    }

    public getSubTask():SubTask[]{
        return this.subtasks
    }

    public setText(text:string){
        this.text=text
    }

    public getDateDebut() : Date {
        return this.dateDebut; 
    }
    public getFin() : Date {
        return this.dateFin; 
    }
    public getDateFinReel() : Date|null {
        return this.dateFinReel??null; 
    }

    
    public getStatut() : Statut{
        return this.statut
    }
    
    
    public setStatut(v : Statut) {
        this.statut = v;
    }
    
    
  
    public addSubtask(task:SubTask):boolean {
        let item=this.subtasks.find(t=>t.id===task.id)
        
        if(item!=undefined)
            return false
        this.subtasks.push(task)
        return true
    }

    public deleteSubtask(id:number):boolean {
        let item=this.subtasks.find(t=>t.id===id)
        
        if(item==undefined)
            return false
        this.subtasks=this.subtasks.filter(st => st.id !== id)
        return true
    }


}