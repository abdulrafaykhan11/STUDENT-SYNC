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
       Feature 3: Mentorship Toolkit
       ========================================= */
    const matchScoreBtn = document.getElementById('match-score-btn');
    const matchScoreResult = document.getElementById('match-score-result');
    const prepKitBtn = document.getElementById('prep-kit-btn');
    const prepKitResult = document.getElementById('prep-kit-result');
    const checkinBtn = document.getElementById('checkin-btn');
    const checkinResult = document.getElementById('checkin-result');
    let selectedMood = 'Steady';

    matchScoreBtn?.addEventListener('click', () => {
        const goal = document.getElementById('match-goal-new')?.value || 'career';
        const style = document.getElementById('match-style-new')?.value || 'structured';
        const score = goal === 'internship' && style === 'direct' ? 96 : style === 'structured' ? 93 : 90;
        const focus = goal === 'internship' ? 'an internship mentor who can review projects and practise interviews' : goal === 'skills' ? 'a skills coach who will turn weak concepts into a weekly plan' : 'a career mentor who can help you choose a clear next direction';
        matchScoreResult.innerHTML = `<div class="mentor-score">${score}% fit</div><strong>Your best fit:</strong> ${focus}. Start with a focused 30-minute conversation and bring your Session Prep Kit.`;
        matchScoreResult.classList.add('active');
    });

    prepKitBtn?.addEventListener('click', () => {
        const topic = document.getElementById('prep-topic')?.value.trim() || 'your current challenge';
        const questions = document.getElementById('prep-questions')?.value.trim() || 'the questions you want to clarify';
        prepKitResult.innerHTML = `<strong>Session agenda ready</strong><br>1. Context: ${topic}<br>2. Ask: ${questions}<br>3. End with one measurable action for this week.`;
        prepKitResult.classList.add('active');
    });

    document.querySelectorAll('#checkin-moods button').forEach(button => button.addEventListener('click', () => {
        selectedMood = button.dataset.mood;
        document.querySelectorAll('#checkin-moods button').forEach(item => item.classList.toggle('active', item === button));
    }));
    checkinBtn?.addEventListener('click', () => {
        const win = document.getElementById('checkin-win')?.value.trim() || 'No win recorded yet';
        const prompt = selectedMood === 'Struggling' ? 'Ask your mentor: “What is the smallest next step I should take this week?”' : selectedMood === 'Confident' ? 'Ask your mentor: “What challenge should I take on next?”' : 'Ask your mentor: “What would make my current plan stronger?”';
        checkinResult.innerHTML = `<strong>${selectedMood} check-in saved.</strong><br>Win: ${win}<br>${prompt}`;
        checkinResult.classList.add('active');
    });

    const setMentorOutput = (id, html) => {
        const output = document.getElementById(id);
        if (!output) return;
        output.innerHTML = html;
        output.classList.add('active');
    };

    document.getElementById('decision-btn')?.addEventListener('click', () => {
        const type = document.getElementById('decision-type')?.value;
        const hours = document.getElementById('decision-time')?.value;
        const plans = {
            project: { move: 'Build a deliberately small project slice first.', action: `Use ${hours} hours to define one user problem, ship one working screen, then ask your mentor to review the decision—not the design.`, link: 'knowledge-base.html#concept-connections', resource: 'Concept Connections Map' },
            skill: { move: 'Fix one high-leverage weakness before expanding scope.', action: `Use ${hours} hours for one concept, one recall quiz, and one explain-back note. Bring the mistake you made to your mentor.`, link: 'knowledge-base.html#quiz-lab', resource: 'Active Recall Quiz Lab' },
            internship: { move: 'Create proof before sending more applications.', action: `Use ${hours} hours to polish one project outcome, rehearse one interview story, and ask your mentor for one specific improvement.`, link: 'knowledge-base.html#knowledge-quest', resource: 'Knowledge Quest Arena' }
        };
        const plan = plans[type] || plans.project;
        setMentorOutput('decision-output', `<strong>Best move: ${plan.move}</strong><br>${plan.action}<br><a href="${plan.link}">Open ${plan.resource} <i class="fa-solid fa-arrow-right"></i></a>`);
    });

    document.getElementById('radar-btn')?.addEventListener('click', () => {
        const target = document.getElementById('radar-target')?.value;
        const level = document.getElementById('radar-level')?.value;
        const scoreBase = target === 'exam' ? 46 : target === 'project' ? 52 : 48;
        const score = level === 'ready' ? scoreBase + 38 : level === 'building' ? scoreBase + 20 : scoreBase;
        const targetText = target === 'exam' ? 'exam performance' : target === 'project' ? 'portfolio proof' : 'internship readiness';
        const resource = target === 'exam' ? ['Exam Sprint Planner', 'knowledge-base.html#exam-planner'] : target === 'project' ? ['Concept Connections Map', 'knowledge-base.html#concept-connections'] : ['Knowledge Quest Arena', 'knowledge-base.html#knowledge-quest'];
        setMentorOutput('radar-output', `<strong>${score}% ready for ${targetText}.</strong><br>Your next signal is consistent practice that you can explain to a mentor. Close the gap with <a href="${resource[1]}">${resource[0]} <i class="fa-solid fa-arrow-right"></i></a>.`);
    });

    document.getElementById('sprint-btn')?.addEventListener('click', () => {
        const goal = document.getElementById('sprint-goal')?.value.trim() || 'your selected outcome';
        const days = parseInt(document.getElementById('sprint-length')?.value || '7', 10);
        const checkpoint = days <= 7 ? 'Day 3: show your first working proof.' : `Day ${Math.ceil(days / 2)}: send a short progress update and one blocker.`;
        setMentorOutput('sprint-output', `<strong>${days}-day sprint launched: ${goal}</strong><br>Day 1: define the smallest deliverable. <br>${checkpoint}<br>Final day: demo the result and ask your mentor, “What should I improve next?”<br><a href="knowledge-base.html#focus-hub">Open Focus Hub <i class="fa-solid fa-arrow-right"></i></a>`);
    });

    /* Practical mentorship outputs: evidence pack + scored mock interview */
    const evidenceBtn = document.getElementById('evidence-btn');
    const evidenceOutput = document.getElementById('evidence-output');
    evidenceBtn?.addEventListener('click', () => {
        const project = document.getElementById('evidence-project')?.value.trim() || 'My project';
        const problem = document.getElementById('evidence-problem')?.value.trim() || 'a clear student problem';
        const stack = document.getElementById('evidence-stack')?.value.trim() || 'the selected tools';
        const impact = document.getElementById('evidence-impact')?.value.trim() || 'a measurable improvement';
        const pack = `MENTOR REVIEW BRIEF\n\nProject: ${project}\nProblem: ${problem}\nBuilt with: ${stack}\nImpact: ${impact}\n\nCV BULLET\nBuilt ${project} using ${stack} to solve ${problem}, resulting in ${impact}.\n\nMENTOR QUESTION\nWhich part of this project should I improve first to make the strongest portfolio evidence?`;
        evidenceOutput.replaceChildren();
        const pre = document.createElement('pre');
        pre.style.cssText = 'white-space:pre-wrap; margin:0; font:inherit; color:var(--text-muted);';
        pre.textContent = pack;
        const copy = document.createElement('button');
        copy.type = 'button'; copy.className = 'm-btn'; copy.style.marginTop = '0.85rem';
        copy.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Evidence Pack';
        copy.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(pack); copy.innerHTML = '<i class="fa-solid fa-check"></i> Copied'; } catch { copy.textContent = 'Select and copy the pack above'; }
        });
        evidenceOutput.append(pre, copy);
        evidenceOutput.classList.add('active');
    });

    const arenaChallenges = {
        technical: { question: 'Explain how you would build a responsive student task dashboard. What data would you store, which tools would you use, and how would you test it?', signals: ['data', 'javascript', 'database', 'test', 'responsive'] },
        project: { question: 'Choose one project from your portfolio. What user problem did it solve, what decision did you make, and what measurable result did it create?', signals: ['problem', 'built', 'decision', 'result', 'user'] },
        behavioral: { question: 'Tell me about a time you faced a difficult learning challenge. What was the situation, what action did you take, and what did you learn?', signals: ['situation', 'action', 'result', 'learned', 'challenge'] }
    };
    let activeArenaChallenge = arenaChallenges.technical;
    document.getElementById('arena-load-btn')?.addEventListener('click', () => {
        const track = document.getElementById('arena-track')?.value || 'technical';
        activeArenaChallenge = arenaChallenges[track];
        const question = document.getElementById('arena-question');
        question.innerHTML = `<strong>Challenge:</strong> ${activeArenaChallenge.question}`;
        document.getElementById('arena-output')?.classList.remove('active');
    });
    document.getElementById('arena-score-btn')?.addEventListener('click', () => {
        const answer = document.getElementById('arena-answer')?.value.trim() || '';
        const output = document.getElementById('arena-output');
        if (answer.length < 40) { setMentorOutput('arena-output', '<strong>Need more evidence.</strong><br>Write at least a short, specific answer so the arena can assess it.'); return; }
        const found = activeArenaChallenge.signals.filter(signal => answer.toLowerCase().includes(signal));
        const score = Math.min(100, 35 + Math.min(35, Math.round(answer.split(/\s+/).length / 3)) + found.length * 6);
        const missing = activeArenaChallenge.signals.filter(signal => !found.includes(signal)).slice(0, 2);
        setMentorOutput('arena-output', `<strong>${score}/100 interview evidence score</strong><br>Signals detected: ${found.length ? found.join(', ') : 'add more specific evidence'}.<br>${missing.length ? `Improve it by including: ${missing.join(' and ')}.` : 'Strong structure—now practise saying it aloud to a mentor.'}`);
    });

    /* =========================================
       Student mentor directory, path quiz & vault
       ========================================= */
    const directoryCards = [...document.querySelectorAll('.directory-card')];
    const directoryField = document.getElementById('directory-field');
    const directoryUniversity = document.getElementById('directory-university');
    const directorySearch = document.getElementById('directory-search');
    const directoryCount = document.getElementById('directory-count');

    const filterDirectory = () => {
        const field = directoryField?.value || 'all';
        const university = directoryUniversity?.value || 'all';
        const query = directorySearch?.value.trim().toLowerCase() || '';
        let visible = 0;
        directoryCards.forEach(card => {
            const matches = (field === 'all' || card.dataset.field === field)
                && (university === 'all' || card.dataset.university === university)
                && (!query || card.dataset.search.includes(query));
            card.hidden = !matches;
            if (matches) visible += 1;
        });
        if (directoryCount) directoryCount.textContent = `Showing ${visible} mentor${visible === 1 ? '' : 's'}`;
    };
    [directoryField, directoryUniversity, directorySearch].forEach(control => control?.addEventListener('input', filterDirectory));

    const quizQuestions = [
        { question: 'Which activity feels most exciting?', answers: [['Building apps or solving logic puzzles', 'tech'], ['Understanding people, markets or money', 'business'], ['Learning how the body works', 'medical'], ['Designing how things are built', 'engineering']] },
        { question: 'What are you preparing for right now?', answers: [['XI / XII subject choices', 'all'], ['University entry test', 'all'], ['First year and exposure', 'all'], ['A career switch or internship', 'all']] },
        { question: 'What kind of impact do you want to make?', answers: [['Digital products that help people', 'tech'], ['Better health outcomes', 'medical'], ['Growing teams or businesses', 'business'], ['Real-world systems and infrastructure', 'engineering']] },
        { question: 'Which support would help most this month?', answers: [['Scholarship and university shortlist', 'all'], ['Entry-test strategy', 'all'], ['Portfolio and skills plan', 'tech'], ['Industry exposure and career plan', 'engineering']] }
    ];
    const pathResults = {
        tech: { title: 'Technology & Computing', mentors: 'Ayesha Khan and Zain Ali', next: 'Choose one programming starter project, make a weekly practice plan, and ask Ayesha to review your university shortlist.' },
        medical: { title: 'Medical & Health Sciences', mentors: 'Dr. Hamza Rafiq', next: 'Build an MDCAT revision routine, compare MBBS programmes, and book a call to understand first-year workload.' },
        business: { title: 'Business & Management', mentors: 'Mariam Siddiqui and Sana Iqbal', next: 'Explore one business case or society, shortlist programmes by curriculum, and polish your scholarship story.' },
        engineering: { title: 'Engineering & Applied Sciences', mentors: 'Bilal Ahmed', next: 'Compare engineering disciplines, start ECAT practice, and ask Bilal what industry exposure matters in first year.' }
    };
    const pathQuiz = document.getElementById('path-quiz');
    const quizResult = document.getElementById('quiz-result');
    let quizStep = 0;
    const quizScores = { tech: 0, medical: 0, business: 0, engineering: 0 };
    const renderPathQuiz = () => {
        if (!pathQuiz) return;
        if (quizStep >= quizQuestions.length) {
            const recommendation = Object.entries(quizScores).sort((a, b) => b[1] - a[1])[0][0];
            const result = pathResults[recommendation];
            pathQuiz.innerHTML = '<p class="quiz-progress">Completed · Your starting direction</p>';
            quizResult.innerHTML = `<strong style="color:white;font-size:1.15rem">Recommended path: ${result.title}</strong><br><br><strong>Relevant mentors:</strong> ${result.mentors}<br><strong>Next step:</strong> ${result.next}<br><br><a href="#mentor-directory" style="color:var(--accent-gold);font-weight:700">Meet your mentors <i class="fa-solid fa-arrow-right"></i></a>`;
            quizResult.classList.add('active');
            return;
        }
        const current = quizQuestions[quizStep];
        pathQuiz.replaceChildren();
        const progress = document.createElement('p'); progress.className = 'quiz-progress'; progress.textContent = `Question ${quizStep + 1} of ${quizQuestions.length}`;
        const question = document.createElement('h3'); question.className = 'quiz-question'; question.textContent = current.question;
        const choices = document.createElement('div'); choices.className = 'quiz-choices';
        current.answers.forEach(([label, value]) => {
            const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
            button.addEventListener('click', () => { if (value !== 'all') quizScores[value] += 1; quizStep += 1; renderPathQuiz(); });
            choices.appendChild(button);
        });
        pathQuiz.append(progress, question, choices);
    };
    renderPathQuiz();

    const vaultSearch = document.getElementById('vault-search');
    const vaultItems = [...document.querySelectorAll('.vault-item')];
    const vaultEmpty = document.getElementById('vault-empty');
    vaultSearch?.addEventListener('input', () => {
        const terms = vaultSearch.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
        let matched = 0;
        vaultItems.forEach(item => {
            const searchable = `${item.dataset.question} ${item.textContent}`.toLowerCase();
            const show = !terms.length || terms.every(term => searchable.includes(term));
            item.classList.toggle('active', show);
            if (show) matched += 1;
        });
        if (vaultEmpty) vaultEmpty.style.display = matched ? 'none' : 'block';
    });

    const inquiryModal = document.getElementById('inquiry-modal');
    const inquiryForm = document.getElementById('inquiry-form');
    const inquiryTopic = document.getElementById('inquiry-topic');
    const closeInquiry = () => { inquiryModal?.classList.remove('active'); inquiryModal?.setAttribute('aria-hidden', 'true'); };
    document.querySelectorAll('.open-inquiry').forEach(button => button.addEventListener('click', () => {
        const mentor = button.dataset.mentor || 'StudentSync Mentor Team';
        const field = button.dataset.field || 'career guidance';
        if (inquiryTopic) inquiryTopic.value = `${field} guidance with ${mentor}`;
        inquiryModal?.classList.add('active'); inquiryModal?.setAttribute('aria-hidden', 'false');
        document.getElementById('inquiry-name')?.focus();
    }));
    document.getElementById('close-inquiry')?.addEventListener('click', closeInquiry);
    inquiryModal?.addEventListener('click', event => { if (event.target === inquiryModal) closeInquiry(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeInquiry(); });
    inquiryForm?.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('inquiry-name')?.value.trim() || 'a StudentSync student';
        const topic = inquiryTopic?.value.trim() || 'career guidance';
        const details = document.getElementById('inquiry-message')?.value.trim() || 'I would like to know the best next steps.';
        const message = `Hi! Main ${name} hu. Mujhe ${topic} ke baare mein guidance chahiye thi. ${details}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
        closeInquiry();
        inquiryForm.reset();
    });

    const downloadableResources = {
        timetable: {
            filename: 'studentsync-entry-test-timetable.txt',
            content: 'STUDENTSYNC ENTRY TEST STUDY TIMETABLE\n\nWeek 1: Diagnose\nMon–Thu: 90 minutes of core concepts\nFri: Review weak-topic notes\nSat: Timed mini-test\nSun: Rest and plan\n\nWeek 2: Build speed\nMon–Thu: Timed practice by topic\nFri: Error log review\nSat: Full mock test\nSun: Revise the lowest-scoring topic\n\nWeek 3: Strengthen\nRepeat mocks and target your three weakest areas.\n\nWeek 4: Final revision\nAlternate full tests, concise revision and proper rest.'
        },
        comparison: {
            filename: 'studentsync-university-comparison.csv',
            content: 'University,Programme,Estimated Fees,Merit / Entry Test,Best Fit,Notes\nFAST-NUCES,Computing / Business,Add your current fee,NU / entry test,Tech or analytics,Confirm latest admissions details\nLUMS,Management / CS,Add your current fee,SAT / university criteria,Business or interdisciplinary,Check financial aid deadlines\nUET Lahore,Engineering,Add your current fee,ECAT,Engineering,Compare campus and discipline\nAga Khan University,MBBS,Add your current fee,MDCAT / university criteria,Medical,Review eligibility carefully'
        },
        outreach: {
            filename: 'studentsync-freshman-outreach-kit.txt',
            content: 'STUDENTSYNC FRESHMAN OUTREACH KIT\n\nCV STARTER\nName | City | Email | LinkedIn\nEducation: Programme, university, expected graduation\nProjects / activities: What you built or contributed, tools used, outcome\nSkills: Keep only skills you can explain\n\nMENTOR MESSAGE\nHi [Mentor Name],\nI am [Your Name], currently [class / programme]. I found your work in [field] inspiring. I am exploring [specific goal] and would value 15 minutes of guidance on [one precise question]. I have prepared [project / shortlist / CV] in advance. Thank you for considering it!'
        }
    };
    document.querySelectorAll('.resource-download').forEach(button => button.addEventListener('click', () => {
        const resource = downloadableResources[button.dataset.resource];
        if (!resource) return;
        const url = URL.createObjectURL(new Blob([resource.content], { type: 'text/plain;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url; link.download = resource.filename;
        document.body.appendChild(link); link.click(); link.remove();
        URL.revokeObjectURL(url);
    }));

    /* =========================================
       Feature 4: Career Roadmap
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

    const roadmapResources = {
        swe: [
            [{ label: 'HTML & CSS', url: 'conceptual-mastery.html#html' }, { label: 'JavaScript', url: 'conceptual-mastery.html#javascript' }, { label: 'Concept Map', url: 'knowledge-base.html#concept-connections' }],
            [{ label: 'MySQL', url: 'conceptual-mastery.html#mysql' }, { label: 'PHP', url: 'conceptual-mastery.html#php' }, { label: 'Node.js', url: 'conceptual-mastery.html#nodejs' }],
            [{ label: 'Knowledge Quest', url: 'knowledge-base.html#knowledge-quest' }, { label: 'Active Recall Quiz', url: 'knowledge-base.html#quiz-lab' }],
            [{ label: 'React', url: 'conceptual-mastery.html#react' }, { label: 'Exam Sprint Planner', url: 'knowledge-base.html#exam-planner' }]
        ],
        data: [
            [{ label: 'Python', url: 'conceptual-mastery.html#python' }, { label: 'Flashcards', url: 'knowledge-base.html#flashcard-builder' }],
            [{ label: 'MySQL', url: 'conceptual-mastery.html#mysql' }, { label: 'Knowledge Quest', url: 'knowledge-base.html#knowledge-quest' }],
            [{ label: 'Active Recall Quiz', url: 'knowledge-base.html#quiz-lab' }, { label: 'Focus Hub', url: 'knowledge-base.html#focus-hub' }],
            [{ label: 'Custom Flashcards', url: 'knowledge-base.html#flashcard-builder' }, { label: 'Concept Map', url: 'knowledge-base.html#concept-connections' }]
        ],
        pm: [
            [{ label: 'Concept Map', url: 'knowledge-base.html#concept-connections' }, { label: 'Knowledge Quest', url: 'knowledge-base.html#knowledge-quest' }],
            [{ label: 'HTML & CSS', url: 'conceptual-mastery.html#html' }, { label: 'JavaScript', url: 'conceptual-mastery.html#javascript' }],
            [{ label: 'Exam Sprint Planner', url: 'knowledge-base.html#exam-planner' }, { label: 'Focus Hub', url: 'knowledge-base.html#focus-hub' }],
            [{ label: 'Active Recall Quiz', url: 'knowledge-base.html#quiz-lab' }, { label: 'Custom Flashcards', url: 'knowledge-base.html#flashcard-builder' }]
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
            const resources = document.createElement('div');
            resources.className = 'roadmap-resources';
            (roadmapResources[key]?.[index] || []).forEach(resource => {
                const link = document.createElement('a');
                link.href = resource.url;
                link.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${resource.label}`;
                resources.appendChild(link);
            });
            content.append(year, title, desc, resources);
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
