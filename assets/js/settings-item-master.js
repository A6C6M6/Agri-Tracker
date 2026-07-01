document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    const params = new URLSearchParams(window.location.search);
    const requestedTab = params.get('tab');
    if (requestedTab === 'add' || requestedTab === 'edit' || requestedTab === 'view') {
        switchTab(requestedTab);
    }
});

function switchTab(tab) {
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('panel' + tab.charAt(0).toUpperCase() + tab.slice(1)).style.display = 'block';
    document.getElementById('tabBtn' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('selected');
    if (tab === 'view') fetchItems();
}

async function fetchItems() {
    const { data } = await window.supabaseClient.from('item_master').select('*');
    const tbody = document.getElementById('itemTableBody');
    tbody.innerHTML = data.map(i => `<tr><td>${i.item_name}</td></tr>`).join('');
    const select = document.getElementById('editItemSelect');
    select.innerHTML = '<option value="">-- Select --</option>' + data.map(i => `<option value="${i.id}">${i.item_name}</option>`).join('');
}

async function saveNewItem(e) {
    e.preventDefault();
    await window.supabaseClient.from('item_master').insert([{ item_name: document.getElementById('add_itemName').value }]);
    document.getElementById('addItemForm').reset();
    window.location.href = 'settings-item-master.html?tab=view';
}

async function loadItemForEdit(id) {
    if (!id) return;
    const { data } = await window.supabaseClient.from('item_master').select('*').eq('id', id).single();
    document.getElementById('edit_itemId').value = data.id;
    document.getElementById('edit_itemName').value = data.item_name;
    document.getElementById('editItemForm').style.display = 'block';
    document.getElementById('editEmptyHint').style.display = 'none';
}

async function updateExistingItem(e) {
    e.preventDefault();
    await window.supabaseClient.from('item_master').update({ item_name: document.getElementById('edit_itemName').value }).eq('id', document.getElementById('edit_itemId').value);
    window.location.href = 'settings-item-master.html?tab=view';
}

async function logout() {
    await window.supabaseClient.auth.signOut();
    window.location.replace("logincard.html");
}
