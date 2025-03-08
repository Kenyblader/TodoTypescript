import { Task } from "./task.js";
import { saveTasks,getTasks } from "./local_store.js";

document.addEventListener("DOMContentLoaded", loadTodo); 

function addTask():void {
    let taskInput:HTMLInputElement = document.getElementById("taskInput") as HTMLInputElement;
    let taskText:string = taskInput.value.trim();

    if (taskText === "") return;

    let tasks:Task[] = getTasks();
    if (tasks.some(task => task.getText() === taskText)) {
        taskInput.value=""
        alert(`la tache ${taskText} existe deja`)
        return;
    }
    
    let task:Task = new Task(Date.now(), taskText);

    tasks.push(task);
    saveTasks(tasks);

    taskInput.value = "";
    renderTasks();
}

function renderTasks() {
    let taskList = document.getElementById("taskList") as HTMLElement;
    taskList.innerHTML = "";

    let tasks:Task[] = getTasks();
    tasks.forEach(task => {
        let taskElement = document.createElement("li");
        taskElement.classList.add("task");
        taskElement.setAttribute("id", task.getText());
        taskElement.innerHTML = `
            <span>${task.getText()}</span>
            <div class="actions">
                <button id="${task.getText()}" name="edit-btn" onclick="editTask(${task.getId()})">✏️</button>
                <button id="${task.getText()}" name="delete" onclick="deleteTask(${task.getId()})">🗑️</button>
                <button onclick="addSubtask(${task.getId()})">➕ Sous-Tâche</button>
            </div>
            <ul class="subtasks" id="subtasks-${task.getId()}"></ul>
        `;
        taskList.appendChild(taskElement)
        renderSubtasks(task.getId(), task.getSubTask());
    });
}

function ifExistTask(text:string){
    let tasks:Task[]=getTasks()
    tasks.forEach(element => {
        console.log(element.getText())
        if (element.getText()===text){
            console.log(text)
            return false
        }
    });
    return true
}

function editTask(taskId:number) {
    let tasks = getTasks();
    let task = tasks.find(t => t.getId() === taskId) ;
    if(task=== undefined)
        return;
    let newText = prompt("Modifier la tâche :", task.getText()) as string;
    newText= newText.trim()
    if(newText=="" )
        alert("une tache ne peut pas etre vide")
    else if (! ifExistTask(newText)){
        alert("cette tache existe deja")
        return ;
    }
    if (newText) {
        task.setText(newText)  ;
        saveTasks(tasks);
        renderTasks();
    }
}

function deleteTask(taskId:number) {
    let alt=confirm("etes vous sure de supprimer cette tache")
    if(alt){
        let tasks = getTasks().filter(t => t.getId() !== taskId);
        saveTasks(tasks);
        renderTasks();
    }
}

function addSubtask(taskId:number) {
    let subtaskText = prompt("Ajouter une sous-tâche :");
    if (!subtaskText) return;

    let tasks = getTasks();
    let task = tasks.find(t => t.getId() === taskId);
    if(task===undefined)
        return

    let hasAdd:boolean=task.addSubtask(new Task(Date.now(), subtaskText ));
    if(!hasAdd){
        return;
    }
    saveTasks(tasks);
    renderTasks();
}

function renderSubtasks(taskId:number, subtasks:Task[]) {
    console.log(taskId)
    let subtaskList = document.getElementById(`subtasks-${taskId}`) as HTMLElement;
    subtaskList.innerHTML = ""; 
    subtasks.forEach(subtask => {
    let subtaskElement = document.createElement("li");

        subtaskElement.innerHTML = `
            <span>${subtask.getText()}</span>
            <button onclick="editSubtask(${taskId}, ${subtask.getId()})">✏️</button>
            <button onclick="deleteSubtask(${taskId}, ${subtask.getId()})">🗑️</button>
        `;

        subtaskList.appendChild(subtaskElement);
    });
}

function editSubtask(taskId:number, subtaskId:number) {
    let tasks = getTasks();
    let task = tasks.find(t => t.getId() === taskId);
    if (task===undefined)
        return
    let subtask = task.getSubTask().find(st => st.getId() === subtaskId);
    if (subtask===undefined)
        return
    let newText = prompt("Modifier la sous-tâche :", subtask.getText());
    if (newText) {
        subtask.setText(newText) ;
        saveTasks(tasks);
        renderTasks();
    }
}

function deleteSubtask(taskId:number, subtaskId:number) {
    let tasks = getTasks();
    let task = tasks.find(t => t.getId() === taskId);
    if (task===undefined)
        return
    let subtask = task.getSubTask().find(st => st.getId() === subtaskId);
    if (subtask===undefined)
        return
    let alt=confirm("etes vous sure de supprimer cette sous tache")
    if(alt){
        let hasDelete:boolean=task.deleteSubtask(subtaskId)
        saveTasks(tasks);
        renderTasks();
    }
}

function loadTodo() {
    renderTasks();
}
