export const mockLeads = [];

export function saveLeadsToStorage() {
  localStorage.setItem('devom_leads', JSON.stringify(mockLeads));
}

// Load leads from storage if present
const storedLeads = localStorage.getItem('devom_leads');
if (storedLeads) {
  try {
    const parsed = JSON.parse(storedLeads);
    // If the database contains the old default mock leads (e.g. Rohan Singhal/lead_1), purge it for a clean start
    if (parsed.some(lead => lead.id === 'lead_1')) {
      localStorage.removeItem('devom_leads');
      mockLeads.length = 0;
    } else {
      mockLeads.length = 0;
      mockLeads.push(...parsed);
    }
  } catch (e) {
    console.error("Failed to load leads from localStorage", e);
  }
} else {
  saveLeadsToStorage();
}
