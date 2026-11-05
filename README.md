# Thamizh Kolangal · தமிழ் கோலங்கள்

A colourful learning app for traditional Tamil kolams: Pongal, Margazhi, Deepavali, Karthigai, Navaratri and every other festival, from all regions of Tamil Nadu and its southern neighbours. It includes **Kolam Guru**, an AI agent that uses your own Groq API key (BYOK).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

No server environment variables are needed. Each user pastes their Groq key (from https://console.groq.com/keys) on the **Ask Kolam Guru** page. The key is stored in that browser's localStorage and sent only in the `x-groq-key` header of that user's own requests. The server never stores it.

## Pages

| Route | What it does |
|---|---|
| `/` | Hero with a single-line sikku that draws itself, plus festival seasons, kolam families, favourites and regions |
| `/gallery` | 50 kolams with search and filters for festival, type, level and region |
| `/kolam/[id]` | Hand-drawing animation, a guided lesson that goes step by step, colour swaps, variations, PNG/SVG download and remix |
| `/festivals`, `/festivals/[slug]` | 18 festivals, each with its traditions, colours, motifs and kolams |
| `/regions` | Thondai, Chola, Pandya and Kongu Nadu, Chettinad, Nanjil Nadu, plus Kerala pookalam, Andhra muggulu and Karnataka rangavalli |
| `/learn` | Your first sikku, a one-month learning ladder, materials, technique and a glossary |
| `/studio` | Design your own kolam: choose the family, dots, shape, symmetry, motif, colours and floor |
| `/guru` | The Kolam Guru chat agent |

## The kolam engine (`lib/kolam`)

Every kolam is a small JSON `KolamSpec` that is rendered to SVG the same way every time. That's why the catalogue, the studio and the AI agent can all use the same format.

- **sikku**: the line moves along a dot lattice using a mirror model. It bounces at the edges, and "mirrors" placed between dots make it turn. A greedy pass then joins all the loops into **one unbroken line**, which is what makes it a true sikku/kambi kolam.
- **pulli**: dots joined ring by ring with petals, leaves, diamonds and lines. Dots can be straight (ner) or interlaced (idukku).
- **poo**: rangoli/pookalam mandalas made of petal, leaf, dot, scallop, vine and lamp rings.
- **padi**: geometric patterns in double lines: stars, squares, stepped borders and kaavi floors.
- **motif**: a festival picture in the centre (Pongal pot, diya, lotus, sun, kalasam, star, ther, cow, peacock feather, Karthigai lamps) surrounded by rings.

Each render also produces its own step-by-step instructions.

## Agentic AI (`lib/agent`, `app/api/guru`)

The agent is built on the **Vercel AI SDK** (`ai` v5 + `@ai-sdk/groq`). It runs a tool-calling loop of up to 8 steps (`stopWhen: stepCountIs(8)`) with these tools:

- `search_kolams`: searches the catalogue by keyword and by festival, type, region or level
- `get_kolam_details`: returns the full details and steps for one kolam
- `design_kolam`: creates a brand-new design, which the page renders live
- `festival_guide`, `regional_styles`, `learning_guide`: festival, regional and learning knowledge

The response includes the agent's tool trace (shown as "Agent steps"), the catalogue kolams it recommends and the designs it created. If no key is set, Guru falls back to an offline catalogue search.
`/api/guru/models` checks the key and lists the models it can use. The default is `openai/gpt-oss-120b`.
