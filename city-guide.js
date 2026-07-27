const institutions = {
    ned: { name: 'NED University', type: 'University', area: 'gulshan', corridor: 'University Road', campusNote: 'Engineering students usually do best near Gulshan, NIPA or University Road.' },
    ku: { name: 'Karachi University', type: 'University', area: 'gulshan', corridor: 'University Road', campusNote: 'Large public campus with many affordable student housing options nearby.' },
    fast: { name: 'FAST NUCES', type: 'University', area: 'pechs', corridor: 'Shahrah-e-Faisal / National Highway access', campusNote: 'Choose housing after checking the actual campus commute and point route.' },
    iba: { name: 'IBA Karachi', type: 'University', area: 'gulshan', corridor: 'Main Campus / City Campus split', campusNote: 'Confirm whether your classes are mostly at Main Campus or City Campus before renting.' },
    dhaus: { name: 'DHA Suffa University', type: 'University', area: 'clifton', corridor: 'DHA / Korangi Road', campusNote: 'DHA and Gizri are convenient; PECHS can reduce rent if commute is manageable.' },
    szabist: { name: 'SZABIST Karachi', type: 'University', area: 'clifton', corridor: 'Clifton / DHA', campusNote: 'Clifton is close but costly; Gizri and PECHS are common student alternatives.' },
    indus: { name: 'Indus University', type: 'University', area: 'pechs', corridor: 'Johar / Gulshan link', campusNote: 'Johar and Gulshan work well if you want food access and shared flats.' },
    nust: { name: 'NUST PNEC Karachi', type: 'University', area: 'pechs', corridor: 'Karsaz / Shahrah-e-Faisal corridor', campusNote: 'For NUST PNEC, Karsaz, PECHS and Bahadurabad keep commute manageable; test morning traffic before finalizing housing.' },
    dj_science: { name: 'DJ Science College', type: 'College', area: 'gulshan', corridor: 'Saddar / city access', campusNote: 'Saddar access matters; verify commute timing before choosing Gulshan or PECHS.' },
    st_patricks: { name: "St. Patrick's College", type: 'College', area: 'pechs', corridor: 'Saddar approach', campusNote: 'Garden, Saddar and PECHS are practical starting points for daily commute.' },
    gcw: { name: 'Govt College for Women', type: 'College', area: 'north_nazimabad', corridor: 'North Nazimabad belt', campusNote: 'For women students, prioritise verified hostel policy and guardian-friendly location.' },
    bahria_college: { name: 'Bahria College Karsaz', type: 'College', area: 'pechs', corridor: 'Karsaz Road', campusNote: 'Karsaz, PECHS and Bahadurabad give better access than far budget areas.' },
    adamjee: { name: 'Adamjee Science College', type: 'College', area: 'gulshan', corridor: 'Gulshan / Stadium Road', campusNote: 'Gulshan, Bahadurabad and Karsaz can work depending on family preference.' },
    djmc: { name: 'DJ Sindh Govt Science College', type: 'College', area: 'malir', corridor: 'Malir connector', campusNote: 'Malir and Model Colony help keep commute short and rent lower.' }
};

const areaGuides = {
    gulshan: {
        label: 'Gulshan / University Road',
        bestAreas: [
            { name: 'Gulshan-e-Iqbal', rent: [18000, 36000], commute: '10-30 min', fit: 92, note: 'Best balance for University Road campuses.' },
            { name: 'NIPA / Civic Center', rent: [20000, 40000], commute: '10-25 min', fit: 86, note: 'Good transport access and food options.' },
            { name: 'Gulistan-e-Johar', rent: [22000, 42000], commute: '20-45 min', fit: 74, note: 'Better flats, but check traffic before booking.' }
        ],
        food: ['Monthly mess in Gulshan or Johar', 'Campus canteen for lunch', 'Tiffin service during exam weeks'],
        transport: ['University Road buses and points', 'Classmate ride sharing', 'Ride-hailing only for late days'],
        safety: ['Visit the room in evening hours', 'Ask about water timing', 'Avoid paying full advance before inspection']
    },
    pechs: {
        label: 'PECHS / Karsaz / Saddar Link',
        bestAreas: [
            { name: 'PECHS / Nursery', rent: [26000, 52000], commute: '15-40 min', fit: 88, note: 'Central area with strong food and transport access.' },
            { name: 'Garden / Saddar', rent: [21000, 41000], commute: '10-30 min', fit: 80, note: 'Useful for city-side colleges; inspect carefully.' },
            { name: 'Bahadurabad / Karsaz', rent: [30000, 60000], commute: '15-35 min', fit: 78, note: 'Safer and cleaner, usually more expensive.' }
        ],
        food: ['PECHS mess services', 'Saddar budget restaurants', 'Weekly grocery plan to avoid delivery overspend'],
        transport: ['Shahrah-e-Faisal routes', 'Karsaz main road access', 'Keep extra buffer during office hours'],
        safety: ['Prefer main-road access', 'Check gate timings', 'Confirm electricity and utility split']
    },
    clifton: {
        label: 'Clifton / DHA / Gizri',
        bestAreas: [
            { name: 'Gizri / DHA Phase 2 Extension', rent: [28000, 52000], commute: '10-25 min', fit: 87, note: 'Good value for Clifton and DHA campuses.' },
            { name: 'Clifton Blocks 2-5', rent: [42000, 80000], commute: '5-20 min', fit: 82, note: 'Closest option, but rent is high.' },
            { name: 'PECHS as backup', rent: [26000, 52000], commute: '25-50 min', fit: 70, note: 'Lower rent if you can manage commute.' }
        ],
        food: ['Gizri mess and tiffin options', 'Campus food for lunch', 'Limit food apps to control monthly cost'],
        transport: ['Ride share with classmates', 'Main Clifton/DHA corridors', 'Rainy-day transport budget is important'],
        safety: ['Ask about curfew and visitor policy', 'Confirm AC/electricity charges', 'Avoid isolated side streets']
    },
    north_nazimabad: {
        label: 'North Nazimabad / Nazimabad',
        bestAreas: [
            { name: 'North Nazimabad', rent: [20000, 42000], commute: '10-30 min', fit: 90, note: 'Strong for colleges in the north corridor.' },
            { name: 'Nazimabad', rent: [17000, 34000], commute: '15-35 min', fit: 82, note: 'Budget-friendly and busy.' },
            { name: 'Federal B. Area', rent: [18000, 36000], commute: '20-40 min', fit: 76, note: 'Good backup if direct area is full.' }
        ],
        food: ['Local mess and home tiffin services', 'Market food for budget meals', 'Simple breakfast at room'],
        transport: ['Nazimabad main roads', 'Shared vans where available', 'Avoid unnecessary cross-city commute'],
        safety: ['Prefer family residential streets', 'Verify girls hostel references', 'Check transport after sunset']
    },
    malir: {
        label: 'Malir / Model Colony',
        bestAreas: [
            { name: 'Model Colony', rent: [16000, 32000], commute: '10-30 min', fit: 86, note: 'Good for Malir-side campuses and lower rent.' },
            { name: 'Malir Cantt edge', rent: [22000, 45000], commute: '15-35 min', fit: 80, note: 'Safer feel, usually higher cost.' },
            { name: 'Shah Faisal / Airport link', rent: [18000, 36000], commute: '20-45 min', fit: 70, note: 'Only choose after testing the route.' }
        ],
        food: ['Local mess near Model Colony', 'Campus canteen for lunch', 'Keep water and snacks for long commute days'],
        transport: ['Campus point if available', 'Malir main connector roads', 'Keep buffer for traffic bottlenecks'],
        safety: ['Avoid very remote cheap rooms', 'Check evening commute', 'Confirm building security']
    }
};

const budgets = {
    lean: { label: 'Lean', rentFactor: 0.86, food: 13000, transport: 7000, utilities: 5000 },
    balanced: { label: 'Balanced', rentFactor: 1, food: 18000, transport: 10000, utilities: 7000 },
    comfort: { label: 'Comfort', rentFactor: 1.22, food: 24000, transport: 15000, utilities: 10000 }
};

const state = {
    type: 'university',
    campus: 'ned',
    budget: 'balanced',
    priority: 'balanced',
    stay: 'hostel',
    areaIndex: 0,
    checklist: new Set()
};

const money = value => `PKR ${Math.round(value / 1000)}k`;
const range = values => `${money(values[0])}-${money(values[1])}`;

const currentInstitution = () => institutions[state.campus];
const currentGuide = () => areaGuides[currentInstitution().area];
const currentAreas = () => {
    const areas = [...currentGuide().bestAreas];
    if (state.priority === 'cheap') return areas.sort((a, b) => a.rent[0] - b.rent[0]);
    if (state.priority === 'near') return areas.sort((a, b) => b.fit - a.fit);
    return areas;
};

const selectedArea = () => currentAreas()[state.areaIndex] || currentAreas()[0];

const institutionKeysByType = type => Object.entries(institutions)
    .filter(([, inst]) => inst.type.toLowerCase() === type)
    .map(([key]) => key);

const syncFormValues = () => {
    document.getElementById('typeSelect').value = state.type;
    document.getElementById('uniSelect').value = state.campus;
    document.getElementById('budgetSelect').value = state.budget;
    document.getElementById('prioritySelect').value = state.priority;
    document.getElementById('staySelect').value = state.stay;
};

const calcBudget = () => {
    const area = selectedArea();
    const budget = budgets[state.budget];
    const stayFactor = state.stay === 'flat' ? 1.18 : state.stay === 'pg' ? 1.08 : 0.95;
    const rent = ((area.rent[0] + area.rent[1]) / 2) * budget.rentFactor * stayFactor;
    return {
        rent,
        food: budget.food,
        transport: state.priority === 'near' ? budget.transport * 0.8 : state.priority === 'cheap' ? budget.transport * 1.2 : budget.transport,
        utilities: budget.utilities
    };
};

const renderHeroWidget = () => {
    const inst = currentInstitution();
    const area = selectedArea();
    const budget = calcBudget();
    const total = budget.rent + budget.food + budget.transport + budget.utilities;

    document.getElementById('heroCampusName').textContent = inst.name;
    document.getElementById('heroAreaName').textContent = area.name;
    document.getElementById('heroBudget').textContent = money(total);
    document.getElementById('heroCommute').textContent = area.commute;
    document.getElementById('heroChecklist').textContent = `${state.checklist.size}/6 ready`;
};

const renderSummary = () => {
    const inst = currentInstitution();
    const area = selectedArea();
    document.getElementById('guideContent').innerHTML = `
        <div class="simple-summary">
            <div>
                <span class="guide-badge"><i class="fa-solid fa-building-columns"></i> ${inst.type}</span>
                <h2>${inst.name}</h2>
                <p>${inst.campusNote}</p>
            </div>
            <div class="simple-score">
                <span>Recommended start</span>
                <strong>${area.name}</strong>
                <small>${currentGuide().label}</small>
            </div>
        </div>
    `;
};

const renderAreaChoices = () => {
    const areas = currentAreas();
    if (state.areaIndex >= areas.length) state.areaIndex = 0;
    document.getElementById('areaOptions').innerHTML = areas.map((area, index) => `
        <button type="button" class="area-choice${index === state.areaIndex ? ' active' : ''}" data-area-index="${index}">
            <span>${area.name}</span>
            <strong>${area.fit}% match</strong>
            <small>${area.commute} - ${range(area.rent)}</small>
            <em>${area.note}</em>
        </button>
    `).join('');
};

const renderActionCards = () => {
    const guide = currentGuide();
    const cards = [
        ['Housing', 'fa-house-user', guide.bestAreas.map(area => `Shortlist ${area.name}`).slice(0, 2).concat(['Visit or video-call before advance'])],
        ['Food', 'fa-utensils', guide.food],
        ['Commute', 'fa-bus', guide.transport],
        ['Safety', 'fa-shield-halved', guide.safety]
    ];

    document.getElementById('actionCards').innerHTML = cards.map(([title, icon, items]) => `
        <article class="action-card">
            <h3><i class="fa-solid ${icon}"></i> ${title}</h3>
            <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
        </article>
    `).join('');
};

const renderBudget = () => {
    const budget = calcBudget();
    const total = budget.rent + budget.food + budget.transport + budget.utilities;
    document.getElementById('budgetTotal').textContent = money(total);
    document.getElementById('budgetLines').innerHTML = `
        <div class="budget-line"><span>Room / hostel</span><strong>${money(budget.rent)}</strong></div>
        <div class="budget-line"><span>Food / mess</span><strong>${money(budget.food)}</strong></div>
        <div class="budget-line"><span>Transport</span><strong>${money(budget.transport)}</strong></div>
        <div class="budget-line"><span>Utilities + mobile</span><strong>${money(budget.utilities)}</strong></div>
    `;
    document.getElementById('quickPlan').innerHTML = `
        <li><i class="fa-solid fa-location-dot"></i><span>Start in <strong style="color:white;">${selectedArea().name}</strong>.</span></li>
        <li><i class="fa-solid fa-wallet"></i><span>${budgets[state.budget].label} budget selected.</span></li>
        <li><i class="fa-solid fa-route"></i><span>Test commute during your actual class time.</span></li>
    `;
};

const checklistItems = [
    'Admission letter and fee receipt saved',
    'Room/hostel verified by visit or video call',
    'Monthly mess or food plan selected',
    'Morning commute tested once',
    'Emergency contacts saved',
    'CNIC copies and photos packed'
];

const renderChecklist = () => {
    document.getElementById('checklist').innerHTML = checklistItems.map((item, index) => `
        <label class="check-row">
            <input type="checkbox" data-check="${index}" ${state.checklist.has(index) ? 'checked' : ''}>
            <span>${item}</span>
        </label>
    `).join('');
};

const renderCampusOptions = () => {
    const keys = institutionKeysByType(state.type);
    if (!keys.includes(state.campus)) state.campus = keys[0] || 'ned';
    document.getElementById('uniSelect').innerHTML = keys.map(key => {
        const inst = institutions[key];
        return `<option value="${key}">${inst.name}</option>`;
    }).join('');
};

const renderTopCampuses = () => {
    const keys = Object.keys(institutions);
    document.getElementById('topCampusGrid').innerHTML = keys.map(key => {
        const inst = institutions[key];
        return `
            <article class="campus-card">
                <span class="campus-icon"><i class="fa-solid ${inst.type === 'College' ? 'fa-school' : 'fa-building-columns'}"></i></span>
                <h3>${inst.name}</h3>
                <p>${inst.type} - ${inst.corridor}</p>
                <button type="button" data-campus="${key}">Plan for this <i class="fa-solid fa-arrow-right"></i></button>
            </article>
        `;
    }).join('');
};

const render = () => {
    renderCampusOptions();
    syncFormValues();
    renderSummary();
    renderAreaChoices();
    renderActionCards();
    renderBudget();
    renderChecklist();
    renderHeroWidget();
};

document.addEventListener('DOMContentLoaded', () => {
    renderTopCampuses();
    render();

    document.getElementById('typeSelect').addEventListener('change', event => {
        state.type = event.target.value;
        state.campus = institutionKeysByType(state.type)[0] || state.campus;
        state.areaIndex = 0;
        render();
    });

    document.getElementById('uniSelect').addEventListener('change', event => {
        state.campus = event.target.value;
        state.areaIndex = 0;
        render();
    });

    document.getElementById('budgetSelect').addEventListener('change', event => {
        state.budget = event.target.value;
        render();
    });

    document.getElementById('prioritySelect').addEventListener('change', event => {
        state.priority = event.target.value;
        state.areaIndex = 0;
        render();
    });

    document.getElementById('staySelect').addEventListener('change', event => {
        state.stay = event.target.value;
        render();
    });

    document.addEventListener('click', event => {
        const areaBtn = event.target.closest('[data-area-index]');
        const campusBtn = event.target.closest('[data-campus]');

        if (areaBtn) {
            state.areaIndex = parseInt(areaBtn.dataset.areaIndex, 10);
            render();
        }

        if (campusBtn) {
            state.campus = campusBtn.dataset.campus;
            state.type = institutions[state.campus].type.toLowerCase();
            state.areaIndex = 0;
            render();
            document.getElementById('relocation-planner').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    document.getElementById('checklist').addEventListener('change', event => {
        const item = event.target.closest('[data-check]');
        if (!item) return;
        const index = parseInt(item.dataset.check, 10);
        if (item.checked) state.checklist.add(index);
        else state.checklist.delete(index);
        renderHeroWidget();
    });
});
