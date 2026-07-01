// ─── DEV OM Group CRM — Animated Lead Flow Visualization ────────────────────
import { mockLeads } from '../data/mockLeads.js';
import { animateLeadFlow } from '../utils/animations.js';

function getSourceCounts() {
  const counts = { meta_ads: 0, google_ads: 0, website: 0, social_media: 0 };
  mockLeads.forEach(lead => {
    if (counts.hasOwnProperty(lead.source)) {
      counts[lead.source]++;
    }
  });
  return counts;
}

function getSourceConversions() {
  const conversions = { meta_ads: 0, google_ads: 0, website: 0, social_media: 0 };
  mockLeads.forEach(lead => {
    if (lead.status === 'closed_won' && conversions.hasOwnProperty(lead.source)) {
      conversions[lead.source]++;
    }
  });
  return conversions;
}

const sourceConfig = [
  {
    key: 'meta_ads',
    name: 'Meta Ads',
    icon: 'M',
    color: '#C5A059',
    cx: 100,
    cy: 80,
    path: 'M 100 80 Q 250 80 400 175',
    description: 'Facebook & Instagram Campaigns'
  },
  {
    key: 'google_ads',
    name: 'Google Ads',
    icon: 'G',
    color: '#60a5fa',
    cx: 700,
    cy: 80,
    path: 'M 700 80 Q 550 80 400 175',
    description: 'Search & Display Campaigns'
  },
  {
    key: 'website',
    name: 'Website',
    icon: 'W',
    color: '#22c55e',
    cx: 100,
    cy: 270,
    path: 'M 100 270 Q 250 270 400 175',
    description: 'devomgroup.in Contact Forms'
  },
  {
    key: 'social_media',
    name: 'Social Media',
    icon: 'S',
    color: '#a855f7',
    cx: 700,
    cy: 270,
    path: 'M 700 270 Q 550 270 400 175',
    description: 'Organic Social & DMs'
  }
];

export function renderLeadFlow() {
  const counts = getSourceCounts();
  const conversions = getSourceConversions();
  const totalLeads = mockLeads.length;

  const sourceNodes = sourceConfig.map((src, i) => {
    const count = counts[src.key] || 0;
    const convCount = conversions[src.key] || 0;
    const pct = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : '0.0';

    return `
      <!-- ${src.name} Node -->
      <g class="source-node" data-source="${src.key}" data-name="${src.name}" data-count="${count}" data-conv="${convCount}" data-pct="${pct}" data-desc="${src.description}">
        <!-- Glow ring -->
        <circle cx="${src.cx}" cy="${src.cy}" r="40" fill="none" stroke="${src.color}" stroke-width="1" opacity="0.2">
          <animate attributeName="r" values="38;44;38" dur="3s" begin="${i * 0.5}s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" begin="${i * 0.5}s" repeatCount="indefinite"/>
        </circle>

        <!-- Node circle -->
        <circle cx="${src.cx}" cy="${src.cy}" r="35" fill="${src.color}" fill-opacity="0.15" stroke="${src.color}" stroke-width="1.5" stroke-opacity="0.6"/>

        <!-- Icon letter -->
        <text x="${src.cx}" y="${src.cy - 6}" text-anchor="middle" dominant-baseline="middle" fill="${src.color}" font-family="Playfair Display, serif" font-size="18" font-weight="700">${src.icon}</text>

        <!-- Count text -->
        <text x="${src.cx}" y="${src.cy + 16}" text-anchor="middle" dominant-baseline="middle" fill="${src.color}" font-family="Inter, sans-serif" font-size="11" font-weight="600">${count} leads</text>
      </g>

      <!-- Flow path from ${src.name} to center -->
      <path class="flow-path" d="${src.path}" fill="none" stroke="${src.color}" stroke-width="2" stroke-opacity="0.35" stroke-linecap="round"/>

      <!-- Animated dot along path -->
      <circle class="flow-dot" r="4" fill="${src.color}" opacity="0.9">
        <animateMotion dur="${3 + i * 0.5}s" begin="${i * 0.7}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.42 0 0.58 1">
          <mpath href="#flowPath${i}"/>
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" dur="${3 + i * 0.5}s" begin="${i * 0.7}s" repeatCount="indefinite"/>
      </circle>

      <!-- Hidden path for animateMotion reference -->
      <path id="flowPath${i}" d="${src.path}" fill="none" stroke="none"/>

      <!-- Second dot (offset timing) -->
      <circle class="flow-dot" r="3" fill="${src.color}" opacity="0.6">
        <animateMotion dur="${3.5 + i * 0.4}s" begin="${i * 0.7 + 1.5}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.42 0 0.58 1">
          <mpath href="#flowPath${i}"/>
        </animateMotion>
        <animate attributeName="opacity" values="0;0.7;0.7;0" dur="${3.5 + i * 0.4}s" begin="${i * 0.7 + 1.5}s" repeatCount="indefinite"/>
      </circle>
    `;
  }).join('');

  const legendItems = sourceConfig.map(src => {
    const count = counts[src.key] || 0;
    const pct = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : '0.0';
    const convCount = conversions[src.key] || 0;
    return `
      <div class="flow-legend-item">
        <div class="flow-legend-color" style="background: ${src.color};"></div>
        <div class="flow-legend-details">
          <span class="flow-legend-name">${src.name}</span>
          <span class="flow-legend-stats">${count} leads · ${pct}% · ${convCount} won</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="lead-flow-container">
      <div class="lead-flow-header">
        <h3 class="lead-flow-title">Lead Flow Visualization</h3>
        <p class="lead-flow-subtitle">Real-time source-to-hub pipeline view · ${totalLeads} total leads</p>
      </div>

      <div class="lead-flow-svg-wrapper">
        <svg class="lead-flow-svg" viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <!-- Gold gradient for center hub -->
            <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#D4B068" stop-opacity="0.95"/>
              <stop offset="100%" stop-color="#C5A059" stop-opacity="0.75"/>
            </radialGradient>

            <!-- Outer glow filter -->
            <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <!-- Drop shadow for nodes -->
            <filter id="nodeDropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
            </filter>
          </defs>

          <!-- Background grid pattern -->
          <pattern id="flowGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(197,160,89,0.04)" stroke-width="0.5"/>
          </pattern>
          <rect width="800" height="350" fill="url(#flowGrid)"/>

          <!-- Source nodes and paths -->
          ${sourceNodes}

          <!-- Center Hub - Outer pulse ring -->
          <circle cx="400" cy="175" r="55" fill="none" stroke="#C5A059" stroke-width="1" opacity="0.15">
            <animate attributeName="r" values="55;68;55" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.15;0.03;0.15" dur="2.5s" repeatCount="indefinite"/>
          </circle>

          <!-- Center Hub - Second pulse ring -->
          <circle cx="400" cy="175" r="58" fill="none" stroke="#C5A059" stroke-width="0.5" opacity="0.08">
            <animate attributeName="r" values="58;75;58" dur="3.5s" begin="0.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.08;0.01;0.08" dur="3.5s" begin="0.5s" repeatCount="indefinite"/>
          </circle>

          <!-- Center Hub - Main circle -->
          <circle cx="400" cy="175" r="50" fill="url(#hubGradient)" filter="url(#hubGlow)" stroke="#D4B068" stroke-width="2" stroke-opacity="0.6"/>

          <!-- Center Hub - Text -->
          <text x="400" y="168" text-anchor="middle" dominant-baseline="middle" fill="#0F2942" font-family="Playfair Display, serif" font-size="14" font-weight="700">DEV OM</text>
          <text x="400" y="186" text-anchor="middle" dominant-baseline="middle" fill="#0F2942" font-family="Inter, sans-serif" font-size="9" font-weight="500" opacity="0.7">CRM Hub</text>
        </svg>

        <!-- Tooltip element -->
        <div class="flow-tooltip" id="flowTooltip">
          <div class="flow-tooltip-name" id="tooltipName"></div>
          <div class="flow-tooltip-desc" id="tooltipDesc"></div>
          <div class="flow-tooltip-stats" id="tooltipStats"></div>
        </div>
      </div>

      <!-- Legend bar -->
      <div class="flow-legend">
        ${legendItems}
      </div>
    </div>
  `;
}

export function initLeadFlow() {
  animateLeadFlow();

  // ── Hover effects on source nodes ──
  const sourceNodes = document.querySelectorAll('.source-node');
  const tooltip = document.getElementById('flowTooltip');
  const tooltipName = document.getElementById('tooltipName');
  const tooltipDesc = document.getElementById('tooltipDesc');
  const tooltipStats = document.getElementById('tooltipStats');
  const svgWrapper = document.querySelector('.lead-flow-svg-wrapper');

  sourceNodes.forEach(node => {
    node.style.cursor = 'pointer';
    node.style.transition = 'transform 0.3s ease';

    node.addEventListener('mouseenter', (e) => {
      const name = node.dataset.name;
      const count = node.dataset.count;
      const conv = node.dataset.conv;
      const pct = node.dataset.pct;
      const desc = node.dataset.desc;

      node.style.transform = 'scale(1.1)';

      if (tooltip && tooltipName && tooltipDesc && tooltipStats) {
        tooltipName.textContent = name;
        tooltipDesc.textContent = desc;
        tooltipStats.textContent = `${count} leads · ${pct}% share · ${conv} conversions`;
        tooltip.classList.add('visible');

        const svgRect = svgWrapper.getBoundingClientRect();
        const svg = svgWrapper.querySelector('svg');
        const svgViewBox = svg.viewBox.baseVal;
        const scaleX = svgRect.width / svgViewBox.width;
        const scaleY = svgRect.height / svgViewBox.height;

        const circles = node.querySelectorAll('circle');
        const mainCircle = circles[1];
        const cx = parseFloat(mainCircle.getAttribute('cx')) * scaleX;
        const cy = parseFloat(mainCircle.getAttribute('cy')) * scaleY;

        tooltip.style.left = cx + 'px';
        tooltip.style.top = (cy - 70) + 'px';
      }
    });

    node.addEventListener('mouseleave', () => {
      node.style.transform = 'scale(1)';
      if (tooltip) {
        tooltip.classList.remove('visible');
      }
    });
  });
}
