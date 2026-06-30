// Render Table
function renderTable(data) {
    const tbody = document.getElementById('personTableBody');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No records found</td></tr>';
        return;
    }

    data.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td><strong>${p.full_name || '-'}</strong></td>
            <td>${p.mobile || '-'}</td>
            <td>${p.email || '-'}</td>
            <td>${p.person_type || '-'}</td>
            <td><span style="color: ${p.status === 'Active' ? 'green' : 'red'};">${p.status || 'Active'}</span></td>
            <td>
                <button class="action-btn btn-edit" onclick="editPerson(${p.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn btn-delete" onclick="deletePerson(${p.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Open Modal
function openPersonModal(isEdit = false) {
    const modal = document.getElementById('personModal');
    const title = document.getElementById('modalTitle');
    
    if (!isEdit) {
        document.getElementById('personForm').reset();
        document.getElementById('personId').value = '';
        title.textContent = 'Add Person';
    } else {
        title.textContent = 'Edit Person';
    }
    
    modal.style.display = 'block';
}

// Close Modal
function closePersonModal() {
    document.getElementById('personModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('personModal');
    if (event.target == modal) {
        closePersonModal();
    }
}
