export interface Region {
  slug: string;
  name: string;
  tamil: string;
  places: string;
  style: string;
  highlights: string[];
  inTamilNadu: boolean;
}

// Regional notes describe styles commonly associated with an area. Kolam traditions travel
// freely between families and towns, so treat these as tendencies, not strict rules.
export const REGIONS: Region[] = [
  {
    slug: "thondai-nadu",
    name: "Thondai Nadu (Chennai & North)",
    tamil: "தொண்டை நாடு",
    places: "Chennai, Kanchipuram, Vellore, Tiruvallur",
    style: "Fast, neat everyday pulli kolams in front of city homes; colourful competition kolams during Margazhi and Pongal in colonies and temple streets like Mylapore.",
    highlights: ["Street kolam contests in Margazhi", "Colour-filled Pongal kolams", "Compact doorstep designs"],
    inTamilNadu: true,
  },
  {
    slug: "chola-nadu",
    name: "Chola Nadu (Cauvery delta)",
    tamil: "சோழ நாடு",
    places: "Thanjavur, Kumbakonam, Tiruvarur, Mayiladuthurai",
    style: "Temple-town traditions: long sikku kolams, padi kolams with kaavi borders around puja spaces, and large Margazhi dawn designs.",
    highlights: ["Padi kolams with red kaavi", "Intricate sikku in temple streets", "Maa kolam for festivals"],
    inTamilNadu: true,
  },
  {
    slug: "chettinad",
    name: "Chettinad",
    tamil: "செட்டிநாடு",
    places: "Karaikudi, Devakottai, Kanadukathan",
    style: "Grand mansion courtyards invite big, symmetrical geometric kolams — bold double lines, stars and borders that echo the tiled floors.",
    highlights: ["Large geometric padi patterns", "Courtyard-scale designs", "Strong symmetry"],
    inTamilNadu: true,
  },
  {
    slug: "pandya-nadu",
    name: "Pandya Nadu (Madurai & South)",
    tamil: "பாண்டிய நாடு",
    places: "Madurai, Sivaganga, Virudhunagar, Ramanathapuram",
    style: "Lotus and temple motifs inspired by the Meenakshi temple, big pulli kolams and vivid Pongal and Chithirai festival designs.",
    highlights: ["Lotus (thamarai) kolams", "Chithirai festival kolams", "Bright colour fills"],
    inTamilNadu: true,
  },
  {
    slug: "kongu-nadu",
    name: "Kongu Nadu (West)",
    tamil: "கொங்கு நாடு",
    places: "Coimbatore, Erode, Tiruppur, Salem, Namakkal",
    style: "Farming-family Pongal traditions: cattle, sugarcane and harvest-pot kolams, especially on Maattu Pongal.",
    highlights: ["Maattu Pongal cattle kolams", "Harvest pot designs", "Wide doorstep kolams"],
    inTamilNadu: true,
  },
  {
    slug: "nanjil-nadu",
    name: "Tirunelveli & Nanjil Nadu",
    tamil: "நெல்லை · நாஞ்சில் நாடு",
    places: "Tirunelveli, Thoothukudi, Kanyakumari",
    style: "Where Tamil kolam meets Kerala's pookalam: flower kolams during Onam season alongside classic pulli kolams.",
    highlights: ["Flower (poo) kolams", "Onam-season pookalam", "Lamp kolams for Karthigai"],
    inTamilNadu: true,
  },
  {
    slug: "kerala",
    name: "Kerala — Pookalam",
    tamil: "கேரளா",
    places: "Across Kerala",
    style: "Pookalam: circular carpets of fresh flower petals, built ring by ring during the ten days of Onam.",
    highlights: ["Real flower petals", "Concentric rings", "Thiruvonam grand finale"],
    inTamilNadu: false,
  },
  {
    slug: "andhra",
    name: "Andhra & Telangana — Muggulu",
    tamil: "ஆந்திரா",
    places: "Across Andhra Pradesh & Telangana",
    style: "Muggulu: dot-grid designs similar to pulli kolam, filled with bright colours at Sankranti and decorated with gobbemma.",
    highlights: ["Coloured Sankranti muggulu", "Gobbemma on the design", "Ratham muggu"],
    inTamilNadu: false,
  },
  {
    slug: "karnataka",
    name: "Karnataka — Rangavalli",
    tamil: "கர்நாடகா",
    places: "Across Karnataka",
    style: "Rangoli / rangavalli: dot and free-hand designs, often with fine powder shading and floral borders.",
    highlights: ["Free-hand rangoli", "Fine powder shading", "Festival borders"],
    inTamilNadu: false,
  },
];
