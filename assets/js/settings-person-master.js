document.addEventListener('DOMContentLoaded', () => {
    fetchPersons();
});

// Fetch Data
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
        alert('Failed to fetch data.');
    }
}

// Save or Update Data
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
            // Update
            const { error } = await window.supabaseClient
                .from('persons')
                .update(personData)
                .eq('id', id);
            if (error) throw error;
        } else {
            // Insert
            const { error } = await window.supabaseClient
                .from('persons')
                .insert([personData]);
            if (error) throw error;
        }
        
        closePersonModal();
        fetchPersons();
    } catch (error) {
        console.error('Error saving person:', error);
        alert('Failed to save data.');
    }
}

// Delete Data
async function deletePerson(id) {
    if (confirm('Are you sure you want to delete this person?')) {
        try {
            const { error } = await window.supabaseClient
                .from('persons')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            fetchPersons();
        } catch (error) {
            console.error('Error deleting person:', error);
            alert('Failed to delete data.');
        }
    }
}

// Load Data for Editing
async function editPerson(id) {
    try {
        const { data, error } = await window.supabaseClient
            .from('persons')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        // Populate Form
        document.getElementById('personId').value = data.id;
        document.getElementById('fullName').value = data.full_name;
        document.getElementById('mobile').value = data.mobile;
        document.getElementById('email').value = data.email;
        document.getElementById('personType').value = data.person_type;
        document.getElementById('status').value = data.status;

        openPersonModal(true);
    } catch (error) {
        console.error('Error loading person:', error);
        alert('Failed to load data.');
    }
}
