const dbName = 'taskDB';
const dbVersion = 1;
let db = null;
// Fonction pour ouvrir la base de données
function openDatabase() {
    const request = indexedDB.open(dbName, dbVersion);
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log('Base de données ouverte avec succès');
    };
    request.onerror = (event) => {
        console.error('Erreur lors de l\'ouverture de la base de données', event.target.error);
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
}
// Fonction pour ajouter une tâche
function addTask(task) {
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
    return false;
}
export {};
