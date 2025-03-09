import { Task } from "./task.js";
import { openDatabase,addTaskBd,updateTask, getAllTasks, deleteTaskBd } from "./local_store.js";
import { getAllTasksFromBd, getTaskFromBd, iTask, Statut, stringToStatut } from "./taskInterface.js";

function valiDate(date:Date):string{
    return (date instanceof Date && !isNaN(date.getTime())) 
     ? date.toISOString().split('T')[0]
     : "";
 }

document.addEventListener("DOMContentLoaded",  async () => {
    await openDatabase()
    const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
    let tasks:Task[]= await getAllTasksFromBd();

    // Filtrer les tâches
    searchBtn.addEventListener("click", () => {
        const filterTypeInput = document.getElementById("filterType") as HTMLInputElement;
        const filterType=filterTypeInput.value
        const filterValueInput = document.getElementById("filterValue") as HTMLInputElement
        const filterValue=filterValueInput.value.toLowerCase();

        let filteredTasks = tasks.filter(task => {
            if (filterType === "name") {
                return task.getText().toLowerCase().includes(filterValue);
            }
            if (filterType === "dateDebut") {
                return task.getDateDebut().toISOString().split('T')[0] === filterValue;
            }
            if (filterType === "statut") {
                return task.getStatut().toLowerCase() === filterValue;
            }
            return true;
        });

        displayTasks(filteredTasks);
    });

    displayTasks(tasks);
});

function displayTasks(filteredTasks:Task[]) {
    const taskTableBody = document.querySelector("#taskTable tbody") as HTMLTableElement;
    taskTableBody.innerHTML = "";

    filteredTasks.forEach(task => {
        let taskRow=document.createElement("tr")
         taskRow.innerHTML= `
            <tr>
                <td>${task.getText()}</td>
                <td>${valiDate(task.getDateDebut())}</td>
                <td>${valiDate(task.getFin())}</td>
                <td>${task.getStatut()}</td>
                <td>
                    <button class="edit-btn" id="edit${task.getId()}" >✏️</button>
                    <button class="delete-btn" id="delete${task.getId()}" >🗑️</button>
                    <button class="status-btn" id="statut${task.getId()}" >🔄 change status</button>
                    <button class="add-subtask-btn" id="addSubtask${task.getId()}" >➕ Sous-Tâche</button>
                </td>
            </tr>
        `;

        taskTableBody.appendChild(taskRow);
        let editButon=document.getElementById(`edit${task.getId()}`) as HTMLButtonElement
        let deleteButton=document.getElementById(`delete${task.getId()}`) as HTMLButtonElement
        let statusButton=document.getElementById(`statut${task.getId()}`) as HTMLButtonElement
        let addSunTaskButton=document.getElementById(`addSubtask${task.getId()}`) as HTMLButtonElement
        editButon.addEventListener("click",()=>{editTask(task.getId())})
        deleteButton.addEventListener("click",async ()=>{await deleteTask(task.getId())})
        statusButton.addEventListener('click',()=>{ changeStatus(task.getId())})
        addSunTaskButton.addEventListener("click",()=>{addSubTask(task.getId())})
        // Ajouter les sous-tâches sous la tâche principale
        task.getSubTask().forEach(sub => {
            let subRow=document.createElement("tr")
            subRow.classList.add("subtask-row")
             subRow.innerHTML= `
                
                    <td>↳ ${sub.text}</td>
                    <td>${sub.dateDebut.toISOString().split('T')[0]}</td>
                      <td>${sub.dateFin.toISOString().split('T')[0]}</td>
                    <td>${sub.statut}</td>
                    <td>
                        <button class="edit-btn" id="edit${sub.id}" onclick="editSubTask(${sub.id})">✏️</button>
                        <button class="delete-btn" id="delete${sub.id}" onclick="deleteSubTask(${sub.id})">🗑️</button>
                        <button class="status-btn" id="statut${task.getId()}" >🔄Change status</button>
                    </td>
                </tr>
            `;
            taskTableBody.appendChild(subRow);
            let editSubButon=document.getElementById(`edit${sub.id}`) as HTMLButtonElement
            let deleteSubButton=document.getElementById(`delete${sub.id}`) as HTMLButtonElement
        });
    });
}

// Fonctions pour actions
async function editTask(id:number) {
    let newName=prompt("entrer le nouveau nom :") as string
    if (!newName){
        console.error("nom vide")
        return};
    let task= await getTaskFromBd(id)
    task.setText(newName)
    await updateTask(id,task.toInterface())
    let tasks= await getAllTasksFromBd()
    displayTasks(tasks)
}

async function deleteTask(id:number) {
    let isOk=confirm("etes vous sur de supprimer cette tache")
    if(!isOk) return;
    let hasDelete=deleteTaskBd(id)
    if (!hasDelete) return;
    let tasks:Task[]= await getAllTasksFromBd();
    displayTasks(tasks)
}

async function changeStatus(id:number) {
    let task=await getTaskFromBd(id)
    task.nextStatus()
    console.log(task)
    await updateTask(id,task.toInterface())
    let tasks= await getAllTasksFromBd()
    displayTasks(tasks)
}

async function addSubTask(id:number) {
    const isSubTask=true
    window.location.href= `index.html?isSubTask=${isSubTask}&taskId=${id}`
}

function editSubTask(id:number) {
    alert(`Modifier la sous-tâche ${id}`);
}

function deleteSubTask(id:number) {
    alert(`Supprimer la sous-tâche ${id}`);
}
