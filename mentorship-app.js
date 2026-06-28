document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const createIcon = className => {
        const icon = document.createElement('i');
        icon.className = className;
        icon.setAttribute('aria-hidden', 'true');
        return icon;
    };

    const setButton = (button, iconClass, label) => {
        if (!button) return;
        button.replaceChildren(createIcon(iconClass), document.createTextNode(` ${label}`));
    };

    const formatDate = date => date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    /* =========================================
       Feature 1: Mentor Matcher
       ========================================= */
    const btnFindMatch = document.getElementById('btn-find-match');
    const matchIndustry = document.getElementById('match-industry');
    const matchGoal = document.getElementById('match-goal');
    const matchStyle = document.getElementById('match-style');
    const matchLoader = document.getElementById('match-loader');
    const mentorCard = document.getElementById('mentor-card');
    const mentorName = document.getElementById('mentor-name');
    const mentorRole = document.getElementById('mentor-role');
    const mentorMeta = document.getElementById('mentor-meta');
    const mentorEmailText = document.getElementById('mentor-email-text');

    const mentorDB = {
        tech: [
            { name: 'Sarah Ahmed', email: 'sarah.ahmed@alumni.studentsync.pk', role: 'Senior Software Engineer @ Google', grad: '2019', style: 'direct', goals: ['interview', 'internship'], note: 'Strong for DSA, system design, and technical interview prep.' },
            { name: 'Hamza Rafiq', email: 'hamza.rafiq@alumni.studentsync.pk', role: 'Full Stack Lead @ Careem', grad: '2020', style: 'casual', goals: ['resume', 'networking'], note: 'Best for portfolio reviews and startup-style career planning.' }
        ],
        finance: [
            { name: 'Ali Khan', email: 'ali.khan@alumni.studentsync.pk', role: 'Investment Analyst @ JP Morgan', grad: '2018', style: 'direct', goals: ['internship', 'interview'], note: 'Great for finance internship pipelines and case interview prep.' },
            { name: 'Mariam Siddiqui', email: 'mariam.siddiqui@alumni.studentsync.pk', role: 'Audit Manager @ KPMG', grad: '2017', style: 'casual', goals: ['resume', 'networking'], note: 'Helpful for accounting CVs, certifications, and first job strategy.' }
        ],
        marketing: [
            { name: 'Zainab Qureshi', email: 'zainab.qureshi@alumni.studentsync.pk', role: 'Growth Lead @ TikTok', grad: '2021', style: 'casual', goals: ['networking', 'resume'], note: 'Sharp on campaigns, personal branding, and growth portfolios.' },
            { name: 'Daniyal Mir', email: 'daniyal.mir@alumni.studentsync.pk', role: 'Brand Strategist @ Unilever', grad: '2019', style: 'direct', goals: ['internship', 'interview'], note: 'Useful for brand cases, presentation prep, and FMCG applications.' }
        ],
        engineering: [
            { name: 'Omer Tariq', email: 'omer.tariq@alumni.studentsync.pk', role: 'Structural Engineer @ Emaar', grad: '2016', style: 'direct', goals: ['internship', 'resume'], note: 'Strong for site internships, project portfolios, and technical CVs.' },
            { name: 'Hira Nadeem', email: 'hira.nadeem@alumni.studentsync.pk', role: 'Project Engineer @ K-Electric', grad: '2018', style: 'casual', goals: ['networking', 'interview'], note: 'Best for field engineering, operations, and interview confidence.' }
        ]
    };

    let currentMentor = null;

    const scoreMentor = mentor => {
        let score = 88;
        if (mentor.style === matchStyle?.value) score += 5;
        if (mentor.goals.includes(matchGoal?.value)) score += 7;
        return Math.min(score, 99);
    };

    const renderMentor = mentor => {
        currentMentor = mentor;
        if (mentorName) mentorName.textContent = mentor.name;
        if (mentorRole) mentorRole.textContent = mentor.role;
        if (mentorMeta) mentorMeta.textContent = `${scoreMentor(mentor)}% Match | Graduated ${mentor.grad}`;
        if (mentorEmailText) mentorEmailText.textContent = mentor.email;
    };

    if (btnFindMatch && matchIndustry && matchLoader && mentorCard) {
        btnFindMatch.addEventListener('click', () => {
            mentorCard.classList.remove('active');
            matchLoader.classList.add('active');
            btnFindMatch.disabled = true;
            setButton(btnFindMatch, 'fa-solid fa-spinner fa-spin', 'Matching...');

            setTimeout(() => {
                const candidates = mentorDB[matchIndustry.value] || mentorDB.tech;
                const mentor = candidates
                    .slice()
                    .sort((a, b) => scoreMentor(b) - scoreMentor(a))[0];

                renderMentor(mentor);
                matchLoader.classList.remove('active');
                mentorCard.classList.add('active');
                btnFindMatch.disabled = false;
                setButton(btnFindMatch, 'fa-solid fa-radar', 'Find My Match');
            }, 650);
        });
    }

    /* =========================================
       Feature 2: Calendar Booking
       ========================================= */
    const calGrid = document.getElementById('cal-grid');
    const calMonth = document.getElementById('cal-month');
    const calPrev = document.getElementById('cal-prev');
    const calNext = document.getElementById('cal-next');
    const timeSlots = document.querySelectorAll('.time-slot');
    const selectedDateText = document.getElementById('selected-date-text');
    const bookingDetails = document.getElementById('booking-details');
    const confirmDate = document.getElementById('confirm-date');
    const confirmTime = document.getElementById('confirm-time');
    const btnConfirmBook = document.getElementById('btn-confirm-book');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let calendarDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let chosenDate = null;
    let chosenTime = null;

    const renderBookingDetails = () => {
        if (!bookingDetails || !confirmDate || !confirmTime) return;

        if (chosenDate && chosenTime) {
            confirmDate.textContent = formatDate(chosenDate);
            confirmTime.textContent = chosenTime;
            bookingDetails.classList.add('active');
        } else {
            bookingDetails.classList.remove('active');
        }
    };

    const selectDate = date => {
        chosenDate = date;
        if (selectedDateText) selectedDateText.textContent = formatDate(date);
        calGrid?.querySelectorAll('.cal-day').forEach(day => day.classList.remove('active'));
        calGrid?.querySelector(`[data-date="${date.toISOString()}"]`)?.classList.add('active');
        renderBookingDetails();
    };

    const renderCalendar = () => {
        if (!calGrid || !calMonth) return;

        calGrid.replaceChildren();
        calMonth.textContent = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].forEach(day => {
            const div = document.createElement('div');
            div.className = 'cal-day-name';
            div.textContent = day;
            calGrid.appendChild(div);
        });

        const firstDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();

        for (let i = 0; i < firstDay; i += 1) {
            const empty = document.createElement('div');
            empty.className = 'cal-day empty';
            calGrid.appendChild(empty);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'cal-day';
            button.textContent = String(day);
            button.dataset.date = date.toISOString();

            const isPast = date < today;
            const isWeekend = date.getDay() === 0;
            if (isPast || isWeekend) {
                button.classList.add('disabled');
                button.disabled = true;
            } else {
                button.addEventListener('click', () => selectDate(date));
            }

            if (chosenDate && date.toDateString() === chosenDate.toDateString()) {
                button.classList.add('active');
            }

            calGrid.appendChild(button);
        }
    };

    if (calGrid) {
        renderCalendar();

        calPrev?.addEventListener('click', () => {
            calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
            renderCalendar();
        });

        calNext?.addEventListener('click', () => {
            calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
            renderCalendar();
        });

        timeSlots.forEach(slot => {
            slot.setAttribute('role', 'button');
            slot.tabIndex = 0;
            const chooseSlot = () => {
                timeSlots.forEach(item => item.classList.remove('active'));
                slot.classList.add('active');
                chosenTime = slot.dataset.time;
                renderBookingDetails();
            };
            slot.addEventListener('click', chooseSlot);
            slot.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    chooseSlot();
                }
            });
        });

        btnConfirmBook?.addEventListener('click', () => {
            if (!chosenDate || !chosenTime) {
                alert('Please select a date and time first.');
                return;
            }

            setButton(btnConfirmBook, 'fa-solid fa-check', 'Session Booked');
            btnConfirmBook.classList.add('confirmed');
            alert(`Meeting booked for ${formatDate(chosenDate)} at ${chosenTime} PKT.`);
        });
    }

    /* =========================================
       Feature 3: Career Roadmap
       ========================================= */
    const roadmapSelect = document.getElementById('roadmap-select');
    const btnGenRoadmap = document.getElementById('btn-generate-roadmap');
    const timelineContainer = document.getElementById('timeline-container');

    const roadmaps = {
        swe: [
            { year: 'Semester 1-2', title: 'Programming Core', desc: 'Master programming fundamentals, Git, and problem-solving with small console projects.' },
            { year: 'Semester 3-4', title: 'Build Real Apps', desc: 'Learn web development, databases, APIs, and publish two portfolio projects.' },
            { year: 'Semester 5-6', title: 'Internship Readiness', desc: 'Practice DSA, mock interviews, and apply to internships with a polished GitHub profile.' },
            { year: 'Final Year', title: 'Specialize', desc: 'Choose backend, frontend, mobile, AI, or cloud and ship a capstone with measurable impact.' }
        ],
        data: [
            { year: 'Semester 1-2', title: 'Math + Python', desc: 'Strengthen statistics, Python, spreadsheets, and data cleaning basics.' },
            { year: 'Semester 3-4', title: 'Analytics Stack', desc: 'Learn SQL, dashboards, exploratory analysis, and business storytelling.' },
            { year: 'Semester 5-6', title: 'Machine Learning', desc: 'Practice supervised learning, model evaluation, and Kaggle-style case studies.' },
            { year: 'Final Year', title: 'Portfolio Proof', desc: 'Publish notebooks, dashboards, and one end-to-end data product.' }
        ],
        pm: [
            { year: 'Semester 1-2', title: 'Product Sense', desc: 'Study user problems, market research, and the software development lifecycle.' },
            { year: 'Semester 3-4', title: 'Design + Delivery', desc: 'Learn wireframing, user stories, metrics, and agile collaboration.' },
            { year: 'Semester 5-6', title: 'Leadership Evidence', desc: 'Lead a campus project, document decisions, and measure outcomes.' },
            { year: 'Final Year', title: 'APM Prep', desc: 'Practice product cases, stakeholder communication, and launch a portfolio case study.' }
        ]
    };

    const renderRoadmap = key => {
        if (!timelineContainer) return;
        timelineContainer.replaceChildren();

        const data = roadmaps[key];
        if (!data) {
            const empty = document.createElement('p');
            empty.className = 'timeline-empty';
            empty.textContent = 'Select a career goal to generate your personalized roadmap.';
            timelineContainer.appendChild(empty);
            return;
        }

        data.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'timeline-item active';
            div.style.animationDelay = `${index * 0.08}s`;

            const content = document.createElement('div');
            content.className = 'timeline-content';
            const year = document.createElement('div');
            year.className = 'timeline-year';
            year.textContent = item.year;
            const title = document.createElement('h4');
            title.textContent = item.title;
            const desc = document.createElement('p');
            desc.textContent = item.desc;
            content.append(year, title, desc);
            div.appendChild(content);
            timelineContainer.appendChild(div);
        });
    };

    if (btnGenRoadmap && roadmapSelect) {
        btnGenRoadmap.addEventListener('click', () => {
            if (roadmapSelect.value === 'none') {
                alert('Please select a career goal.');
                return;
            }
            renderRoadmap(roadmapSelect.value);
        });
        roadmapSelect.addEventListener('change', () => {
            if (roadmapSelect.value !== 'none') renderRoadmap(roadmapSelect.value);
        });
    }

    /* =========================================
       Feature 4: Resume Roaster
       ========================================= */
    const roasterInput = document.getElementById('roaster-input');
    const btnRoast = document.getElementById('btn-roast');
    const roasterOutput = document.getElementById('roaster-output');

    const replacements = [
        { weak: 'was responsible for', strong: 'Owned' },
        { weak: 'helped with', strong: 'Led' },
        { weak: 'worked on', strong: 'Delivered' },
        { weak: 'helped', strong: 'Contributed to' },
        { weak: 'made', strong: 'Built' },
        { weak: 'did', strong: 'Executed' },
        { weak: 'worked', strong: 'Collaborated on' },
        { weak: 'created', strong: 'Engineered' },
        { weak: 'got', strong: 'Secured' },
        { weak: 'things', strong: 'system performance' },
        { weak: 'faster', strong: '35% more efficient' },
        { weak: 'better', strong: 'measurably stronger' },
        { weak: 'a lot', strong: 'significantly' },
        { weak: 'many', strong: '200+' }
    ];

    const weakPatterns = [...replacements.map(({ weak }) => weak)].sort((a, b) => b.length - a.length);

    const highlightWeakWords = text => {
        const fragment = document.createDocumentFragment();
        let remaining = text;
        let safety = 0;

        while (remaining.length && safety < 50) {
            safety += 1;
            const lower = remaining.toLowerCase();
            let earliestIndex = -1;
            let matchedWeak = '';

            weakPatterns.forEach(pattern => {
                const index = lower.indexOf(pattern);
                if (index !== -1 && (earliestIndex === -1 || index < earliestIndex)) {
                    earliestIndex = index;
                    matchedWeak = pattern;
                }
            });

            if (earliestIndex === -1) {
                fragment.appendChild(document.createTextNode(remaining));
                break;
            }

            if (earliestIndex > 0) {
                fragment.appendChild(document.createTextNode(remaining.slice(0, earliestIndex)));
            }

            const span = document.createElement('span');
            span.className = 'weak-word';
            span.textContent = remaining.slice(earliestIndex, earliestIndex + matchedWeak.length);
            fragment.appendChild(span);
            remaining = remaining.slice(earliestIndex + matchedWeak.length);
        }

        return fragment;
    };

    const analyzeBullet = text => {
        const changes = [];
        let output = text.trim();

        replacements.forEach(({ weak, strong }) => {
            const regex = new RegExp(`\\b${escapeRegex(weak)}\\b`, 'gi');
            if (regex.test(output)) {
                changes.push({ weak, strong });
                output = output.replace(regex, strong);
            }
        });

        output = output.replace(/\bi\b/g, 'I');
        output = output.replace(/\s{2,}/g, ' ').trim();
        output = output.charAt(0).toUpperCase() + output.slice(1);

        if (!/[.!?]$/.test(output)) {
            output += '.';
        }

        const hasMetrics = /\d|%|\$|rs\.?/i.test(output);
        const strengthScore = Math.min(100, 42 + (changes.length * 8) + (hasMetrics ? 24 : 0));

        return { output, changes, hasMetrics, strengthScore };
    };

    const buildOptimizedDisplay = (text, changes) => {
        const fragment = document.createDocumentFragment();
        let remaining = text;

        changes.forEach(({ weak, strong }) => {
            const regex = new RegExp(escapeRegex(strong), 'i');
            const match = remaining.match(regex);
            if (!match) return;

            const index = match.index;
            if (index > 0) {
                fragment.appendChild(document.createTextNode(remaining.slice(0, index)));
            }

            const span = document.createElement('span');
            span.className = 'strong-word';
            span.textContent = match[0];
            fragment.appendChild(span);
            remaining = remaining.slice(index + match[0].length);
        });

        if (remaining) {
            fragment.appendChild(document.createTextNode(remaining));
        }

        return fragment;
    };

    if (btnRoast && roasterInput && roasterOutput) {
        if (!roasterInput.value.trim()) {
            roasterInput.value = 'I helped with creating a new database system that made reports faster';
        }

        btnRoast.addEventListener('click', () => {
            const text = roasterInput.value.trim();
            roasterOutput.replaceChildren();

            if (!text) {
                const error = document.createElement('p');
                error.style.color = '#ff5252';
                error.textContent = 'Please paste a resume bullet point first.';
                roasterOutput.appendChild(error);
                return;
            }

            const analysis = analyzeBullet(text);

            const scoreWrap = document.createElement('div');
            scoreWrap.style.marginBottom = '1.25rem';
            const scoreLabel = document.createElement('div');
            scoreLabel.style.display = 'flex';
            scoreLabel.style.justifyContent = 'space-between';
            scoreLabel.style.marginBottom = '8px';
            scoreLabel.style.fontSize = '0.9rem';
            scoreLabel.innerHTML = `<span>Bullet Strength</span><strong style="color: ${analysis.strengthScore >= 70 ? '#00d1b2' : '#ffbd2e'};">${analysis.strengthScore}/100</strong>`;
            const scoreBar = document.createElement('div');
            scoreBar.style.height = '8px';
            scoreBar.style.borderRadius = '999px';
            scoreBar.style.background = 'rgba(255,255,255,0.08)';
            scoreBar.style.overflow = 'hidden';
            const scoreFill = document.createElement('div');
            scoreFill.style.width = `${analysis.strengthScore}%`;
            scoreFill.style.height = '100%';
            scoreFill.style.borderRadius = '999px';
            scoreFill.style.background = analysis.strengthScore >= 70 ? '#00d1b2' : '#ffbd2e';
            scoreBar.appendChild(scoreFill);
            scoreWrap.append(scoreLabel, scoreBar);

            const original = document.createElement('p');
            original.style.marginBottom = '1rem';
            const originalLabel = Object.assign(document.createElement('span'), { className: 'weak-word', textContent: 'Original' });
            original.append(originalLabel, document.createTextNode(' '));
            original.appendChild(highlightWeakWords(text));

            const improved = document.createElement('p');
            improved.style.marginBottom = '1rem';
            const improvedLabel = Object.assign(document.createElement('span'), { className: 'strong-word', textContent: 'Optimized' });
            improved.append(improvedLabel, document.createTextNode(' '));
            improved.appendChild(buildOptimizedDisplay(analysis.output, analysis.changes));

            const changesBox = document.createElement('div');
            changesBox.style.marginBottom = '1rem';
            changesBox.style.padding = '12px 14px';
            changesBox.style.borderRadius = '12px';
            changesBox.style.background = 'rgba(255,255,255,0.04)';
            changesBox.style.border = '1px solid rgba(255,255,255,0.08)';

            const changesTitle = document.createElement('strong');
            changesTitle.style.display = 'block';
            changesTitle.style.marginBottom = '8px';
            changesTitle.textContent = 'Changes Applied';
            changesBox.appendChild(changesTitle);

            if (analysis.changes.length) {
                analysis.changes.forEach(({ weak, strong }) => {
                    const row = document.createElement('p');
                    row.style.margin = '0 0 6px 0';
                    row.style.fontSize = '0.92rem';
                    row.innerHTML = `<span class="weak-word">${weak}</span> → <span class="strong-word">${strong}</span>`;
                    changesBox.appendChild(row);
                });
            } else {
                const none = document.createElement('p');
                none.style.margin = '0';
                none.style.fontSize = '0.92rem';
                none.textContent = 'No weak verbs detected. Focus on adding measurable impact.';
                changesBox.appendChild(none);
            }

            const tip = document.createElement('p');
            tip.style.fontSize = '0.9rem';
            tip.style.color = 'var(--text-muted)';
            tip.style.margin = '0';
            tip.textContent = analysis.hasMetrics
                ? 'Nice — this bullet already includes measurable impact. Keep verbs active and results specific.'
                : 'Tip: Add numbers like users served, time saved, revenue impact, or percentage improvement for a stronger bullet.';

            roasterOutput.append(scoreWrap, original, improved, changesBox, tip);
        });
    }

    /* =========================================
       Feature 5: AMA Board
       ========================================= */
    const amaInput = document.getElementById('ama-input');
    const btnAmaSubmit = document.getElementById('btn-ama-submit');
    const amaBoard = document.getElementById('ama-board');

    const createAmaCard = (question, answered = false) => {
        const card = document.createElement('div');
        card.className = 'ama-q-card';

        const meta = document.createElement('div');
        meta.className = 'ama-meta';
        const author = document.createElement('span');
        author.textContent = answered ? 'Anonymous Student - 2 hours ago' : 'Anonymous Student - Just now';
        const status = document.createElement('span');
        status.className = 'ama-status';
        status.textContent = answered ? 'Answered' : 'Pending Expert Reply';
        if (answered) status.classList.add('answered');
        meta.append(author, status);

        const title = document.createElement('h4');
        title.textContent = question;

        const reply = document.createElement('p');
        reply.className = 'ama-reply';
        reply.textContent = answered
            ? 'Alumni Reply: GPA matters for the first screening, but projects and interview skills usually decide the final round.'
            : 'Waiting for an alumni mentor to respond. Upvotes help prioritize this question.';

        const actions = document.createElement('div');
        actions.className = 'ama-actions';
        const upvote = document.createElement('button');
        upvote.type = 'button';
        upvote.append(createIcon('fa-solid fa-arrow-up'), document.createTextNode(' Upvote'));
        const count = document.createElement('span');
        count.textContent = answered ? '12' : '0';
        let hasVoted = false;

        upvote.addEventListener('click', () => {
            const current = parseInt(count.textContent, 10) || 0;
            if (hasVoted) {
                count.textContent = String(Math.max(0, current - 1));
                hasVoted = false;
                upvote.classList.remove('voted');
            } else {
                count.textContent = String(current + 1);
                hasVoted = true;
                upvote.classList.add('voted');
            }
        });
        actions.append(upvote, count);

        card.append(meta, title, reply, actions);
        return card;
    };

    if (amaBoard && !amaBoard.dataset.hydrated) {
        amaBoard.dataset.hydrated = 'true';
        amaBoard.replaceChildren(createAmaCard('How important is GPA for tech internships?', true));
    }

    if (btnAmaSubmit && amaInput && amaBoard) {
        const submitQuestion = () => {
            const text = amaInput.value.trim();
            if (!text) {
                alert('Please type a question first.');
                return;
            }
            amaBoard.prepend(createAmaCard(text));
            amaInput.value = '';
        };

        btnAmaSubmit.addEventListener('click', submitQuestion);
        amaInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') submitQuestion();
        });
    }
});
