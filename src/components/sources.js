import { mockLeads, saveLeadsToStorage } from '../data/mockLeads.js';
import { calculateLeadScore, getScoreLabel } from '../utils/leadScoring.js';
import { roundRobin } from '../utils/roundRobin.js';
import { mockAgents } from '../data/mockAgents.js';

export function renderSourcesPanel(container) {
  const metaLeads = mockLeads.filter(l => l.source === 'meta_ads').length;
  const googleLeads = mockLeads.filter(l => l.source === 'google_ads').length;
  const webLeads = mockLeads.filter(l => l.source === 'website').length;
  const socialLeads = mockLeads.filter(l => l.source === 'social_media').length;

  container.innerHTML = `
    <!-- Top Row: Source Connection Grid -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 30px;">
      
      <!-- Meta Ads -->
      <div class="card" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div style="font-size: 24px; color: #3b82f6;"><i class="fa-brands fa-facebook"></i></div>
          <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">Connected</span>
        </div>
        <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">Meta Ads</h4>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 16px;">FB & Instagram Lead Forms</p>
        <div style="margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-top: 1px solid rgba(240, 244, 248, 0.08); padding-top: 12px;">
          <div>
            <span style="font-size: 11px; color: var(--text-muted);">Leads</span>
            <strong style="display: block; font-size: 16px;">${metaLeads}</strong>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--text-muted);">Avg CPL</span>
            <strong style="display: block; font-size: 16px;">₹450</strong>
          </div>
        </div>
      </div>

      <!-- Google Ads -->
      <div class="card" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div style="font-size: 24px; color: #ea4335;"><i class="fa-brands fa-google"></i></div>
          <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">Connected</span>
        </div>
        <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">Google Ads</h4>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 16px;">Search & Display Campaigns</p>
        <div style="margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-top: 1px solid rgba(240, 244, 248, 0.08); padding-top: 12px;">
          <div>
            <span style="font-size: 11px; color: var(--text-muted);">Leads</span>
            <strong style="display: block; font-size: 16px;">${googleLeads}</strong>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--text-muted);">Avg CPL</span>
            <strong style="display: block; font-size: 16px;">₹680</strong>
          </div>
        </div>
      </div>

      <!-- Website Webhook -->
      <div class="card" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div style="font-size: 24px; color: var(--accent-color);"><i class="fa-solid fa-globe"></i></div>
          <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">SSL Secure</span>
        </div>
        <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">Website Webhook</h4>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 16px;">devomgroup.in lead capture</p>
        <div style="margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-top: 1px solid rgba(240, 244, 248, 0.08); padding-top: 12px;">
          <div>
            <span style="font-size: 11px; color: var(--text-muted);">Leads</span>
            <strong style="display: block; font-size: 16px;">${webLeads}</strong>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--text-muted);">SSL Status</span>
            <strong style="display: block; font-size: 14px; color: #10b981;"><i class="fa-solid fa-shield-halved"></i> Active</strong>
          </div>
        </div>
      </div>

      <!-- Social Media DMs -->
      <div class="card" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div style="font-size: 24px; color: #e1306c;"><i class="fa-brands fa-instagram"></i></div>
          <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">Connected</span>
        </div>
        <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">Social DMs</h4>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 16px;">Instagram & FB Direct Message</p>
        <div style="margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; border-top: 1px solid rgba(240, 244, 248, 0.08); padding-top: 12px;">
          <div>
            <span style="font-size: 11px; color: var(--text-muted);">Leads</span>
            <strong style="display: block; font-size: 16px;">${socialLeads}</strong>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--text-muted);">Channels</span>
            <strong style="display: block; font-size: 14px;">IG, FB, WA</strong>
          </div>
        </div>
      </div>

    </div>

    <!-- Webhook Integration Simulator & Payload Tester -->
    <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; margin-bottom: 20px;">
      
      <!-- Instructions & Code Snippet -->
      <div class="card">
        <h3 style="font-family: var(--font-headline); margin-bottom: 16px; font-size: 20px; color: var(--accent-color);">
          <i class="fa-solid fa-code"></i> Secure Webhook Integration (devomgroup.in)
        </h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;">
          Configure your website form to POST lead data securely to the CRM Webhook. All endpoints require SSL (HTTPS) to guarantee secure data transmission of client details.
        </p>

        <div style="margin-bottom: 16px;">
          <label style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 6px;">Secure Webhook URL</label>
          <div style="display: flex; gap: 8px;">
            <input type="text" readonly value="https://api.devomgroup.in/v1/webhooks/leads" class="form-control" style="flex: 1; font-family: monospace; font-size: 12px; background: rgba(0,0,0,0.2);">
            <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('https://api.devomgroup.in/v1/webhooks/leads'); alert('Copied webhook URL!')">
              <i class="fa-regular fa-copy"></i>
            </button>
          </div>
        </div>

        <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(240,244,248,0.08); border-radius: 8px; padding: 16px; font-family: monospace; font-size: 11px; overflow-x: auto; color: #a6e22e; line-height: 1.5;">
          <span style="color: #66d9ef;">POST</span> /v1/webhooks/leads HTTP/1.1<br>
          <span style="color: #f92672;">Host:</span> api.devomgroup.in<br>
          <span style="color: #f92672;">Content-Type:</span> application/json<br>
          <span style="color: #f92672;">Authorization:</span> Bearer devom_sec_token_9x28<br>
          <br>
          <span style="color: #f8f8f2;">{</span><br>
          &nbsp;&nbsp;<span style="color: #f92672;">"name"</span><span style="color: #f8f8f2;">:</span> <span style="color: #e6db74;">"Arvind Kejriwal"</span><br>
          &nbsp;&nbsp;<span style="color: #f92672;">"phone"</span><span style="color: #f8f8f2;">:</span> <span style="color: #e6db74;">"+91 99009 90099"</span><br>
          &nbsp;&nbsp;<span style="color: #f92672;">"email"</span><span style="color: #f8f8f2;">:</span> <span style="color: #e6db74;">"arvind@delhi.gov.in"</span><br>
          &nbsp;&nbsp;<span style="color: #f92672;">"intent"</span><span style="color: #f8f8f2;">:</span> <span style="color: #e6db74;">"Luxury Villa"</span><br>
          &nbsp;&nbsp;<span style="color: #f92672;">"budget"</span><span style="color: #f8f8f2;">:</span> <span style="color: #e6db74;">"₹5.5 - 6.5 Cr"</span><br>
          &nbsp;&nbsp;<span style="color: #f92672;">"location"</span><span style="color: #f8f8f2;">:</span> <span style="color: #e6db74;">"Chanakyapuri, Delhi"</span><br>
          <span style="color: #f8f8f2;">}</span>
        </div>
      </div>

      <!-- Live Webhook Payload simulator -->
      <div class="card" style="display: flex; flex-direction: column;">
        <h3 style="font-family: var(--font-headline); margin-bottom: 16px; font-size: 20px; color: var(--accent-color);">
          <i class="fa-solid fa-vial"></i> Live Webhook Tester
        </h3>
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 16px;">
          Submit a mock webhook request to trigger the scoring engine and automatic agent assignment (Round-Robin).
        </p>

        <div style="display: flex; flex-direction: column; gap: 12px; flex: 1;">
          <div class="form-group" style="margin-bottom: 0;">
            <label>Lead Full Name</label>
            <input type="text" id="sim-name" class="form-control" placeholder="e.g. Navjot Sidhu" value="Navjot Sidhu">
          </div>
          
          <div class="form-group" style="margin-bottom: 0;">
            <label>Lead Intent</label>
            <select id="sim-intent" class="form-control">
              <option value="Luxury Villa">Luxury Villa</option>
              <option value="Premium Apartment">Premium Apartment</option>
              <option value="Commercial Space">Commercial Space</option>
              <option value="Plots & Land">Plots & Land</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Budget Range</label>
              <select id="sim-budget" class="form-control">
                <option value="₹4.5 - 5.5 Cr">₹4.5 - 5.5 Cr</option>
                <option value="₹2.2 - 2.8 Cr">₹2.2 - 2.8 Cr</option>
                <option value="₹8.0 - 10.0 Cr">₹8.0 - 10.0 Cr</option>
                <option value="₹1.2 - 1.8 Cr">₹1.2 - 1.8 Cr</option>
              </select>
            </div>
            
            <div class="form-group" style="margin-bottom: 0;">
              <label>Source Channel</label>
              <select id="sim-source" class="form-control">
                <option value="website">devomgroup.in</option>
                <option value="meta_ads">Meta Ads</option>
                <option value="google_ads">Google Ads</option>
                <option value="social_media">Social DM</option>
              </select>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-submit-simulation" style="margin-top: auto; width: 100%; justify-content: center;">
            <i class="fa-solid fa-paper-plane"></i> Send Webhook Payload
          </button>
        </div>
      </div>

    </div>
  `;

  // Bind Webhook simulation triggers
  document.getElementById('btn-submit-simulation').addEventListener('click', () => {
    const name = document.getElementById('sim-name').value.trim();
    const intent = document.getElementById('sim-intent').value;
    const budget = document.getElementById('sim-budget').value;
    const source = document.getElementById('sim-source').value;

    if (!name) {
      alert("Please provide a Lead Name.");
      return;
    }

    // 1. Calculate Score
    const score = calculateLeadScore(intent, budget, source);
    const scoreLabel = getScoreLabel(score);

    // 2. Automated Round Robin Assignment
    const assignedAgent = roundRobin.assignNextLead(name, intent);
    const agentId = assignedAgent ? assignedAgent.id : null;

    // 3. Create lead record
    const newLead = {
      id: `lead_${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@webhooktest.com`,
      phone: `+91 99${Math.floor(10000000 + Math.random() * 90000000)}`,
      source,
      status: 'new',
      score,
      scoreLabel,
      intent,
      assignedAgent: agentId,
      budget,
      location: 'Simulated Webhook Location',
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      propertyInterest: `Simulated property request for ${intent}`,
      notes: 'Ingested via Live Webhook Simulator.',
      timeline: [
        { date: new Date().toISOString(), type: 'system', text: `Lead ingested via SSL Webhook.` }
      ]
    };

    if (assignedAgent) {
      newLead.timeline.unshift({
        date: new Date().toISOString(),
        type: 'system',
        text: `Lead routed to ${assignedAgent.name} (Round-Robin)`
      });
      assignedAgent.activeLeads += 1;
    }

    // Push to lead roster
    mockLeads.unshift(newLead);
    saveLeadsToStorage();

    // Flash/Notify user
    triggerNotificationToast(newLead, assignedAgent);

    // Re-render
    renderSourcesPanel(container);
  });
}

function triggerNotificationToast(lead, agent) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.background = 'rgba(15, 41, 66, 0.95)';
  toast.style.backdropFilter = 'blur(20px)';
  toast.style.border = '1px solid var(--accent-color)';
  toast.style.boxShadow = '0 8px 32px rgba(9, 27, 46, 0.5)';
  toast.style.borderRadius = '8px';
  toast.style.padding = '16px 20px';
  toast.style.zIndex = '99999';
  toast.style.display = 'flex';
  toast.style.gap = '12px';
  toast.style.alignItems = 'center';
  toast.style.animation = 'slideInToast 0.3s ease-out forwards';

  const assignmentText = agent ? `Assigned to <strong>${agent.name}</strong>` : 'Unassigned';

  toast.innerHTML = `
    <div style="font-size: 24px; color: var(--accent-color);"><i class="fa-regular fa-bell"></i></div>
    <div>
      <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 2px;">Lead Ingested Successfully!</h4>
      <p style="font-size: 12px; color: var(--text-muted);">${lead.name} (${lead.intent}) • Score: <strong>${lead.score}</strong> • ${assignmentText}</p>
    </div>
  `;

  // Add toast styling dynamically
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes slideInToast {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInToast 0.3s ease-out reverse';
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 300);
  }, 4000);
}
