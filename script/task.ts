
import { validateHeaderName } from "http"
import { iTask, Statut, SubTask } from "./taskInterface.js"


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
    
    
    public toInterface():iTask {
        return {
            id:this.id,
            text:this.text,
            dateDebut:this.dateDebut,
            dateFin:this.dateFin,
            dateFinReel:this.dateFinReel,
            statut:this.statut,
            subtask:this.subtasks
        }
    }

     public nextStatus() {
        let curent=this.statut
        switch (curent) {
            case Statut.new:
                this.statut=Statut.enCours
                break;
            case Statut.enCours:
                this.statut=Statut.terminer
                this.dateFinReel= new Date()
                break;
            case Statut.terminer:
                this.statut=Statut.new
                this.dateFinReel=undefined
                break;
        
            default:
                console.error('aucun statut correspondant')
                break;
        }
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
