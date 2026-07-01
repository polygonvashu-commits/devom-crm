import { mockAgents, saveAgentsToStorage } from '../data/mockAgents.js';
import { mockLeads, saveLeadsToStorage } from '../data/mockLeads.js';
import { roundRobin } from '../utils/roundRobin.js';
import { calculateLeadScore, getScoreLabel } from '../utils/leadScoring.js';

let agentPerformanceChart = null;
let agentResponseTimeChart = null;

export function renderAgentPanel(container) {
  // Generate leads dropdown for manual override
  const unassignedLeads = mockLeads.filter(l => l.status !== 'closed_won' && l.status !== 'closed_lost');

  container.innerHTML = `
    <!-- Top Row: Strategy Config & Round Robin Status -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px;">
      
      <!-- Round-Robin Controller -->
      <div class="card">
        <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 20px; color: var(--accent-color);">
          <i class="fa-solid fa-rotate"></i> Automated Lead Router (Round-Robin)
        </h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h4 style="font-size: 15px; font-weight: 700;">Queue Routing State</h4>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Instantly assign incoming ads/web leads to online agents in cycles.</p>
          </div>
          <label class="switch">
            <input type="checkbox" id="rr-toggle-switch" checked>
            <span class="slider round"></span>
          </label>
        </div>

        <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; margin-bottom: 12px;">Active Queue Order</h4>
        <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 10px;" id="queue-order-list">
          <!-- Populated dynamically -->
        </div>
      </div>

      <!-- Manual Assignment Override Panel -->
      <div class="card">
        <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 20px; color: var(--accent-color);">
          <i class="fa-solid fa-user-gear"></i> Manual Lead Assignment Override
        </h3>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="override-lead-select">Select Active Lead</label>
              <select id="override-lead-select" class="form-control">
                <option value="">-- Choose Lead --</option>
                ${unassignedLeads.map(l => `<option value="${l.id}">${l.name} (${l.intent})</option>`).join('')}
              </select>
            </div>
            
            <div class="form-group" style="margin-bottom: 0;">
              <label for="override-agent-select">Assign To Agent</label>
              <select id="override-agent-select" class="form-control">
                <option value="">-- Choose Agent --</option>
                ${mockAgents.map(a => `<option value="${a.id}">${a.name} (${a.status})</option>`).join('')}
              </select>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-execute-override" style="align-self: flex-end; margin-top: 8px;">
            <i class="fa-solid fa-check"></i> Assign Lead & Notify Agent
          </button>
        </div>
      </div>

    </div>

    <!-- Quick Admin Actions: Add Lead & Add Agent -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
      
      <!-- Quick Ingest Lead Card -->
      <div class="card" style="padding: 24px; display: flex; flex-direction: column;">
        <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 20px; color: var(--accent-color);">
          <i class="fa-solid fa-user-plus"></i> Ingest New Lead (Admin)
        </h3>
        <form id="admin-add-lead-form" style="display: flex; flex-direction: column; gap: 12px; flex: 1; justify-content: space-between;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Full Name</label>
                <input type="text" id="admin-lead-name" class="form-control" required placeholder="e.g. Sameer Sen">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Phone Number</label>
                <input type="text" id="admin-lead-phone" class="form-control" required placeholder="+91 XXXXX XXXXX">
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Property Interest</label>
                <select id="admin-lead-intent" class="form-control">
                  <option value="Luxury Villa">Luxury Villa</option>
                  <option value="Premium Apartment">Premium Apartment</option>
                  <option value="Commercial Space">Commercial Space</option>
                  <option value="Plots & Land">Plots & Land</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Budget</label>
                <select id="admin-lead-budget" class="form-control">
                  <option value="₹1.5 - 2.0 Cr">₹1.5 - 2.0 Cr</option>
                  <option value="₹3.5 - 4.5 Cr">₹3.5 - 4.5 Cr</option>
                  <option value="₹5.5 - 6.5 Cr">₹5.5 - 6.5 Cr</option>
                  <option value="₹8.0 - 10.0 Cr">₹8.0 - 10.0 Cr</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 15px; align-self: flex-start;">
            <i class="fa-solid fa-plus"></i> Ingest Lead
          </button>
        </form>
      </div>

      <!-- Add New Agent Card -->
      <div class="card" style="padding: 24px; display: flex; flex-direction: column;">
        <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 20px; color: var(--accent-color);">
          <i class="fa-solid fa-user-plus"></i> Add New Agent
        </h3>
        <form id="admin-add-agent-form" style="display: flex; flex-direction: column; gap: 12px; flex: 1; justify-content: space-between;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Agent Name</label>
                <input type="text" id="admin-agent-name" class="form-control" required placeholder="e.g. Rahul Verma">
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Email Address</label>
                <input type="email" id="admin-agent-email" class="form-control" required placeholder="rahul@devomgroup.in">
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label>Specialization</label>
                <select id="admin-agent-spec" class="form-control">
                  <option value="Luxury Villas">Luxury Villas</option>
                  <option value="Premium Apartments">Premium Apartments</option>
                  <option value="Commercial Space">Commercial Space</option>
                  <option value="Plots & Land">Plots & Land</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label>Status</label>
                <select id="admin-agent-status" class="form-control">
                  <option value="online">Online</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 15px; align-self: flex-start;">
            <i class="fa-solid fa-plus"></i> Add Agent
          </button>
        </form>
      </div>

    </div>

    <!-- Main Grid: Agent Roster Cards -->
    <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 24px; border-bottom: 1px solid rgba(240, 244, 248, 0.08); padding-bottom: 8px;">
      Agent Performance Roster
    </h3>
    
    <div class="agent-grid animate-on-scroll" style="margin-bottom: 40px;">
      ${mockAgents.map(agent => {
        return `
          <div class="card agent-card">
            <div class="agent-header" style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
              <div style="display: flex; gap: 12px; align-items: center;">
                <div class="profile-avatar" style="width: 48px; height: 48px; font-size: 16px; background: var(--accent-gradient); color: var(--primary-dark); font-weight: 700;">
                  ${agent.avatar}
                </div>
                <div>
                  <h4 style="font-size: 16px; font-weight: 700;">${agent.name}</h4>
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                    <span class="online-dot ${agent.status}"></span>
                    ${agent.status.toUpperCase()} • ${agent.specialization}
                  </div>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm edit-agent-btn" data-id="${agent.id}" style="padding: 4px 8px; font-size: 11px;">
                <i class="fa-regular fa-pen-to-square"></i> Edit
              </button>
            </div>

            <div class="agent-meta">
              <div class="agent-meta-item">
                <span>Active Leads</span>
                <strong>${agent.activeLeads}</strong>
              </div>
              <div class="agent-meta-item">
                <span>Total Leads</span>
                <strong>${agent.totalLeads}</strong>
              </div>
              <div class="agent-meta-item">
                <span>Conversion %</span>
                <strong style="color: var(--accent-color);">${agent.conversionRate}%</strong>
              </div>
              <div class="agent-meta-item">
                <span>Follow-up Speed</span>
                <strong>${agent.avgFollowUpHours} hrs</strong>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Charts Row -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px;">
      <div class="card" style="display: flex; flex-direction: column;">
        <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 20px;">Conversion Rate Comparison</h3>
        <div style="flex: 1; min-height: 250px; position: relative;">
          <canvas id="agentPerformanceChart"></canvas>
        </div>
      </div>

      <div class="card" style="display: flex; flex-direction: column;">
        <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 20px;">Avg Response Time (Hours)</h3>
        <div style="flex: 1; min-height: 250px; position: relative;">
          <canvas id="agentResponseTimeChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Edit Agent Modal -->
    <div id="edit-agent-modal" class="detail-overlay" style="display: none; align-items: center; justify-content: center; background: rgba(9, 27, 46, 0.75); z-index: 100000;">
      <div class="card" style="width: 450px; padding: 30px; position: relative; border: 1px solid var(--accent-color);">
        <button class="detail-close" id="close-edit-agent-modal" style="top: 16px; right: 16px;">&times;</button>
        <h3 style="font-family: var(--font-headline); color: var(--accent-color); margin-bottom: 20px; font-size: 20px;">
          <i class="fa-solid fa-user-pen"></i> Edit Agent Details
        </h3>
        
        <form id="edit-agent-form" style="display: flex; flex-direction: column; gap: 16px;">
          <input type="hidden" id="edit-agent-id">
          <div class="form-group" style="margin-bottom: 0;">
            <label>Agent Name</label>
            <input type="text" id="edit-agent-name" class="form-control" required>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>Specialization</label>
            <select id="edit-agent-spec" class="form-control">
              <option value="Luxury Villas">Luxury Villas</option>
              <option value="Premium Apartments">Premium Apartments</option>
              <option value="Commercial Space">Commercial Space</option>
              <option value="Plots & Land">Plots & Land</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>Routing Status</label>
            <select id="edit-agent-status" class="form-control">
              <option value="online">Online</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 10px; justify-content: center; width: 100%;">
            <i class="fa-solid fa-floppy-disk"></i> Save Agent Changes
          </button>
        </form>
      </div>
    </div>
  `;

  // Initialize interactive components
  renderQueueOrder();
  initAgentCharts();

  // Bind manual override execution
  document.getElementById('btn-execute-override').addEventListener('click', () => {
    const leadId = document.getElementById('override-lead-select').value;
    const agentId = document.getElementById('override-agent-select').value;

    if (!leadId || !agentId) {
      alert("Please select both a lead and an agent for reassignment.");
      return;
    }

    const lead = mockLeads.find(l => l.id === leadId);
    const agent = mockAgents.find(a => a.id === agentId);

    if (lead && agent) {
      const oldAgentId = lead.assignedAgent;
      lead.assignedAgent = agentId;
      lead.status = 'contacted'; // move from new to contacted upon assignment/reassignment

      // Log timeline entry
      lead.timeline.unshift({
        date: new Date().toISOString(),
        type: 'system',
        text: `Manually reassigned to ${agent.name} by Administrator Naveen Rathee`
      });

      // Update lead counts
      agent.activeLeads += 1;
      if (oldAgentId) {
        const oldAgent = mockAgents.find(a => a.id === oldAgentId);
        if (oldAgent) oldAgent.activeLeads = Math.max(0, oldAgent.activeLeads - 1);
      }

      saveLeadsToStorage();
      alert(`Lead "${lead.name}" has been successfully assigned to ${agent.name}.`);

      // Refresh panel
      renderAgentPanel(container);
    }
  });

  // Bind admin-add-lead-form submission
  document.getElementById('admin-add-lead-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('admin-lead-name').value.trim();
    const phone = document.getElementById('admin-lead-phone').value.trim();
    const intent = document.getElementById('admin-lead-intent').value;
    const budget = document.getElementById('admin-lead-budget').value;

    const score = calculateLeadScore(intent, budget, 'website');
    const scoreLabel = getScoreLabel(score);

    let assignedAgentId = null;
    const assignedAgent = roundRobin.assignNextLead(name, intent);
    if (assignedAgent) {
      assignedAgentId = assignedAgent.id;
      assignedAgent.activeLeads += 1;
    }

    const newLead = {
      id: `lead_${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@inquiry.com`,
      phone,
      source: 'website',
      status: 'new',
      score,
      scoreLabel,
      intent,
      assignedAgent: assignedAgentId,
      budget,
      location: 'Ingested via Admin Console',
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      propertyInterest: `Luxury Property Interest: ${intent}`,
      notes: 'Lead created via Administrator Quick Ingestion Panel.',
      timeline: [
        { date: new Date().toISOString(), type: 'system', text: 'Lead manually entered via Admin Panel.' }
      ]
    };

    if (assignedAgent) {
      newLead.timeline.unshift({
        date: new Date().toISOString(),
        type: 'system',
        text: `Automatically assigned to ${assignedAgent.name} (Round-Robin)`
      });
    }

    mockLeads.unshift(newLead);
    saveLeadsToStorage();
    alert(`Lead "${name}" successfully ingested and assigned!`);
    
    renderAgentPanel(container);
  });

  // Bind admin-add-agent-form submission
  document.getElementById('admin-add-agent-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('admin-agent-name').value.trim();
    const email = document.getElementById('admin-agent-email').value.trim();
    const spec = document.getElementById('admin-agent-spec').value;
    const status = document.getElementById('admin-agent-status').value;

    // Get initials for avatar
    const nameParts = name.split(' ');
    const avatar = nameParts.map(p => p[0]).join('').toUpperCase().substring(0, 2);

    const newAgent = {
      id: `agent_${Date.now()}`,
      name,
      avatar,
      email,
      phone: "+91 99999 XXXXX",
      activeLeads: 0,
      totalLeads: 0,
      conversionRate: 25.0,
      avgFollowUpHours: 1.0,
      status,
      specialization: spec
    };

    mockAgents.push(newAgent);
    saveAgentsToStorage();
    alert(`Agent "${name}" successfully added to the roster!`);
    
    renderAgentPanel(container);
  });

  // Bind Edit Agent click handlers
  document.querySelectorAll('.edit-agent-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const agentId = btn.dataset.id;
      const agent = mockAgents.find(a => a.id === agentId);

      if (agent) {
        document.getElementById('edit-agent-id').value = agent.id;
        document.getElementById('edit-agent-name').value = agent.name;
        document.getElementById('edit-agent-spec').value = agent.specialization;
        document.getElementById('edit-agent-status').value = agent.status;

        // Show Modal
        document.getElementById('edit-agent-modal').style.display = 'flex';
      }
    });
  });

  // Bind Close Edit Agent modal
  const closeEditModal = () => {
    document.getElementById('edit-agent-modal').style.display = 'none';
  };
  const closeBtn = document.getElementById('close-edit-agent-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeEditModal);

  // Bind Submit edit-agent-form
  document.getElementById('edit-agent-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const agentId = document.getElementById('edit-agent-id').value;
    const name = document.getElementById('edit-agent-name').value.trim();
    const spec = document.getElementById('edit-agent-spec').value;
    const status = document.getElementById('edit-agent-status').value;

    const agent = mockAgents.find(a => a.id === agentId);
    if (agent) {
      agent.name = name;
      agent.specialization = spec;
      agent.status = status;

      // Update avatar initials if name changed
      const nameParts = name.split(' ');
      agent.avatar = nameParts.map(p => p[0]).join('').toUpperCase().substring(0, 2);

      saveAgentsToStorage();
      closeEditModal();
      alert(`Agent "${name}" changes saved successfully!`);
      renderAgentPanel(container);
    }
  });
}

function renderQueueOrder() {
  const list = document.getElementById('queue-order-list');
  if (!list) return;

  const onlineAgents = mockAgents.filter(a => a.status !== 'offline');
  const queueIndex = roundRobin.getQueueIndex();

  list.innerHTML = onlineAgents.map((agent, index) => {
    const isNext = index === queueIndex;
    const borderStyle = isNext ? 'border: 2px solid var(--accent-color); background: rgba(197,160,89,0.08);' : 'border: 1px solid rgba(240,244,248,0.08);';
    
    return `
      <div style="flex-shrink: 0; padding: 8px 16px; border-radius: 6px; display: flex; align-items: center; gap: 8px; ${borderStyle}">
        ${isNext ? '<i class="fa-solid fa-arrow-right" style="color: var(--accent-color); font-size: 12px;"></i>' : ''}
        <div class="profile-avatar" style="width: 24px; height: 24px; font-size: 10px;">${agent.avatar}</div>
        <span style="font-size: 13px; font-weight: 500; color: ${isNext ? 'var(--accent-color)' : 'var(--text-light)'}">${agent.name}</span>
        ${isNext ? '<span style="font-size: 9px; font-weight: 700; color: var(--accent-color); text-transform: uppercase;">NEXT</span>' : ''}
      </div>
    `;
  }).join('');
}

function initAgentCharts() {
  const perfCtx = document.getElementById('agentPerformanceChart').getContext('2d');
  const responseCtx = document.getElementById('agentResponseTimeChart').getContext('2d');

  const names = mockAgents.map(a => a.name.split(' ')[0]);
  const rates = mockAgents.map(a => a.conversionRate);
  const speeds = mockAgents.map(a => a.avgFollowUpHours);

  // Clean old charts if they exist
  if (agentPerformanceChart) agentPerformanceChart.destroy();
  if (agentResponseTimeChart) agentResponseTimeChart.destroy();

  // Performance comparison bar chart
  agentPerformanceChart = new Chart(perfCtx, {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        label: 'Conversion Rate %',
        data: rates,
        backgroundColor: '#C5A059',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#F0F4F8' }, grid: { display: false } },
        y: { ticks: { color: '#F0F4F8' }, grid: { color: 'rgba(240,244,248,0.05)' } }
      }
    }
  });

  // Response speed line chart
  agentResponseTimeChart = new Chart(responseCtx, {
    type: 'line',
    data: {
      labels: names,
      datasets: [{
        label: 'Avg Response (Hrs)',
        data: speeds,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#F0F4F8' }, grid: { display: false } },
        y: { ticks: { color: '#F0F4F8' }, grid: { color: 'rgba(240,244,248,0.05)' } }
      }
    }
  });
}
