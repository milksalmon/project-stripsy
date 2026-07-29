# Stripsy — Project Context for Claude Code

## What this is

Stripsy is a real time collaborative comic strip web platform, built as a Final Year Project (FYP) by Louis (student ID TP070482) at Asia Pacific University of Technology and Innovation (APU).

2 to 4 users each draw one panel of a comic strip in isolation from each other. Once all panels are complete, they are revealed simultaneously. The mechanic is inspired by the Surrealist exquisite corpse technique.

**Core thesis:** panel isolation structurally prevents in process social comparison during collaborative drawing, which reduces creative anxiety. This is the load bearing claim of the whole project. Any feature that does not clearly connect to this thesis is treated as out of scope for the MVP, even if it would make the app more complete.

The comic strip (sequential panel) format is a deliberate design choice: it forces each contributor to draw a distinct narrative moment, which prevents direct subject to subject comparison between panels.

## Tech stack

- **Frontend:** React, Vite, react-konva, Tailwind CSS v4, shadcn/ui, socket.io-client
- **Backend:** Node.js, Express, Socket.IO
- **Database:** MongoDB Atlas (M0 free tier), Mongoose
- **AI (in progress):** `@google/genai` SDK targeting the Gemini Interactions API
- **Dev environment:** Windows 11, VS Code, Chrome, no CUDA GPU (AMD), so Colab/Kaggle would be used for any training workloads (none currently planned)
- **Methodology:** Scrum

## Repo structure

Monorepo with `/client` and `/server` folders. Each has its own `package.json` and `node_modules`. `.env` lives in `/server`.

## Scope boundaries (intentional, not oversights)

- Desktop and drawing tablet only. Mobile and touchscreen support is deferred to future work.
- No session history / viewing past completed comics. This is explicitly out of MVP scope because it does not connect to the anxiety reduction thesis, and ephemeral, anonymous participation arguably supports the thesis better than persistent accounts would.
- No user accounts or session persistence. The supervisor suggested this as a "completeness" enhancement, but it was deliberately deprioritized to preserve thesis scope discipline. This decision is documented explicitly in the Interim Report (IR) as considered but deprioritized, not buried in a generic future work section.
- No shared canvas drawing. Socket.IO is used for session coordination (room management, join/leave, phase transitions, timer sync) and for pushing the simultaneous reveal. It is not used for stroke by stroke drawing synchronization.

## Architecture decisions worth knowing

- Each collaborator has an independent Konva Stage with its own stroke history. Strokes are stored as an immutable array of objects and submitted to the server once on completion, not synced stroke by stroke.
- Real time stroke sync during drawing is in memory via Socket.IO only. There are no MongoDB writes for individual strokes.
- Undo/redo is entirely developer defined since Konva/react-konva has no native undo system. A stack limit is used as a justifiable tradeoff, documented as such in the IR.
- MongoDB schema design follows the official MongoDB access pattern driven process: workload identification first, then relationship mapping, then embed vs. reference decisions. Embedded subdocuments intentionally omit `_id`. Mongoose handles referential integrity on ObjectId references.
- A reusable `<Text>` component exists in `components/ui`, built with Tailwind v4, slate color scheme, four variants (heading, subheading, body, muted), and a polymorphic `as` prop.
- Gemini API integration: a working Express route exists at `/ai-test`. CORS middleware is required for cross origin calls from the Vite dev server. Model output can contain LaTeX style notation that renders as raw text, so production prompts need explicit formatting instructions.
- A known npm audit finding (react-router vulnerability GHSA-qwww-vcr4-c8h2) has been reviewed and confirmed non-exploitable in this project's CSR setup (the vulnerable path is RSC mode only). This is documented as an accepted non-issue, not something to "fix."

## AI prompt generation feature (under consideration, not committed)

There is a design tension: a single shared prompt for all panels conflicts with panel isolation. The proposed resolution, if this feature is built, is one overarching theme split into distinct per-panel narrative fragments (roughly 10 words each, e.g. "the plan," "the betrayal," "the getaway" for a heist theme). This preserves isolation while giving the reveal narrative coherence. Open question: should the model split one theme into fragments, or should fragments be generated independently from a shared seed/category? Likely approach if implemented: Gemini API (free tier, with a static fallback on failure), not a fine-tuned small model, since the FYP title does not mention ML and this feature was survey suggested rather than thesis committed.

## Hosting (for the demo)

Railway or Render are recommended over Hetzner or Elastic Beanstalk, because Socket.IO needs persistent WebSocket connections, which is incompatible with serverless setups. If Render's free tier is used, note the cold start delay for presentation day. AWS EC2 is a fallback option Louis has some prior familiarity with.

## Where things stand right now

**IR (Interim Report) writing** is the primary active workload.

- Chapter 1 and Chapter 3: substantially complete.
- Chapter 2 (domain research) is the main remaining gap:
  - 2.2.1 Collaborative Creativity & Exquisite Corpse: substantially done. Covers psychological barriers to collaborative drawing, collaborative drawing literature, the exquisite corpse tradition, Boden's combinational creativity framework, and distributed creativity / collaborative emergence (Sawyer & DeZutter). Structure is locked.
  - 2.2.3 Gamification: drafted but thin, anchored on Deterding et al. (2011). The timer mechanic is justified as reducing overthinking. A third subsection point is still pending.
  - 2.2.2 Real-Time Web Systems: not started. Planned subsections are WebSocket protocol + multi-user synchronisation (merged) and session management. Needs 1 to 2 academic or authoritative sources on WebSocket / real time web systems (RFC 6455 and a CSCW or engineering source are candidates).

**Confirmed literature sources:** Gallo et al. (2025), Mills & Payne (2024), Belda-Medina (2024), Ranaweera et al. (2017) on ExquiMo, Likarish & Winet (2012) on Exquisite Corpse 2.0, Deterding et al. (2011) on gamification, Boden (2004) The Creative Mind.

**Obtained but not yet reviewed:** Sawyer & DeZutter (2009), Sawyer (2007) Group Genius.

**Implementation** is in active development alongside the IR:
- MongoDB schema design is in progress.
- Drawing canvas architecture is settled (see above).
- Gemini API integration is in progress with a working test route.

## Not yet done

- Finish IR Chapter 2 (2.2.3 third point, then draft 2.2.2 from scratch once WebSocket sources are found).
- ER diagram distinguishing embedded vs. referenced relationships for the IR architecture chapter.
- Use case specifications for all 12 UC IDs.
- Sequence diagrams for the drawing phase and the simultaneous panel reveal.
- A seed script for development/demo purposes (not a formal dataset).
- Final hosting decision and setup for the demo.

## Key people and framing

- Supervisor accepted the repositioned/narrowed scope and suggested accounts as an optional enhancement (not adopted for MVP).
- FYP manager confirmed that SDG framing changes are permitted.
- SDG alignment: SDG 3 (Good Health and Well-Being).
- Survey: 31 respondents.

## Working principles for anyone (including Claude Code) touching this project

- **Thesis scope discipline comes first.** Before adding a feature, ask whether it connects to "panel isolation reduces creative anxiety." If it doesn't, it's a candidate for deprioritization, documented explicitly rather than silently dropped.
- **Socket.IO is for coordination, not canvas sync.** Don't build stroke by stroke real time sync; that's an explicit non-goal.
- **Don't introduce unverified citations or author names** in anything IR related. Flag uncertainty instead of generating plausible sounding references.
- **Match APU programme house style** in written deliverables: direct, declarative, concise, not over academic. Use "the developer" / "the researcher" for academic third person convention.
- **IR similar systems sections must stand on their own**, with no reference to Stripsy inside them.
- **Class diagram is a required deliverable** regardless of how well it fits a JS/MongoDB codebase. Treat it as a logical model of system structure, not a literal reflection of the code.
- Louis prefers to discuss and agree on direction before committing to document edits, works section by section with review between stages, and verifies suggestions against sources and peer examples. He values direct, candid feedback over diplomatic hedging, so don't soften technical or academic assessments unnecessarily.
