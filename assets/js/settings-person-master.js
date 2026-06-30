// പേജ് ലോഡ് ചെയ്യുമ്പോൾ ലിസ്റ്റ് കാണിക്കുക
document.addEventListener('DOMContentLoaded', () => {
    fetchPersons();
});

// 1. ഫെച്ച് ചെയ്യുക (View List)
async function fetchPersons() {
    try {
        const { data, error } = await window.supabaseClient
            .from('persons')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        renderTable(data);
    } catch (error) {
        console.error('Error fetching persons:', error);
    }
}

// 2. സേവ് അല്ലെങ്കിൽ അപ്‌ഡേറ്റ് ചെയ്യുക (Save/Update)
async function savePerson(e) {
    e.preventDefault();
    
    const id = document.getElementById('personId').value;
    const personData = {
        full_name: document.getElementById('fullName').value,
        mobile: document.getElementById('mobile').value,
        email: document.getElementById('email').value,
        person_type: document.getElementById('personType').value,
        status: document.getElementById('status').value,
        updated_at: new Date().toISOString()
    };

    try {
        if (id) {
            await window.supabaseClient.from('persons').update(personData).eq('id', id);
        } else {
            await window.supabaseClient.from('persons').insert([personData]);
        }
        closePersonModal();
        fetchPersons();
    } catch (error) {
        alert('Error saving data: ' + error.message);
    }
}

// 3. ഡിലീറ്റ് ചെയ്യുക (Delete)
async function deletePerson(id) {
    if (confirm('Are you sure?')) {
        try {
            await window.supabaseClient.from('persons').delete().eq('id', id);
            fetchPersons();
        } catch (error) {
            alert('Error deleting: ' + error.message);
        }
    }
}

// 4. എഡിറ്റ് ചെയ്യുക (Edit)
async function editPerson(id) {
    const { data, error } = await window.supabaseClient.from('persons').select('*').eq('id', id).single();
    if (error) return alert('Error fetching data');

    document.getElementById('personId').value = data.id;
    document.getElementById('fullName').value = data.full_name;
    document.getElementById('mobile').value = data.mobile;
    document.getElementById('email').value = data.email;
    document.getElementById('personType').value = data.person_type;
    document.getElementById('status').value = data.status;

    openPersonModal(true);
}

// 5. ടേബിൾ റെൻഡർ ചെയ്യുക (Render)
function renderTable(data) {
    const tbody = document.getElementById('personTableBody');
    tbody.innerHTML = data.map(p => `
        <tr>
            <td>${p.full_name}</td><td>${p.mobile}</td><td>${p.email}</td>
            <td>${p.person_type}</td><td>${p.status}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editPerson('${p.id}')">Edit</button>
                <button class="action-btn btn-delete" onclick="deletePerson('${p.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// 6. മോഡൽ കൺട്രോൾ
function openPersonModal(isEdit = false) {
    document.getElementById('modalTitle').textContent = isEdit ? 'Edit Person' : 'Add Person';
    document.getElementById('personModal').style.display = 'block';
}

function closePersonModal() {
    document.getElementById('personForm').reset();
    document.getElementById('personId').value = '';
    document.getElementById('personModal').style.display = 'none';
}

// പുറത്ത് ക്ലിക്ക് ചെയ്താൽ മോഡൽ അടയ്ക്കുക
window.onclick = (event) => {
    if (event.target == document.getElementById('personModal')) closePersonModal();
};
