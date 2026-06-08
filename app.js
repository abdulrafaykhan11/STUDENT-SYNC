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
    const calcRecommendation = document.getElementById('calc-recommendation');
    const originSelect = document.getElementById('origin-select');
    const destSelect = document.getElementById('dest-select');

    // Dynamic Destinations
    const destinations = {
        school: [
            { value: 'kgs', label: 'KGS (Karachi Grammar)' },
            { value: 'city_school', label: 'The City School' },
            { value: 'beaconhouse', label: 'Beaconhouse System' },
            { value: 'bay_view', label: 'Bay View Academy' },
            { value: 'habib', label: 'Habib Public School' }
        ],
        college: [
            { value: 'adamjee', label: 'Adamjee Govt Science' },
            { value: 'dj_science', label: 'DJ Sindh Govt' },
            { value: 'pechs', label: 'BAMM PECHS Govt' },
            { value: 'st_patricks', label: 'St. Patrick\'s College' },
            { value: 'bahria', label: 'Bahria College Karsaz' }
        ],
        university: [
            { value: 'ned', label: 'NED University' },
            { value: 'ku', label: 'Karachi University (KU)' },
            { value: 'fast', label: 'FAST NUCES' },
            { value: 'iba', label: 'IBA' },
            { value: 'dawood', label: 'Dawood University' }
        ]
    };

    if (originSelect && destSelect) {
        originSelect.addEventListener('change', () => {
            const type = originSelect.value; // Origin select is now "Institution Type"
            if (destinations[type]) {
                destSelect.innerHTML = '';
                destinations[type].forEach(inst => {
                    const option = document.createElement('option');
                    option.value = inst.value;
                    option.textContent = inst.label;
                    option.style.background = 'var(--bg-dark)';
                    option.style.color = 'white';
                    destSelect.appendChild(option);
                });
            }
            updateCalculator();
        });
        
        destSelect.addEventListener('change', updateCalculator);
    }

    // Dynamic Rate Logic
    const getRates = (type, dest) => {
        // Mock distance multipliers based on dest length to create variations
        let distanceMultiplier = 1.0 + (dest.length * 0.05);
        if (type === 'university') distanceMultiplier += 0.5;
        if (type === 'school') distanceMultiplier -= 0.2;

        const baseRide = Math.floor(400 * distanceMultiplier);
        const surgeRide = Math.floor(baseRide * 1.5);
        const baseBus = Math.floor(60 * distanceMultiplier);
        const baseCarpool = Math.floor(100 * distanceMultiplier);

        const timeRide = Math.floor(20 * distanceMultiplier);
        const timeBus = Math.floor(50 * distanceMultiplier);
        const timeCarpool = Math.floor(25 * distanceMultiplier);

        return {
            ride: {
                html: `
                    <div class="calc-icon" style="font-size: 3rem; color: #ff5252; margin-bottom: 1rem;"><i class="fa-solid fa-taxi"></i></div>
                    <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Rs ${surgeRide} <span style="font-size: 1rem; color: var(--text-muted); text-decoration: line-through;">Rs ${baseRide}</span></h3>
                    <div class="badge" style="background: rgba(255, 82, 82, 0.1); color: #ff5252; border-color: rgba(255, 82, 82, 0.3);"><i class="fa-solid fa-arrow-trend-up"></i> Surge Pricing Active</div>
                    <p style="color: var(--text-muted); margin-top: 1rem; font-size: 0.9rem;">Est. Time: ${timeRide} mins</p>
                `,
                recommendation: '<span style="color: #ff5252; font-weight: 600; font-size: 0.95rem;">Expensive for daily use - best for emergencies.</span>'
            },
            bus: {
                html: `
                    <div class="calc-icon" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1rem;"><i class="fa-solid fa-bus"></i></div>
                    <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Rs ${baseBus}</h3>
                    <div class="badge" style="background: rgba(255, 189, 46, 0.1); color: var(--accent-gold); border-color: rgba(255, 189, 46, 0.3);"><i class="fa-solid fa-person-walking"></i> Requires 10m walk</div>
                    <p style="color: var(--text-muted); margin-top: 1rem; font-size: 0.9rem;">Est. Time: ${timeBus} mins (with transfers)</p>
                `,
                recommendation: '<span style="color: var(--accent-gold); font-weight: 600; font-size: 0.95rem;">Cheapest, but takes longest.</span>'
            },
            carpool: {
                html: `
                    <div class="calc-icon" style="font-size: 3rem; color: var(--accent-mint); margin-bottom: 1rem;"><i class="fa-solid fa-car"></i></div>
                    <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem;">Rs ${baseCarpool}</h3>
                    <div class="badge" style="background: rgba(0, 209, 178, 0.1); color: var(--accent-mint); border-color: rgba(0, 209, 178, 0.3);"><i class="fa-solid fa-check-circle"></i> Verified Matches</div>
                    <p style="color: var(--text-muted); margin-top: 1rem; font-size: 0.9rem;">Est. Time: ${timeCarpool} mins (Direct Route)</p>
                `,
                recommendation: '<span style="color: var(--accent-mint); font-weight: 600; font-size: 0.95rem;"><i class="fa-solid fa-star"></i> StudentSync Recommended</span>'
            }
        };
    };

    const updateCalculator = () => {
        if (!calcContent || !originSelect || !destSelect) return;
        
        const activeTab = document.querySelector('.calc-tab.active');
        const mode = activeTab ? activeTab.dataset.mode : 'ride';
        const type = originSelect.value;
        const dest = destSelect.value;
        
        const rates = getRates(type, dest);

        // Animate out
        calcContent.style.opacity = 0;
        calcContent.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            calcContent.innerHTML = rates[mode].html;
            calcRecommendation.innerHTML = rates[mode].recommendation;
            
            // Animate in
            calcContent.style.transition = 'all 0.3s ease';
            calcContent.style.opacity = 1;
            calcContent.style.transform = 'translateY(0)';
        }, 300);
    };

    if (calcTabs.length && calcContent) {
        calcTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                calcTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                updateCalculator();
            });
        });
    }

    if (originSelect && destSelect) {
        // Trigger initial populate
        originSelect.dispatchEvent(new Event('change'));
    }
});
