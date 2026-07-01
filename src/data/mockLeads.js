export const mockLeads = [
  {
    id: "lead_1",
    name: "Rohan Singhal",
    email: "rohan.singhal@yahoo.com",
    phone: "+91 99100 23456",
    source: "meta_ads",
    status: "new",
    score: 85,
    scoreLabel: "hot",
    intent: "Luxury Villa",
    assignedAgent: "agent_1",
    budget: "₹3.5 - 4.5 Cr",
    location: "DLF Phase 5, Gurgaon",
    createdAt: "2026-07-01T10:30:00Z",
    lastContact: "2026-07-01T10:30:00Z",
    propertyInterest: "4 BHK Luxury Villa with private pool",
    notes: "Captured via FB Lead form. Extremely interested in immediate site visit.",
    timeline: [
      { date: "2026-07-01T10:30:00Z", type: "system", text: "Lead captured via Meta Ads form 'Gurgaon Luxury Collection'" }
    ]
  },
  {
    id: "lead_2",
    name: "Meera Nair",
    email: "meera.nair@gmail.com",
    phone: "+91 98111 87654",
    source: "google_ads",
    status: "contacted",
    score: 62,
    scoreLabel: "warm",
    intent: "Premium Apartment",
    assignedAgent: "agent_2",
    budget: "₹1.8 - 2.4 Cr",
    location: "Whitefield, Bangalore",
    createdAt: "2026-06-30T14:15:00Z",
    lastContact: "2026-07-01T11:00:00Z",
    propertyInterest: "3 BHK Highrise Apartment",
    notes: "Spoke on call. Prefers higher floor. Sending brochure via WhatsApp.",
    timeline: [
      { date: "2026-07-01T11:00:00Z", type: "call", text: "Priya spoke with Meera. Prefers higher floor, requested brochure." },
      { date: "2026-06-30T14:15:00Z", type: "system", text: "Lead captured via Google Search Ad 'Best 3BHK Bangalore'" }
    ]
  },
  {
    id: "lead_3",
    name: "Rajesh Kulkarni",
    email: "rajesh.k@kulkarnigroups.com",
    phone: "+91 97665 43210",
    source: "website",
    status: "qualified",
    score: 92,
    scoreLabel: "hot",
    intent: "Commercial Space",
    assignedAgent: "agent_3",
    budget: "₹8.0 - 10.0 Cr",
    location: "BKC, Mumbai",
    createdAt: "2026-06-29T09:00:00Z",
    lastContact: "2026-06-30T16:30:00Z",
    propertyInterest: "Office Space in Grade-A Building",
    notes: "Corporate client. Needs 5,000+ sq ft floor plate. Budget approved by board.",
    timeline: [
      { date: "2026-06-30T16:30:00Z", type: "meeting", text: "Meeting held at BKC. Shared floor plans of DEV OM Tower." },
      { date: "2026-06-29T11:00:00Z", type: "call", text: "Initial intro call. Qualified budget and size requirement." },
      { date: "2026-06-29T09:00:00Z", type: "system", text: "Contact form submitted on devomgroup.in (SSL Webhook)" }
    ]
  },
  {
    id: "lead_4",
    name: "Preeti Oberoi",
    email: "preeti.oberoi@hotmail.com",
    phone: "+91 99991 12233",
    source: "social_media",
    status: "negotiation",
    score: 95,
    scoreLabel: "hot",
    intent: "Luxury Villa",
    assignedAgent: "agent_1",
    budget: "₹5.5 - 6.5 Cr",
    location: "Sohna Road, Gurgaon",
    createdAt: "2026-06-25T17:40:00Z",
    lastContact: "2026-07-01T15:20:00Z",
    propertyInterest: "5 BHK Signature Villa",
    notes: "Negotiating payment plan. Client requesting 10-90 subvention scheme.",
    timeline: [
      { date: "2026-07-01T15:20:00Z", type: "negotiation", text: "Discussed 10-90 payment plan override with Naveen Rathee." },
      { date: "2026-06-28T12:00:00Z", type: "site_visit", text: "Site visit completed with family. Loved the mock villa." },
      { date: "2026-06-25T17:40:00Z", type: "message", text: "DM received on Instagram asking about payment plans." }
    ]
  },
  {
    id: "lead_5",
    name: "Vikramjit Singh",
    email: "vikram.singh@gmail.com",
    phone: "+91 98888 77777",
    source: "meta_ads",
    status: "closed_won",
    score: 100,
    scoreLabel: "hot",
    intent: "Plots & Land",
    assignedAgent: "agent_4",
    budget: "₹2.0 - 2.5 Cr",
    location: "New Chandigarh",
    createdAt: "2026-06-20T11:20:00Z",
    lastContact: "2026-07-01T10:00:00Z",
    propertyInterest: "500 Sq Yd Residential Plot",
    notes: "Deal closed! Registry completed. Booking amount cleared.",
    timeline: [
      { date: "2026-07-01T10:00:00Z", type: "system", text: "Status changed to Closed Won. Booking amount received." },
      { date: "2026-06-27T14:00:00Z", type: "meeting", text: "Token amount of ₹10 Lakhs paid. Paperwork signed." },
      { date: "2026-06-20T11:20:00Z", type: "system", text: "Lead captured from FB Lead Form 'Chandigarh Plots'" }
    ]
  },
  {
    id: "lead_6",
    name: "Sanjay Deshmukh",
    email: "sanjay_d@rediffmail.com",
    phone: "+91 91234 56780",
    source: "google_ads",
    status: "closed_lost",
    score: 25,
    scoreLabel: "cold",
    intent: "Premium Apartment",
    assignedAgent: "agent_6",
    budget: "₹1.2 - 1.5 Cr",
    location: "Kharadi, Pune",
    createdAt: "2026-06-22T08:30:00Z",
    lastContact: "2026-06-28T16:00:00Z",
    propertyInterest: "2 BHK Apartment",
    notes: "Lost to competitor. Bought a property in neighboring project due to cheaper rate.",
    timeline: [
      { date: "2026-06-28T16:00:00Z", type: "system", text: "Lead marked Closed Lost. Reason: Bought competitor property." },
      { date: "2026-06-25T10:00:00Z", type: "call", text: "Client mentioned they are finalizing with another builder." },
      { date: "2026-06-22T08:30:00Z", type: "system", text: "Lead captured from Google Display Ad" }
    ]
  },
  {
    id: "lead_7",
    name: "Karan Johar",
    email: "karan.johar@dharma.com",
    phone: "+91 99900 88888",
    source: "website",
    status: "new",
    score: 88,
    scoreLabel: "hot",
    intent: "Luxury Villa",
    assignedAgent: null,
    budget: "₹15.0 - 20.0 Cr",
    location: "Alibaug, Maharashtra",
    createdAt: "2026-07-01T19:45:00Z",
    lastContact: "2026-07-01T19:45:00Z",
    propertyInterest: "Beachfront Luxury Villa",
    notes: "VIP Client. Form submission details: Requires utmost privacy. Needs infinity pool, private helipad landing details.",
    timeline: [
      { date: "2026-07-01T19:45:00Z", type: "system", text: "Inquiry on devomgroup.in Webhook: 'Exclusive Alibaug Villas'" }
    ]
  },
  {
    id: "lead_8",
    name: "Sunita Reddy",
    email: "sunita.reddy@apollo.com",
    phone: "+91 98480 22334",
    source: "meta_ads",
    status: "new",
    score: 45,
    scoreLabel: "warm",
    intent: "General Inquiry",
    assignedAgent: null,
    budget: "₹1.5 - 2.0 Cr",
    location: "Gachibowli, Hyderabad",
    createdAt: "2026-07-01T21:10:00Z",
    lastContact: "2026-07-01T21:10:00Z",
    propertyInterest: "General Residential Inquiry",
    notes: "Wants to know about upcoming projects in Hyderabad.",
    timeline: [
      { date: "2026-07-01T21:10:00Z", type: "system", text: "Lead captured from Instagram DM automation link" }
    ]
  }
];

// Generate 45 more mock leads to reach 50+ total
const firstNames = ["Rahul", "Aarav", "Kabir", "Neha", "Divya", "Aditya", "Rohan", "Sneha", "Kunal", "Ishita", "Siddharth", "Pooja", "Arjun", "Kriti", "Varun", "Riya", "Gaurav", "Simran", "Deepak", "Tanya"];
const lastNames = ["Kapoor", "Sharma", "Verma", "Sen", "Nair", "Rao", "Joshi", "Bose", "Pillai", "Choudhury", "Malhotra", "Mehra", "Gupta", "Bansal", "Goel", "Reddy", "Patel", "Shah", "Yadav", "Trivedi"];
const intents = ["Luxury Villa", "Premium Apartment", "Commercial Space", "Plots & Land", "General Inquiry"];
const sources = ["meta_ads", "google_ads", "website", "social_media"];
const statuses = ["new", "contacted", "qualified", "negotiation", "closed_won", "closed_lost"];
const budgetsByIntent = {
  "Luxury Villa": ["₹3.5 - 4.5 Cr", "₹5.5 - 6.5 Cr", "₹8.0 - 10.0 Cr"],
  "Premium Apartment": ["₹1.5 - 2.0 Cr", "₹2.2 - 2.8 Cr", "₹3.0 - 3.5 Cr"],
  "Commercial Space": ["₹4.0 - 6.0 Cr", "₹8.0 - 12.0 Cr", "₹15.0 - 20.0 Cr"],
  "Plots & Land": ["₹1.0 - 1.5 Cr", "₹2.0 - 2.5 Cr", "₹3.0 - 4.0 Cr"],
  "General Inquiry": ["₹80 Lakhs - 1.2 Cr", "₹1.2 - 1.8 Cr"]
};
const locationsByIntent = {
  "Luxury Villa": ["Gurgaon DLF Phase 5", "Alibaug Beachfront", "ECR Chennai", "Jubilee Hills Hyderabad"],
  "Premium Apartment": ["Whitefield Bangalore", "Kharadi Pune", "Noida Sector 150", "Gachibowli Hyderabad"],
  "Commercial Space": ["BKC Mumbai", "Okhla Delhi", "MG Road Bangalore", "Cyber City Gurgaon"],
  "Plots & Land": ["New Chandigarh", "Devenahalli Bangalore", "Yamuna Expressway Noida", "Soho Gurgaon"],
  "General Inquiry": ["Dwarka Delhi", "Thane Mumbai", "Hebbal Bangalore", "Noida"]
};
const agents = ["agent_1", "agent_2", "agent_3", "agent_4", "agent_6", null];

for (let i = 9; i <= 55; i++) {
  const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${fName} ${lName}`;
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`;
  const phone = `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const source = sources[Math.floor(Math.random() * sources.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const intent = intents[Math.floor(Math.random() * intents.length)];
  const budgetOpts = budgetsByIntent[intent];
  const budget = budgetOpts[Math.floor(Math.random() * budgetOpts.length)];
  const locOpts = locationsByIntent[intent];
  const location = locOpts[Math.floor(Math.random() * locOpts.length)];
  
  // Calculate a reasonable score
  let score = 20 + Math.floor(Math.random() * 60);
  if (intent === "Luxury Villa" || intent === "Commercial Space") score += 15;
  if (status === "negotiation" || status === "qualified") score += 10;
  if (status === "closed_won") score = 100;
  if (status === "closed_lost") score = Math.floor(Math.random() * 30);
  score = Math.min(100, Math.max(0, score));
  
  let scoreLabel = "warm";
  if (score >= 80) scoreLabel = "hot";
  else if (score < 40) scoreLabel = "cold";
  
  const assignedAgent = status === "new" && Math.random() > 0.5 ? null : agents[Math.floor(Math.random() * (agents.length - 1))];
  
  const daysAgo = Math.floor(Math.random() * 15) + 1;
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);
  
  const lastContactDate = new Date(createdDate);
  lastContactDate.setDate(lastContactDate.getDate() + Math.floor(Math.random() * daysAgo));

  mockLeads.push({
    id: `lead_${i}`,
    name,
    email,
    phone,
    source,
    status,
    score,
    scoreLabel,
    intent,
    assignedAgent,
    budget,
    location,
    createdAt: createdDate.toISOString(),
    lastContact: lastContactDate.toISOString(),
    propertyInterest: `Premium property interest in ${intent} category`,
    notes: `Mock lead generated for testing. High interest in local amenities.`,
    timeline: [
      { date: createdDate.toISOString(), type: "system", text: `Lead generated via ${source}` },
      { date: lastContactDate.toISOString(), type: "call", text: "Follow-up conversation logged." }
    ]
  });
}
