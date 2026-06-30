/* ==========================
Person Master - Supabase CRUD Logic
========================= */

// Global state
let personMasterState = {
    persons: [],
    filteredPersons: [],
    currentEditId: null,
    isLoading: false,
    currentUserId: null
};

/* ==========================
Session Validation
========================= */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (!window.supabaseClient) {
            showToast("Error: Supabase client not initialized", "error");
            return;
        }

        const { data: { session } } = await window.supabaseClient.auth.getSession();
        
        if (!session) {
            window.location.replace("logincard.html");
            return;
        }

        personMasterState.currentUserId = session.user.id;
        console.log("Logged In User:", session.user.email);
        
        // Load persons after authentication
        await loadPersons();
        
    } catch (error) {
        console.error("Session Error:", error);
        showToast("Session error. Please login again.", "error");
        window.location.replace("logincard.html");
    }
});

/* ==========================
Load All Persons
========================= */

async function loadPersons() {
    try {
        personMasterState.isLoading = true;
        showLoadingState();
        
        const { data, error } = await window.supabaseClient
            .from('persons')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        personMasterState.persons = data || [];
        personMasterState.filteredPersons = [...personMasterState.persons];
        
        renderPersonsTable();
        hideLoadingState();
        
        if (personMasterState.persons.length === 0) {
            showEmptyState();
        }
        
    } catch (error) {
        console.error("Error loading persons:", error);
        showToast("Failed to load persons: " + error.message, "error");
        hideLoadingState();
    }
}

/* ==========================
Add/Update Person
========================= */

async function savePerson(formData) {
    try {
        const isEditing = personMasterState.currentEditId !== null;
        
        // Validate required fields
        if (!formData.full_name || !formData.email || !formData.mobile || !formData.person_type) {
            showToast("All fields are required", "error");
            return false;
        }
        
        // Email format validation
        if (!isValidEmail(formData.email)) {
            showToast("Please enter a valid email address", "error");
            return false;
        }
        
        // Mobile validation (basic)
        if (!isValidMobile(formData.mobile)) {
            showToast("Please enter a valid mobile number", "error");
            return false;
        }
        
        // Check for duplicate email (exclude current record if editing)
        const duplicateEmail = personMasterState.persons.some(p => 
            p.email === formData.email && 
            (!isEditing || p.id !== personMasterState.currentEditId)
        );
        
        if (duplicateEmail) {
            showToast("A person with this email already exists", "error");
            return false;
        }
        
        // Check for duplicate mobile (exclude current record if editing)
        const duplicateMobile = personMasterState.persons.some(p => 
            p.mobile === formData.mobile && 
            (!isEditing || p.id !== personMasterState.currentEditId)
        );
        
        if (duplicateMobile) {
            showToast("A person with this mobile number already exists", "error");
            return false;
        }
        
        showLoadingState();
        
        let result;
        
        if (isEditing) {
            // Update existing person
            const { data, error } = await window.supabaseClient
                .from('persons')
                .update({
                    full_name: formData.full_name,
                    email: formData.email,
                    mobile: formData.mobile,
                    person_type: formData.person_type,
                    status: formData.status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', personMasterState.currentEditId)
                .select();
            
            if (error) throw error;
            result = data;
            
            showToast("Person updated successfully", "success");
        } else {
            // Create new person
            const { data, error } = await window.supabaseClient
                .from('persons')
                .insert([{
                    full_name: formData.full_name,
                    email: formData.email,
                    mobile: formData.mobile,
                    person_type: formData.person_type,
                    status: formData.status || 'Active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            result = data;
            
            showToast("Person added successfully", "success");
        }
        
        // Reload persons to ensure UI is in sync
        await loadPersons();
        hideLoadingState();
        
        return true;
        
    } catch (error) {
        console.error("Error saving person:", error);
        showToast("Failed to save person: " + error.message, "error");
        hideLoadingState();
        return false;
    }
}

/* ==========================
Delete Person
========================= */

async function deletePerson(personId) {
    try {
        showLoadingState();
        
        const { error } = await window.supabaseClient
            .from('persons')
            .delete()
            .eq('id', personId);
        
        if (error) throw error;
        
        showToast("Person deleted successfully", "success");
        
        // Reload persons
        await loadPersons();
        hideLoadingState();
        
        return true;
        
    } catch (error) {
        console.error("Error deleting person:", error);
        showToast("Failed to delete person: " + error.message, "error");
        hideLoadingState();
        return false;
    }
}

/* ==========================
Search/Filter Persons
========================= */

function searchPersons(query) {
    const lowercaseQuery = query.toLowerCase();
    
    personMasterState.filteredPersons = personMasterState.persons.filter(person => {
        return (
            person.full_name.toLowerCase().includes(lowercaseQuery) ||
            person.email.toLowerCase().includes(lowercaseQuery) ||
            person.mobile.includes(lowercaseQuery)
        );
    });
    
    renderPersonsTable();
}

/* ==========================
Get Person by ID
========================= */

function getPersonById(personId) {
    return personMasterState.persons.find(p => p.id === personId);
}

/* ==========================
Validation Functions
========================= */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidMobile(mobile) {
    // Basic mobile validation - at least 10 digits
    const mobileRegex = /^\d{10,}$/;
    return mobileRegex.test(mobile.replace(/\D/g, ''));
}

/* ==========================
UI State Functions
========================= */

function showLoadingState() {
    const tbody = document.getElementById('personsTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr class="loading-row">
                <td colspan="7" class="loading-message">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Loading...
                </td>
            </tr>
        `;
    }
}

function hideLoadingState() {
    // This will be replaced by renderPersonsTable or showEmptyState
}

function showEmptyState() {
    const tableContainer = document.querySelector('.table-container');
    const emptyState = document.getElementById('emptyState');
    
    if (tableContainer) tableContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
}

function hideEmptyState() {
    const tableContainer = document.querySelector('.table-container');
    const emptyState = document.getElementById('emptyState');
    
    if (tableContainer) tableContainer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
}

/* ==========================
Render Persons Table
========================= */

function renderPersonsTable() {
    const tbody = document.getElementById('personsTableBody');
    
    if (!tbody) return;
    
    if (personMasterState.filteredPersons.length === 0) {
        if (personMasterState.persons.length === 0) {
            showEmptyState();
        } else {
            tbody.innerHTML = `
                <tr class="no-results-row">
                    <td colspan="7" class="no-results-message">
                        <i class="fa-solid fa-search"></i>
                        No persons match your search
                    </td>
                </tr>
            `;
            hideEmptyState();
        }
        return;
    }
    
    hideEmptyState();
    
    tbody.innerHTML = personMasterState.filteredPersons.map(person => `
        <tr class="person-row" data-person-id="${person.id}">
            <td class="person-name">${escapeHtml(person.full_name)}</td>
            <td class="person-email">${escapeHtml(person.email)}</td>
            <td class="person-mobile">${escapeHtml(person.mobile)}</td>
            <td class="person-type">${escapeHtml(person.person_type)}</td>
            <td class="person-status">
                <span class="status-badge status-${person.status.toLowerCase()}">
                    ${person.status}
                </span>
            </td>
            <td class="person-date">${formatDate(person.created_at)}</td>
            <td class="person-actions">
                <button class="btn-icon btn-edit" onclick="editPersonHandler(${person.id})" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deletePersonHandler(${person.id})" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/* ==========================
Toast Notifications
========================= */

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast toast-${type} active`;
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

/* ==========================
Utility Functions
========================= */

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/* ==========================
Handler Functions (called from HTML)
========================= */

function editPersonHandler(personId) {
    const person = getPersonById(personId);
    if (person) {
        personMasterState.currentEditId = personId;
        openPersonModal(person);
    }
}

function deletePersonHandler(personId) {
    openDeleteModal(personId);
}

/* ==========================
Sidebar Toggle
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleBtn");
    const sidebar = document.querySelector(".sidebar");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
        });
    }
});

/* ==========================
Logout Function
========================= */

async function logout() {
    try {
        if (window.supabaseClient) {
            await window.supabaseClient.auth.signOut();
        }
    } catch (error) {
        console.error("Logout Error:", error);
    }
    window.location.replace("logincard.html");
}

/* ==========================
Logout Button Binding
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});
