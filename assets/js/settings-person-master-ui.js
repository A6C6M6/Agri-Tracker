/* ==========================
Person Master - UI Interactions
========================= */

/* ==========================
Modal Functions
========================= */

function openPersonModal(personData = null) {
    const modal = document.getElementById('personModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('personForm');
    const submitText = document.getElementById('submitText');
    
    // Reset form
    form.reset();
    clearFormErrors();
    personMasterState.currentEditId = personData ? personData.id : null;
    
    if (personData) {
        // Edit mode
        modalTitle.textContent = 'Edit Person';
        submitText.textContent = 'Update Person';
        
        document.getElementById('fullName').value = personData.full_name || '';
        document.getElementById('email').value = personData.email || '';
        document.getElementById('mobile').value = personData.mobile || '';
        document.getElementById('personType').value = personData.person_type || '';
        document.getElementById('status').value = personData.status || 'Active';
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Person';
        submitText.textContent = 'Add Person';
        document.getElementById('status').value = 'Active';
    }
    
    modal.classList.add('active');
}

function closePersonModal() {
    const modal = document.getElementById('personModal');
    const form = document.getElementById('personForm');
    
    modal.classList.remove('active');
    form.reset();
    clearFormErrors();
    personMasterState.currentEditId = null;
}

function openDeleteModal(personId) {
    const modal = document.getElementById('deleteModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    confirmBtn.onclick = async () => {
        await performDelete(personId);
    };
    
    modal.classList.add('active');
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('active');
}

async function performDelete(personId) {
    const deleteText = document.getElementById('deleteText');
    const deleteSpinner = document.getElementById('deleteSpinner');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    confirmBtn.disabled = true;
    deleteText.style.display = 'none';
    deleteSpinner.style.display = 'inline';
    
    const success = await deletePerson(personId);
    
    if (success) {
        closeDeleteModal();
    }
    
    confirmBtn.disabled = false;
    deleteText.style.display = 'inline';
    deleteSpinner.style.display = 'none';
}

/* ==========================
Form Validation & Error Display
========================= */

function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
}

function showFormError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function validateForm() {
    clearFormErrors();
    let isValid = true;
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const personType = document.getElementById('personType').value;
    
    if (!fullName) {
        showFormError('fullName', 'Full name is required');
        isValid = false;
    }
    
    if (!email) {
        showFormError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFormError('email', 'Please enter a valid email');
        isValid = false;
    }
    
    if (!mobile) {
        showFormError('mobile', 'Mobile is required');
        isValid = false;
    } else if (!isValidMobile(mobile)) {
        showFormError('mobile', 'Please enter a valid mobile number');
        isValid = false;
    }
    
    if (!personType) {
        showFormError('personType', 'Please select a person type');
        isValid = false;
    }
    
    return isValid;
}

/* ==========================
Form Submission
========================= */

document.addEventListener('DOMContentLoaded', () => {
    const personForm = document.getElementById('personForm');
    
    if (personForm) {
        personForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitText');
            const submitSpinner = document.getElementById('submitSpinner');
            
            submitBtn.disabled = true;
            submitText.style.display = 'none';
            submitSpinner.style.display = 'inline';
            
            const formData = {
                full_name: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                mobile: document.getElementById('mobile').value.trim(),
                person_type: document.getElementById('personType').value,
                status: document.getElementById('status').value
            };
            
            const success = await savePerson(formData);
            
            if (success) {
                closePersonModal();
            }
            
            submitBtn.disabled = false;
            submitText.style.display = 'inline';
            submitSpinner.style.display = 'none';
        });
    }
});

/* ==========================
Button Event Listeners
========================= */

document.addEventListener('DOMContentLoaded', () => {
    const addPersonBtn = document.getElementById('addPersonBtn');
    const emptyAddBtn = document.getElementById('emptyAddBtn');
    
    if (addPersonBtn) {
        addPersonBtn.addEventListener('click', () => openPersonModal());
    }
    
    if (emptyAddBtn) {
        emptyAddBtn.addEventListener('click', () => openPersonModal());
    }
});

/* ==========================
Search Input
========================= */

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchPersons(e.target.value);
        });
    }
});

/* ==========================
Close Modal on Outside Click
========================= */

document.addEventListener('DOMContentLoaded', () => {
    const personModal = document.getElementById('personModal');
    const deleteModal = document.getElementById('deleteModal');
    
    window.addEventListener('click', (e) => {
        if (e.target === personModal) {
            closePersonModal();
        }
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
});

/* ==========================
Real-time Input Validation
========================= */

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const mobileInput = document.getElementById('mobile');
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email && !isValidEmail(email)) {
                showFormError('email', 'Invalid email format');
            } else {
                showFormError('email', '');
            }
        });
    }
    
    if (mobileInput) {
        mobileInput.addEventListener('blur', () => {
            const mobile = mobileInput.value.trim();
            if (mobile && !isValidMobile(mobile)) {
                showFormError('mobile', 'Mobile must be at least 10 digits');
            } else {
                showFormError('mobile', '');
            }
        });
    }
});

/* ==========================
Prevent Modal Close on Form Click
========================= */

document.addEventListener('DOMContentLoaded', () => {
    const modalContent = document.querySelector('.modal-content');
    
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});
