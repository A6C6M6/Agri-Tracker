/* =========================================================
   SETTINGS PERSON MASTER - FULL INTEGRATED LOGIC (TABBED UI)
   Business logic / Supabase calls are unchanged from before —
   only the surrounding UI (modal -> tabs) was restructured.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    fetchPersons();
    fetchPersonTypes();
    setupSidebarToggle();
    setupTabHoverBehavior();
});

/* ==========================================
   SIDEBAR TOGGLE (collapsed/expanded)
========================================== */

function setupSidebarToggle() {
    const toggleBtn = document.getElementById("toggleBtn");
    const sidebar = document.querySelector(".sidebar");

    if (!toggleBtn || !sidebar) return;

    try {
        if (localStorage.getItem('sidebarCollapsed') === '1') {
            sidebar.classList.add('collapsed');
        }
    } catch (e) {}

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        try {
            localStorage.setItem(
                'sidebarCollapsed',
                sidebar.classList.contains('collapsed') ? '1' : '0'
            );
        } catch (e) {}
    });
}

/* ==========================================
   TAB SWITCHING
========================================== */

function switchTab(tab) {
    const panels = {
        add: document.getElementById('panelAdd'),
        edit: document.getElementById('panelEdit'),
        view: document.getElementById('panelView')
    };

    const buttons = {
        add: document.getElementById('tabBtnAdd'),
        edit: document.getElementById('tabBtnEdit'),
        view: document.getElementById('tabBtnView')
    };

    Object.keys(panels).forEach(key => {
        panels[key].style.display = (key === tab) ? 'block' : 'none';
        buttons[key].classList.toggle('selected', key === tab);
    });

    // Refresh data relevant to the panel being shown
    if (tab === 'view') {
        fetchPersons();
    }
    if (tab === 'edit') {
        // Always start the Edit Person tab in its default,
        // nothing-selected state — never restore the previously
        // selected person when re-entering this tab.
        cancelEdit();
        fetchPersons(); // keeps the edit dropdown list current
    }
}

/* Only the hovered tab should look "active"; when the mouse leaves
   the tab row, the currently selected tab returns to its active look. */
function setupTabHoverBehavior() {
    const nav = document.querySelector('.tabs-nav');
    if (!nav) return;

    nav.addEventListener('mouseover', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        nav.classList.add('nav-hovering');

        nav.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.toggle('hover-active', b === btn);
        });
    });

    nav.addEventListener('mouseleave', () => {
        nav.classList.remove('nav-hovering');
        nav.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('hover-active');
        });
    });
}

/* ==========================================
   SUPABASE: FETCH PERSONS (used by View List + Edit dropdown)
========================================== */

let personsCache = [];

async function fetchPersons() {
    try {
        const { data, error } = await window.supabaseClient
            .from('persons')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        personsCache = data || [];
        renderTable(personsCache);
        renderEditDropdown(personsCache);
    } catch (error) {
        console.error('Error fetching persons:', error);
    }
}

/* ==========================================
   SUPABASE: FETCH PERSON TYPES (Add + Edit dropdowns)
========================================== */

async function fetchPersonTypes() {
    try {
        const { data, error } = await window.supabaseClient
            .from('person_types')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        const options = '<option value="">Select Person Type</option>' +
            (data || []).map(t => `<option value="${t.type_name}">${t.type_name}</option>`).join('');

        const addSelect = document.getElementById('add_personType');
        const editSelect = document.getElementById('edit_personType');

        if (addSelect) addSelect.innerHTML = options;
        if (editSelect) editSelect.innerHTML = options;
    } catch (error) {
        console.error('Error fetching person types:', error);
    }
}

/* ==========================================
   ADD PERSON (insert only — no edit/delete shown here)
========================================== */

async function saveNewPerson(e) {
    e.preventDefault();

    const personData = {
        full_name: document.getElementById('add_fullName').value,
        mobile: document.getElementById('add_mobile').value,
        email: document.getElementById('add_email').value,
        person_type: document.getElementById('add_personType').value,
        status: document.getElementById('add_status').value,
        updated_at: new Date().toISOString()
    };

    try {
        const { error } = await window.supabaseClient.from('persons').insert([personData]);
        if (error) throw error;

        document.getElementById('addPersonForm').reset();
        fetchPersons();
        switchTab('view');
    } catch (error) {
        alert('Error saving data: ' + error.message);
    }
}

/* ==========================================
   EDIT PERSON (update existing — delete only available
   while a person is actively selected, never after save)
========================================== */

function renderEditDropdown(data) {
    const select = document.getElementById('editPersonSelect');
    if (!select) return;

    const currentValue = select.value;

    select.innerHTML = '<option value="">-- Select Person --</option>' +
        data.map(p => `<option value="${p.id}">${p.full_name || '(no name)'}</option>`).join('');

    select.value = currentValue;
}

async function loadPersonForEdit(id) {
    const form = document.getElementById('editPersonForm');
    const hint = document.getElementById('editEmptyHint');

    if (!id) {
        form.style.display = 'none';
        hint.style.display = 'block';
        return;
    }

    const { data, error } = await window.supabaseClient.from('persons').select('*').eq('id', id).single();
    if (error) {
        alert('Error fetching data');
        return;
    }

    document.getElementById('edit_personId').value = data.id;
    document.getElementById('edit_fullName').value = data.full_name || '';
    document.getElementById('edit_mobile').value = data.mobile || '';
    document.getElementById('edit_email').value = data.email || '';
    document.getElementById('edit_personType').value = data.person_type || '';
    document.getElementById('edit_status').value = data.status || 'Active';

    hint.style.display = 'none';
    form.style.display = 'block';
}

async function updateExistingPerson(e) {
    e.preventDefault();

    const id = document.getElementById('edit_personId').value;
    const personData = {
        full_name: document.getElementById('edit_fullName').value,
        mobile: document.getElementById('edit_mobile').value,
        email: document.getElementById('edit_email').value,
        person_type: document.getElementById('edit_personType').value,
        status: document.getElementById('edit_status').value,
        updated_at: new Date().toISOString()
    };

    try {
        const { error } = await window.supabaseClient.from('persons').update(personData).eq('id', id);
        if (error) throw error;

        cancelEdit();
        fetchPersons();
        switchTab('view');
    } catch (error) {
        alert('Error saving data: ' + error.message);
    }
}

async function deleteFromEditTab() {
    const id = document.getElementById('edit_personId').value;
    if (!id) return;

    if (confirm('Are you sure you want to delete this record?')) {
        try {
            const { error } = await window.supabaseClient.from('persons').delete().eq('id', id);
            if (error) throw error;

            cancelEdit();
            fetchPersons();
            switchTab('view');
        } catch (error) {
            alert('Error deleting: ' + error.message);
        }
    }
}

function cancelEdit() {
    document.getElementById('editPersonForm').reset();
    document.getElementById('edit_personId').value = '';
    document.getElementById('editPersonSelect').value = '';
    document.getElementById('editPersonForm').style.display = 'none';
    document.getElementById('editEmptyHint').style.display = 'block';
}

/* ==========================================
   VIEW LIST (read-only — no edit/delete actions here)
========================================== */

function renderTable(data) {
    const tbody = document.getElementById('personTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.map(p => {
        const isActive = (p.status || '').toLowerCase() === 'active';
        const pillClass = isActive ? 'active' : 'inactive';
        const dotColor = isActive ? '#16a34a' : '#94a3b8';

        return `
        <tr>
            <td>${p.full_name || ''}</td>
            <td>${p.mobile || ''}</td>
            <td>${p.email || ''}</td>
            <td>${p.person_type || ''}</td>
            <td>
                <span class="status-pill ${pillClass}">
                    <i class="fa-solid fa-circle" style="font-size:7px; color:${dotColor};"></i>
                    ${p.status || ''}
                </span>
            </td>
        </tr>
    `;
    }).join('');
}

/* ==========================================
   LOGOUT
========================================== */

async function logout() {
    try {
        if (window.supabaseClient) {
            await window.supabaseClient.auth.signOut();
        }
        window.location.replace("logincard.html");
    } catch (error) {
        console.error("Logout Error:", error);
    }
}
