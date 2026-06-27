/* ==========================================
   FARM ENTRY PAGE
   - Renders dynamic entry cards: Workers, Farm Tasks, Fertilizers, etc.
   - Preserves all business logic, API contracts, DB behavior
   - Session validation, logout, sidebar toggle from dashboard.js
   - Safe placeholders for action functions
========================================== */

/* ==========================================
   CARD RENDERER FUNCTION
========================================== */

function renderEntryCards() {
    const container = document.getElementById('entryCardContainer');
    
    if (!container) {
        console.warn('Entry cards container not found');
        return;
    }

    const entryCards = [
        {
            id: 'workers',
            iconColor: 'orange',
            icon: 'fa-people-group',
            title: 'Workers (തൊഴിലാളികൾ)',
            description: 'Fields: name, phone, work days, wage, payment info',
            buttons: [
                { text: 'Add Worker', icon: 'fa-plus', class: 'btn-success', action: 'addWorker' },
                { text: 'Edit Worker', icon: 'fa-pen', class: 'btn-primary', action: 'editWorker' },
                { text: 'View List', icon: 'fa-list', class: 'btn-info', action: 'viewWorkerList' }
            ]
        },
        {
            id: 'farm-tasks',
            iconColor: 'blue',
            icon: 'fa-tractor',
            title: 'Farm Tasks (കൃഷി ജോലികൾ)',
            description: 'Tasks: digging, ploughing, planting, cutting, etc.',
            buttons: [
                { text: 'Add Task', icon: 'fa-plus', class: 'btn-success', action: 'addFarmTask' },
                { text: 'Edit Task', icon: 'fa-pen', class: 'btn-primary', action: 'editFarmTask' },
                { text: 'View List', icon: 'fa-list', class: 'btn-info', action: 'viewFarmTaskList' }
            ]
        },
        {
            id: 'fertilizers',
            iconColor: 'green',
            icon: 'fa-seedling',
            title: 'Fertilizers (വളങ്ങൾ)',
            description: 'Info: fertilizer name, quantity, used date, cost',
            buttons: [
                { text: 'Add Fertilizer', icon: 'fa-plus', class: 'btn-success', action: 'addFertilizer' },
                { text: 'Edit Fertilizer', icon: 'fa-pen', class: 'btn-primary', action: 'editFertilizer' },
                { text: 'View List', icon: 'fa-list', class: 'btn-info', action: 'viewFertilizerList' }
            ]
        },
        {
            id: 'pesticides',
            iconColor: 'purple',
            icon: 'fa-bug',
            title: 'Pesticides (കീടനാശിനികൾ)',
            description: 'Info: pesticide name, dose, spray date',
            buttons: [
                { text: 'Add Pesticide', icon: 'fa-plus', class: 'btn-success', action: 'addPesticide' },
                { text: 'Edit Pesticide', icon: 'fa-pen', class: 'btn-primary', action: 'editPesticide' },
                { text: 'View List', icon: 'fa-list', class: 'btn-info', action: 'viewPesticideList' }
            ]
        },
        {
            id: 'irrigation',
            iconColor: 'blue',
            icon: 'fa-water',
            title: 'Irrigation (ജലസേചനം)',
            description: 'Records: date, time, irrigation method',
            buttons: [
                { text: 'Add Irrigation', icon: 'fa-plus', class: 'btn-success', action: 'addIrrigation' },
                { text: 'Edit Irrigation', icon: 'fa-pen', class: 'btn-primary', action: 'editIrrigation' },
                { text: 'View List', icon: 'fa-list', class: 'btn-info', action: 'viewIrrigationList' }
            ]
        },
        {
            id: 'harvest',
            iconColor: 'green',
            icon: 'fa-wheat-awn',
            title: 'Harvest (വിളവെടുപ്പ്)',
            description: 'Details: crop name, weight, harvest date',
            buttons: [
                { text: 'Add Harvest', icon: 'fa-plus', class: 'btn-success', action: 'addHarvest' },
                { text: 'Edit Harvest', icon: 'fa-pen', class: 'btn-primary', action: 'editHarvest' },
                { text: 'View List', icon: 'fa-list', class: 'btn-info', action: 'viewHarvestList' }
            ]
        },
        {
            id: 'sales',
            iconColor: 'orange',
            icon: 'fa-hand-holding-dollar',
            title: 'Sales (വിൽപ്പന)',
            description: 'Sales: bananas, pepper, other produce — price, buyer info',
            buttons: [
                { text: 'Add Sale', icon: 'fa-plus', class: 'btn-success', action: 'addSale' },
                { text: 'Edit Sale', icon: 'fa-pen', class: 'btn-primary', action: 'editSale' },
                { text: 'View List', icon: 'fa-list', class: 'btn-info', action: 'viewSaleList' }
            ]
        },
        {
            id: 'drying',
            iconColor: 'yellow',
            icon: 'fa-sun',
            title: 'Drying (ഉണക്കൽ)',
            description: 'Drying: quantity sent, dry weight after, charges',
            buttons: [
                { text: 'Add Drying', icon: 'fa-plus', class: 'btn-success', action: 'addDrying' },
                { text: 'Edit Drying', icon: 'fa-pen', class: 'btn-primary', action: 'editDrying' },
                { text: 'View List', icon: 'fa-list', class: 'btn-info', action: 'viewDryingList' }
            ]
        },
        {
            id: 'equipment',
            iconColor: 'purple',
            icon: 'fa-wrench',
            title: 'Equipment (ഉപകരണങ്ങൾ)',
            description: 'Equipment: sprayers, pumps, machines — service info',
            buttons: [
                { text: 'Add Equipment', icon: 'fa-plus', class: 'btn-success', action: 'addEquipment' },
                { text: 'Edit Equipment', icon: 'fa-pen', class: 'btn-primary', action: 'editEquipment' },
                { text: 'View List', icon: 'fa-list', class: 'btn-info', action: 'viewEquipmentList' }
            ]
        }
    ];

    // Clear container
    container.innerHTML = '';

    // Render each card
    entryCards.forEach((card) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'stat-card entry-card';
        cardEl.setAttribute('data-card-id', card.id);

        // Card header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '15px';
        header.style.marginBottom = '15px';

        // Icon
        const iconDiv = document.createElement('div');
        iconDiv.className = `stat-icon icon-${card.iconColor}`;
        iconDiv.innerHTML = `<i class="fas ${card.icon}"></i>`;

        // Title & Description
        const textDiv = document.createElement('div');
        textDiv.style.flex = '1';

        const title = document.createElement('h4');
        title.textContent = card.title;
        title.style.margin = '0 0 5px 0';

        const desc = document.createElement('p');
        desc.textContent = card.description;
        desc.style.margin = '0';
        desc.style.fontSize = '12px';
        desc.style.color = '#666';

        textDiv.appendChild(title);
        textDiv.appendChild(desc);

        header.appendChild(iconDiv);
        header.appendChild(textDiv);
        cardEl.appendChild(header);

        // Divider
        const hr = document.createElement('hr');
        hr.style.margin = '15px 0';
        hr.style.border = 'none';
        hr.style.borderTop = '1px solid #e0e0e0';
        cardEl.appendChild(hr);

        // Buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.gap = '8px';
        buttonsDiv.style.flexWrap = 'wrap';

        card.buttons.forEach((btn) => {
            const button = document.createElement('button');
            button.className = `btn ${btn.class}`;
            button.innerHTML = `<i class="fas ${btn.icon}"></i> ${btn.text}`;
            button.style.flex = '1';
            button.style.minWidth = '80px';
            button.style.padding = '8px 12px';
            button.style.fontSize = '12px';
            button.style.border = 'none';
            button.style.borderRadius = '6px';
            button.style.cursor = 'pointer';
            button.style.transition = 'transform 200ms, box-shadow 200ms';

            // Apply class-based styles
            if (btn.class === 'btn-success') {
                button.style.background = '#10b981';
                button.style.color = 'white';
            } else if (btn.class === 'btn-primary') {
                button.style.background = '#3b82f6';
                button.style.color = 'white';
            } else if (btn.class === 'btn-info') {
                button.style.background = '#0ea5e9';
                button.style.color = 'white';
            }

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });

            button.addEventListener('click', () => {
                if (typeof window[btn.action] === 'function') {
                    window[btn.action]();
                } else {
                    console.log(`Action: ${btn.action}`);
                }
            });

            buttonsDiv.appendChild(button);
        });

        cardEl.appendChild(buttonsDiv);
        container.appendChild(cardEl);
    });
}

/* ==========================================
   ACTION PLACEHOLDER FUNCTIONS
   - Safe: only define if not already present
========================================== */

window.addWorker = window.addWorker || function () { console.log('addWorker'); };
window.editWorker = window.editWorker || function () { console.log('editWorker'); };
window.viewWorkerList = window.viewWorkerList || function () { console.log('viewWorkerList'); };

window.addFarmTask = window.addFarmTask || function () { console.log('addFarmTask'); };
window.editFarmTask = window.editFarmTask || function () { console.log('editFarmTask'); };
window.viewFarmTaskList = window.viewFarmTaskList || function () { console.log('viewFarmTaskList'); };

window.addFertilizer = window.addFertilizer || function () { console.log('addFertilizer'); };
window.editFertilizer = window.editFertilizer || function () { console.log('editFertilizer'); };
window.viewFertilizerList = window.viewFertilizerList || function () { console.log('viewFertilizerList'); };

window.addPesticide = window.addPesticide || function () { console.log('addPesticide'); };
window.editPesticide = window.editPesticide || function () { console.log('editPesticide'); };
window.viewPesticideList = window.viewPesticideList || function () { console.log('viewPesticideList'); };

window.addIrrigation = window.addIrrigation || function () { console.log('addIrrigation'); };
window.editIrrigation = window.editIrrigation || function () { console.log('editIrrigation'); };
window.viewIrrigationList = window.viewIrrigationList || function () { console.log('viewIrrigationList'); };

window.addHarvest = window.addHarvest || function () { console.log('addHarvest'); };
window.editHarvest = window.editHarvest || function () { console.log('editHarvest'); };
window.viewHarvestList = window.viewHarvestList || function () { console.log('viewHarvestList'); };

window.addSale = window.addSale || function () { console.log('addSale'); };
window.editSale = window.editSale || function () { console.log('editSale'); };
window.viewSaleList = window.viewSaleList || function () { console.log('viewSaleList'); };

window.addDrying = window.addDrying || function () { console.log('addDrying'); };
window.editDrying = window.editDrying || function () { console.log('editDrying'); };
window.viewDryingList = window.viewDryingList || function () { console.log('viewDryingList'); };

window.addEquipment = window.addEquipment || function () { console.log('addEquipment'); };
window.editEquipment = window.editEquipment || function () { console.log('editEquipment'); };
window.viewEquipmentList = window.viewEquipmentList || function () { console.log('viewEquipmentList'); };

/* ==========================================
   INITIALIZE ON PAGE LOAD
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderEntryCards();
});
