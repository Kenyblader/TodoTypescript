import { Statut, stringToStatut } from "./taskInterface.js";
const dbName = 'taskDB';
const dbVersion = 1;
let db = null;
// Fonction pour ouvrir la base de données
export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Base de données ouverte avec succès');
            resolve(db);
        };
        request.onerror = (event) => {
            console.error('Erreur lors de l\'ouverture de la base de données', event.target.error);
            reject(event.target.error);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('tasks')) {
                const store = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
                store.createIndex('name', 'name', { unique: false });
                store.createIndex('due_date', 'due_date', { unique: false });
                store.createIndex('status', 'status', { unique: false });
                console.log('Object store "tasks" créé');
            }
        };
    });
}
// Fonction pour ajouter une tâche a la base de donne 
export function addTaskBd(task) {
    if (!db) {
        console.error('Base de données non ouverte');
        return false;
    }
    const transaction = db.transaction('tasks', 'readwrite');
    const store = transaction.objectStore('tasks');
    const request = store.add(task);
    request.onsuccess = () => {
        console.log('Tâche ajoutée avec succès');
        return true;
    };
    request.onerror = (event) => {
        console.error('Erreur lors de l\'ajout de la tâche', event.target.error);
        return false;
    };
    return true;
}
// Fonction pour récupérer toutes les tâches dans la base de donnee
export function getAllTasks() {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error('Base de données non ouverte');
            reject('Base de données non ouverte');
            return;
        }
        const transaction = db.transaction('tasks', 'readonly');
        const store = transaction.objectStore('tasks');
        const request = store.getAll(); // Récupère toutes les tâches
        request.onsuccess = (event) => {
            const tasks = event.target.result;
            // Transformer les tâches en iTask[]
            const formattedTasks = tasks.map((task) => {
                var _a;
                return ({
                    id: task.id,
                    text: task.text, // Assumant que 'name' dans IndexedDB correspond à 'text'
                    dateDebut: new Date(task.dateDebut),
                    dateFinReel: task.dateFinReel ? new Date(task.real_end_date) : undefined,
                    dateFin: new Date(task.dateFin),
                    subtask: task.subtask ? task.subtask.map((st) => {
                        var _a;
                        return ({
                            id: st.id,
                            text: st.text,
                            dateDebut: new Date(st.dateDebut),
                            dateFinReel: st.dateFinReel ? new Date(st.real_end_date) : undefined,
                            dateFin: new Date(st.dateFin),
                            statut: (_a = stringToStatut(st.statut)) !== null && _a !== void 0 ? _a : Statut.terminer
                        });
                    }) : [],
                    statut: (_a = stringToStatut(task.statut)) !== null && _a !== void 0 ? _a : Statut.terminer
                });
            });
            resolve(formattedTasks);
        };
        request.onerror = (event) => {
            console.error('Erreur lors de la récupération des tâches', event.target.error);
            reject('Erreur lors de la récupération des tâches');
        };
    });
}
// Fonction pour mettre à jour une tâche
export function updateTask(id, updatedTask) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('Base de données non ouverte');
            return;
        }
        const transaction = db.transaction('tasks', 'readwrite');
        const store = transaction.objectStore('tasks');
        // Récupérer la tâche existante pour la mise à jour partielle
        const getRequest = store.get(id);
        getRequest.onsuccess = (event) => {
            var _a;
            const existingTask = event.target.result;
            if (!existingTask) {
                reject("Tâche introuvable");
                return;
            }
            // Fusionner l'ancienne tâche avec les nouvelles données
            const updatedTaskData = Object.assign(Object.assign(Object.assign({}, existingTask), updatedTask), { dateDebut: updatedTask.dateDebut ? new Date(updatedTask.dateDebut) : existingTask.dateDebut, dateFinReel: updatedTask.dateFinReel ? new Date(updatedTask.dateFinReel) : existingTask.dateFinReel, dateFin: updatedTask.dateFin ? new Date(updatedTask.dateFin) : existingTask.dateFin, subtask: updatedTask.subtask ? updatedTask.subtask.map(st => (Object.assign(Object.assign({}, st), { dateDebut: new Date(st.dateDebut), dateFinReel: st.dateFinReel ? new Date(st.dateFinReel) : undefined, dateFin: new Date(st.dateFin), statut: st.statut }))) : existingTask.subtask, statut: (_a = updatedTask.statut) !== null && _a !== void 0 ? _a : existingTask.statut });
            console.log(updatedTaskData);
            // Mise à jour de la tâche dans IndexedDB
            const updateRequest = store.put(updatedTaskData);
            updateRequest.onsuccess = () => {
                console.log('Tâche mise à jour avec succès');
                resolve();
            };
            updateRequest.onerror = (event) => {
                console.error('Erreur lors de la mise à jour de la tâche', event.target.error);
                reject('Erreur lors de la mise à jour de la tâche');
            };
        };
        getRequest.onerror = (event) => {
            console.error('Erreur lors de la récupération de la tâche', event.target.error);
            reject('Erreur lors de la récupération de la tâche');
        };
    });
}
// Fonction pour mettre à jour une sous-tâche
export function updateSubTask(taskId, subTaskId, updatedSubTask) {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error('Base de données non ouverte');
            reject('Base de données non ouverte');
            return;
        }
        const transaction = db.transaction('tasks', 'readwrite');
        const store = transaction.objectStore('tasks');
        // Récupérer la tâche parent
        const getRequest = store.get(taskId);
        getRequest.onsuccess = (event) => {
            var _a;
            const existingTask = event.target.result;
            if (!existingTask) {
                console.error("Tâche introuvable");
                reject("Tâche introuvable");
                return;
            }
            // Trouver la sous-tâche à modifier
            const subTaskIndex = existingTask.subtask.findIndex(st => st.id === subTaskId);
            if (subTaskIndex === -1) {
                console.error("Sous-tâche introuvable");
                reject("Sous-tâche introuvable");
                return;
            }
            // Mettre à jour la sous-tâche avec les nouvelles données
            existingTask.subtask[subTaskIndex] = Object.assign(Object.assign(Object.assign({}, existingTask.subtask[subTaskIndex]), updatedSubTask), { dateDebut: updatedSubTask.dateDebut ? new Date(updatedSubTask.dateDebut) : existingTask.subtask[subTaskIndex].dateDebut, dateFinReel: updatedSubTask.dateFinReel ? new Date(updatedSubTask.dateFinReel) : existingTask.subtask[subTaskIndex].dateFinReel, dateFin: updatedSubTask.dateFin ? new Date(updatedSubTask.dateFin) : existingTask.subtask[subTaskIndex].dateFin, statut: (_a = updatedSubTask.statut) !== null && _a !== void 0 ? _a : existingTask.subtask[subTaskIndex].statut });
            // Sauvegarder la tâche mise à jour
            const updateRequest = store.put(existingTask);
            updateRequest.onsuccess = () => {
                console.log('Sous-tâche mise à jour avec succès');
                resolve();
            };
            updateRequest.onerror = (event) => {
                console.error('Erreur lors de la mise à jour de la sous-tâche', event.target.error);
                reject('Erreur lors de la mise à jour de la sous-tâche');
            };
        };
        getRequest.onerror = (event) => {
            console.error('Erreur lors de la récupération de la tâche', event.target.error);
            reject('Erreur lors de la récupération de la tâche');
        };
    });
}
// Fonction pour supprimer une tâche
export function deleteTaskBd(id) {
    if (!db) {
        console.error('Base de données non ouverte');
        return false;
    }
    const transaction = db.transaction('tasks', 'readwrite');
    const store = transaction.objectStore('tasks');
    const request = store.delete(id);
    request.onsuccess = () => {
        console.log('Tâche supprimée');
        return true;
    };
    request.onerror = (event) => {
        console.error('Erreur lors de la suppression de la tâche', event.target.error);
        return false;
    };
    return true;
}
