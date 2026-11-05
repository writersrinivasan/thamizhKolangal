import type { KolamSpec } from "../kolam/types";

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type KolamType = "pulli" | "sikku" | "padi" | "poo" | "motif" | "maa";

export interface KolamEntry {
  id: string;
  title: string;
  tamil: string;
  type: KolamType;
  festivals: string[];
  region: string;
  difficulty: Difficulty;
  time: string;
  description: string;
  tags: string[];
  spec: KolamSpec;
}

const e = (
  id: string,
  title: string,
  tamil: string,
  type: KolamType,
  festivals: string[],
  region: string,
  difficulty: Difficulty,
  time: string,
  description: string,
  tags: string[],
  spec: KolamSpec,
): KolamEntry => ({ id, title, tamil, type, festivals, region, difficulty, time, description, tags, spec });

export const CATALOG: KolamEntry[] = [
  // ── Pongal season ───────────────────────────────────────────────
  e("pongal-paanai-grand", "Grand Pongal Paanai", "பொங்கல் பானை கோலம்", "motif", ["pongal"], "thondai-nadu", "intermediate", "45 min",
    "The signature Thai Pongal kolam: a brass pot overflowing with sweet pongal, sugarcane on both sides and the rising sun, ringed with turmeric petals.",
    ["pot", "sugarcane", "sun", "harvest", "colour"], { kind: "motif", motif: "pongal-pot", palette: "pongal", symmetry: 12, layers: 3, seed: 5 }),
  e("pongal-sun-rays", "Suriya Pongal", "சூரியப் பொங்கல்", "motif", ["pongal", "ratha-saptami"], "chola-nadu", "beginner", "25 min",
    "A radiant sun kolam to thank Suriyan on Thai Pongal morning, framed by marigold petals.",
    ["sun", "rays", "harvest"], { kind: "motif", motif: "sun", palette: "karthigai", symmetry: 16, layers: 2, seed: 31 }),
  e("pongal-pot-kongu", "Kongu Harvest Pot", "கொங்கு அறுவடைப் பானை", "motif", ["pongal"], "kongu-nadu", "intermediate", "40 min",
    "A farm-family style pot kolam with green leaf rings — the harvest of the fields brought to the doorstep.",
    ["pot", "harvest", "leaves"], { kind: "motif", motif: "pongal-pot", palette: "pongal", background: "leaf", symmetry: 10, layers: 2, seed: 77 }),
  e("pongal-pulli-15", "Pongal Pulli Poo (15 dots)", "பொங்கல் புள்ளிப் பூ", "pulli", ["pongal", "kaanum-pongal"], "thondai-nadu", "intermediate", "35 min",
    "A 15-dot idukku pulli diamond filled ring by ring with turmeric, kumkum and leaf green.",
    ["dots", "diamond", "colour"], { kind: "pulli", dots: 15, shape: "diamond", palette: "pongal", seed: 15 }),
  e("bhogi-sikku", "Bhogi Dawn Sikku", "போகி சிக்கு கோலம்", "sikku", ["pongal"], "chola-nadu", "intermediate", "30 min",
    "On Bhogi the old is cleared and a fresh single-line sikku welcomes the new harvest season.",
    ["single line", "white", "dawn"], { kind: "sikku", dots: 9, singleLine: true, palette: "rice-flour", density: 0.5, seed: 41 }),
  e("maattu-pongal-cow", "Maattu Pongal Maadu", "மாட்டுப் பொங்கல் மாடு", "motif", ["maattu-pongal"], "kongu-nadu", "intermediate", "40 min",
    "A decorated cow with painted horns, tilak and bell — honouring the cattle that work the fields.",
    ["cow", "cattle", "bell"], { kind: "motif", motif: "cow", palette: "pongal", symmetry: 12, layers: 2, seed: 6 }),
  e("maattu-pongal-pulli", "Cattle-shed Pulli", "தொழுவப் புள்ளிக் கோலம்", "pulli", ["maattu-pongal"], "kongu-nadu", "beginner", "15 min",
    "A quick, bright pulli kolam drawn in front of the cattle shed on Maattu Pongal.",
    ["dots", "quick"], { kind: "pulli", dots: 7, shape: "square", palette: "pongal", seed: 72 }),
  e("kaanum-pongal-rainbow", "Kaanum Pongal Vaanavil", "காணும் பொங்கல் வானவில்", "poo", ["kaanum-pongal"], "thondai-nadu", "beginner", "30 min",
    "A joyful rainbow flower kolam for the day of family visits and outings.",
    ["rainbow", "flowers"], { kind: "poo", palette: "rainbow", symmetry: 10, layers: 5, seed: 303 }),

  // ── Margazhi ────────────────────────────────────────────────────
  e("margazhi-giant-sikku", "Margazhi Giant Sikku (13×13)", "மார்கழி பெரிய சிக்கு", "sikku", ["margazhi"], "chola-nadu", "advanced", "75 min",
    "A huge 13×13 single-line sikku — the kind of dawn kolam that fills the street in Margazhi.",
    ["single line", "large", "dawn"], { kind: "sikku", dots: 13, singleLine: true, palette: "rice-flour", density: 0.45, seed: 1313 }),
  e("margazhi-pastel-loops", "Margazhi Pastel Loops", "மார்கழி வண்ணச் சிக்கு", "sikku", ["margazhi"], "thondai-nadu", "intermediate", "45 min",
    "Soft pastel loops weaving around an 11-dot diamond — gentle colours for cool winter dawns.",
    ["loops", "pastel", "diamond"], { kind: "sikku", dots: 11, shape: "diamond", singleLine: false, palette: "margazhi", density: 0.35, seed: 1111 }),
  e("margazhi-octagon", "Margazhi Ettu-kona Sikku", "எட்டுக் கோண சிக்கு", "sikku", ["margazhi"], "pandya-nadu", "advanced", "60 min",
    "An octagon of dots woven with one continuous line — a favourite for competitions.",
    ["octagon", "single line"], { kind: "sikku", dots: 11, shape: "octagon", singleLine: true, palette: "rice-flour", density: 0.55, seed: 808 }),
  e("margazhi-pumpkin-flower", "Parangi Poo Centre", "பரங்கிப் பூ கோலம்", "poo", ["margazhi"], "chola-nadu", "beginner", "25 min",
    "A flower kolam with a yellow centre — where the pumpkin flower is placed on a cow-dung ball in Margazhi.",
    ["flower", "pumpkin flower", "yellow"], { kind: "poo", palette: "pongal", symmetry: 8, layers: 4, seed: 88 }),
  e("margazhi-star", "Margazhi Velli Natchathiram", "மார்கழி நட்சத்திரம்", "motif", ["margazhi", "christmas"], "thondai-nadu", "beginner", "20 min",
    "A glowing star with pastel petal rings for the cool Margazhi mornings.",
    ["star", "pastel"], { kind: "motif", motif: "star", palette: "margazhi", symmetry: 8, layers: 3, seed: 12 }),

  // ── Deepavali ───────────────────────────────────────────────────
  e("deepavali-agal", "Deepavali Agal Vilakku", "தீபாவளி அகல் விளக்கு", "motif", ["deepavali"], "pandya-nadu", "intermediate", "40 min",
    "A glowing clay lamp at the centre, ringed by tiny lamps — light the real diyas right on the kolam at night.",
    ["lamp", "diya", "night"], { kind: "motif", motif: "diya", palette: "deepavali", background: "night", symmetry: 12, layers: 3, seed: 6 }),
  e("deepavali-rangoli-12", "Deepavali Rangoli Chakra", "தீபாவளி ரங்கோலி", "poo", ["deepavali"], "karnataka", "intermediate", "45 min",
    "A 12-fold rangoli in magenta, gold and violet — the bright festival-night style.",
    ["rangoli", "colour", "mandala"], { kind: "poo", palette: "deepavali", background: "night", symmetry: 12, layers: 6, seed: 1212 }),
  e("deepavali-peacock", "Deepavali Mayil Thogai", "மயில் தோகைக் கோலம்", "motif", ["deepavali", "krishna-jayanthi"], "chettinad", "intermediate", "40 min",
    "A peacock-feather eye surrounded by jewel-tone petals.",
    ["peacock", "feather", "blue"], { kind: "motif", motif: "peacock", palette: "peacock", symmetry: 12, layers: 3, seed: 222 }),
  e("deepavali-lotus", "Deepavali Thamarai", "தீபாவளி தாமரை", "motif", ["deepavali", "varalakshmi-vratham"], "pandya-nadu", "intermediate", "35 min",
    "A pink lotus for Lakshmi Puja on Deepavali, framed with gold petals.",
    ["lotus", "lakshmi"], { kind: "motif", motif: "lotus", palette: "deepavali", background: "night", symmetry: 12, layers: 3, seed: 51 }),
  e("deepavali-loops", "Deepavali Colour Sikku", "தீபாவளி வண்ணச் சிக்கு", "sikku", ["deepavali"], "thondai-nadu", "intermediate", "35 min",
    "A 9-dot diamond with festive coloured loops on a night floor.",
    ["loops", "colour", "night"], { kind: "sikku", dots: 9, shape: "diamond", singleLine: false, palette: "deepavali", background: "night", density: 0.4, seed: 4 }),

  // ── Karthigai ───────────────────────────────────────────────────
  e("karthigai-deepa-varisai", "Karthigai Deepa Varisai", "கார்த்திகை தீப வரிசை", "motif", ["karthigai-deepam"], "thondai-nadu", "intermediate", "40 min",
    "A cluster of lamps inside a ring of flame petals — lay real agal vilakkus on the outer ring.",
    ["lamps", "flame"], { kind: "motif", motif: "karthigai-lamps", palette: "karthigai", background: "night", symmetry: 16, layers: 3, seed: 9 }),
  e("karthigai-flame-poo", "Jothi Poo Kolam", "ஜோதிப் பூக்கோலம்", "poo", ["karthigai-deepam"], "chola-nadu", "beginner", "25 min",
    "Flame-coloured petals radiating like the Annamalai deepam.",
    ["flame", "flower"], { kind: "poo", palette: "karthigai", symmetry: 8, layers: 4, seed: 4040 }),
  e("karthigai-padi", "Karthigai Padi Kolam", "கார்த்திகை படிக் கோலம்", "padi", ["karthigai-deepam"], "chola-nadu", "intermediate", "35 min",
    "A double-line padi kolam with marked spots for lamps between the layers.",
    ["padi", "lamps", "geometric"], { kind: "padi", palette: "karthigai", background: "kaavi", layers: 4, seed: 27 }),

  // ── Tamil New Year ──────────────────────────────────────────────
  e("puthandu-kalasam", "Puthandu Poorna Kalasam", "புத்தாண்டு கலசம்", "motif", ["puthandu", "wedding"], "pandya-nadu", "intermediate", "40 min",
    "A kalasam with mango leaves and coconut — the auspicious start of the Tamil year.",
    ["kalasam", "mango leaves", "auspicious"], { kind: "motif", motif: "kalasam", palette: "temple", symmetry: 12, layers: 3, seed: 401 }),
  e("puthandu-padi", "Chithirai Padi Kolam", "சித்திரை படிக் கோலம்", "padi", ["puthandu"], "chola-nadu", "intermediate", "35 min",
    "Kaavi-red floor with white double-line padi — fresh and auspicious for Chithirai 1.",
    ["padi", "kaavi", "temple"], { kind: "padi", palette: "temple", background: "kaavi", layers: 5, seed: 414 }),
  e("puthandu-mango", "Maavilai Poo Kolam", "மாவிலைப் பூக்கோலம்", "poo", ["puthandu"], "kongu-nadu", "beginner", "25 min",
    "Leaf and flower rings echoing the mango-leaf thoranam above the door.",
    ["leaves", "flower"], { kind: "poo", palette: "pongal", background: "leaf", symmetry: 8, layers: 4, seed: 4141 }),

  // ── Navaratri ───────────────────────────────────────────────────
  e("navaratri-nine-hues", "Navaratri Nava Varnam", "நவராத்திரி நவ வர்ணம்", "poo", ["navaratri"], "thondai-nadu", "intermediate", "45 min",
    "Nine-colour rings for the nine nights — one colour for each evening of the Goddess.",
    ["nine colours", "mandala"], { kind: "poo", palette: "navaratri", symmetry: 9, layers: 7, seed: 999 }),
  e("navaratri-golu-padi", "Golu Padi Kolam", "கொலு படிக் கோலம்", "padi", ["navaratri"], "chola-nadu", "intermediate", "35 min",
    "A stepped padi kolam to place in front of the Golu steps.",
    ["golu", "steps", "padi"], { kind: "padi", palette: "navaratri", background: "kaavi", layers: 5, seed: 909 }),
  e("saraswati-lotus", "Saraswati Puja Lotus", "சரஸ்வதி பூஜை தாமரை", "motif", ["navaratri"], "pandya-nadu", "beginner", "30 min",
    "A white-and-pink lotus for Saraswati Puja, placed before the books and instruments.",
    ["lotus", "saraswati"], { kind: "motif", motif: "lotus", palette: "lotus", symmetry: 8, layers: 2, seed: 910 }),

  // ── Vinayagar / Krishna / Varalakshmi / Aadi ───────────────────
  e("vinayagar-lotus-seat", "Vinayagar Thamarai Peedam", "விநாயகர் தாமரை பீடம்", "motif", ["vinayagar-chaturthi"], "chola-nadu", "beginner", "25 min",
    "A lotus seat kolam where the Vinayagar idol is placed.",
    ["lotus", "puja"], { kind: "motif", motif: "lotus", palette: "lotus", symmetry: 12, layers: 3, seed: 108 }),
  e("vinayagar-maa", "Vinayagar Maa Kolam", "விநாயகர் மாக்கோலம்", "maa", ["vinayagar-chaturthi", "varalakshmi-vratham"], "chola-nadu", "intermediate", "40 min",
    "A brilliant white wet-rice-paste kolam on red kaavi for the puja room.",
    ["maa kolam", "white", "puja"], { kind: "poo", palette: "rice-flour", background: "kaavi", symmetry: 12, layers: 4, seed: 14 }),
  e("krishna-mayil", "Krishna Jayanthi Mayil", "கிருஷ்ண ஜெயந்தி மயில்", "motif", ["krishna-jayanthi"], "thondai-nadu", "intermediate", "35 min",
    "A peacock-feather kolam for Little Krishna — pair it with tiny footprints leading to the puja room.",
    ["peacock", "krishna", "feet"], { kind: "motif", motif: "peacock", palette: "peacock", symmetry: 8, layers: 3, seed: 81 }),
  e("krishna-sikku", "Gokulam Sikku", "கோகுலச் சிக்கு", "sikku", ["krishna-jayanthi"], "pandya-nadu", "intermediate", "30 min",
    "Peacock-blue and green loops over a 7×7 grid — playful like Krishna himself.",
    ["loops", "blue"], { kind: "sikku", dots: 7, singleLine: false, palette: "peacock", density: 0.3, seed: 8 }),
  e("varalakshmi-maa-lotus", "Varalakshmi Maa Kolam", "வரலட்சுமி மாக்கோலம்", "maa", ["varalakshmi-vratham"], "chola-nadu", "advanced", "50 min",
    "A delicate 16-petal maa kolam to welcome Goddess Lakshmi at the threshold.",
    ["maa kolam", "lakshmi", "white"], { kind: "poo", palette: "rice-flour", background: "kaavi", symmetry: 16, layers: 5, seed: 1616 }),
  e("varalakshmi-kalasam", "Lakshmi Kalasam", "லட்சுமி கலசம்", "motif", ["varalakshmi-vratham"], "pandya-nadu", "intermediate", "40 min",
    "The kalasam that becomes the Goddess — drawn below the puja with lotus petals around.",
    ["kalasam", "lotus"], { kind: "motif", motif: "kalasam", palette: "lotus", symmetry: 12, layers: 3, seed: 1617 }),
  e("aadi-perukku-waves", "Aadi Perukku Alai", "ஆடிப் பெருக்கு அலை", "sikku", ["aadi-perukku"], "chola-nadu", "intermediate", "35 min",
    "A rectangular single-line sikku that flows like the Cauvery in flood.",
    ["river", "waves", "single line"], { kind: "sikku", dots: 11, rows: 7, shape: "rect", singleLine: true, palette: "peacock", background: "slate", density: 0.25, seed: 18 }),

  // ── Ratha Saptami / Sankranti ──────────────────────────────────
  e("ratha-saptami-ther", "Ratha Saptami Ther", "ரத சப்தமி தேர் கோலம்", "motif", ["ratha-saptami", "sankranti"], "chola-nadu", "intermediate", "40 min",
    "The Sun's chariot (ther) kolam drawn in front of homes on Ratha Saptami.",
    ["chariot", "ther", "sun"], { kind: "motif", motif: "ther", palette: "karthigai", symmetry: 12, layers: 2, seed: 7 }),
  e("sankranti-muggu", "Sankranti Rangu Muggu", "சங்கராந்தி முக்கு", "pulli", ["sankranti", "pongal"], "andhra", "intermediate", "40 min",
    "A 13-dot coloured muggu — place gobbemmalu (cow-dung balls with flowers) on the centre.",
    ["muggulu", "dots", "colour"], { kind: "pulli", dots: 13, shape: "square", palette: "rainbow", seed: 1301 }),

  // ── Onam / South ───────────────────────────────────────────────
  e("onam-pookalam", "Onam Pookalam", "ஓணப் பூக்களம்", "poo", ["onam"], "kerala", "intermediate", "60 min",
    "Concentric rings of marigold, chrysanthemum, crimson and leaf green — just like a flower-petal pookalam.",
    ["pookalam", "flowers", "rings"], { kind: "poo", palette: "pookalam", symmetry: 16, layers: 7, seed: 10 }),
  e("onam-atham", "Atham Simple Pookalam", "அத்தப் பூக்களம்", "poo", ["onam"], "kerala", "beginner", "20 min",
    "The small first-day pookalam that grows each day for ten days.",
    ["pookalam", "small"], { kind: "poo", palette: "pookalam", symmetry: 8, layers: 3, seed: 1 }),
  e("nanjil-lamp-poo", "Nanjil Vilakku Poo", "நாஞ்சில் விளக்குப் பூ", "motif", ["onam", "karthigai-deepam"], "nanjil-nadu", "intermediate", "40 min",
    "Where Tamil and Kerala traditions meet — a lamp kolam framed with flower rings.",
    ["lamp", "flowers"], { kind: "motif", motif: "diya", palette: "pookalam", symmetry: 16, layers: 3, seed: 616 }),

  // ── Christmas / New year ───────────────────────────────────────
  e("christmas-star", "Christmas Velli Natchathiram", "கிறிஸ்துமஸ் நட்சத்திரம்", "motif", ["christmas"], "nanjil-nadu", "beginner", "25 min",
    "A bright star kolam with colourful rings, seen at homes and churches across Tamil Nadu in December.",
    ["star", "colour"], { kind: "motif", motif: "star", palette: "rainbow", symmetry: 8, layers: 3, seed: 2512 }),
  e("new-year-rainbow-pulli", "New Year Vaanavil Pulli", "புத்தாண்டு வானவில் புள்ளி", "pulli", ["christmas"], "thondai-nadu", "beginner", "25 min",
    "A rainbow pulli diamond to greet 1 January.",
    ["dots", "rainbow"], { kind: "pulli", dots: 11, shape: "diamond", palette: "rainbow", seed: 101 }),

  // ── Daily ──────────────────────────────────────────────────────
  e("daily-3x3", "First Sikku (3×3)", "முதல் சிக்கு கோலம்", "sikku", ["daily"], "thondai-nadu", "beginner", "5 min",
    "The very first sikku every child learns — 9 dots and one line.",
    ["beginner", "single line", "small"], { kind: "sikku", dots: 3, singleLine: true, palette: "rice-flour", density: 0.3, seed: 2 }),
  e("daily-5x5", "Morning Sikku (5×5)", "காலைச் சிக்கு", "sikku", ["daily"], "chola-nadu", "beginner", "10 min",
    "A quick 5×5 single-line kolam for busy mornings.",
    ["beginner", "single line"], { kind: "sikku", dots: 5, singleLine: true, palette: "rice-flour", density: 0.5, seed: 55 }),
  e("daily-7x7", "Vaasal Sikku (7×7)", "வாசல் சிக்கு", "sikku", ["daily"], "pandya-nadu", "intermediate", "15 min",
    "The classic 7×7 doorstep kolam — one line, forty-nine dots.",
    ["single line", "classic"], { kind: "sikku", dots: 7, singleLine: true, palette: "rice-flour", density: 0.45, seed: 3 }),
  e("daily-pulli-7", "Simple Pulli Poo", "எளிய புள்ளிப் பூ", "pulli", ["daily"], "thondai-nadu", "beginner", "10 min",
    "A 7-dot diamond flower — perfect for learning dot spacing.",
    ["beginner", "dots"], { kind: "pulli", dots: 7, shape: "diamond", palette: "rice-flour", seed: 7 }),
  e("daily-diamond-sikku", "Idukku Pulli Sikku", "இடுக்குப் புள்ளி சிக்கு", "sikku", ["daily", "margazhi"], "chola-nadu", "intermediate", "20 min",
    "A single line around a diamond of interlaced (idukku) dots: 1-3-5-7-9-7-5-3-1.",
    ["diamond", "single line"], { kind: "sikku", dots: 9, shape: "diamond", singleLine: true, palette: "rice-flour", density: 0.5, seed: 919 }),

  // ── Weddings / Chettinad / grand ───────────────────────────────
  e("chettinad-courtyard", "Chettinad Courtyard Padi", "செட்டிநாடு முற்றக் கோலம்", "padi", ["wedding", "puthandu"], "chettinad", "advanced", "60 min",
    "Bold geometric double lines and stars sized for a mansion courtyard.",
    ["geometric", "large", "padi"], { kind: "padi", palette: "temple", background: "cream", layers: 6, symmetry: 12, seed: 630 }),
  e("chettinad-sikku", "Chettinad Grand Sikku (15×15)", "செட்டிநாடு பெரிய சிக்கு", "sikku", ["wedding", "margazhi"], "chettinad", "advanced", "90 min",
    "A grand 15×15 single-line sikku — a test of patience and focus.",
    ["large", "single line", "advanced"], { kind: "sikku", dots: 15, singleLine: true, palette: "rice-flour", background: "slate", density: 0.5, seed: 1515 }),
  e("wedding-kalasam", "Kalyana Kalasam", "கல்யாணக் கலசம்", "motif", ["wedding"], "chola-nadu", "intermediate", "45 min",
    "A kalasam kolam for the manavarai (wedding stage), with lamp rings for blessings.",
    ["kalasam", "wedding"], { kind: "motif", motif: "kalasam", palette: "deepavali", symmetry: 16, layers: 4, seed: 1008 }),
  e("hridaya-kamalam", "Hridaya Kamalam (Heart Lotus)", "இருதய கமலம்", "sikku", ["daily", "wedding", "margazhi"], "chola-nadu", "advanced", "60 min",
    "Inspired by the famed 'heart lotus' kolam — an intricate octagonal single-line weave, traditionally drawn with great devotion.",
    ["lotus", "octagon", "single line"], { kind: "sikku", dots: 13, shape: "octagon", singleLine: true, palette: "lotus", density: 0.6, seed: 1300 }),
  e("griha-pravesam-poo", "Griha Pravesam Poo", "கிரகப்பிரவேசப் பூ", "poo", ["wedding"], "kongu-nadu", "intermediate", "40 min",
    "A welcoming flower kolam for house-warming with auspicious temple colours.",
    ["housewarming", "flower"], { kind: "poo", palette: "temple", symmetry: 12, layers: 5, seed: 2020 }),
];

export const entryById = (id: string) => CATALOG.find((k) => k.id === id);
