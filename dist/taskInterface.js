var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addTaskBd, getAllTasks } from "./local_store.js";
import { Task } from "./task.js";
export var Statut;
(function (Statut) {
    Statut["new"] = "new";
    Statut["enCours"] = "en cours";
    Statut["terminer"] = "terminer";
})(Statut || (Statut = {}));
export function stringToStatut(value) {
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
export function toTask(task) {
    return new Task(task.id, task.text, task.dateDebut, task.dateFin, task.statut, task.dateFinReel, task.subtask);
}
export function toTasks(itasks) {
    if (itasks === undefined)
        return [];
    let tasks = [];
    itasks.forEach(task => {
        tasks.push(toTask(task));
    });
    console.log(tasks);
    return tasks;
}
export function saveTaskBd(task) {
    let itask = task.toInterface();
    return addTaskBd(itask);
}
export function getAllTasksFromBd() {
    return __awaiter(this, void 0, void 0, function* () {
        let tasks = yield getAllTasks().then(tasks => {
            let ts = toTasks(tasks);
            return ts;
        })
            .catch(e => {
            console.log("erreur recuperation des taches " + e);
            return [];
        });
        return tasks;
    });
}
export function getTaskFromBd(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let tasks = yield getAllTasksFromBd();
        let task = tasks.find(tsk => tsk.getId() === id);
        return new Promise((resolve, reject) => {
            if (task === undefined) {
                reject("task not found");
            }
            else {
                resolve(task);
            }
        });
    });
}
