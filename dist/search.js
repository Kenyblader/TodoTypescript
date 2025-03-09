var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { openDatabase, updateTask, deleteTaskBd } from "./local_store.js";
import { getAllTasksFromBd, getTaskFromBd } from "./taskInterface.js";
function valiDate(date) {
    return (date instanceof Date && !isNaN(date.getTime()))
        ? date.toISOString().split('T')[0]
        : "";
}
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    yield openDatabase();
    const searchBtn = document.getElementById("searchBtn");
    let tasks = yield getAllTasksFromBd();
    // Filtrer les tâches
    searchBtn.addEventListener("click", () => {
        const filterTypeInput = document.getElementById("filterType");
        const filterType = filterTypeInput.value;
        const filterValueInput = document.getElementById("filterValue");
        const filterValue = filterValueInput.value.toLowerCase();
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
}));
function displayTasks(filteredTasks) {
    const taskTableBody = document.querySelector("#taskTable tbody");
    taskTableBody.innerHTML = "";
    filteredTasks.forEach(task => {
        let taskRow = document.createElement("tr");
        taskRow.innerHTML = `
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
        let editButon = document.getElementById(`edit${task.getId()}`);
        let deleteButton = document.getElementById(`delete${task.getId()}`);
        let statusButton = document.getElementById(`statut${task.getId()}`);
        let addSunTaskButton = document.getElementById(`addSubtask${task.getId()}`);
        editButon.addEventListener("click", () => { editTask(task.getId()); });
        deleteButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () { yield deleteTask(task.getId()); }));
        statusButton.addEventListener('click', () => { changeStatus(task.getId()); });
        addSunTaskButton.addEventListener("click", () => { addSubTask(task.getId()); });
        // Ajouter les sous-tâches sous la tâche principale
        task.getSubTask().forEach(sub => {
            let subRow = document.createElement("tr");
            subRow.classList.add("subtask-row");
            subRow.innerHTML = `
                
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
            let editSubButon = document.getElementById(`edit${sub.id}`);
            let deleteSubButton = document.getElementById(`delete${sub.id}`);
        });
    });
}
// Fonctions pour actions
function editTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let newName = prompt("entrer le nouveau nom :");
        if (!newName) {
            console.error("nom vide");
            return;
        }
        ;
        let task = yield getTaskFromBd(id);
        task.setText(newName);
        yield updateTask(id, task.toInterface());
        let tasks = yield getAllTasksFromBd();
        displayTasks(tasks);
    });
}
function deleteTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let isOk = confirm("etes vous sur de supprimer cette tache");
        if (!isOk)
            return;
        let hasDelete = deleteTaskBd(id);
        if (!hasDelete)
            return;
        let tasks = yield getAllTasksFromBd();
        displayTasks(tasks);
    });
}
function changeStatus(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = yield getTaskFromBd(id);
        task.nextStatus();
        console.log(task);
        yield updateTask(id, task.toInterface());
        let tasks = yield getAllTasksFromBd();
        displayTasks(tasks);
    });
}
function addSubTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isSubTask = true;
        window.location.href = `index.html?isSubTask=${isSubTask}&taskId=${id}`;
    });
}
function editSubTask(id) {
    alert(`Modifier la sous-tâche ${id}`);
}
function deleteSubTask(id) {
    alert(`Supprimer la sous-tâche ${id}`);
}
