/**
 * =====================================================
 * SETTINGS PERSON MASTER MODULE
 * Complete CRUD Operations with IndexedDB Storage
 * =====================================================
 */

// Global Storage Instance
let personDB = null;

/**
 * Initialize IndexedDB for Permanent Storage
 */
function initializePersonDatabase() {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open('AgriTrackerDB', 1);

        dbRequest.onerror = () => reject(new Error('Failed to open IndexedDB'));

        dbRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create Person Store if it doesn't exist
            if (!db.objectStoreNames.contains('persons')) {
                const personStore = db.createObjectStore('persons', { keyPath: 'id' });
                personStore.createIndex('email', 'email', { unique: true });
                personStore.createIndex('mobileNumber', 'mobileNumber', { unique: true });
                personStore.createIndex('name', 'name', { unique: false });
                console.log('[SettingsPersonMaster] Person object store created');
            }
        };

        dbRequest.onsuccess = () => {
            personDB = dbRequest.result;
            console.log('[SettingsPersonMaster] IndexedDB initialized successfully');
            resolve(personDB);
        };
    });
}

/**
 * Get All Persons from Database
 */
function getAllPersons() {
    return new Promise((resolve, reject) => {
        const transaction = personDB.transaction(['persons'], 'readonly');
        const store = transaction.objectStore('persons');
        const request = store.getAll();

        request.onsuccess = () => {
            console.log('[SettingsPersonMaster] Retrieved all persons:', request.result);
            resolve(request.result);
        };

        request.onerror = () => reject(new Error('Failed to retrieve persons'));
    });
}

/**
 * Get Person by ID
 */
function getPersonById(id) {
    return new Promise((resolve, reject) => {
        const transaction = personDB.transaction(['persons'], 'readonly');
        const store = transaction.objectStore('persons');
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to retrieve person'));
    });
}

/**
 * Search Persons by Name
 */
function searchPersonsByName(searchTerm) {
    return getAllPersons().then(persons => {
        if (!searchTerm) return persons;
        
        const term = searchTerm.toLowerCase();
        return persons.filter(person => 
            person.name.toLowerCase().includes(term) ||
            person.email.toLowerCase().includes(term) ||
            person.mobileNumber.includes(searchTerm)
        );
    });
}

/**
 * Check if Email Exists (Duplicate Check)
 */
function checkEmailExists(email, excludeId = null) {
    return getAllPersons().then(persons => {
        return persons.some(person => 
            person.email.toLowerCase() === email.toLowerCase() && 
            person.id !== excludeId
        );
    });
}

/**
 * Check if Mobile Number Exists (Duplicate Check)
 */
function checkMobileExists(mobile, excludeId = null) {
    return getAllPersons().then(persons => {
        return persons.some(person => 
            person.mobileNumber === mobile && 
            person.id !== excludeId
        );
    });
}

/**
 * Add New Person
 */
function addPerson(personData) {
    return new Promise(async (resolve, reject) => {
        try {
            // Validation
            if (!personData.name || personData.name.trim() === '') {
                reject(new Error('Name is required'));
                return;
            }

            if (!personData.email || personData.email.trim() === '') {
                reject(new Error('Email is required'));
                return;
            }

            if (!personData.mobileNumber || personData.mobileNumber.trim() === '') {
                reject(new Error('Mobile number is required'));
                return;
            }

            // Email Format Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(personData.email)) {
                reject(new Error('Invalid email format'));
                return;
            }

            // Mobile Number Validation (10 digits)
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(personData.mobileNumber)) {
                reject(new Error('Mobile number must be 10 digits'));
                return;
            }

            // Check for Duplicate Email
            const emailExists = await checkEmailExists(personData.email);
            if (emailExists) {
                reject(new Error('Email already exists'));
                return;
            }

            // Check for Duplicate Mobile
            const mobileExists = await checkMobileExists(personData.mobileNumber);
            if (mobileExists) {
                reject(new Error('Mobile number already exists'));
                return;
            }

            // Create Person Object
            const person = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: personData.name.trim(),
                email: personData.email.trim().toLowerCase(),
                mobileNumber: personData.mobileNumber.trim(),
                address: personData.address ? personData.address.trim() : '',
                dateOfBirth: personData.dateOfBirth || '',
                role: personData.role || 'Farmer',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Store in IndexedDB
            const transaction = personDB.transaction(['persons'], 'readwrite');
            const store = transaction.objectStore('persons');
            const request = store.add(person);

            request.onsuccess = () => {
                console.log('[SettingsPersonMaster] Person added successfully:', person);
                resolve(person);
            };

            request.onerror = () => reject(new Error('Failed to add person'));
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Update Person
 */
function updatePerson(id, personData) {
    return new Promise(async (resolve, reject) => {
        try {
            // Validation
            if (!personData.name || personData.name.trim() === '') {
                reject(new Error('Name is required'));
                return;
            }

            if (!personData.email || personData.email.trim() === '') {
                reject(new Error('Email is required'));
                return;
            }

            if (!personData.mobileNumber || personData.mobileNumber.trim() === '') {
                reject(new Error('Mobile number is required'));
                return;
            }

            // Email Format Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(personData.email)) {
                reject(new Error('Invalid email format'));
                return;
            }

            // Mobile Number Validation
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(personData.mobileNumber)) {
                reject(new Error('Mobile number must be 10 digits'));
                return;
            }

            // Check for Duplicate Email (excluding current ID)
            const emailExists = await checkEmailExists(personData.email, id);
            if (emailExists) {
                reject(new Error('Email already exists'));
                return;
            }

            // Check for Duplicate Mobile (excluding current ID)
            const mobileExists = await checkMobileExists(personData.mobileNumber, id);
            if (mobileExists) {
                reject(new Error('Mobile number already exists'));
                return;
            }

            // Get existing person
            const existingPerson = await getPersonById(id);
            if (!existingPerson) {
                reject(new Error('Person not found'));
                return;
            }

            // Update Person Object
            const updatedPerson = {
                ...existingPerson,
                name: personData.name.trim(),
                email: personData.email.trim().toLowerCase(),
                mobileNumber: personData.mobileNumber.trim(),
                address: personData.address ? personData.address.trim() : '',
                dateOfBirth: personData.dateOfBirth || '',
                role: personData.role || 'Farmer',
                updatedAt: new Date().toISOString()
            };

            // Update in IndexedDB
            const transaction = personDB.transaction(['persons'], 'readwrite');
            const store = transaction.objectStore('persons');
            const request = store.put(updatedPerson);

            request.onsuccess = () => {
                console.log('[SettingsPersonMaster] Person updated successfully:', updatedPerson);
                resolve(updatedPerson);
            };

            request.onerror = () => reject(new Error('Failed to update person'));
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Delete Person
 */
function deletePerson(id) {
    return new Promise((resolve, reject) => {
        const transaction = personDB.transaction(['persons'], 'readwrite');
        const store = transaction.objectStore('persons');
        const request = store.delete(id);

        request.onsuccess = () => {
            console.log('[SettingsPersonMaster] Person deleted successfully:', id);
            resolve(true);
        };

        request.onerror = () => reject(new Error('Failed to delete person'));
    });
}

/**
 * Get Person Count
 */
function getPersonCount() {
    return new Promise((resolve, reject) => {
        const transaction = personDB.transaction(['persons'], 'readonly');
        const store = transaction.objectStore('persons');
        const request = store.count();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to get count'));
    });
}

/**
 * Export All Persons (for backup)
 */
function exportAllPersons() {
    return getAllPersons().then(persons => {
        const dataStr = JSON.stringify(persons, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `persons_${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        console.log('[SettingsPersonMaster] Persons exported successfully');
        return true;
    });
}

/**
 * Clear All Persons (Dangerous - Use with Caution)
 */
function clearAllPersons() {
    return new Promise((resolve, reject) => {
        const transaction = personDB.transaction(['persons'], 'readwrite');
        const store = transaction.objectStore('persons');
        const request = store.clear();

        request.onsuccess = () => {
            console.warn('[SettingsPersonMaster] All persons cleared');
            resolve(true);
        };

        request.onerror = () => reject(new Error('Failed to clear persons'));
    });
}

// Initialize Database on Script Load
document.addEventListener('DOMContentLoaded', () => {
    initializePersonDatabase()
        .then(() => {
            console.log('[SettingsPersonMaster] Database ready');
            // Trigger any pending initialization
            if (window.onSettingsPersonDatabaseReady) {
                window.onSettingsPersonDatabaseReady();
            }
        })
        .catch(error => {
            console.error('[SettingsPersonMaster] Database initialization failed:', error);
            showErrorMessage('Database initialization failed: ' + error.message);
        });
});

console.log('[SettingsPersonMaster] Module loaded successfully');
