import { exit } from "process";
import {iTask,SubTask, Statut, stringToStatut } from "./taskInterface.js"


const dbName = 'taskDB';
const dbVersion = 1;

let db: IDBDatabase | null = null;

// Fonction pour ouvrir la base de données
export  function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onsuccess = (event: Event) => {
            db = (event.target as IDBRequest).result as IDBDatabase;
            console.log('Base de données ouverte avec succès');
            resolve(db);
        };

        request.onerror = (event: Event) => {
            console.error('Erreur lors de l\'ouverture de la base de données', (event.target as IDBRequest).error);
            reject((event.target as IDBRequest).error);
        };

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBRequest).result;
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
export function addTaskBd(task: iTask):boolean {
    if (!db) {
        console.error('Base de données non ouverte');
        return false;
    }

    const transaction = db.transaction('tasks', 'readwrite');
    const store = transaction.objectStore('tasks');

    const request = store.add(task);

    request.onsuccess = () => {
        console.log('Tâche ajoutée avec succès');
        return true
    };

    request.onerror = (event: Event) => {
        console.error('Erreur lors de l\'ajout de la tâche', (event.target as IDBRequest).error);
        return false
    };
    return true
}

// Fonction pour récupérer toutes les tâches dans la base de donnee
export function getAllTasks(): Promise<iTask[]> {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error('Base de données non ouverte');
            reject('Base de données non ouverte');
            return;
            
        }

        const transaction = db.transaction('tasks', 'readonly');
        const store = transaction.objectStore('tasks');
        const request = store.getAll(); // Récupère toutes les tâches

        request.onsuccess = (event: Event) => {
            const tasks = (event.target as IDBRequest).result;
            
            // Transformer les tâches en iTask[]
            const formattedTasks: iTask[] = tasks.map((task: any) => ({
                id: task.id,
                text: task.text, // Assumant que 'name' dans IndexedDB correspond à 'text'
                dateDebut: new Date(task.dateDebut),
                dateFinReel: task.dateFinReel  ?? undefined,
                dateFin: new Date(task.dateFin),
                subtask: task.subtask ? task.subtask.map((st: any) => ({
                    id: st.id,
                    text: st.text,
                    dateDebut: new Date(st.dateDebut),
                    dateFinReel: st.dateFinReel   ? new Date(st.real_end_date) : undefined,
                    dateFin: new Date(st.dateFin),
                    statut: stringToStatut(st.statut)??Statut.terminer
                })) : [],
                statut: stringToStatut(task.statut)??Statut.terminer
            }));

            resolve(formattedTasks);
        };

        request.onerror = (event: Event) => {
            console.error('Erreur lors de la récupération des tâches', (event.target as IDBRequest).error);
            reject('Erreur lors de la récupération des tâches');
        };
    });
}

// Fonction pour mettre à jour une tâche
export function updateTask(id: number, updatedTask: iTask) {
    return new Promise<void>((resolve, reject) => {
        if (!db) {
            reject('Base de données non ouverte');
            return;
        }

        const transaction = db.transaction('tasks', 'readwrite');
        const store = transaction.objectStore('tasks');

        // Récupérer la tâche existante pour la mise à jour partielle
        const getRequest = store.get(id);

        getRequest.onsuccess = (event: Event) => {
            const existingTask: iTask = (event.target as IDBRequest).result;

            if (!existingTask) {
                reject("Tâche introuvable");
                return;
            }
            // Fusionner l'ancienne tâche avec les nouvelles données
            const updatedTaskData: iTask = {
                ...existingTask,
                ...updatedTask,
                dateDebut: updatedTask.dateDebut ? new Date(updatedTask.dateDebut) : existingTask.dateDebut,
                dateFinReel: updatedTask.dateFinReel ? new Date(updatedTask.dateFinReel) : existingTask.dateFinReel,
                dateFin: updatedTask.dateFin ? new Date(updatedTask.dateFin) : existingTask.dateFin,
                subtask: updatedTask.subtask ? updatedTask.subtask.map(st => ({
                    ...st,
                    dateDebut: new Date(st.dateDebut),
                    dateFinReel: st.dateFinReel ? new Date(st.dateFinReel) : undefined,
                    dateFin: new Date(st.dateFin),
                    statut: st.statut
                })) : existingTask.subtask,
                statut: updatedTask.statut ?? existingTask.statut
            };
            console.log(updatedTaskData)

            // Mise à jour de la tâche dans IndexedDB
            const updateRequest = store.put(updatedTaskData);

            updateRequest.onsuccess = () => {
                console.log('Tâche mise à jour avec succès');
                resolve();
            };

            updateRequest.onerror = (event: Event) => {
                console.error('Erreur lors de la mise à jour de la tâche', (event.target as IDBRequest).error);
                reject('Erreur lors de la mise à jour de la tâche');
            };
        };

        getRequest.onerror = (event: Event) => {
            console.error('Erreur lors de la récupération de la tâche', (event.target as IDBRequest).error);
            reject('Erreur lors de la récupération de la tâche');
        };
    });
}

// Fonction pour mettre à jour une sous-tâche
export function updateSubTask(taskId: number, subTaskId: number, updatedSubTask: SubTask) {
    return new Promise<void>((resolve, reject) => {
        if (!db) {
            console.error('Base de données non ouverte');
            reject('Base de données non ouverte');
            return;
        }

        const transaction = db.transaction('tasks', 'readwrite');
        const store = transaction.objectStore('tasks');

        // Récupérer la tâche parent
        const getRequest = store.get(taskId);

        getRequest.onsuccess = (event: Event) => {
            const existingTask: iTask = (event.target as IDBRequest).result;

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
            existingTask.subtask[subTaskIndex] = {
                ...existingTask.subtask[subTaskIndex],
                ...updatedSubTask,
                dateDebut: updatedSubTask.dateDebut ? new Date(updatedSubTask.dateDebut) : existingTask.subtask[subTaskIndex].dateDebut,
                dateFinReel: updatedSubTask.dateFinReel ? new Date(updatedSubTask.dateFinReel) : existingTask.subtask[subTaskIndex].dateFinReel,
                dateFin: updatedSubTask.dateFin ? new Date(updatedSubTask.dateFin) : existingTask.subtask[subTaskIndex].dateFin,
                statut: updatedSubTask.statut ?? existingTask.subtask[subTaskIndex].statut
            };

            // Sauvegarder la tâche mise à jour
            const updateRequest = store.put(existingTask);

            updateRequest.onsuccess = () => {
                console.log('Sous-tâche mise à jour avec succès');
                resolve();
            };

            updateRequest.onerror = (event: Event) => {
                console.error('Erreur lors de la mise à jour de la sous-tâche', (event.target as IDBRequest).error);
                reject('Erreur lors de la mise à jour de la sous-tâche');
            };
        };

        getRequest.onerror = (event: Event) => {
            console.error('Erreur lors de la récupération de la tâche', (event.target as IDBRequest).error);
            reject('Erreur lors de la récupération de la tâche');
        };
    });
}


// Fonction pour supprimer une tâche
export function deleteTaskBd(id: number):boolean {
    if (!db) {
        console.error('Base de données non ouverte');
        return false;
    }

    const transaction = db.transaction('tasks', 'readwrite');
    const store = transaction.objectStore('tasks');

    const request = store.delete(id);

    request.onsuccess = () => {
        console.log('Tâche supprimée');
        return true
    };

    request.onerror = (event: Event) => {
        console.error('Erreur lors de la suppression de la tâche', (event.target as IDBRequest).error);
        return false
    };

    return true
}


