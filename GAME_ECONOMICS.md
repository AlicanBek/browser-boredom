# Last Dawn: Istanbul - Game Economics Analysis

## 1. STARTING CONDITIONS
| Resource | Amount |
|----------|--------|
| Scrap | 25 |
| Food | 10 |
| Ammo | 10 |
| Medical | 10 |
| **Survivors** | **3** |
| Wall Health | 100% |

---

## 2. RESOURCE GENERATION (Per Day, per assignment)

### Scavenging (Per Scavenger)
| Resource | Amount | Notes |
|----------|--------|-------|
| Scrap | 20 | Guaranteed |
| Food | 4 | Guaranteed |
| Ammo | 3 + calculated | Base + expected zombies × 3 |
| Medical | ~1-2 (avg) | 30% chance per scavenger (5 per hit) |
| New Survivors | 25% chance | Capped at 12 total |
| **Scavenging Points** | **1 per scavenger** | For milestones |

**Example with 2 Scavengers:**
- Scrap: +60
- Food: +8
- Ammo: +12 (base) + 24 (Day 4 zombies: 8 base) = +36
- Medical: +2 (expected)
- Scavenging Points: +2

---

### Research (Per Researcher) *Requires immune survivor*
| Condition | Output |
|-----------|--------|
| Without Lab Equipment | 1 cure point per researcher |
| With Lab Equipment (Day 5+) | 3 cure points per researcher |

**Example with 1 Researcher:**
- Without lab: +1 cure points
- With lab: +3 cure points

---

### Building (Per Builder)
| Output | Amount |
|--------|--------|
| Wall Health Repair | 6% per builder |
| Max Wall | 100% (capped) |

**Example with 2 Builders:**
- Wall: +10% (capped at 100%)

---

### Healing (Per Healer)
| Function | Notes |
|----------|-------|
| Heal Injured | 1 survivor per healer |
| Cure Sick | 1 survivor per healer (after injured healed) |
| Priority | Injured first, then sick |

**Example with 2 Healers + 2 injured, 1 sick:**
- Injured healed: 2
- Sick cured: 0 (all healers used)

---

## 3. RESOURCE CONSUMPTION

### Daily Food Consumption
| Status | Food Cost | Notes |
|--------|-----------|-------|
| Healthy Survivor | 1 | Per day |
| Injured Survivor | 2 | Per day |
| Sick Survivor | 2 | Per day |

**Example with 3 healthy, 1 injured, 1 sick:**
- Food consumed: 3(1) + 1(2) + 1(2) = **7 food/day**

**Starting food (15) lasts:** ~2 days with 5 survivors

---

### Crafting Costs
| Item | Scrap | Medical | Ammo | Notes |
|------|-------|---------|------|-------|
| Molotov | 10 | 2 | - | Kills 2 zombies |
| Grenade | 25 | 5 | - | Kills 5 zombies |
| Revive Kit | - | 15 | - | Revives 1 dead survivor |
| Surge Blast | - | - | - | One-time, kills all zombies |

**Efficiency (Resource per Kill):**
- Molotov: 10 scrap + 2 medical per 3 kills = **3.33 scrap + 0.67 medical per kill**
- Grenade: 25 scrap + 5 medical per 5 kills = **5 scrap + 1 medical per kill**
- Auto-defense: 3 ammo per kill = **3 ammo per kill**

---

### Trading Post Exchange Rates

**Get Scrap:**
- Trade 1 Food → Get 1 Scrap (1:1)
- Trade 1 Medical → Get 3 Scrap (1:3)
- Trade 1 Ammo → Get 2 Scrap (1:2)

**Get Food:**
- Trade 2 Scrap → Get 1 Food (2:1)
- Trade 1 Medical → Get 2 Food (1:2)
- Trade 1 Ammo → Get 1 Food (1:1)

**Get Medical:**
- Trade 5 Food → Get 1 Medical (3:1)
- Trade 10 Scrap → Get 1 Medical (5:1)
- Trade 4 Ammo → Get 1 Medical (2:1)

**Get Ammo:**
- Trade 2 Food → Get 1 Ammo (2:1)
- Trade 4 Scrap → Get 1 Ammo (3:1)
- Trade 1 Medical → Get 1 Ammo (1:1)

**Notes:**
- Daily trading limit: 50 units per day
- Unlocked at Day 10 (Trading Post milestone)
- Used for balancing resource surpluses/deficits

---

## 4. COMBAT SYSTEM

### Zombie Wave Formula
```
Base = 8 + (day - 1) × 2 + floor((day - 1) / 5)
(Doubles after Military Depot raid, scales up during final phase)
```

| Day | Base Zombies | With Lab | Post-Military |
|-----|--------------|----------|---------------|
| 1 | 8 | 8 | 8 |
| 2 | 10 | 10 | 10 |
| 3 | 12 | 12 | 12 |
| 4 | 14 | 14 | 14 |
| 5 | 15 | 15 | 15 |
| 6 | 17 | 17 | 17 |
| 10 | 25 | 25 | 25 |
| 15 | 34 | 34 | 68 |

---

### Combat Effectiveness
| Defender Type | Kill Rate | Notes |
|--------------|-----------|-------|
| Healthy Survivor | 1 zombie per 2 sec | Costs 3 ammo per kill |
| Injured Survivor | 0 | Cannot fight |
| Sick Survivor | 0 | Cannot fight |

**Auto-Defense Ammo Usage:**
- Defenders: ceil(defenders/2) kills × 3 ammo = **~1.5 ammo per defender**

---

### Weapon Effectiveness
| Weapon | Kill Rate | Ammo Cost | Scrap Cost | Medical Cost |
|--------|-----------|-----------|-----------|--------------|
| Auto-defense | 1 per 2 sec | 3 per kill | 0 | 0 |
| Molotov | 3 kills | 0 | 10 | 2 |
| Grenade | 5 kills | 0 | 25 | 5 |
| Surge Blast | All | 0 | 0 | 0 |

---

## 5. MAJOR ISSUES & IMBALANCES

### 🔴 CRITICAL ISSUES

#### 1. **Food Shortage Crisis**
- Starting: 15 food
- Daily cost with 5 survivors: 7+ food
- **Lasts only 2 days**
- Scavenging adds only 8 food/scavenger/day
- **Problem:** Need 2-3 scavengers just to stay fed
  
**Impact:** Forces scavenger-heavy strategy, blocks research/building early game

#### 2. **Ammo Insufficient for Auto-Defense**
- Day 10: ~25 zombies need ~37-38 ammo for auto-defense alone
- Day 15: ~34 zombies need ~51 ammo
- Scavenging provides: 6 base + calculated need
- **Problem:** Barely stays ahead, zero surplus for weapons
  
**Impact:** Cannot craft combat items while relying on auto-defense

#### 3. **Research Progression Too Slow**
- Requires immune survivor (Day 5+ minimum)
- At 2 cure per researcher: 50 days to cure (without lab)
- With lab (Day 25+): 25 days from lab unlock
- **Game only lasts 19 days before production phase**
  
**Impact:** Cannot win by research alone; dependent on luck

#### 4. **Medical Supply Bottleneck**
- Starting: 10 medical
- Scavenging: 1-2 per day (20% chance per scavenger)
- Costs: 2 per molotov, 5 per grenade, 15 per revive kit
- Auto-heal (without assignment): 10 per sick survivor
- **Problem:** Rapid depletion, disease outbreak after 2 days without medical

#### 5. **Survivor Recruitment Capped Too Low**
- Cap: 12 survivors (soft cap)
- Only 30% chance per scavenger
- Max from 3 scavengers: ~1 survivor/day
- Takes 7-9 days to reach 10-12 survivors

---

### 🟡 MODERATE ISSUES

#### 6. **Wall Defense Ineffective**
- Wall repair: 5% per builder
- Wall damage: 2 per zombie × 0.5 multiplier = 1 damage per zombie (approx)
- Day 15 (34 zombies): -34 wall health vs +5 from builder
- **Problem:** Wall drops 30-40% per night late game; repair can't keep up

#### 7. **Scrap Economy Mismatch**
- Starting: 25 scrap
- Scavenging: 30 scrap per scavenger (good)
- Crafting: 10-25 scrap per item (moderate)
- **Problem:** Building consumes scrap (implicitly), no direct cost shown
  
**Insight:** Scrap is actually the least constrained resource

#### 8. **Healing Assignment Underutilized**
- Healing: 1 survivor per healer
- Can be auto-healed with medical supplies (10/sick, 5/injured)
- **Problem:** Assignment-based healing less efficient than auto-heal with surplus medical

---

## 6. ECONOMY STATE AT KEY MILESTONES

### Day 5 (Immune Survivor + Research Unlocked)
**Assumptions:** 2 scavengers, 1 builder
```
Resources:
  Scrap:   25 + (30×2×5) = 325
  Food:    15 + (8×2×5) - (7×5) = 41 (tight, increasing)
  Ammo:    25 + ((6+28)×2×5) - (150 autodefense) = 65 (deficit!)
  Medical: 10 + (2×5) = 20 (acceptable)

Wall:      100 - 75 (damage) = 25% (CRITICAL)
Survivors: 5-6 (if lucky)
Status:    VULNERABLE - low ammo, low wall, food improving
```

### Day 10 (Trading Post Unlocked)
**Assumptions:** 2 scavengers, 1 researcher, 1 builder
```
Resources:
  Scrap:   ~600+ (accumulating)
  Food:    ~50-60 (stable with 2 scavengers)
  Ammo:    ~150+ (better, but still tight against 25-zombie waves)
  Medical: ~30 (moderate)

Wall:      20-40% (frequent damage)
Survivors: 6-8 (gradual recruitment)
Status:    STABILIZING - trading available, research started
```

### Day 15 (Lab Equipment Found)
**Assumptions:** 1 scavenger, 2 researchers, 1 builder
```
Resources:
  Scrap:   ~400 (decreased, more building/crafting)
  Food:    ~40-50 (2 scavengers provides excess)
  Ammo:    ~100+ (rising if less scavenging)
  Medical: ~50+ (accumulated)

Cure:      ~30-40 points (research accelerates with lab)
Wall:      30-60% (if building maintained)
Survivors: 8-10
Status:    RESEARCH ACCELERATING - on track for cure by Day 20-22
```

---

## 7. RESOURCE EFFICIENCY METRICS

### Cost per Result
| Activity | Input | Output | Efficiency |
|----------|-------|--------|------------|
| 1 Scavenger | - | 30 scrap + 8 food + ammo | High |
| 1 Researcher | - | 2-4 cure points | Low (requires immune) |
| 1 Builder | - | 5% wall | Low (insufficient) |
| 1 Healer | - | 1 survivor heal | Low (auto-heal better) |
| Crafting Molotov | 10 scrap + 2 med | 3 kills | Low efficiency |
| Crafting Grenade | 25 scrap + 5 med | 5 kills | Moderate |
| Auto-defense | 3 ammo | 1 kill | High (need ammo) |

---

## 8. GAMEPLAY BOTTLENECKS (Order of Severity)

| # | Bottleneck | Day Appears | Impact |
|---|-----------|-------------|--------|
| 1 | Food shortage | Day 2-3 | Forces scavenger focus |
| 2 | Ammo deficit | Day 5-6 | Blocks item crafting |
| 3 | Wall crumbling | Day 6+ | Game over risk rises |
| 4 | Medical depletion | Day 3-5 | Disease outbreak risk |
| 5 | Slow research | Day 5+ | Cannot catch up to 100 |
| 6 | Survivor recruitment | Day 10+ | Late-game resource limits |

---

## 9. RECOMMENDED BALANCE ADJUSTMENTS

### Priority 1: Fix Food Economy
**Current:** 8 food per scavenger = ~2 days supply for 4 people
**Suggest:** 12-15 food per scavenger = 3-4 days supply
**Alternative:** Reduce daily food consumption by 20%

### Priority 2: Increase Ammo Supply
**Current:** 6 base + calculated = ~36 for Day 4
**Suggest:** 8-10 base, or calculate with 1.5x multiplier
**Reason:** Must support both auto-defense AND crafting

### Priority 3: Improve Wall Repair
**Current:** 5% per builder insufficient against zombie damage
**Suggest:** 8-10% per builder, or reduce zombie damage by 30%
**Alternative:** Implement "fortress bonus" when wall >80%

### Priority 4: Buff Healing Assignment
**Current:** Underutilized, auto-heal is better
**Suggest:** Healing assignment provides 2 heals per healer OR grants immunity next day
**Alternative:** Make auto-heal cost more medical (discourage hoarding)

### Priority 5: Accelerate Research (Phase 1)
**Current:** 50+ days to 100 cure
**Suggest:** 3-4 cure per researcher (not 2), or start research earlier
**Alternative:** Grant 10-20 free cure points when immune found

---

## 10. ECONOMY GRAPHS (Text Format)

### Resource Flow Timeline (3 Scavengers, 1 Builder)
```
Day 1:  Food: 15 → Scrap: 25 → Ammo: 25 → Medical: 10
           ↓      Scav×3    ↓      -90 ammo (combat)
Day 2:  Food: 39 → Scrap: 115 → Ammo: ?  → Medical: 15
           ↓      Combat     ↓      -100 ammo
Day 3:  Food: 46 → Scrap: 205 → Ammo: ?  → Medical: 20
           ↓      Immune +    ↓      Research start
Day 4:  Food: 53 → Scrap: 295 → Ammo: ?  → Medical: 25
           ↓      Trading +   ↓      Lab in 20 days
Day 5:  Food: 61 → Scrap: 385 → Ammo: ?  → Medical: 30
           ↓      Cure: 10/100
```

### Bottleneck Index (0-100, lower = more critical)
```
Food      ████████░░ 78% (Days 1-4: CRITICAL)
Ammo      ██████░░░░ 60% (Days 5+: CRITICAL)  
Medical   ██████████ 80% (Generally ok)
Wall      ████░░░░░░ 40% (Days 6+: CRITICAL)
Cure      ██░░░░░░░░ 20% (Days 15+: Potential fail)
```

---

## 11. WIN CONDITIONS & FAILURE POINTS

### To Win:
1. **Research:** 100 cure points + survive 19 days total
2. **Timeline:** Need ~5 days to immune, ~10 days research, ~4 days production phase

### Most Likely Failures:
1. **Starvation (Day 3-5):** Not enough scavengers early
2. **Ammo Crisis (Day 6-8):** Cannot defend, wall broken
3. **Disease (Day 3-4):** No medical, survivors sicken
4. **Wall Breach (Day 10+):** Late-game zombies too strong
5. **Cure Timeout (Day 19+):** Cannot finish research in time

---

## Summary: Economy Health = **C- (Poor)**

- ✅ Scrap economy is healthy
- ✅ Milestone progression is engaging
- ❌ Food too scarce early game
- ❌ Ammo insufficient vs. zombie scaling
- ❌ Medical creates dangerous volatility
- ❌ Wall defense fundamentally broken late game
- ❌ Research curve doesn't match game length
- ❌ Healing assignment is dead-weight system

**Recommendation:** Increase all resource generation by 15-20% as baseline, then rebalance combat difficulty
