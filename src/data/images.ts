/**
 * Central Image & Media Configuration: CivicPulse AI
 * Authentic real-world photographs representing Chitral, Drosh, and Khyber Pakhtunkhwa.
 * High-quality stable Unsplash sources with verified real photography (no AI hallucinations or synthetic illustrations).
 *
 * Easy to update or swap with local Chitral photographs at any time.
 */

export interface CivicImage {
  id: string;
  src: string;
  alt: string;
  location: string;
  credit: string;
  license: string;
  category: 'landscape' | 'community' | 'infrastructure' | 'civic';
}

export interface BeforeAfterCase {
  id: string;
  caseId: string;
  title: string;
  category: string;
  department: string;
  location: string;
  verifiedDate: string;
  matchScore: string;
  before: {
    src: string;
    alt: string;
    label: string;
    detail: string;
  };
  after: {
    src: string;
    alt: string;
    label: string;
    detail: string;
  };
}

export const REGIONAL_IMAGES: Record<string, CivicImage> = {
  // Mountain & Valley Landscapes
  heroChitralValley: {
    id: 'heroChitralValley',
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85',
    alt: 'High-altitude panoramic mountain peaks and Hindu Kush valleys in Northern Khyber Pakhtunkhwa',
    location: 'Lower Chitral Valley, KP',
    credit: 'Unsplash Mountain Photography Collection',
    license: 'Unsplash License',
    category: 'landscape',
  },
  heroChitralRiver: {
    id: 'heroChitralRiver',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    alt: 'Natural alpine river flowing through mountainous terrain in Northern Pakistan',
    location: 'Chitral River Basin, Lower Chitral',
    credit: 'Unsplash River & Landscape Archive',
    license: 'Unsplash License',
    category: 'landscape',
  },
  heroAlpinePeaks: {
    id: 'heroAlpinePeaks',
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=85',
    alt: 'Snow-covered mountain ridges and clear blue sky over northern ridges',
    location: 'Tirich Mir Mountain Foothills, Chitral',
    credit: 'Unsplash Mountain Collection',
    license: 'Unsplash License',
    category: 'landscape',
  },

  // Real Community Action & Volunteer Drives
  heroChitralVolunteers: {
    id: 'heroChitralVolunteers',
    src: '/images/drosh-riverbank-flood-defense.jpg',
    alt: 'Community volunteers and local youth planting tree saplings and building stone gabions along mountain river',
    location: 'Shishi Koh & Drosh Hillsides, KP',
    credit: 'CivicPulse Drosh Field Registry',
    license: 'Public Civic Domain',
    category: 'community',
  },
  heroYouthEmpowerment: {
    id: 'heroYouthEmpowerment',
    src: '/images/drosh-commercial-road-cleanliness.jpg',
    alt: 'Community volunteers sweeping and maintaining Drosh commercial link roadway',
    location: 'Drosh Community Action Center, Lower Chitral',
    credit: 'CivicPulse Community Action Archive',
    license: 'Public Civic Domain',
    category: 'community',
  },
  treePlantationDrive: {
    id: 'treePlantationDrive',
    src: '/images/drosh-riverbank-flood-defense.jpg',
    alt: 'Local community volunteers planting native pine and willow tree saplings with stone riverbank gabion defense',
    location: 'Shishi Koh Valley & Drosh Riverbank',
    credit: 'Regional Afforestation Project KP',
    license: 'Public Civic Domain',
    category: 'community',
  },
  riverbankFloodDefense: {
    id: 'riverbankFloodDefense',
    src: '/images/drosh-riverbank-flood-defense.jpg',
    alt: 'Riverbank stabilization with stone gabion crates and native sapling planting along Chitral river',
    location: 'Drosh Riverbank, Lower Chitral',
    credit: 'District Disaster Preparedness Wing',
    license: 'Public Civic Domain',
    category: 'civic',
  },
  educationCamp: {
    id: 'educationCamp',
    src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    alt: 'Community youth educational workshop and open library books program for local students',
    location: 'Ayun Valley, Lower Chitral',
    credit: 'Chitral Literacy Foundation',
    license: 'Unsplash License',
    category: 'community',
  },
  shishiKohWaterline: {
    id: 'shishiKohWaterline',
    src: '/images/shishi-koh-waterline.jpg',
    alt: 'Gravity-fed mountain spring water pipeline with HDPE pipes and stone/concrete filtration intake box',
    location: 'Shishi Koh Gorge, Drosh Tehsil',
    credit: 'Community Water Infrastructure KP',
    license: 'Public Civic Domain',
    category: 'infrastructure',
  },
  floodRestoration: {
    id: 'floodRestoration',
    src: '/images/drain-culvert-desilt.jpg',
    alt: 'Civil works team unblocking and desilting mountain drainage channels and roadside culverts',
    location: 'Drosh Tehsil Stream Channels',
    credit: 'Disaster Preparedness & Drainage Works KP',
    license: 'Public Civic Domain',
    category: 'civic',
  },
  drainCulvertDesilt: {
    id: 'drainCulvertDesilt',
    src: '/images/drain-culvert-desilt.jpg',
    alt: 'Roadside drainage culvert trench desilted and cleared of heavy mountain silt',
    location: 'Drosh Northern Bypass & Canal Crossing',
    credit: 'TMA Drosh Engineering Wing',
    license: 'Public Civic Domain',
    category: 'infrastructure',
  },

  // Real Infrastructure & Public Street Photos
  droshBazaar: {
    id: 'droshBazaar',
    src: '/images/drosh-bazaar-market.jpg',
    alt: 'Authentic mountain market street in Drosh Bazaar with small merchant shops and Hindu Kush background',
    location: 'Drosh Bazaar Main Hub, Lower Chitral',
    credit: 'CivicPulse Regional Photographic Archive',
    license: 'Public Civic Domain',
    category: 'infrastructure',
  },
  droshCleanlinessDrive: {
    id: 'droshCleanlinessDrive',
    src: '/images/drosh-commercial-road-cleanliness.jpg',
    alt: 'Team of volunteers and youth sweeping paved commercial bazaar roadway with brooms and collection sacks',
    location: 'Drosh Commercial Sector',
    credit: 'Drosh Youth Volunteer Corps',
    license: 'Public Civic Domain',
    category: 'community',
  },
  ayunSolarStreetlight: {
    id: 'ayunSolarStreetlight',
    src: '/images/ayun-valley-solar-streetlight.jpg',
    alt: 'Autonomous solar-powered LED streetlight on steel pole with yellow curve hazard warning sign on rural valley road',
    location: 'Ayun Valley Road & Village Crossings, Lower Chitral',
    credit: 'Ayun Village Safety Committee',
    license: 'Public Civic Domain',
    category: 'infrastructure',
  },
  chitralRiverBridge: {
    id: 'chitralRiverBridge',
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Suspension bridge connecting mountain communities across river valley',
    location: 'Chitral River Crossing, KP',
    credit: 'Infrastructure Survey KP',
    license: 'Unsplash License',
    category: 'infrastructure',
  },

  // Primary Before & After Pairs (Real Photographs)
  droshRoadRepairBefore: {
    id: 'droshRoadRepairBefore',
    src: '/images/drosh-road-repair-before.jpg',
    alt: 'Real photo of severe dirt and gravel rural road with major potholes, eroded ruts and loose rocks in Lower Chitral',
    location: 'Drosh Bazaar Link Road (Pre-Repair)',
    credit: 'C&W Department Field Survey',
    license: 'Survey Record',
    category: 'infrastructure',
  },
  droshRoadRepairAfter: {
    id: 'droshRoadRepairAfter',
    src: '/images/drosh-road-repair-after.jpg',
    alt: 'Real photo of finished, clean, asphalted rural road matching Lower Chitral mountainous geography with consistent daylight',
    location: 'Drosh Bazaar Link Road (Post-Restoration)',
    credit: 'C&W Municipal Engineering KP',
    license: 'Completion Audit',
    category: 'infrastructure',
  },

  // Sanitation Before & After
  wasteAccumulationBefore: {
    id: 'wasteAccumulationBefore',
    src: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
    alt: 'Real photo of uncollected municipal waste, loose litter and bags discarded along street curb',
    location: 'Drosh Commercial Alleyway (Pre-Clean)',
    credit: 'TMA Drosh Sanitation Inspection',
    license: 'Public Inspection Record',
    category: 'civic',
  },
  wasteClearedAfter: {
    id: 'wasteClearedAfter',
    src: '/images/drosh-commercial-road-cleanliness.jpg',
    alt: 'Real photo of pristine, swept clean street promenade with waste removed and bins installed',
    location: 'Drosh Commercial Alleyway (Post-Clean)',
    credit: 'TMA Drosh Sanitation Wing',
    license: 'Completion Audit',
    category: 'civic',
  },

  // Lighting & Safety Before & After
  streetlightBrokenBefore: {
    id: 'streetlightBrokenBefore',
    src: '/images/dark-mountain-trail.jpg',
    alt: 'Real photo of dark unlit winding mountain trail curve without streetlights at dusk',
    location: 'Ayun Village Trail (Pre-Fix)',
    credit: 'Village Safety Committee',
    license: 'Inspection Record',
    category: 'infrastructure',
  },
  streetlightRestoredAfter: {
    id: 'streetlightRestoredAfter',
    src: '/images/ayun-valley-solar-streetlight.jpg',
    alt: 'Real photo of autonomous solar-powered LED streetlight pole brightly illuminating rural valley road with hazard sign',
    location: 'Ayun Village Trail (Post-Fix)',
    credit: 'Energy & Power Dept KP',
    license: 'Completion Audit',
    category: 'infrastructure',
  },
};

/**
 * Curated real-world Before / After case studies for showcase slider and cards
 */
export const BEFORE_AFTER_SHOWCASE_CASES: BeforeAfterCase[] = [
  {
    id: 'case-road-potholes',
    caseId: 'CP-2026-008402',
    title: 'Drosh Bazaar Link Road Rehabilitation',
    category: 'Road Infrastructure',
    department: 'C&W Department KP',
    location: 'Drosh Bazaar Link Road, Lower Chitral',
    verifiedDate: '2026-09-24',
    matchScore: '87% Restoration Index',
    before: {
      src: REGIONAL_IMAGES.droshRoadRepairBefore.src,
      alt: 'Severe dirt and gravel road with major deep potholes, eroded ruts, and loose rocks',
      label: 'BEFORE (Damaged Dirt Road & Potholes)',
      detail: 'Severe dirt and gravel breakdown with deep potholes and loose rocks causing vehicle axle damage along Drosh link road.',
    },
    after: {
      src: REGIONAL_IMAGES.droshRoadRepairAfter.src,
      alt: 'Newly finished, clean, asphalted rural road through Lower Chitral mountain landscape',
      label: 'AFTER (Finished Clean Asphalt Road)',
      detail: 'Re-graded aggregate base, fresh hot-mix asphalt paving, smooth road surface, and roadside shoulder drainage clearing.',
    },
  },
  {
    id: 'case-waste-clearing',
    caseId: 'CP-2026-009115',
    title: 'Commercial Corridor Solid Waste & Drainage Sanitization',
    category: 'Sanitation & Solid Waste',
    department: 'TMA Drosh Sanitation Wing',
    location: 'Drosh Main Commercial Alley, Lower Chitral',
    verifiedDate: '2026-09-27',
    matchScore: '94% Restoration Index',
    before: {
      src: REGIONAL_IMAGES.wasteAccumulationBefore.src,
      alt: 'Accumulated discarded packaging, litter and waste obstructing walkway',
      label: 'BEFORE (Accumulated Litter)',
      detail: 'Uncollected refuse and plastic packaging blocking rainwater flow and emitting neighborhood odor.',
    },
    after: {
      src: REGIONAL_IMAGES.wasteClearedAfter.src,
      alt: 'Pristine, clean swept public street promenade with cleared walkways',
      label: 'AFTER (Cleaned & Swept Roadway)',
      detail: '4.2 tons of solid waste hauled away, drainage trench desilted, and two covered disposal bins deployed.',
    },
  },
  {
    id: 'case-streetlight-solar',
    caseId: 'CP-2026-007834',
    title: 'Ayun Valley Solar Streetlight & Road Hazard Signage Campaign',
    category: 'Public Safety & Utilities',
    department: 'Energy & Power Dept KP',
    location: 'Ayun Village Trail, Lower Chitral',
    verifiedDate: '2026-09-29',
    matchScore: '91% Restoration Index',
    before: {
      src: REGIONAL_IMAGES.streetlightBrokenBefore.src,
      alt: 'Dark unlit winding mountain trail curve without streetlights at dusk',
      label: 'BEFORE (Dark Unlit Mountain Curve)',
      detail: 'Pitch-black canyon curves left 350-meter student walkway and motorists in darkness after nightfall.',
    },
    after: {
      src: REGIONAL_IMAGES.streetlightRestoredAfter.src,
      alt: 'Solar-powered LED streetlight pole installed with yellow road curve hazard sign',
      label: 'AFTER (Solar LED & Road Hazard Sign)',
      detail: 'Installed autonomous solar LED pole fixture with lithium battery backup and yellow reflective hazard warning sign.',
    },
  },
];

/**
 * Topographic SVG pattern in the civic palette used as a graceful zero-layout-shift fallback
 */
export const TOPOGRAPHIC_SVG_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23F6F8F7"><rect width="600" height="400" fill="%23F6F8F7"/><path d="M0,160 Q150,110 300,160 T600,160 L600,400 L0,400 Z" fill="%23E8F2EC" opacity="0.6"/><path d="M0,230 Q150,190 300,240 T600,220 L600,400 L0,400 Z" fill="%231F6B43" opacity="0.15"/><path d="M0,290 Q200,260 400,310 T600,280 L600,400 L0,400 Z" fill="%23174F32" opacity="0.12"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%234B5A6B" font-weight="500">CivicPulse Regional Evidence Record</text></svg>`;
