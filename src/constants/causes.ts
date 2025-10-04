import type { CauseInfo } from '../types'

// NOTE: These are well-known international/national non-profits. Logos are NOT embedded
// here to avoid trademark/copyright concerns. We render text-only subtle pills.
// If you plan to use official marks, obtain permission and store assets locally.
export const popularCauses: CauseInfo[] = [
  { id: 'wwf', name: 'World Wildlife Fund', url: 'https://www.worldwildlife.org', category: 'Environment' },
  { id: 'unicef', name: 'UNICEF', url: 'https://www.unicef.org', category: 'Children' },
  { id: 'red-cross', name: 'International Red Cross', url: 'https://www.icrc.org', category: 'Relief' },
  { id: 'aclu', name: 'American Civil Liberties Union', url: 'https://www.aclu.org', category: 'Rights' },
  { id: 'msf', name: 'Doctors Without Borders', url: 'https://www.doctorswithoutborders.org', category: 'Health' },
  { id: 'eff', name: 'Electronic Frontier Foundation', url: 'https://www.eff.org', category: 'Digital' },
  { id: 'girlswhocode', name: 'Girls Who Code', url: 'https://girlswhocode.com', category: 'Education' },
  { id: 'charity-water', name: 'charity: water', url: 'https://www.charitywater.org', category: 'Water' },
  { id: 'tnrf', name: 'The Nature Conservancy', url: 'https://www.nature.org', category: 'Environment' },
  { id: 'unhcr', name: 'UNHCR Refugee Agency', url: 'https://www.unhcr.org', category: 'Relief' },
  { id: 'savechildren', name: 'Save the Children', url: 'https://www.savethechildren.org', category: 'Children' },
  { id: 'feedingamerica', name: 'Feeding America', url: 'https://www.feedingamerica.org', category: 'Relief' },
  // Added extended set below
  { id: 'wfp', name: 'World Food Programme', url: 'https://www.wfp.org', category: 'Relief' },
  { id: 'amnesty', name: 'Amnesty International', url: 'https://www.amnesty.org', category: 'Rights' },
  { id: 'habitat', name: 'Habitat for Humanity', url: 'https://www.habitat.org', category: 'Housing' },
  { id: 'rainforest-alliance', name: 'Rainforest Alliance', url: 'https://www.rainforest-alliance.org', category: 'Environment' },
  { id: 'wcs', name: 'Wildlife Conservation Society', url: 'https://www.wcs.org', category: 'Environment' },
  { id: 'ocean-cleanup', name: 'The Ocean Cleanup', url: 'https://theoceancleanup.com', category: 'Environment' },
  { id: 'wikimedia', name: 'Wikimedia Foundation', url: 'https://wikimediafoundation.org', category: 'Knowledge' },
  { id: 'malala', name: 'Malala Fund', url: 'https://malala.org', category: 'Education' },
  { id: 'roomtoread', name: 'Room to Read', url: 'https://www.roomtoread.org', category: 'Education' },
  { id: 'against-malaria', name: 'Against Malaria Foundation', url: 'https://www.againstmalaria.com', category: 'Health' },
  { id: 'stjude', name: 'St. Jude Children\'s Research Hospital', url: 'https://www.stjude.org', category: 'Health' },
  { id: 'direct-relief', name: 'Direct Relief', url: 'https://www.directrelief.org', category: 'Relief' },
  { id: 'heifer', name: 'Heifer International', url: 'https://www.heifer.org', category: 'Poverty' },
  { id: 'kiva', name: 'Kiva', url: 'https://www.kiva.org', category: 'Microfinance' },
  { id: 'trevor', name: 'The Trevor Project', url: 'https://www.thetrevorproject.org', category: 'LGBTQ+' },
  { id: 'mentalhealthamerica', name: 'Mental Health America', url: 'https://mhanational.org', category: 'Mental Health' },
  { id: 'wwcode', name: 'Women Who Code', url: 'https://www.womenwhocode.com', category: 'Equality' }
]
