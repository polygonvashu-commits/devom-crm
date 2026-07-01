import { mockLeads } from '../data/mockLeads.js';
import { mockAgents } from '../data/mockAgents.js';
import { openLeadDetail } from './leadDetail.js';

// Mapping Kanban columns to lead statuses
const COLUMNS = [
  { id: 'awareness', label: 'Awareness', statuses: ['new'], color: '#3b82f6' },
  { id: 'interest', label: 'Interest', statuses: ['contacted'], color: '#8b5cf6' },
  { id: 'consideration', label: 'Consideration', statuses: ['qualified'], color: '#c5a059' },
  { id: 'negotiation', label: 'Negotiation', statuses: ['negotiation'], color: '#f59e0b' },
  { id: 'closed', label: 'Closed Deal', statuses: ['closed_won'], color: '#10b981' }
];

export function renderKanbanBoard(container) {
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <p style="color: var(--text-muted); font-size: 14px;">Drag and drop lead cards to update pipeline stages in real-time.</p>
      <div style="font-size: 16px; font-weight: 600; background: rgba(197,160,89,0.1); border: 1px solid var(--accent-color); padding: 8px 16px; border-radius: 8px;">
        Total Pipeline Value: <span id="pipeline-grand-total" style="color: var(--accent-color); font-weight: 800;">₹0.0 Cr</span>
      </div>
    </div>
    
    <div class="kanban-board" id="kanban-board-container">
      <!-- Columns populated here -->
    </div>
  `;

  renderColumns();
}

function renderColumns() {
  const container = document.getElementById('kanban-board-container');
  if (!container) return;

  let grandTotalValue = 0;

  const columnsHtml = COLUMNS.map(col => {
    // Filter leads matching this column's status
    const columnLeads = mockLeads.filter(lead => col.statuses.includes(lead.status));
    
    // Calculate total value for this column
    const columnTotalValue = columnLeads.reduce((sum, lead) => {
      let val = 1.5; // default 1.5 Cr
      if (lead.budget) {
        const matches = lead.budget.match(/[0-9.]+/g);
        if (matches && matches.length > 0) {
          val = matches.reduce((s, m) => s + parseFloat(m), 0) / matches.length;
        }
      }
      return sum + val;
    }, 0);

    grandTotalValue += columnTotalValue;

    const cardsHtml = columnLeads.map(lead => {
      const agent = mockAgents.find(a => a.id === lead.assignedAgent);
      const initials = agent ? agent.avatar : '??';
      const days = Math.floor((new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24));
      
      let badgeClass = 'cold';
      if (lead.scoreLabel === 'hot') badgeClass = 'hot';
      else if (lead.scoreLabel === 'warm') badgeClass = 'warm';

      return `
        <div class="kanban-card" draggable="true" data-id="${lead.id}">
          <div class="kanban-card-title">${lead.name}</div>
          <div class="kanban-card-subtitle">${lead.intent} • ${lead.location.split(',')[0]}</div>
          <div style="display: flex; gap: 6px; margin-bottom: 12px;">
            <span class="badge ${badgeClass === 'hot' ? 'badge-qualified' : badgeClass === 'warm' ? 'badge-new' : 'badge-lost'}" style="font-size: 9px; padding: 2px 6px;">
              ${lead.score} PTS
            </span>
            <span style="font-size: 10px; color: var(--text-muted); display: inline-flex; align-items: center; gap: 4px;">
              <i class="fa-regular fa-clock"></i> ${days}d ago
            </span>
          </div>
          <div class="kanban-card-footer">
            <span class="kanban-card-budget">${lead.budget || '—'}</span>
            <div class="kanban-card-agent" title="${agent ? agent.name : 'Unassigned'}">${initials}</div>
          </div>
        </div>
      `;
    }).join('');

    // Closed deal special class for visual feedback
    const specialClass = col.id === 'closed' ? 'style="border-top: 4px solid var(--status-won); box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);"' : `style="border-top: 4px solid ${col.color};"`;

    return `
      <div class="kanban-column" data-col-id="${col.id}" ${specialClass}>
        <div class="kanban-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${col.color};"></span>
            <h4 class="kanban-title">${col.label}</h4>
          </div>
          <span class="kanban-count">${columnLeads.length}</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px; font-weight: 500;">
          Value: <span style="color: var(--text-light);">₹${columnTotalValue.toFixed(1)} Cr</span>
        </div>
        <div class="kanban-cards" data-col-statuses="${col.statuses.join(',')}">
          ${cardsHtml}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = columnsHtml;

  // Set grand total
  const grandTotalEl = document.getElementById('pipeline-grand-total');
  if (grandTotalEl) {
    grandTotalEl.textContent = `₹${grandTotalValue.toFixed(1)} Cr`;
  }

  // Bind drag & drop handlers
  bindDragAndDrop();
}

function bindDragAndDrop() {
  const cards = document.querySelectorAll('.kanban-card');
  const columns = document.querySelectorAll('.kanban-column');

  cards.forEach(card => {
    card.addEventListener('dragstart', () => {
      card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    // Make cards clickable to open detail
    card.addEventListener('click', () => {
      const leadId = card.dataset.id;
      const lead = mockLeads.find(l => l.id === leadId);
      if (lead) {
        openLeadDetail(lead, () => {
          renderColumns();
        });
      }
    });
  });

  columns.forEach(column => {
    const cardsContainer = column.querySelector('.kanban-cards');
    
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      column.style.background = 'rgba(197, 160, 89, 0.05)';
    });

    column.addEventListener('dragleave', () => {
      column.style.background = 'rgba(15, 41, 66, 0.35)';
    });

    column.addEventListener('drop', () => {
      column.style.background = 'rgba(15, 41, 66, 0.35)';
      const draggingCard = document.querySelector('.dragging');
      if (!draggingCard) return;

      const leadId = draggingCard.dataset.id;
      const targetStatuses = cardsContainer.dataset.colStatuses.split(',');
      const primaryStatus = targetStatuses[0]; // Map to first status in column

      const lead = mockLeads.find(l => l.id === leadId);
      if (lead && lead.status !== primaryStatus) {
        const oldStatus = lead.status;
        lead.status = primaryStatus;
        
        // Log movement in timeline
        lead.timeline.unshift({
          date: new Date().toISOString(),
          type: 'system',
          text: `Pipeline stage changed from ${oldStatus.toUpperCase()} to ${primaryStatus.toUpperCase()}`
        });

        // Trigger special celebration effect if dropped in Closed Deal
        if (primaryStatus === 'closed_won') {
          triggerCelebration();
        }

        // Re-render columns to update values and placement
        renderColumns();
      }
    });
  });
}

function triggerCelebration() {
  const container = document.getElementById('kanban-board-container');
  if (!container) return;

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(197, 160, 89, 0.1)';
  overlay.style.zIndex = '9999';
  overlay.style.pointerEvents = 'none';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.animation = 'flashEffect 1s ease forwards';
  
  const text = document.createElement('h1');
  text.innerHTML = '🎉 Deal Closed! ₹';
  text.style.fontFamily = 'var(--font-headline)';
  text.style.color = 'var(--accent-color)';
  text.style.fontSize = '48px';
  text.style.textShadow = '0 0 20px rgba(197, 160, 89, 0.8)';
  text.style.transform = 'scale(0.5)';
  text.style.animation = 'scaleUpText 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

  overlay.appendChild(text);
  document.body.appendChild(overlay);

  // Add keyframes dynamically
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes flashEffect {
      0% { opacity: 0; background: rgba(16, 185, 129, 0.3); }
      50% { opacity: 1; background: rgba(197, 160, 89, 0.15); }
      100% { opacity: 0; }
    }
    @keyframes scaleUpText {
      0% { transform: scale(0.5); opacity: 0; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    overlay.remove();
    style.remove();
  }, 2000);
}
