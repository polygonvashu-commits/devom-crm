import { mockLeads } from '../data/mockLeads.js';
import { mockAgents } from '../data/mockAgents.js';
import { animateCounter } from '../utils/animations.js';

export function renderDashboard(container) {
  // 1. Calculate KPI values
  const totalLeadsCount = mockLeads.length;
  const closedWon = mockLeads.filter(l => l.status === 'closed_won');
  const closedLost = mockLeads.filter(l => l.status === 'closed_lost');
  
  // Conversion Rate: closed won / (closed won + closed lost + active leads) -> let's do won / total finished deals
  const totalFinishedDeals = closedWon.length + closedLost.length;
  const conversionRate = totalFinishedDeals > 0 ? (closedWon.length / totalFinishedDeals) * 100 : 23.5;
  
  // Pipeline Value (negotiation + qualified)
  const pipelineValue = mockLeads
    .filter(l => ['qualified', 'negotiation'].includes(l.status))
    .reduce((sum, lead) => {
      // Parse budget e.g. "₹3.5 - 4.5 Cr" -> average = 4.0 Cr
      let numericVal = 2.5; // fallback
      if (lead.budget) {
        const matches = lead.budget.match(/[0-9.]+/g);
        if (matches && matches.length > 0) {
          const avg = matches.reduce((s, val) => s + parseFloat(val), 0) / matches.length;
          numericVal = avg;
        }
      }
      return sum + numericVal;
    }, 0);

  const activeAgentsCount = mockAgents.filter(a => a.status === 'online' || a.status === 'busy').length;

  // Render HTML structure
  container.innerHTML = `
    <div class="kpi-grid animate-on-scroll">
      <div class="card kpi-card">
        <div class="kpi-label">Total Leads</div>
        <div class="kpi-value" id="kpi-leads" data-target="${totalLeadsCount}">${totalLeadsCount}</div>
        <div class="kpi-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +12% this week</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">Conversion Rate</div>
        <div class="kpi-value" id="kpi-conv" data-target="${conversionRate.toFixed(1)}" data-format="percent">${conversionRate.toFixed(1)}%</div>
        <div class="kpi-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +2.4% vs last month</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">Revenue Pipeline</div>
        <div class="kpi-value" id="kpi-pipeline" data-target="${(pipelineValue * 10).toFixed(0)}" data-format="currency">₹${pipelineValue.toFixed(1)} Cr</div>
        <div class="kpi-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +15.2 Cr this month</div>
      </div>
      <div class="card kpi-card">
        <div class="kpi-label">Active Agents</div>
        <div class="kpi-value" id="kpi-agents" data-target="${activeAgentsCount}">${activeAgentsCount}</div>
        <div class="kpi-trend"><i class="fa-solid fa-circle-nodes" style="color: var(--accent-color);"></i> Round-Robin Active</div>
      </div>
    </div>

    <!-- Animated Lead Flow section -->
    <div class="card" style="margin-bottom: 40px; padding: 24px;">
      <h3 style="font-family: var(--font-headline); margin-bottom: 20px; color: var(--accent-color); font-size: 20px;">
        <i class="fa-solid fa-circle-nodes"></i> Omni-Channel Lead Ingestion Hub
      </h3>
      <div id="lead-flow-diagram-container">
        <svg class="lead-flow-svg" viewBox="0 0 800 220">
          <defs>
            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#C5A059" />
              <stop offset="100%" stop-color="#D4B068" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Flow paths -->
          <path id="path-meta" class="flow-line" d="M 120 40 L 400 110" />
          <path id="path-google" class="flow-line" d="M 120 180 L 400 110" />
          <path id="path-website" class="flow-line" d="M 680 40 L 400 110" />
          <path id="path-social" class="flow-line" d="M 680 180 L 400 110" />

          <!-- Animated flow particle indicators -->
          <path class="flow-line-animated" d="M 120 40 L 400 110" />
          <path class="flow-line-animated" d="M 120 180 L 400 110" />
          <path class="flow-line-animated" d="M 680 40 L 400 110" />
          <path class="flow-line-animated" d="M 680 180 L 400 110" />

          <!-- Central Hub -->
          <circle cx="400" cy="110" r="36" fill="#0F2942" stroke="#C5A059" stroke-width="2" class="flow-node-active" filter="url(#glow)"/>
          <text x="400" y="114" fill="#F0F4F8" font-size="12" text-anchor="middle" font-family="Inter" font-weight="700">DEV OM</text>

          <!-- Source Nodes -->
          <!-- Meta Ads -->
          <g transform="translate(120, 40)">
            <circle cx="0" cy="0" r="28" fill="#0F2942" stroke="rgba(240,244,248,0.1)" stroke-width="1" class="flow-node" />
            <text x="0" y="4" font-family="FontAwesome" font-size="16" fill="#3b82f6" text-anchor="middle">&#xf082;</text>
            <text x="0" y="42" fill="#F0F4F8" font-size="10" text-anchor="middle" font-family="Inter" font-weight="600">Meta Ads</text>
          </g>
          <!-- Google Ads -->
          <g transform="translate(120, 180)">
            <circle cx="0" cy="0" r="28" fill="#0F2942" stroke="rgba(240,244,248,0.1)" stroke-width="1" class="flow-node" />
            <text x="0" y="4" font-family="FontAwesome" font-size="16" fill="#ea4335" text-anchor="middle">&#xf1a0;</text>
            <text x="0" y="42" fill="#F0F4F8" font-size="10" text-anchor="middle" font-family="Inter" font-weight="600">Google Ads</text>
          </g>
          <!-- Website -->
          <g transform="translate(680, 40)">
            <circle cx="0" cy="0" r="28" fill="#0F2942" stroke="rgba(240,244,248,0.1)" stroke-width="1" class="flow-node" />
            <text x="0" y="4" font-family="FontAwesome" font-size="16" fill="#C5A059" text-anchor="middle">&#xf0ac;</text>
            <text x="0" y="42" fill="#F0F4F8" font-size="10" text-anchor="middle" font-family="Inter" font-weight="600">devomgroup.in</text>
          </g>
          <!-- Social Media DMs -->
          <g transform="translate(680, 180)">
            <circle cx="0" cy="0" r="28" fill="#0F2942" stroke="rgba(240,244,248,0.1)" stroke-width="1" class="flow-node" />
            <text x="0" y="4" font-family="FontAwesome" font-size="16" fill="#e1306c" text-anchor="middle">&#xf0e5;</text>
            <text x="0" y="42" fill="#F0F4F8" font-size="10" text-anchor="middle" font-family="Inter" font-weight="600">Social DMs</text>
          </g>
        </svg>
      </div>
    </div>

    <div class="dashboard-layout">
      <!-- Chart section -->
      <div class="card" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-family: var(--font-headline); font-size: 20px;">Lead Capture Trends</h3>
          <div class="btn-group">
            <button class="btn btn-secondary btn-sm trend-toggle active" data-days="7" style="padding: 4px 10px; font-size: 11px;">7D</button>
            <button class="btn btn-secondary btn-sm trend-toggle" data-days="30" style="padding: 4px 10px; font-size: 11px;">30D</button>
          </div>
        </div>
        <div style="flex: 1; min-height: 250px; position: relative;">
          <canvas id="trendChart"></canvas>
        </div>
      </div>

      <!-- Donut / Sources break-down -->
      <div class="card">
        <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 20px;">Sources Distribution</h3>
        <div style="min-height: 250px; position: relative; display: flex; align-items: center; justify-content: center;">
          <canvas id="donutChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Bottom row: Recent Activity & Top Agents -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      
      <!-- Activity Feed -->
      <div class="card">
        <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 20px;">Recent Activity</h3>
        <div style="display: flex; flex-direction: column; gap: 16px;" id="activity-feed">
          <!-- Populated dynamically -->
        </div>
      </div>

      <!-- Agent Leaderboard -->
      <div class="card">
        <h3 style="font-family: var(--font-headline); margin-bottom: 20px; font-size: 20px;">Top Performing Agents</h3>
        <div style="display: flex; flex-direction: column; gap: 16px;" id="leaderboard-feed">
          <!-- Populated dynamically -->
        </div>
      </div>

    </div>
  `;

  // Start animated counters
  animateCounter(document.getElementById('kpi-leads'), totalLeadsCount);
  animateCounter(document.getElementById('kpi-conv'), conversionRate, 1500);
  animateCounter(document.getElementById('kpi-pipeline'), pipelineValue * 10, 1500);
  animateCounter(document.getElementById('kpi-agents'), activeAgentsCount);

  // Initialize Charts
  initCharts();

  // Populate Activity Feed
  populateActivities();

  // Populate Leaderboard
  populateLeaderboard();
}

function initCharts() {
  const trendCtx = document.getElementById('trendChart').getContext('2d');
  const donutCtx = document.getElementById('donutChart').getContext('2d');

  // Lead trends over last 7 days (mock dates)
  const labels7D = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data7D = [12, 19, 15, 25, 22, 10, 18];

  const trendChart = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: labels7D,
      datasets: [{
        label: 'Captured Leads',
        data: data7D,
        borderColor: '#C5A059',
        backgroundColor: 'rgba(197, 160, 89, 0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#C5A059'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(240, 244, 248, 0.05)' }, ticks: { color: '#F0F4F8' } },
        y: { grid: { color: 'rgba(240, 244, 248, 0.05)' }, ticks: { color: '#F0F4F8', stepSize: 5 } }
      }
    }
  });

  // Source distribution
  const metaCount = mockLeads.filter(l => l.source === 'meta_ads').length;
  const googleCount = mockLeads.filter(l => l.source === 'google_ads').length;
  const websiteCount = mockLeads.filter(l => l.source === 'website').length;
  const socialCount = mockLeads.filter(l => l.source === 'social_media').length;

  new Chart(donutCtx, {
    type: 'doughnut',
    data: {
      labels: ['Meta Ads', 'Google Ads', 'Website', 'Social Media'],
      datasets: [{
        data: [metaCount, googleCount, websiteCount, socialCount],
        backgroundColor: ['#3b82f6', '#ea4335', '#C5A059', '#e1306c'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#F0F4F8', font: { family: 'Inter', size: 12 } }
        }
      },
      cutout: '70%'
    }
  });

  // Handle toggle buttons
  document.querySelectorAll('.trend-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.trend-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const days = btn.dataset.days;
      
      if (days === '30') {
        trendChart.data.labels = ['W1', 'W2', 'W3', 'W4'];
        trendChart.data.datasets[0].data = [58, 72, 65, 84];
      } else {
        trendChart.data.labels = labels7D;
        trendChart.data.datasets[0].data = data7D;
      }
      trendChart.update();
    });
  });
}

function populateActivities() {
  const feed = document.getElementById('activity-feed');
  
  // Pick last 5 leads with timeline info
  const sortedLeads = [...mockLeads]
    .filter(l => l.timeline && l.timeline.length > 0)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  feed.innerHTML = sortedLeads.map(lead => {
    const time = new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let icon = '<i class="fa-solid fa-bolt text-accent"></i>';
    let iconColor = 'var(--accent-color)';
    if (lead.source === 'meta_ads') { icon = '<i class="fa-brands fa-facebook"></i>'; iconColor = '#3b82f6'; }
    else if (lead.source === 'google_ads') { icon = '<i class="fa-brands fa-google"></i>'; iconColor = '#ea4335'; }
    else if (lead.source === 'website') { icon = '<i class="fa-solid fa-globe"></i>'; iconColor = 'var(--accent-color)'; }
    
    return `
      <div style="display: flex; align-items: center; gap: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(240, 244, 248, 0.05);">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(240,244,248,0.05); display: flex; align-items: center; justify-content: center; color: ${iconColor}; font-size: 16px;">
          ${icon}
        </div>
        <div style="flex: 1;">
          <div style="font-size: 14px; font-weight: 500;">
            New lead captured: <span style="color: var(--accent-color); font-weight: 600;">${lead.name}</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted);">${lead.intent} • ${lead.location}</div>
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">${time}</div>
      </div>
    `;
  }).join('');
}

function populateLeaderboard() {
  const container = document.getElementById('leaderboard-feed');
  const sortedAgents = [...mockAgents].sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 4);

  container.innerHTML = sortedAgents.map((agent, index) => {
    let medalColor = 'var(--text-muted)';
    if (index === 0) medalColor = '#ffd700'; // gold
    else if (index === 1) medalColor = '#c0c0c0'; // silver
    else if (index === 2) medalColor = '#cd7f32'; // bronze

    return `
      <div style="display: flex; align-items: center; gap: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(240, 244, 248, 0.05);">
        <div style="font-size: 16px; font-weight: 700; color: ${medalColor}; width: 24px; text-align: center;">
          ${index + 1}
        </div>
        <div class="profile-avatar" style="width: 32px; height: 32px; font-size: 12px;">${agent.avatar}</div>
        <div style="flex: 1;">
          <div style="font-size: 14px; font-weight: 600;">${agent.name}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${agent.specialization}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 14px; font-weight: 700; color: var(--accent-color);">${agent.conversionRate}%</div>
          <div style="font-size: 11px; color: var(--text-muted);">${agent.activeLeads} active leads</div>
        </div>
      </div>
    `;
  }).join('');
}
