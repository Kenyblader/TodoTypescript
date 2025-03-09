import { Task} from "./task.js";
import { openDatabase,addTaskBd,updateTask, updateSubTask } from "./local_store.js";
import { getTaskFromBd, saveTaskBd, Statut, stringToStatut, SubTask } from "./taskInterface.js";


document.addEventListener('DOMContentLoaded',()=>{
    openDatabase()
    const button=document.getElementById("submit") as HTMLButtonElement
    button.addEventListener("click",addTask)
})

function testDate(date:Date):boolean{
   return (date instanceof Date && !isNaN(date.getTime())) 
    ? true
    : false;
}

async function addTask():Promise<void> {
    let taskInput:HTMLInputElement = document.getElementById("task-name") as HTMLInputElement;
    let startInput:HTMLInputElement = document.getElementById("start-date") as HTMLInputElement;
    let endInput:HTMLInputElement = document.getElementById("due-date") as HTMLInputElement;
    let statusInput:HTMLSelectElement = document.getElementById("status") as HTMLSelectElement;
    let taskText:string = taskInput.value.trim();
    let startDate:Date=new Date(startInput.value)
    let endDate:Date=new Date(startInput.value)
    let status:Statut= stringToStatut(statusInput.value) as Statut

    if (taskText === "") return;
    if(!testDate(startDate)) return ;
    if(!testDate(endDate)) return ;
    
    let task:Task = new Task(Date.now(), taskText,startDate,endDate,status);
    let url= new URL (window.location.href)
    const isSubTask:boolean =url.searchParams.get('isSubTask') ==='true'
    console.log(isSubTask)
    if (isSubTask){
        const taskId:number= Number(url.searchParams.get('taskId'))
        let task=await getTaskFromBd(taskId)
        let subtask:SubTask={
            id:Date.now(),
            text:taskText,
            dateDebut:startDate,
            dateFin:endDate,
            statut:status
        }
        task.addSubtask(subtask)
        console.log(task)
        updateTask(taskId,task.toInterface())
        window.location.href='searchTask.html'
    }


    else if (!saveTaskBd(task))
    {
        alert("desoler erreur pendans la sauvegarde")
        return;
    }
    else{
        alert('sauvegerde reussit')
        taskInput.value = "";
        startInput.value="";
        endInput.value="";
        statusInput.value=Statut.new
    }
    
}


