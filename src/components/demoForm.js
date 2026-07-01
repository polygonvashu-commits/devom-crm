import { mockLeads, saveLeadsToStorage } from '../data/mockLeads.js';
import { mockAgents } from '../data/mockAgents.js';
import { calculateLeadScore, getScoreLabel } from '../utils/leadScoring.js';
import { roundRobin } from '../utils/roundRobin.js';

export function renderDemoFormView(container) {
  container.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; animation: fadeIn 0.5s ease-out;">
      <div class="card" style="padding: 40px; background: rgba(15, 41, 66, 0.85); border: 1px solid var(--glass-border); position: relative; overflow: hidden;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-family: var(--font-headline); font-size: 26px; color: var(--accent-color); margin-bottom: 6px;">DEV OM Group</h1>
          <p style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 2px;">Luxury Collection Inquiry Form</p>
        </div>

        <form id="public-inquiry-form" style="display: flex; flex-direction: column; gap: 20px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label>Full Name</label>
            <input type="text" id="form-name" class="form-control" required placeholder="e.g. Vikramaditya Rao" style="width: 100%;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Email Address</label>
              <input type="email" id="form-email" class="form-control" required placeholder="name@email.com" style="width: 100%;">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label>Phone Number</label>
              <input type="text" id="form-phone" class="form-control" required placeholder="+91 XXXXX XXXXX" style="width: 100%;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label>Property Interest</label>
              <select id="form-intent" class="form-control" style="width: 100%;">
                <option value="Luxury Villa">Luxury Villa (Gurgaon)</option>
                <option value="Premium Apartment">Premium Apartment (Sohna Road)</option>
                <option value="Commercial Space">Commercial Space (DEV OM Towers)</option>
                <option value="Plots & Land">Residential Plot (New Chandigarh)</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label>Budget Allocation</label>
              <select id="form-budget" class="form-control" style="width: 100%;">
                <option value="₹1.5 - 2.0 Cr">₹1.5 - 2.0 Cr</option>
                <option value="₹2.2 - 2.8 Cr">₹2.2 - 2.8 Cr</option>
                <option value="₹3.5 - 4.5 Cr">₹3.5 - 4.5 Cr</option>
                <option value="₹5.5 - 6.5 Cr">₹5.5 - 6.5 Cr</option>
                <option value="₹8.0 - 10.0 Cr">₹8.0 - 10.0 Cr</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label>Location Preference</label>
            <input type="text" id="form-location" class="form-control" required placeholder="e.g. Golf Course Extension Road, Gurgaon" style="width: 100%;">
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label>Custom Message</label>
            <textarea id="form-message" class="form-control" rows="3" placeholder="Describe your specific property requirements..." style="width: 100%; resize: none; background: rgba(0,0,0,0.15); border: 1px solid rgba(240,244,248,0.08); border-radius: 4px; padding: 10px 12px; color: var(--text-light); font-family: inherit; font-size: 13px;"></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; margin-top: 10px;">
            <i class="fa-solid fa-paper-plane"></i> Submit Inquiry
          </button>
        </form>
      </div>
    </div>
  `;

  // Bind Submit event
  document.getElementById('public-inquiry-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const intent = document.getElementById('form-intent').value;
    const budget = document.getElementById('form-budget').value;
    const location = document.getElementById('form-location').value.trim();
    const message = document.getElementById('form-message').value.trim();

    // 1. Score lead
    const score = calculateLeadScore(intent, budget, 'website');
    const scoreLabel = getScoreLabel(score);

    // 2. Assign agent via Round Robin
    let assignedAgentId = null;
    const assignedAgent = roundRobin.assignNextLead(name, intent);
    if (assignedAgent) {
      assignedAgentId = assignedAgent.id;
      assignedAgent.activeLeads += 1;
    }

    // 3. Create lead record
    const newLead = {
      id: `lead_${Date.now()}`,
      name,
      email,
      phone,
      source: 'website',
      status: 'new',
      score,
      scoreLabel,
      intent,
      assignedAgent: assignedAgentId,
      budget,
      location,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      propertyInterest: `Inquiry: ${intent} in ${location}`,
      notes: message || 'No additional notes provided.',
      timeline: [
        { date: new Date().toISOString(), type: 'system', text: 'Lead captured via Public Demo Form.' }
      ]
    };

    if (assignedAgent) {
      newLead.timeline.unshift({
        date: new Date().toISOString(),
        type: 'system',
        text: `Automatically assigned to ${assignedAgent.name} (Round-Robin)`
      });
    }

    // 4. Save to Database
    mockLeads.unshift(newLead);
    saveLeadsToStorage();

    // 5. Render dynamic success message
    const agentName = assignedAgent ? assignedAgent.name : 'an advisor';
    const agentPhone = assignedAgent ? assignedAgent.phone : '+91 98123 45678';
    
    container.innerHTML = `
      <div style="max-width: 500px; margin: 40px auto; padding: 20px; text-align: center; animation: successIn 0.6s var(--ease-expo) forwards;">
        <div class="card" style="padding: 40px; background: rgba(15, 41, 66, 0.85); border: 1px solid var(--accent-color); box-shadow: 0 10px 40px rgba(197, 160, 89, 0.15);">
          <div style="font-size: 54px; color: var(--accent-color); margin-bottom: 24px;"><i class="fa-solid fa-circle-check"></i></div>
          <h2 style="font-family: var(--font-headline); font-size: 24px; color: var(--text-light); margin-bottom: 12px;">Inquiry Received!</h2>
          <p style="color: var(--text-muted); font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Thank you, <strong>${name}</strong>. Your luxury property inquiry has been registered in the DEV OM CRM database.
          </p>
          
          <div style="background: rgba(0,0,0,0.15); border: 1px solid rgba(240,244,248,0.05); border-radius: 6px; padding: 16px; margin-bottom: 24px; text-align: left;">
            <span style="font-size: 10px; color: var(--accent-color); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; display: block; margin-bottom: 8px;">Assigned Representative</span>
            <div style="font-weight: 700; font-size: 15px; color: var(--text-light);">${agentName}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Direct Phone: ${agentPhone}</div>
          </div>
          
          <button class="btn btn-primary" id="btn-submit-another" style="justify-content: center; width: 100%;">
            <i class="fa-solid fa-rotate-left"></i> Submit Another Inquiry
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-submit-another').addEventListener('click', () => {
      renderDemoFormView(container);
    });
  });
}
