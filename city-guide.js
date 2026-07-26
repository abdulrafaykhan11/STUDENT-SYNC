const campuses = {
    ku: {
        name: 'University of Karachi',
        short: 'KU',
        type: 'Public university',
        corridor: 'University Road / Gulshan-e-Iqbal',
        bestFor: 'Students who want a large public university environment with affordable nearby housing.',
        summary: 'A major campus corridor with strong student housing density around Gulshan-e-Iqbal, NIPA, Mosamiyat and Abul Hasan Isphahani Road.',
        commuteAnchor: 'University Road',
        monthly: { rent: [18000, 32000], food: [12000, 19000], transport: [5000, 10000], utilities: [5000, 9000] },
        areas: [
            { name: 'Gulshan-e-Iqbal Block 13D / NIPA', vibe: 'Most balanced for KU students', commute: '10-25 min', rent: [20000, 35000], safety: 78, food: 90, commuteScore: 88, notes: 'Good mess access, shared flats and bus routes.' },
            { name: 'Mosamiyat / Abul Hasan Isphahani Road', vibe: 'Budget-friendly student belt', commute: '15-30 min', rent: [16000, 28000], safety: 70, food: 84, commuteScore: 82, notes: 'Better for students prioritising rent over polish.' },
            { name: 'Johar Blocks 14-17', vibe: 'More residential, mixed budget', commute: '20-40 min', rent: [22000, 40000], safety: 76, food: 78, commuteScore: 70, notes: 'Check commute at morning peak before finalising.' }
        ],
        housing: ['University hostel if available', 'Verified private hostel near University Road', 'Two or three-person shared flat in Gulshan', 'Family-referenced paying guest option for first semester'],
        food: ['Monthly mess near Gulshan / Mosamiyat', 'Campus canteens for lunch', 'Tiffin service for dinner during exam weeks', 'Keep one self-cooking backup for late nights'],
        transport: ['University points where available', 'People Bus / local bus corridors on University Road', 'Ride-hailing only for late or rainy days', 'Keep 20-30 minutes buffer in monsoon season'],
        firstWeek: ['Visit department and transport office on day one', 'Confirm student card and library process', 'Test morning commute before first class', 'Save two nearby pharmacies and one clinic'],
        caution: ['Do not pay hostel advance without visiting or video verification', 'Check room ventilation and water timing', 'Confirm if electricity backup is included']
    },
    ned: {
        name: 'NED University of Engineering & Technology',
        short: 'NED',
        type: 'Public engineering university',
        corridor: 'University Road / Safari Park',
        bestFor: 'Engineering students who need reliable commute and a focused academic routine.',
        summary: 'NED sits in the same high-demand student corridor as KU, making Gulshan and nearby University Road areas practical for daily classes.',
        commuteAnchor: 'University Road near Safari Park',
        monthly: { rent: [19000, 34000], food: [13000, 20000], transport: [5000, 11000], utilities: [5000, 9000] },
        areas: [
            { name: 'Gulshan-e-Iqbal Block 10 / 13D', vibe: 'Best all-round NED zone', commute: '10-25 min', rent: [21000, 36000], safety: 78, food: 88, commuteScore: 90, notes: 'Good for point routes, groceries and mess options.' },
            { name: 'NIPA / Federal B. Area edge', vibe: 'Practical commute belt', commute: '20-35 min', rent: [18000, 31000], safety: 74, food: 80, commuteScore: 76, notes: 'Compare actual travel time before booking.' },
            { name: 'Johar / Munawar Chowrangi side', vibe: 'Better flats, longer commute', commute: '25-45 min', rent: [23000, 42000], safety: 77, food: 78, commuteScore: 68, notes: 'Useful if sharing with friends from multiple campuses.' }
        ],
        housing: ['Official hostel route where eligible', 'Private hostel near University Road', 'Shared apartment with engineering batchmates', 'Short-stay guest room for the first two weeks'],
        food: ['Campus cafeteria for day meals', 'Monthly mess in Gulshan', 'Budget dhabas around University Road', 'Cook breakfast at home to control cost'],
        transport: ['Campus point or private van', 'University Road bus corridor', 'Bike/ride-hailing only after route familiarity', 'Avoid very remote rentals to save small rent'],
        firstWeek: ['Map all lab buildings before classes begin', 'Ask seniors about point timings', 'Buy basic drafting/lab supplies early', 'Join official class WhatsApp or LMS channel'],
        caution: ['Engineering schedules can run long; avoid housing with strict early gate closure', 'Check water pressure and backup power before advance']
    },
    iba: {
        name: 'IBA Karachi',
        short: 'IBA',
        type: 'Public sector institute',
        corridor: 'Main Campus: University Road, City Campus: Garden / Saddar',
        bestFor: 'Business, CS and economics students who may move between main and city campus.',
        summary: 'IBA students should choose housing based on actual campus allocation. Main Campus fits Gulshan; City Campus fits Garden, Saddar or PECHS.',
        commuteAnchor: 'Main Campus and City Campus split',
        monthly: { rent: [24000, 47000], food: [15000, 24000], transport: [7000, 15000], utilities: [7000, 12000] },
        areas: [
            { name: 'Gulshan-e-Iqbal / NIPA', vibe: 'Best for Main Campus', commute: '10-25 min', rent: [23000, 42000], safety: 78, food: 88, commuteScore: 88, notes: 'Choose this if most classes are at Main Campus.' },
            { name: 'Garden East / Saddar', vibe: 'Best for City Campus', commute: '10-25 min', rent: [22000, 39000], safety: 68, food: 86, commuteScore: 84, notes: 'Visit at evening time before finalising.' },
            { name: 'PECHS / Nursery', vibe: 'Comfortable middle option', commute: '20-40 min', rent: [30000, 55000], safety: 80, food: 90, commuteScore: 72, notes: 'Higher cost, better access to both sides of city.' }
        ],
        housing: ['IBA hostel if allotted', 'Shared flat near Main Campus for lower commute', 'PECHS shared apartment for balanced access', 'Verified girls hostel / family PG near Garden or PECHS'],
        food: ['Campus cafeteria', 'Monthly mess in PECHS or Gulshan', 'Saddar budget restaurants for City Campus days', 'Weekly grocery plan to avoid food app overspend'],
        transport: ['Campus shuttle if available', 'Main-to-city campus commute buffer', 'Ride share with classmates on late days', 'Avoid daily long ride-hailing if budget is tight'],
        firstWeek: ['Confirm campus-wise timetable', 'Register with student affairs / hostel office', 'Build a class commute group', 'Track attendance policy from week one'],
        caution: ['Do not rent near Main Campus if your schedule is mostly City Campus', 'For girls hostels, verify guardian policy, curfew and visitors policy']
    },
    duhs: {
        name: 'Dow University of Health Sciences',
        short: 'DUHS',
        type: 'Public medical university',
        corridor: 'Ojha Campus / Civil Hospital corridor',
        bestFor: 'Medical, dental and health sciences students with hospital-linked schedules.',
        summary: 'Dow has multiple campus realities. Ojha side points toward Safoora and Scheme 33; City/Civil side points toward Saddar, Garden and PECHS.',
        commuteAnchor: 'Ojha / Civil Hospital split',
        monthly: { rent: [22000, 42000], food: [14000, 23000], transport: [6000, 14000], utilities: [6000, 11000] },
        areas: [
            { name: 'Safoora / Scheme 33', vibe: 'Best for Ojha Campus', commute: '10-25 min', rent: [20000, 36000], safety: 74, food: 76, commuteScore: 88, notes: 'Prioritise secure building and reliable water.' },
            { name: 'Garden / Saddar', vibe: 'Best for Civil Hospital side', commute: '10-25 min', rent: [22000, 40000], safety: 67, food: 88, commuteScore: 86, notes: 'Convenient but inspect area carefully at night.' },
            { name: 'PECHS', vibe: 'Safer balanced option', commute: '25-45 min', rent: [31000, 56000], safety: 82, food: 90, commuteScore: 70, notes: 'Higher rent, good for students with family preference.' }
        ],
        housing: ['Official hostel route where eligible', 'Medical student hostel near Safoora or Saddar', 'Family-referenced PG for first-year students', 'Shared flat with classmates after first semester'],
        food: ['Hospital canteens for day meals', 'Monthly mess near Safoora / Garden', 'Simple meal prep for late study nights', 'Keep ORS, snacks and water routine during rotations'],
        transport: ['Choose housing by campus/ward schedule', 'Keep emergency ride budget', 'Avoid very long commute during clinical years', 'Share verified driver contacts with batchmates'],
        firstWeek: ['Confirm campus and hospital reporting location', 'Find nearest pharmacy and lab services', 'Prepare copies of documents and medical forms', 'Set a reliable sleep and food routine early'],
        caution: ['Late hospital duties need safer commute planning', 'Avoid isolated hostels even if rent is low']
    },
    aku: {
        name: 'Aga Khan University',
        short: 'AKU',
        type: 'Private health sciences university',
        corridor: 'Stadium Road / Karsaz / Gulshan edge',
        bestFor: 'Health sciences students who value safety, predictable commute and disciplined routines.',
        summary: 'AKU students usually benefit from safer, higher-quality housing around Karsaz, Gulshan edge, PECHS or family-referenced PG options.',
        commuteAnchor: 'Stadium Road',
        monthly: { rent: [35000, 65000], food: [18000, 30000], transport: [8000, 18000], utilities: [8000, 15000] },
        areas: [
            { name: 'Karsaz / Stadium Road edge', vibe: 'Closest premium corridor', commute: '10-25 min', rent: [40000, 70000], safety: 84, food: 78, commuteScore: 90, notes: 'Higher rent but excellent commute control.' },
            { name: 'Gulshan-e-Iqbal blocks near Civic Center', vibe: 'Balanced student option', commute: '20-35 min', rent: [28000, 50000], safety: 78, food: 86, commuteScore: 76, notes: 'More mess and shared flat availability.' },
            { name: 'PECHS / Bahadurabad', vibe: 'Comfort-focused option', commute: '20-40 min', rent: [36000, 68000], safety: 83, food: 90, commuteScore: 72, notes: 'Good for students with family visits or comfort priority.' }
        ],
        housing: ['Official or institution-recommended accommodation first', 'Family-referenced PG near Karsaz / PECHS', 'Shared apartment in Gulshan or Bahadurabad', 'Short stay before signing long lease'],
        food: ['Campus / hospital food options', 'Premium mess in PECHS or Bahadurabad', 'Weekly grocery and meal prep', 'Avoid daily delivery to keep budget realistic'],
        transport: ['Keep commute short for clinical workload', 'Ride-hailing buffer for late duties', 'Prefer known driver or class groups', 'Check road closures around Stadium Road'],
        firstWeek: ['Confirm ID, hostel and hospital access rules', 'Save campus security numbers', 'Build a commute group', 'Set a weekly laundry and meal schedule'],
        caution: ['Do not optimise only for rent; health sciences workload makes commute fatigue expensive', 'Verify building security and entry policy']
    },
    szabist: {
        name: 'SZABIST Karachi',
        short: 'SZABIST',
        type: 'Private university',
        corridor: 'Clifton / DHA / Gizri',
        bestFor: 'Students studying business, media, social sciences or computing around Clifton.',
        summary: 'Clifton is convenient but expensive. Many students control cost by living in Gizri, DHA Phase 2 Extension or PECHS with a planned commute.',
        commuteAnchor: 'Clifton Blocks 2-5',
        monthly: { rent: [30000, 58000], food: [16000, 28000], transport: [8000, 18000], utilities: [7000, 14000] },
        areas: [
            { name: 'Gizri / DHA Phase 2 Extension', vibe: 'Best student value near Clifton', commute: '10-25 min', rent: [28000, 50000], safety: 78, food: 84, commuteScore: 86, notes: 'Good balance if room is verified.' },
            { name: 'Clifton Blocks 2 / 5', vibe: 'Closest but expensive', commute: '5-15 min', rent: [40000, 75000], safety: 82, food: 92, commuteScore: 95, notes: 'Only choose if budget comfortably allows.' },
            { name: 'PECHS / Nursery', vibe: 'Budget-control alternative', commute: '25-45 min', rent: [26000, 52000], safety: 80, food: 90, commuteScore: 66, notes: 'Works if you can tolerate commute.' }
        ],
        housing: ['Private hostel in DHA / Gizri', 'Paying guest room with references', 'Shared flat in PECHS', 'Short commute sublet for first semester'],
        food: ['Gizri mess and tiffin options', 'Campus / Clifton cafes for occasional meals', 'PECHS monthly mess', 'Limit delivery apps to protect budget'],
        transport: ['Ride share with classmates', 'Bus routes on main corridors where practical', 'Keep rainy-day transport budget', 'Avoid far areas without direct commute'],
        firstWeek: ['Walk the campus-to-room route in daylight', 'Find grocery, laundry and pharmacy nearby', 'Join batch groups for ride sharing', 'Track attendance and class timing early'],
        caution: ['Clifton rent can quietly break budget', 'Check hostel curfew, AC charges and utility splits']
    }
};

const budgetModes = {
    lean: { label: 'Lean', rent: 0.82, food: 0.88, transport: 0.9, utilities: 0.85, comfort: 'Shared room, monthly mess, strict transport planning.' },
    balanced: { label: 'Balanced', rent: 1, food: 1, transport: 1, utilities: 1, comfort: 'Shared room or hostel with reliable food and commute.' },
    comfort: { label: 'Comfort', rent: 1.25, food: 1.18, transport: 1.22, utilities: 1.15, comfort: 'Better room quality, safer corridor and flexible commute.' }
};

const accommodationBias = {
    any: { label: 'Any safe option', rent: 1, safety: 0 },
    boys: { label: 'Boys hostel / sharing', rent: 0.92, safety: 1 },
    girls: { label: 'Girls hostel / family PG', rent: 1.08, safety: 8 },
    flat: { label: 'Shared flat', rent: 1.15, safety: 3 }
};

const commuteBias = {
    near: { label: 'Stay near campus', commute: 15, rent: 1.12 },
    balanced: { label: 'Balance rent + commute', commute: 0, rent: 1 },
    cheap: { label: 'Save rent, travel more', commute: -8, rent: 0.88 }
};

const money = value => `PKR ${Math.round(value / 1000)}k`;
const rangeMoney = range => `${money(range[0])}-${money(range[1])}`;
const average = range => (range[0] + range[1]) / 2;

const getSelected = () => ({
    campusKey: document.getElementById('uniSelect').value,
    budgetKey: document.getElementById('budgetSelect').value,
    accommodationKey: document.getElementById('genderSelect').value,
    commuteKey: document.getElementById('commuteSelect').value
});

const scoreArea = (area, accommodationKey, commuteKey) => {
    const accommodation = accommodationBias[accommodationKey];
    const commute = commuteBias[commuteKey];
    return Math.max(35, Math.min(98, Math.round(
        area.commuteScore * 0.42 +
        area.food * 0.22 +
        (area.safety + accommodation.safety) * 0.26 +
        commute.commute * 0.1
    )));
};

const adjustedBudget = (campus, budgetKey, accommodationKey, commuteKey) => {
    const budget = budgetModes[budgetKey];
    const accommodation = accommodationBias[accommodationKey];
    const commute = commuteBias[commuteKey];

    const rent = average(campus.monthly.rent) * budget.rent * accommodation.rent * commute.rent;
    const food = average(campus.monthly.food) * budget.food;
    const transport = average(campus.monthly.transport) * budget.transport * (commuteKey === 'near' ? 0.78 : commuteKey === 'cheap' ? 1.22 : 1);
    const utilities = average(campus.monthly.utilities) * budget.utilities;

    return {
        rent,
        food,
        transport,
        utilities,
        total: rent + food + transport + utilities
    };
};

const renderCampusOptions = () => {
    const select = document.getElementById('uniSelect');
    select.innerHTML = Object.entries(campuses).map(([key, campus]) =>
        `<option value="${key}">${campus.name}</option>`
    ).join('');
};

const renderGuide = () => {
    const { campusKey, budgetKey, accommodationKey, commuteKey } = getSelected();
    const campus = campuses[campusKey];
    const budget = adjustedBudget(campus, budgetKey, accommodationKey, commuteKey);
    const rankedAreas = [...campus.areas]
        .map(area => ({ ...area, fit: scoreArea(area, accommodationKey, commuteKey) }))
        .sort((a, b) => b.fit - a.fit);

    document.getElementById('guideContent').innerHTML = `
        <div class="campus-profile">
            <div class="campus-lead">
                <span class="guide-badge"><i class="fa-solid fa-building-columns"></i> ${campus.type}</span>
                <h2>${campus.name}</h2>
                <p>${campus.summary}</p>
            </div>
            <div class="score-card">
                <span>Best matched area</span>
                <strong>${rankedAreas[0].fit}%</strong>
                <p>${rankedAreas[0].name}<br>${rankedAreas[0].vibe}</p>
            </div>
        </div>

        <div class="guide-grid">
            <article class="mini-card">
                <h3><i class="fa-solid fa-house-user"></i> Accommodation Strategy</h3>
                <ul>${campus.housing.map(item => `<li>${item}</li>`).join('')}</ul>
            </article>
            <article class="mini-card">
                <h3><i class="fa-solid fa-utensils"></i> Food & Mess Plan</h3>
                <ul>${campus.food.map(item => `<li>${item}</li>`).join('')}</ul>
            </article>
            <article class="mini-card">
                <h3><i class="fa-solid fa-bus"></i> Commute Plan</h3>
                <ul>${campus.transport.map(item => `<li>${item}</li>`).join('')}</ul>
            </article>
        </div>

        <div class="guide-section-title" style="margin-top:1.2rem;">
            <div>
                <h3>Recommended Neighbourhoods</h3>
                <p>Fit score combines commute, food access, safety signals and your selected budget style.</p>
            </div>
            <span class="guide-badge"><i class="fa-solid fa-sliders"></i> ${budgetModes[budgetKey].label} plan</span>
        </div>
        <div class="area-list">
            ${rankedAreas.map(area => `
                <article class="area-card">
                    <div class="area-top">
                        <div>
                            <strong>${area.name}</strong>
                            <span>${area.vibe} - commute ${area.commute}</span>
                        </div>
                        <span class="guide-badge">${area.fit}% fit</span>
                    </div>
                    <div class="fit-meter"><div style="width:${area.fit}%"></div></div>
                    <p style="color:var(--text-muted);font-size:.82rem;line-height:1.5;">Rent estimate: ${rangeMoney(area.rent)}. ${area.notes}</p>
                </article>
            `).join('')}
        </div>

        <div class="guide-grid" style="margin-top:1rem;">
            <article class="mini-card">
                <h3><i class="fa-solid fa-calendar-check"></i> First 7 Days</h3>
                <ul>${campus.firstWeek.map(item => `<li>${item}</li>`).join('')}</ul>
            </article>
            <article class="mini-card">
                <h3><i class="fa-solid fa-shield-halved"></i> Safety Checks</h3>
                <ul>${campus.caution.map(item => `<li>${item}</li>`).join('')}</ul>
            </article>
            <article class="mini-card">
                <h3><i class="fa-solid fa-file-circle-check"></i> Documents To Keep</h3>
                <ul>
                    <li>CNIC/B-form copies, admission letter and fee challan.</li>
                    <li>Parent/guardian CNIC copy and emergency contacts.</li>
                    <li>Passport-size photos, medical record and blood group.</li>
                    <li>Soft copies saved in email and phone gallery.</li>
                </ul>
            </article>
        </div>
    `;

    renderBudget(campus, budget, budgetKey, accommodationKey, commuteKey);
};

const renderBudget = (campus, budget, budgetKey, accommodationKey, commuteKey) => {
    document.getElementById('budgetTotal').textContent = money(budget.total);
    document.getElementById('budgetLines').innerHTML = `
        <div class="budget-line"><span>Room / hostel</span><strong>${money(budget.rent)}</strong></div>
        <div class="budget-line"><span>Mess / groceries</span><strong>${money(budget.food)}</strong></div>
        <div class="budget-line"><span>Transport</span><strong>${money(budget.transport)}</strong></div>
        <div class="budget-line"><span>Utilities + mobile</span><strong>${money(budget.utilities)}</strong></div>
    `;

    const selectedArea = [...campus.areas]
        .map(area => ({ ...area, fit: scoreArea(area, accommodationKey, commuteKey) }))
        .sort((a, b) => b.fit - a.fit)[0];

    document.getElementById('quickPlan').innerHTML = `
        <li><i class="fa-solid fa-location-dot"></i><span>Start your search in <strong style="color:white;">${selectedArea.name}</strong>, then compare one cheaper backup area.</span></li>
        <li><i class="fa-solid fa-wallet"></i><span>${budgetModes[budgetKey].comfort}</span></li>
        <li><i class="fa-solid fa-house-lock"></i><span>${accommodationBias[accommodationKey].label}: verify room, water timing, electricity backup, curfew and visitor policy.</span></li>
        <li><i class="fa-solid fa-route"></i><span>${commuteBias[commuteKey].label}: test the commute during actual class timing before paying advance.</span></li>
    `;
};

const renderTopCampuses = () => {
    const topKeys = ['ku', 'ned', 'iba', 'duhs', 'aku'];
    document.getElementById('topCampusGrid').innerHTML = topKeys.map(key => {
        const campus = campuses[key];
        return `
            <article class="campus-card">
                <span class="campus-icon"><i class="fa-solid fa-building-columns"></i></span>
                <h3>${campus.name}</h3>
                <p>${campus.corridor}</p>
                <p>${campus.bestFor}</p>
                <button type="button" data-campus="${key}">Use this campus <i class="fa-solid fa-arrow-right"></i></button>
            </article>
        `;
    }).join('');
};

document.addEventListener('DOMContentLoaded', () => {
    renderCampusOptions();
    renderTopCampuses();
    renderGuide();

    ['uniSelect', 'budgetSelect', 'genderSelect', 'commuteSelect'].forEach(id => {
        document.getElementById(id).addEventListener('change', renderGuide);
    });

    document.getElementById('topCampusGrid').addEventListener('click', event => {
        const button = event.target.closest('[data-campus]');
        if (!button) return;
        document.getElementById('uniSelect').value = button.dataset.campus;
        renderGuide();
        document.getElementById('relocation-planner').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
