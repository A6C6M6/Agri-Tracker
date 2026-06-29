/**
 * =====================================================
 * PERSON MASTER UI HANDLER
 * Interface Management and Event Handlers
 * =====================================================
 */

let currentEditingId = null;
let currentDeleteId = null;

/**
 * Initialize UI when Database is Ready
 */
window.onPersonDatabaseReady = async function() {
    console.log('[PersonMasterUI] Initializing UI...');
    
    // Load and display persons
    await loadAndDisplayPersons();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('[PersonMasterUI] UI initialized');
};

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Add Person Button
    document.getElementById('addNewBtn').addEventListener('click', openAddPersonModal);

    // Search Input
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));

    // Form Submit
    document.getElementById('personForm').addEventListener('submit', handleFormSubmit);

    // View Toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', handleViewChange);
    });

    // Mobile Number Format
    document.getElementById('personMobile').addEventListener('input', formatMobileNumber);
}

/**
 * Load and Display Persons
 */
async function loadAndDisplayPersons() {
    try {
        showLoadingState();
        const persons = await getAllPersons();
        displayPersonsList(persons);
        updatePersonCount(persons.length);
    } catch (error) {
        console.error('[PersonMasterUI] Error loading persons:', error);
        showErrorMessage('Failed to load persons: ' + error.message);
    } finally {
        hideLoadingState();
    }
}

/**
 * Display Persons List
 */
function displayPersonsList(persons) {
    const tableBody = document.getElementById('personsList');
    const cardContainer = document.getElementById('personCards');

    if (persons.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fa-solid fa-inbox"></i>
                        <p>No persons found. Add one to get started!</p>
                    </div>
                </td>
            </tr>
        `;

        cardContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-inbox"></i>
                <p>No persons found. Add one to get started!</p>
            </div>
        `;
        return;
    }

    // Table View
    tableBody.innerHTML = persons.map(person => `
        <tr class="person-row" data-id="${person.id}">
            <td class="name-cell">
                <div class="person-avatar">
                    ${person.name.charAt(0).toUpperCase()}
                </div>
                ${escapeHtml(person.name)}
            </td>
            <td>${escapeHtml(person.email)}</td>
            <td>${escapeHtml(person.mobileNumber)}</td>
            <td>
                <span class="role-badge">${escapeHtml(person.role)}</span>
            </td>
            <td>${person.dateOfBirth ? formatDate(person.dateOfBirth) : '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit-btn" onclick="openEditPersonModal('${person.id}')" title="Edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="openDeleteModal('${person.id}', '${escapeHtml(person.name)}')" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Card View
    cardContainer.innerHTML = persons.map(person => `
        <div class="person-card" data-id="${person.id}">
            <div class="card-header">
                <div class="person-avatar-large">
                    ${person.name.charAt(0).toUpperCase()}
                </div>
                <div class="card-actions">
                    <button class="btn-icon edit-btn" onclick="openEditPersonModal('${person.id}')" title="Edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="openDeleteModal('${person.id}', '${escapeHtml(person.name)}')" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <h4>${escapeHtml(person.name)}</h4>
                <div class="card-info">
                    <p><strong>Email:</strong> ${escapeHtml(person.email)}</p>
                    <p><strong>Mobile:</strong> ${escapeHtml(person.mobileNumber)}</p>
                    <p><strong>Role:</strong> <span class="role-badge">${escapeHtml(person.role)}</span></p>
                    ${person.dateOfBirth ? `<p><strong>DOB:</strong> ${formatDate(person.dateOfBirth)}</p>` : ''}
                    ${person.address ? `<p><strong>Address:</strong> ${escapeHtml(person.address)}</p>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Open Add Person Modal
 */
function openAddPersonModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add Person';
    document.getElementById('personForm').reset();
    document.getElementById('submitBtn').querySelector('.btn-text').textContent = 'Save Person';
    
    // Clear previous errors
    clearFormErrors();
    
    document.getElementById('personModal').classList.add('active');
    document.getElementById('personName').focus();
}

/**
 * Open Edit Person Modal
 */
async function openEditPersonModal(id) {
    try {
        currentEditingId = id;
        const person = await getPersonById(id);

        if (!person) {
            showErrorMessage('Person not found');
            return;
        }

        document.getElementById('modalTitle').textContent = 'Edit Person';
        document.getElementById('personName').value = person.name;
        document.getElementById('personEmail').value = person.email;
        document.getElementById('personMobile').value = person.mobileNumber;
        document.getElementById('personRole').value = person.role;
        document.getElementById('personDOB').value = person.dateOfBirth || '';
        document.getElementById('personAddress').value = person.address;
        document.getElementById('submitBtn').querySelector('.btn-text').textContent = 'Update Person';

        clearFormErrors();
        document.getElementById('personModal').classList.add('active');
        document.getElementById('personName').focus();
    } catch (error) {
        console.error('[PersonMasterUI] Error opening edit modal:', error);
        showErrorMessage('Failed to load person: ' + error.message);
    }
}

/**
 * Close Person Modal
 */
function closePersonModal() {
    document.getElementById('personModal').classList.remove('active');
    currentEditingId = null;
    document.getElementById('personForm').reset();
    clearFormErrors();
}

/**
 * Handle Form Submit
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('btnSpinner');

    try {
        // Show loading state
        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';

        // Collect form data
        const personData = {
            name: document.getElementById('personName').value,
            email: document.getElementById('personEmail').value,
            mobileNumber: document.getElementById('personMobile').value,
            role: document.getElementById('personRole').value,
            dateOfBirth: document.getElementById('personDOB').value,
            address: document.getElementById('personAddress').value
        };

        // Add or Update
        if (currentEditingId) {
            await updatePerson(currentEditingId, personData);
            showSuccessMessage('Person updated successfully!');
        } else {
            await addPerson(personData);
            showSuccessMessage('Person added successfully!');
        }

        // Reload and close
        await loadAndDisplayPersons();
        closePersonModal();
    } catch (error) {
        console.error('[PersonMasterUI] Form submission error:', error);
        showErrorFieldMessage(error.message);
    } finally {
        submitBtn.disabled = false;
        spinner.style.display = 'none';
    }
}

/**
 * Open Delete Modal
 */
function openDeleteModal(id, name) {
    currentDeleteId = id;
    document.getElementById('deletePersonName').textContent = name;
    document.getElementById('deleteModal').classList.add('active');

    // Setup delete button
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.onclick = handleDeleteConfirm;
}

/**
 * Close Delete Modal
 */
function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    currentDeleteId = null;
}

/**
 * Handle Delete Confirm
 */
async function handleDeleteConfirm() {
    if (!currentDeleteId) return;

    try {
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.disabled = true;

        await deletePerson(currentDeleteId);
        showSuccessMessage('Person deleted successfully!');
        
        await loadAndDisplayPersons();
        closeDeleteModal();
    } catch (error) {
        console.error('[PersonMasterUI] Delete error:', error);
        showErrorMessage('Failed to delete person: ' + error.message);
    } finally {
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.disabled = false;
    }
}

/**
 * Handle Search
 */
async function handleSearch(event) {
    try {
        const searchTerm = event.target.value.trim();
        const persons = await searchPersonsByName(searchTerm);
        displayPersonsList(persons);
        updatePersonCount(persons.length, searchTerm);
    } catch (error) {
        console.error('[PersonMasterUI] Search error:', error);
        showErrorMessage('Search failed: ' + error.message);
    }
}

/**
 * Handle View Change
 */
function handleViewChange(event) {
    const view = event.currentTarget.dataset.view;

    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Show/Hide views
    if (view === 'table') {
        document.getElementById('tableView').style.display = 'block';
        document.getElementById('cardView').style.display = 'none';
    } else {
        document.getElementById('tableView').style.display = 'none';
        document.getElementById('cardView').style.display = 'block';
    }
}

/**
 * Format Mobile Number
 */
function formatMobileNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    event.target.value = value;
}

/**
 * Update Person Count
 */
function updatePersonCount(count, searchTerm = null) {
    const countBadge = document.getElementById('personCount');
    if (searchTerm) {
        countBadge.textContent = `${count} result${count !== 1 ? 's' : ''} found`;
    } else {
        countBadge.textContent = `${count} person${count !== 1 ? 's' : ''}`;
    }
}

/**
 * Clear Form Errors
 */
function clearFormErrors() {
    document.querySelectorAll('.error-text').forEach(elem => {
        elem.textContent = '';
    });
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(elem => {
        elem.classList.remove('error');
    });
}

/**
 * Show Error Field Message
 */
function showErrorFieldMessage(message) {
    // Try to identify which field the error is about
    if (message.includes('Name')) {
        document.getElementById('nameError').textContent = message;
        document.getElementById('personName').classList.add('error');
    } else if (message.includes('Email')) {
        document.getElementById('emailError').textContent = message;
        document.getElementById('personEmail').classList.add('error');
    } else if (message.includes('Mobile')) {
        document.getElementById('mobileError').textContent = message;
        document.getElementById('personMobile').classList.add('error');
    } else {
        showErrorMessage(message);
    }
}

/**
 * Show Loading State
 */
function showLoadingState() {
    const tableBody = document.getElementById('personsList');
    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="6">
                <div class="loading-spinner">
                    <i class="fa-solid fa-spinner fa-spin"></i> Loading...
                </div>
            </td>
        </tr>
    `;
}

/**
 * Hide Loading State
 */
function hideLoadingState() {
    // Already hidden when content is loaded
}

/**
 * Show Toast Message
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Show Success Message
 */
function showSuccessMessage(message) {
    showToast(message, 'success');
    console.log('[PersonMasterUI] Success:', message);
}

/**
 * Show Error Message
 */
function showErrorMessage(message) {
    showToast(message, 'error');
    console.error('[PersonMasterUI] Error:', message);
}

/**
 * Get Toast Icon
 */
function getToastIcon(type) {
    const icons = {
        success: 'circle-check',
        error: 'circle-xmark',
        warning: 'triangle-exclamation',
        info: 'info'
    };
    return icons[type] || 'info';
}

/**
 * Utility: Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Utility: Format Date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Utility: Debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle Logout
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        window.location.href = 'logincard.html';
    }
}

// Initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[PersonMasterUI] DOM content loaded');
    });
} else {
    console.log('[PersonMasterUI] DOM already loaded');
}

console.log('[PersonMasterUI] Module loaded successfully');
