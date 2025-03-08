export var Statut;
(function (Statut) {
    Statut[Statut["new"] = 0] = "new";
    Statut[Statut["en court"] = 1] = "en court";
    Statut[Statut["terminer"] = 2] = "terminer";
})(Statut || (Statut = {}));
export function interfaceToTask(task) {
    return new Task(task.id, task.text, task.dateDebut, task.dateFin, task.statut, task.dateFinReel, task.subtask);
}
export class Task {
    constructor(id, text, dateDebut, dateFin, statut, dateFinReel, subtask) {
        this.id = id;
        this.text = text;
        this.subtasks = subtask !== null && subtask !== void 0 ? subtask : [];
        this.dateFinReel = dateFinReel;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut !== null && statut !== void 0 ? statut : Statut.new;
    }
    getId() {
        return this.id;
    }
    getText() {
        return this.text;
    }
    getSubTask() {
        return this.subtasks;
    }
    setText(text) {
        this.text = text;
    }
    getDateDebut() {
        return this.dateDebut;
    }
    getFin() {
        return this.dateFin;
    }
    getDateFinReel() {
        var _a;
        return (_a = this.dateFinReel) !== null && _a !== void 0 ? _a : null;
    }
    getStatut() {
        return this.statut;
    }
    setStatut(v) {
        this.statut = v;
    }
    addSubtask(task) {
        let item = this.subtasks.find(t => t.id === task.id);
        if (item != undefined)
            return false;
        this.subtasks.push(task);
        return true;
    }
    deleteSubtask(id) {
        let item = this.subtasks.find(t => t.id === id);
        if (item == undefined)
            return false;
        this.subtasks = this.subtasks.filter(st => st.id !== id);
        return true;
    }
}
