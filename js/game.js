// ============================================================================
        // GAME CONSTANTS
        // ============================================================================
        // These values define game balance and should not change during gameplay
        const GAME_CONSTANTS = {
            // Starting resources (Day 1)
            STARTING_FOOD: 10,
            STARTING_SCRAP: 25,
            STARTING_AMMO: 10,
            STARTING_MEDICAL: 10,
            
            // Starting survivors
            STARTING_SURVIVORS: 3,
            
            // Wall mechanics
            WALL_MAX_HEALTH: 100,
            WALL_BASE_DAMAGE: 5,
            
            // Cure goal
            CURE_WIN_THRESHOLD: 100,
            
            // Resource thresholds for UI warnings
            FOOD_WARNING_THRESHOLD: 20,
            FOOD_CRITICAL_THRESHOLD: 10,
            MEDICAL_WARNING_THRESHOLD: 10,
            MEDICAL_CRITICAL_THRESHOLD: 5,
            AMMO_WARNING_THRESHOLD: 20,
            AMMO_CRITICAL_THRESHOLD: 10,
            
            // Trading
            TRADE_DAILY_LIMIT: 50,
            
            // Combat items - craft costs
            MOLOTOV_COST: { scrap: 5, ammo: 3 },
            GRENADE_COST: { scrap: 8, ammo: 5 },
            SURGE_BLAST_COST: { scrap: 12, ammo: 8 },
            REVIVE_KIT_COST: { medical: 10, food: 5 },
            
            // Combat effectiveness
            MOLOTOV_KILL_RATE: 2,
            MOLOTOV_COOLDOWN_SECONDS: 4,
            GRENADE_KILL_RATE: 5,
            GRENADE_COOLDOWN_SECONDS: 6,
            SURGE_BLAST_KILL_RATE: 10,
            AUTO_DEFENSE_KILL_RATE: 1,
            
            // Resource generation per assignment
            SCAVENGE_POINTS_GAIN: 3,
            SCAVENGE_RESOURCE_RATES: {
                scrap: 20,
                food: 2,
                ammo: 1,
                medical: 1.5
            },
            RESEARCH_CURE_PER_SURVIVOR: 1,
            BUILDING_WALL_REPAIR: 6,
            REST_HEALTH_RECOVERY: 2,
            
            // Milestone thresholds
            MILESTONES: [
                { points: 5, name: "Immune Survivor" },
                { points: 10, name: "Trading Post" },
                { points: 15, name: "Şişli Hospital" },
                { points: 25, name: "Lab Equipment" },
                { points: 35, name: "Food Cache" },
                { points: 45, name: "Military Depot" },
                { points: 60, name: "Survivor Group" }
            ]
        };

        // ============================================================================
        // GAME STATE - Mutable values only
        // ============================================================================
        let gameState = {
            // Player
            playerName: '',
            gameStartTime: Date.now(),
            
            // Progression
            day: 1,
            
            // Resources (mutable)
            resources: {
                scrap: 0,
                food: 0,
                ammo: 0,
                medical: 0
            },
            
            // Combat items (mutable)
            items: {
                molotov: 0,
                grenade: 0,
                surgeBlast: 0,
                reviveKit: 0
            },
            
            // Survivors (mutable state)
            survivors: {
                list: [],  // Array of survivor objects {name, status: 'healthy'|'injured'|'sick'|'dead'}
                total: 3,
                healthy: 3,
                injured: 0,
                sick: 0,
                available: 3,
                dead: []
            },
            
            // Assignments (mutable)
            assignments: {
                scavenge: 0,
                research: 0,
                building: 0,
                healing: 0
            },
            
            // Progress tracking (mutable)
            progress: {
                curePoints: 0,
                scavengingPoints: 0,
                wallHealth: 100,
                daysWithoutMedical: 0,
                totalZombiesKilled: 0
            },
            
            // Combat (mutable)
            combat: {
                currentZombies: 0,
                defenders: 0,
                weaponCooldowns: {
                    molotov: 0,  // timestamp when weapon will be ready
                    grenade: 0   // timestamp when weapon will be ready
                }
            },
            
            // Trading (mutable)
            trading: {
                dailyLimit: GAME_CONSTANTS.TRADE_DAILY_LIMIT,
                dailyUsed: 0,
                unlocked: false
            },
            
            // Milestones (mutable)
            milestones: {
                immuneSurvivorFound: false,
                labEquipmentFound: false
            },
            
            // Unlocks (mutable)
            unlocks: {
                grenadeUnlocked: false,
                reviveKitUnlocked: false
            },
            
            // Daily routine phase tracking
            currentPhase: 0  // 0=Morning, 1=Evening, 2=Prep, 3=Night, 4=Summary
        };

        // ============================================================================
        // COMPATIBILITY LAYER - Maps old API to new structure
        // This allows all existing code to work without modification
        // ============================================================================
        Object.defineProperty(gameState, 'scrap', {
            get() { return this.resources.scrap; },
            set(v) { this.resources.scrap = v; }
        });
        Object.defineProperty(gameState, 'food', {
            get() { return this.resources.food; },
            set(v) { this.resources.food = v; }
        });
        Object.defineProperty(gameState, 'ammo', {
            get() { return this.resources.ammo; },
            set(v) { this.resources.ammo = v; }
        });
        Object.defineProperty(gameState, 'medical', {
            get() { return this.resources.medical; },
            set(v) { this.resources.medical = v; }
        });

        Object.defineProperty(gameState, 'molotov', {
            get() { return this.items.molotov; },
            set(v) { this.items.molotov = v; }
        });
        Object.defineProperty(gameState, 'grenade', {
            get() { return this.items.grenade; },
            set(v) { this.items.grenade = v; }
        });
        Object.defineProperty(gameState, 'surgeBlast', {
            get() { return this.items.surgeBlast; },
            set(v) { this.items.surgeBlast = v; }
        });
        Object.defineProperty(gameState, 'reviveKit', {
            get() { return this.items.reviveKit; },
            set(v) { this.items.reviveKit = v; }
        });

        Object.defineProperty(gameState, 'totalSurvivors', {
            get() { return this.survivors.total; },
            set(v) { this.survivors.total = v; }
        });
        Object.defineProperty(gameState, 'healthySurvivors', {
            get() { return this.survivors.healthy; },
            set(v) { this.survivors.healthy = v; }
        });
        Object.defineProperty(gameState, 'injuredSurvivors', {
            get() { return this.survivors.injured; },
            set(v) { this.survivors.injured = v; }
        });
        Object.defineProperty(gameState, 'sickSurvivors', {
            get() { return this.survivors.sick; },
            set(v) { this.survivors.sick = v; }
        });
        Object.defineProperty(gameState, 'availableSurvivors', {
            get() { return this.survivors.available; },
            set(v) { this.survivors.available = v; }
        });
        Object.defineProperty(gameState, 'deadSurvivors', {
            get() { return this.survivors.dead; },
            set(v) { this.survivors.dead = v; }
        });

        Object.defineProperty(gameState, 'scavengeAssigned', {
            get() { return this.assignments.scavenge; },
            set(v) { this.assignments.scavenge = v; }
        });
        Object.defineProperty(gameState, 'researchAssigned', {
            get() { return this.assignments.research; },
            set(v) { this.assignments.research = v; }
        });
        Object.defineProperty(gameState, 'buildingAssigned', {
            get() { return this.assignments.building; },
            set(v) { this.assignments.building = v; }
        });
        Object.defineProperty(gameState, 'healingAssigned', {
            get() { return this.assignments.healing; },
            set(v) { this.assignments.healing = v; }
        });

        Object.defineProperty(gameState, 'cureProgress', {
            get() { return this.progress.curePoints; },
            set(v) { this.progress.curePoints = v; }
        });
        Object.defineProperty(gameState, 'scavengingPoints', {
            get() { return this.progress.scavengingPoints; },
            set(v) { this.progress.scavengingPoints = v; }
        });
        Object.defineProperty(gameState, 'wallHealth', {
            get() { return this.progress.wallHealth; },
            set(v) { this.progress.wallHealth = v; }
        });
        Object.defineProperty(gameState, 'daysWithoutMedical', {
            get() { return this.progress.daysWithoutMedical; },
            set(v) { this.progress.daysWithoutMedical = v; }
        });
        Object.defineProperty(gameState, 'totalZombiesKilled', {
            get() { return this.progress.totalZombiesKilled; },
            set(v) { this.progress.totalZombiesKilled = v; }
        });

        Object.defineProperty(gameState, 'currentZombies', {
            get() { return this.combat.currentZombies; },
            set(v) { this.combat.currentZombies = v; }
        });
        Object.defineProperty(gameState, 'defenders', {
            get() { return this.combat.defenders; },
            set(v) { this.combat.defenders = v; }
        });

        Object.defineProperty(gameState, 'dailyTradeUsed', {
            get() { return this.trading.dailyUsed; },
            set(v) { this.trading.dailyUsed = v; }
        });
        Object.defineProperty(gameState, 'dailyTradeLimit', {
            get() { return this.trading.dailyLimit; },
            set(v) { this.trading.dailyLimit = v; }
        });
        Object.defineProperty(gameState, 'tradingUnlocked', {
            get() { return this.trading.unlocked; },
            set(v) { this.trading.unlocked = v; }
        });

        Object.defineProperty(gameState, 'immuneSurvivorFound', {
            get() { return this.milestones.immuneSurvivorFound; },
            set(v) { this.milestones.immuneSurvivorFound = v; }
        });
        Object.defineProperty(gameState, 'labEquipmentFound', {
            get() { return this.milestones.labEquipmentFound; },
            set(v) { this.milestones.labEquipmentFound = v; }
        });
        Object.defineProperty(gameState, 'grenadeUnlocked', {
            get() { return this.unlocks.grenadeUnlocked; },
            set(v) { this.unlocks.grenadeUnlocked = v; }
        });
        Object.defineProperty(gameState, 'reviveKitUnlocked', {
            get() { return this.unlocks.reviveKitUnlocked; },
            set(v) { this.unlocks.reviveKitUnlocked = v; }
        });
        
        // Turkish names
        const turkishNames = {
            male: ['Mehmet', 'Ahmet', 'Mustafa', 'Emre', 'Can', 'Burak', 'Oğuz', 'Kaan', 'Cem', 'Barış', 
                   'Deniz', 'Efe', 'Murat', 'Kemal', 'Selim', 'Tarık', 'Umut', 'Volkan', 'Yusuf', 'Zafer'],
            female: ['Ayşe', 'Elif', 'Zeynep', 'Fatma', 'Esra', 'Ceren', 'Selin', 'Dilara', 'Melis', 'Pelin', 
                     'Seda', 'Gül', 'Naz', 'İrem', 'Aslı', 'Burcu', 'Defne', 'Hande', 'Leyla', 'Nur']
        };
        
        // Istanbul locations for flavor text
        const locations = ['Beyoğlu', 'Eminönü', 'Kadıköy', 'Üsküdar', 'Beşiktaş', 'Sultanahmet', 'Taksim', 'Şişli'];
        
        // ============================================================================
        // SURVIVOR MANAGEMENT
        // ============================================================================
        let usedNames = new Set();  // Track which names have been assigned
        
        function getRandomUnusedName() {
            const allNames = [...turkishNames.male, ...turkishNames.female];
            const availableNames = allNames.filter(name => !usedNames.has(name));
            
            if (availableNames.length === 0) {
                // If all names are used, reset and start over
                usedNames.clear();
                return allNames[Math.floor(Math.random() * allNames.length)];
            }
            
            const name = availableNames[Math.floor(Math.random() * availableNames.length)];
            usedNames.add(name);
            return name;
        }
        
        function addNewSurvivor(status = 'healthy') {
            const survivor = {
                name: getRandomUnusedName(),
                status: status
            };
            gameState.survivors.list.push(survivor);
            return survivor;
        }
        
        function removeSurvivor(survivorName) {
            const index = gameState.survivors.list.findIndex(s => s.name === survivorName);
            if (index !== -1) {
                gameState.survivors.list.splice(index, 1);
            }
        }
        
        function getRandomSurvivorName() {
            // Get a random name from currently alive survivors, or a random new name if none exist
            if (gameState.survivors.list.length > 0) {
                const survivors = gameState.survivors.list.filter(s => s.status !== 'dead');
                if (survivors.length > 0) {
                    return survivors[Math.floor(Math.random() * survivors.length)].name;
                }
            }
            return getRandomUnusedName();
        }
        
        function initializeSurvivors() {
            // Initialize the starting 3 survivors
            usedNames.clear();
            gameState.survivors.list = [];
            for (let i = 0; i < 3; i++) {
                addNewSurvivor('healthy');
            }
        }
        
        function startGame() {
            const nameInput = document.getElementById('playerName').value.trim();
            if (!nameInput) {
                alert('Please enter your name');
                return;
            }
            
            gameState.playerName = nameInput;
            document.getElementById('welcomeScreen').classList.remove('active');
            document.getElementById('storyScreen').classList.add('active');
            
            const storyText = `
                ${gameState.playerName},<br><br>
                You were working late in the underground lab beneath Galata Tower when the outbreak began. 
                The screams from Istiklal Avenue went silent hours ago.<br><br>
                Your research into the zombie virus might be humanity's last hope. 
                You have the knowledge to create a cure, but you need time, resources, and survivors.<br><br>
                The emergency radio crackles:<br>
                "If anyone's alive... we're fortifying Karaköy dock. Please... we need help."<br><br>
                YOUR GOAL: <br><br>- Develop the cure and save Istanbul. It will take 100 research points.<br>
				- Hold back the zombie hordes every night, reinforce your wall for protection, and keep your ammo locked and loaded!
            `;
            
            document.getElementById('storyText').innerHTML = storyText;
        }
        
        function beginDay1() {
            document.getElementById('storyScreen').classList.remove('active');
            document.getElementById('gameScreen').classList.add('active');
            document.querySelector('.help-button').style.display = 'block';
            document.getElementById('dailyRoutineIndicator').style.display = 'flex';
            
            // Initialize starting survivors with unique names
            initializeSurvivors();
            
            // Initialize Day 1 using constants
            gameState.day = 1;
            gameState.currentPhase = 0;  // Start at Morning
            gameState.resources.food = GAME_CONSTANTS.STARTING_FOOD;
            gameState.resources.scrap = GAME_CONSTANTS.STARTING_SCRAP;
            gameState.resources.ammo = GAME_CONSTANTS.STARTING_AMMO;
            gameState.resources.medical = GAME_CONSTANTS.STARTING_MEDICAL;
            
            updateDisplay();
            updateDailyRoutineIndicator();
            
            // Show welcome modal
            showWelcomeModal();
        }
        
        function updateDailyRoutineIndicator() {
            const phases = ['Morning', 'Evening', 'Prep', 'Night', 'Summary'];
            const currentPhase = gameState.currentPhase;
            
            // Update phase text
            document.getElementById('phaseText').textContent = phases[currentPhase];
            
            // Update dots
            for (let i = 0; i < 5; i++) {
                const dot = document.getElementById(`dot${i}`);
                if (i <= currentPhase) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            }
        }
        
        function setDailyPhase(phase) {
            // phase: 0=Morning, 1=Evening, 2=Prep, 3=Night, 4=Summary
            gameState.currentPhase = phase;
            updateDailyRoutineIndicator();
        }
        
        function updateDisplay() {
            // Update resource display
            document.getElementById('scrapDisplay').textContent = gameState.scrap;
            document.getElementById('foodDisplay').textContent = gameState.food;
            document.getElementById('ammoDisplay').textContent = gameState.ammo;
            document.getElementById('medicalDisplay').textContent = gameState.medical;
            
            // Color code resources
            updateResourceColor('foodDisplay', gameState.food, GAME_CONSTANTS.FOOD_WARNING_THRESHOLD, GAME_CONSTANTS.FOOD_CRITICAL_THRESHOLD);
            updateResourceColor('medicalDisplay', gameState.medical, GAME_CONSTANTS.MEDICAL_WARNING_THRESHOLD, GAME_CONSTANTS.MEDICAL_CRITICAL_THRESHOLD);
            updateResourceColor('ammoDisplay', gameState.ammo, GAME_CONSTANTS.AMMO_WARNING_THRESHOLD, GAME_CONSTANTS.AMMO_CRITICAL_THRESHOLD);
            
            // Update survivors
            document.getElementById('totalSurvivors').textContent = gameState.totalSurvivors;
            document.getElementById('healthySurvivors').textContent = gameState.healthySurvivors;
            document.getElementById('injuredSurvivors').textContent = gameState.injuredSurvivors;
            document.getElementById('sickSurvivors').textContent = gameState.sickSurvivors;
            document.getElementById('availableSurvivors').textContent = gameState.availableSurvivors;
            
            // Update wall strength display
            document.getElementById('wallStrengthDisplay').textContent = Math.floor(gameState.wallHealth);
            
            // Update cure progress
            const curePercent = Math.min(100, gameState.cureProgress);
            document.getElementById('cureProgress').style.width = curePercent + '%';
            document.getElementById('cureText').textContent = `Cure: ${gameState.cureProgress}/100`;
            document.getElementById('curePercent').textContent = `${Math.floor(curePercent)}%`;
            
            // Update research assignment availability
            if (gameState.immuneSurvivorFound) {
                document.getElementById('researchMinusBtn').disabled = false;
                document.getElementById('researchPlusBtn').disabled = false;
                document.getElementById('researchStatus').style.display = 'none';
            } else {
                document.getElementById('researchMinusBtn').disabled = true;
                document.getElementById('researchPlusBtn').disabled = true;
                document.getElementById('researchStatus').style.display = 'block';
            }
            
            // Update building assignment availability
            if (gameState.wallHealth >= 100) {
                document.getElementById('buildingMinusBtn').disabled = true;
                document.getElementById('buildingPlusBtn').disabled = true;
                document.getElementById('buildingStatus').textContent = 'Wall is fully repaired';
                document.getElementById('buildingStatus').style.display = 'block';
            } else {
                document.getElementById('buildingMinusBtn').disabled = false;
                document.getElementById('buildingPlusBtn').disabled = false;
                document.getElementById('buildingStatus').style.display = 'none';
            }
            
            // Update healing assignment availability
            if (gameState.injuredSurvivors === 0 && gameState.sickSurvivors === 0) {
                document.getElementById('healingMinusBtn').disabled = true;
                document.getElementById('healingPlusBtn').disabled = true;
                document.getElementById('healingStatus').textContent = 'No injured or sick survivors';
            } else {
                document.getElementById('healingMinusBtn').disabled = false;
                document.getElementById('healingPlusBtn').disabled = false;
                document.getElementById('healingStatus').textContent = '';
            }
            
            // Update day title
            document.getElementById('dayTitle').textContent = `DAY ${gameState.day} - KARAKÖY`;
            
            // Update milestone tracker
            if (gameState.day > 1) {
                document.getElementById('milestoneTracker').style.display = 'block';
                updateMilestoneTracker();
            }
            
            // Show trade button if unlocked
            if (gameState.tradingUnlocked) {
                document.getElementById('tradeButton').style.display = 'inline-block';
            }
        }
        
        function updateResourceColor(elementId, value, warningThreshold, criticalThreshold) {
            const element = document.getElementById(elementId);
            element.classList.remove('warning', 'critical');
            
            if (value <= criticalThreshold) {
                element.classList.add('critical');
            } else if (value <= warningThreshold) {
                element.classList.add('warning');
            }
        }
        
        function updateMilestoneTracker() {
            const nextMilestone = GAME_CONSTANTS.MILESTONES.find(m => m.points > gameState.scavengingPoints);
            
            if (nextMilestone) {
                document.getElementById('scavProgress').textContent = `${gameState.scavengingPoints}/${nextMilestone.points}`;
                document.getElementById('nextMilestone').textContent = `Next: ${nextMilestone.name}`;
            } else {
                document.getElementById('scavProgress').textContent = `${gameState.scavengingPoints}/60`;
                document.getElementById('nextMilestone').textContent = "All milestones reached!";
            }
        }
        
        function adjustAssignment(type, change) {
            // Prevent research assignment until immune survivor is found
            if (type === 'research' && !gameState.immuneSurvivorFound) {
                alert('Cannot assign research until immune survivor is found');
                return;
            }
            
            // Prevent building assignment when wall is at 100%
            if (type === 'building' && gameState.wallHealth >= 100) {
                alert('Wall is fully repaired');
                return;
            }
            
            // Prevent healing assignment when no injured or sick survivors
            if (type === 'healing' && gameState.injuredSurvivors === 0 && gameState.sickSurvivors === 0) {
                alert('No injured or sick survivors to heal');
                return;
            }
            
            const assigned = gameState[type + 'Assigned'];
            const newValue = assigned + change;
            
            // Calculate total assigned
            const totalAssigned = gameState.scavengeAssigned + gameState.researchAssigned + 
                                 gameState.buildingAssigned + gameState.healingAssigned;
            const othersAssigned = totalAssigned - assigned;
            
            if (newValue >= 0 && othersAssigned + newValue <= gameState.availableSurvivors) {
                gameState[type + 'Assigned'] = newValue;
                document.getElementById(type + 'Value').textContent = newValue;
                
                const newTotal = othersAssigned + newValue;
                document.getElementById('totalAssigned').textContent = newTotal;
                
                // Enable/disable confirm button
                document.getElementById('confirmButton').disabled = newTotal !== gameState.availableSurvivors;
            }
        }
        
        function confirmDay() {
            const totalAssigned = gameState.scavengeAssigned + gameState.researchAssigned + 
                                 gameState.buildingAssigned + gameState.healingAssigned;
            
            if (totalAssigned !== gameState.availableSurvivors) {
                alert(`Please assign all ${gameState.availableSurvivors} survivors`);
                return;
            }
            
            processDayResults();
        }
        
        function processDayResults() {
            let report = `<h3>Day ${gameState.day} Results</h3>`;
            
            // Process scavenging
            if (gameState.scavengeAssigned > 0) {
                const scrapFound = gameState.scavengeAssigned * 20;
                const foodFound = gameState.scavengeAssigned * 4;
                
                // Calculate expected zombie count for tonight to determine ammo needed
                const expectedZombies = calculateZombieCount();
                // Each zombie requires 3 ammo to kill (from runCombat), add 20% buffer
                const ammoNeeded = Math.ceil(expectedZombies * 3 * 1);
                // Base ammo per scavenger + the calculated need
                const ammoFound = gameState.scavengeAssigned * 3 + ammoNeeded;
                
                let medicalFound = 0;
                
                // Random chance for medical
                for (let i = 0; i < gameState.scavengeAssigned; i++) {
                    if (Math.random() < 0.3) medicalFound += 1.5;
                }
                
                // New survivors joining the camp (scavengers find people)
                // Cannot have more than 12 survivors
                let survivorsFound = 0;
                let newSurvivorNames = [];
                for (let i = 0; i < gameState.scavengeAssigned; i++) {
                    if (gameState.totalSurvivors < 12 && Math.random() < 0.3) {
                        const newSurvivor = addNewSurvivor('healthy');
                        newSurvivorNames.push(newSurvivor.name);
                        survivorsFound++;
                    }
                }
                
                gameState.scrap += scrapFound;
                gameState.food += foodFound;
                gameState.ammo += ammoFound;
                gameState.medical += medicalFound;
                gameState.scavengingPoints += gameState.scavengeAssigned;
                
                if (survivorsFound > 0) {
                    gameState.totalSurvivors += survivorsFound;
                    gameState.healthySurvivors += survivorsFound;
                }
                
                report += `<p><strong>Scavenging:</strong> +${scrapFound} scrap, +${foodFound} food, +${ammoFound} ammo`;
                if (medicalFound > 0) report += `, +${medicalFound} medical`;
                if (survivorsFound > 0) report += `, +${survivorsFound} new survivors (${newSurvivorNames.join(', ')})`;
                report += `</p>`;
            }
            
            // Process research
            if (gameState.researchAssigned > 0 && gameState.immuneSurvivorFound) {
                const researchPoints = gameState.researchAssigned * (gameState.labEquipmentFound ? 3 : 1);
                gameState.cureProgress += researchPoints;
                report += `<p><strong>Research:</strong> +${researchPoints} cure points (${gameState.cureProgress}/100)</p>`;
            } else if (gameState.researchAssigned > 0 && !gameState.immuneSurvivorFound) {
                report += `<p><strong>Research:</strong> Cannot progress without immune survivor</p>`;
            }
            
            // Process building
            if (gameState.buildingAssigned > 0) {
                const wallRepair = gameState.buildingAssigned * 5;
                const oldWall = gameState.wallHealth;
                gameState.wallHealth = Math.min(100, gameState.wallHealth + wallRepair);
                report += `<p><strong>Building:</strong> Wall repaired ${oldWall}% → ${gameState.wallHealth}%</p>`;
            }
            
            // Process healing (heal injured and sick)
            if (gameState.healingAssigned > 0 && (gameState.injuredSurvivors > 0 || gameState.sickSurvivors > 0)) {
                let healedCount = 0;
                let curedCount = 0;
                
                // First heal injured survivors
                for (let survivor of gameState.survivors.list) {
                    if (survivor.status === 'injured' && healedCount < gameState.healingAssigned) {
                        survivor.status = 'healthy';
                        healedCount++;
                    }
                }
                
                // Then cure sick survivors with remaining healers
                const remainingHealers = gameState.healingAssigned - healedCount;
                for (let survivor of gameState.survivors.list) {
                    if (survivor.status === 'sick' && curedCount < remainingHealers) {
                        survivor.status = 'healthy';
                        curedCount++;
                    }
                }
                
                gameState.injuredSurvivors -= healedCount;
                gameState.healthySurvivors += healedCount;
                gameState.sickSurvivors -= curedCount;
                gameState.healthySurvivors += curedCount;
                
                let healingReport = `<p><strong>Healing:</strong>`;
                if (healedCount > 0) healingReport += ` ${healedCount} injured healed`;
                if (curedCount > 0) {
                    if (healedCount > 0) healingReport += `,`;
                    healingReport += ` ${curedCount} sick cured`;
                }
                healingReport += `</p>`;
                report += healingReport;
            }
            
            // Food consumption
            const foodNeeded = gameState.healthySurvivors + (gameState.injuredSurvivors * 2) + (gameState.sickSurvivors * 2);
            gameState.food -= foodNeeded;
            report += `<p><strong>Food consumed:</strong> -${foodNeeded}</p>`;
            
            // Display final resource counts
            report += `<p style="border-top: 1px solid #00ff41; padding-top: 6px; margin-top: 6px;"><strong>Current resources:</strong> Scrap: ${gameState.scrap} | Food: ${gameState.food} | Ammo: ${gameState.ammo} | Medical: ${gameState.medical}</p>`;
            
            // Display survivor status
            report += `<p><strong>Survivors:</strong> ${gameState.totalSurvivors}/12 (Healthy: ${gameState.healthySurvivors} | Injured: ${gameState.injuredSurvivors} | Sick: ${gameState.sickSurvivors})</p>`;
            
            // Check for starvation
            if (gameState.food < 0) {
                const starving = Math.ceil(Math.abs(gameState.food) / 2);
                let deathCount = 0;
                for (let survivor of gameState.survivors.list) {
                    if ((survivor.status === 'healthy' || survivor.status === 'injured') && deathCount < starving) {
                        survivor.status = 'dead';
                        deathCount++;
                    }
                }
                gameState.totalSurvivors -= starving;
                gameState.healthySurvivors = Math.max(0, gameState.healthySurvivors - starving);
                report += `<p style="color: #ff3333;"><strong>Starvation!</strong> ${starving} survivors died from lack of food</p>`;
                gameState.food = 0;
            }
            
            // Medical checks
            if (gameState.medical === 0) {
                gameState.daysWithoutMedical++;
                if (gameState.daysWithoutMedical >= 2) {
                    // Disease outbreak
                    const newSick = Math.min(3, gameState.healthySurvivors);
                    let sickCount = 0;
                    for (let survivor of gameState.survivors.list) {
                        if (survivor.status === 'healthy' && sickCount < newSick) {
                            survivor.status = 'sick';
                            sickCount++;
                        }
                    }
                    gameState.healthySurvivors -= newSick;
                    gameState.sickSurvivors += newSick;
                    report += `<p style="color: #ff3333;"><strong>Disease Outbreak!</strong> ${newSick} survivors became sick</p>`;
                }
            } else {
                gameState.daysWithoutMedical = 0;
                
                // Auto-heal with available medical
                if (gameState.sickSurvivors > 0 && gameState.medical >= 10) {
                    const healableSick = Math.floor(gameState.medical / 10);
                    const healed = Math.min(healableSick, gameState.sickSurvivors);
                    let healedCount = 0;
                    for (let survivor of gameState.survivors.list) {
                        if (survivor.status === 'sick' && healedCount < healed) {
                            survivor.status = 'healthy';
                            healedCount++;
                        }
                    }
                    gameState.sickSurvivors -= healed;
                    gameState.healthySurvivors += healed;
                    gameState.medical -= healed * 10;
                    report += `<p><strong>Medical:</strong> ${healed} sick survivors healed</p>`;
                }
                
                if (gameState.injuredSurvivors > 0 && gameState.medical >= 5) {
                    const healableInjured = Math.floor(gameState.medical / 5);
                    const healed = Math.min(healableInjured, gameState.injuredSurvivors);
                    let healedCount = 0;
                    for (let survivor of gameState.survivors.list) {
                        if (survivor.status === 'injured' && healedCount < healed) {
                            survivor.status = 'healthy';
                            healedCount++;
                        }
                    }
                    gameState.injuredSurvivors -= healed;
                    gameState.healthySurvivors += healed;
                    gameState.medical -= healed * 5;
                    report += `<p><strong>Medical:</strong> ${healed} injured survivors healed</p>`;
                }
            }
            
            // Check milestones
            checkMilestones(report);
            
            // Update available survivors for next day
            gameState.availableSurvivors = gameState.healthySurvivors + gameState.injuredSurvivors;
            
            // Show evening report
            document.getElementById('gameScreen').classList.remove('active');
            document.getElementById('eveningScreen').classList.add('active');
            setDailyPhase(1);  // Evening phase
            document.getElementById('eveningReport').innerHTML = report;
        }
        
        function checkMilestones(report) {
            // Check scavenging milestones
            if (gameState.scavengingPoints >= 5 && !gameState.immuneSurvivorFound) {
                gameState.immuneSurvivorFound = true;
                const immuneSurvivor = addNewSurvivor('healthy');
                gameState.totalSurvivors++;
                gameState.healthySurvivors++;
                
                const popup = document.createElement('div');
                popup.innerHTML = `
                    <h3>IMMUNE SURVIVOR FOUND!</h3>
                    <p>Your scavengers discovered ${immuneSurvivor.name} hiding in a pharmacy in Beyoğlu.</p>
                    <p>She's been bitten multiple times but hasn't turned.</p>
                    <p>"I'm immune. Use my blood for your research."</p>
                    <p>+ ${immuneSurvivor.name} joins your camp<br>+ Cure research can now begin</p>
                `;
                showEventPopup(popup.innerHTML);
            }
            
            if (gameState.scavengingPoints >= 10 && !gameState.tradingUnlocked) {
                gameState.tradingUnlocked = true;
                gameState.grenadeUnlocked = true;
                
                const popup = document.createElement('div');
                popup.innerHTML = `
                    <h3>TRADING POST ESTABLISHED!</h3>
                    <p>Your scavengers made contact with merchants near the Grand Bazaar!</p>
                    <p>You can now trade resources during daytime.</p>
                    <p>Maximum 50 units per day.</p>
                    <p style="color: #ffff00;">+ GRENADE CRAFTING UNLOCKED</p>
                `;
                showEventPopup(popup.innerHTML);
            }
            
            if (gameState.scavengingPoints >= 15 && gameState.scavengingPoints - gameState.scavengeAssigned < 15) {
                gameState.medical += 50;
                gameState.food += 10;
                gameState.reviveKitUnlocked = true;
                
                // Add new survivors if under cap
                if (gameState.totalSurvivors < 12) {
                    const newSurvivors = Math.min(2, 12 - gameState.totalSurvivors);
                    const newSurvivorNames = [];
                    for (let i = 0; i < newSurvivors; i++) {
                        const survivor = addNewSurvivor('healthy');
                        newSurvivorNames.push(survivor.name);
                    }
                    gameState.totalSurvivors += newSurvivors;
                    gameState.healthySurvivors += newSurvivors;
                    
                    const popup = document.createElement('div');
                    popup.innerHTML = `
                        <h3>ŞİŞLİ HOSPITAL DISCOVERED!</h3>
                        <p>Scavengers reached the Amerikan Hastanesi!</p>
                        <p>+ 50 medical supplies<br>+ 10 food<br>+ ${newSurvivors} survivors found (${newSurvivorNames.join(', ')})</p>
                        <p style="color: #ffff00;">+ REVIVE KIT CRAFTING UNLOCKED</p>
                    `;
                    showEventPopup(popup.innerHTML);
                }
            }
            
            if (gameState.scavengingPoints >= 25 && !gameState.labEquipmentFound) {
                gameState.labEquipmentFound = true;
                gameState.scrap -= 100;
                
                const popup = document.createElement('div');
                popup.innerHTML = `
                    <h3>LABORATORY EQUIPMENT SECURED!</h3>
                    <p>Scavengers found equipment at Boğaziçi University!</p>
                    <p>Research rate DOUBLED!</p>
                    <p>Cost: 100 scrap for transport</p>
                `;
                showEventPopup(popup.innerHTML);
            }
            
            if (gameState.scavengingPoints >= 45 && gameState.scavengingPoints - gameState.scavengeAssigned < 45) {
                gameState.ammo += 50;
                gameState.medical += 20;
                gameState.grenade += 3;
                gameState.surgeBlast = 1;
                
                const popup = document.createElement('div');
                popup.innerHTML = `
                    <h3>MILITARY DEPOT BREACHED!</h3>
                    <p>Scavengers found the Selimiye Barracks armory!</p>
                    <p>+ 50 ammo<br>+ 20 medical<br>+ 3 grenades<br>+ 1 SURGE BLAST device</p>
                    <p style="color: #ff3333;">WARNING: Tomorrow's zombie wave will be DOUBLED!</p>
                `;
                showEventPopup(popup.innerHTML);
                
                // Set flag for doubled wave
                gameState.doubleTomorrowWave = true;
            }
        }
        
        function showEventPopup(content) {
            const popup = document.getElementById('helpPopup');
            popup.innerHTML = content + '<div class="button-group"><button onclick="closeHelp()">CONTINUE</button></div>';
            popup.classList.add('active');
            document.getElementById('popupOverlay').classList.add('active');
        }
        
        function goToCombatPrep() {
            document.getElementById('eveningScreen').classList.remove('active');
            document.getElementById('combatPrepScreen').classList.add('active');
            setDailyPhase(2);  // Prep phase
            
            // Reset daily trade limit
            gameState.dailyTradeUsed = 0;
            
            // Update prep info
            const defenders = gameState.healthySurvivors;
            const zombieCount = calculateZombieCount();
            
            document.getElementById('prepInfo').innerHTML = `
                <p>Night ${gameState.day} approaching: ${zombieCount} zombies expected</p>
                <p>Defenders ready: ${defenders} (${gameState.sickSurvivors} sick or injured cannot fight)</p>
                <p>Current resources: Scrap: ${gameState.scrap} | Food: ${gameState.food} | Ammo: ${gameState.ammo} | Medical: ${gameState.medical}</p>
                <p>Wall Integrity: ${Math.floor(gameState.wallHealth)}%</p>
            
            `;
            
            // Update combat item counts
            document.getElementById('molotovCount').textContent = gameState.molotov;
            document.getElementById('grenadeCount').textContent = gameState.grenade;
            document.getElementById('nukeCount').textContent = gameState.surgeBlast;
            document.getElementById('reviveCount').textContent = gameState.reviveKit;
        }
        
        function calculateZombieCount() {
            // Much slower zombie progression: base 8 + 2 per day + bonus every 5 days
            let baseZombies = 8 + (gameState.day - 1) * 2 + Math.floor((gameState.day - 1) / 5) * 1;
            
            // Double if military depot was raided yesterday
            if (gameState.doubleTomorrowWave) {
                baseZombies *= 2;
                gameState.doubleTomorrowWave = false;
            }
            
            // Final wave scaling
            if (gameState.cureProgress >= 100) {
                baseZombies = 40 + (gameState.day - 15) * 5;
            }
            
            return baseZombies;
        }
        
        function craftItem(type) {
            if (type === 'molotov') {
                if (gameState.scrap >= 10 && gameState.medical >= 2) {
                    gameState.scrap -= 10;
                    gameState.medical -= 2;
                    gameState.molotov++;
                    updateCraftDisplay();
                } else {
                    alert('Not enough resources! Need 10 scrap and 2 medical.');
                }
            } else if (type === 'grenade') {
                if (!gameState.grenadeUnlocked) {
                    alert('Grenades not yet unlocked. Establish the trading post or reach more scavenging milestones.');
                    return;
                }
                if (gameState.scrap >= 25 && gameState.medical >= 5) {
                    gameState.scrap -= 25;
                    gameState.medical -= 5;
                    gameState.grenade++;
                    updateCraftDisplay();
                } else {
                    alert('Not enough resources! Need 25 scrap and 5 medical.');
                }
            } else if (type === 'revive') {
                if (!gameState.reviveKitUnlocked) {
                    alert('Revive kits not yet unlocked. Discover more locations or reach further scavenging milestones.');
                    return;
                }
                if (gameState.medical >= 15) {
                    gameState.medical -= 15;
                    gameState.reviveKit++;
                    updateCraftDisplay();
                } else {
                    alert('Not enough medical! Need 15 medical.');
                }
            }
        }
        
        function updateCraftDisplay() {
            document.getElementById('molotovCount').textContent = gameState.molotov;
            document.getElementById('grenadeCount').textContent = gameState.grenade;
            document.getElementById('nukeCount').textContent = gameState.surgeBlast;
            document.getElementById('reviveCount').textContent = gameState.reviveKit;
            
            document.getElementById('prepInfo').innerHTML = `
                <p>Night ${gameState.day} approaching: ${calculateZombieCount()} zombies expected</p>
                <p>Defenders ready: ${gameState.healthySurvivors} (${gameState.sickSurvivors} sick or injured cannot fight)</p>
                <p>Current resources: Scrap: ${gameState.scrap} | Food: ${gameState.food} | Ammo: ${gameState.ammo} | Medical: ${gameState.medical}</p>
                <p>Wall Integrity: ${Math.floor(gameState.wallHealth)}%</p>
            `;
        }
        
        function startCombat() {
            document.getElementById('combatPrepScreen').classList.remove('active');
            document.getElementById('combatScreen').classList.add('active');
            setDailyPhase(3);  // Night phase
            
            gameState.currentZombies = calculateZombieCount();
            gameState.defenders = gameState.healthySurvivors;
            gameState.combatActive = true;
            gameState.deadSurvivors = [];
            gameState.combatStartZombieCount = gameState.currentZombies;  // Track initial zombie count
            gameState.combat.weaponCooldowns.molotov = 0;
            gameState.combat.weaponCooldowns.grenade = 0;
            
            document.getElementById('nightNumber').textContent = gameState.day;
            document.getElementById('zombiesRemaining').textContent = gameState.currentZombies;
            document.getElementById('zombiesKilled').textContent = '0';
            document.getElementById('survivorsRemaining').textContent = gameState.defenders;
            document.getElementById('ammoRemaining').textContent = gameState.ammo;
            document.getElementById('wallPercent').textContent = Math.floor(gameState.wallHealth);
            updateWallDisplay();
            
            // Update combat item buttons
            document.getElementById('molotovCombat').textContent = gameState.molotov;
            document.getElementById('grenadeCombat').textContent = gameState.grenade;
            document.getElementById('surgeCombat').textContent = gameState.surgeBlast;
            updateWeaponCooldownDisplay();
            
            // Clear combat log
            document.getElementById('combatLog').innerHTML = '';
            
            // Start combat simulation
            addCombatMessage(`Night ${gameState.day} - ${gameState.currentZombies} zombies approaching!`);
            addCombatMessage(`${gameState.defenders} defenders ready!`);
            
            setTimeout(() => runCombat(), 1500);
            
            // Start cooldown display update interval (every second)
            gameState.combatCooldownInterval = setInterval(() => {
                if (gameState.combatActive) {
                    updateWeaponCooldownDisplay();
                }
            }, 1000);
        }
        
        function runCombat() {
            if (!gameState.combatActive) return;
            
            if (gameState.currentZombies <= 0) {
                endCombat(true);
                return;
            }
            
            if (gameState.wallHealth <= 0) {
                endCombat(false);
                return;
            }
            
            // Auto-combat calculations
            if (gameState.defenders > 0 && gameState.ammo > 0) {
                // Each defender can kill 1 zombie every 2 seconds
                const killRate = Math.min(Math.ceil(gameState.defenders / 2), gameState.currentZombies);
                const ammoNeeded = killRate * 3;
                
                if (gameState.ammo >= ammoNeeded) {
                    gameState.currentZombies -= killRate;
                    gameState.ammo -= ammoNeeded;
                    gameState.totalZombiesKilled += killRate;
                    addCombatMessage(`Defenders killed ${killRate} zombies!`);
                } else {
                    // Partial kills with remaining ammo
                    const possibleKills = Math.floor(gameState.ammo / 3);
                    gameState.currentZombies -= possibleKills;
                    gameState.totalZombiesKilled += possibleKills;
                    gameState.ammo = 0;
                    if (possibleKills > 0) {
                        addCombatMessage(`Defenders killed ${possibleKills} zombies! Out of ammo!`);
                    }
                }
            }
            
            // Decrement weapon cooldowns (update display to show real-time countdown)
            updateWeaponCooldownDisplay();
            
            // Zombies damage wall
            const damagePerZombie = 2;
            const totalDamage = Math.min(gameState.currentZombies * damagePerZombie * 0.5, gameState.wallHealth);
            gameState.wallHealth -= totalDamage;
            
            if (totalDamage > 0) {
                addCombatMessage(`Wall taking damage! ${Math.floor(gameState.wallHealth)}% remaining`);
            }
            
            // Check for casualties if wall is low
            if (gameState.wallHealth < 30 && Math.random() < 0.3) {
                causeCasualty();
            }
            
            // Update display
            document.getElementById('zombiesRemaining').textContent = gameState.currentZombies;
            document.getElementById('zombiesKilled').textContent = gameState.totalZombiesKilled;
            document.getElementById('survivorsRemaining').textContent = gameState.defenders;
            document.getElementById('ammoRemaining').textContent = gameState.ammo;
            document.getElementById('wallPercent').textContent = Math.floor(gameState.wallHealth);
            updateWallDisplay();
            
            // Continue combat
            setTimeout(() => runCombat(), 3000);
        }
        
        function causeCasualty() {
            if (gameState.defenders > 0 && gameState.survivors.list.length > 0) {
                // Get a random survivor from those who can fight (healthy or injured)
                const fightingSurvivors = gameState.survivors.list.filter(s => s.status === 'healthy' || s.status === 'injured');
                if (fightingSurvivors.length === 0) return;
                
                const casualty = fightingSurvivors[Math.floor(Math.random() * fightingSurvivors.length)];
                
                if (Math.random() < 0.7) {
                    // Injured
                    if (casualty.status === 'healthy') {
                        casualty.status = 'injured';
                        gameState.healthySurvivors--;
                        gameState.injuredSurvivors++;
                        gameState.defenders--;
                        addCombatMessage(`${casualty.name} was injured!`, 'warning');
                    }
                } else {
                    // Killed
                    casualty.status = 'dead';
                    if (casualty.status === 'healthy') {
                        gameState.healthySurvivors--;
                    } else if (casualty.status === 'injured') {
                        gameState.injuredSurvivors--;
                    }
                    gameState.totalSurvivors--;
                    gameState.defenders--;
                    gameState.deadSurvivors.push(casualty.name);
                    addCombatMessage(`${casualty.name} was killed!`, 'critical');
                }
                // Update survivors display
                document.getElementById('survivorsRemaining').textContent = gameState.defenders;
            }
        }
        
        function getRandomSurvivorName() {
            const allNames = [...turkishNames.male, ...turkishNames.female];
            return allNames[Math.floor(Math.random() * allNames.length)];
        }
        
        function updateWallDisplay() {
            const wallBar = document.getElementById('wallHealthBar');
            wallBar.style.width = gameState.wallHealth + '%';
            
            wallBar.classList.remove('health-good', 'health-warning', 'health-critical');
            if (gameState.wallHealth > 50) {
                wallBar.classList.add('health-good');
            } else if (gameState.wallHealth > 25) {
                wallBar.classList.add('health-warning');
            } else {
                wallBar.classList.add('health-critical');
            }
        }
        
        function updateWeaponCooldownDisplay() {
            const now = Date.now();
            const molotovBtn = document.getElementById('molotovButton');
            const grenadeBtn = document.getElementById('grenadeButton');
            
            const molotovTimeRemaining = Math.max(0, Math.ceil((gameState.combat.weaponCooldowns.molotov - now) / 1000));
            const grenadeTimeRemaining = Math.max(0, Math.ceil((gameState.combat.weaponCooldowns.grenade - now) / 1000));
            
            if (molotovTimeRemaining > 0) {
                molotovBtn.disabled = true;
                molotovBtn.textContent = `USE MOLOTOV - Ready in ${molotovTimeRemaining}s`;
            } else {
                molotovBtn.disabled = false;
                molotovBtn.innerHTML = `USE MOLOTOV (<span id="molotovCombat">${gameState.molotov}</span>)`;
            }
            
            if (grenadeTimeRemaining > 0) {
                grenadeBtn.disabled = true;
                grenadeBtn.textContent = `USE GRENADE - Ready in ${grenadeTimeRemaining}s`;
            } else {
                grenadeBtn.disabled = false;
                grenadeBtn.innerHTML = `USE GRENADE (<span id="grenadeCombat">${gameState.grenade}</span>)`;
            }
        }
        
        function addCombatMessage(message, type = '') {
            const log = document.getElementById('combatLog');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'combat-message';
            if (type === 'warning') messageDiv.style.color = '#ffff00';
            if (type === 'critical') messageDiv.style.color = '#ff3333';
            messageDiv.textContent = '>> ' + message;
            log.appendChild(messageDiv);
            log.scrollTop = log.scrollHeight;
        }
        
        function useMolotov() {
            const now = Date.now();
            if (gameState.combat.weaponCooldowns.molotov > now) {
                const secondsRemaining = Math.ceil((gameState.combat.weaponCooldowns.molotov - now) / 1000);
                addCombatMessage(`Molotov on cooldown! Ready in ${secondsRemaining}s`, 'warning');
                return;
            }
            if (gameState.molotov > 0 && gameState.currentZombies > 0) {
                gameState.molotov--;
                gameState.combat.weaponCooldowns.molotov = now + (GAME_CONSTANTS.MOLOTOV_COOLDOWN_SECONDS * 1000);
                const killed = Math.min(GAME_CONSTANTS.MOLOTOV_KILL_RATE, gameState.currentZombies);
                gameState.currentZombies -= killed;
                gameState.totalZombiesKilled += killed;
                document.getElementById('molotovCombat').textContent = gameState.molotov;
                document.getElementById('zombiesRemaining').textContent = gameState.currentZombies;
                document.getElementById('zombiesKilled').textContent = gameState.totalZombiesKilled;
                addCombatMessage(`Molotov thrown! ${killed} zombies eliminated!`);
                updateWeaponCooldownDisplay();
                
                if (gameState.currentZombies <= 0) {
                    endCombat(true);
                }
            }
        }
        
        function useGrenade() {
            const now = Date.now();
            if (gameState.combat.weaponCooldowns.grenade > now) {
                const secondsRemaining = Math.ceil((gameState.combat.weaponCooldowns.grenade - now) / 1000);
                addCombatMessage(`Grenade on cooldown! Ready in ${secondsRemaining}s`, 'warning');
                return;
            }
            if (gameState.grenade > 0 && gameState.currentZombies > 0) {
                gameState.grenade--;
                gameState.combat.weaponCooldowns.grenade = now + (GAME_CONSTANTS.GRENADE_COOLDOWN_SECONDS * 1000);
                const killed = Math.min(GAME_CONSTANTS.GRENADE_KILL_RATE, gameState.currentZombies);
                gameState.currentZombies -= killed;
                gameState.totalZombiesKilled += killed;
                document.getElementById('grenadeCombat').textContent = gameState.grenade;
                document.getElementById('zombiesRemaining').textContent = gameState.currentZombies;
                document.getElementById('zombiesKilled').textContent = gameState.totalZombiesKilled;
                addCombatMessage(`Grenade exploded! ${killed} zombies destroyed!`);
                updateWeaponCooldownDisplay();
                
                if (gameState.currentZombies <= 0) {
                    endCombat(true);
                }
            }
        }
        
        function useSurgeBlast() {
            if (gameState.surgeBlast > 0 && gameState.currentZombies > 0) {
                gameState.surgeBlast--;
                const killed = gameState.currentZombies;
                gameState.totalZombiesKilled += killed;
                gameState.currentZombies = 0;
                document.getElementById('surgeCombat').textContent = gameState.surgeBlast;
                document.getElementById('zombiesRemaining').textContent = gameState.currentZombies;
                document.getElementById('zombiesKilled').textContent = gameState.totalZombiesKilled;
                addCombatMessage(`SURGE BLAST ACTIVATED! All ${killed} zombies vaporized!`);
                addCombatMessage(`The explosion will attract more zombies tomorrow...`, 'warning');
                gameState.doubleTomorrowWave = true;
                endCombat(true);
            }
        }
        
        function endCombat(victory) {
            gameState.combatActive = false;
            
            // Clear cooldown display update interval
            if (gameState.combatCooldownInterval) {
                clearInterval(gameState.combatCooldownInterval);
                gameState.combatCooldownInterval = null;
            }
            
            setTimeout(() => {
                document.getElementById('combatScreen').classList.remove('active');
                document.getElementById('nightSummaryScreen').classList.add('active');
                setDailyPhase(4);  // Summary phase
                
                document.getElementById('summaryNight').textContent = gameState.day;
                
                let summaryHTML = '';
                
                if (victory) {
                    summaryHTML = `
                        <h3>WAVE COMPLETE</h3>
                        <p>All zombies eliminated!</p>
                        <p>Wall integrity: ${Math.floor(gameState.wallHealth)}%</p>
                    `;
                } else {
                    summaryHTML = `
                        <h3>WALL BREACHED!</h3>
                        <p style="color: #ff3333;">The compound has been overrun!</p>
                    `;
                }
                
                if (gameState.deadSurvivors.length > 0) {
                    summaryHTML += `<p style="color: #ff3333;">Deaths: ${gameState.deadSurvivors.join(', ')}</p>`;
                }
                
                document.getElementById('nightSummaryContent').innerHTML = summaryHTML;
                
                // Show revive options if there are dead survivors and revive kits
                if (gameState.deadSurvivors.length > 0 && gameState.reviveKit > 0) {
                    showReviveOptions();
                } else {
                    document.getElementById('reviveSection').style.display = 'none';
                }
                
                if (!victory) {
                    setTimeout(() => gameOver(), 3000);
                }
            }, 1500);
        }
        
        function showReviveOptions() {
            const reviveSection = document.getElementById('reviveSection');
            reviveSection.style.display = 'block';
            
            let optionsHTML = `<p>You have ${gameState.reviveKit} revive kit(s)</p>`;
            
            gameState.deadSurvivors.forEach(name => {
                optionsHTML += `<button onclick="reviveSurvivor('${name}')">Revive ${name}</button> `;
            });
            
            optionsHTML += `<button onclick="skipRevive()">Save Kits</button>`;
            
            document.getElementById('reviveOptions').innerHTML = optionsHTML;
        }
        
        function reviveSurvivor(name) {
            if (gameState.reviveKit > 0) {
                gameState.reviveKit--;
                // Find the survivor and restore them
                const survivor = gameState.survivors.list.find(s => s.name === name);
                if (survivor) {
                    survivor.status = 'healthy';
                    gameState.totalSurvivors++;
                    gameState.healthySurvivors++;
                }
                gameState.deadSurvivors = gameState.deadSurvivors.filter(n => n !== name);
                
                document.getElementById('nightSummaryContent').innerHTML += 
                    `<p style="color: #00ff41;">${name} has been revived!</p>`;
                
                if (gameState.deadSurvivors.length > 0 && gameState.reviveKit > 0) {
                    showReviveOptions();
                } else {
                    document.getElementById('reviveSection').style.display = 'none';
                }
            }
        }
        
        function skipRevive() {
            document.getElementById('reviveSection').style.display = 'none';
        }
        
        function continueTomorrow() {
            // Check if cure is complete
            if (gameState.cureProgress >= 100) {
                if (gameState.day < 18) {
                    // Start final defense phase
                    gameState.day++;
                    alert(`Cure complete! Survive 3 more nights to mass-produce it! (${19 - gameState.day} nights remaining)`);
                } else if (gameState.day === 19) {
                    // Victory!
                    victory();
                    return;
                }
            }
            
            //Check if we have any survivors left 
	if (gameState.totalSurvivors <= 0) { 
		gameOver(); 
		return; 
	}

        // Progress to next day
        gameState.day++;
        gameState.currentPhase = 0;  // Reset to Morning phase
        
        // Reset assignments
        gameState.scavengeAssigned = 0;
        gameState.researchAssigned = 0;
        gameState.buildingAssigned = 0;
        gameState.healingAssigned = 0;
        
        // Update available survivors
        gameState.availableSurvivors = gameState.healthySurvivors + gameState.injuredSurvivors;
        
        // Reset assignment display
        document.getElementById('scavengeValue').textContent = '0';
        document.getElementById('researchValue').textContent = '0';
        document.getElementById('buildingValue').textContent = '0';
        document.getElementById('healingValue').textContent = '0';
        document.getElementById('totalAssigned').textContent = '0';
        
        // Show game screen
        document.getElementById('nightSummaryScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        
        updateDisplay();
        updateDailyRoutineIndicator();
    }
    
    function victory() {
        document.getElementById('nightSummaryScreen').classList.remove('active');
        document.getElementById('victoryScreen').classList.add('active');
        
        const gameTime = Math.floor((Date.now() - gameState.gameStartTime) / 60000);
        
        const victoryText = `
            <p>${gameState.playerName}, you did it.</p>
            <p>The cure is spreading from Galata Tower across the seven hills. 
            The Bosphorus Bridge lights flicker back to life. 
            Istanbul awakens from its nightmare.</p>
            <p>From Sultanahmet to Taksim, survivors emerge from hiding. 
            Children play in Gülhane Park again. 
            The call to prayer echoes once more across the city.</p>
            <p>You saved not just Istanbul, but humanity itself.</p>
        `;
        
        document.getElementById('victoryText').innerHTML = victoryText;
        
        const statsHTML = `
            <div class="stat-item">
                <div>Days Survived</div>
                <div style="font-size: 1.5em;">${gameState.day}</div>
            </div>
            <div class="stat-item">
                <div>Game Time</div>
                <div style="font-size: 1.5em;">${gameTime} minutes</div>
            </div>
            <div class="stat-item">
                <div>Survivors Saved</div>
                <div style="font-size: 1.5em;">${gameState.totalSurvivors}/12</div>
            </div>
            <div class="stat-item">
                <div>Zombies Eliminated</div>
                <div style="font-size: 1.5em;">${gameState.totalZombiesKilled}</div>
            </div>
        `;
        
        document.getElementById('victoryStats').innerHTML = statsHTML;
    }
    
    function gameOver() {
        document.getElementById('nightSummaryScreen').classList.remove('active');
        document.getElementById('combatScreen').classList.remove('active');
        document.getElementById('gameOverScreen').classList.add('active');
        
        const gameTime = Math.floor((Date.now() - gameState.gameStartTime) / 60000);
        
        const gameOverText = `
            <p>${gameState.playerName}, the compound has fallen.</p>
            <p>Day ${gameState.day} - Karaköy Overrun</p>
            <p>The last radio transmission echoes:<br>
            "If anyone hears this... Istanbul is lost."</p>
            <p>But somewhere in the ruins, another survivor finds your research notes. 
            The cure formula survives. Hope remains.</p><br><br>
            <p>Perhaps next time, Istanbul can be saved.<br>
            Perhaps next time, you'll be ready.</p>
        `;
        
        document.getElementById('gameOverText').innerHTML = gameOverText;
        
        const statsHTML = `
            <div class="stat-item">
                <div>Days Survived</div>
                <div>${gameState.day}</div>
            </div>
            <div class="stat-item">
                <div>Game Time</div>
                <div>${gameTime} minutes</div>
            </div>
            <div class="stat-item">
                <div>Cure Progress</div>
                <div>${gameState.cureProgress}%</div>
            </div>
            <div class="stat-item">
                <div>Zombies Killed</div>
                <div>${gameState.totalZombiesKilled}</div>
            </div>
        `;
        
        document.getElementById('gameOverStats').innerHTML = statsHTML;
    }
    
    // Trading functions
    function openTrading() {
        if (!gameState.tradingUnlocked) return;
        
        document.getElementById('tradePopup').classList.add('active');
        document.getElementById('popupOverlay').classList.add('active');
        
        const resourceDisplay = `
            <p>Your Resources: Scrap: ${gameState.scrap} | Food: ${gameState.food} | Ammo: ${gameState.ammo} | Medical: ${gameState.medical}</p>
            <p>Daily Limit Remaining: ${gameState.dailyTradeLimit - gameState.dailyTradeUsed}/50</p>
        `;
        
        const tradeTable = `
            <h3>Exchange Rates</h3>
            <table style="width: 100%; color: #00ff41;">
                <tr>
                    <th>To Get →</th>
                    <th>1 Scrap</th>
                    <th>1 Food</th>
                    <th>1 Medical</th>
                    <th>1 Ammo</th>
                </tr>
                <tr>
                    <td>Pay Food</td>
                    <td>1:1</td>
                    <td>-</td>
                    <td>3:1</td>
                    <td>2:1</td>
                </tr>
                <tr>
                    <td>Pay Scrap</td>
                    <td>-</td>
                    <td>2:1</td>
                    <td>5:1</td>
                    <td>3:1</td>
                </tr>
                <tr>
                    <td>Pay Medical</td>
                    <td>3:1</td>
                    <td>2:1</td>
                    <td>-</td>
                    <td>1:1</td>
                </tr>
                <tr>
                    <td>Pay Ammo</td>
                    <td>2:1</td>
                    <td>1:1</td>
                    <td>2:1</td>
                    <td>-</td>
                </tr>
            </table>
            
            <h3 style="margin-top: 20px;">Select Resource to Get:</h3>
            <div class="trade-grid">
                <button class="trade-button" onclick="openSpecificTrade('scrap')">GET SCRAP</button>
                <button class="trade-button" onclick="openSpecificTrade('food')">GET FOOD</button>
                <button class="trade-button" onclick="openSpecificTrade('medical')">GET MEDICAL</button>
                <button class="trade-button" onclick="openSpecificTrade('ammo')">GET AMMO</button>
            </div>
        `;
        
        document.getElementById('tradeResourceDisplay').innerHTML = resourceDisplay;
        document.getElementById('tradeContent').innerHTML = tradeTable;
    }
    
    function closeTrading() {
        document.getElementById('tradePopup').classList.remove('active');
        document.getElementById('popupOverlay').classList.remove('active');
        updateDisplay();
    }
    
    function openSpecificTrade(resourceType) {
        document.getElementById('specificTradePopup').classList.add('active');
        document.getElementById('specificTradeTitle').textContent = `GET ${resourceType.toUpperCase()}`;
        
        const resourceDisplay = `
            <p>Your Resources: Scrap: ${gameState.scrap} | Food: ${gameState.food} | Ammo: ${gameState.ammo} | Medical: ${gameState.medical}</p>
            <p>Daily Limit Remaining: ${gameState.dailyTradeLimit - gameState.dailyTradeUsed}/50</p>
        `;
        
        document.getElementById('specificTradeResources').innerHTML = resourceDisplay;
        
        let tradeOptions = '<p>Choose what to trade for ' + resourceType + ':</p>';
        
        const trades = {
            scrap: [
                { from: 'food', rate: '1:1', fromAmount: 1, toAmount: 1 },
                { from: 'medical', rate: '1:3', fromAmount: 1, toAmount: 3 },
                { from: 'ammo', rate: '1:2', fromAmount: 1, toAmount: 2 }
            ],
            food: [
                { from: 'scrap', rate: '2:1', fromAmount: 2, toAmount: 1 },
                { from: 'medical', rate: '1:2', fromAmount: 1, toAmount: 2 },
                { from: 'ammo', rate: '1:1', fromAmount: 1, toAmount: 1 }
            ],
            medical: [
                { from: 'scrap', rate: '5:1', fromAmount: 10, toAmount: 1 },
                { from: 'food', rate: '3:1', fromAmount: 5, toAmount: 1 },
                { from: 'ammo', rate: '2:1', fromAmount: 4, toAmount: 1 }
            ],
            ammo: [
                { from: 'scrap', rate: '3:1', fromAmount: 4, toAmount: 1 },
                { from: 'food', rate: '2:1', fromAmount: 2, toAmount: 1 },
                { from: 'medical', rate: '1:1', fromAmount: 1, toAmount: 1 }
            ]
        };
        
        trades[resourceType].forEach(trade => {
            const canAfford = gameState[trade.from] >= trade.fromAmount && 
                             gameState.dailyTradeUsed + trade.fromAmount <= gameState.dailyTradeLimit;
            
            if (canAfford) {
                tradeOptions += `
                    <button onclick="executeTrade('${trade.from}', ${trade.fromAmount}, '${resourceType}', ${trade.toAmount})" 
                            style="margin: 10px;">
                        TRADE ${trade.fromAmount} ${trade.from.toUpperCase()} → GET ${trade.toAmount} ${resourceType.toUpperCase()}
                    </button><br>
                `;
            } else {
                tradeOptions += `
                    <button disabled style="margin: 10px; opacity: 0.5;">
                        TRADE ${trade.fromAmount} ${trade.from.toUpperCase()} → GET ${trade.toAmount} ${resourceType.toUpperCase()}
                        ${gameState[trade.from] < trade.fromAmount ? ' (Not enough ' + trade.from + ')' : ' (Daily limit reached)'}
                    </button><br>
                `;
            }
        });
        
        document.getElementById('specificTradeOptions').innerHTML = tradeOptions;
    }
    
    function executeTrade(fromResource, fromAmount, toResource, toAmount) {
        if (gameState[fromResource] >= fromAmount && 
            gameState.dailyTradeUsed + fromAmount <= gameState.dailyTradeLimit) {
            
            gameState[fromResource] -= fromAmount;
            gameState[toResource] += toAmount;
            gameState.dailyTradeUsed += fromAmount;
            
            // Update display
            openSpecificTrade(toResource);
            
            // Show confirmation
            const confirmMsg = document.createElement('p');
            confirmMsg.style.color = '#00ff41';
            confirmMsg.textContent = `✓ Trade Complete! -${fromAmount} ${fromResource}, +${toAmount} ${toResource}`;
            document.getElementById('specificTradeResources').appendChild(confirmMsg);
            
            setTimeout(() => {
                if (confirmMsg.parentNode) {
                    confirmMsg.remove();
                }
            }, 2000);
        }
    }
    
    function closeSpecificTrade() {
        document.getElementById('specificTradePopup').classList.remove('active');
        openTrading(); // Go back to main trade screen
    }
    
    // Help functions
    function showHelp() {
        document.getElementById('helpPopup').classList.add('active');
        document.getElementById('popupOverlay').classList.add('active');
        
        // Reset help content if it was changed by event
        document.getElementById('helpPopup').innerHTML = `
            <h2>HOW TO PLAY</h2>
            <p><strong>GOAL:</strong> Create a cure (100 research points) and survive the production phase</p>
            
            <h3>DAILY CYCLE:</h3>
            <ol>
                <li>Morning - Assign survivors to tasks</li>
                <li>Evening - Collect resources, see events</li>
                <li>Prep - Craft combat items</li>
                <li>Night - Defend against zombies</li>
                <li>Summary - View results, continue</li>
            </ol>
            
            <h3>RESOURCES:</h3>
            <ul>
                <li><strong>Scrap</strong> - Build walls, craft items</li>
                <li><strong>Food</strong> - Feed survivors (1/day healthy, 2/day sick)</li>
                <li><strong>Ammo</strong> - Auto-defense (3 per zombie)</li>
                <li><strong>Medical</strong> - Heal sick/injured, craft items</li>
            </ul>
            
            <h3>COMBAT:</h3>
            <ul>
                <li>Defenders auto-shoot zombies</li>
                <li>Molotovs kill 3 zombies</li>
                <li>Grenades kill 5 zombies</li>
                <li>Surge Blast clears all (one-time use)</li>
            </ul>
            
            <div class="button-group">
                <button onclick="closeHelp()">CLOSE</button>
            </div>
        `;
    }
    
    function closeHelp() {
        document.getElementById('helpPopup').classList.remove('active');
        document.getElementById('popupOverlay').classList.remove('active');
    }
    
    function closePopup() {
        document.querySelectorAll('.popup').forEach(popup => {
            popup.classList.remove('active');
        });
        document.getElementById('popupOverlay').classList.remove('active');
    }
    
    function showWelcomeModal() {
        const welcomeContent = `
            <p>Welcome to the Karaköy Survivor Camp, <strong>${gameState.playerName}</strong>.</p>
            <br>
            <p>Every morning, assign your survivors to critical tasks.</p>
            <br>
            <p>Balance your resources wisely—scavengers gather supplies, researchers develop the cure, builders fortify walls, and healers tend to the sick and injured.</p>
            <br>
            <p>As night falls, you must prepare for relentless zombie waves.</p>
            <br>
            <p>Plan carefully. Each decision affects your survival.</p>
        `;
        document.getElementById('welcomeContent').innerHTML = welcomeContent;
        document.getElementById('welcomePopup').classList.add('active');
        document.getElementById('popupOverlay').classList.add('active');
    }
    
    function closeWelcome() {
        document.getElementById('welcomePopup').classList.remove('active');
        document.getElementById('popupOverlay').classList.remove('active');
    }
