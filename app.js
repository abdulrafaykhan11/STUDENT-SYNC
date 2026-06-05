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
        return;
    }

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
    updateDisplay();
});
