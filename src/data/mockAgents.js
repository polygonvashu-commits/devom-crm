const defaultAgents = [
  {
    id: "agent_1",
    name: "Amit Kumar",
    avatar: "AK",
    email: "amit.kumar@devomgroup.in",
    phone: "+91 98123 45678",
    activeLeads: 0,
    totalLeads: 0,
    conversionRate: 26.5,
    avgFollowUpHours: 1.2,
    status: "online",
    specialization: "Luxury Villas"
  },
  {
    id: "agent_2",
    name: "Priya Sharma",
    avatar: "PS",
    email: "priya.sharma@devomgroup.in",
    phone: "+91 98234 56789",
    activeLeads: 0,
    totalLeads: 0,
    conversionRate: 28.2,
    avgFollowUpHours: 0.8,
    status: "online",
    specialization: "Premium Apartments"
  },
  {
    id: "agent_3",
    name: "Rajesh Mehta",
    avatar: "RM",
    email: "rajesh.mehta@devomgroup.in",
    phone: "+91 98345 67890",
    activeLeads: 0,
    totalLeads: 0,
    conversionRate: 22.0,
    avgFollowUpHours: 2.1,
    status: "busy",
    specialization: "Commercial Space"
  },
  {
    id: "agent_4",
    name: "Ananya Gupta",
    avatar: "AG",
    email: "ananya.gupta@devomgroup.in",
    phone: "+91 98456 78901",
    activeLeads: 0,
    totalLeads: 0,
    conversionRate: 24.5,
    avgFollowUpHours: 1.5,
    status: "online",
    specialization: "Plots & Land"
  },
  {
    id: "agent_5",
    name: "Vikram Malhotra",
    avatar: "VM",
    email: "vikram.malhotra@devomgroup.in",
    phone: "+91 98567 89012",
    activeLeads: 0,
    totalLeads: 0,
    conversionRate: 19.5,
    avgFollowUpHours: 2.5,
    status: "offline",
    specialization: "Luxury Villas"
  },
  {
    id: "agent_6",
    name: "Sonia Rao",
    avatar: "SR",
    email: "sonia.rao@devomgroup.in",
    phone: "+91 98678 90123",
    activeLeads: 0,
    totalLeads: 0,
    conversionRate: 25.8,
    avgFollowUpHours: 1.1,
    status: "online",
    specialization: "Premium Apartments"
  }
];

export const mockAgents = [];

export const adminUser = {
  name: "Naveen Rathee",
  role: "Administrator",
  avatar: "NR",
  email: "naveen.rathee@devomgroup.in"
};

export function saveAgentsToStorage() {
  localStorage.setItem('devom_agents', JSON.stringify(mockAgents));
}

// Load agents from storage or initialize with defaults
const storedAgents = localStorage.getItem('devom_agents');
if (storedAgents) {
  try {
    const parsed = JSON.parse(storedAgents);
    mockAgents.length = 0;
    mockAgents.push(...parsed);
  } catch (e) {
    console.error("Failed to load agents from localStorage, using defaults.", e);
  }
} else {
  mockAgents.push(...defaultAgents);
  saveAgentsToStorage();
}
