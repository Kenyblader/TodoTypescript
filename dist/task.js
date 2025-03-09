import { Statut } from "./taskInterface.js";
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
    toInterface() {
        return {
            id: this.id,
            text: this.text,
            dateDebut: this.dateDebut,
            dateFin: this.dateFin,
            dateFinReel: this.dateFinReel,
            statut: this.statut,
            subtask: this.subtasks
        };
    }
    nextStatus() {
        let curent = this.statut;
        switch (curent) {
            case Statut.new:
                this.statut = Statut.enCours;
                break;
            case Statut.enCours:
                this.statut = Statut.terminer;
                this.dateFinReel = new Date();
                console.log("creation" + this.dateFinReel);
                break;
            case Statut.terminer:
                this.statut = Statut.new;
                this.dateFinReel = undefined;
                console.log("destruction" + this.dateFinReel);
                break;
            default:
                console.error('aucun statut correspondant');
                break;
        }
    }
    getafficheStatut() {
        if (this.statut == Statut.terminer)
            return (this.dateFinReel instanceof Date && !isNaN(this.dateFinReel.getTime())) ? this.dateFinReel.toISOString().split('T')[0] : "";
        else
            return this.statut;
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
    editSubtask(id, text) {
        let item = this.subtasks.find(t => t.id === id);
        if (item == undefined)
            return false;
        item.text = text;
        return true;
    }
    changeStatusSubtask(id) {
        let item = this.subtasks.find(t => t.id === id);
        if (item == undefined)
            return;
        let curent = item.statut;
        switch (curent) {
            case Statut.new:
                item.statut = Statut.enCours;
                break;
            case Statut.enCours:
                item.statut = Statut.terminer;
                item.dateFinReel = new Date();
                console.log("creation" + item.dateFinReel);
                break;
            case Statut.terminer:
                item.statut = Statut.new;
                item.dateFinReel = undefined;
                console.log("destruction" + item.dateFinReel);
                break;
            default:
                console.error('aucun statut correspondant');
                break;
        }
    }
}
