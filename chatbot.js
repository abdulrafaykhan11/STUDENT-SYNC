document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.site-chatbot')) return;

    const formatRs = value => `Rs ${Math.round(value).toLocaleString()}`;
    const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[char]));

    const pages = [
        { key: 'home', title: 'Home', url: 'index.html', icon: 'fa-house', keywords: ['home', 'start', 'features', 'challenge', 'student sync', 'studentsync'], answer: 'StudentSync ka home page saare student challenges ka overview deta hai: commute, routes, civic reports, concepts, notes, mentorship aur city guide.' },
        { key: 'notes', title: 'Knowledge Base / Notes', url: 'knowledge-base.html', icon: 'fa-book-open', keywords: ['notes', 'note', 'pdf', 'study', 'resource', 'resources', 'knowledge', 'quiz', 'flashcard', 'feynman', 'pomodoro', 'download'], answer: 'Notes aur study resources ke liye Knowledge Base page open karein. Wahan Feynman Engine, flashcards, quiz lab, focus hub aur curated learning tools available hain.' },
        { key: 'concepts', title: 'Conceptual Mastery', url: 'conceptual-mastery.html', icon: 'fa-brain', keywords: ['concept', 'conceptual', 'cramming', 'understanding', 'memorization', 'youtube', 'video', 'learn'], answer: 'Conceptual Mastery page rote learning ke bajaye real understanding par focus karta hai. Isme concept deconstructor, watch/download area aur night-before planner milta hai.' },
        { key: 'transit', title: 'Transit Economics', url: 'transit-economics.html', icon: 'fa-wallet', keywords: ['transport', 'transit', 'fare', 'cost', 'bus', 'ride', 'careem', 'uber', 'commute', 'budget', 'surge', 'price', 'prices', 'kiraya'], answer: 'Transit Economics page commute cost compare karta hai: bus, ride-hailing, personal transport, semester budget aur peak surge departure planning.' },
        { key: 'routes', title: 'Route Intelligence', url: 'route-intelligence.html', icon: 'fa-route', keywords: ['route', 'road', 'traffic', 'alternate', 'safe route', 'damaged', 'gridlock', 'campus route'], answer: 'Route Intelligence page Karachi routes, damaged roads, safer alternates aur campus travel signals ke liye bana hai.' },
        { key: 'civic', title: 'Civic Voice Hub', url: 'civic-voice.html', icon: 'fa-bullhorn', keywords: ['complaint', 'complain', 'report', 'civic', 'issue', 'campus issue', 'problem', 'voice'], answer: 'Civic Voice Hub par campus ya commute issues report, track aur discuss kar sakte hain. Ye student complaints ko organized feed me convert karta hai.' },
        { key: 'mentor', title: 'Strategic Mentorship', url: 'strategic-mentorship.html', icon: 'fa-compass', keywords: ['mentor', 'mentorship', 'career', 'roadmap', 'resume', 'interview', 'alumni', 'guidance', 'path'], answer: 'Strategic Mentorship page career guidance ke liye hai: mentor directory, roadmap generator, resume roaster, mock interview aur alumni advice.' },
        { key: 'city', title: 'Karachi City Guide', url: 'city-guide.html', icon: 'fa-map-location-dot', keywords: ['city', 'karachi', 'hostel', 'rent', 'area', 'relocation', 'move', 'campus area', 'mess', 'safety'], answer: 'Karachi City Guide out-station students ke liye hai. Campus choose karke nearby areas, rent, commute, budget aur move-in checklist plan hoti hai.' },
        { key: 'register', title: 'Registration / Join Now', url: 'contact.html', icon: 'fa-user-plus', keywords: ['register', 'registration', 'join', 'contact', 'form', 'apply', 'signup', 'sign up', 'admission'], answer: 'Join Now ya registration ke liye Contact page par institute registration form fill karein. Successful submission ke baad ID card preview/download option milta hai.' },
        { key: 'about', title: 'About StudentSync', url: 'about.html', icon: 'fa-circle-info', keywords: ['about', 'mission', 'team', 'vision', 'future', 'arsenal'], answer: 'About page StudentSync ki mission, platform features aur future vision explain karta hai.' }
    ];

    const areaLabels = {
        gulshan: 'Gulshan-e-Iqbal',
        north_nazimabad: 'North Nazimabad',
        pechs: 'PECHS',
        clifton: 'Clifton',
        malir: 'Malir'
    };

    const areaAliases = {
        gulshan: ['gulshan', 'gulshan e iqbal', 'gulshan-e-iqbal', 'university road', 'nipa'],
        north_nazimabad: ['north nazimabad', 'nazimabad', 'hyderi'],
        pechs: ['pechs', 'nursery', 'karsaz', 'bahadurabad', 'saddar'],
        clifton: ['clifton', 'dha', 'defence', 'gizri'],
        malir: ['malir', 'model colony', 'airport', 'shah faisal']
    };

    const institutions = {
        ned: { name: 'NED University', type: 'university', area: 'gulshan', kmExtra: 0, signal: 'University Road clear', aliases: ['ned', 'ned university', 'n e d'] },
        ku: { name: 'Karachi University', type: 'university', area: 'gulshan', kmExtra: -0.6, signal: 'Direct campus belt', aliases: ['ku', 'karachi university', 'university of karachi'] },
        fast: { name: 'FAST NUCES', type: 'university', area: 'pechs', kmExtra: 0, signal: 'Shahrah-e-Faisal traffic', aliases: ['fast', 'fast nuces', 'nuces'] },
        iba: { name: 'IBA Karachi', type: 'university', area: 'gulshan', kmExtra: 0.8, signal: 'Main University Road', aliases: ['iba', 'iba karachi'] },
        dhaus: { name: 'DHA Suffa University', type: 'university', area: 'clifton', kmExtra: 0, signal: 'Korangi Road moderate', aliases: ['dha suffa', 'dhaus', 'suffa'] },
        szabist: { name: 'SZABIST Karachi', type: 'university', area: 'clifton', kmExtra: 1.2, signal: 'Clifton corridor', aliases: ['szabist', 'szabist karachi'] },
        indus: { name: 'Indus University', type: 'university', area: 'pechs', kmExtra: 0.5, signal: 'Gulistan-e-Johar link', aliases: ['indus', 'indus university'] },
        dj_science: { name: 'DJ Science College', type: 'college', area: 'gulshan', kmExtra: 0.3, signal: 'University Road stop', aliases: ['dj science', 'dj college'] },
        st_patricks: { name: "St. Patrick's College", type: 'college', area: 'pechs', kmExtra: 0, signal: 'Saddar approach', aliases: ['st patrick', 'st patricks'] },
        gcw: { name: 'Govt College for Women', type: 'college', area: 'north_nazimabad', kmExtra: 0, signal: 'Nazimabad belt', aliases: ['govt college for women', 'gcw'] },
        bahria_college: { name: 'Bahria College Karsaz', type: 'college', area: 'pechs', kmExtra: 0.4, signal: 'Karsaz Road active', aliases: ['bahria college', 'bahria karsaz'] },
        adamjee: { name: 'Adamjee Science College', type: 'college', area: 'gulshan', kmExtra: 0.2, signal: 'Gulshan main route', aliases: ['adamjee', 'adamjee college'] },
        djmc: { name: 'DJ Sindh Govt Science College', type: 'college', area: 'malir', kmExtra: 0, signal: 'Malir connector', aliases: ['djmc', 'dj sindh'] }
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
        ride: { label: 'Ride App', icon: 'fa-taxi' },
        bus: { label: 'Public Bus', icon: 'fa-bus' },
        carpool: { label: 'Carpool', icon: 'fa-car-side' },
        shuttle: { label: 'Campus Shuttle', icon: 'fa-van-shuttle' }
    };

    const cityGuides = {
        gulshan: {
            label: 'Gulshan / University Road',
            areas: [
                { name: 'Gulshan-e-Iqbal', rent: [18000, 36000], commute: '10-30 min', note: 'Best balance for University Road campuses.' },
                { name: 'NIPA / Civic Center', rent: [20000, 40000], commute: '10-25 min', note: 'Good transport access and food options.' },
                { name: 'Gulistan-e-Johar', rent: [22000, 42000], commute: '20-45 min', note: 'Better flats, but check traffic before booking.' }
            ]
        },
        pechs: {
            label: 'PECHS / Karsaz / Saddar Link',
            areas: [
                { name: 'PECHS / Nursery', rent: [26000, 52000], commute: '15-40 min', note: 'Central area with strong food and transport access.' },
                { name: 'Garden / Saddar', rent: [21000, 41000], commute: '10-30 min', note: 'Useful for city-side colleges; inspect carefully.' },
                { name: 'Bahadurabad / Karsaz', rent: [30000, 60000], commute: '15-35 min', note: 'Safer and cleaner, usually more expensive.' }
            ]
        },
        clifton: {
            label: 'Clifton / DHA / Gizri',
            areas: [
                { name: 'Gizri / DHA Phase 2 Extension', rent: [28000, 52000], commute: '10-25 min', note: 'Good value for Clifton and DHA campuses.' },
                { name: 'Clifton Blocks 2-5', rent: [42000, 80000], commute: '5-20 min', note: 'Closest option, but rent is high.' },
                { name: 'PECHS as backup', rent: [26000, 52000], commute: '25-50 min', note: 'Lower rent if you can manage commute.' }
            ]
        },
        north_nazimabad: {
            label: 'North Nazimabad / Nazimabad',
            areas: [
                { name: 'North Nazimabad', rent: [20000, 42000], commute: '10-30 min', note: 'Strong for colleges in the north corridor.' },
                { name: 'Nazimabad', rent: [17000, 34000], commute: '15-35 min', note: 'Budget-friendly and busy.' },
                { name: 'Federal B. Area', rent: [18000, 36000], commute: '20-40 min', note: 'Good backup if direct area is full.' }
            ]
        },
        malir: {
            label: 'Malir / Model Colony',
            areas: [
                { name: 'Model Colony', rent: [16000, 32000], commute: '10-30 min', note: 'Good for Malir-side campuses and lower rent.' },
                { name: 'Malir Cantt edge', rent: [22000, 45000], commute: '15-35 min', note: 'Safer feel, usually higher cost.' },
                { name: 'Shah Faisal / Airport link', rent: [18000, 36000], commute: '20-45 min', note: 'Only choose after testing the route.' }
            ]
        }
    };

    const studyTopics = {
        html: {
            label: 'HTML',
            aliases: ['html', 'semantic html', 'markup'],
            icon: 'fa-brands fa-html5',
            category: 'Frontend Development',
            desc: 'HTML structures web pages using meaningful tags.',
            core: 'HTML is the skeleton of a page. It tells the browser what content exists: headings, paragraphs, links, images, forms and sections.',
            analogy: 'Think of a house frame: rooms, doors and walls exist before paint or electricity.',
            pitfalls: ['Using div for everything', 'Forgetting form labels', 'Missing viewport/meta setup'],
            hotTopics: ['Semantic tags', 'Forms and input types', 'Head/body/meta structure', 'Tables', 'Lists and anchors'],
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/HTML_Complete_Notes.pdf',
            concept: 'conceptual-mastery.html#html',
            quiz: 'knowledge-base.html#quiz-lab'
        },
        css: {
            label: 'CSS',
            aliases: ['css', 'style', 'styling', 'responsive css'],
            icon: 'fa-brands fa-css3-alt',
            category: 'Frontend Development',
            desc: 'CSS controls layout, spacing, colors, typography and responsiveness.',
            core: 'CSS selects HTML elements and applies visual rules. The cascade decides which rule wins when styles compete.',
            analogy: 'HTML is the room structure; CSS is the interior design, furniture placement and lighting.',
            pitfalls: ['Margin vs padding confusion', 'Specificity wars', 'Flexbox vs Grid mixup'],
            hotTopics: ['Flexbox', 'Grid', 'Box model', 'Selectors and specificity', 'Media queries'],
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/CSS_Complete_Notes.pdf',
            concept: 'conceptual-mastery.html#css',
            quiz: 'knowledge-base.html#quiz-lab'
        },
        javascript: {
            label: 'JavaScript',
            aliases: ['javascript', 'js', 'java script'],
            icon: 'fa-brands fa-js',
            category: 'Full-Stack Language',
            desc: 'JavaScript adds logic, events and interactivity to websites.',
            core: 'JavaScript can read and update the DOM, respond to clicks, validate forms, call APIs and control app behavior.',
            analogy: 'HTML is skeleton, CSS is skin, JavaScript is brain and muscles.',
            pitfalls: ['== vs ===', 'var vs let/const', 'Async/await confusion', 'this keyword context'],
            hotTopics: ['DOM manipulation', 'Events', 'Promises and async/await', 'Array methods', 'ES6 syntax'],
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/JS_Chapterwise_Notes.pdf',
            concept: 'conceptual-mastery.html#javascript',
            quiz: 'knowledge-base.html#quiz-lab'
        },
        python: {
            label: 'Python',
            aliases: ['python', 'py'],
            icon: 'fa-brands fa-python',
            category: 'General Purpose',
            desc: 'Python is a readable language for web, automation, data science and AI.',
            core: 'Python uses indentation to define blocks and focuses on readable code so beginners can focus on logic.',
            analogy: 'Python reads closer to English than many languages, so syntax gets out of the way quickly.',
            pitfalls: ['Indentation errors', 'Mutable default arguments', 'List vs tuple vs dictionary confusion'],
            hotTopics: ['Lists and dictionaries', 'Functions', 'OOP', 'File handling', 'Exception handling'],
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/notes/Python_Complete_Notes.pdf',
            concept: 'conceptual-mastery.html#python',
            quiz: 'knowledge-base.html#quiz-lab'
        },
        php: {
            label: 'PHP',
            aliases: ['php', 'p h p'],
            icon: 'fa-brands fa-php',
            category: 'Backend Development',
            desc: 'PHP runs on the server and builds dynamic web pages.',
            core: 'PHP processes requests, reads forms, talks to MySQL and sends finished HTML back to the browser.',
            analogy: 'Browser is the customer, PHP is the kitchen, and HTML is the served plate.',
            pitfalls: ['$ prefix missing on variables', 'GET vs POST confusion', 'Raw SQL input causing injection', 'Session vs cookie confusion'],
            hotTopics: ['Variables and data types', 'Functions and arrays', 'Forms and $_POST', 'Sessions and cookies', 'PDO prepared statements'],
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/cheatsheets/Php%20Cheatsheet.pdf',
            concept: 'conceptual-mastery.html#php',
            quiz: 'knowledge-base.html#quiz-lab'
        },
        mysql: {
            label: 'MySQL',
            aliases: ['mysql', 'sql', 'database', 'db'],
            icon: 'fa-solid fa-database',
            category: 'Database Management',
            desc: 'MySQL stores structured data in tables and retrieves it with SQL.',
            core: 'Tables hold rows and columns. SQL commands like SELECT, INSERT, UPDATE and DELETE manage the data.',
            analogy: 'A database is an organized filing cabinet; SQL is the instruction you give the clerk.',
            pitfalls: ['Forgetting WHERE in UPDATE/DELETE', 'INNER JOIN vs LEFT JOIN confusion', 'No indexes on search columns'],
            hotTopics: ['SELECT and JOINs', 'Normalization', 'Indexes', 'Prepared statements', 'Primary and foreign keys'],
            notes: 'https://cwh-full-next-space.fra1.cdn.digitaloceanspaces.com/YouTube/MySQL%20Handbook.pdf',
            concept: 'conceptual-mastery.html#mysql',
            quiz: 'knowledge-base.html#quiz-lab'
        },
        react: {
            label: 'React',
            aliases: ['react', 'reactjs', 'react js'],
            icon: 'fa-brands fa-react',
            category: 'Frontend Framework',
            desc: 'React builds UI from reusable components.',
            core: 'React breaks screens into components and updates the page through state changes.',
            analogy: 'Instead of repainting the whole wall, React swaps only the tile that changed.',
            pitfalls: ['Mutating state directly', 'Missing list keys', 'useEffect dependency mistakes'],
            hotTopics: ['Components and props', 'useState', 'useEffect', 'Virtual DOM', 'Event handling'],
            notes: 'https://www.newline.co/fullstack-react/assets/media/sGEMe/MNzue/30-days-of-react-ebook-fullstackio.pdf',
            concept: 'conceptual-mastery.html#react',
            quiz: 'knowledge-base.html#quiz-lab'
        },
        nodejs: {
            label: 'Node.js',
            aliases: ['node', 'nodejs', 'node js', 'express'],
            icon: 'fa-brands fa-node-js',
            category: 'Backend Runtime',
            desc: 'Node.js runs JavaScript on the server.',
            core: 'Node.js uses an event-driven model to handle many requests without blocking the server.',
            analogy: 'One smart teller takes orders from many people, then serves results when they are ready.',
            pitfalls: ['Blocking the event loop', 'Callback hell', 'Not handling async errors'],
            hotTopics: ['Modules', 'Express routes', 'Event loop', 'npm and package.json', 'Middleware'],
            notes: 'https://www.anuragkapur.com/assets/blog/programming/node/PDF-Guide-Node-Andrew-Mead-v3.pdf',
            concept: 'conceptual-mastery.html#nodejs',
            quiz: 'knowledge-base.html#quiz-lab'
        }
    };

    const questConcepts = {
        html: [
            { tag: 'Semantic Tags', term: '<main>', definition: 'the landmark element for the primary content of a page', useCase: 'mark the unique central content so assistive tech can jump to it', misconception: 'using only <div> for every important page region' },
            { tag: 'Forms & Input', term: 'required', definition: 'the boolean attribute that stops empty form submission', useCase: 'make an email field mandatory before the form submits', misconception: 'writing mandatory instead of a browser-recognized attribute' },
            { tag: 'Links', term: '<a>', definition: 'the element that navigates to another page, file, email, or page section', useCase: 'send a learner to a revision resource', misconception: 'using <link> inside body content for clickable navigation' },
            { tag: 'Accessibility', term: 'alt', definition: 'text alternative read when an image cannot be seen or loaded', useCase: 'describe a chart image for screen reader users', misconception: 'leaving meaningful image alt empty' },
            { tag: 'Meta Tags', term: 'viewport meta tag', definition: 'the head tag that tells mobile browsers how to scale the layout', useCase: 'make a responsive page match device width', misconception: 'expecting media queries to work without viewport setup' },
            { tag: 'Forms & Input', term: '<label for>', definition: 'the pattern that connects visible label text with a specific input id', useCase: 'let users click label text to focus an input', misconception: 'placing label-looking text near an input without linking it' }
        ],
        css: [
            { tag: 'Box Model', term: 'padding', definition: 'space between content and its border', useCase: 'give button text breathing room inside the border', misconception: 'using margin when spacing should be inside the element' },
            { tag: 'Flexbox', term: 'flex-direction', definition: 'the property that sets the main axis of a flex container', useCase: 'stack nav items vertically on a narrow screen', misconception: 'changing align-items when the issue is row versus column flow' },
            { tag: 'Responsive Units', term: 'rem', definition: 'a unit based on the root font size', useCase: 'keep spacing consistent across nested components', misconception: 'assuming rem uses the current element font size' },
            { tag: 'Media Queries', term: '@media', definition: 'a conditional CSS block for viewport or device features', useCase: 'switch a grid into one column on phones', misconception: 'writing separate HTML pages instead of adapting CSS' },
            { tag: 'Grid', term: 'grid-template-columns', definition: 'the property that defines grid column tracks', useCase: 'create dashboard columns that collapse responsively', misconception: 'trying two-dimensional layout with only gap' },
            { tag: 'Cascade', term: 'specificity', definition: 'the scoring system browsers use when CSS selectors compete', useCase: 'understand why a class rule loses to an id rule', misconception: 'adding random !important flags' }
        ],
        javascript: [
            { tag: 'Operators', term: '===', definition: 'the comparison operator that checks value and type', useCase: 'compare a stored answer with the expected answer safely', misconception: 'using == and being surprised by type coercion' },
            { tag: 'Variables', term: 'const', definition: 'a declaration whose binding cannot be reassigned', useCase: 'keep a DOM reference from pointing to a different element', misconception: 'thinking const freezes every object property' },
            { tag: 'DOM Manipulation', term: 'Document Object Model', definition: 'the browser object tree representing page elements', useCase: 'find a quiz button and update its class after a click', misconception: 'expecting HTML text to change without touching DOM or state' },
            { tag: 'Events', term: 'addEventListener', definition: 'the method used to run code when a browser event happens', useCase: 'score an MCQ when the learner clicks an option', misconception: 'calling the handler immediately instead of passing it as a function' },
            { tag: 'Async/Await', term: 'async/await', definition: 'syntax that makes promise-based code read like a sequence', useCase: 'wait for fetched notes before rendering a quiz', misconception: 'expecting await to work in a non-async function' },
            { tag: 'Arrays', term: 'map', definition: 'the array method that transforms each item into a new array item', useCase: 'convert question objects into rendered option labels', misconception: 'using map only for side effects' }
        ],
        python: [
            { tag: 'Syntax', term: 'indentation', definition: 'the whitespace structure Python uses to define code blocks', useCase: 'show which statements belong inside a function or loop', misconception: 'adding braces like JavaScript to create a block' },
            { tag: 'Lists & Dicts', term: 'list', definition: 'a mutable ordered collection', useCase: 'store quiz scores that can be appended during practice', misconception: 'choosing tuple when values must change often' },
            { tag: 'Functions', term: 'def', definition: 'the keyword used to define a function', useCase: 'wrap repeated grading logic in one reusable block', misconception: 'using function as the Python keyword' },
            { tag: 'Lists & Dicts', term: 'dictionary', definition: 'a key-value collection for fast lookup by key', useCase: 'store XP by topic name', misconception: 'searching a list manually when named keys are needed' },
            { tag: 'Errors', term: 'try/except', definition: 'the structure used to handle runtime errors gracefully', useCase: 'show a friendly message when file loading fails', misconception: 'letting one bad input crash the whole program' },
            { tag: 'File Handling', term: 'with open(...)', definition: 'the context-manager pattern that closes a file automatically', useCase: 'read notes without forgetting cleanup', misconception: 'opening a file and never closing it' }
        ],
        php: [
            { tag: 'Runtime', term: 'server-side execution', definition: 'running code on the web server before the response reaches the browser', useCase: 'process login data before sending HTML back', misconception: 'expecting PHP variables to change after the page loads without a request' },
            { tag: 'Forms & $_POST', term: '$_POST', definition: 'the PHP superglobal that holds submitted POST form fields', useCase: 'read a password field sent by a login form', misconception: 'checking $_GET for data submitted with method="post"' },
            { tag: 'Sessions', term: '$_SESSION', definition: 'server-side storage that remembers a user across requests', useCase: 'keep a learner logged in after authentication', misconception: 'storing private login state only in visible form fields' },
            { tag: 'PDO', term: 'prepared statement', definition: 'a database query pattern that separates SQL from user values', useCase: 'insert form data without SQL injection risk', misconception: 'concatenating raw user input into a SQL string' },
            { tag: 'Include/Require', term: 'include', definition: 'a statement that loads another PHP file into the current script', useCase: 'reuse the same header across multiple pages', misconception: 'copy-pasting shared markup into every file' },
            { tag: 'Security', term: 'password_hash', definition: 'the PHP function for safely hashing passwords', useCase: 'store a password verifier instead of the original password', misconception: 'saving plain-text passwords in a database' }
        ],
        mysql: [
            { tag: 'SELECT & JOINs', term: 'SELECT', definition: 'the SQL command used to retrieve rows', useCase: 'show all saved flashcards for a learner', misconception: 'using INSERT when the task is only reading data' },
            { tag: 'Keys', term: 'primary key', definition: 'a column or set of columns that uniquely identifies each row', useCase: 'give every student record a stable identity', misconception: 'allowing duplicate ids in the main table' },
            { tag: 'SELECT & JOINs', term: 'JOIN', definition: 'a clause that combines related rows from multiple tables', useCase: 'show orders together with customer names', misconception: 'duplicating customer data inside every order row' },
            { tag: 'Normalization', term: 'normalization', definition: 'organizing tables to reduce duplication and update problems', useCase: 'separate courses and enrollments into related tables', misconception: 'putting repeating groups into one giant table column' },
            { tag: 'Indexes', term: 'index', definition: 'a data structure that helps MySQL find rows faster', useCase: 'speed up searches by email or roll number', misconception: 'adding indexes to every column without considering writes' },
            { tag: 'Relationships', term: 'foreign key', definition: 'a constraint that links a child row to a parent row', useCase: 'ensure an enrollment references an existing student', misconception: 'trusting app code only to protect relationships' }
        ],
        react: [
            { tag: 'Components & Props', term: 'component', definition: 'a reusable piece of UI described with JavaScript and JSX', useCase: 'render the same quiz card for multiple questions', misconception: 'copying the same markup instead of reusing a component' },
            { tag: 'Components & Props', term: 'props', definition: 'read-only inputs passed from parent component to child component', useCase: 'send question text into a QuizCard component', misconception: 'mutating props directly inside the child' },
            { tag: 'useState', term: 'useState', definition: 'a Hook that gives a component state value and setter', useCase: 'track selected answer and score', misconception: 'editing a state variable directly without calling setter' },
            { tag: 'useEffect', term: 'useEffect', definition: 'a Hook for running side effects after render', useCase: 'sync quiz progress to localStorage', misconception: 'fetching directly inside render logic' },
            { tag: 'Virtual DOM', term: 'Virtual DOM', definition: 'React representation used to compute efficient UI updates', useCase: 'update only changed answer state instead of rebuilding the page', misconception: 'thinking React edits HTML strings as its main model' },
            { tag: 'Lists', term: 'key prop', definition: 'the stable identity React needs when rendering lists', useCase: 'keep quiz card state attached after reshuffle', misconception: 'using array index as key when list order changes often' }
        ],
        nodejs: [
            { tag: 'Runtime', term: 'Node.js', definition: 'a runtime that runs JavaScript outside the browser', useCase: 'build an API that serves adaptive quiz attempts', misconception: 'thinking Node.js is CSS or browser-only code' },
            { tag: 'npm & package.json', term: 'npm', definition: 'the package manager commonly used with Node.js projects', useCase: 'install a tested quiz or validation library', misconception: 'manually downloading every dependency file' },
            { tag: 'Modules', term: 'module', definition: 'a reusable file that exports code for other files to import', useCase: 'separate question generation from route handlers', misconception: 'placing the whole server inside one huge file forever' },
            { tag: 'Express Routes', term: 'Express route', definition: 'a handler that responds to a matching HTTP method and path', useCase: 'return a learner-specific quiz at /api/quest', misconception: 'handling every URL with unrelated if statements' },
            { tag: 'Event Loop', term: 'event loop', definition: 'the mechanism that lets Node coordinate asynchronous work', useCase: 'serve other requests while waiting for database results', misconception: 'blocking the server with slow synchronous work' },
            { tag: 'Middleware', term: 'middleware', definition: 'functions that run between request arrival and final route response', useCase: 'check authentication before a protected route', misconception: 'copying auth checks into every route manually' }
        ]
    };

    let chatState = { mode: null };

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
                    <h2>Smart Helper</h2>
                </div>
                <button class="chatbot-close" type="button" aria-label="Close chat">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="chatbot-messages" role="log" aria-live="polite"></div>
            <div class="chatbot-chips" aria-label="Quick website questions"></div>
            <form class="chatbot-form">
                <input class="chatbot-input" type="text" autocomplete="off" placeholder="Try: PHP nahi aati kya karoon?" aria-label="Ask StudentSync">
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
        { label: 'Learn PHP', text: 'PHP bilkul nahi aati kya karoon?' },
        { label: 'PHP Quiz', text: 'PHP ka quiz lo' },
        { label: 'Gulshan to NED', text: 'Gulshan se NED jaana hai, prices kya hain?' },
        { label: 'Notes', text: 'Notes kahan milenge?' },
        { label: 'Hostel/Rent', text: 'NED ke paas hostel rent aur areas batao' },
        { label: 'Mentor', text: 'Resume improve karna hai' }
    ];

    function normalize(text) {
        return text.toLowerCase().replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function hasAlias(clean, alias) {
        const normalizedAlias = normalize(alias);
        const escaped = normalizedAlias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
        return new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(clean);
    }

    function findArea(clean) {
        return Object.entries(areaAliases).find(([, aliases]) => aliases.some(alias => hasAlias(clean, alias)))?.[0] || null;
    }

    function findInstitution(clean) {
        return Object.entries(institutions).find(([, inst]) => inst.aliases.some(alias => hasAlias(clean, alias)))?.[0] || null;
    }

    function findStudyTopic(clean) {
        return Object.entries(studyTopics).find(([, topic]) => topic.aliases.some(alias => hasAlias(clean, alias)))?.[0] || null;
    }

    function shuffle(items) {
        return [...items]
            .map(item => ({ item, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ item }) => item);
    }

    function topicLink(topicKey, label) {
        const topic = studyTopics[topicKey];
        return `<a class="chatbot-link" href="${topic.concept}">${label} <i class="fa-solid fa-arrow-right"></i></a>`;
    }

    function renderLearningPlan(topicKey) {
        const topic = studyTopics[topicKey];
        if (!topic) return null;

        const steps = [
            `Step 1: ${topic.label} ka core idea samjho - ${topic.core}`,
            `Step 2: Pehle ye 3 topics karo: ${topic.hotTopics.slice(0, 3).join(', ')}.`,
            `Step 3: Har topic ke baad 5 line me explain karo. Agar atko, Conceptual Mastery open karo.`,
            `Step 4: Notes se sirf examples copy nahi, khud 2 chhote examples banao.`,
            `Step 5: Phir mujhe bolo "${topic.label} ka quiz lo" aur main MCQ practice kara dunga.`
        ];

        return `
            <div class="chatbot-study-card">
                <div class="chatbot-study-head">
                    <i class="${topic.icon}"></i>
                    <div><span>${topic.category}</span><strong>${topic.label} beginner plan</strong></div>
                </div>
                <p>${escapeHtml(topic.desc)}</p>
                <ol>${steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
                <div class="chatbot-pill-list">
                    ${topic.pitfalls.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
                </div>
            </div>
            ${topicLink(topicKey, `Open ${topic.label} Concept Guide`)}
            <a class="chatbot-link" href="${topic.notes}" target="_blank" rel="noopener">Download ${topic.label} notes <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        `;
    }

    function renderConceptAnswer(topicKey) {
        const topic = studyTopics[topicKey];
        if (!topic) return null;

        return `
            <div class="chatbot-study-card">
                <div class="chatbot-study-head">
                    <i class="${topic.icon}"></i>
                    <div><span>${topic.category}</span><strong>${topic.label} simple explanation</strong></div>
                </div>
                <p><strong>Core:</strong> ${escapeHtml(topic.core)}</p>
                <p><strong>Analogy:</strong> ${escapeHtml(topic.analogy)}</p>
                <p><strong>Common trap:</strong> ${escapeHtml(topic.pitfalls[0])}</p>
                <p class="chatbot-mini-note">Next: bolo "${topic.label} ka quiz lo" ya "${topic.label} notes do".</p>
            </div>
            ${topicLink(topicKey, `Open ${topic.label} Deconstructor`)}
        `;
    }

    function renderNotesAnswer(topicKey) {
        const topic = studyTopics[topicKey];
        if (!topic) return null;

        return `
            <div class="chatbot-study-card">
                <div class="chatbot-study-head">
                    <i class="${topic.icon}"></i>
                    <div><span>Knowledge Base</span><strong>${topic.label} resources</strong></div>
                </div>
                <p>${topic.label} ke notes, concept guide aur quiz practice yahan se continue karein.</p>
                <div class="chatbot-page-list">
                    <a href="${topic.notes}" target="_blank" rel="noopener"><i class="fa-solid fa-file-pdf"></i>Download notes / cheatsheet</a>
                    <a href="${topic.concept}"><i class="fa-solid fa-layer-group"></i>Conceptual Mastery guide</a>
                    <a href="knowledge-base.html#quiz-lab"><i class="fa-solid fa-brain"></i>Active Recall Quiz Lab</a>
                    <a href="knowledge-base.html#flashcard-builder"><i class="fa-solid fa-clone"></i>Flashcard Builder</a>
                </div>
            </div>
        `;
    }

    function renderFlashcards(topicKey) {
        const topic = studyTopics[topicKey];
        const concepts = questConcepts[topicKey] || [];
        if (!topic || !concepts.length) return null;

        return `
            <div class="chatbot-study-card">
                <div class="chatbot-study-head">
                    <i class="fa-solid fa-clone"></i>
                    <div><span>Flashcard drill</span><strong>${topic.label} quick deck</strong></div>
                </div>
                <div class="chatbot-area-list">
                    ${concepts.slice(0, 5).map(card => `
                        <div class="chatbot-area-row">
                            <strong>Q: ${escapeHtml(card.term)}</strong>
                            <small>A: ${escapeHtml(card.definition)}</small>
                        </div>
                    `).join('')}
                </div>
                <p class="chatbot-mini-note">Inko real 3D deck me add karna ho to Flashcard Builder open karein.</p>
            </div>
            <a class="chatbot-link" href="knowledge-base.html#flashcard-builder">Open Flashcard Builder <i class="fa-solid fa-arrow-right"></i></a>
        `;
    }

    function buildTopicQuiz(topicKey) {
        const topic = studyTopics[topicKey];
        const concepts = questConcepts[topicKey] || [];
        if (!topic || concepts.length < 4) return [];

        return shuffle(concepts).slice(0, 5).map((concept, index) => {
            const type = index % 3;
            const distractorTerms = shuffle(concepts.filter(item => item.term !== concept.term).map(item => item.term)).slice(0, 3);
            const distractorDefinitions = shuffle(concepts.filter(item => item.definition !== concept.definition).map(item => item.definition)).slice(0, 3);

            if (type === 1) {
                const options = shuffle([concept.definition, ...distractorDefinitions]);
                return {
                    prompt: `Why does ${concept.term} matter in ${topic.label}?`,
                    options,
                    answer: options.indexOf(concept.definition),
                    explain: `${concept.term}: ${concept.definition}.`
                };
            }

            if (type === 2) {
                const options = shuffle([concept.term, ...distractorTerms]);
                return {
                    prompt: `Which concept fixes this mistake: ${concept.misconception}?`,
                    options,
                    answer: options.indexOf(concept.term),
                    explain: `${concept.term} is the safer move because it helps you ${concept.useCase}.`
                };
            }

            const options = shuffle([concept.term, ...distractorTerms]);
            return {
                prompt: `Which key idea matches this: ${concept.definition}?`,
                options,
                answer: options.indexOf(concept.term),
                explain: `${concept.term} is correct. Watch for this trap: ${concept.misconception}.`
            };
        });
    }

    function renderQuizQuestion() {
        const state = chatState;
        const topic = studyTopics[state.topic];
        const question = state.questions[state.index];
        const letters = ['A', 'B', 'C', 'D'];

        return `
            <div class="chatbot-quiz-card">
                <div class="chatbot-route-head">
                    <span>${topic.label} Quiz</span>
                    <strong>${state.index + 1}/${state.questions.length}</strong>
                </div>
                <p><strong>Q${state.index + 1}:</strong> ${escapeHtml(question.prompt)}</p>
                <div class="chatbot-quiz-options">
                    ${question.options.map((option, index) => `<span><strong>${letters[index]}</strong> ${escapeHtml(option)}</span>`).join('')}
                </div>
                <p class="chatbot-mini-note">Reply with A, B, C, D or the option text. Type "stop quiz" to end.</p>
            </div>
        `;
    }

    function startTopicQuiz(topicKey) {
        const questions = buildTopicQuiz(topicKey);
        if (!questions.length) return 'Is topic ka quiz abhi available nahi. Try PHP, JavaScript, HTML, CSS, Python, MySQL, React ya Node.js.';

        chatState = {
            mode: 'quiz',
            topic: topicKey,
            questions,
            index: 0,
            correct: 0,
            answered: 0
        };

        return `Chalo ${studyTopics[topicKey].label} ka quick quiz start karte hain.${renderQuizQuestion()}`;
    }

    function handleQuizAnswer(clean) {
        if (clean.includes('stop') || clean.includes('quit') || clean.includes('band')) {
            const topic = studyTopics[chatState.topic]?.label || 'topic';
            const score = `${chatState.correct}/${chatState.answered || chatState.questions.length}`;
            chatState = { mode: null };
            return `Quiz stopped. ${topic} score: ${score}.`;
        }

        const state = chatState;
        const question = state.questions[state.index];
        const letters = ['a', 'b', 'c', 'd'];
        let selected = letters.indexOf(clean.trim()[0]);

        if (selected < 0) {
            selected = question.options.findIndex(option => normalize(option) === clean || clean.includes(normalize(option)));
        }

        if (selected < 0 || selected >= question.options.length) {
            return 'Quiz answer samajh nahi aaya. Sirf A, B, C, D ya option text bhejein.';
        }

        const correct = selected === question.answer;
        if (correct) state.correct += 1;
        state.answered += 1;

        const feedback = `
            <div class="chatbot-quiz-feedback ${correct ? 'correct' : 'wrong'}">
                <strong>${correct ? 'Correct' : 'Not quite'}.</strong>
                <span>Correct answer: ${escapeHtml(question.options[question.answer])}</span>
                <small>${escapeHtml(question.explain)}</small>
            </div>
        `;

        state.index += 1;
        if (state.index >= state.questions.length) {
            const topic = studyTopics[state.topic];
            const final = `${feedback}<p><strong>Quiz complete:</strong> ${state.correct}/${state.questions.length}. ${state.correct >= 4 ? 'Strong start. Ab ek Feynman explanation try karein.' : 'Weak spots ko revise karein, phir dobara quiz lein.'}</p>${topicLink(state.topic, `Revise ${topic.label}`)}`;
            chatState = { mode: null };
            return final;
        }

        return `${feedback}${renderQuizQuestion()}`;
    }

    function computeRouteMetrics(originKey, instKey) {
        const inst = institutions[instKey];
        if (!inst) return null;

        const legacy = legacyRoutes[originKey]?.[instKey];
        if (legacy) return { ...legacy, signal: inst.signal };

        const baseKm = (areaDistance[originKey]?.[inst.area] || 12) + (inst.kmExtra || 0);
        const km = Math.max(2.5, Math.round(baseKm * 10) / 10);
        const congestion = Math.min(32, Math.round(km * 0.95 + (inst.type === 'school' ? -2 : 0)));
        const transfers = km > 20 ? 2 : km > 11 ? 1 : 0;
        const walk = Math.min(15, Math.round(5 + transfers * 2 + (inst.type === 'school' ? 1 : 2)));
        const seats = inst.type === 'school' ? Math.max(1, 5 - transfers) : Math.max(1, 4 - transfers);
        const shuttleEta = Math.round(8 + km * 0.65 + transfers * 3);

        return { km, congestion, transfers, walk, seats, shuttleEta, signal: inst.signal };
    }

    function buildOptions(route) {
        const km = route.km;
        const rideBase = Math.round(150 + (km * 33) + route.congestion);
        const rideCost = Math.round(rideBase * (route.congestion > 22 ? 1.38 : route.congestion > 16 ? 1.24 : 1.12));
        const busCost = Math.round(55 + (route.transfers * 45) + (km > 18 ? 35 : 0));
        const carpoolCost = Math.round(95 + (km * 15) + Math.max(0, 5 - route.seats) * 12);
        const shuttleCost = Math.round(80 + (km > 15 ? 35 : 0) + (route.shuttleEta > 22 ? 20 : 0));

        return {
            ride: { cost: rideCost, time: Math.round(16 + (km * 1.75) + (route.congestion * 0.45)), reliability: route.congestion > 24 ? 72 : 84 },
            bus: { cost: busCost, time: Math.round(24 + (km * 2.35) + (route.transfers * 11) + route.walk), reliability: route.transfers > 1 ? 69 : 77 },
            carpool: { cost: carpoolCost, time: Math.round(20 + (km * 1.85) + (route.congestion * 0.35)), reliability: route.seats > 2 ? 91 : 82 },
            shuttle: { cost: shuttleCost, time: Math.round(route.shuttleEta + 20 + (km * 2.05)), reliability: route.shuttleEta > 24 ? 76 : 88 }
        };
    }

    function getRoutePlan(originKey, destKey) {
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
            route,
            options,
            cheapest: cheapest[0],
            fastest: fastest[0],
            recommended: balanced[0]
        };
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
            .filter(page => page.key !== 'home')
            .map(page => `<a href="${page.url}"><i class="fa-solid ${page.icon}"></i>${page.title}</a>`)
            .join('');
    }

    function renderRouteAnswer(originKey, instKey) {
        const plan = getRoutePlan(originKey, instKey);
        if (!plan) return null;

        const rows = Object.entries(plan.options).map(([key, option]) => {
            const meta = modeMeta[key];
            const badges = [
                key === plan.recommended ? '<span>Best</span>' : '',
                key === plan.cheapest ? '<span>Cheapest</span>' : '',
                key === plan.fastest ? '<span>Fastest</span>' : ''
            ].filter(Boolean).join('');

            return `
                <div class="chatbot-fare-row">
                    <div><i class="fa-solid ${meta.icon}"></i><strong>${meta.label}</strong></div>
                    <span>${formatRs(option.cost)}</span>
                    <small>${option.time} min</small>
                    <em>${badges}</em>
                </div>
            `;
        }).join('');

        const recommended = modeMeta[plan.recommended].label;
        const saving = Math.max(0, plan.options.ride.cost - plan.options[plan.recommended].cost);

        return `
            <div class="chatbot-route-card">
                <div class="chatbot-route-head">
                    <span>${escapeHtml(plan.originLabel)} to ${escapeHtml(plan.campusLabel)}</span>
                    <strong>${plan.route.km} km</strong>
                </div>
                <div class="chatbot-fare-list">${rows}</div>
                <p><strong>Recommendation:</strong> ${recommended}. Ride app ke compare me approx ${formatRs(saving)} per trip save ho sakta hai.</p>
                <p class="chatbot-mini-note">Signal: ${escapeHtml(plan.route.signal)}. Prices StudentSync transit calculator ke estimates hain.</p>
            </div>
            ${makeLink(pages.find(page => page.key === 'transit'), 'Open full Transit Calculator')}
        `;
    }

    function renderCityAnswer(instKey) {
        const inst = institutions[instKey];
        const guide = cityGuides[inst?.area];
        if (!inst || !guide) return null;

        const rows = guide.areas.map(area => `
            <div class="chatbot-area-row">
                <strong>${area.name}</strong>
                <span>Rent: ${formatRs(area.rent[0])}-${formatRs(area.rent[1])}</span>
                <small>${area.commute} - ${area.note}</small>
            </div>
        `).join('');

        return `
            <div class="chatbot-route-card">
                <div class="chatbot-route-head">
                    <span>${escapeHtml(inst.name)} nearby areas</span>
                    <strong>${escapeHtml(guide.label)}</strong>
                </div>
                <div class="chatbot-area-list">${rows}</div>
                <p class="chatbot-mini-note">Room/hostel final karne se pehle evening visit, water timing, advance payment aur commute test zaroor verify karein.</p>
            </div>
            ${makeLink(pages.find(page => page.key === 'city'), 'Open Karachi City Guide')}
        `;
    }

    function renderSafeRouteAnswer(originKey, instKey) {
        const plan = getRoutePlan(originKey, instKey);
        if (!plan) return null;
        const score = plan.route.congestion > 24 ? 68 : plan.route.congestion > 16 ? 76 : 84;
        const status = score >= 80 ? 'Safe' : score >= 70 ? 'Moderate' : 'Use caution';
        return `
            <div class="chatbot-route-card">
                <div class="chatbot-route-head">
                    <span>${escapeHtml(plan.originLabel)} to ${escapeHtml(plan.campusLabel)}</span>
                    <strong>${status}</strong>
                </div>
                <p>Estimated travel time ${plan.options[plan.recommended].time} min hai. Best practical mode: <strong>${modeMeta[plan.recommended].label}</strong>.</p>
                <p>Main roads prefer karein, class timing se 10-15 min pehle buffer rakhein, aur raat me well-lit pickup/drop points use karein.</p>
            </div>
            ${makeLink(pages.find(page => page.key === 'routes'), 'Open Route Intelligence')}
        `;
    }

    function renderMentorAnswer(clean) {
        const isResume = clean.includes('resume') || clean.includes('cv');
        const isInterview = clean.includes('interview') || clean.includes('mock');
        const isRoadmap = clean.includes('roadmap') || clean.includes('career') || clean.includes('path');

        if (isInterview) {
            return `
                <div class="chatbot-study-card">
                    <div class="chatbot-study-head">
                        <i class="fa-solid fa-microphone-lines"></i>
                        <div><span>Mock Interview</span><strong>Practice prompt</strong></div>
                    </div>
                    <p><strong>Question:</strong> Explain one project you built. What user problem did it solve, what tools did you use, and what measurable result did it create?</p>
                    <ol>
                        <li>Start with context in one sentence.</li>
                        <li>Name your exact action and tools.</li>
                        <li>End with result, learning or metric.</li>
                    </ol>
                    <p class="chatbot-mini-note">Reply with your answer here, or open the full arena for scoring tools.</p>
                </div>
                <a class="chatbot-link" href="strategic-mentorship.html#interview-arena">Open Mock Interview Arena <i class="fa-solid fa-arrow-right"></i></a>
            `;
        }

        if (isResume) {
            return `
                <div class="chatbot-study-card">
                    <div class="chatbot-study-head">
                        <i class="fa-solid fa-file-lines"></i>
                        <div><span>Resume Roaster</span><strong>Bullet formula</strong></div>
                    </div>
                    <p>Use this structure: <strong>Built [project] using [tools] to solve [problem], resulting in [impact].</strong></p>
                    <p>Weak: "I made a website."<br>Strong: "Built a responsive StudentSync dashboard using HTML, CSS and JavaScript to compare route costs and reduce manual planning time."</p>
                </div>
                <a class="chatbot-link" href="strategic-mentorship.html#resume-roaster">Open Resume Roaster <i class="fa-solid fa-arrow-right"></i></a>
            `;
        }

        if (isRoadmap) {
            return `
                <div class="chatbot-study-card">
                    <div class="chatbot-study-head">
                        <i class="fa-solid fa-compass"></i>
                        <div><span>Career roadmap</span><strong>Next 3 moves</strong></div>
                    </div>
                    <ol>
                        <li>Pick one track: frontend, backend, data, mobile, business or engineering.</li>
                        <li>Build one small proof project in 7 days.</li>
                        <li>Use Knowledge Quest and mock interview to turn it into portfolio evidence.</li>
                    </ol>
                </div>
                <a class="chatbot-link" href="strategic-mentorship.html#career-roadmap">Open Dynamic Roadmaps <i class="fa-solid fa-arrow-right"></i></a>
            `;
        }

        return `${pages.find(page => page.key === 'mentor').answer}<br>${makeLink(pages.find(page => page.key === 'mentor'), 'Open Strategic Mentorship')}`;
    }

    function renderCivicAnswer() {
        return `
            <div class="chatbot-study-card">
                <div class="chatbot-study-head">
                    <i class="fa-solid fa-bullhorn"></i>
                    <div><span>Civic Voice Hub</span><strong>Report template</strong></div>
                </div>
                <p>Complaint ko useful banane ke liye ye 4 cheezen likhein:</p>
                <ol>
                    <li>Campus / area name.</li>
                    <li>Issue category: transport, admin delay, infrastructure, academics or safety.</li>
                    <li>Exactly kya ho raha hai aur kab se.</li>
                    <li>Student impact: late class, unsafe route, lost time, fee/document delay.</li>
                </ol>
                <p class="chatbot-mini-note">Example: NED main gate road par pothole ki wajah se morning traffic jam hota hai, students 8:30 class miss kar rahe hain.</p>
            </div>
            <a class="chatbot-link" href="civic-voice.html">Open Civic Voice Hub <i class="fa-solid fa-arrow-right"></i></a>
        `;
    }

    function renderRegistrationAnswer() {
        return `
            <div class="chatbot-study-card">
                <div class="chatbot-study-head">
                    <i class="fa-solid fa-user-plus"></i>
                    <div><span>Join Now</span><strong>Registration guide</strong></div>
                </div>
                <ol>
                    <li>Open registration page.</li>
                    <li>Full name, father name, CNIC, date of birth and contact details fill karein.</li>
                    <li>Submit ke baad generated ID card preview/download kar sakte hain.</li>
                </ol>
            </div>
            <a class="chatbot-link" href="contact.html">Open Registration <i class="fa-solid fa-arrow-right"></i></a>
        `;
    }

    function answerQuestion(question) {
        const clean = normalize(question);
        const originKey = findArea(clean);
        const instKey = findInstitution(clean);
        const topicKey = findStudyTopic(clean);
        const routeIntent = ['jaana', 'jana', 'go', 'route', 'fare', 'price', 'prices', 'cost', 'kiraya', 'commute', 'transport', 'bus', 'ride'].some(word => clean.includes(word));
        const cityIntent = ['hostel', 'rent', 'room', 'area', 'mess', 'rehna', 'shift', 'move', 'near', 'paas'].some(word => clean.includes(word));
        const safetyIntent = ['safe', 'safety', 'traffic', 'alternate', 'road', 'raat', 'night'].some(word => clean.includes(word));
        const quizIntent = ['quiz', 'test', 'mcq', 'sawal', 'question', 'questions', 'practice'].some(word => clean.includes(word));
        const learnIntent = ['nahi aati', 'nhi aati', 'nai aati', 'bilkul', 'learn', 'start', 'kya karoon', 'kia karoon', 'kya karun', 'guide', 'line by line', 'roadmap'].some(word => clean.includes(word));
        const notesIntent = ['notes', 'note', 'pdf', 'download', 'resource', 'resources', 'cheatsheet'].some(word => clean.includes(word));
        const flashIntent = ['flashcard', 'flash card', 'flashcards', 'deck'].some(word => clean.includes(word));
        const explainIntent = ['explain', 'samjhao', 'samjha', 'kya hai', 'what is', 'meaning', 'concept'].some(word => clean.includes(word));

        if (!clean) return 'Website ya student planning se related sawal type karein, jaise "PHP nahi aati kya karoon?" ya "Gulshan se NED prices?".';

        if (chatState.mode === 'quiz') return handleQuizAnswer(clean);

        if (topicKey && quizIntent) return startTopicQuiz(topicKey);
        if (!topicKey && quizIntent) return 'Kis topic ka quiz loon? Example: "PHP ka quiz lo", "JavaScript quiz", "MySQL MCQ".';
        if (topicKey && flashIntent) return renderFlashcards(topicKey);
        if (topicKey && notesIntent) return renderNotesAnswer(topicKey);
        if (topicKey && (learnIntent || explainIntent)) return learnIntent ? renderLearningPlan(topicKey) : renderConceptAnswer(topicKey);

        if (!topicKey && learnIntent && (clean.includes('programming') || clean.includes('coding') || clean.includes('web'))) {
            return 'Start yahan se karein: HTML -> CSS -> JavaScript -> PHP/MySQL. Agar backend chahiye to "PHP nahi aati" type karein, frontend chahiye to "JavaScript nahi aati" type karein.';
        }

        if (clean.includes('mentor') || clean.includes('career') || clean.includes('resume') || clean.includes('cv') || clean.includes('interview') || clean.includes('roadmap')) {
            return renderMentorAnswer(clean);
        }

        if (clean.includes('complaint') || clean.includes('complain') || clean.includes('report') || clean.includes('issue') || clean.includes('problem')) {
            return renderCivicAnswer();
        }

        if (clean.includes('register') || clean.includes('registration') || clean.includes('join') || clean.includes('signup') || clean.includes('sign up') || clean.includes('apply')) {
            return renderRegistrationAnswer();
        }

        if (instKey && routeIntent && !originKey) return `${institutions[instKey].name} ke liye starting area bhi bata dein, jaise "Gulshan se ${institutions[instKey].name} prices".`;
        if (originKey && instKey && safetyIntent) return renderSafeRouteAnswer(originKey, instKey);
        if (originKey && instKey && routeIntent) return renderRouteAnswer(originKey, instKey);
        if (instKey && cityIntent) return renderCityAnswer(instKey);
        if (originKey && !instKey && routeIntent) {
            return `${areaLabels[originKey]} se kis campus jana hai? Example: "${areaLabels[originKey]} se NED prices".`;
        }
        if (instKey && routeIntent && !originKey) {
            return `${institutions[instKey].name} ke liye starting area bhi bata dein, jaise “Gulshan se ${institutions[instKey].name} prices”.`;
        }

        if (greetings.some(word => clean === word || clean.includes(`${word} `))) {
            const locationHint = currentPage ? `Abhi aap ${currentPage.title} page par hain.` : 'Abhi aap StudentSync website par hain.';
            return `${locationHint} Mujhse route prices, hostel/rent, topic learning, quizzes, notes, mentorship, registration aur complaints ke baare me pooch sakte hain.`;
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

        if ((clean.includes('current') || clean.includes('this page') || clean.includes('is page') || clean.includes('ye page')) && currentPage) {
            return `${currentPage.answer}<br>${makeLink(currentPage, `Stay on ${currentPage.title}`)}`;
        }

        return `Main StudentSync se related real help de sakta hoon: route prices, hostel/rent guide, notes/resources, topic learning, quizzes, civic reports, mentorship aur registration. Example try karein: "PHP nahi aati kya karoon?" ya "PHP ka quiz lo".`;
    }

    function sendQuestion(question) {
        addMessage('user', escapeHtml(question));
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
        if (isOpen) window.setTimeout(() => input.focus(), 100);
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

    addMessage('bot', 'Salam! Main StudentSync smart helper hoon. Try karein: "PHP nahi aati kya karoon?", "PHP ka quiz lo", "Gulshan se NED prices?", ya "notes kahan hain?".');
});
