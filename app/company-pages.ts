// Pages for the Software, Use Cases, About and Contact menus, built from deepgridsemi.com's content
// (captured 2026-09-26: content/reference/deepgridsemi/, structured/) under content/reconciliation.md:
// deepgridsemi.com is final where it overlaps the showcase; its template filler and unsourced
// claims are left out. Every section names the reference page it came from (`from`).
//
// v7 narrative policy: preserve named company-reported biographies and source documents;
// remove unsupported headcounts, award issuers, traction figures and guarantees. Explicitly
// distinguish published downloads, on-request resources and pre-silicon architecture scope.

import { url } from './routes';
import { areas, products } from './applications-story-data';
import { groundedDocuments } from './documents-data';
import { V, videoGroups, shortGroups, docGroups, type VideoGroup, type DocGroup } from './resources-data';

export type Card = { title: string; text?: string; image?: string; meta?: string; href?: string; go?: string; icon?: string };
export type FlowStep = { label: string; text: string; icon: string };
export type Person = { name: string; role: string; detail?: string; photo?: string; initials: string; bio?: string[] };
export type Section =
  | { kind: 'split'; kicker?: string; title: string; lede?: string; paras: string[]; image?: string; imageAlt?: string; flow?: FlowStep[]; flowLabel?: string; from: string }
  | { kind: 'cards'; kicker?: string; title: string; lede?: string; cols: 2 | 3 | 4; items: Card[]; from: string }
  | { kind: 'steps'; kicker?: string; title: string; lede?: string; items: Card[]; from: string }
  | { kind: 'stats'; items: [string, string][]; from: string }
  | { kind: 'people'; kicker?: string; title: string; lede?: string; people: Person[]; from: string }
  | { kind: 'figures'; kicker?: string; title: string; items: { src: string; alt: string; caption: string; w: number; h: number }[]; from: string }
  | { kind: 'contact'; from: string }
  | { kind: 'roster'; kicker?: string; title: string; lede?: string; groups: { title: string; people: [string, string][] }[]; from: string }
  | { kind: 'films'; kicker?: string; title: string; lede?: string; ids: string[]; from: string }
  | { kind: 'videos'; kicker?: string; title: string; lede?: string; groups: VideoGroup[]; shorts?: VideoGroup[]; channel?: boolean; from: string }
  | { kind: 'docs'; groups: DocGroup[]; from: string }
  | { kind: 'scene'; scene: 'motor' | 'truck' | 'defence'; title: string; lede: string; from: string }
  | { kind: 'bullets'; kicker?: string; title: string; items: string[]; from: string }
  | { kind: 'cta'; title: string; lede: string; actions: { label: string; href: string; primary?: boolean }[]; from: string };

export type CompanyPage = {
  id: string;
  menu: 'about' | 'contact' | 'resources' | 'usecases';
  path: string;
  label: string;
  title: string;
  kicker: string;
  lede: string;
  heroImage?: { src: string; alt: string; fit?: 'natural' };
  chips?: [string, string][];
  sections: Section[];
};

const REF = 'https://deepgridsemi.com';
const img = (p: string) => url('/images/' + p);

export const companyPages: CompanyPage[] = [
  {
    id: 'story', menu: 'about', path: 'about', label: 'Our story',
    kicker: 'Company · purpose and evidence', title: 'Build edge intelligence around the equipment’s physical job.',
    lede: 'DeepGrid’s portfolio starts with motion, power, sensing, interfaces and safety. DG32 is the detailed pre-silicon engineering case; each wider architecture needs its own implementation and qualification evidence.',
    sections: [
      { kind: 'split', title: 'The equipment defines the silicon.', from: 'showcase: Mature-Node Silicon System Architecture',
        paras: [
          'A motor, a meter and a vehicle zone need different voltages, interfaces and fault responses. DeepGrid’s mature-node strategy starts with those constraints rather than a single accelerator offered for every system.',
          'The published portfolio comprises nine core SKU architectures and D100. A separate software-defined-vehicle reference platform describes how functions can be organised; it is not another available chip.',
          'DG32-LITE provides the most detailed engineering trail on this site: simulation, physical implementation, control-loop budgets and preliminary package documentation. Manufactured-silicon measurements and product qualification remain separate gates.',
        ], image: img('scenes/company-wafer-1536.webp'), imageAlt: 'Concept illustration of a silicon wafer, lit in copper' },
      { kind: 'cards', title: 'Three decisions shape the development programme.', cols: 3, from: 'showcase: Mature-Node Silicon System Architecture',
        items: [
          { title: 'Start with a named system', text: 'Agree the voltage, signal quality, timing, environmental conditions and safe state before choosing a chip architecture.' },
          { title: 'Reuse the digital foundation', text: 'Share processor building blocks and engineering methods where they fit. Analog, high-voltage, RF and screening requirements remain specific to each socket.' },
          { title: 'Advance on evidence', text: 'Separate design intent, simulation, implementation, bench measurements and qualification. A roadmap or concept image cannot establish readiness.' },
        ] },
      { kind: 'steps', title: 'A specification reaches a customer through evidence gates.', from: 'showcase: Mature-Node Silicon System Architecture',
        items: [
          { title: 'Define the requirement', text: 'Name the system job, electrical boundaries, failure conditions and intended safe state.' },
          { title: 'Inspect the implementation', text: 'Review architecture, verification and physical implementation records with their limitations.' },
          { title: 'Measure the device', text: 'Bring-up and characterisation require identified manufactured parts and bench records.' },
          { title: 'Qualify the equipment fit', text: 'Agree the application-specific reliability, safety and approval evidence before adoption.' },
        ] },
      { kind: 'cta', title: 'Choose the system you want to evaluate.', lede: 'Start with the application, inspect its architecture and bring the evidence your equipment needs.', from: 'site',
        actions: [{ label: 'Find the application', href: '/applications', primary: true }, { label: 'Review the portfolio strategy', href: '/company' }, { label: 'Meet the reported team', href: '/about/team' }] },
    ],
  },
  {
    id: 'team', menu: 'about', path: 'about/team', label: 'Leadership & team',
    kicker: 'About', title: 'Leadership and team',
    lede: 'Company-reported leadership, engineering roles, advisors and specialist relationships. This roster identifies responsibilities; it does not establish headcount, current contracts or completed silicon.',
    sections: [
      { kind: 'people', title: 'Leadership connects the architecture to an equipment decision.', from: REF + '/about/team',
        people: [
          { name: 'Aravind Prasad G', role: 'Founder & Chief Executive Officer', initials: 'AP', photo: img('deepgridsemi/aravind.webp'),
            detail: 'B.Tech ECE, Bangalore University · Research Associate, IISc Bangalore (speech signal processing) · Stanford SDRM, 2007',
            bio: ['Twenty years across three founded ventures (Evolgence IT Solutions, Deepgrid Datacentre, Evolgence Energy) spanning telecom, AI cloud infrastructure and solar.',
              'Deployed AI systems for Hyundai Glovis, Pike Electric and Mapsol across predictive analytics, NLP and multimodal LLM stacks.',
              'Commercial accountability across DeepGrid’s four business units: ADAS, defence, robotics and AI licensing.'] },
          { name: 'Ayaz Khan', role: 'Chief Technology Officer · Silicon architecture', initials: 'AK', detail: 'M.Sc. Physics, IIT Gandhinagar' },
        ] },
      { kind: 'people', title: 'Commercial and governance roles support the engineering programme.', from: REF + '/about/team',
        people: [
          { name: 'Prashant Sadanand', role: 'Part-time Director · CMO', initials: 'PS', photo: img('deepgridsemi/prashanth.webp'), bio: ['Owns OEM go-to-market and commercial positioning across the ADAS product family.'] },
          { name: 'Jayesh Loya', role: 'Virtual CFO', initials: 'JL' },
          { name: 'Krishna Mohan R', role: 'Independent Director', initials: 'KM', bio: ['Twenty years in corporate governance as Senior Director at Citadel Group.'] },
        ] },
      { kind: 'roster', title: 'The reported roster spans silicon, perception, software and test.', lede: 'Names and roles are reproduced from the company’s team record. Request a current organisation and responsibility matrix for diligence.', from: REF + '/about/team',
        groups: [
          { title: 'Silicon / Hardware', people: [['Arun Saathappan Sundaraam', 'Sr. Digital IC Design Engineer'], ['Koushik B', 'Sr. Digital IC Design Engineer'], ['Santu Sardar', 'Digital IC Engineer'], ['Chandana Pokala', 'Digital IC Engineer'], ['Shrivardhini Indla', 'Digital IC Engineer'], ['Siddhartha V. S. Bade', 'Digital IC Engineer'], ['Ananya Sindam', 'RTL Engineer'], ['Srikar Varma Penmetsa', 'RTL Engineer'], ['Haritha Palgunam', 'Silicon Verification'], ['Rajesh Hembram', 'Hardware Engineer']] },
          { title: 'AI / Perception', people: [['Aryaman Anil Kaprekar', 'ADAS Engineer · Perception Lead'], ['Vishista Reddy Mandala', 'AI Engineer'], ['S. Haemanth Ruban', 'AI Engineer'], ['Shankar Pathlavath', 'AI Engineer'], ['Rahul Aka', 'AI Firmware Engineer'], ['Kodali Paani Chowdary', 'Python Developer (Intern)']] },
          { title: 'Firmware / Software', people: [['Saiteja Jampula', 'Firmware Engineer'], ['Bhavagna Bathula', 'Firmware Engineer'], ['Srikar Panuganti', 'Software Dev Engineer'], ['Gopi Krishna Pulicharla', 'Software Dev Engineer'], ['Snigdha Mohapatra', 'Software Dev Engineer'], ['Govind Sarang', 'Backend Engineer'], ['Srinath Panuganti', 'Front-end Developer']] },
          { title: 'Design / Test / G&A', people: [['Rehan Ahmed Siddiqui', '3D Design & Hardware PCB'], ['Madhu Babu Mallappagari', 'UI & Graphic Designer'], ['Sai Sreekar Tirumala', 'Manual Testing'], ['R. K. Goverdhan', 'G&A / Support'], ['A. Govardhan', 'G&A / Support']] },
        ] },
      { kind: 'people', title: 'The company reports specialist advisory relationships.', from: REF + '/about/team',
        people: [
          { name: 'Venkat Simhadri', role: 'Strategic advisor', initials: 'VS', detail: 'Ex-CEO, MosChip Technologies', bio: ['Semiconductor commercialisation, fabless go-to-market and listed-company governance; advises on the SoC roadmap, OEM design-in and capital-markets readiness.'] },
          { name: 'Emani Capital Advisory', role: 'Financial advisor · placement agent', initials: 'EC', detail: 'Sai Emani · Haradatta Emani', bio: ['Lead financial advisor for the pre-Series A.'] },
          { name: 'Dr. Ramesh Patel', role: 'ANRF lead PI · IIT Tirupati', initials: 'RP', detail: 'Electrical Engineering', bio: ['Ph.D. UNIST; former Ericsson antenna architect. Antenna systems, 5G base stations, mm-wave and THz detectors.'] },
          { name: 'Dr. M.V. Kartikeyan', role: 'ANRF co-PI · IIT Tirupati', initials: 'MK', detail: 'Electrical Engineering', bio: ['Fellow IEEE, INAE, IET and IETE; Alexander von Humboldt Fellow. RF and antenna architecture, computational electromagnetics.'] },
          { name: 'Prof. C. Krishna Mohan', role: 'Academic advisor · IIT Hyderabad', initials: 'CK', detail: 'Computer Science & Engineering', bio: ['Heads the VIGIL lab: intelligent transportation, autonomous-vehicle perception and real-time edge AI.'] },
          { name: 'Dr. K.T. Satyajith', role: 'Academic advisor · IMJIR', initials: 'KS', detail: 'Founder Director', bio: ['Experimental physics: atomic physics, ion trapping, precision spectroscopy and quantum computing.'] },
        ] },
      { kind: 'cards', title: 'Reported specialist roles describe the intended manufacturing chain.', lede: 'These relationships are described in the company record. Confirm current scope, contract status and implementation records during diligence; the roster is not evidence of fabricated or qualified parts.', cols: 3, from: REF + '/about/team',
        items: [
          { title: 'Muse Semi / GSME', meta: 'Fab / MPW', text: 'TSMC 28 nm HPC+ shuttle for the six-chiplet combo die; 79-day fab cycle.' },
          { title: 'SmartSoC', meta: 'Physical design', text: 'RTL-to-GDS partner: floorplanning, place and route, timing, DRC/LVS sign-off.' },
          { title: 'PrimeSoC', meta: 'IP partner', text: 'Authored the feasibility reports DGrid-FS-001/002-2026; architecture feasibility described in those reports; request the reports for review.' },
          { title: 'Terminus Circuits', meta: 'PHY IP', text: 'High-speed PHY hard macros for the 28 nm die.' },
          { title: 'Anamya Technologies', meta: 'FPGA board fab', text: 'Artix-7 200T prototype boards and carrier PCBs for the current AD-series pilots.' },
        ] },
    ],
  },
  {
    id: 'recognition', menu: 'about', path: 'about/recognition', label: 'Achievements',
    kicker: 'Company · reported recognition', title: 'Recognition is context. Engineering evidence decides readiness.',
    lede: 'The retained company record includes photographs attributed to TiE50 Hyderabad. Awards and event participation do not establish silicon performance, customer adoption, qualification or delivery.',
    sections: [
      { kind: 'split', title: 'The retained record is a company-attributed event appearance.', from: REF + '/about/achievements',
        paras: ['The company’s achievements record attributes the images below to TiE50 Hyderabad at the Hyderabad Entrepreneurship Summit. They are presented as company-provided event records, without asserting an independently verified award year or ranking.', 'For technical diligence, follow the architecture documents and corrective claim register. Simulation, implementation and estimates remain distinct from measured silicon and held certificates.'] },
      { kind: 'figures', title: 'Company-provided TiE50 Hyderabad photographs.', from: REF + '/about/achievements',
        items: [
          { src: img('deepgridsemi/award1.webp'), alt: 'Company-provided photograph of the DeepGrid team on an event stage', caption: 'Attributed by the company to the Hyderabad Entrepreneurship Summit.', w: 1280, h: 960 },
          { src: img('deepgridsemi/award2.webp'), alt: 'Company-provided TiE50 Hyderabad announcement graphic', caption: 'Company-provided TiE50 Hyderabad announcement; independent issuer verification is not included in this record.', w: 1280, h: 1280 },
        ] },
      { kind: 'cta', title: 'Judge the engineering on its published evidence.', lede: 'Inspect the maturity labels and original documents before treating a design target as a demonstrated capability.', from: 'site',
        actions: [{ label: 'Review the evidence', href: '/evidence', primary: true }, { label: 'Open source documents', href: '/resources/docs' }] },
    ],
  },

  // ------------------------------------------------------------------ Resources,
  {
    id: 'docs', menu: 'resources', path: 'resources/docs', label: 'Documentation',
    kicker: 'Technical documentation', title: 'Read the source before you design around the claim.',
    lede: 'Published architecture documents and preliminary datasheets explain the design. Resources marked on request are enquiries, not available downloads.',
    sections: [
      { kind: 'cards', title: 'Published sources let you check the design and its limits.', lede: 'The documents every figure on this site traces to. Each opens inside the site with its contents and sections; the PDF is the edition of record.', cols: 3,
        items: groundedDocuments.map((d) => ({ title: d.title, meta: `PDF · ${d.pdfPageCount}`, text: d.summary.split(/(?<=\.)\s/)[0], href: d.specFile, go: 'Read on this site' })),
        from: 'app/documents-data.ts (grounded document registry)' },
      { kind: 'docs', groups: docGroups, from: 'deepgridsemi.com/resources/docs + the site’s own PDFs' },
      { kind: 'cta', title: 'Bring the requirement the documents do not settle.', lede: 'Include the document, section and operating constraint so a technical enquiry can be scoped.', from: 'deepgridsemi.com/resources/docs',
        actions: [ { label: 'Contact Support', href: 'contact', primary: true }, { label: 'Videos', href: 'resources/videos' } ] },
    ],
  },
  {
    id: 'videos', menu: 'resources', path: 'resources/videos', label: 'Videos',
    kicker: 'Recorded demos and engineering walkthroughs', title: 'See the demonstrated setup, then check what it establishes.',
    lede: 'Recorded demonstrations, simulations and layout walkthroughs explain different systems. Footage of a platform does not verify DG32 silicon, safety qualification or performance across operating conditions.',
    sections: [
      { kind: 'videos', title: 'Each recording belongs to its own platform and evidence scope.', groups: videoGroups, shorts: shortGroups, channel: true, from: 'deepgridsemi.com/resources/videos + youtube.com DeepGrid Semi channel' },
      { kind: 'cta', title: 'Simulations and the narrated walkthrough', lede: 'The product lines in their simulators, the silicon films, and the 104-slide portfolio narrated end to end.', from: 'showcase films',
        actions: [ { label: 'Narrated decks & films', href: 'resources', primary: true }, { label: 'Documentation', href: 'resources/docs' } ] },
    ],
  },

  // ------------------------------------------------------------------ Contact,
  {
    id: 'contact', menu: 'contact', path: 'contact', label: 'Contact',
    kicker: 'Scope an evaluation', title: 'Bring the system, the constraint and the next evidence gate.',
    lede: 'Tell us the equipment job, voltage and interfaces, timing, environmental conditions and intended safe state. Name the evidence you need to make the next decision.',
    sections: [{ kind: 'contact', from: REF + '/contact' }],
  },
];


// ------------------------------------------------------------------ Use cases (DG32 site)
// One page per application area, generated from applications-story-data.ts (the Annex's socket sheets): the
// same areas, chips, roles and evidence the Applications page shows, laid out on the use-case template. Only
// DG32’s own films appear, on the area they explain; no third-party or other-product footage is attached.
const SCENE: Record<string, { src: string; alt: string }> = {
  motors: { src: '/media/deepgrid_robotics.jpg', alt: 'Concept render of an autonomous forklift in a warehouse aisle' },
  vehicles: { src: '/media/deepgrid_truck.jpg', alt: 'Concept render of a truck on a wet highway at dusk' },
  defence: { src: '/media/deepgrid_defence.jpg', alt: 'Concept render of a border surveillance tower seen from an operator cabin' },
  grid: { src: '/images/scenes/grid-meters-1536.webp', alt: 'Concept render of a row of electricity smart meters on a utility wall' },
  boards: { src: '/images/scenes/boards-supervisor-1536.webp', alt: 'Concept render of an industrial controller board with a small supervisor chip' },
};
const FILMS: Record<string, string[]> = { motors: ['dg32-fault-path-explained', 'dg32-lite-architecture'] };
// Depth for each use-case page (docs/v6/story-pack-depth.md §12): the system, its signal path with the
// chips placed in it, and where it fails. Fair synthesis from the annex sheets and the applications data;
// every chip named here links to its product page, where the figures and their sources live.
const USECASE_DEPTH: Record<string, { paras: string[]; flowLabel: string; flow: FlowStep[]; failures: Card[] }> = {
  motors: {
    paras: [
      'A motor drive is a loop: measure phase current and rotor position, compute the next voltage, switch the bridge. It runs thousands of times a second, and the power stage it drives can destroy itself in microseconds.',
      'The two chips answer different questions. One keeps the loop running in hardware; the other checks that the processor computing it has not gone wrong, and can turn the bridge off without asking firmware.',
    ],
    flowLabel: 'One control tick, and the path that can stop it',
    flow: [
      { label: 'Sense', text: 'Phase current and rotor angle from Hall sensors or an encoder', icon: 'gauge' },
      { label: 'Control: SKU-1', text: 'Hardware PID, CORDIC and Park transforms close the loop in under 1 µs', icon: 'cpu' },
      { label: 'Drive', text: 'PWM and pre-drivers switch the three-phase bridge', icon: 'sliders' },
      { label: 'Supervise: SKU-4', text: 'A trailing core compares every result; a mismatch drives FAULT_N', icon: 'check' },
      { label: 'Safe state', text: 'FAULT_N removes the gate-driver enable and the motor coasts', icon: 'hand' },
    ],
    failures: [
      { title: 'Shoot-through in the bridge', text: 'Both switches of a leg on at once. Dead time inserted in the PWM engine prevents it, and must hold as gate thresholds drift with temperature.' },
      { title: 'A wrong value, silently computed', text: 'A transient flips a result inside the processor. Self-test runs too rarely to see it; DG32-LITE’s lockstep pair catches it on the store where it happens.' },
      { title: 'Noise from the power stage', text: 'Fast switching edges couple into the current measurement. Guard rings and separate grounds keep the ADC clean on a shared die.' },
      { title: 'Wear that has not failed yet', text: 'Bearing and winding faults show in the current the drive already samples. Small classifiers can flag them in the cycles the loop leaves free.' },
    ],
  },
  vehicles: {
    paras: [
      'A software-defined vehicle splits into a central computer and zones. The zones are where wiring, switching, protection and the safety-critical edges live.',
      'Each zone gathers sensors and loads near where they are, so the harness gets shorter. The zonal controller routes messages on time, protects every load circuit, and keeps safety functions isolated from comfort functions.',
    ],
    flowLabel: 'From a sensor to a switched load, inside one zone',
    flow: [
      { label: 'Sense: SKU-7', text: 'Radar returns range and velocity of up to 64 targets', icon: 'eye' },
      { label: 'Link: SKU-5', text: 'CAN-FD and RS-485 carry the data off the sensor, failsafe when the bus is open', icon: 'layers' },
      { label: 'Route: SKU-9', text: 'Time-sensitive switching delivers brake messages with bounded latency', icon: 'boxes' },
      { label: 'Protect: SKU-9', text: 'Sixteen smart fuses switch loads and trip on an I²t model', icon: 'gauge' },
      { label: 'Supervise: SKU-4', text: 'Battery management and actuator controllers check their own computation', icon: 'check' },
    ],
    failures: [
      { title: 'A short in the harness', text: 'A pyro-fuse is slow and one-shot. A smart electronic fuse cuts off in microseconds and can be reset, if it survives the harness inductance.' },
      { title: 'A late brake message', text: 'Bulk data on the same Ethernet link can delay a critical frame. A time-aware shaper reserves the slot so it arrives within a bound.' },
      { title: 'A miswired or dead bus', text: 'An open or shorted bus must read as a known state. Failsafe biasing and thick-oxide outputs let the transceiver survive and report it.' },
      { title: 'Comfort reaching control', text: 'A lighting command must never touch steering registers. Memory protection and bus firewalls enforce that inside the zonal controller.' },
    ],
  },
  defence: {
    paras: [
      'Drones, avionics boxes and rugged vehicles share a hostile electrical and physical environment: a 28 V bus with surges, radiation at altitude, heat in a closed fuselage, and displays read in direct sun. The requirement differs by platform, and each has its own qualification route.',
      'The parts here cover the chain from the power bus to the operator: clean, sequenced rails, a flight or mission controller that fails safe in hardware, sensing that works without GPS, and a display that notices when it has frozen.',
    ],
    flowLabel: 'From the platform bus to the operator',
    flow: [
      { label: 'Power: SKU-3', text: '28 V bus to four sequenced rails, surge-tolerant and upset-hardened', icon: 'layers' },
      { label: 'Sense: SKU-7', text: '77 GHz radar for obstacles and terrain', icon: 'eye' },
      { label: 'Fly: D100', text: 'Flight control and GPS-denied navigation, with a separate failsafe island', icon: 'cpu' },
      { label: 'Check: SKU-4', text: 'Lockstep supervision of flight-critical computation', icon: 'check' },
      { label: 'Show: SKU-8', text: 'Cockpit display with sunlight gamma and frame-freeze detection', icon: 'film' },
    ],
    failures: [
      { title: 'A 100 V surge on the bus', text: 'An inductive load dump spikes the 28 V bus. The power IC’s input stage has to clamp it without thermal runaway in its own pass devices.' },
      { title: 'A particle flips a bit', text: 'At altitude a single upset can corrupt a state machine. Interlocked latches and triple redundancy keep the power sequence correct.' },
      { title: 'The mission computer hangs, or GPS is jammed', text: 'D100’s failsafe island watches from outside the flight stack and can take the motors to a safe state on its own.' },
      { title: 'The display freezes', text: 'A frozen picture looks normal. Frame-by-frame CRC comparison flags it within two frames.' },
    ],
  },
  grid: {
    paras: [
      'A smart meter measures energy for fifteen years, through outages, heat and deliberate tampering, and has to be trusted by both the utility and the customer. Accuracy, security and keeping time without mains power are the job.',
      'SKU-2 puts the measurement front end, the metrology engine, cryptography and an always-on clock on one die, so the meter needs one chip for measurement, security and its own time base.',
    ],
    flowLabel: 'From the line to a signed reading',
    flow: [
      { label: 'Sense', text: 'Current transformers or shunts and voltage dividers on each phase', icon: 'gauge' },
      { label: 'Convert: SKU-2', text: 'Six 24-bit sigma-delta channels with sinc³ decimation', icon: 'sliders' },
      { label: 'Measure: SKU-2', text: 'Active, reactive and apparent power, harmonics to the 15th', icon: 'cpu' },
      { label: 'Secure: SKU-2', text: 'AES-256 and secure boot sign and protect the record', icon: 'check' },
      { label: 'Report', text: 'DLMS/COSEM over optical, serial or RS-485 to the utility', icon: 'layers' },
    ],
    failures: [
      { title: 'A magnet on the meter', text: 'A strong field or injected DC tries to defeat measurement. The front end has to detect the imbalance and keep measuring.' },
      { title: 'A month without mains', text: 'The clock and tamper log run from a backup cell. The always-on domain draws under 2 µW so the record survives.' },
      { title: 'Accuracy drift', text: 'Class 0.5S has to hold across a 1000:1 current range for fifteen years without recalibration in the field.' },
      { title: 'Opened case', text: 'Case-open sensing erases keys, so a tampered meter cannot sign false readings.' },
    ],
  },
  boards: {
    paras: [
      'Almost every electronic board needs the same three things below its processor: clean supplies that start in the right order, something that holds the processor in reset until those supplies are good, and a robust link to the rest of the system.',
      'These parts are small and unglamorous, and they decide whether a board starts predictably and survives a miswired cable. They are also the parts most exposed to obsolescence when a supplier discontinues them.',
    ],
    flowLabel: 'Below the firmware, from power-on to a running board',
    flow: [
      { label: 'Power', text: 'Rails come up from the input supply in sequence', icon: 'layers' },
      { label: 'Supervise: SKU-6', text: 'Four rails checked against thresholds, with an 8 µs deglitch', icon: 'gauge' },
      { label: 'Release', text: 'RESET_N releases the processor 200 ms after the rails are good', icon: 'check' },
      { label: 'Link: SKU-5', text: 'RS-485 or CAN-FD to the rest of the system, ESD-protected', icon: 'boxes' },
      { label: 'Display: SKU-8', text: 'Panel drive where the board has a local display', icon: 'film' },
    ],
    failures: [
      { title: 'A brownout that corrupts memory', text: 'A supply dips below threshold. The supervisor latches the fault and resets the processor before it writes garbage.' },
      { title: 'Converter noise mistaken for a fault', text: 'A buck converter’s ripple crosses the threshold for nanoseconds. The 8 µs deglitch ignores it; a real dip lasts longer.' },
      { title: 'Firmware that has stopped', text: 'A windowed watchdog expects a kick neither too early nor too late, and resets the board when it gets neither.' },
      { title: 'An electrostatic hit on a connector', text: 'Bus pins leave the enclosure. The transceiver’s ESD structures take the discharge instead of the logic behind them.' },
    ],
  },
};
const SLUG: Record<string, string> = { sku1: 'sku-1', sku2: 'sku-2', sku3: 'sku-3', sku4: 'sku-4', sku5: 'sku-5', sku6: 'sku-6', sku7: 'sku-7', sku8: 'sku-8', sku9: 'sku-9', d100: 'd100' };

const NUM: Record<number, string> = {2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six'};
/** The evidence section states where the chips stand, e.g. "Evidence today: one chip is FPGA-validated, one is at design stage." */
const WORD: Record<number, string> = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six'};
const evidenceTitle = (stages: string[]) => {
  const n = (s: string) => stages.filter((x) => x === s).length;
  const groups = [['First silicon', 'has first silicon', 'have first silicon'], ['FPGA-validated', 'is FPGA-validated', 'are FPGA-validated'], ['Simulation / implementation', 'has simulation and implementation records', 'have simulation and implementation records'], ['Design only', 'is at architecture stage', 'are at architecture stage']].filter(([s]) => n(s));
  if (groups.length === 1) return `Evidence today: ${stages.length === 1 ? 'the chip ' + groups[0][1] : 'all ' + WORD[stages.length] + ' ' + groups[0][2]}.`;
  return 'Evidence today: ' + groups.map(([s, one, many], i) => `${WORD[n(s)] ?? n(s)}${i === 0 ? (n(s) === 1 ? ' chip' : ' chips') : ''} ${n(s) === 1 ? one : many}`).join(', ') + '.';
};
const stageOf = (e: string) => (e.startsWith('First silicon') ? 'First silicon' : e.startsWith('FPGA') ? 'FPGA-validated' : e.startsWith('Simulation') ? 'Simulation / implementation' : 'Design only');
export const useCasePages: CompanyPage[] = areas.map((a) => {
  const items = a.items.map((i) => ({ ...i, p: products[i.product] }));
  const sections: Section[] = [
    { kind: 'split', title: a.fit, paras: [a.lede, ...(USECASE_DEPTH[a.id]?.paras ?? [])], flow: USECASE_DEPTH[a.id]?.flow, flowLabel: USECASE_DEPTH[a.id]?.flowLabel, from: 'applications-story-data.ts (Technical Annex v3)' },
    { kind: 'cards', title: items.length === 1 ? 'One architecture addresses this system function.' : `${NUM[items.length] ?? items.length} architectures, each with a defined role here.`, lede: 'What each part does in this system, and where it stands today.', cols: items.length > 2 ? 3 : 2,
      items: items.map((i) => ({ title: i.p.name, meta: `${i.p.tag} · ${stageOf(i.p.evidence)}`, text: i.role + (i.p.replaces ? ' Replaces: ' + i.p.replaces : ''), href: '/products/' + SLUG[i.product], go: `Open the ${i.p.tag} page` })),
      from: 'applications-story-data.ts' },
    ...(USECASE_DEPTH[a.id] ? [{ kind: 'steps' as const, title: `${NUM[USECASE_DEPTH[a.id].failures.length] ?? USECASE_DEPTH[a.id].failures.length} ways this system fails, and the block that catches each.`, lede: 'The failure modes this system has to survive, and the part of the design that answers each one.', items: USECASE_DEPTH[a.id].failures, from: 'Technical Annex v3 engineering questions' }] : []),
    { kind: 'bullets', title: evidenceTitle(items.map((i) => stageOf(i.p.evidence))), items: items.map((i) => `${i.p.tag}, ${i.p.name}: ${i.p.evidence}`), from: 'applications-story-data.ts' },
  ];
  const SCENE3D: Record<string, { scene: 'motor' | 'truck' | 'defence'; title: string; lede: string }> = {
    motors: { scene: 'motor', title: 'The motor the chips run and supervise', lede: 'Three phase windings around a magnet rotor: SKU-1 drives them, DG32-LITE watches the drive and can shut it down.' },
  };
  if (SCENE3D[a.id]) sections.splice(1, 0, { kind: 'scene', ...SCENE3D[a.id], from: 'v3 three.js scenes' });
  if (FILMS[a.id]) sections.push({ kind: 'films', title: 'DG32 in this application, explained', lede: 'Narrated films on the DG32 safety path and architecture, with captions.', ids: FILMS[a.id], from: 'DG32 films' });
  sections.push({ kind: 'cta', title: 'Bring the system and its constraints.', lede: a.ask, from: 'site',
    actions: [{ label: 'Discuss your application', href: '/contact', primary: true }, { label: 'All chips by application', href: '/applications' }] });
  return {
    id: 'uc-' + a.id, menu: 'usecases', path: 'use-cases/' + a.id, label: a.name, kicker: 'Use case · ' + a.name, title: a.headline, lede: a.lede,
    heroImage: { src: url(SCENE[a.id].src), alt: SCENE[a.id].alt },
    chips: items.slice(0, 3).map((i) => [i.p.name, i.role] as [string, string]),
    sections,
  };
});
companyPages.push(...useCasePages);

export const pageById = (id: string) => companyPages.find((p) => p.id === id);
