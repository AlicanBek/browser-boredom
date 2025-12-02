# Copilot System Instructions: Last Dawn — Istanbul (Browser Game)

These instructions configure Copilot agents working in this repository to maintain and extend the single‑file browser game in `lastdawnistanbul2025.html`.

## **Project Overview**
- **Type:** Single‑page browser game (HTML + CSS + vanilla JS in one file).
- **Entry file:** `lastdawnistanbul2025.html`.
- **Theme:** Post‑apocalyptic defense and resource management set in Istanbul.
- **Core loop:** Morning assignments → Evening report → Combat prep → Night combat → Summary → Next day.
- **Victory:** Reach 100 cure points and survive the production phase.
- **Defeat:** All survivors die or wall collapses.

## **UI Structure**
- **Screens:** Controlled by `.screen` elements toggling `.active`.
	- `welcomeScreen`, `storyScreen`, `gameScreen`, `eveningScreen`, `combatPrepScreen`, `combatScreen`, `nightSummaryScreen`, `victoryScreen`, `gameOverScreen`.
- **Popups:** `helpPopup`, `tradePopup`, `specificTradePopup` with `popupOverlay`.
- **Key displays:** Resource grid (scrap/food/ammo/medical), survivor counts, assignment controls, progress bars (cure, wall health), combat log.

## **Game State & Logic**
- **Single global `gameState` object** tracks player name, day, resources, items, survivors, assignments, progress, milestones, combat, trading, and dead survivors.
- **Primary functions:**
	- Flow: `startGame()`, `beginDay1()`, `confirmDay()`, `processDayResults()`, `goToCombatPrep()`, `startCombat()`, `runCombat()`, `endCombat()`, `continueTomorrow()`.
	- UI updates: `updateDisplay()`, `updateResourceColor()`, `updateMilestoneTracker()`, `updateWallDisplay()`, `addCombatMessage()`.
	- Assignments: `adjustAssignment(type, change)`.
	- Combat actions: `useMolotov()`, `useGrenade()`, `useSurgeBlast()`.
	- Events/Helpers: `checkMilestones()`, `showEventPopup()`, `getRandomSurvivorName()`, `causeCasualty()`.
	- Trading: `openTrading()`, `openSpecificTrade(resourceType)`, `executeTrade(...)`, `closeTrading()`, `closeSpecificTrade()`.
	- Help: `showHelp()`, `closeHelp()`, `closePopup()`.

## **Development Guidelines**
- **Keep single‑file architecture unless requested:** Modify `lastdawnistanbul2025.html` directly and avoid splitting into multiple files unless the user explicitly asks.
- **Minimal, focused changes:** Preserve style and current public behavior; avoid reformatting unrelated code.
- **Consistent style:** Match existing CSS and JS patterns; no new frameworks.
- **Naming:** Keep Turkish names, locations, and theme intact.
- **Accessibility:** Ensure buttons and interactive elements are reachable and readable; avoid color‑only indicators without text.
- **Performance:** Prefer simple DOM operations; avoid heavy animations or large assets.

## **Feature Workflows**
- **UI additions:**
	- Add elements to the relevant screen container and wire with IDs.
	- Toggle via `.classList.add('active')` / `.remove('active')` consistent with other screens.
- **State changes:**
	- Extend `gameState` carefully; initialize defaults in `beginDay1()` if needed.
	- Update all displays via `updateDisplay()` and other specific update helpers.
- **Assignments:**
	- Use `adjustAssignment(type, change)` to maintain survivor constraints and UI counters.
- **Combat:**
	- Use existing item logic and auto‑defense rules; respect ammo costs and zombie kill rates.
- **Trading:**
	- Honor `dailyTradeLimit` and `dailyTradeUsed` to prevent exploitation.

## **Guardrails**
- Do not introduce external libraries, trackers, or network calls.
- Do not change narrative tone, names, or Istanbul setting.
- Do not add violent, hateful, racist, sexist, lewd, or harmful content. If asked, respond: "Sorry, I can't assist with that."
- Avoid copyright‑restricted assets; keep all content original.

## **Testing & Try It**
- **Local run:**
	- Open the file directly in a browser:
		- macOS Finder double‑click or from terminal:
			```zsh
			open /Users/tuko/Projects/browser-boredom/lastdawnistanbul2025.html
			```
- **Quick checks:**
	- Start → Enter name → Day 1 resources populate.
	- Assign survivors → Confirm Day → Evening Report updates resources and progress.
	- Craft items in Combat Prep → Start Combat → Verify wall health, combat log, item usage.
	- Summary → Continue Tomorrow → Day increments and assignments reset.

## **Common Tasks for Copilot**
- Add new events in `processDayResults()` and reflect via `showEventPopup()`.
- Tweak resource thresholds in `updateResourceColor()` warning/critical logic.
- Balance combat parameters in `calculateZombieCount()` and item effects.
- Enhance milestone tracker in `updateMilestoneTracker()`.
- Expand trading options while respecting limits and resource availability.
- Improve help content by populating `showHelp()` with structured HTML.

## **Release Notes Etiquette**
- Summarize changes succinctly: what behavior changed, why, and any tunables.
- Include any player‑visible text updates and ensure translations or tone remain consistent.

## **Notes**
- Model identification: If asked, state the assistant uses GPT-5.
- Keep communications concise and actionable; propose next logical steps.

