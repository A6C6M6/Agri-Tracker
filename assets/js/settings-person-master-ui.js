/* assets/js/settings-person-master-ui.js
   UI-layer: renders list, handles modal, validation, messages
   Ensure this file is loaded AFTER settings-person-master.js and supabase-config.js
*/

document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('pm-list');
  const addBtn = document.getElementById('pm-add-btn');

  const modal = document.getElementById('pm-modal');
  const form = document.getElementById('pm-form');
  const msgEl = document.getElementById('pm-form-msg');
  const saveBtn = document.getElementById('pm-save-btn');
  const updateBtn = document.getElementById('pm-update-btn');
  const cancelBtn = document.getElementById('pm-cancel-btn');

  let currentChannel = null;

  async function showMsg(message, type = 'error') {
    msgEl.textContent = message;
    msgEl.className = 'pm-msg ' + (type === 'success' ? 'pm-success' : '');
  }

  function clearMsg() { showMsg('', ''); }

  function openModal(mode = 'add', person = null) {
    clearMsg();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if (mode === 'add') {
      document.getElementById('pm-modal-title').textContent = 'Add Person';
      saveBtn.classList.remove('hidden');
      updateBtn.classList.add('hidden');
      form.reset();
      document.getElementById('pm-id').value = '';
    } else {
      document.getElementById('pm-modal-title').textContent = 'Edit Person';
      saveBtn.classList.add('hidden');
      updateBtn.classList.remove('hidden');
      if (person) {
        document.getElementById('pm-id').value = person.id || '';
        document.getElementById('pm-full_name').value = person.full_name || '';
        document.getElementById('pm-mobile').value = person.mobile || '';
        document.getElementById('pm-email').value = person.email || '';
        document.getElementById('pm-person_type').value = person.person_type || '';
        document.getElementById('pm-status').value = person.status || 'Active';
      }
    }
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  async function loadList() {
    listEl.innerHTML = '<div class="pm-loading">Loading...</div>';
    try {
      const items = await PersonService.fetchAll();
      renderList(items);
    } catch (err) {
      listEl.innerHTML = `<div class="pm-loading">Error loading list: ${err.message}</div>`;
    }
  }

  function renderList(items) {
    if (!items || items.length === 0) {
      listEl.innerHTML = '<div class="pm-loading">No persons found.</div>';
      return;
    }
    listEl.innerHTML = '';
    items.forEach(p => {
      const row = document.createElement('div');
      row.className = 'pm-row';
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(p.full_name||'-')}</strong><br/>
          <small>${escapeHtml(p.mobile||'')} ${p.email ? ' | ' + escapeHtml(p.email) : ''}</small>
        </div>
        <div class="actions">
          <button class="btn btn-sm btn-primary pm-edit" data-id="${p.id}">Edit</button>
          <button class="btn btn-sm btn-danger pm-delete" data-id="${p.id}">Delete</button>
        </div>
      `;
      listEl.appendChild(row);
    });
    // wire up edit/delete
    listEl.querySelectorAll('.pm-edit').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        // load single item details from supabase to be safe
        const persons = await PersonService.fetchAll();
        const person = persons.find(x => x.id === id);
        openModal('edit', person);
      });
    });
    listEl.querySelectorAll('.pm-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        if (!confirm('Are you sure to delete this person?')) return;
        try {
          await PersonService.remove(id);
          await loadList();
          showTransientToast('Deleted successfully');
        } catch (err) {
          alert('Delete failed: ' + err.message);
        }
      });
    });
  }

  // Simple escape
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"'`]/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;', '`':'&#96;' }[s]));
  }

  // Save handler
  saveBtn.addEventListener('click', async () => {
    clearMsg();
    const person = readForm();
    const validation = validatePerson(person);
    if (!validation.ok) { showMsg(validation.message); return; }
    saveBtn.disabled = true; saveBtn.textContent = 'Saving...';
    try {
      const dup = await PersonService.findDuplicate({ email: person.email, mobile: person.mobile });
      if (dup) { showMsg('Duplicate person found (same email or mobile).', 'error'); return; }
      await PersonService.create(person);
      showTransientToast('Saved successfully');
      closeModal();
      await loadList();
    } catch (err) {
      showMsg('Save failed: ' + err.message);
    } finally {
      saveBtn.disabled = false; saveBtn.textContent = 'Save';
    }
  });

  // Update handler
  updateBtn.addEventListener('click', async () => {
    clearMsg();
    const id = document.getElementById('pm-id').value;
    if (!id) { showMsg('Missing id'); return; }
    const person = readForm();
    const validation = validatePerson(person);
    if (!validation.ok) { showMsg(validation.message); return; }

    updateBtn.disabled = true; updateBtn.textContent = 'Updating...';
    try {
      const dup = await PersonService.findDuplicate({ email: person.email, mobile: person.mobile }, parseInt(id,10));
      if (dup) { showMsg('Duplicate person found (same email or mobile).', 'error'); return; }
      await PersonService.update(parseInt(id,10), person);
      showTransientToast('Updated successfully');
      closeModal();
      await loadList();
    } catch (err) {
      showMsg('Update failed: ' + err.message);
    } finally {
      updateBtn.disabled = false; updateBtn.textContent = 'Update';
    }
  });

  cancelBtn.addEventListener('click', () => closeModal());

  addBtn.addEventListener('click', () => openModal('add'));

  // read form
  function readForm() {
    return {
      full_name: document.getElementById('pm-full_name').value.trim(),
      mobile: document.getElementById('pm-mobile').value.trim(),
      email: document.getElementById('pm-email').value.trim(),
      person_type: document.getElementById('pm-person_type').value.trim(),
      status: document.getElementById('pm-status').value
    };
  }

  function validatePerson(p) {
    if (!p.full_name) return { ok:false, message: 'Full name is required' };
    if (!p.mobile) return { ok:false, message: 'Mobile is required' };
    if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return { ok:false, message: 'Email format is invalid' };
    return { ok:true };
  }

  // Toast
  function showTransientToast(text) {
    // Simple: use alert or implement small toast
    // Here minimal: temporary message area at top of list
    const t = document.createElement('div');
    t.className = 'pm-toast';
    t.style = 'position:fixed;top:12px;right:12px;background:#2d7a2d;color:#fff;padding:8px 12px;border-radius:6px;z-index:2000';
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  // Realtime subscription
  function startRealtime() {
    // subscribe; callback refreshes list on any change
    currentChannel = PersonService.subscribe(payload => {
      // Could optimize by patching list. Simpler: reload all
      loadList();
    });
  }

  // initialize
  (async function init() {
    await loadList();
    startRealtime();
  })();

});
