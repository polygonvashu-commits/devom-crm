import { mockAgents } from '../data/mockAgents.js';

class RoundRobinEngine {
  constructor() {
    this.queueKey = 'devom_rr_queue_index';
    this.historyKey = 'devom_assignment_history';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.queueKey)) {
      localStorage.setItem(this.queueKey, '0');
    }
    if (!localStorage.getItem(this.historyKey)) {
      localStorage.setItem(this.historyKey, JSON.stringify([]));
    }
  }

  getQueueIndex() {
    return parseInt(localStorage.getItem(this.queueKey) || '0', 10);
  }

  setQueueIndex(index) {
    localStorage.setItem(this.queueKey, index.toString());
  }

  getOnlineAgents() {
    // Only assign to online agents (can be online or busy, but not offline)
    return mockAgents.filter(agent => agent.status !== 'offline');
  }

  assignNextLead(leadName, leadIntent) {
    const onlineAgents = this.getOnlineAgents();
    if (onlineAgents.length === 0) {
      return null; // No agents online
    }

    let currentIndex = this.getQueueIndex();
    if (currentIndex >= onlineAgents.length) {
      currentIndex = 0;
    }

    const assignedAgent = onlineAgents[currentIndex];
    
    // Update queue index for next time
    const nextIndex = (currentIndex + 1) % onlineAgents.length;
    this.setQueueIndex(nextIndex);

    // Save history
    const history = JSON.parse(localStorage.getItem(this.historyKey) || '[]');
    const assignment = {
      timestamp: new Date().toISOString(),
      leadName,
      leadIntent,
      agentId: assignedAgent.id,
      agentName: assignedAgent.name
    };
    history.unshift(assignment);
    localStorage.setItem(this.historyKey, JSON.stringify(history.slice(0, 100)));

    return assignedAgent;
  }

  getAssignmentHistory() {
    return JSON.parse(localStorage.getItem(this.historyKey) || '[]');
  }

  resetQueue() {
    this.setQueueIndex(0);
  }
}

export const roundRobin = new RoundRobinEngine();
