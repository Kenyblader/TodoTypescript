import { rejects } from "assert";
import { addTaskBd, getAllTasks } from "./local_store.js";
import { Task } from "./task.js";

export enum Statut{
    new="new", enCours="en cours", terminer="terminer"
}

export function stringToStatut(value: string): Statut | null {
    switch (value) {
        case Statut.new:
            return Statut.new;
        case Statut.enCours:
            return Statut.enCours;
        case Statut.terminer:
            return Statut.terminer;
        default:
            return null; // ou une autre valeur par défaut
    }
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

export function toTask(task:iTask):Task{
    return new Task(task.id,task.text,task.dateDebut,task.dateFin,task.statut,task.dateFinReel,task.subtask)
}

export function toTasks(itasks:iTask[]):Task[]{
    if (itasks===undefined)
        return []
    let tasks:Task[]=[]
    itasks.forEach(task=>{
        tasks.push(toTask(task))
    })
    console.log(tasks)
    return tasks
}

export function saveTaskBd(task:Task):boolean{
    let itask= task.toInterface()
    return addTaskBd(itask);
}
export async function getAllTasksFromBd():Promise<Task[]>{

     let tasks=await getAllTasks().then(tasks=>{
        let ts=toTasks(tasks)
        return ts})
                .catch(e=>{ 
                    console.log("erreur recuperation des taches "+e)
                    return []
                })
                return tasks
}

export async function getTaskFromBd(id:number):Promise<Task>{

    let tasks= await getAllTasksFromBd()
    let task=tasks.find(tsk=> tsk.getId()===id )
    return new Promise((resolve,reject)=>{
        if(task===undefined){
            reject("task not found")
        }
        else{
            resolve(task)
        }
    })
    

}