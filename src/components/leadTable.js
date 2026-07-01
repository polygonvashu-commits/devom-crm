import { mockLeads } from '../data/mockLeads.js';
import { mockAgents } from '../data/mockAgents.js';
import { openLeadDetail } from './leadDetail.js';

let currentFilters = {
  search: '',
  source: 'all',
  status: 'all',
  score: 'all'
};

export function renderLeadsTable(container) {
  container.innerHTML = `
    <div class="card" style="margin-bottom: 24px; padding: 20px;">
      <!-- Filters Row -->
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        
        <div style="position: relative; flex: 1; min-width: 250px;">
          <input type="text" id="filter-search" class="form-control" placeholder="Search by name, email, phone..." style="padding-left: 36px; width: 100%;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 13px;"></i>
        </div>

        <div class="form-group" style="margin-bottom: 0; min-width: 140px;">
          <select id="filter-source" class="form-control">
            <option value="all">All Sources</option>
            <option value="meta_ads">Meta Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="website">Website</option>
            <option value="social_media">Social Media</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 0; min-width: 140px;">
          <select id="filter-status" class="form-control">
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed_won">Closed Won</option>
            <option value="closed_lost">Closed Lost</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 0; min-width: 140px;">
          <select id="filter-score" class="form-control">
            <option value="all">All Intent Scores</option>
            <option value="hot">Hot 🔥 (80+)</option>
            <option value="warm">Warm (40-79)</option>
            <option value="cold">Cold (<40)</option>
          </select>
        </div>

        <button class="btn btn-primary" id="btn-add-lead-modal">
          <i class="fa-solid fa-plus"></i> Add Lead
        </button>

      </div>
    </div>

    <!-- Bulk Action bar -->
    <div id="bulk-actions" class="card" style="display: none; margin-bottom: 16px; padding: 12px 20px; background: rgba(197, 160, 89, 0.1); border-color: var(--accent-color); flex-direction: row; justify-content: space-between; align-items: center;">
      <div style="font-size: 14px; font-weight: 500;">
        <span id="selected-count" style="color: var(--accent-color); font-weight: 700; margin-right: 4px;">0</span> leads selected
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <span style="font-size: 12px; color: var(--text-muted);">Bulk Action:</span>
        <select id="bulk-agent" class="form-control" style="padding: 6px 12px; font-size: 12px;">
          <option value="">Assign to Agent...</option>
          ${mockAgents.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
        </select>
        <button class="btn btn-primary btn-sm" id="btn-apply-bulk" style="padding: 6px 16px; font-size: 12px;">Apply</button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="card" style="padding: 0;">
      <div class="table-container">
        <table class="lead-table">
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;"><input type="checkbox" id="select-all-leads"></th>
              <th>Lead Name</th>
              <th>Source</th>
              <th>Intent</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Score</th>
              <th>Assigned Agent</th>
              <th>Last Contact</th>
            </tr>
          </thead>
          <tbody id="leads-table-body">
            <!-- Dynamic lead rows -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Bind input listeners
  const filterSearch = document.getElementById('filter-search');
  const filterSource = document.getElementById('filter-source');
  const filterStatus = document.getElementById('filter-status');
  const filterScore = document.getElementById('filter-score');

  filterSearch.value = currentFilters.search;
  filterSource.value = currentFilters.source;
  filterStatus.value = currentFilters.status;
  filterScore.value = currentFilters.score;

  const updateTable = () => {
    currentFilters.search = filterSearch.value.trim().toLowerCase();
    currentFilters.source = filterSource.value;
    currentFilters.status = filterStatus.value;
    currentFilters.score = filterScore.value;
    renderRows();
  };

  filterSearch.addEventListener('input', updateTable);
  filterSource.addEventListener('change', updateTable);
  filterStatus.addEventListener('change', updateTable);
  filterScore.addEventListener('change', updateTable);

  document.getElementById('select-all-leads').addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.lead-select-checkbox');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
    toggleBulkBar();
  });

  document.getElementById('btn-apply-bulk').addEventListener('click', applyBulkAssignment);

  // Initial rows render
  renderRows();
}

function renderRows() {
  const tbody = document.getElementById('leads-table-body');
  if (!tbody) return;

  const filtered = mockLeads.filter(lead => {
    // 1. Search filter
    const matchesSearch = !currentFilters.search || 
      lead.name.toLowerCase().includes(currentFilters.search) ||
      lead.email.toLowerCase().includes(currentFilters.search) ||
      lead.phone.includes(currentFilters.search) ||
      lead.location.toLowerCase().includes(currentFilters.search);
    
    // 2. Source filter
    const matchesSource = currentFilters.source === 'all' || lead.source === currentFilters.source;

    // 3. Status filter
    const matchesStatus = currentFilters.status === 'all' || lead.status === currentFilters.status;

    // 4. Score filter
    const matchesScore = currentFilters.score === 'all' || lead.scoreLabel === currentFilters.score;

    return matchesSearch && matchesSource && matchesStatus && matchesScore;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 40px; color: var(--text-muted);">No leads found matching the filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(lead => {
    const agent = mockAgents.find(a => a.id === lead.assignedAgent);
    const agentName = agent ? agent.name : '<span style="color: var(--text-muted); font-style: italic;">Unassigned</span>';
    const lastContactStr = new Date(lead.lastContact).toLocaleDateString([], { month: 'short', day: 'numeric' });

    let sourceIcon = '';
    if (lead.source === 'meta_ads') sourceIcon = '<i class="fa-brands fa-facebook" style="color: #3b82f6; margin-right: 6px;"></i> Meta';
    else if (lead.source === 'google_ads') sourceIcon = '<i class="fa-brands fa-google" style="color: #ea4335; margin-right: 6px;"></i> Google';
    else if (lead.source === 'website') sourceIcon = '<i class="fa-solid fa-globe" style="color: var(--accent-color); margin-right: 6px;"></i> Web';
    else if (lead.source === 'social_media') sourceIcon = '<i class="fa-brands fa-instagram" style="color: #e1306c; margin-right: 6px;"></i> Social';

    let scoreBadge = '';
    if (lead.scoreLabel === 'hot') scoreBadge = '<span class="score-badge hot">HOT 🔥</span>';
    else if (lead.scoreLabel === 'warm') scoreBadge = '<span class="score-badge warm">WARM</span>';
    else scoreBadge = '<span class="score-badge cold">COLD</span>';

    return `
      <tr class="lead-row-item" data-id="${lead.id}">
        <td style="text-align: center;" onclick="event.stopPropagation();">
          <input type="checkbox" class="lead-select-checkbox" data-id="${lead.id}">
        </td>
        <td style="font-weight: 600; color: var(--text-light);">${lead.name}</td>
        <td>${sourceIcon}</td>
        <td>${lead.intent}</td>
        <td>${lead.budget || '—'}</td>
        <td><span class="badge badge-${lead.status.replace('_', '')}">${lead.status.toUpperCase().replace('_', ' ')}</span></td>
        <td>${scoreBadge}</td>
        <td>${agentName}</td>
        <td style="color: var(--text-muted);">${lastContactStr}</td>
      </tr>
    `;
  }).join('');

  // Bind clicks for row selection to view details
  tbody.querySelectorAll('.lead-row-item').forEach(row => {
    row.addEventListener('click', () => {
      const leadId = row.dataset.id;
      const lead = mockLeads.find(l => l.id === leadId);
      if (lead) {
        openLeadDetail(lead, () => {
          // Re-render rows when agent or status updates inside detail panel
          renderRows();
        });
      }
    });
  });

  // Bind select checkboxes
  tbody.querySelectorAll('.lead-select-checkbox').forEach(cb => {
    cb.addEventListener('change', toggleBulkBar);
  });
}

function toggleBulkBar() {
  const selectedCbs = document.querySelectorAll('.lead-select-checkbox:checked');
  const bulkBar = document.getElementById('bulk-actions');
  const countSpan = document.getElementById('selected-count');
  
  if (selectedCbs.length > 0) {
    bulkBar.style.display = 'flex';
    countSpan.textContent = selectedCbs.length;
  } else {
    bulkBar.style.display = 'none';
  }
}

function applyBulkAssignment() {
  const selectedCbs = document.querySelectorAll('.lead-select-checkbox:checked');
  const agentId = document.getElementById('bulk-agent').value;

  if (selectedCbs.length === 0 || !agentId) return;

  selectedCbs.forEach(cb => {
    const leadId = cb.dataset.id;
    const lead = mockLeads.find(l => l.id === leadId);
    if (lead) {
      lead.assignedAgent = agentId;
      lead.timeline.unshift({
        date: new Date().toISOString(),
        type: 'system',
        text: `Bulk reassigned to agent.`
      });
    }
  });

  // Reset checkboxes
  document.getElementById('select-all-leads').checked = false;
  selectedCbs.forEach(cb => cb.checked = false);
  toggleBulkBar();

  // Re-render table rows
  renderRows();
}
