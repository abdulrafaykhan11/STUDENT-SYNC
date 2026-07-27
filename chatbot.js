document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.site-chatbot')) return;

    const pages = [
        {
            key: 'home',
            title: 'Home',
            url: 'index.html',
            icon: 'fa-house',
            keywords: ['home', 'start', 'features', 'challenge', 'student sync', 'studentsync'],
            answer: 'StudentSync ka home page saare student challenges ka overview deta hai: commute, routes, civic reports, concepts, notes, mentorship aur city guide.'
        },
        {
            key: 'notes',
            title: 'Knowledge Base / Notes',
            url: 'knowledge-base.html',
            icon: 'fa-book-open',
            keywords: ['notes', 'note', 'pdf', 'study', 'resource', 'resources', 'knowledge', 'quiz', 'flashcard', 'feynman', 'pomodoro', 'download'],
            answer: 'Notes aur study resources ke liye Knowledge Base page open karein. Wahan Feynman Engine, flashcards, quiz lab, focus hub aur curated learning tools available hain.'
        },
        {
            key: 'concepts',
            title: 'Conceptual Mastery',
            url: 'conceptual-mastery.html',
            icon: 'fa-brain',
            keywords: ['concept', 'conceptual', 'cramming', 'understanding', 'memorization', 'youtube', 'video', 'learn'],
            answer: 'Conceptual Mastery page rote learning ke bajaye real understanding par focus karta hai. Isme concept deconstructor, watch/download area aur night-before planner milta hai.'
        },
        {
            key: 'transit',
            title: 'Transit Economics',
            url: 'transit-economics.html',
            icon: 'fa-wallet',
            keywords: ['transport', 'transit', 'fare', 'cost', 'bus', 'ride', 'careem', 'uber', 'commute', 'budget', 'surge'],
            answer: 'Transit Economics page commute cost compare karta hai: bus, ride-hailing, personal transport, semester budget aur peak surge departure planning.'
        },
        {
            key: 'routes',
            title: 'Route Intelligence',
            url: 'route-intelligence.html',
            icon: 'fa-route',
            keywords: ['route', 'road', 'traffic', 'alternate', 'safe route', 'damaged', 'gridlock', 'campus route'],
            answer: 'Route Intelligence page Karachi routes, damaged roads, safer alternates aur campus travel signals ke liye bana hai.'
        },
        {
            key: 'civic',
            title: 'Civic Voice Hub',
            url: 'civic-voice.html',
            icon: 'fa-bullhorn',
            keywords: ['complaint', 'complain', 'report', 'civic', 'issue', 'campus issue', 'problem', 'voice'],
            answer: 'Civic Voice Hub par campus ya commute issues report, track aur discuss kar sakte hain. Ye student complaints ko organized feed me convert karta hai.'
        },
        {
            key: 'mentor',
            title: 'Strategic Mentorship',
            url: 'strategic-mentorship.html',
            icon: 'fa-compass',
            keywords: ['mentor', 'mentorship', 'career', 'roadmap', 'resume', 'interview', 'alumni', 'guidance', 'path'],
            answer: 'Strategic Mentorship page career guidance ke liye hai: mentor directory, roadmap generator, resume roaster, mock interview aur alumni advice.'
        },
        {
            key: 'city',
            title: 'Karachi City Guide',
            url: 'city-guide.html',
            icon: 'fa-map-location-dot',
            keywords: ['city', 'karachi', 'hostel', 'rent', 'area', 'relocation', 'move', 'campus area', 'mess', 'safety'],
            answer: 'Karachi City Guide out-station students ke liye hai. Campus choose karke nearby areas, rent, commute, budget aur move-in checklist plan hoti hai.'
        },
        {
            key: 'register',
            title: 'Registration / Join Now',
            url: 'contact.html',
            icon: 'fa-user-plus',
            keywords: ['register', 'registration', 'join', 'contact', 'form', 'apply', 'signup', 'sign up', 'admission'],
            answer: 'Join Now ya registration ke liye Contact page par institute registration form fill karein. Successful submission ke baad ID card preview/download option milta hai.'
        },
        {
            key: 'about',
            title: 'About StudentSync',
            url: 'about.html',
            icon: 'fa-circle-info',
            keywords: ['about', 'mission', 'team', 'vision', 'future', 'arsenal'],
            answer: 'About page StudentSync ki mission, platform features aur future vision explain karta hai.'
        }
    ];

    const greetings = ['hi', 'hello', 'hey', 'salam', 'assalam', 'aoa', 'help', 'start'];
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const currentPage = pages.find(page => page.url === currentFile);

    const bot = document.createElement('section');
    bot.className = 'site-chatbot';
    bot.setAttribute('aria-label', 'StudentSync website chatbot');
    bot.innerHTML = `
        <button class="chatbot-toggle" type="button" aria-label="Open StudentSync chat" aria-expanded="false">
            <i class="fa-solid fa-message"></i>
        </button>
        <div class="chatbot-panel" aria-hidden="true">
            <div class="chatbot-header">
                <div>
                    <span class="chatbot-kicker">StudentSync AI</span>
                    <h2>Website Helper</h2>
                </div>
                <button class="chatbot-close" type="button" aria-label="Close chat">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="chatbot-messages" role="log" aria-live="polite"></div>
            <div class="chatbot-chips" aria-label="Quick website questions"></div>
            <form class="chatbot-form">
                <input class="chatbot-input" type="text" autocomplete="off" placeholder="Ask about notes, routes, mentor..." aria-label="Ask a website question">
                <button class="chatbot-send" type="submit" aria-label="Send message">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(bot);

    const toggle = bot.querySelector('.chatbot-toggle');
    const panel = bot.querySelector('.chatbot-panel');
    const close = bot.querySelector('.chatbot-close');
    const messages = bot.querySelector('.chatbot-messages');
    const chips = bot.querySelector('.chatbot-chips');
    const form = bot.querySelector('.chatbot-form');
    const input = bot.querySelector('.chatbot-input');

    const quickQuestions = [
        { label: 'Notes', text: 'Notes kahan milenge?' },
        { label: 'Transport', text: 'Commute cost kaise compare karun?' },
        { label: 'Routes', text: 'Safe route information kahan hai?' },
        { label: 'Mentor', text: 'Mentorship ke liye kahan jaun?' },
        { label: 'City Guide', text: 'Karachi me hostel aur rent ka plan chahiye' }
    ];

    function normalize(text) {
        return text.toLowerCase().replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function makeLink(page, label = 'Open page') {
        return `<a class="chatbot-link" href="${page.url}">${label} <i class="fa-solid fa-arrow-right"></i></a>`;
    }

    function addMessage(type, html) {
        const message = document.createElement('div');
        message.className = `chatbot-message ${type}`;
        message.innerHTML = html;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function getPageList() {
        return pages
            .filter(page => !['home'].includes(page.key))
            .map(page => `<a href="${page.url}"><i class="fa-solid ${page.icon}"></i>${page.title}</a>`)
            .join('');
    }

    function answerQuestion(question) {
        const clean = normalize(question);

        if (!clean) {
            return 'Website se related sawal type karein, jaise notes, routes, transport, mentorship ya registration.';
        }

        if (greetings.some(word => clean === word || clean.includes(`${word} `))) {
            const locationHint = currentPage ? `Abhi aap ${currentPage.title} page par hain.` : 'Abhi aap StudentSync website par hain.';
            return `${locationHint} Main sirf is website ke pages, features aur links ke baare me help kar sakta hoon.`;
        }

        const pageRequestWords = ['page', 'pages', 'feature', 'features', 'section', 'sections', 'options', 'link', 'links'];
        const wantsPages = pageRequestWords.some(word => clean.includes(word)) || clean.includes('kya kya') || clean.includes('kia kia');

        if (wantsPages && (clean.includes('website') || clean.includes('studentsync') || clean.includes('option') || clean.includes('page'))) {
            return `StudentSync ke main pages ye hain:<div class="chatbot-page-list">${getPageList()}</div>`;
        }

        const scoredPages = pages
            .map(page => {
                const score = page.keywords.reduce((total, keyword) => clean.includes(keyword) ? total + keyword.split(' ').length : total, 0);
                return { page, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);

        if (scoredPages.length) {
            const best = scoredPages[0].page;
            return `${best.answer}<br>${makeLink(best, `Go to ${best.title}`)}`;
        }

        if (clean.includes('current') || clean.includes('this page') || clean.includes('is page') || clean.includes('ye page')) {
            if (currentPage) {
                return `${currentPage.answer}<br>${makeLink(currentPage, `Stay on ${currentPage.title}`)}`;
            }
        }

        return `Main sirf StudentSync website se related questions answer kar sakta hoon. Aap notes, transport, routes, complaints, mentorship, city guide, registration ya about page ke baare me pooch sakte hain.`;
    }

    function sendQuestion(question) {
        addMessage('user', question.replace(/[<>]/g, ''));
        window.setTimeout(() => {
            addMessage('bot', answerQuestion(question));
        }, 260);
    }

    quickQuestions.forEach(item => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.textContent = item.label;
        chip.addEventListener('click', () => sendQuestion(item.text));
        chips.appendChild(chip);
    });

    function setOpen(isOpen) {
        bot.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        panel.setAttribute('aria-hidden', String(!isOpen));
        if (isOpen) {
            window.setTimeout(() => input.focus(), 100);
        }
    }

    toggle.addEventListener('click', () => setOpen(!bot.classList.contains('open')));
    close.addEventListener('click', () => setOpen(false));

    form.addEventListener('submit', event => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        input.value = '';
        sendQuestion(question);
    });

    addMessage('bot', `Salam! Main StudentSync ka website helper hoon. Notes, transport, routes, mentorship, registration ya city guide ke baare me poochain.`);
});
