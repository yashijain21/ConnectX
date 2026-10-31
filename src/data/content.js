export const navLinks = [
  { label: 'About us', href: '/about' }, { label: 'Solutions', href: '/solutions' },
  { label: 'Brands', href: '/brands' }, { label: 'Industries', href: '/industries' },
  { label: 'Services', href: '/services' }, { label: 'Standards', href: '/standards' },
]

export const solutions = [
  { id: 'structured-cabling', title: 'Structured cabling', short: 'Structured Cabling', number: '01', eyebrow: 'CONNECTED BY DESIGN', icon: 'cable', image: 'photo-1558494949-ef010cbdcc31', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Racksserver.png', cardCredit: 'Racksserver · CC BY-SA 3.0 · Wikimedia Commons', text: 'Build a dependable physical layer for every connection, from the campus backbone to the individual workspace.', products: ['Copper cabling systems', 'Fibre optic infrastructure', 'Racks, cabinets & pathways', 'Connectivity, tools & testing'], accent: '01 — THE FOUNDATION' },
  { id: 'active-network-ip', title: 'Active network & IP', short: 'Active Network & IP', number: '02', eyebrow: 'NETWORK WITH CONFIDENCE', icon: 'network', image: 'photo-1518770660439-4636190af475', text: 'Connect users, systems and sites with network platforms selected around your performance and security needs.', products: ['Switching & wireless', 'Enterprise routing', 'Network security', 'Server & storage'], accent: '02 — ALWAYS CONNECTED' },
  { id: 'security-surveillance', title: 'Security & surveillance', short: 'Security & Surveillance', number: '03', eyebrow: 'CLARITY. CONTROL. CONFIDENCE.', icon: 'shield', image: 'photo-1557597774-9d273605dfa9', gallery: [{ label: 'Access Control', image: 'photo-1754494977432-425fb917df70' }, { label: 'Intercom', image: 'photo-1760866613530-e3e09e013c42' }, { label: 'CCTV', image: 'photo-1723399726195-1fc25450f80d' }], text: 'Bring access control, intercom and CCTV together in a coordinated security solution for your site.', products: ['Access control systems', 'Intercom systems', 'CCTV and video surveillance'], accent: '03 — PROTECTION THAT CONNECTS' },
  { id: 'data-center-critical-power', title: 'Data centre & critical power', short: 'Data Center & Critical Power', number: '04', eyebrow: 'ENGINEERED FOR UPTIME', icon: 'server', image: 'photo-1597852074816-d933c7d2b988', text: 'Support critical digital infrastructure with the connected systems that help keep operations resilient.', products: ['Racks & containment', 'UPS & power protection', 'Precision cooling', 'Monitoring & management'], accent: '04 — BUILT FOR CONTINUITY' },
  { id: 'smart-building-iot', title: 'Smart building & IoT', short: 'Smart Building & IoT', number: '05', eyebrow: 'BUILDINGS THAT RESPOND', icon: 'building', image: 'photo-1486406146926-c627a92ad1ab', text: 'Bring building systems together to make spaces more responsive, efficient and easier to manage.', products: ['Building management', 'IoT sensors & gateways', 'Lighting controls', 'Automation & integration'], accent: '05 — INTELLIGENCE INTEGRATED' },
  { id: 'power-solutions', title: 'Power solutions', short: 'Power Solutions', number: '06', eyebrow: 'POWERING EVERY CONNECTION', icon: 'power', image: 'photo-1473341304170-971dccb5ac1e', text: 'Support reliable operations with considered power distribution, backup and protection solutions.', products: ['UPS & backup power', 'Power distribution', 'Surge protection', 'Energy monitoring'], accent: '06 — POWER YOU CAN PLAN AROUND' },
  { id: 'gpon-solutions', title: 'GPON solutions', short: 'GPON Solutions', number: '07', eyebrow: 'FIBRE BUILT FOR ACCESS', icon: 'network', image: 'photo-1518770660439-4636190af475', cardImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=82', text: 'Deliver scalable fibre access with GPON infrastructure designed to connect users, buildings and services.', products: ['GPON OLT equipment', 'ONT/ONU units', 'Passive optical splitters', 'Fibre distribution and accessories'], accent: '07 — FIBRE TO EVERY CONNECTION' },
]

export const solutionBrandCategories = {
  'structured-cabling': ['Cabling', 'Networking'],
  'active-network-ip': ['Networking', 'Servers', 'UC/VoIP'],
  'security-surveillance': ['Security', 'AV/PA/Intercom', 'Networking'],
  'data-center-critical-power': ['Power', 'Servers', 'Cabling', 'Networking'],
  'smart-building-iot': ['Networking', 'UC/VoIP', 'Security', 'AV/PA/Intercom'],
  'power-solutions': ['Power', 'Servers'],
  'gpon-solutions': ['Networking', 'Cabling'],
}

export const industries = [
  { name: 'Commercial', text: 'Commercial buildings and workplaces.', icon: 'building' },
  { name: 'Data Centres', text: 'Digital infrastructure and critical facilities.', icon: 'server' },
  { name: 'Hospitality & Healthcare', text: 'Guest and care environments.', icon: 'heart' },
  { name: 'Education', text: 'Schools, colleges and learning campuses.', icon: 'book' },
  { name: 'Industrial', text: 'Industrial sites and operating environments.', icon: 'factory' },
  { name: 'Residential', text: 'Residential buildings and communities.', icon: 'building' },
  { name: 'Government', text: 'Government and public sector facilities.', icon: 'landmark' },
]

export const brandGroups = [
  { name: 'Power', icon: 'power' }, { name: 'Servers', icon: 'server' },
  { name: 'Cabling', icon: 'cable' }, { name: 'Networking', icon: 'network' },
  { name: 'UC/VoIP', icon: 'phone' }, { name: 'Security', icon: 'shield' },
  { name: 'AV/PA/Intercom', icon: 'radio' },
]

export const standards = ['ANSI/TIA', 'ISO/IEC', 'IEEE', 'IEC/EN', 'RoHS/REACH', 'UL/ETL']
export const standardLogoGroups = [
  { label: 'ANSI / TIA', logos: [{ src: '/logos/ansi-full.png', alt: 'ANSI logo' }, { src: '/logos/tia.png', alt: 'TIA logo' }] },
  { label: 'ISO / IEC', logos: [{ src: '/logos/iso-blue.png', alt: 'ISO logo' }, { src: '/logos/iec.png', alt: 'IEC logo' }] },
  { label: 'IEEE', logos: [{ src: 'https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg', alt: 'IEEE logo' }] },
  { label: 'IEC / EN', logos: [{ src: '/logos/iec.png', alt: 'IEC logo' }] },
  { label: 'RoHS / REACH', logos: [{ src: '/logos/rohs.png', alt: 'RoHS logo' }, { src: '/logos/echa.png', alt: 'ECHA logo' }] },
  { label: 'UL / ETL', logos: [{ src: '/logos/ul.png', alt: 'UL Listed logo' }, { src: '/logos/etl.png', alt: 'ETL Listed logo' }] },
]

// Restored verbatim from the existing committed homepage content.
export const approvedValuePoints = [
  { icon: 'blocks', title: 'A connected portfolio', text: 'Complementary technologies selected to work together across the project.' },
  { icon: 'handshake', title: 'A partner mindset', text: 'Responsive collaboration with the people delivering the project.' },
  { icon: 'clipboard', title: 'Project-aware support', text: 'Coordination that keeps specifications, procurement and delivery aligned.' },
  { icon: 'headphones', title: 'Practical expertise', text: 'Product guidance grounded in your application and requirements.' },
  { icon: 'globe', title: 'Regional perspective', text: 'A considered understanding of the regional project landscape.' },
]
export const company = {
  name: 'ConnectX Technologies',
  registration: '193507-1',
  email: 'sales@connectx-tech.com',
  phone: '+973 77936545',
  address: 'Office no-14, Building no-49, Road-2701, Block-327, Dream Building, Adliya',
  officeHours: '',
  whatsappNumber: '',
  linkedin: '', instagram: '', youtube: '',
}
// Remaining brand-category names, the five approved value points and certification evidence
// have not been supplied. Render clearly marked placeholders until ConnectX approves them.
