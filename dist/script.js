var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Task } from "./task.js";
import { openDatabase, updateTask } from "./local_store.js";
import { getTaskFromBd, saveTaskBd, Statut, stringToStatut } from "./taskInterface.js";
document.addEventListener('DOMContentLoaded', () => {
    openDatabase();
    const button = document.getElementById("submit");
    button.addEventListener("click", addTask);
});
function testDate(date) {
    return (date instanceof Date && !isNaN(date.getTime()))
        ? true
        : false;
}
function addTask() {
    return __awaiter(this, void 0, void 0, function* () {
        let taskInput = document.getElementById("task-name");
        let startInput = document.getElementById("start-date");
        let endInput = document.getElementById("due-date");
        let statusInput = document.getElementById("status");
        let taskText = taskInput.value.trim();
        let startDate = new Date(startInput.value);
        let endDate = new Date(startInput.value);
        let status = stringToStatut(statusInput.value);
        if (taskText === "")
            return;
        if (!testDate(startDate))
            return;
        if (!testDate(endDate))
            return;
        let task = new Task(Date.now(), taskText, startDate, endDate, status);
        let url = new URL(window.location.href);
        const isSubTask = url.searchParams.get('isSubTask') === 'true';
        console.log(isSubTask);
        if (isSubTask) {
            const taskId = Number(url.searchParams.get('taskId'));
            let task = yield getTaskFromBd(taskId);
            let subtask = {
                id: Date.now(),
                text: taskText,
                dateDebut: startDate,
                dateFin: endDate,
                statut: status
            };
            task.addSubtask(subtask);
            console.log(task);
            updateTask(taskId, task.toInterface());
            window.location.href = 'searchTask.html';
        }
        else if (!saveTaskBd(task)) {
            alert("desoler erreur pendans la sauvegarde");
            return;
        }
        else {
            alert('sauvegerde reussit');
            taskInput.value = "";
            startInput.value = "";
            endInput.value = "";
            statusInput.value = Statut.new;
        }
    });
}
