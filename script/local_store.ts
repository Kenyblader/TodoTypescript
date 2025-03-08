import { Task } from "./task.js"

const dbName = 'taskDB';
const dbVersion = 1;

let db: IDBDatabase | null = null;

// Fonction pour ouvrir la base de données
function openDatabase() {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = (event: Event) => {
        db = (event.target as IDBRequest).result;
        console.log('Base de données ouverte avec succès');
    };

    request.onerror = (event: Event) => {
        console.error('Erreur lors de l\'ouverture de la base de données', (event.target as IDBRequest).error);
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
}

// Fonction pour ajouter une tâche
function addTask(task: { name: string, due_date: string, status: string }):boolean {
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
    return false
}

