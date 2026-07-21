document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const createIcon = className => {
        const icon = document.createElement('i');
        icon.className = className;
        icon.setAttribute('aria-hidden', 'true');
        return icon;
    };

    const setButtonContent = (button, iconClass, label) => {
        button.replaceChildren(createIcon(iconClass), document.createTextNode(` ${label}`));
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    /* =========================================
       Feature 1: Feynman Simplicity Engine
       ========================================= */
    const feynmanInput = document.getElementById('feynman-input');
    const feynmanClear = document.getElementById('feynman-clear');
    const feynmanGauge = document.getElementById('feynman-gauge');
    const feynmanScoreVal = document.getElementById('feynman-score-val');
    const feynmanStatus = document.getElementById('feynman-status');
    const feynmanGrade = document.getElementById('feynman-grade');
    const feynmanJargon = document.getElementById('feynman-jargon');

    const jargonList = new Set([
        'utilize', 'facilitate', 'implement', 'paradigm', 'synergy', 'leverage',
        'methodology', 'framework', 'juxtapose', 'mitigate', 'optimize', 'subsequently',
        'comprehensive', 'conceptualize', 'delineate', 'elucidate', 'empirical',
        'heuristic', 'pedagogical', 'proliferate', 'ubiquitous', 'ameliorate',
        'ascertain', 'dichotomy', 'epistemology', 'hermeneutic', 'obfuscate',
        'paradoxical', 'quintessential', 'ramification'
    ]);

    const countSyllables = (word) => {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const match = word.match(/[aeiouy]{1,2}/g);
        return match ? match.length : 1;
    };

    const analyzeText = () => {
        if (!feynmanInput) return;
        
        const text = feynmanInput.value.trim();
        if (text.length === 0) {
            resetFeynmanUI();
            return;
        }

        const words = text.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        
        // Count sentences, default to 1 if no punctuation
        const sentences = Math.max(1, text.split(/[.!?]+/).filter(s => s.trim().length > 0).length);
        
        let syllableCount = 0;
        let jargonCount = 0;

        words.forEach(w => {
            const cleanWord = w.toLowerCase().replace(/[^a-z]/g, '');
            if (!cleanWord) return;
            
            const syllables = countSyllables(cleanWord);
            syllableCount += syllables;
            
            // Jargon = words in the list OR any word with 4+ syllables
            if (jargonList.has(cleanWord) || syllables >= 4) {
                jargonCount++;
            }
        });

        // Flesch-Kincaid Grade Level Formula
        const gradeLevel = (0.39 * (wordCount / sentences)) + (11.8 * (syllableCount / wordCount)) - 15.59;
        const clampedGrade = Math.max(0, Math.min(20, gradeLevel));
        
        // Simplicity Score (100 = 5th grade or lower, 0 = 20th grade or higher)
        let simplicityScore = 100 - ((clampedGrade - 5) / 15 * 100);
        
        // If they only typed a few words, prevent the score from instantly jumping to 100
        if (wordCount < 4) {
            simplicityScore = Math.max(0, Math.min(50, simplicityScore)); // Cap at 50 until a real sentence is formed
        } else {
            simplicityScore = Math.max(0, Math.min(100, Math.round(simplicityScore)));
        }

        updateFeynmanUI(Math.round(simplicityScore), clampedGrade.toFixed(1), jargonCount);
    };

    const updateFeynmanUI = (score, grade, jargon) => {
        feynmanScoreVal.textContent = score;
        feynmanGrade.textContent = grade;
        feynmanJargon.textContent = jargon;
        
        // Gauge length is 283
        const dashOffset = 283 - (283 * (score / 100));
        feynmanGauge.style.strokeDashoffset = dashOffset;
        
        let color = 'var(--text-muted)';
        let statusText = '';
        
        if (score >= 80) {
            color = 'var(--accent-mint)';
            statusText = 'Crystal Clear';
        } else if (score >= 50) {
            color = 'var(--accent-gold)';
            statusText = 'Getting There';
        } else {
            color = 'var(--accent-coral)';
            statusText = 'Too Complex';
        }
        
        feynmanGauge.style.stroke = color;
        feynmanStatus.style.color = color;
        feynmanStatus.textContent = statusText;
    };

    const resetFeynmanUI = () => {
        if (!feynmanInput) return;
        feynmanScoreVal.textContent = '0';
        feynmanGrade.textContent = '-';
        feynmanJargon.textContent = '0';
        feynmanGauge.style.strokeDashoffset = '283';
        feynmanGauge.style.stroke = 'var(--text-muted)';
        feynmanStatus.style.color = 'var(--text-muted)';
        feynmanStatus.textContent = 'Start typing...';
    };

    if (feynmanInput) {
        let debounceTimer;
        feynmanInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(analyzeText, 300);
        });
        
        feynmanClear?.addEventListener('click', () => {
            feynmanInput.value = '';
            resetFeynmanUI();
        });
        
        resetFeynmanUI();
    }

    /* =========================================
       Feature 2: Personal Kanban Board
       ========================================= */
    const kCols = document.querySelectorAll('.kanban-col');
    const KANBAN_ORDER = ['todo', 'prog', 'done'];
    let draggedItem = null;
    let selectedKanbanCard = null;

    const isTouchPrimaryDevice = () => !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const clearKanbanSelection = () => {
        selectedKanbanCard?.classList.remove('is-selected');
        selectedKanbanCard = null;
        kCols.forEach(col => col.classList.remove('can-receive'));
    };

    const highlightReceiveColumns = card => {
        kCols.forEach(col => {
            if (col.contains(card)) col.classList.remove('can-receive');
            else col.classList.add('can-receive');
        });
    };

    const getColumnId = colEl => colEl?.dataset.col || colEl?.id?.replace('col-', '');

    const getColumnById = colId => document.getElementById(`col-${colId}`);

    const getColumnIndex = colId => KANBAN_ORDER.indexOf(colId);

    const updateKanbanCounts = () => {
        KANBAN_ORDER.forEach(colId => {
            const counter = document.getElementById(`cnt-${colId}`);
            const column = getColumnById(colId);
            if (counter && column) {
                counter.textContent = column.querySelectorAll('.k-card').length;
            }
        });
    };

    const insertCardBeforeAddButton = (col, card) => {
        const btn = col.querySelector('.k-add-btn');
        col.insertBefore(card, btn);
    };

    const updateMoveButtons = card => {
        const col = card.closest('.kanban-col');
        if (!col) return;

        const colId = getColumnId(col);
        const index = getColumnIndex(colId);
        const prevBtn = card.querySelector('[data-move="prev"]');
        const nextBtn = card.querySelector('[data-move="next"]');

        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= KANBAN_ORDER.length - 1;
    };

    const moveCard = (card, direction) => {
        const col = card.closest('.kanban-col');
        if (!col) return;

        const currentIndex = getColumnIndex(getColumnId(col));
        const targetIndex = currentIndex + direction;
        if (targetIndex < 0 || targetIndex >= KANBAN_ORDER.length) return;

        const targetCol = getColumnById(KANBAN_ORDER[targetIndex]);
        if (!targetCol) return;

        insertCardBeforeAddButton(targetCol, card);
        updateMoveButtons(card);
        updateKanbanCounts();
    };

    const buildKanbanCard = text => {
        const card = document.createElement('div');
        card.className = 'k-card';

        const body = document.createElement('div');
        body.className = 'k-card-body';
        body.textContent = text;

        const actions = document.createElement('div');
        actions.className = 'k-card-actions';

        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'k-move-btn';
        prevBtn.dataset.move = 'prev';
        prevBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Back';
        prevBtn.addEventListener('click', e => {
            e.stopPropagation();
            moveCard(card, -1);
        });

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'k-move-btn';
        nextBtn.dataset.move = 'next';
        nextBtn.innerHTML = 'Next <i class="fa-solid fa-arrow-right"></i>';
        nextBtn.addEventListener('click', e => {
            e.stopPropagation();
            moveCard(card, 1);
        });

        actions.append(prevBtn, nextBtn);
        card.append(body, actions);
        attachDragEvents(card);
        updateMoveButtons(card);
        return card;
    };

    const upgradeLegacyCard = card => {
        if (card.querySelector('.k-card-body')) {
            attachDragEvents(card);
            updateMoveButtons(card);
            return card;
        }

        const text = card.textContent.trim();
        const upgraded = buildKanbanCard(text);
        card.replaceWith(upgraded);
        return upgraded;
    };

    const attachDragEvents = card => {
        if (card.dataset.dragReady === 'true') return;
        card.dataset.dragReady = 'true';
        card.setAttribute('draggable', 'true');

        card.addEventListener('dragstart', e => {
            draggedItem = card;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', card.querySelector('.k-card-body')?.textContent || '');
            requestAnimationFrame(() => card.classList.add('dragging'));
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            draggedItem = null;
            updateKanbanCounts();
            document.querySelectorAll('.kanban-col').forEach(col => col.classList.remove('drag-over'));
        });

        card.addEventListener('click', e => {
            if (e.target.closest('.k-move-btn') || !isTouchPrimaryDevice()) return;

            e.stopPropagation();
            if (selectedKanbanCard === card) {
                clearKanbanSelection();
                return;
            }

            selectedKanbanCard?.classList.remove('is-selected');
            selectedKanbanCard = card;
            card.classList.add('is-selected');
            highlightReceiveColumns(card);
        });
    };

    document.querySelectorAll('.k-card').forEach(card => upgradeLegacyCard(card));

    kCols.forEach(col => {
        col.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        col.addEventListener('dragenter', e => {
            e.preventDefault();
            col.classList.add('drag-over');
        });

        col.addEventListener('dragleave', e => {
            if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over');
        });

        col.addEventListener('drop', e => {
            e.preventDefault();
            col.classList.remove('drag-over');
            if (!draggedItem) return;

            insertCardBeforeAddButton(col, draggedItem);
            updateMoveButtons(draggedItem);
            updateKanbanCounts();
        });

        col.addEventListener('click', e => {
            if (!selectedKanbanCard || !isTouchPrimaryDevice()) return;
            if (selectedKanbanCard.closest('.kanban-col') === col) return;
            if (e.target.closest('.k-add-btn')) return;

            insertCardBeforeAddButton(col, selectedKanbanCard);
            updateMoveButtons(selectedKanbanCard);
            clearKanbanSelection();
            updateKanbanCounts();
        });
    });

    document.addEventListener('click', e => {
        if (!selectedKanbanCard) return;
        if (e.target.closest('.kanban-board')) return;
        clearKanbanSelection();
    });

    const addKanbanCard = colId => {
        const text = prompt('Enter the new syllabus topic:');
        if (!text || !text.trim()) return;

        const col = getColumnById(colId);
        if (!col) return;

        insertCardBeforeAddButton(col, buildKanbanCard(text.trim()));
        updateKanbanCounts();
    };

    document.querySelectorAll('.k-add-btn').forEach(btn => {
        btn.addEventListener('click', () => addKanbanCard(btn.dataset.col));
    });
    updateKanbanCounts();

    /* =========================================
       Feature 3: Exam Sprint Planner
       ========================================= */
    const plannerDate = document.getElementById('planner-date');
    const plannerHours = document.getElementById('planner-hours');
    const plannerTopic = document.getElementById('planner-topic');
    const plannerDifficulty = document.getElementById('planner-difficulty');
    const plannerConfidence = document.getElementById('planner-confidence');
    const plannerAdd = document.getElementById('planner-add');
    const plannerGenerate = document.getElementById('planner-generate');
    const plannerTopicList = document.getElementById('planner-topic-list');
    const plannerSchedule = document.getElementById('planner-schedule');
    const plannerDays = document.getElementById('planner-days');
    const plannerLoad = document.getElementById('planner-load');
    const plannerPace = document.getElementById('planner-pace');

    const plannerTopics = [
        { id: 1, name: 'Database Normalization', difficulty: 4, confidence: 1 },
        { id: 2, name: 'Graph Algorithms', difficulty: 5, confidence: 2 },
        { id: 3, name: 'OOP Principles', difficulty: 3, confidence: 3 }
    ];

    const addDays = (date, days) => {
        const next = new Date(date);
        next.setDate(next.getDate() + days);
        return next;
    };

    const formatDateValue = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getPlannerDaysLeft = () => {
        if (!plannerDate?.value) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const exam = new Date(`${plannerDate.value}T00:00:00`);
        const diff = Math.ceil((exam - today) / 86400000);
        return Math.max(1, diff);
    };

    const getTopicWeight = topic => topic.difficulty * (4 - topic.confidence);
    const getTopicHours = topic => Math.max(1, Math.ceil(getTopicWeight(topic) * 0.7));

    const renderPlannerTopics = () => {
        if (!plannerTopicList) return;
        plannerTopicList.replaceChildren();

        plannerTopics.forEach(topic => {
            const chip = document.createElement('div');
            chip.className = 'topic-chip';

            const textWrap = document.createElement('div');
            const title = document.createElement('strong');
            title.textContent = topic.name;
            const meta = document.createElement('span');
            meta.textContent = `Difficulty ${topic.difficulty}/5 - Confidence ${topic.confidence}/3`;
            textWrap.append(title, meta);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.setAttribute('aria-label', `Remove ${topic.name}`);
            removeBtn.appendChild(createIcon('fa-solid fa-xmark'));
            removeBtn.addEventListener('click', () => {
                const index = plannerTopics.findIndex(item => item.id === topic.id);
                if (index >= 0) plannerTopics.splice(index, 1);
                renderPlannerTopics();
                buildPlannerSchedule();
            });

            chip.append(textWrap, removeBtn);
            plannerTopicList.appendChild(chip);
        });
    };

    const addPlannerTopic = () => {
        if (!plannerTopic || !plannerDifficulty || !plannerConfidence) return;

        const name = plannerTopic.value.trim();
        if (!name) {
            alert('Please add a topic name first.');
            return;
        }

        plannerTopics.push({
            id: Date.now(),
            name,
            difficulty: parseInt(plannerDifficulty.value, 10),
            confidence: parseInt(plannerConfidence.value, 10)
        });

        plannerTopic.value = '';
        renderPlannerTopics();
        buildPlannerSchedule();
    };

    const buildPlannerSchedule = () => {
        if (!plannerSchedule || !plannerDays || !plannerLoad || !plannerPace || !plannerHours) return;

        plannerSchedule.replaceChildren();

        if (!plannerTopics.length) {
            plannerSchedule.append(Object.assign(document.createElement('div'), {
                className: 'schedule-empty',
                textContent: 'Add at least one topic to build your revision plan.'
            }));
            plannerDays.textContent = '0';
            plannerLoad.textContent = '0h';
            plannerPace.textContent = '0h';
            return;
        }

        const daysLeft = getPlannerDaysLeft();
        const hoursPerDay = clamp(parseFloat(plannerHours.value) || 1, 1, 12);
        const totalLoad = plannerTopics.reduce((sum, topic) => sum + getTopicHours(topic), 0);
        const requiredPace = Math.max(1, Math.ceil(totalLoad / daysLeft));
        const days = Array.from({ length: Math.min(daysLeft, 14) }, (_, index) => ({
            label: index === 0 ? 'Today' : `Day ${index + 1}`,
            load: 0,
            tasks: []
        }));

        plannerTopics
            .slice()
            .sort((a, b) => getTopicWeight(b) - getTopicWeight(a))
            .forEach(topic => {
                const targetDay = days.reduce((best, day) => day.load < best.load ? day : best, days[0]);
                const hours = getTopicHours(topic);
                targetDay.tasks.push({ topic, hours });
                targetDay.load += hours;
            });

        plannerDays.textContent = String(daysLeft);
        plannerLoad.textContent = `${totalLoad}h`;
        plannerPace.textContent = `${requiredPace}h`;

        days.forEach((day, index) => {
            const card = document.createElement('div');
            card.className = 'schedule-day';

            const heading = document.createElement('h4');
            heading.textContent = day.label;
            const dateHint = document.createElement('p');
            dateHint.style.color = 'var(--text-muted)';
            dateHint.style.fontSize = '0.82rem';
            dateHint.style.marginBottom = '0.7rem';
            dateHint.textContent = addDays(new Date(), index).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const list = document.createElement('ul');
            if (day.tasks.length) {
                day.tasks.forEach(({ topic, hours }) => {
                    const item = document.createElement('li');
                    item.textContent = `${topic.name} - ${hours}h review + 15m recall`;
                    list.appendChild(item);
                });
            } else {
                const item = document.createElement('li');
                item.textContent = day.load >= hoursPerDay ? 'Recovery buffer' : 'Flashcard review + past mistakes';
                list.appendChild(item);
            }

            if (day.load > hoursPerDay) {
                const warning = document.createElement('li');
                warning.style.borderLeftColor = 'var(--accent-coral)';
                warning.textContent = `Heavy day: ${day.load}h planned`;
                list.appendChild(warning);
            }

            card.append(heading, dateHint, list);
            plannerSchedule.appendChild(card);
        });
    };

    if (plannerDate && plannerAdd && plannerGenerate) {
        plannerDate.value = formatDateValue(addDays(new Date(), 7));
        plannerAdd.addEventListener('click', addPlannerTopic);
        plannerTopic?.addEventListener('keydown', e => {
            if (e.key === 'Enter') addPlannerTopic();
        });
        plannerGenerate.addEventListener('click', buildPlannerSchedule);
        plannerHours?.addEventListener('input', buildPlannerSchedule);
        plannerDate.addEventListener('change', buildPlannerSchedule);
        renderPlannerTopics();
        buildPlannerSchedule();
    }

    /* =========================================
       Feature 4: Custom Flashcard Builder
       ========================================= */
    const fcBtn = document.getElementById('fc-build-btn');
    const fcQ = document.getElementById('fc-q');
    const fcA = document.getElementById('fc-a');
    const fc3d = document.getElementById('fc-3d');
    const fcFront = document.getElementById('fc-front-text');
    const fcBack = document.getElementById('fc-back-text');

    const renderFlashcard = () => {
        if (!fcQ || !fcA || !fc3d || !fcFront || !fcBack) return;

        const question = fcQ.value.trim();
        const answer = fcA.value.trim();
        if (!question || !answer) {
            alert('Please enter both a question and an answer.');
            return;
        }

        const frontWrap = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = question;
        const hint = document.createElement('p');
        hint.textContent = 'Click to flip';
        hint.className = 'fc-hint';
        frontWrap.append(title, hint);

        const backText = document.createElement('p');
        backText.textContent = answer;

        fcFront.replaceChildren(frontWrap);
        fcBack.replaceChildren(backText);
        fc3d.classList.remove('is-flipped');
        fc3d.classList.add('pop');
        setTimeout(() => fc3d.classList.remove('pop'), 220);
    };

    if (fcBtn && fc3d) {
        fcBtn.addEventListener('click', renderFlashcard);
        fc3d.addEventListener('click', () => fc3d.classList.toggle('is-flipped'));
        fc3d.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fc3d.classList.toggle('is-flipped');
            }
        });
    }

    /* =========================================
       Feature 5: Active Recall Quiz Lab
       ========================================= */
    const quizInput = document.getElementById('quiz-input');
    const quizCount = document.getElementById('quiz-count');
    const quizBuildBtn = document.getElementById('quiz-build-btn');
    const quizResetBtn = document.getElementById('quiz-reset-btn');
    const quizResult = document.getElementById('quiz-result');
    const quizList = document.getElementById('quiz-list');
    const quizScore = document.getElementById('quiz-score');
    const quizFeedback = document.getElementById('quiz-feedback');

    const stopWords = new Set([
        'about', 'after', 'allows', 'also', 'and', 'because', 'between', 'different',
        'from', 'have', 'into', 'that', 'their', 'these', 'this', 'through', 'which',
        'with', 'within', 'without', 'principle', 'method', 'methods', 'object',
        'objects', 'data', 'same', 'your'
    ]);

    let quizState = { answered: 0, correct: 0, total: 0 };

    const cleanWord = word => word.toLowerCase().replace(/[^a-z0-9-]/g, '');

    const extractKeywords = text => {
        const counts = new Map();
        text.split(/\s+/).forEach(rawWord => {
            const word = cleanWord(rawWord);
            if (word.length < 5 || stopWords.has(word)) return;
            counts.set(word, (counts.get(word) || 0) + 1);
        });

        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
            .map(([word]) => word);
    };

    const shuffle = items => items
        .map(item => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);

    const makeQuizQuestions = (text, limit) => {
        const sentences = text
            .replace(/\s+/g, ' ')
            .split(/[.!?]+/)
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 35);
        const keywords = extractKeywords(text);

        return sentences
            .map(sentence => {
                const answer = keywords.find(keyword => sentence.toLowerCase().includes(keyword));
                if (!answer) return null;

                const distractors = shuffle(keywords.filter(keyword => keyword !== answer && !sentence.toLowerCase().includes(keyword))).slice(0, 3);
                if (distractors.length < 3) return null;

                const blankRegex = new RegExp(answer, 'i');
                return {
                    prompt: sentence.replace(blankRegex, '________'),
                    answer,
                    options: shuffle([answer, ...distractors]),
                    explanation: sentence
                };
            })
            .filter(Boolean)
            .slice(0, limit);
    };

    const updateQuizScore = () => {
        if (!quizScore || !quizFeedback) return;
        quizScore.textContent = `${quizState.correct}/${quizState.total}`;
        quizFeedback.textContent = quizState.answered === quizState.total
            ? 'Quiz complete. Review every explanation before moving on.'
            : `${quizState.total - quizState.answered} question(s) remaining.`;
    };

    const renderQuiz = () => {
        if (!quizInput || !quizCount || !quizResult || !quizList) return;

        const text = quizInput.value.trim();
        if (text.length < 80) {
            alert('Paste at least a short paragraph of notes so the quiz has enough material.');
            return;
        }

        const questions = makeQuizQuestions(text, parseInt(quizCount.value, 10));
        if (!questions.length) {
            alert('Could not build quiz questions from this text. Try notes with clear definitions and longer sentences.');
            return;
        }

        quizState = { answered: 0, correct: 0, total: questions.length };
        quizList.replaceChildren();

        questions.forEach((question, index) => {
            const card = document.createElement('div');
            card.className = 'quiz-card';

            const title = document.createElement('h4');
            title.textContent = `${index + 1}. ${question.prompt}`;

            const options = document.createElement('div');
            options.className = 'quiz-options';
            question.options.forEach(optionText => {
                const option = document.createElement('button');
                option.type = 'button';
                option.className = 'quiz-option';
                option.textContent = optionText;
                option.dataset.correct = String(optionText === question.answer);
                options.appendChild(option);
            });

            const explain = document.createElement('p');
            explain.className = 'quiz-explain';
            explain.textContent = `Answer: ${question.answer}. Source: ${question.explanation}`;

            card.append(title, options, explain);
            quizList.appendChild(card);
        });

        quizResult.classList.add('active');
        updateQuizScore();
    };

    if (quizBuildBtn && quizList) {
        quizBuildBtn.addEventListener('click', renderQuiz);
        quizResetBtn?.addEventListener('click', () => {
            quizState = { answered: 0, correct: 0, total: quizState.total };
            quizList.querySelectorAll('.quiz-card').forEach(card => {
                card.classList.remove('answered');
                card.querySelectorAll('.quiz-option').forEach(option => {
                    option.disabled = false;
                    option.classList.remove('correct', 'wrong');
                });
            });
            updateQuizScore();
        });

        quizList.addEventListener('click', e => {
            const option = e.target.closest('.quiz-option');
            if (!option) return;

            const card = option.closest('.quiz-card');
            if (!card || card.classList.contains('answered')) return;

            const isCorrect = option.dataset.correct === 'true';
            if (isCorrect) quizState.correct += 1;
            quizState.answered += 1;
            card.classList.add('answered');

            card.querySelectorAll('.quiz-option').forEach(btn => {
                btn.disabled = true;
                if (btn.dataset.correct === 'true') btn.classList.add('correct');
            });
            if (!isCorrect) option.classList.add('wrong');
            updateQuizScore();
        });
    }

    /* =========================================
       Feature 6: Focus Hub (Timer + To-Do + Lofi)
       ========================================= */
    const todoInput = document.getElementById('todo-input');
    const todoContainer = document.getElementById('todo-container');

    const createTodoItem = text => {
        const item = document.createElement('div');
        item.className = 'todo-item';

        const span = document.createElement('span');
        span.textContent = text;
        span.tabIndex = 0;
        span.addEventListener('click', () => item.classList.toggle('done'));
        span.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.classList.toggle('done');
            }
        });

        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', 'Remove task');
        button.appendChild(createIcon('fa-solid fa-xmark'));
        button.addEventListener('click', () => item.remove());

        item.append(span, button);
        return item;
    };

    if (todoInput && todoContainer) {
        todoContainer.querySelectorAll('.todo-item').forEach(item => {
            const span = item.querySelector('span');
            const button = item.querySelector('button');
            span?.addEventListener('click', () => item.classList.toggle('done'));
            button?.addEventListener('click', () => item.remove());
        });

        todoInput.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;

            const value = todoInput.value.trim();
            if (!value) return;

            todoContainer.appendChild(createTodoItem(value));
            todoInput.value = '';
        });
    }

    const pomoTime = document.getElementById('pomodoro-time');
    const pomoStart = document.getElementById('pomo-start');
    const pomoReset = document.getElementById('pomo-reset');

    if (pomoTime && pomoStart && pomoReset) {
        let pTimerInterval = null;
        let pTimeRemaining = 25 * 60;
        let pIsRunning = false;

        const updatePomo = () => {
            const minutes = Math.floor(pTimeRemaining / 60).toString().padStart(2, '0');
            const seconds = (pTimeRemaining % 60).toString().padStart(2, '0');
            pomoTime.textContent = `${minutes}:${seconds}`;
        };

        const stopTimer = () => {
            clearInterval(pTimerInterval);
            pTimerInterval = null;
            pIsRunning = false;
            pomoStart.classList.remove('running');
            setButtonContent(pomoStart, 'fa-solid fa-play', 'Start');
        };

        pomoStart.addEventListener('click', () => {
            if (pIsRunning) {
                stopTimer();
                return;
            }

            pIsRunning = true;
            pomoStart.classList.add('running');
            setButtonContent(pomoStart, 'fa-solid fa-pause', 'Pause');

            pTimerInterval = setInterval(() => {
                if (pTimeRemaining > 0) {
                    pTimeRemaining -= 1;
                    updatePomo();
                    return;
                }

                stopTimer();
                alert('Pomodoro complete. Take a break.');
            }, 1000);
        });

        pomoReset.addEventListener('click', () => {
            stopTimer();
            pTimeRemaining = 25 * 60;
            updatePomo();
        });

        updatePomo();
    }

    const lofiLoadBtn = document.getElementById('lofi-load-btn');
    const lofiFrame = document.getElementById('lofi-frame');
    const lofiPlaceholder = document.getElementById('lofi-placeholder');

    if (lofiLoadBtn && lofiFrame && lofiPlaceholder) {
        lofiLoadBtn.addEventListener('click', () => {
            lofiFrame.src = 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1';
            lofiFrame.classList.add('is-active');
            lofiPlaceholder.style.display = 'none';
        });
    }
});
