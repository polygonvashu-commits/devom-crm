import { mockAgents } from '../data/mockAgents.js';
import { mockLeads, saveLeadsToStorage } from '../data/mockLeads.js';
import { roundRobin } from '../utils/roundRobin.js';

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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <p style="font-size: 14px; font-weight: 500;">Status: <span style="color: var(--status-won); font-weight: 700;">ACTIVE</span></p>
            <p style="font-size: 12px; color: var(--text-muted);">Incoming leads are automatically assigned to the next online agent.</p>
          </div>
          <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 26px;">
            <input type="checkbox" checked id="rr-toggle-switch" style="opacity: 0; width: 0; height: 0;">
            <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--accent-color); transition: .4s; border-radius: 34px;"></span>
          </label>
        </div>

        <div style="background: rgba(240, 244, 248, 0.03); border: 1px solid rgba(240,244,248,0.08); padding: 16px; border-radius: 8px;">
          <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; letter-spacing: 0.5px;">Assignment Queue Order</h4>
          <div style="display: flex; gap: 10px; align-items: center; overflow-x: auto; padding-bottom: 8px;" id="queue-order-list">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>

      <!-- Admin Manual Override Panel (Naveen Rathee) -->
      <div class="card">
        <h3 style="font-family: var(--font-headline); margin-bottom: 16px; font-size: 20px; color: var(--accent-color);">
          <i class="fa-solid fa-user-gear"></i> Admin Override Panel
        </h3>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">
          As Super Administrator, <strong>Mr. Naveen Rathee</strong> can manually override automated routing to assign high-priority leads.
        </p>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="override-lead-select">Select Active Lead</label>
              <select id="override-lead-select" class="form-control">
                <option value="">-- Select Active Lead --</option>
                ${unassignedLeads.map(l => `<option value="${l.id}">${l.name} (${l.intent} - ${l.scoreLabel.toUpperCase()})</option>`).join('')}
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

    <!-- Main Grid: Agent Roster Cards -->
    <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 24px; border-bottom: 1px solid rgba(240, 244, 248, 0.08); padding-bottom: 8px;">
      Agent Performance Roster
    </h3>
    
    <div class="agent-grid animate-on-scroll" style="margin-bottom: 40px;">
      ${mockAgents.map(agent => {
        const isOnline = agent.status === 'online';
        const isBusy = agent.status === 'busy';
        
        return `
          <div class="card agent-card">
            <div class="agent-header">
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
