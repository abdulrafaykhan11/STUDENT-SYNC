document.addEventListener('DOMContentLoaded', () => {
    
    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));

    // --- Active Navbar State ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
        
        // Sticky navbar background
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 12, 16, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        } else {
            navbar.style.background = 'rgba(11, 12, 16, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Interactive Counters ---
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60 FPS
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toLocaleString();
                        }
                    };
                    updateCounter();
                });
                countersAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // --- Home Problem Solver Tabs ---
    const solutionData = {
        transit: {
            title: 'Compare commute cost before leaving',
            copy: 'StudentSync checks bus, ride-hailing, and personal transport cost so students can choose the cheapest reliable route.',
            metrics: ['Rs 95 average saving', '12 min delay avoided']
        },
        route: {
            title: 'Avoid broken roads and unreliable routes',
            copy: 'Route Intelligence flags damaged roads, slow public transit points, and safer alternates before the student starts travelling.',
            metrics: ['3 route signals', '1 safer alternate']
        },
        civic: {
            title: 'Turn complaints into trackable civic reports',
            copy: 'Civic Voice Hub groups repeated student complaints so campus and municipal issues become visible, organized, and easier to escalate.',
            metrics: ['42 reports grouped', 'Priority tag added']
        },
        concept: {
            title: 'Replace cramming with concept recovery',
            copy: 'Conceptual Mastery identifies weak topics and builds a small learning path with examples, practice, and quick checks.',
            metrics: ['25 min study sprint', '4 weak topics']
        },
        knowledge: {
            title: 'Get one clean resource pack',
            copy: 'Unified Knowledge Base removes resource hunting by placing notes, videos, PDFs, and references into one curated curriculum view.',
            metrics: ['3 notes matched', '2 videos queued']
        },
        mentor: {
            title: 'Book guidance before confusion becomes delay',
            copy: 'Strategic Mentorship connects students with roadmap support for course selection, skill planning, and career direction.',
            metrics: ['20 min mentor slot', '1 roadmap generated']
        }
    };

    const solutionTabs = document.querySelectorAll('.solution-tab');
    const solutionResult = document.getElementById('solutionResult');

    if (solutionTabs.length && solutionResult) {
        solutionTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const selected = solutionData[tab.dataset.solution];
                if (!selected) return;

                solutionTabs.forEach(item => item.classList.remove('active'));
                tab.classList.add('active');

                solutionResult.innerHTML = `
                    <span class="result-label">Recommended move</span>
                    <h4>${selected.title}</h4>
                    <p>${selected.copy}</p>
                    <div class="result-metrics">
                        ${selected.metrics.map(metric => `<span><strong>${metric.split(' ')[0]}</strong> ${metric.split(' ').slice(1).join(' ')}</span>`).join('')}
                    </div>
                `;
            });
        });
    }

    // --- Pomodoro Timer Logic ---
    let timerInterval;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isRunning = false;
    let mode = 'focus'; // 'focus' or 'break'

    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const tabs = document.querySelectorAll('.pomodoro-tabs .tab');

    if (!timerDisplay || !startBtn || !resetBtn || !tabs.length) {
        // Do nothing, just skip pomodoro setup
    } else {

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            startBtn.innerText = 'Start';
            isRunning = false;
        } else {
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    startBtn.innerText = 'Start';
                    // Optional: Play sound when timer finishes
                    alert(mode === 'focus' ? 'Focus session complete! Time for a break.' : 'Break over! Back to work.');
                    switchMode(mode === 'focus' ? 'break' : 'focus');
                }
            }, 1000);
            startBtn.innerText = 'Pause';
            isRunning = true;
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.innerText = 'Start';
        timeLeft = mode === 'focus' ? 25 * 60 : 5 * 60;
        updateDisplay();
    }

    function switchMode(newMode) {
        mode = newMode;
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.tab[data-mode="${mode}"]`).classList.add('active');
        resetTimer();
    }

        startBtn.addEventListener('click', toggleTimer);
        resetBtn.addEventListener('click', resetTimer);

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const selectedMode = e.target.getAttribute('data-mode');
                if (mode !== selectedMode) {
                    switchMode(selectedMode);
                }
            });
        });

        // Initialize display
        if (typeof updateDisplay === 'function') {
            try { updateDisplay(); } catch(e) {}
        }
    }

    // --- Transit Calculator Mockup ---
    const calcTabs = document.querySelectorAll('.calc-tab');
    const calcContent = document.getElementById('calc-content');
    const calcInsights = document.getElementById('calc-insights');
    const calcRecommendation = document.getElementById('calc-recommendation');
    const originSelect = document.getElementById('origin-select');
    const destSelect = document.getElementById('dest-select');
    const instTypeSelect = document.getElementById('inst-type-select');
    const calcSwapBtn = document.getElementById('calc-swap-btn');
    const calcDestHint = document.getElementById('calc-dest-hint');

    const areaLabels = {
        gulshan: 'Gulshan-e-Iqbal',
        north_nazimabad: 'North Nazimabad',
        pechs: 'PECHS',
        clifton: 'Clifton',
        malir: 'Malir'
    };

    const instTypeLabels = {
        university: 'universities',
        college: 'colleges',
        school: 'schools'
    };

    const institutions = {
        ned: { name: 'NED University', type: 'university', area: 'gulshan', kmExtra: 0, signal: 'University Road clear' },
        ku: { name: 'Karachi University', type: 'university', area: 'gulshan', kmExtra: -0.6, signal: 'Direct campus belt' },
        fast: { name: 'FAST NUCES', type: 'university', area: 'pechs', kmExtra: 0, signal: 'Shahrah-e-Faisal traffic' },
        iba: { name: 'IBA Karachi', type: 'university', area: 'gulshan', kmExtra: 0.8, signal: 'Main University Road' },
        dhaus: { name: 'DHA Suffa University', type: 'university', area: 'clifton', kmExtra: 0, signal: 'Korangi Road moderate' },
        szabist: { name: 'SZABIST Karachi', type: 'university', area: 'clifton', kmExtra: 1.2, signal: 'Clifton corridor' },
        indus: { name: 'Indus University', type: 'university', area: 'pechs', kmExtra: 0.5, signal: 'Gulistan-e-Johar link' },
        dj_science: { name: 'DJ Science College', type: 'college', area: 'gulshan', kmExtra: 0.3, signal: 'University Road stop' },
        st_patricks: { name: "St. Patrick's College", type: 'college', area: 'pechs', kmExtra: 0, signal: 'Saddar approach' },
        gcw: { name: 'Govt College for Women', type: 'college', area: 'north_nazimabad', kmExtra: 0, signal: 'Nazimabad belt' },
        bahria_college: { name: 'Bahria College Karsaz', type: 'college', area: 'pechs', kmExtra: 0.4, signal: 'Karsaz Road active' },
        adamjee: { name: 'Adamjee Science College', type: 'college', area: 'gulshan', kmExtra: 0.2, signal: 'Gulshan main route' },
        djmc: { name: 'DJ Sindh Govt Science College', type: 'college', area: 'malir', kmExtra: 0, signal: 'Malir connector' },
        kgs: { name: 'Karachi Grammar School', type: 'school', area: 'clifton', kmExtra: 0, signal: 'Clifton morning route' },
        city_school: { name: 'The City School Gulshan', type: 'school', area: 'gulshan', kmExtra: 0, signal: 'Gulshan block route' },
        beaconhouse: { name: 'Beaconhouse Clifton', type: 'school', area: 'clifton', kmExtra: 0.3, signal: 'Sea View corridor' },
        fps: { name: 'Foundation Public School', type: 'school', area: 'gulshan', kmExtra: 0.5, signal: 'University Road branch' },
        happy_home: { name: 'Happy Home School', type: 'school', area: 'pechs', kmExtra: 0, signal: 'PECHS school belt' },
        bayview: { name: 'Bay View Academy', type: 'school', area: 'clifton', kmExtra: 0.6, signal: 'DHA link road' },
        roots: { name: 'Roots Millennium Malir', type: 'school', area: 'malir', kmExtra: 0, signal: 'Malir Cantt route' }
    };

    const legacyRoutes = {
        gulshan: {
            ned: { km: 5.4, congestion: 10, transfers: 0, walk: 6, seats: 4, shuttleEta: 11 },
            ku: { km: 4.8, congestion: 8, transfers: 0, walk: 8, seats: 5, shuttleEta: 9 },
            fast: { km: 13.8, congestion: 17, transfers: 1, walk: 10, seats: 2, shuttleEta: 18 },
            iba: { km: 6.2, congestion: 11, transfers: 0, walk: 7, seats: 3, shuttleEta: 10 },
            dhaus: { km: 19.5, congestion: 21, transfers: 2, walk: 12, seats: 1, shuttleEta: 24 }
        },
        north_nazimabad: {
            ned: { km: 12.6, congestion: 16, transfers: 1, walk: 8, seats: 3, shuttleEta: 15 },
            ku: { km: 13.9, congestion: 17, transfers: 1, walk: 9, seats: 3, shuttleEta: 16 },
            fast: { km: 20.4, congestion: 24, transfers: 2, walk: 12, seats: 2, shuttleEta: 23 },
            iba: { km: 14.3, congestion: 18, transfers: 1, walk: 10, seats: 2, shuttleEta: 17 },
            dhaus: { km: 25.7, congestion: 29, transfers: 2, walk: 14, seats: 1, shuttleEta: 27 }
        },
        pechs: {
            ned: { km: 11.7, congestion: 15, transfers: 1, walk: 7, seats: 4, shuttleEta: 13 },
            ku: { km: 12.8, congestion: 16, transfers: 1, walk: 8, seats: 4, shuttleEta: 14 },
            fast: { km: 8.5, congestion: 12, transfers: 0, walk: 6, seats: 3, shuttleEta: 12 },
            iba: { km: 13.5, congestion: 17, transfers: 1, walk: 9, seats: 2, shuttleEta: 16 },
            dhaus: { km: 15.9, congestion: 19, transfers: 1, walk: 10, seats: 2, shuttleEta: 19 }
        },
        clifton: {
            ned: { km: 22.1, congestion: 26, transfers: 2, walk: 12, seats: 2, shuttleEta: 25 },
            ku: { km: 23.4, congestion: 28, transfers: 2, walk: 13, seats: 2, shuttleEta: 26 },
            fast: { km: 14.6, congestion: 18, transfers: 1, walk: 9, seats: 3, shuttleEta: 18 },
            iba: { km: 24.0, congestion: 29, transfers: 2, walk: 14, seats: 1, shuttleEta: 28 },
            dhaus: { km: 9.8, congestion: 13, transfers: 0, walk: 7, seats: 4, shuttleEta: 12 }
        },
        malir: {
            ned: { km: 13.2, congestion: 16, transfers: 1, walk: 8, seats: 4, shuttleEta: 14 },
            ku: { km: 14.4, congestion: 17, transfers: 1, walk: 9, seats: 5, shuttleEta: 15 },
            fast: { km: 16.7, congestion: 20, transfers: 1, walk: 10, seats: 2, shuttleEta: 20 },
            iba: { km: 15.1, congestion: 18, transfers: 1, walk: 8, seats: 3, shuttleEta: 17 },
            dhaus: { km: 26.6, congestion: 31, transfers: 2, walk: 14, seats: 1, shuttleEta: 30 }
        }
    };

    const areaDistance = {
        gulshan: { gulshan: 4.2, north_nazimabad: 12.6, pechs: 11.7, clifton: 22.1, malir: 13.2 },
        north_nazimabad: { gulshan: 12.6, north_nazimabad: 3.5, pechs: 14.0, clifton: 24.0, malir: 15.0 },
        pechs: { gulshan: 11.7, north_nazimabad: 14.0, pechs: 3.8, clifton: 15.9, malir: 16.7 },
        clifton: { gulshan: 22.1, north_nazimabad: 24.0, pechs: 15.9, clifton: 4.5, malir: 26.6 },
        malir: { gulshan: 13.2, north_nazimabad: 15.0, pechs: 16.7, clifton: 26.6, malir: 3.6 }
    };

    const modeMeta = {
        ride: { label: 'Ride App', icon: 'fa-taxi', className: 'ride', tag: 'Peak fare checked' },
        bus: { label: 'Public Bus', icon: 'fa-bus', className: 'bus', tag: 'Budget route' },
        carpool: { label: 'Carpool', icon: 'fa-car-side', className: 'carpool', tag: 'Verified student seats' },
        shuttle: { label: 'Campus Shuttle', icon: 'fa-van-shuttle', className: 'shuttle', tag: 'Point schedule match' }
    };

    const formatRs = value => `Rs ${Math.round(value).toLocaleString()}`;

    const computeRouteMetrics = (originKey, instKey) => {
        const inst = institutions[instKey];
        if (!inst) return null;

        const legacy = legacyRoutes[originKey]?.[instKey];
        if (legacy) {
            return { ...legacy, signal: inst.signal };
        }

        const baseKm = (areaDistance[originKey]?.[inst.area] || 12) + (inst.kmExtra || 0);
        const km = Math.max(2.5, Math.round(baseKm * 10) / 10);
        const congestion = Math.min(32, Math.round(km * 0.95 + (inst.type === 'school' ? -2 : 0)));
        const transfers = km > 20 ? 2 : km > 11 ? 1 : 0;
        const walk = Math.min(15, Math.round(5 + transfers * 2 + (inst.type === 'school' ? 1 : 2)));
        const seats = inst.type === 'school' ? Math.max(1, 5 - transfers) : Math.max(1, 4 - transfers);
        const shuttleEta = Math.round(8 + km * 0.65 + transfers * 3);

        return { km, congestion, transfers, walk, seats, shuttleEta, signal: inst.signal };
    };

    const getTop5Institutions = (type, originKey) => {
        return Object.entries(institutions)
            .filter(([, inst]) => inst.type === type)
            .map(([key, inst]) => ({
                key,
                inst,
                metrics: computeRouteMetrics(originKey, key)
            }))
            .filter(item => item.metrics)
            .sort((a, b) => a.metrics.km - b.metrics.km)
            .slice(0, 5);
    };

    const populateDestSelect = (type, originKey, preferredKey) => {
        if (!destSelect) return;

        const top5 = getTop5Institutions(type, originKey);
        destSelect.innerHTML = top5.map(({ key, inst, metrics }) =>
            `<option value="${key}">${inst.name} · ${metrics.km} km</option>`
        ).join('');

        if (preferredKey && top5.some(item => item.key === preferredKey)) {
            destSelect.value = preferredKey;
        }

        if (calcDestHint) {
            const areaName = areaLabels[originKey] || 'your area';
            calcDestHint.textContent = `Top 5 ${instTypeLabels[type] || 'institutions'} closest to ${areaName}`;
        }
    };

    const buildOptions = route => {
        const km = route.km;
        const rideBase = Math.round(150 + (km * 33) + route.congestion);
        const rideCost = Math.round(rideBase * (route.congestion > 22 ? 1.38 : route.congestion > 16 ? 1.24 : 1.12));
        const busCost = Math.round(55 + (route.transfers * 45) + (km > 18 ? 35 : 0));
        const carpoolCost = Math.round(95 + (km * 15) + Math.max(0, 5 - route.seats) * 12);
        const shuttleCost = Math.round(80 + (km > 15 ? 35 : 0) + (route.shuttleEta > 22 ? 20 : 0));

        return {
            ride: {
                cost: rideCost,
                oldCost: rideBase,
                time: Math.round(16 + (km * 1.75) + (route.congestion * 0.45)),
                reliability: route.congestion > 24 ? 72 : 84,
                detail: 'Fastest solo option, but peak pricing is active.'
            },
            bus: {
                cost: busCost,
                time: Math.round(24 + (km * 2.35) + (route.transfers * 11) + route.walk),
                reliability: route.transfers > 1 ? 69 : 77,
                detail: `${route.transfers} transfer${route.transfers === 1 ? '' : 's'} and ${route.walk} min walk.`
            },
            carpool: {
                cost: carpoolCost,
                time: Math.round(20 + (km * 1.85) + (route.congestion * 0.35)),
                reliability: route.seats > 2 ? 91 : 82,
                detail: `${route.seats} verified seat${route.seats === 1 ? '' : 's'} near your area.`
            },
            shuttle: {
                cost: shuttleCost,
                time: Math.round(route.shuttleEta + 20 + (km * 2.05)),
                reliability: route.shuttleEta > 24 ? 76 : 88,
                detail: `Next pickup in ${route.shuttleEta} min.`
            }
        };
    };

    const getRoutePlan = (originKey, destKey) => {
        const route = computeRouteMetrics(originKey, destKey);
        const inst = institutions[destKey];
        if (!route || !inst) return null;

        const options = buildOptions(route);
        const entries = Object.entries(options);
        const cheapest = entries.reduce((best, current) => current[1].cost < best[1].cost ? current : best);
        const fastest = entries.reduce((best, current) => current[1].time < best[1].time ? current : best);
        const balanced = entries
            .map(([key, option]) => [key, option, option.cost + (option.time * 8) - (option.reliability * 3)])
            .sort((a, b) => a[2] - b[2])[0];

        return {
            originLabel: areaLabels[originKey] || areaLabels.gulshan,
            campusLabel: inst.name,
            instType: inst.type,
            route,
            options,
            cheapest: cheapest[0],
            fastest: fastest[0],
            recommended: balanced[0]
        };
    };

    const renderCalculator = (plan, activeMode) => {
        const selected = plan.options[activeMode] || plan.options.ride;
        const meta = modeMeta[activeMode] || modeMeta.ride;
        const rideCost = plan.options.ride.cost;
        const saving = Math.max(0, rideCost - selected.cost);
        const monthlySaving = saving * 22;

        const optionRows = Object.entries(plan.options).map(([key, option]) => {
            const rowMeta = modeMeta[key];
            const badges = [
                key === plan.recommended ? '<span>Best</span>' : '',
                key === plan.cheapest ? '<span>Cheapest</span>' : '',
                key === plan.fastest ? '<span>Fastest</span>' : ''
            ].filter(Boolean).join('');

            return `
                <div class="calc-option-row ${key === activeMode ? 'active' : ''}">
                    <div>
                        <i class="fa-solid ${rowMeta.icon}"></i>
                        <strong>${rowMeta.label}</strong>
                    </div>
                    <span>${formatRs(option.cost)}</span>
                    <small>${option.time} min</small>
                    <div class="calc-row-badges">${badges}</div>
                </div>
            `;
        }).join('');

        calcContent.innerHTML = `
            <div class="calc-main-card ${meta.className}">
                <div class="calc-icon"><i class="fa-solid ${meta.icon}"></i></div>
                <div class="calc-price-block">
                    <span>${meta.label}</span>
                    <h3>${formatRs(selected.cost)} ${activeMode === 'ride' ? `<small>${formatRs(selected.oldCost)}</small>` : ''}</h3>
                    <p>${plan.originLabel} → ${plan.campusLabel}</p>
                </div>
                <div class="calc-live-pill"><i class="fa-solid fa-circle"></i> ${meta.tag}</div>
            </div>

            <div class="calc-metric-grid">
                <div><span>Distance</span><strong>${plan.route.km} km</strong></div>
                <div><span>Time</span><strong>${selected.time} min</strong></div>
                <div><span>Reliability</span><strong>${selected.reliability}%</strong></div>
                <div><span>Monthly Save</span><strong>${formatRs(monthlySaving)}</strong></div>
            </div>

            <div class="calc-compare-list">
                ${optionRows}
            </div>
        `;

        calcInsights.innerHTML = `
            <div>
                <i class="fa-solid fa-route"></i>
                <span>${plan.route.km} km</span>
                <strong>${plan.route.signal}</strong>
            </div>
            <div>
                <i class="fa-solid fa-wallet"></i>
                <span>Best value</span>
                <strong>${modeMeta[plan.recommended].label}</strong>
            </div>
            <div>
                <i class="fa-solid fa-user-group"></i>
                <span>Carpool seats</span>
                <strong>${plan.route.seats} open</strong>
            </div>
        `;

        calcRecommendation.innerHTML = `<i class="fa-solid fa-star"></i> Recommended: ${modeMeta[plan.recommended].label} saves ${formatRs(Math.max(0, rideCost - plan.options[plan.recommended].cost))} per trip vs ride app.`;
    };

    const updateCalculator = () => {
        if (!calcContent || !originSelect || !destSelect) return;

        const activeTab = document.querySelector('.calc-tab.active');
        const mode = activeTab ? activeTab.dataset.mode : 'ride';
        const plan = getRoutePlan(originSelect.value, destSelect.value);
        if (!plan) return;

        calcContent.classList.add('is-updating');
        if (calcInsights) calcInsights.classList.add('is-updating');

        setTimeout(() => {
            renderCalculator(plan, mode);
            calcContent.classList.remove('is-updating');
            if (calcInsights) calcInsights.classList.remove('is-updating');
        }, 180);
    };

    const refreshDestOptions = (keepSelection = true) => {
        const type = instTypeSelect ? instTypeSelect.value : 'university';
        const originKey = originSelect.value;
        const previous = keepSelection ? destSelect.value : null;
        populateDestSelect(type, originKey, previous);
    };

    const swapRoute = () => {
        if (!originSelect || !destSelect || !instTypeSelect) return;

        const oldOrigin = originSelect.value;
        const oldDest = destSelect.value;
        const inst = institutions[oldDest];
        if (!inst) return;

        if (calcSwapBtn) {
            calcSwapBtn.classList.add('is-swapping');
            setTimeout(() => calcSwapBtn.classList.remove('is-swapping'), 350);
        }

        originSelect.value = inst.area;

        const type = instTypeSelect.value;
        const candidates = Object.entries(institutions)
            .filter(([, item]) => item.type === type)
            .map(([key, item]) => ({ key, km: computeRouteMetrics(inst.area, key)?.km || 99 }))
            .sort((a, b) => {
                const aNearHome = institutions[a.key].area === oldOrigin ? -1 : 0;
                const bNearHome = institutions[b.key].area === oldOrigin ? -1 : 0;
                if (aNearHome !== bNearHome) return aNearHome - bNearHome;
                return a.km - b.km;
            });

        populateDestSelect(type, inst.area, candidates[0]?.key);
        updateCalculator();
    };

    if (originSelect && destSelect && instTypeSelect) {
        populateDestSelect(instTypeSelect.value, originSelect.value);
        originSelect.addEventListener('change', () => {
            refreshDestOptions(true);
            updateCalculator();
        });
        instTypeSelect.addEventListener('change', () => {
            refreshDestOptions(false);
            updateCalculator();
        });
        destSelect.addEventListener('change', updateCalculator);
    }

    if (calcSwapBtn) {
        calcSwapBtn.addEventListener('click', swapRoute);
    }

    if (calcTabs.length && calcContent) {
        calcTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                calcTabs.forEach(item => item.classList.remove('active'));
                tab.classList.add('active');
                updateCalculator();
            });
        });
    }

    if (originSelect && destSelect) {
        updateCalculator();
    }
});
