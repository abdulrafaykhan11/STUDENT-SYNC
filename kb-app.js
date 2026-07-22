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

    const escapeHtml = value => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const scrollToSection = (sectionId, highlight = true) => {
        if (!sectionId) return false;
        const target = document.getElementById(sectionId);
        if (!target) return false;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (highlight) {
            const highlightEl = target.querySelector('.glass-box') || target;
            highlightEl.classList.add('section-highlight');
            setTimeout(() => highlightEl.classList.remove('section-highlight'), 1800);
        }
        return true;
    };

    const bindResourceLink = (anchor, url) => {
        if (!anchor || !url) return;
        const resolved = new URL(url, window.location.href);
        const isSamePage = resolved.pathname === window.location.pathname;
        const sectionId = resolved.hash ? resolved.hash.slice(1) : '';

        if (isSamePage && sectionId) {
            anchor.addEventListener('click', event => {
                event.preventDefault();
                scrollToSection(sectionId);
            });
            return;
        }

        if (!isSamePage && sectionId && !anchor.target) {
            anchor.addEventListener('click', event => {
                event.preventDefault();
                window.location.href = `${resolved.pathname}${resolved.search}${resolved.hash}`;
            });
        }
    };

    /* Site-wide study resources — keeps users on StudentSync */
    const SITE_RESOURCES = {
        'HTML': {
            key: 'html', icon: 'fa-brands fa-html5', color: '#e34c26',
            concept: 'conceptual-mastery.html#html',
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/HTML_Complete_Notes.pdf',
            video: 'conceptual-mastery.html#yt-notes',
            hotTopics: ['Semantic Tags', 'Forms & Input', 'Accessibility', 'Meta Tags']
        },
        'CSS': {
            key: 'css', icon: 'fa-brands fa-css3-alt', color: '#264de4',
            concept: 'conceptual-mastery.html#css',
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/CSS_Complete_Notes.pdf',
            video: 'conceptual-mastery.html#yt-notes',
            hotTopics: ['Flexbox', 'Grid', 'Box Model', 'Media Queries']
        },
        'JavaScript': {
            key: 'javascript', icon: 'fa-brands fa-js', color: '#f7df1e',
            concept: 'conceptual-mastery.html#javascript',
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/JS_Chapterwise_Notes.pdf',
            video: 'conceptual-mastery.html#yt-notes',
            hotTopics: ['DOM Manipulation', 'Events', 'Async/Await', 'Closures']
        },
        'Python': {
            key: 'python', icon: 'fa-brands fa-python', color: '#3776AB',
            concept: 'conceptual-mastery.html#python',
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/Python_Complete_Notes.pdf',
            video: 'conceptual-mastery.html#yt-notes',
            hotTopics: ['Lists & Dicts', 'Functions', 'OOP', 'File Handling']
        },
        'PHP': {
            key: 'php', icon: 'fa-brands fa-php', color: '#777BB4',
            concept: 'conceptual-mastery.html#php',
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/cheatsheets/Php%20Cheatsheet.pdf',
            video: 'conceptual-mastery.html#yt-notes',
            hotTopics: ['Forms & $_POST', 'Sessions', 'PDO', 'Include/Require']
        },
        'MySQL': {
            key: 'mysql', icon: 'fa-solid fa-database', color: '#4479A1',
            concept: 'conceptual-mastery.html#mysql',
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/YouTube/MySQL%20Handbook.pdf',
            video: 'conceptual-mastery.html#yt-notes',
            hotTopics: ['SELECT & JOINs', 'Normalization', 'Indexes', 'Prepared Statements']
        },
        'React': {
            key: 'react', icon: 'fa-brands fa-react', color: '#61DAFB',
            concept: 'conceptual-mastery.html#react',
            notes: 'https://www.newline.co/fullstack-react/assets/media/sGEMe/MNzue/30-days-of-react-ebook-fullstackio.pdf',
            video: 'conceptual-mastery.html#yt-notes',
            hotTopics: ['Components & Props', 'useState', 'useEffect', 'Virtual DOM']
        },
        'Node.js': {
            key: 'nodejs', icon: 'fa-brands fa-node-js', color: '#68A063',
            concept: 'conceptual-mastery.html#nodejs',
            notes: 'https://www.anuragkapur.com/assets/blog/programming/node/PDF-Guide-Node-Andrew-Mead-v3.pdf',
            video: 'conceptual-mastery.html#yt-notes',
            hotTopics: ['Modules', 'Express Routes', 'Event Loop', 'npm & package.json']
        }
    };

    const KB_LINKS = {
        quiz: '#quiz-lab',
        flashcards: '#flashcard-builder',
        feynman: '#concept-connections',
        focus: '#focus-hub',
        quest: '#knowledge-quest',
        crammer: 'conceptual-mastery.html#crammer-section'
    };

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
    const feynmanFeedback = document.getElementById('feynman-feedback');
    const feynmanJargonList = document.getElementById('feynman-jargon-list');
    const feynmanSuggestions = document.getElementById('feynman-suggestions');
    const feynmanRewrite = document.getElementById('feynman-rewrite');
    const feynmanMistakesList = document.getElementById('feynman-mistakes-list');
    const feynmanMistakeCount = document.getElementById('feynman-mistake-count');
    const feynmanSpellingCount = document.getElementById('feynman-spelling-count');
    const feynmanGrammarCount = document.getElementById('feynman-grammar-count');
    const feynmanCopyRewrite = document.getElementById('feynman-copy-rewrite');
    const feynmanApplyRewrite = document.getElementById('feynman-apply-rewrite');
    const feynmanAnalyzeBtn = document.getElementById('feynman-analyze-btn');
    const feynmanOriginalPreview = document.getElementById('feynman-original-preview');
    let feynmanMode = 'simple';
    let lastSimpleRewrite = '';
    let lastPolishRewrite = '';
    let lastSimpleJargon = [];
    let lastPolishJargon = [];

    const jargonMap = {
        'utilize': 'use', 'facilitate': 'help', 'implement': 'build', 'paradigm': 'model',
        'synergy': 'teamwork', 'leverage': 'use', 'methodology': 'method', 'framework': 'structure',
        'juxtapose': 'compare', 'mitigate': 'reduce', 'optimize': 'improve', 'subsequently': 'then',
        'comprehensive': 'complete', 'conceptualize': 'imagine', 'delineate': 'outline',
        'elucidate': 'explain', 'empirical': 'tested', 'heuristic': 'rule of thumb',
        'pedagogical': 'teaching', 'proliferate': 'spread', 'ubiquitous': 'everywhere',
        'ameliorate': 'improve', 'ascertain': 'find out', 'dichotomy': 'split',
        'epistemology': 'study of knowledge', 'obfuscate': 'confuse', 'paradoxical': 'contradictory',
        'quintessential': 'perfect example', 'ramification': 'consequence',
        'furthermore': 'also', 'nevertheless': 'but', 'notwithstanding': 'despite',
        'aforementioned': 'mentioned earlier', 'perpetuate': 'continue', 'substantiate': 'prove',
        'predominantly': 'mostly', 'encompasses': 'includes', 'constitutes': 'makes up',
        'disseminate': 'share', 'efficacy': 'effectiveness', 'exacerbate': 'worsen'
    };
    const jargonSet = new Set(Object.keys(jargonMap));

    const spellingFixes = {
        recieve: 'receive', occured: 'occurred', seperate: 'separate', definately: 'definitely',
        accomodate: 'accommodate', goverment: 'government', enviroment: 'environment',
        knowlege: 'knowledge', writting: 'writing', untill: 'until', beleive: 'believe',
        wierd: 'weird', succesful: 'successful', neccessary: 'necessary', tommorow: 'tomorrow',
        begining: 'beginning', arguement: 'argument', peice: 'piece', thier: 'their',
        alot: 'a lot', allways: 'always', basicly: 'basically', occurence: 'occurrence',
        independant: 'independent', refering: 'referring', similiar: 'similar', uderstand: 'understand'
    };

    const vocabUpgrade = {
        good: 'effective', bad: 'inadequate', big: 'substantial', small: 'minimal',
        use: 'employ', make: 'construct', show: 'demonstrate', help: 'facilitate',
        get: 'obtain', need: 'require', think: 'consider', thing: 'element',
        stuff: 'material', very: 'highly', also: 'furthermore', but: 'however',
        so: 'therefore', because: 'since', like: 'such as', important: 'crucial',
        easy: 'straightforward', hard: 'challenging', many: 'numerous', lot: 'considerable',
        way: 'approach', try: 'attempt', start: 'initiate', end: 'conclude'
    };

    const detectMistakes = (text, words) => {
        const mistakes = [];
        const spellingErrors = [];

        words.forEach(w => {
            const clean = w.toLowerCase().replace(/[^a-z]/g, '');
            if (clean && spellingFixes[clean]) {
                spellingErrors.push({ word: w, fix: spellingFixes[clean], type: 'spelling' });
                mistakes.push({ msg: `Spelling: "${w}" → "${spellingFixes[clean]}"`, type: 'spelling' });
            }
        });

        if (/\s{2,}/.test(text)) {
            mistakes.push({ msg: 'Extra spaces found — use single spaces between words.', type: 'grammar' });
        }
        if (/\b(\w+)\s+\1\b/i.test(text)) {
            mistakes.push({ msg: 'Repeated word detected (e.g. "the the") — remove the duplicate.', type: 'grammar' });
        }

        const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
        sentences.forEach(s => {
            const trimmed = s.trim();
            if (trimmed.length > 1 && /^[a-z]/.test(trimmed)) {
                mistakes.push({ msg: `Capitalization: "${trimmed.slice(0, 30)}..." should start with a capital letter.`, type: 'grammar' });
            }
        });

        if (text.length > 40 && !/[.!?]$/.test(text.trim())) {
            mistakes.push({ msg: 'Missing ending punctuation — add a period, question mark, or exclamation.', type: 'grammar' });
        }
        if (/\bi\b/.test(text)) {
            mistakes.push({ msg: 'Use capital "I" when referring to yourself.', type: 'grammar' });
        }
        if (/\b(its|it's)\b/i.test(text) && /\bits\b/i.test(text) && !/\bit is\b/i.test(text)) {
            mistakes.push({ msg: 'Check "its" (possessive) vs "it\'s" (it is) — make sure you used the right one.', type: 'grammar' });
        }

        const spellingCount = spellingErrors.length;
        const grammarCount = mistakes.filter(m => m.type === 'grammar').length;
        return { mistakes, spellingCount, grammarCount, spellingErrors };
    };

    const buildSimpleRewrite = (text, foundJargon) => {
        let rewritten = text.replace(/\s{2,}/g, ' ').trim();

        foundJargon.forEach(j => {
            if (j.replacement) {
                rewritten = rewritten.replace(new RegExp('\\b' + j.word + '\\b', 'gi'), j.replacement);
            }
        });

        Object.entries(spellingFixes).forEach(([wrong, right]) => {
            rewritten = rewritten.replace(new RegExp('\\b' + wrong + '\\b', 'gi'), right);
        });

        rewritten = rewritten
            .replace(/\bi\b/g, 'I')
            .replace(/\s+/g, ' ')
            .replace(/\b(furthermore|nevertheless|predominantly|subsequently|comprehensive)\b/gi, match => {
                const low = match.toLowerCase();
                if (low === 'furthermore') return 'also';
                if (low === 'nevertheless') return 'but';
                if (low === 'predominantly') return 'mostly';
                if (low === 'subsequently') return 'then';
                return 'complete';
            });

        if (rewritten.length > 0 && !/[.!?]$/.test(rewritten.trim())) {
            rewritten = rewritten.trim() + '.';
        }

        const sentences = rewritten.split(/(?<=[.!?])\s+/).filter(Boolean);
        return sentences.map(s => {
            const t = s.trim();
            return t.charAt(0).toUpperCase() + t.slice(1);
        }).join(' ').trim();
    };

    const buildPolishRewrite = (text, foundJargon) => {
        let polished = buildSimpleRewrite(text, foundJargon);
        polished = polished
            .replace(/\b(use|build|help|show|make|get|need|think|start|end)\b/gi, match => {
                const low = match.toLowerCase();
                if (low === 'use') return 'apply';
                if (low === 'build') return 'create';
                if (low === 'help') return 'support';
                if (low === 'show') return 'demonstrate';
                if (low === 'make') return 'produce';
                if (low === 'get') return 'obtain';
                if (low === 'need') return 'require';
                if (low === 'think') return 'consider';
                if (low === 'start') return 'begin';
                return 'finish';
            })
            .replace(/\b(bad|small|big|very|lot|stuff)\b/gi, match => {
                const low = match.toLowerCase();
                if (low === 'bad') return 'poor';
                if (low === 'small') return 'minimal';
                if (low === 'big') return 'substantial';
                if (low === 'very') return 'highly';
                if (low === 'lot') return 'many';
                return 'material';
            });

        if (polished.length > 0 && !/[.!?]$/.test(polished.trim())) {
            polished = polished.trim() + '.';
        }

        return polished.trim();
    };

    const renderFeynmanRewrite = () => {
        if (!feynmanRewrite) return;
        const text = feynmanMode === 'polish' ? lastPolishRewrite : lastSimpleRewrite;
        const terms = feynmanMode === 'polish' ? lastPolishJargon : lastSimpleJargon;
        if (!text) {
            feynmanRewrite.innerHTML = '<span style="color:var(--text-muted);">Write a short explanation and the rewritten paragraph will appear here.</span>';
            return;
        }

        let html = escapeHtml(text);
        terms.slice().sort((a, b) => b.word.length - a.word.length).forEach(term => {
            const pattern = new RegExp('\\b' + term.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
            const replacement = term.replacement || term.word;
            html = html.replace(pattern, `<span class="feynman-highlight">${escapeHtml(replacement)}</span>`);
        });

        feynmanRewrite.innerHTML = html;
    };

    const highlightJargonInText = (text, foundJargon) => {
        if (!text) return '<span style="color:var(--text-muted);">Your paragraph preview will appear here.</span>';
        let html = escapeHtml(text);
        foundJargon.slice().sort((a, b) => b.word.length - a.word.length).forEach(term => {
            const pattern = new RegExp('\\b' + term.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
            html = html.replace(pattern, match =>
                `<mark class="feynman-jargon-mark" title="${escapeHtml(term.replacement ? `Try: ${term.replacement}` : 'Complex word')}">${match}</mark>`
            );
        });
        return html;
    };

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
        if (text.length === 0) { resetFeynmanUI(); return; }

        const words = text.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const sentences = Math.max(1, text.split(/[.!?]+/).filter(s => s.trim().length > 0).length);
        let syllableCount = 0;
        let foundJargon = [];

        words.forEach(w => {
            const clean = w.toLowerCase().replace(/[^a-z]/g, '');
            if (!clean) return;
            const syl = countSyllables(clean);
            syllableCount += syl;
            if (jargonSet.has(clean) || syl >= 4) {
                if (!foundJargon.find(j => j.word === clean)) {
                    foundJargon.push({ word: clean, replacement: jargonMap[clean] || null });
                }
            }
        });

        const gradeLevel = (0.39 * (wordCount / sentences)) + (11.8 * (syllableCount / wordCount)) - 15.59;
        const clampedGrade = Math.max(0, Math.min(20, gradeLevel));
        let simplicityScore = 100 - ((clampedGrade - 5) / 15 * 100);
        if (wordCount < 4) simplicityScore = Math.max(0, Math.min(50, simplicityScore));
        else simplicityScore = Math.max(0, Math.min(100, Math.round(simplicityScore)));

        updateFeynmanUI(Math.round(simplicityScore), clampedGrade.toFixed(1), foundJargon.length);

        const { mistakes, spellingCount, grammarCount } = detectMistakes(text, words);

        if (feynmanOriginalPreview) {
            feynmanOriginalPreview.innerHTML = highlightJargonInText(text, foundJargon);
        }

        if (wordCount >= 3 && feynmanFeedback) {
            feynmanFeedback.style.display = 'block';

            if (feynmanMistakeCount) feynmanMistakeCount.textContent = mistakes.length;
            if (feynmanSpellingCount) feynmanSpellingCount.textContent = spellingCount;
            if (feynmanGrammarCount) feynmanGrammarCount.textContent = grammarCount;

            if (feynmanMistakesList) {
                feynmanMistakesList.innerHTML = mistakes.length === 0
                    ? '<span style="color:var(--accent-mint); font-size:0.9rem;"><i class="fa-solid fa-check"></i> No spelling or grammar mistakes found!</span>'
                    : mistakes.map(m => `<div class="feynman-mistake"><i class="fa-solid fa-circle-xmark"></i><span>${m.msg}</span></div>`).join('');
            }

            feynmanJargonList.innerHTML = foundJargon.length === 0
                ? '<span style="color:var(--accent-mint); font-size:0.9rem;">No jargon found — great job!</span>'
                : foundJargon.map(j => `<span style="background:rgba(255,64,129,0.12); border:1px solid rgba(255,64,129,0.3); color:#ff5252; padding:0.3rem 0.7rem; border-radius:50px; font-size:0.82rem; font-weight:600;">${j.word}${j.replacement ? ` → <span style="color:var(--accent-mint);">${j.replacement}</span>` : ''}</span>`).join('');

            let tips = [];
            const avgWordsPerSentence = wordCount / sentences;
            if (mistakes.length > 0) tips.push('Fix the spelling and grammar errors listed above first.');
            if (avgWordsPerSentence > 20) tips.push('Your sentences are long (avg ' + Math.round(avgWordsPerSentence) + ' words). Break them into shorter ones.');
            if (foundJargon.length > 0) tips.push('Replace jargon words with simpler alternatives — or use the Polished tab for better vocabulary.');
            if (wordCount < 20) tips.push('Your explanation is short. Add an example or analogy.');
            if (clampedGrade > 12) tips.push('Text reads at college+ level. Aim for Grade 8 for Feynman clarity.');
            if (mistakes.length === 0 && clampedGrade <= 8 && foundJargon.length === 0) tips.push('Excellent! Crystal-clear explanation with no errors.');
            if (tips.length === 0) tips.push('Decent work. Try the Polished Version tab to upgrade vocabulary.');
            feynmanSuggestions.innerHTML = tips.map(t => `<li style="margin-bottom:0.4rem;">${t}</li>`).join('');

            lastSimpleRewrite = buildSimpleRewrite(text, foundJargon);
            lastPolishRewrite = buildPolishRewrite(text, foundJargon);
            lastSimpleJargon = foundJargon;
            lastPolishJargon = foundJargon;
            if (lastSimpleRewrite === text.trim() && foundJargon.length === 0 && mistakes.length === 0) {
                lastSimpleRewrite = 'Your text is already clear — no changes needed!';
            }
            if (lastPolishRewrite === text.trim() && mistakes.length === 0) {
                lastPolishRewrite = 'Your text is already polished — no upgrades needed!';
            }
            renderFeynmanRewrite();
        } else if (feynmanFeedback) {
            feynmanFeedback.style.display = 'none';
        }
    };

    const updateFeynmanUI = (score, grade, jargon) => {
        feynmanScoreVal.textContent = score;
        feynmanGrade.textContent = grade;
        feynmanJargon.textContent = jargon;
        const dashOffset = 283 - (283 * (score / 100));
        feynmanGauge.style.strokeDashoffset = dashOffset;
        let color = 'var(--text-muted)', statusText = '';
        if (score >= 80) { color = 'var(--accent-mint)'; statusText = 'Crystal Clear'; }
        else if (score >= 50) { color = 'var(--accent-gold)'; statusText = 'Getting There'; }
        else { color = 'var(--accent-coral)'; statusText = 'Too Complex'; }
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
        if (feynmanFeedback) feynmanFeedback.style.display = 'none';
        if (feynmanOriginalPreview) {
            feynmanOriginalPreview.innerHTML = '<span style="color:var(--text-muted);">Your paragraph preview will appear here.</span>';
        }
    };

    if (feynmanInput) {
        let debounceTimer;
        feynmanInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(analyzeText, 300);
        });
        feynmanAnalyzeBtn?.addEventListener('click', analyzeText);
        feynmanClear?.addEventListener('click', () => {
            feynmanInput.value = '';
            resetFeynmanUI();
        });

        document.querySelectorAll('.feynman-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.feynman-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                feynmanMode = tab.dataset.feynmanMode || 'simple';
                renderFeynmanRewrite();
            });
        });

        feynmanCopyRewrite?.addEventListener('click', () => {
            const text = feynmanMode === 'polish' ? lastPolishRewrite : lastSimpleRewrite;
            navigator.clipboard?.writeText(text).then(() => {
                feynmanCopyRewrite.textContent = 'Copied!';
                setTimeout(() => { feynmanCopyRewrite.innerHTML = '<i class="fa-solid fa-copy"></i> Copy'; }, 1500);
            });
        });

        feynmanApplyRewrite?.addEventListener('click', () => {
            const text = feynmanMode === 'polish' ? lastPolishRewrite : lastSimpleRewrite;
            if (text && !text.startsWith('Your text is already')) {
                feynmanInput.value = text;
                analyzeText();
            }
        });

        resetFeynmanUI();
    }

    /* =========================================
       Feature 1: Concept Connections Map
       ========================================= */
    const conceptMapData = {
        html: { title: 'HTML', icon: 'fa-brands fa-html5', description: 'The structure beneath every web experience. Start here to give content meaning and order.', unlocks: ['Accessible page structure', 'Forms and semantic layouts', 'A solid CSS foundation'], link: 'conceptual-mastery.html' },
        css: { title: 'CSS', icon: 'fa-brands fa-css3-alt', description: 'CSS turns structure into a polished experience—layouts, colours, responsive design, and motion.', unlocks: ['Responsive layouts', 'Modern visual design', 'Animation and interaction polish'], link: 'conceptual-mastery.html' },
        javascript: { title: 'JavaScript', icon: 'fa-brands fa-js', description: 'The language that makes web pages respond, calculate, and come alive.', unlocks: ['Interactive interfaces', 'React components', 'Server-side logic with Node.js'], link: 'conceptual-mastery.html' },
        react: { title: 'React', icon: 'fa-brands fa-react', description: 'Build fast, reusable interfaces by combining JavaScript knowledge into focused components.', unlocks: ['Component-based UI', 'State and event handling', 'Modern front-end projects'], link: 'conceptual-mastery.html' },
        node: { title: 'Node.js', icon: 'fa-brands fa-node-js', description: 'Use JavaScript beyond the browser to create APIs, tools, and full-stack applications.', unlocks: ['Backend APIs', 'Package ecosystem', 'Full-stack JavaScript'], link: 'conceptual-mastery.html' },
        php: { title: 'PHP', icon: 'fa-brands fa-php', description: 'A practical server-side language for processing forms, sessions, and dynamic websites.', unlocks: ['Server-side rendering', 'Form processing', 'Database-driven pages'], link: 'conceptual-mastery.html' },
        mysql: { title: 'MySQL', icon: 'fa-solid fa-database', description: 'Store, organise, and query the information that powers real applications.', unlocks: ['Relational database design', 'SQL queries', 'PHP and Node.js data layers'], link: 'conceptual-mastery.html' }
    };
    const conceptNodes = document.querySelectorAll('.concept-node[data-concept]');
    const conceptDetailIcon = document.getElementById('concept-detail-icon');
    const conceptDetailTitle = document.getElementById('concept-detail-title');
    const conceptDetailDescription = document.getElementById('concept-detail-description');
    const conceptDetailList = document.getElementById('concept-detail-list');
    const conceptDetailLink = document.getElementById('concept-detail-link');

    const selectConceptNode = key => {
        const concept = conceptMapData[key];
        if (!concept || !conceptDetailTitle) return;
        conceptNodes.forEach(node => node.classList.toggle('active', node.dataset.concept === key));
        conceptDetailIcon.innerHTML = `<i class="${concept.icon}"></i>`;
        conceptDetailTitle.textContent = concept.title;
        conceptDetailDescription.textContent = concept.description;
        conceptDetailList.replaceChildren(...concept.unlocks.map(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            return listItem;
        }));
        conceptDetailLink.href = concept.link;
        conceptDetailLink.innerHTML = `<i class="fa-solid fa-compass"></i> Explore ${concept.title}`;
    };
    conceptNodes.forEach(node => node.addEventListener('click', () => selectConceptNode(node.dataset.concept)));

    const initialKbHash = window.location.hash.slice(1);
    if (initialKbHash) {
        setTimeout(() => scrollToSection(initialKbHash), 300);
    }
    window.addEventListener('hashchange', () => {
        const sectionId = window.location.hash.slice(1);
        if (sectionId) scrollToSection(sectionId);
    });

    /* =========================================
       Feature 2: Knowledge Quest Arena
       ========================================= */
    const questTopicsEl = document.getElementById('quest-topics');
    const questPipeline = document.getElementById('quest-pipeline');
    const questBlitzQuestions = document.getElementById('quest-blitz-questions');
    const questBlitzScore = document.getElementById('quest-blitz-score');
    const questTopicLabel = document.getElementById('quest-topic-label');
    const questXpFill = document.getElementById('quest-xp-fill');
    const questXpVal = document.getElementById('quest-xp-val');
    const questXpText = document.getElementById('quest-xp-text');

    const QUEST_BLITZ = {
        html: [
            { q: 'Which tag gives semantic meaning to main page content?', opts: ['<div>', '<main>', '<span>'], a: 1 },
            { q: 'What attribute makes an input field required?', opts: ['mandatory', 'required', 'must'], a: 1 },
            { q: 'Which tag creates a hyperlink?', opts: ['<link>', '<a>', '<href>'], a: 1 }
        ],
        css: [
            { q: 'Which property controls space INSIDE an element border?', opts: ['margin', 'padding', 'gap'], a: 1 },
            { q: 'Flexbox main axis direction is set by:', opts: ['flex-flow', 'flex-direction', 'align-items'], a: 1 },
            { q: 'Which unit is relative to root font size?', opts: ['em', 'rem', 'px'], a: 1 }
        ],
        javascript: [
            { q: 'Which operator checks value AND type?', opts: ['==', '===', '='], a: 1 },
            { q: 'const variables can be:', opts: ['reassigned', 'redeclared', 'neither'], a: 2 },
            { q: 'DOM stands for:', opts: ['Document Object Model', 'Data Object Method', 'Dynamic Output Module'], a: 0 }
        ],
        python: [
            { q: 'Python uses what for code blocks instead of braces?', opts: ['semicolons', 'indentation', 'parentheses'], a: 1 },
            { q: 'Which is a mutable data type?', opts: ['tuple', 'string', 'list'], a: 2 },
            { q: 'def keyword is used to:', opts: ['define a function', 'delete a file', 'declare a variable'], a: 0 }
        ],
        php: [
            { q: 'PHP runs on the:', opts: ['browser', 'server', 'database'], a: 1 },
            { q: 'Which superglobal holds form POST data?', opts: ['$_GET', '$_POST', '$_SESSION'], a: 1 },
            { q: 'Prepared statements prevent:', opts: ['XSS', 'SQL Injection', 'CSRF'], a: 1 }
        ],
        mysql: [
            { q: 'Which SQL command retrieves data?', opts: ['INSERT', 'SELECT', 'DELETE'], a: 1 },
            { q: 'Primary key ensures:', opts: ['speed only', 'unique row identity', 'encryption'], a: 1 },
            { q: 'JOIN combines data from:', opts: ['multiple tables', 'multiple databases only', 'CSV files'], a: 0 }
        ],
        react: [
            { q: 'React UI is built from:', opts: ['templates', 'components', 'directives'], a: 1 },
            { q: 'useState returns:', opts: ['a boolean', 'state + setter', 'a DOM node'], a: 1 },
            { q: 'Virtual DOM helps React:', opts: ['store cookies', 'update efficiently', 'run on server only'], a: 1 }
        ],
        nodejs: [
            { q: 'Node.js runs JavaScript on the:', opts: ['GPU', 'server', 'CSS engine'], a: 1 },
            { q: 'npm is used to:', opts: ['manage packages', 'style pages', 'query databases'], a: 0 },
            { q: 'Node is event-driven and:', opts: ['blocking', 'non-blocking', 'single-threaded only on GPU'], a: 1 }
        ]
    };

    let activeQuestKey = 'html';
    let questProgress = {};
    let blitzScore = { correct: 0, total: 0 };

    const getQuestSteps = key => {
        const res = Object.values(SITE_RESOURCES).find(r => r.key === key);
        if (!res) return [];
        const label = Object.keys(SITE_RESOURCES).find(k => SITE_RESOURCES[k].key === key);
        return [
            { id: 'learn', icon: 'fa-solid fa-layer-group', title: 'Learn', desc: 'Break down the core idea', link: res.concept, linkText: `Concept Deconstructor — ${label}`, xp: 25 },
            { id: 'watch', icon: 'fa-brands fa-youtube', title: 'Watch', desc: 'Video tutorial + notes', link: res.video, linkText: 'Video & Notes Hub', xp: 25 },
            { id: 'practice', icon: 'fa-solid fa-brain', title: 'Practice', desc: 'Generate recall quiz', link: KB_LINKS.quiz, linkText: 'Active Recall Quiz Lab', xp: 25 },
            { id: 'recall', icon: 'fa-solid fa-clone', title: 'Recall', desc: 'Build 5 flashcards', link: KB_LINKS.flashcards, linkText: 'Flashcard Builder', xp: 25 }
        ];
    };

    const getQuestXP = key => {
        const prog = questProgress[key] || {};
        const steps = getQuestSteps(key);
        let xp = steps.filter(s => prog[s.id]).length * 25;
        if (prog.blitzMaster) xp += 50;
        return xp;
    };

    const renderQuest = () => {
        if (!questPipeline || !questTopicsEl) return;
        const res = Object.values(SITE_RESOURCES).find(r => r.key === activeQuestKey);
        const label = Object.keys(SITE_RESOURCES).find(k => SITE_RESOURCES[k].key === activeQuestKey) || 'Topic';
        if (questTopicLabel) questTopicLabel.textContent = label + ' Quest';
        const xp = getQuestXP(activeQuestKey);
        const maxXp = 150;
        if (questXpFill) questXpFill.style.width = Math.min(100, (xp / maxXp) * 100) + '%';
        if (questXpVal) questXpVal.textContent = xp + ' XP';
        if (questXpText) questXpText.textContent = xp >= maxXp ? 'Quest Mastered!' : `${Math.round((xp / maxXp) * 100)}% complete`;

        questTopicsEl.innerHTML = Object.entries(SITE_RESOURCES).map(([name, r]) =>
            `<button type="button" class="quest-topic-btn${r.key === activeQuestKey ? ' active' : ''}" data-quest="${r.key}">
                <i class="${r.icon}" style="color:${r.color}"></i> ${name}
            </button>`
        ).join('');

        const prog = questProgress[activeQuestKey] || {};
        questPipeline.innerHTML = getQuestSteps(activeQuestKey).map(step => `
            <div class="quest-node${prog[step.id] ? ' done' : ''}" data-step="${step.id}">
                <div class="quest-node-icon"><i class="${step.icon}"></i></div>
                <h4>${step.title}</h4>
                <p>${step.desc}</p>
                <a href="${step.link}"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${step.linkText}</a>
                <br><button type="button" class="quest-node-check${prog[step.id] ? ' is-done' : ''}" data-step-check="${step.id}">
                    ${prog[step.id] ? '<i class="fa-solid fa-check"></i> Done' : 'Mark Done'}
                </button>
            </div>
        `).join('');

        questPipeline.querySelectorAll('a[href]').forEach(link => bindResourceLink(link, link.getAttribute('href')));

        renderBlitzQuiz();
    };

    const renderBlitzQuiz = () => {
        if (!questBlitzQuestions) return;
        const questions = QUEST_BLITZ[activeQuestKey] || [];
        blitzScore = { correct: 0, total: questions.length };
        const res = Object.values(SITE_RESOURCES).find(r => r.key === activeQuestKey);
        const reviseLink = res ? res.concept : KB_LINKS.quest;

        questBlitzQuestions.innerHTML = questions.map((q, qi) => `
            <div class="quest-blitz-q" data-blitz="${qi}">
                <h4>${qi + 1}. ${escapeHtml(q.q)}</h4>
                <div class="quest-blitz-opts">
                    ${q.opts.map((opt, oi) => `<button type="button" class="quest-blitz-opt" data-q="${qi}" data-opt="${oi}"><span class="quest-opt-letter">${String.fromCharCode(65 + oi)}</span><span class="quest-opt-text">${escapeHtml(opt)}</span></button>`).join('')}
                </div>
                <p class="quest-blitz-hint" style="display:none; color:var(--text-muted); font-size:0.82rem; margin-top:0.5rem;">
                    Wrong? Revise at <a href="${reviseLink}">Concept Deconstructor</a>
                </p>
            </div>
        `).join('');

        questBlitzQuestions.querySelectorAll('a[href]').forEach(link => bindResourceLink(link, link.getAttribute('href')));

        if (questBlitzScore) questBlitzScore.textContent = `Score: 0/${questions.length}`;
    };

    if (questTopicsEl && questPipeline) {
        questTopicsEl.addEventListener('click', e => {
            const btn = e.target.closest('[data-quest]');
            if (!btn) return;
            activeQuestKey = btn.dataset.quest;
            renderQuest();
        });

        questPipeline.addEventListener('click', e => {
            const checkBtn = e.target.closest('[data-step-check]');
            if (!checkBtn) return;
            const stepId = checkBtn.dataset.stepCheck;
            if (!questProgress[activeQuestKey]) questProgress[activeQuestKey] = {};
            questProgress[activeQuestKey][stepId] = !questProgress[activeQuestKey][stepId];
            renderQuest();
        });

        questBlitzQuestions?.addEventListener('click', e => {
            const opt = e.target.closest('.quest-blitz-opt');
            if (!opt || opt.disabled) return;
            const qIdx = parseInt(opt.dataset.q, 10);
            const oIdx = parseInt(opt.dataset.opt, 10);
            const questions = QUEST_BLITZ[activeQuestKey] || [];
            const card = opt.closest('.quest-blitz-q');
            const isCorrect = questions[qIdx]?.a === oIdx;

            card.querySelectorAll('.quest-blitz-opt').forEach(b => {
                b.disabled = true;
                if (parseInt(b.dataset.opt, 10) === questions[qIdx].a) b.classList.add('correct');
                if (parseInt(b.dataset.opt, 10) === oIdx && !isCorrect) b.classList.add('wrong');
            });
            if (!isCorrect) {
                card.querySelector('.quest-blitz-hint').style.display = 'block';
            } else {
                blitzScore.correct++;
            }

            const answered = questBlitzQuestions.querySelectorAll('.quest-blitz-opt:disabled').length / Math.max(1, questions.length);
            if (questBlitzScore) questBlitzScore.textContent = `Score: ${blitzScore.correct}/${questions.length}`;

            if (answered >= questions.length && blitzScore.correct === questions.length) {
                if (!questProgress[activeQuestKey]) questProgress[activeQuestKey] = {};
                questProgress[activeQuestKey].blitzMaster = true;
                if (questXpText) questXpText.textContent = 'Blitz Master! +50 XP bonus';
                renderQuest();
            }
        });

        renderQuest();
    }

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

    const plannerTopics = [];

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

    const buildStudyTasks = (topic, hours) => {
        const res = SITE_RESOURCES[topic.name];
        if (!res) return [{
            label: `${topic.name} review`,
            mins: Math.round(hours * 60),
            topic: topic.name,
            links: []
        }];

        const tasks = [];
        const phases = [
            { pct: 0.35, label: 'Concept Breakdown', icon: 'fa-layer-group', url: res.concept, color: res.color },
            { pct: 0.25, label: 'Study Notes PDF', icon: 'fa-file-pdf', url: res.notes, color: '#00d1b2', external: true },
            { pct: 0.20, label: 'Active Recall Quiz', icon: 'fa-brain', url: KB_LINKS.quiz, color: '#ff5252' },
            { pct: 0.10, label: 'Flashcard Drill', icon: 'fa-clone', url: KB_LINKS.flashcards, color: '#8e24aa' },
            { pct: 0.10, label: 'Concept Connections Map', icon: 'fa-diagram-project', url: KB_LINKS.feynman, color: '#00d1b2' }
        ];

        phases.forEach(phase => {
            const mins = Math.max(15, Math.round(hours * 60 * phase.pct));
            if (mins >= 10) {
                tasks.push({
                    label: phase.label,
                    mins,
                    topic: topic.name,
                    hotTopics: res.hotTopics,
                    links: [
                        { label: phase.label, url: phase.url, icon: phase.icon, color: phase.color, external: phase.external }
                    ]
                });
            }
        });
        return tasks;
    };

    const renderScheduleTask = task => {
        const card = document.createElement('div');
        card.className = 'schedule-task-card';
        const hotHint = task.hotTopics ? `<div style="color:var(--text-muted); font-size:0.75rem; margin-top:0.25rem;">Focus: ${task.hotTopics.slice(0, 2).join(', ')}</div>` : '';
        card.innerHTML = `<strong>${task.topic} — ${task.label}</strong> <span style="color:var(--accent-gold); font-size:0.8rem;">(${task.mins} min)</span>${hotHint}`;
        const links = document.createElement('div');
        links.className = 'schedule-resource-links';
        task.links.forEach(l => {
            const a = document.createElement('a');
            a.href = l.url;
            if (l.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
            a.style.borderColor = l.color + '44';
            a.innerHTML = `<i class="fa-solid ${l.icon}"></i> ${escapeHtml(l.label)}`;
            bindResourceLink(a, l.url);
            links.appendChild(a);
        });
        card.appendChild(links);
        return card;
    };

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

        const name = plannerTopic.value;
        if (!name) {
            alert('Please select a course/topic from the dropdown first.');
            return;
        }
        
        // Prevent adding the same topic multiple times
        if (plannerTopics.some(t => t.name === name)) {
            alert('You have already added this topic.');
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

        // Spread individual study phases across the lightest day. Assigning a full
        // topic to one day creates a very tall first card while later days look empty.
        plannerTopics
            .slice()
            .sort((a, b) => getTopicWeight(b) - getTopicWeight(a))
            .flatMap(topic => buildStudyTasks(topic, getTopicHours(topic)))
            .sort((a, b) => b.mins - a.mins)
            .forEach(task => {
                const targetDay = days.reduce((best, day) => day.load < best.load ? day : best, days[0]);
                targetDay.tasks.push(task);
                targetDay.load += task.mins;
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

            const list = document.createElement('div');
            if (day.tasks.length) {
                day.tasks.forEach(task => list.appendChild(renderScheduleTask(task)));
            } else {
                const empty = document.createElement('div');
                empty.className = 'schedule-task-card schedule-light-day';
                empty.innerHTML = `<strong>Light Review Day</strong><div class="schedule-resource-links" style="margin-top:0.5rem;">
                    <a href="${KB_LINKS.flashcards}"><i class="fa-solid fa-clone"></i> Flashcard Review</a>
                    <a href="${KB_LINKS.quest}"><i class="fa-solid fa-bolt"></i> Knowledge Quest</a>
                    <a href="${KB_LINKS.focus}"><i class="fa-solid fa-headphones"></i> Focus Hub</a>
                </div>`;
                empty.querySelectorAll('a[href]').forEach(link => bindResourceLink(link, link.getAttribute('href')));
                list.appendChild(empty);
            }

            if (day.load > hoursPerDay * 60) {
                const warning = document.createElement('div');
                warning.className = 'schedule-task-card';
                warning.style.borderColor = 'rgba(255,64,129,0.3)';
                warning.innerHTML = `<strong style="color:var(--accent-coral);">Heavy day: ${Math.round(day.load / 60 * 10) / 10}h planned</strong><span style="display:block; color:var(--text-muted); font-size:0.8rem; margin-top:0.3rem;">Consider moving a topic or increasing daily hours.</span>`;
                list.appendChild(warning);
            }

            card.append(heading, dateHint, list);
            plannerSchedule.appendChild(card);
        });
    };

    if (plannerDate && plannerAdd && plannerGenerate) {
        plannerDate.value = formatDateValue(addDays(new Date(), 7));
        plannerAdd.addEventListener('click', addPlannerTopic);
        plannerGenerate.addEventListener('click', buildPlannerSchedule);
        plannerHours?.addEventListener('input', buildPlannerSchedule);
        plannerDate.addEventListener('change', buildPlannerSchedule);
        renderPlannerTopics();
        buildPlannerSchedule();
    }

    /* =========================================
       Feature 4: Custom Flashcard Deck Builder
       ========================================= */
    const fcBtn = document.getElementById('fc-build-btn');
    const fcClear = document.getElementById('fc-clear-deck');
    const fcQ = document.getElementById('fc-q');
    const fcA = document.getElementById('fc-a');
    const fc3d = document.getElementById('fc-3d');
    const fcFront = document.getElementById('fc-front-text');
    const fcBack = document.getElementById('fc-back-text');
    
    // Deck UI
    const fcDeckCount = document.getElementById('fc-deck-count');
    const fcNav = document.getElementById('fc-nav');
    const fcPrev = document.getElementById('fc-prev');
    const fcNext = document.getElementById('fc-next');
    const fcCardIndex = document.getElementById('fc-card-index');

    let flashcardDeck = [];
    let currentCardIndex = 0;

    const updateDeckUI = () => {
        fcDeckCount.textContent = `${flashcardDeck.length} / 5 cards`;
        
        if (flashcardDeck.length > 0) {
            fcNav.style.display = 'flex';
            fcCardIndex.textContent = `Card ${currentCardIndex + 1} of ${flashcardDeck.length}`;
            
            // Render current card
            const card = flashcardDeck[currentCardIndex];
            
            const frontWrap = document.createElement('div');
            const title = document.createElement('h3');
            title.textContent = card.q;
            const hint = document.createElement('p');
            hint.textContent = 'Click to flip';
            hint.className = 'fc-hint';
            frontWrap.append(title, hint);
            
            const backText = document.createElement('p');
            backText.textContent = card.a;
            
            fcFront.replaceChildren(frontWrap);
            fcBack.replaceChildren(backText);
            
            // Always show front when navigating
            fc3d.classList.remove('is-flipped');
            
            // Button states
            fcPrev.style.opacity = currentCardIndex === 0 ? '0.3' : '1';
            fcPrev.style.pointerEvents = currentCardIndex === 0 ? 'none' : 'auto';
            fcNext.style.opacity = currentCardIndex === flashcardDeck.length - 1 ? '0.3' : '1';
            fcNext.style.pointerEvents = currentCardIndex === flashcardDeck.length - 1 ? 'none' : 'auto';
            
        } else {
            fcNav.style.display = 'none';
            // Reset to empty state
            fcFront.innerHTML = `<div style="color: var(--text-muted);"><i class="fa-solid fa-wand-magic-sparkles" style="font-size: 2rem; margin-bottom: 15px; color: var(--accent-violet);"></i><br>Your question will appear here.<br>Click to flip.</div>`;
            fcBack.textContent = 'Your answer will appear here.';
            fc3d.classList.remove('is-flipped');
        }
    };

    if (fcBtn && fc3d) {
        fcBtn.addEventListener('click', () => {
            if (flashcardDeck.length >= 5) {
                alert('Maximum deck size is 5 cards. Please clear the deck to start over.');
                return;
            }
            
            const question = fcQ.value.trim();
            const answer = fcA.value.trim();
            
            if (!question || !answer) {
                alert('Please enter both a question and an answer.');
                return;
            }
            
            flashcardDeck.push({ q: question, a: answer });
            currentCardIndex = flashcardDeck.length - 1; // Jump to new card
            
            fcQ.value = '';
            fcA.value = '';
            
            updateDeckUI();
            
            // Pop animation
            fc3d.classList.add('pop');
            setTimeout(() => fc3d.classList.remove('pop'), 220);
        });

        fcClear?.addEventListener('click', () => {
            if(confirm('Are you sure you want to clear your current flashcard deck?')) {
                flashcardDeck = [];
                currentCardIndex = 0;
                updateDeckUI();
            }
        });

        fcPrev?.addEventListener('click', () => {
            if (currentCardIndex > 0) {
                currentCardIndex--;
                updateDeckUI();
            }
        });
        
        fcNext?.addEventListener('click', () => {
            if (currentCardIndex < flashcardDeck.length - 1) {
                currentCardIndex++;
                updateDeckUI();
            }
        });

        fc3d.addEventListener('click', () => {
            if (flashcardDeck.length > 0) {
                fc3d.classList.toggle('is-flipped');
            }
        });
        
        fc3d.addEventListener('keydown', e => {
            if ((e.key === 'Enter' || e.key === ' ') && flashcardDeck.length > 0) {
                e.preventDefault();
                fc3d.classList.toggle('is-flipped');
            }
        });
        
        updateDeckUI();
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

        const candidates = [];

        // One paragraph can have only a few sentences. Build a separate question
        // for each meaningful term so the selected 3, 5, or 8 count is respected.
        sentences.forEach(sentence => {
            const sentenceTerms = keywords
                .filter(keyword => new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(sentence))
                .slice(0, 4);

            sentenceTerms.forEach(answer => {
                const distractors = shuffle(keywords.filter(keyword => keyword !== answer)).slice(0, 3);
                if (distractors.length < 3) return;
                const termPattern = new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                candidates.push({
                    prompt: `Which key term completes this idea: “${sentence.replace(termPattern, '________')}”`,
                    answer,
                    options: shuffle([answer, ...distractors]),
                    explanation: sentence
                });
            });
        });

        return shuffle(candidates).slice(0, limit);
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
