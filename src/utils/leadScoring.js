export function calculateLeadScore(intent, budgetString, source) {
  let score = 30; // base score

  // 1. Intent weighting
  switch (intent) {
    case 'Luxury Villa':
      score += 35;
      break;
    case 'Commercial Space':
      score += 30;
      break;
    case 'Premium Apartment':
      score += 25;
      break;
    case 'Plots & Land':
      score += 15;
      break;
    default: // General Inquiry
      score += 5;
  }

  // 2. Budget weighting
  if (budgetString) {
    if (budgetString.includes('Cr') && parseFloat(budgetString.replace(/[^0-9.]/g, '')) >= 5.0) {
      score += 20;
    } else if (budgetString.includes('Cr')) {
      score += 15;
    } else if (budgetString.includes('Lakhs')) {
      score += 5;
    }
  }

  // 3. Source Quality weighting
  switch (source) {
    case 'website':
      score += 15; // Highest intent
      break;
    case 'google_ads':
      score += 10; // Intent search queries
      break;
    case 'meta_ads':
      score += 5;  // Push ads, variable intent
      break;
    case 'social_media':
      score += 8;  // Direct messaging shows high engagement
      break;
  }

  // Cap score between 0 and 100
  return Math.min(100, Math.max(0, score));
}

export function getScoreLabel(score) {
  if (score >= 80) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}
