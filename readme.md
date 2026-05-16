# Scopa & Scopa Quindici

A browser-based implementation of the classic Italian card games **Scopa** and **Scopa Quindici**, playable against a computer opponent. No app store, no trackers, no ads — loads once and runs entirely in the browser on any device.

---

## Features

- Two game modes: **Scopa** and **Scopa Quindici** (15-point variant)
- Two card decks: **Napoletane** and **Trevisane**
- Three languages: 🇩🇪 German · 🇬🇧 English · 🇮🇹 Italian
- Computer AI with strategic scoring (primiera, denari, sette bello)
- Three difficulty levels: **Easy**, **Medium**, **Hard** (selectable on the start page)
- Works on desktop and mobile (landscape mode)
- Background music with on/off toggle
- Move hint after 5 seconds of inactivity
- "Back" button to replay the computer's last move

---

## Game Rules

The deck has 40 cards (values 1–10) in four suits: **Denari**, **Coppe**, **Bastoni**, **Spade**.  
Each player receives 3 cards; 4 cards are placed face-up on the table.

**Objective:** Take cards from the table using a card from your hand.

- **Scopa:** Your card's value must match the sum of the cards you take. If a card of the same value is on the table, you must take that single card — not a combination.
- **Scopa Quindici:** The card you play plus the cards you take must sum to exactly **15**.

Taking all cards from the table in one move earns a **Scopa** (bonus point).  
The game ends when a player reaches **15 or more points** at the end of a round.

### Scoring per round

| Category        | Description                                                  |
|-----------------|--------------------------------------------------------------|
| **Carte**       | Most cards collected → 1 point                               |
| **Denari**      | Most Denari cards collected → 1 point                        |
| **Sette Bello** | The 7 of Denari → 1 point                                    |
| **Primiera**    | Highest sum of best card per suit (7,6,5,4,3,2,1) → 1 point |
| **Scopa**       | +1 point per sweep of the table                              |

Full rules in your language:
- [Regeln (Deutsch)](app/info_de.html)
- [Rules (English)](app/info_en.html)
- [Regole (Italiano)](app/info_it.html)

---

## Tech Stack

| Layer    | Technology                   |
|----------|------------------------------|
| Language | TypeScript (compiled to ES5) |
| Rendering | HTML5 Canvas                |
| Bundler  | webpack                      |
| Tests    | Jest + ts-jest               |
| Server   | Node.js (static file serving)|

---

## Project Structure

```
scopa/
├── app/
│   ├── card.ts               # Card classes and hierarchy
│   ├── cardSet.ts            # Card set / permutation model
│   ├── game.ts               # Abstract game logic & rendering
│   ├── scopaGame.ts          # Scopa rules and AI
│   ├── scopaQuindiciGame.ts  # Scopa Quindici rules and AI
│   ├── scoringStrategy.ts    # AI difficulty strategies (Easy/Medium/Hard)
│   ├── score.ts              # Scoring logic
│   ├── specialEffects.ts     # Animations, sound, bomb
│   ├── scopaMedia.ts         # Media access interface
│   ├── app.ts                # Entry point, game loop
│   ├── index.html            # Start page
│   ├── trevisane.html        # Game page (Trevisane deck)
│   ├── napoletane.html       # Game page (Napoletane deck)
│   ├── info_de.html          # Rules in German
│   ├── info_en.html          # Rules in English
│   └── info_it.html          # Rules in Italian
├── tests/
│   ├── scopa.test.ts         # Game logic tests
│   ├── score.test.ts         # Scoring tests
│   ├── cardSet.test.ts       # CardSet tests
│   └── simulate.ts           # Full game simulation (1000 games)
├── tsconfig.json
├── webpack.config.js
└── server.js
```

---

## AI Difficulty

The computer opponent uses a scoring strategy to evaluate all valid card combinations each turn and pick the best one. Three difficulty levels are available:

| Level      | Scoring criteria considered                                      |
|------------|------------------------------------------------------------------|
| **Easy**   | Scopa (table sweep) · Sette Bello                                |
| **Medium** | + Denari count · Card count                                      |
| **Hard**   | + Primiera · Scopa-risk penalty (avoids leaving dangerous totals)|

The difficulty is selectable on the start page and passed as a URL parameter (`difficulty=easy/medium/hard`).

Implemented via the **Strategy + Template Method** pattern (`scoringStrategy.ts`): `BaseScoringStrategy` defines the scoring pipeline with overridable methods per criterion. New difficulty levels can be added by extending `BaseScoringStrategy` and overriding only the relevant methods.

### Simulation

`tests/simulate.ts` runs 1000 AI vs. AI games and reports scores per category. Measured win rates vs. a capture-first random player:

| Strategy | Win rate vs. Random |
|----------|---------------------|
| Easy     | ~55%                |
| Medium   | ~58%                |
| Hard     | ~60%                |

---

## Getting Started

```bash
npm install

# Build for production
export NODE_OPTIONS=--openssl-legacy-provider
npm run build

# Build for development (watch mode)
npm run watch

# Run tests
npm test

# Start local dev server (second terminal)
npm start
# → open http://localhost:8080
```

**Deployment:** Upload the following to your web server:

```
app/images/
app/music/
app/app.bundle.js
app/index.html
app/trevisane.html
app/napoletane.html
app/info_de.html
app/info_en.html
app/info_it.html
app/styles.css
```

---

## Contact

Found a bug or want to get in touch?  
Open an [issue](https://github.com/sterdomi/scopa-quindici/issues).

---

## License

[LGPL-3.0](https://www.gnu.org/licenses/lgpl-3.0.html) — © Dominic Sterchi
