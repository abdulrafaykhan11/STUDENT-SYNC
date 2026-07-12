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

        document.dispatchEvent(new CustomEvent('transit-calc-updated', { detail: { plan, activeMode: mode } }));
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

    window.StudentSyncTransit = { getRoutePlan, formatRs };

    // --- Route Intelligence Radar Logic ---
    const scanBtn = document.getElementById('scan-route-btn');
    const initialState = document.getElementById('route-initial-state');
    const scanningState = document.getElementById('route-scanning-state');
    const resultsState = document.getElementById('route-results-state');
    const scanLog = document.getElementById('scan-log');
    
    if (scanBtn && initialState && scanningState && resultsState) {
        
        // Setup dropdowns dynamically
        const routeOriginSelect = document.getElementById('route-origin');
        const routeInstTypeSelect = document.getElementById('route-inst-type');
        const routeDestSelect = document.getElementById('route-dest');

        const populateRouteDestSelect = () => {
            if (!routeDestSelect || !routeOriginSelect || !routeInstTypeSelect) return;
            const type = routeInstTypeSelect.value;
            const origin = routeOriginSelect.value;
            // Uses getTop5Institutions defined earlier in the file
            const top5 = getTop5Institutions(type, origin);
            routeDestSelect.innerHTML = top5.map(({ key, inst }) =>
                `<option value="${key}">${inst.name}</option>`
            ).join('');
        };

        if (routeOriginSelect && routeInstTypeSelect && routeDestSelect) {
            populateRouteDestSelect();
            routeOriginSelect.addEventListener('change', populateRouteDestSelect);
            routeInstTypeSelect.addEventListener('change', populateRouteDestSelect);
        }

        const possibleHazards = [
            { icon: 'fa-truck-fast', title: 'Heavy Traffic Spillover', desc: 'Congestion due to broken down truck on main artery.' },
            { icon: 'fa-water', title: 'Water Logging', desc: 'Left lane flooded due to broken pipe. Slow movement.' },
            { icon: 'fa-person-harassing', title: 'Protest Blockade', desc: 'Unplanned gathering. Traffic diverted by traffic police.' },
            { icon: 'fa-person-digging', title: 'Sudden Construction', desc: 'Open manhole repair work. Single lane passing.' },
            { icon: 'fa-car-burst', title: 'Accident Reported', desc: 'Fender bender causing 15 min delay.' }
        ];

        const scanLogs = [
            "Connecting to community feeds...",
            "Analyzing University Road traffic patterns...",
            "Checking weather and road conditions...",
            "Detecting localized protests and VIP movements...",
            "Calculating alternative safe corridors...",
            "Finalizing optimum route..."
        ];

        scanBtn.addEventListener('click', () => {
            // Setup UI for scanning
            initialState.style.display = 'none';
            resultsState.style.display = 'none';
            scanningState.style.display = 'flex';
            scanBtn.disabled = true;
            scanBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Scanning...';
            
            const originVal = document.getElementById('route-origin').options[document.getElementById('route-origin').selectedIndex].text;
            const destVal = document.getElementById('route-dest').options[document.getElementById('route-dest').selectedIndex].text;

            // Simulate log updates
            let logIndex = 0;
            const logInterval = setInterval(() => {
                if (logIndex < scanLogs.length) {
                    scanLog.innerText = scanLogs[logIndex];
                    logIndex++;
                }
            }, 400);

            // Finish scanning after 2.8s
            setTimeout(() => {
                clearInterval(logInterval);
                scanningState.style.display = 'none';
                resultsState.style.display = 'block';
                scanBtn.disabled = false;
                scanBtn.innerHTML = '<i class="fa-solid fa-radar"></i> Rescan Route';

                // Populate dynamic results
                // 1. Hazards
                const hazardCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 hazards
                const shuffledHazards = possibleHazards.sort(() => 0.5 - Math.random());
                const selectedHazards = shuffledHazards.slice(0, hazardCount);
                
                const hazardsList = document.getElementById('hazards-list');
                hazardsList.innerHTML = selectedHazards.map(h => `
                    <div style="background: rgba(255, 64, 129, 0.05); border-left: 3px solid var(--accent-coral); padding: 1rem; border-radius: 4px;">
                        <h5 style="margin: 0 0 0.25rem 0; color: white;"><i class="fa-solid ${h.icon}" style="color: var(--accent-coral); margin-right: 0.5rem;"></i> ${h.title}</h5>
                        <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${h.desc}</p>
                    </div>
                `).join('');

                // 2. Timeline Info
                document.getElementById('timeline-start').innerText = originVal;
                document.getElementById('timeline-end').innerText = destVal;
                
                const alternatives = [
                    "Via Lyari Expressway (Toll)", 
                    "Via Shahrah-e-Faisal Alternate", 
                    "Via Rashid Minhas Link Road", 
                    "Backstreet Corridor 4"
                ];
                document.getElementById('result-route-name').innerText = alternatives[Math.floor(Math.random() * alternatives.length)];
                document.getElementById('timeline-via').innerText = "Safe alternate suggested by community";
                
                const timeStr = Math.floor(Math.random() * 20 + 25) + "m";
                document.getElementById('result-time').innerText = timeStr;

                // Setup Navigation Button
                const startNavBtn = document.getElementById('start-navigation-btn');
                if (startNavBtn) {
                    const newStartNavBtn = startNavBtn.cloneNode(true);
                    startNavBtn.parentNode.replaceChild(newStartNavBtn, startNavBtn);
                    
                    newStartNavBtn.addEventListener('click', () => {
                        const originSearch = encodeURIComponent(originVal + " Karachi");
                        const destSearch = encodeURIComponent(destVal + " Karachi");
                        window.open(`https://www.google.com/maps/dir/?api=1&origin=${originSearch}&destination=${destSearch}`, '_blank');
                    });
                }

            }, 2800);
        });
    }

    // --- Civic Voice Hub Logic ---
    const civicInstTypeSelect = document.getElementById('civic-inst-type');
    const civicCampusSelect = document.getElementById('civic-campus');
    const civicForm = document.getElementById('civic-report-form');
    const civicFeedContainer = document.getElementById('civic-feed-container');

    if (civicInstTypeSelect && civicCampusSelect && civicForm && civicFeedContainer) {
        
        const populateCivicCampusSelect = () => {
            const type = civicInstTypeSelect.value;
            // Assuming origin is a default since we don't have user area here, let's just get all of that type
            const availableCampuses = Object.entries(institutions)
                .filter(([, inst]) => inst.type === type);
                
            civicCampusSelect.innerHTML = availableCampuses.map(([key, inst]) =>
                `<option value="${inst.name}">${inst.name}</option>`
            ).join('');
            
            // Ensure value is set immediately for initial render
            if (availableCampuses.length > 0) {
                civicCampusSelect.value = availableCampuses[0][1].name;
            }
            
            // Re-render feed when campus options change
            if (typeof renderCivicFeed === 'function') {
                renderCivicFeed();
            }
        };

        let civicPosts = [
            // Universities
            { id: 1, author: "Ali Raza", campus: "NED University", category: "Infrastructure", content: "The main entrance road has a massive pothole causing heavy traffic jams every morning. Needs immediate repair.", upvotes: 142, downvotes: 5, userVote: 0, replies: [{author: "Sara K.", text: "Yes, I got late to my 8:30 class because of this!"}] },
            { id: 11, author: "Hamza Tariq", campus: "NED University", category: "Academics", content: "The new lab equipment in the electrical department is still not accessible for final year projects.", upvotes: 45, downvotes: 2, userVote: 0, replies: [] },
            
            { id: 2, author: "Ayesha S.", campus: "Karachi University", category: "Admin Delay", content: "Scholarship forms are still not being processed. The deadline is tomorrow and the admin office is closed.", upvotes: 89, downvotes: 2, userVote: 0, replies: [] },
            { id: 22, author: "Bilal", campus: "Karachi University", category: "Transport", content: "Silver Jubilee gate point buses are totally overcrowded by 1 PM. We need more frequency.", upvotes: 112, downvotes: 8, userVote: 0, replies: [{author: "Zainab", text: "Totally agree, I had to wait an hour yesterday."}] },

            { id: 3, author: "Usman M.", campus: "IBA Karachi", category: "Transport", content: "The 3:30 PM point bus is consistently arriving 20 minutes late. Can we please get this scheduled properly?", upvotes: 56, downvotes: 1, userVote: 0, replies: [] },
            { id: 33, author: "Fatima", campus: "IBA Karachi", category: "Infrastructure", content: "Library AC in the silent zone is dripping water on the desks.", upvotes: 34, downvotes: 0, userVote: 0, replies: [] },

            { id: 7, author: "Ahmed", campus: "FAST NUCES", category: "Academics", content: "Midterm schedules are clashing with the coding competition dates. Admin needs to reconsider.", upvotes: 204, downvotes: 15, userVote: 0, replies: [{author: "Hassan", text: "I've emailed the HoD already."}] },
            { id: 77, author: "Zoya", campus: "FAST NUCES", category: "Infrastructure", content: "Cafeteria seating is not enough for the new batch size. People are eating standing up.", upvotes: 150, downvotes: 3, userVote: 0, replies: [] },

            { id: 8, author: "Shahmeer", campus: "DHA Suffa University", category: "Transport", content: "Parking space is completely full by 9 AM. Need a secondary parking lot.", upvotes: 88, downvotes: 1, userVote: 0, replies: [] },
            { id: 9, author: "Mahnoor", campus: "SZABIST Karachi", category: "Admin Delay", content: "Degree issuance is taking 6 months instead of the standard 3 months. HRs are rejecting us.", upvotes: 145, downvotes: 0, userVote: 0, replies: [{author: "Kamran", text: "This is unacceptable."}] },

            // Indus University purposely left blank

            // Colleges
            { id: 4, author: "Kashif", campus: "DJ Science College", category: "Infrastructure", content: "The chemistry lab sinks are mostly blocked. It's impossible to do practicals safely.", upvotes: 77, downvotes: 4, userVote: 0, replies: [] },
            { id: 44, author: "Mustafa", campus: "DJ Science College", category: "Academics", content: "Physics lecturer hasn't shown up for 2 weeks.", upvotes: 60, downvotes: 2, userVote: 0, replies: [] },

            { id: 5, author: "Hina", campus: "Govt College for Women", category: "Admin Delay", content: "Enrollment cards for first year are still pending even though classes started a month ago.", upvotes: 92, downvotes: 1, userVote: 0, replies: [] },
            { id: 55, author: "Sadia", campus: "Govt College for Women", category: "Harassment", content: "Street lights outside the college gate are broken, feels very unsafe in winter evenings.", upvotes: 210, downvotes: 0, userVote: 0, replies: [{author: "Rabia", text: "We need to sign a petition."}] },

            { id: 12, author: "Joshua", campus: "St. Patrick's College", category: "Infrastructure", content: "Sports ground needs leveling, three students tripped and got injured last week.", upvotes: 40, downvotes: 1, userVote: 0, replies: [] },
            { id: 13, author: "Hamid", campus: "Bahria College Karsaz", category: "Transport", content: "Morning drop-off lane gets completely blocked by VIP protocol cars. Kids are getting late.", upvotes: 130, downvotes: 5, userVote: 0, replies: [] },
            
            { id: 14, author: "Rizwan", campus: "Adamjee Science College", category: "Admin Delay", content: "Mark sheets distribution is a mess. Hundreds of students standing in one line.", upvotes: 85, downvotes: 2, userVote: 0, replies: [] },
            { id: 15, author: "Noman", campus: "DJ Sindh Govt Science College", category: "Infrastructure", content: "The library fans are making a horrible noise.", upvotes: 22, downvotes: 1, userVote: 0, replies: [] },

            // Schools
            { id: 6, author: "Parent_101", campus: "Karachi Grammar School", category: "Transport", content: "Traffic management outside the school gate during off-time is chaotic and dangerous for kids.", upvotes: 150, downvotes: 3, userVote: 0, replies: [] },
            { id: 66, author: "Alumni_Z", campus: "Karachi Grammar School", category: "Academics", content: "Alumni portal registration is throwing a 500 server error since Sunday.", upvotes: 34, downvotes: 0, userVote: 0, replies: [] },

            { id: 16, author: "Mrs. Khan", campus: "The City School Gulshan", category: "Infrastructure", content: "The water coolers on the 2nd floor are dispensing warm water.", upvotes: 45, downvotes: 0, userVote: 0, replies: [] },
            { id: 17, author: "Ali's Dad", campus: "Beaconhouse Clifton", category: "Admin Delay", content: "Fee vouchers were generated with the wrong tuition amount.", upvotes: 190, downvotes: 2, userVote: 0, replies: [{author: "Zain Mom", text: "Same here! They added an extra 5000."}] },
            { id: 18, author: "Student_Prefect", campus: "Foundation Public School", category: "Academics", content: "We need more updated books in the O-level library section.", upvotes: 60, downvotes: 0, userVote: 0, replies: [] },
            { id: 19, author: "Ammar", campus: "Happy Home School", category: "Transport", content: "The school vans are over-stuffing students. This violates safety protocols.", upvotes: 300, downvotes: 10, userVote: 0, replies: [] },
            { id: 20, author: "Samina", campus: "Bay View Academy", category: "Infrastructure", content: "The art room's AC is not working.", upvotes: 12, downvotes: 0, userVote: 0, replies: [] },
            { id: 21, author: "Farhan_Malir", campus: "Roots Millennium Malir", category: "Transport", content: "Can we get a crossing guard for the main road? It's too fast.", upvotes: 85, downvotes: 1, userVote: 0, replies: [] }
        ];

        const renderCivicFeed = () => {
            let currentCampus = civicCampusSelect.value;
            if (!currentCampus && civicCampusSelect.options.length > 0) {
                currentCampus = civicCampusSelect.options[0].value;
            }
            if (!currentCampus) return;
            
            const filteredPosts = civicPosts.filter(p => p.campus === currentCampus);
            
            if (filteredPosts.length === 0) {
                civicFeedContainer.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-muted); background: rgba(255,255,255,0.02); border-radius: 12px;">
                    <i class="fa-solid fa-check-circle" style="font-size: 2rem; color: var(--accent-mint); margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No issues reported for ${currentCampus} yet. Be the first to raise a voice!</p>
                </div>`;
                return;
            }

            civicFeedContainer.innerHTML = filteredPosts.map(post => `
                <div class="civic-post" data-id="${post.id}">
                    <div class="post-header">
                        <div class="post-author">
                            <div class="author-avatar">${post.author.charAt(0)}</div>
                            <div class="post-meta">
                                <h4>${post.author}</h4>
                                <span>${post.campus} • Just now</span>
                            </div>
                        </div>
                        <span class="post-tag ${post.category.split(' ')[0]}">${post.category}</span>
                    </div>
                    <div class="post-body">
                        <p>${post.content}</p>
                    </div>
                    <div class="post-actions">
                        <button class="action-btn upvote-btn ${post.userVote === 1 ? 'upvoted' : ''}" data-action="upvote">
                            <i class="fa-solid fa-circle-up"></i> <span class="up-count">${post.upvotes}</span>
                        </button>
                        <button class="action-btn downvote-btn ${post.userVote === -1 ? 'downvoted' : ''}" data-action="downvote">
                            <i class="fa-solid fa-circle-down"></i> <span class="down-count">${post.downvotes}</span>
                        </button>
                        <button class="action-btn reply-toggle-btn" data-action="reply">
                            <i class="fa-solid fa-comment"></i> ${post.replies.length} Replies
                        </button>
                    </div>
                    
                    <div class="replies-container" style="display: ${post.replies.length > 0 ? 'block' : 'none'};">
                        <div class="replies-list">
                            ${post.replies.map(reply => `
                                <div class="reply-item">
                                    <strong style="color: white; font-size: 0.9rem;">${reply.author}</strong>
                                    <p style="margin: 0.2rem 0 0 0; font-size: 0.9rem; color: var(--text-light);">${reply.text}</p>
                                </div>
                            `).join('')}
                        </div>
                        <div class="reply-input-wrap">
                            <input type="text" placeholder="Write a reply..." class="reply-input">
                            <button class="submit-reply-btn">Reply</button>
                        </div>
                    </div>
                </div>
            `).join('');
        };

        renderCivicFeed();

        // Handle New Report Submission
        civicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const campus = civicCampusSelect.value;
            const category = "General"; // Default category since dropdown was removed
            const desc = document.getElementById('civic-desc').value;

            if (!desc.trim()) return;

            const newPost = {
                id: Date.now(),
                author: "Anonymous Student", // Could be dynamic if we had auth
                campus: campus,
                category: category,
                content: desc,
                upvotes: 0,
                downvotes: 0,
                userVote: 0,
                replies: []
            };

            civicPosts.unshift(newPost);
            renderCivicFeed();
            civicForm.reset();
        });

        // Event Delegation for Upvote/Downvote/Reply
        civicFeedContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const postEl = btn.closest('.civic-post');
            const postId = parseInt(postEl.dataset.id);
            const post = civicPosts.find(p => p.id === postId);

            if (btn.dataset.action === 'upvote') {
                if (post.userVote === 1) {
                    post.upvotes--;
                    post.userVote = 0;
                } else {
                    if (post.userVote === -1) post.downvotes--;
                    post.upvotes++;
                    post.userVote = 1;
                }
                renderCivicFeed();
            } else if (btn.dataset.action === 'downvote') {
                if (post.userVote === -1) {
                    post.downvotes--;
                    post.userVote = 0;
                } else {
                    if (post.userVote === 1) post.upvotes--;
                    post.downvotes++;
                    post.userVote = -1;
                }
                renderCivicFeed();
            } else if (btn.dataset.action === 'reply') {
                const repliesContainer = postEl.querySelector('.replies-container');
                repliesContainer.style.display = repliesContainer.style.display === 'block' ? 'none' : 'block';
            } else if (btn.classList.contains('submit-reply-btn')) {
                const input = postEl.querySelector('.reply-input');
                const text = input.value.trim();
                if (text) {
                    post.replies.push({ author: "You", text: text });
                    renderCivicFeed();
                    // Reopen the replies container
                    const newPostEl = civicFeedContainer.querySelector(`.civic-post[data-id="${postId}"]`);
                    newPostEl.querySelector('.replies-container').style.display = 'block';
                }
            }
        });

        populateCivicCampusSelect();
        civicInstTypeSelect.addEventListener('change', populateCivicCampusSelect);
        civicCampusSelect.addEventListener('change', () => renderCivicFeed());
    }

});

// ── Mobile Hamburger Menu ──
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');

    if (navContainer && navLinks && !document.querySelector('.mobile-menu-btn')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Toggle menu');
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

        // Insert before nav-actions (right side)
        const navActions = navContainer.querySelector('.nav-actions');
        if (navActions) {
            navContainer.insertBefore(menuBtn, navActions);
        } else {
            navContainer.appendChild(menuBtn);
        }

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navContainer.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });

        // Close menu when resizing back to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    }
});
