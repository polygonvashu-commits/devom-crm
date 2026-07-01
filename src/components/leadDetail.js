import { mockAgents } from '../data/mockAgents.js';
import { mockLeads } from '../data/mockLeads.js';

let onCloseCallback = null;

export function openLeadDetail(lead, onClose) {
  onCloseCallback = onClose;
  const drawer = document.getElementById('detail-drawer');
  const content = document.getElementById('detail-content');
  
  if (!drawer || !content) return;

  const agent = mockAgents.find(a => a.id === lead.assignedAgent);
  const initials = agent ? agent.avatar : '??';

  let scoreColor = 'var(--text-muted)';
  if (lead.scoreLabel === 'hot') scoreColor = 'var(--accent-color)';
  else if (lead.scoreLabel === 'warm') scoreColor = '#3b82f6';

  // Calculate SVG circular score arc
  // Radius = 40, Circumference = 2 * PI * 40 = 251.3
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ - (lead.score / 100) * circ;

  content.innerHTML = `
    <!-- Slideout Header -->
    <div style="margin-bottom: 24px; border-bottom: 1px solid rgba(240,244,248,0.08); padding-bottom: 20px;">
      <h3 style="font-family: var(--font-headline); font-size: 26px; color: var(--text-light); margin-bottom: 6px;">${lead.name}</h3>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span class="badge badge-${lead.status.replace('_', '')}">${lead.status.toUpperCase().replace('_', ' ')}</span>
        <span style="font-size: 12px; color: var(--text-muted);"><i class="fa-solid fa-calendar"></i> Ingested: ${new Date(lead.createdAt).toLocaleDateString()}</span>
      </div>
    </div>

    <!-- Score Gauge -->
    <div style="display: flex; align-items: center; gap: 24px; background: rgba(240, 244, 248, 0.03); padding: 16px; border-radius: 8px; margin-bottom: 24px; border: 1px solid rgba(240,244,248,0.08);">
      <div style="position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;">
        <svg width="100" height="100" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
          <circle cx="50" cy="50" r="${radius}" fill="transparent" stroke="rgba(240,244,248,0.05)" stroke-width="8"></circle>
          <circle cx="50" cy="50" r="${radius}" fill="transparent" stroke="${scoreColor}" stroke-width="8" stroke-dasharray="${circ}" stroke-dashoffset="${strokeDashoffset}" style="transition: stroke-dashoffset 0.8s ease;"></circle>
        </svg>
        <div style="position: absolute; text-align: center; display: flex; flex-direction: column;">
          <span style="font-size: 20px; font-weight: 800; color: ${scoreColor};">${lead.score}</span>
          <span style="font-size: 9px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">SCORE</span>
        </div>
      </div>
      <div>
        <h4 style="font-size: 14px; font-weight: 700; color: ${scoreColor}; text-transform: uppercase; letter-spacing: 0.5px;">${lead.scoreLabel.toUpperCase()} LEAD</h4>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">Based on intent, budget requirements, and landing page source quality metrics.</p>
      </div>
    </div>

    <!-- Contact Info Card -->
    <div class="card" style="padding: 16px; margin-bottom: 24px; border-top: none;">
      <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; letter-spacing: 0.5px;">Contact Info</h4>
      <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="fa-regular fa-envelope" style="color: var(--accent-color); width: 16px;"></i>
          <span style="color: var(--text-light); word-break: break-all;">${lead.email}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="fa-solid fa-phone" style="color: var(--accent-color); width: 16px;"></i>
          <span style="color: var(--text-light);">${lead.phone}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="fa-solid fa-map-pin" style="color: var(--accent-color); width: 16px;"></i>
          <span style="color: var(--text-light);">${lead.location}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="fa-solid fa-indian-rupee-sign" style="color: var(--accent-color); width: 16px;"></i>
          <span style="color: var(--text-light); font-weight: 600;">${lead.budget || 'N/A'}</span>
        </div>
      </div>
    </div>

    <!-- Property Details -->
    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 0.5px;">Property Requirement</h4>
      <div style="font-size: 14px; font-weight: 500; color: var(--text-light);">${lead.intent}</div>
      <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">${lead.propertyInterest}</p>
    </div>

    <!-- Assignment Override Dropdown -->
    <div class="form-group" style="margin-bottom: 24px;">
      <label for="detail-assign-agent">Assigned Agent</label>
      <select id="detail-assign-agent" class="form-control">
        <option value="">-- Unassigned --</option>
        ${mockAgents.map(a => `<option value="${a.id}" ${lead.assignedAgent === a.id ? 'selected' : ''}>${a.name} (${a.status})</option>`).join('')}
      </select>
    </div>

    <!-- Timeline History -->
    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; letter-spacing: 0.5px;">Timeline Activities</h4>
      <div style="display: flex; flex-direction: column; gap: 16px; position: relative; padding-left: 20px; border-left: 1px solid rgba(240,244,248,0.08);">
        ${lead.timeline.map(item => {
          const itemDate = new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          let timelineIcon = '<i class="fa-solid fa-bolt" style="font-size: 9px;"></i>';
          let timelineBg = 'rgba(197, 160, 89, 0.2)';
          if (item.type === 'call') { timelineIcon = '<i class="fa-solid fa-phone" style="font-size: 9px;"></i>'; timelineBg = 'rgba(59, 130, 246, 0.2)'; }
          else if (item.type === 'meeting') { timelineIcon = '<i class="fa-solid fa-handshake" style="font-size: 9px;"></i>'; timelineBg = 'rgba(16, 185, 129, 0.2)'; }

          return `
            <div style="position: relative;">
              <!-- Timeline Dot -->
              <div style="position: absolute; left: -26px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: ${timelineBg}; display: flex; align-items: center; justify-content: center;">
                <span style="position: absolute; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-color);"></span>
              </div>
              <div style="font-size: 11px; color: var(--text-muted);">${itemDate}</div>
              <div style="font-size: 13px; color: var(--text-light); margin-top: 2px;">${item.text}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Notes Section -->
    <div style="margin-bottom: 30px;">
      <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; letter-spacing: 0.5px;">Interaction Notes</h4>
      <div style="background: rgba(0,0,0,0.15); border: 1px solid rgba(240,244,248,0.05); padding: 12px; border-radius: 6px; font-size: 12px; line-height: 1.5; color: var(--text-light); margin-bottom: 12px;" id="detail-notes-log">
        ${lead.notes || 'No notes logged yet.'}
      </div>
      <div style="display: flex; gap: 8px;">
        <input type="text" id="detail-new-note" class="form-control" placeholder="Add custom follow-up note..." style="flex: 1; padding: 8px 12px; font-size: 12px;">
        <button class="btn btn-primary" id="btn-add-detail-note" style="padding: 8px 16px; font-size: 12px;"><i class="fa-solid fa-plus"></i></button>
      </div>
    </div>

    <!-- Quick action buttons -->
    <div style="display: flex; gap: 12px;">
      <a href="tel:${lead.phone}" class="btn btn-primary" style="flex: 1; justify-content: center;"><i class="fa-solid fa-phone"></i> Call Now</a>
      <a href="mailto:${lead.email}" class="btn btn-secondary" style="flex: 1; justify-content: center;"><i class="fa-regular fa-envelope"></i> Email</a>
    </div>
  `;

  // Bind change agent dropdown
  const agentSelect = document.getElementById('detail-assign-agent');
  agentSelect.addEventListener('change', (e) => {
    const newAgentId = e.target.value;
    const oldAgentId = lead.assignedAgent;
    
    lead.assignedAgent = newAgentId || null;
    
    // Log timeline
    const selectedAgentName = newAgentId ? mockAgents.find(a => a.id === newAgentId).name : 'Unassigned';
    lead.timeline.unshift({
      date: new Date().toISOString(),
      type: 'system',
      text: `Assigned agent updated to: ${selectedAgentName}`
    });

    // Update active leads counts
    if (newAgentId) {
      const newAgent = mockAgents.find(a => a.id === newAgentId);
      if (newAgent) newAgent.activeLeads += 1;
    }
    if (oldAgentId) {
      const oldAgent = mockAgents.find(a => a.id === oldAgentId);
      if (oldAgent) oldAgent.activeLeads = Math.max(0, oldAgent.activeLeads - 1);
    }

    openLeadDetail(lead, onCloseCallback); // refresh panel
  });

  // Bind note submission
  document.getElementById('btn-add-detail-note').addEventListener('click', () => {
    const noteInput = document.getElementById('detail-new-note');
    const noteText = noteInput.value.trim();
    if (!noteText) return;

    // Append to notes
    lead.notes = lead.notes ? `${lead.notes}<br>• ${noteText}` : `• ${noteText}`;
    
    // Log timeline
    lead.timeline.unshift({
      date: new Date().toISOString(),
      type: 'system',
      text: `New note added: "${noteText}"`
    });

    noteInput.value = '';
    openLeadDetail(lead, onCloseCallback); // refresh panel
  });

  // Slide Drawer Active
  drawer.classList.add('active');
}

// Close handler binding
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('close-drawer');
  const drawer = document.getElementById('detail-drawer');

  const closeDrawer = () => {
    if (drawer) {
      drawer.classList.remove('active');
      if (onCloseCallback) onCloseCallback();
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer();
    });
  }
});
