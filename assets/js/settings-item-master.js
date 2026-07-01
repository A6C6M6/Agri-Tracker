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
    const { data, error } = await window.supabaseClient.from('item_master').select('*');
    if (error || !data) return;
    const tbody = document.getElementById('itemTableBody');
    tbody.innerHTML = data.map(i => `<tr><td>${i.item_name}</td></tr>`).join('');
    const select = document.getElementById('editItemSelect');
    select.innerHTML = '<option value="">-- Select --</option>' + data.map(i => `<option value="${i.id}">${i.item_name}</option>`).join('');
}

async function saveNewItem(e) {
    e.preventDefault();
    const itemName = document.getElementById('add_itemName').value.trim();
    if (!itemName) return;
    const { error } = await window.supabaseClient
        .from('item_master')
        .insert([{ item_name: itemName }]);
    if (error) {
        showToast('Error: ' + error.message, 'danger');
        return;
    }
    showToast('Item saved successfully!', 'success');
    document.getElementById('addItemForm').reset();
    setTimeout(() => { window.location.href = 'settings-item-master.html?tab=view'; }, 900);
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
    const itemName = document.getElementById('edit_itemName').value.trim();
    const itemId = document.getElementById('edit_itemId').value;
    const { error } = await window.supabaseClient
        .from('item_master')
        .update({ item_name: itemName })
        .eq('id', itemId);
    if (error) {
        showToast('Error: ' + error.message, 'danger');
        return;
    }
    showToast('Item updated!', 'success');
    setTimeout(() => { window.location.href = 'settings-item-master.html?tab=view'; }, 900);
}

function showToast(msg, type) {
    const existing = document.getElementById('itemToast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'itemToast';
    toast.textContent = msg;
    toast.style.cssText = `
        position:fixed;bottom:28px;left:50%;transform:translateX(-50%);
        background:${type === 'success' ? '#16a34a' : '#dc2626'};
        color:#fff;padding:13px 28px;border-radius:12px;
        font-size:15px;font-weight:600;z-index:9999;
        box-shadow:0 4px 18px rgba(0,0,0,.18);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

async function logout() {
    await window.supabaseClient.auth.signOut();
    window.location.replace("logincard.html");
}
