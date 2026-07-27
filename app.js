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
        },
        city: {
            title: 'Build a Karachi arrival plan before moving',
            copy: 'City Guide helps out-station students choose a campus corridor, estimate rent and mess costs, shortlist safer areas, and prepare a first-week checklist.',
            metrics: ['13 campuses synced', '6 move-in checks']
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
        nust: { name: 'NUST PNEC Karachi', type: 'university', area: 'pechs', kmExtra: 1.6, signal: 'Karsaz / Shahrah-e-Faisal corridor' },
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
            nust: { km: 14.9, congestion: 18, transfers: 1, walk: 9, seats: 3, shuttleEta: 17 },
            dhaus: { km: 19.5, congestion: 21, transfers: 2, walk: 12, seats: 1, shuttleEta: 24 }
        },
        north_nazimabad: {
            ned: { km: 12.6, congestion: 16, transfers: 1, walk: 8, seats: 3, shuttleEta: 15 },
            ku: { km: 13.9, congestion: 17, transfers: 1, walk: 9, seats: 3, shuttleEta: 16 },
            fast: { km: 20.4, congestion: 24, transfers: 2, walk: 12, seats: 2, shuttleEta: 23 },
            iba: { km: 14.3, congestion: 18, transfers: 1, walk: 10, seats: 2, shuttleEta: 17 },
            nust: { km: 16.8, congestion: 20, transfers: 1, walk: 10, seats: 2, shuttleEta: 20 },
            dhaus: { km: 25.7, congestion: 29, transfers: 2, walk: 14, seats: 1, shuttleEta: 27 }
        },
        pechs: {
            ned: { km: 11.7, congestion: 15, transfers: 1, walk: 7, seats: 4, shuttleEta: 13 },
            ku: { km: 12.8, congestion: 16, transfers: 1, walk: 8, seats: 4, shuttleEta: 14 },
            fast: { km: 8.5, congestion: 12, transfers: 0, walk: 6, seats: 3, shuttleEta: 12 },
            iba: { km: 13.5, congestion: 17, transfers: 1, walk: 9, seats: 2, shuttleEta: 16 },
            nust: { km: 6.1, congestion: 10, transfers: 0, walk: 6, seats: 4, shuttleEta: 10 },
            dhaus: { km: 15.9, congestion: 19, transfers: 1, walk: 10, seats: 2, shuttleEta: 19 }
        },
        clifton: {
            ned: { km: 22.1, congestion: 26, transfers: 2, walk: 12, seats: 2, shuttleEta: 25 },
            ku: { km: 23.4, congestion: 28, transfers: 2, walk: 13, seats: 2, shuttleEta: 26 },
            fast: { km: 14.6, congestion: 18, transfers: 1, walk: 9, seats: 3, shuttleEta: 18 },
            iba: { km: 24.0, congestion: 29, transfers: 2, walk: 14, seats: 1, shuttleEta: 28 },
            nust: { km: 18.1, congestion: 22, transfers: 1, walk: 10, seats: 2, shuttleEta: 21 },
            dhaus: { km: 9.8, congestion: 13, transfers: 0, walk: 7, seats: 4, shuttleEta: 12 }
        },
        malir: {
            ned: { km: 13.2, congestion: 16, transfers: 1, walk: 8, seats: 4, shuttleEta: 14 },
            ku: { km: 14.4, congestion: 17, transfers: 1, walk: 9, seats: 5, shuttleEta: 15 },
            fast: { km: 16.7, congestion: 20, transfers: 1, walk: 10, seats: 2, shuttleEta: 20 },
            iba: { km: 15.1, congestion: 18, transfers: 1, walk: 8, seats: 3, shuttleEta: 17 },
            nust: { km: 13.9, congestion: 17, transfers: 1, walk: 9, seats: 3, shuttleEta: 16 },
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

    const buildServiceDetails = (route, originKey, inst) => {
        const origin = areaLabels[originKey] || areaLabels.gulshan;
        const campus = inst.name;
        const campusArea = areaLabels[inst.area] || campus;
        const pickupAddress = `${origin}, Karachi`;
        const dropAddress = `${campus}, Karachi`;
        const busRoutes = {
            gulshan: {
                operator: 'Red Bus / W-11 connector',
                number: 'Red Bus RB-3 + W-11',
                stop: 'NIPA / University Road stop',
                via: 'NIPA -> Civic Center -> Hassan Square -> Stadium Road / Karsaz link',
                time: 'Every 12-18 min, 7:00 AM-9:30 AM',
                helpline: '021-111-743-873'
            },
            north_nazimabad: {
                operator: 'Green Line + W-23 feeder',
                number: 'Green Line GL-1 + W-23',
                stop: 'Hyderi Market / Green Line station',
                via: 'Hyderi -> Nazimabad -> Numaish -> MA Jinnah Road connector',
                time: 'Every 10-15 min on Green Line, feeder every 18-25 min',
                helpline: '021-111-743-873'
            },
            pechs: {
                operator: 'Red Bus / Khan Coach',
                number: 'Red Bus RB-2 or Khan Coach 4K',
                stop: 'Nursery / PECHS stop',
                via: 'Nursery -> Shahrah-e-Faisal -> Karsaz -> Drigh Road link',
                time: 'Every 10-16 min, 7:00 AM-10:00 AM',
                helpline: '021-111-743-873'
            },
            clifton: {
                operator: 'Red Bus / W-23',
                number: 'Red Bus RB-1 + W-23',
                stop: 'Teen Talwar / Clifton stop',
                via: 'Teen Talwar -> Metropole -> FTC -> Shahrah-e-Faisal',
                time: 'Every 20-30 min, 7:30 AM-9:30 AM',
                helpline: '021-111-743-873'
            },
            malir: {
                operator: 'Khan Coach / W-11',
                number: 'Khan Coach M-9 or W-11',
                stop: 'Malir Halt stop',
                via: 'Malir Halt -> Drigh Road -> Karsaz -> University Road connector',
                time: 'Every 15-22 min, 7:00 AM-9:30 AM',
                helpline: '021-111-743-873'
            }
        };
        const campusStops = {
            gulshan: 'University Road campus-side stop',
            north_nazimabad: 'Board Office / Nazimabad connector stop',
            pechs: 'Karsaz / Shahrah-e-Faisal campus-side stop',
            clifton: 'Clifton / DHA campus-side stop',
            malir: 'Malir Halt / Model Colony campus-side stop'
        };
        const carpoolDrivers = {
            gulshan: { name: 'Ahsan Khan', phone: '+92 3455678278', car: 'Suzuki Bolan', plate: 'BKK-241', pickup: 'NIPA / Maskan pickup' },
            north_nazimabad: { name: 'Haris Sheikh', phone: '+92 3425578278', car: 'Toyota Coaster', plate: 'BNC-778', pickup: 'Hyderi / Five Star pickup' },
            pechs: { name: 'Maha Raza', phone: '+92 45558378278', car: 'Suzuki Every', plate: 'BHG-512', pickup: 'Nursery / Tariq Road pickup' },
            clifton: { name: 'Sameer Ali', phone: '+92 3145986009', car: 'Toyota Hiace', plate: 'BCQ-909', pickup: 'Teen Talwar pickup' },
            malir: { name: 'Danish Ahmed', phone: '+92 3175860986', car: 'Nissan Carvan', plate: 'BKL-640', pickup: 'Malir Halt pickup' }
        };
        const bus = busRoutes[originKey] || busRoutes.gulshan;
        const driver = carpoolDrivers[originKey] || carpoolDrivers.gulshan;
        const dropStop = campusStops[inst.area] || `${campusArea} stop`;
        const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(pickupAddress)}&dropoff[formatted_address]=${encodeURIComponent(dropAddress)}&dropoff[nickname]=${encodeURIComponent(campus)}`;

        return {
            ride: {
                title: 'Ride app pickup',
                route: 'Door pickup to campus gate',
                pickup: `${origin} - choose your exact pickup pin`,
                drop: `${campus} main gate / nearest safe drop-off`,
                schedule: 'Best for urgent trips; avoid peak surge if fare is high.',
                apps: [
                    { name: 'Uber - book this route', url: uberUrl },
                    { name: 'Careem', url: 'https://www.careem.com/' },
                    { name: 'Yango', url: 'https://yango.com/' }
                ]
            },
            bus: {
                title: 'Public bus plan',
                route: `${bus.operator} (${bus.number})`,
                pickup: bus.stop,
                drop: `${dropStop}, then ${route.walk} min walk to ${campus}`,
                schedule: `${bus.time}. Via: ${bus.via}`,
                contact: `Transit helpline: ${bus.helpline}`,
                apps: []
            },
            carpool: {
                title: 'Student carpool plan',
                route: `${driver.name} - ${driver.car} (${driver.plate})`,
                pickup: driver.pickup,
                drop: `${campus} campus gate`,
                schedule: `${route.seats} verified seat${route.seats === 1 ? '' : 's'} available. Confirm 30-45 min before class.`,
                contact: `driver number: ${driver.phone}`,
                apps: [
                    { name: 'Call driver', url: `tel:${driver.phone.replace(/\s/g, '')}` },
                    { name: 'WhatsApp driver', url: `https://wa.me/${driver.phone.replace(/\D/g, '')}` }
                ]
            },
            shuttle: {
                title: 'Campus shuttle / point plan',
                route: `${campus} point / shuttle corridor`,
                pickup: `${origin} student pickup point`,
                drop: `${campus} official point drop-off`,
                schedule: `Next estimated pickup in ${route.shuttleEta} min; morning window 7:00 AM-9:00 AM.`,
                apps: []
            }
        };
    };

    const buildOptions = (route, originKey, inst) => {
        const km = route.km;
        const rideBase = Math.round(150 + (km * 33) + route.congestion);
        const rideCost = Math.round(rideBase * (route.congestion > 22 ? 1.38 : route.congestion > 16 ? 1.24 : 1.12));
        const busCost = Math.round(55 + (route.transfers * 45) + (km > 18 ? 35 : 0));
        const carpoolCost = Math.round(95 + (km * 15) + Math.max(0, 5 - route.seats) * 12);
        const shuttleCost = Math.round(80 + (km > 15 ? 35 : 0) + (route.shuttleEta > 22 ? 20 : 0));
        const serviceDetails = buildServiceDetails(route, originKey, inst);

        return {
            ride: {
                cost: rideCost,
                oldCost: rideBase,
                time: Math.round(16 + (km * 1.75) + (route.congestion * 0.45)),
                reliability: route.congestion > 24 ? 72 : 84,
                detail: 'Fastest solo option, but peak pricing is active.',
                service: serviceDetails.ride
            },
            bus: {
                cost: busCost,
                time: Math.round(24 + (km * 2.35) + (route.transfers * 11) + route.walk),
                reliability: route.transfers > 1 ? 69 : 77,
                detail: `${route.transfers} transfer${route.transfers === 1 ? '' : 's'} and ${route.walk} min walk.`,
                service: serviceDetails.bus
            },
            carpool: {
                cost: carpoolCost,
                time: Math.round(20 + (km * 1.85) + (route.congestion * 0.35)),
                reliability: route.seats > 2 ? 91 : 82,
                detail: `${route.seats} verified seat${route.seats === 1 ? '' : 's'} near your area.`,
                service: serviceDetails.carpool
            },
            shuttle: {
                cost: shuttleCost,
                time: Math.round(route.shuttleEta + 20 + (km * 2.05)),
                reliability: route.shuttleEta > 24 ? 76 : 88,
                detail: `Next pickup in ${route.shuttleEta} min.`,
                service: serviceDetails.shuttle
            }
        };
    };

    const getRoutePlan = (originKey, destKey) => {
        const route = computeRouteMetrics(originKey, destKey);
        const inst = institutions[destKey];
        if (!route || !inst) return null;

        const options = buildOptions(route, originKey, inst);
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
        const service = selected.service || {};
        const serviceApps = service.apps?.length
            ? `<div class="calc-ride-apps">${service.apps.map(app => `<a href="${app.url}" target="_blank" rel="noopener">${app.name} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`).join('')}</div>`
            : '';
        const serviceContact = service.contact
            ? `<p class="calc-service-contact"><i class="fa-solid fa-phone"></i> ${service.contact}</p>`
            : '';

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
                    <p>${plan.originLabel} to ${plan.campusLabel}</p>
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

            <div class="calc-service-card">
                <div class="calc-service-title">
                    <i class="fa-solid ${meta.icon}"></i>
                    <div>
                        <span>${service.title || meta.label}</span>
                        <strong>${service.route || selected.detail}</strong>
                    </div>
                </div>
                <div class="calc-service-grid">
                    <div><span>Pickup</span><strong>${service.pickup || plan.originLabel}</strong></div>
                    <div><span>Drop-off</span><strong>${service.drop || plan.campusLabel}</strong></div>
                    <div><span>Time / frequency</span><strong>${service.schedule || selected.detail}</strong></div>
                </div>
                ${serviceContact}
                ${serviceApps}
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
                const preferredCampus = localStorage.getItem('studentSync_lastComplaintCampus');
                civicCampusSelect.value = availableCampuses.some(([, inst]) => inst.name === preferredCampus)
                    ? preferredCampus
                    : availableCampuses[0][1].name;
            }
            
            // Re-render feed when campus options change
            if (typeof renderCivicFeed === 'function') {
                renderCivicFeed();
            }
        };

        let defaultCivicPosts = [
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

        const readSavedCivicPosts = () => {
            try {
                const saved = JSON.parse(localStorage.getItem('studentSync_civicPosts') || '[]');
                return Array.isArray(saved) ? saved : [];
            } catch (error) {
                return [];
            }
        };

        const mergeCivicPosts = savedPosts => {
            const savedIds = new Set(savedPosts.map(post => post.id));
            return [
                ...savedPosts,
                ...defaultCivicPosts.filter(post => !savedIds.has(post.id))
            ];
        };

        let civicPosts = mergeCivicPosts(readSavedCivicPosts());

        const saveCivicPosts = () => {
            localStorage.setItem('studentSync_civicPosts', JSON.stringify(civicPosts));
        };

        const emergencyAreaPlans = {
            gulshan: {
                exits: ['Main University Road gate', 'Admin block side exit', 'Library / parking side route'],
                assembly: 'Main ground or open parking away from boundary walls',
                security: 'Main gate security desk',
                medical: 'Student clinic / admin first-aid room',
                safePoint: 'NIPA / University Road public pickup point',
                notes: ['Avoid crowding at the main gate during panic.', 'Use open ground if smoke, fire, or building damage is visible.']
            },
            north_nazimabad: {
                exits: ['Main road gate', 'Back service lane exit', 'Auditorium / ground side route'],
                assembly: 'Open ground near admin block',
                security: 'Reception security counter',
                medical: 'First-aid room near admin office',
                safePoint: 'Hyderi / Five Star main road pickup point',
                notes: ['Keep students away from narrow staircases.', 'Use Green Line / main road side only after staff clearance.']
            },
            pechs: {
                exits: ['Main Karsaz / PECHS gate', 'Service lane exit', 'Cafeteria / parking side route'],
                assembly: 'Open parking or sports court',
                security: 'Main gate guard room',
                medical: 'Admin medical desk / nearby clinic reference',
                safePoint: 'Nursery, Karsaz, or Bahadurabad main road pickup',
                notes: ['Avoid Shahrah-e-Faisal rush-side crossing during evacuation.', 'Move toward open parking before calling family.']
            },
            clifton: {
                exits: ['Main Clifton / DHA gate', 'Side lane exit', 'Basement parking ramp only if clear'],
                assembly: 'Open courtyard or front parking away from glass',
                security: 'Reception / gate security desk',
                medical: 'Student affairs first-aid counter',
                safePoint: 'Main Clifton / DHA road pickup bay',
                notes: ['Avoid elevators in fire or power failure.', 'Use marked staircases and stay away from glass fronts.']
            },
            malir: {
                exits: ['Main Malir gate', 'Transport yard exit', 'Playground side route'],
                assembly: 'Playground / open transport yard',
                security: 'Gate security booth',
                medical: 'Admin first-aid room',
                safePoint: 'Malir Halt / Model Colony main road pickup',
                notes: ['Do not wait near school vans during fire or fuel smell.', 'Use open ground before moving to roadside pickup.']
            }
        };

        const emergencyTypeSteps = {
            university: ['Alert class representative and floor marshal.', 'Move through nearest staircase, not elevators.', 'Report missing classmates at assembly point.'],
            college: ['Inform admin office or lab in-charge immediately.', 'Exit labs carefully and leave bags behind if needed.', 'Gather by department/class section.'],
            school: ['Teacher leads the line; students do not run.', 'Parents/guardians wait at pickup point until release.', 'Report any missing child to admin desk first.']
        };

        const emergencyContacts = {
            university: { security: '+92 300 712 6041', admin: '+92 321 640 1187', medical: '+92 333 508 9274' },
            college: { security: '+92 300 816 4420', admin: '+92 321 775 3096', medical: '+92 333 604 1287' },
            school: { security: '+92 300 549 7316', admin: '+92 321 482 6075', medical: '+92 333 915 2408' }
        };

        const emergencyIconCards = plan => [
            ['fa-door-open', 'Emergency Exits', plan.exits],
            ['fa-people-arrows', 'Assembly Point', [plan.assembly]],
            ['fa-shield-halved', 'Security Desk', [plan.security, `Security: ${plan.contacts.security}`, `Admin: ${plan.contacts.admin}`]],
            ['fa-kit-medical', 'Medical Help', [plan.medical, `Medical desk: ${plan.contacts.medical}`]],
            ['fa-location-dot', 'Safe Pickup Point', [plan.safePoint]],
            ['fa-list-check', 'Immediate Steps', [...plan.steps, ...plan.notes]]
        ];

        const buildEmergencyPlan = inst => {
            const areaPlan = emergencyAreaPlans[inst.area] || emergencyAreaPlans.gulshan;
            return {
                ...areaPlan,
                contacts: emergencyContacts[inst.type] || emergencyContacts.university,
                steps: emergencyTypeSteps[inst.type] || emergencyTypeSteps.university
            };
        };

        const initEmergencyDirectory = () => {
            const emergencyTypeSelect = document.getElementById('emergency-inst-type');
            const emergencyCampusSelect = document.getElementById('emergency-campus');
            const emergencyGrid = document.getElementById('emergency-grid');
            const emergencyReportBtn = document.getElementById('emergency-report-btn');
            const emergencyMapLink = document.getElementById('emergency-map-link');
            if (!emergencyTypeSelect || !emergencyCampusSelect || !emergencyGrid) return;

            const populateEmergencyCampus = () => {
                const type = emergencyTypeSelect.value;
                const entries = Object.entries(institutions).filter(([, inst]) => inst.type === type);
                emergencyCampusSelect.innerHTML = entries.map(([key, inst]) => `<option value="${key}">${inst.name}</option>`).join('');
                if (entries.length) emergencyCampusSelect.value = entries[0][0];
                renderEmergencyPlan();
            };

            const renderEmergencyPlan = () => {
                const instKey = emergencyCampusSelect.value;
                const inst = institutions[instKey];
                if (!inst) return;
                const plan = buildEmergencyPlan(inst);
                emergencyGrid.innerHTML = emergencyIconCards(plan).map(([icon, title, items]) => `
                    <article class="emergency-card">
                        <h3><i class="fa-solid ${icon}"></i>${title}</h3>
                        <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
                    </article>
                `).join('');
                if (emergencyMapLink) {
                    emergencyMapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${inst.name} Karachi`)}`;
                }
            };

            emergencyTypeSelect.addEventListener('change', populateEmergencyCampus);
            emergencyCampusSelect.addEventListener('change', renderEmergencyPlan);

            if (emergencyReportBtn) {
                emergencyReportBtn.addEventListener('click', () => {
                    const inst = institutions[emergencyCampusSelect.value];
                    if (!inst) return;
                    civicInstTypeSelect.value = inst.type;
                    populateCivicCampusSelect();
                    civicCampusSelect.value = inst.name;
                    document.getElementById('civic-desc').value = `URGENT SAFETY REPORT: ${inst.name} me emergency/safety issue hai. Location: ______. Problem type: fire / medical / harassment / violence / unsafe exit / building damage. Students impacted: ______. Immediate help required.`;
                    civicForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    document.getElementById('civic-desc').focus();
                });
            }

            populateEmergencyCampus();
        };


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
                                <span>${post.campus} - Just now</span>
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
            saveCivicPosts();
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
                saveCivicPosts();
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
                saveCivicPosts();
                renderCivicFeed();
            } else if (btn.dataset.action === 'reply') {
                const repliesContainer = postEl.querySelector('.replies-container');
                repliesContainer.style.display = repliesContainer.style.display === 'block' ? 'none' : 'block';
            } else if (btn.classList.contains('submit-reply-btn')) {
                const input = postEl.querySelector('.reply-input');
                const text = input.value.trim();
                if (text) {
                    post.replies.push({ author: "You", text: text });
                    saveCivicPosts();
                    renderCivicFeed();
                    // Reopen the replies container
                    const newPostEl = civicFeedContainer.querySelector(`.civic-post[data-id="${postId}"]`);
                    newPostEl.querySelector('.replies-container').style.display = 'block';
                }
            }
        });

        populateCivicCampusSelect();
        initEmergencyDirectory();
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
