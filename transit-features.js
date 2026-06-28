document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const budgetPanel = document.getElementById('budget-planner');
    const surgePanel = document.getElementById('surge-advisor');
    if (!budgetPanel && !surgePanel) return;

    const formatRs = value => `Rs ${Math.round(value).toLocaleString()}`;
    const modeLabels = { ride: 'Ride App', bus: 'Public Bus', carpool: 'Carpool', shuttle: 'Campus Shuttle' };

    let latestPlan = null;

    /* =========================================
       Feature 1: Semester Budget Planner
       ========================================= */
    if (budgetPanel) {
        const budgetInput = document.getElementById('budget-monthly');
        const daysInput = document.getElementById('budget-days');
        const weeksInput = document.getElementById('budget-weeks');
        const budgetOutput = document.getElementById('budget-output');
        const budgetBar = document.getElementById('budget-bar-fill');
        const budgetStatus = document.getElementById('budget-status');
        const budgetModes = document.getElementById('budget-modes');

        const renderBudget = () => {
            if (!latestPlan || !budgetOutput) return;

            const monthlyBudget = Math.max(500, parseInt(budgetInput?.value, 10) || 3000);
            const daysPerWeek = Math.min(7, Math.max(1, parseInt(daysInput?.value, 10) || 5));
            const semesterWeeks = Math.min(20, Math.max(8, parseInt(weeksInput?.value, 10) || 16));
            const tripsPerMonth = Math.round((daysPerWeek / 7) * 30) * 2;

            const modeCosts = Object.entries(latestPlan.options).map(([key, opt]) => ({
                key,
                label: modeLabels[key],
                perTrip: opt.cost,
                monthly: opt.cost * tripsPerMonth,
                semester: opt.cost * tripsPerMonth * (semesterWeeks / 4)
            })).sort((a, b) => a.monthly - b.monthly);

            const recommended = modeCosts.find(m => m.key === latestPlan.recommended) || modeCosts[0];
            const usagePct = Math.min(100, Math.round((recommended.monthly / monthlyBudget) * 100));
            const remaining = monthlyBudget - recommended.monthly;
            const overBudget = remaining < 0;

            if (budgetBar) {
                budgetBar.style.width = `${usagePct}%`;
                budgetBar.style.background = overBudget
                    ? 'linear-gradient(90deg, #ff5252, #ff4081)'
                    : usagePct > 80
                        ? 'linear-gradient(90deg, #ffbd2e, #ff9800)'
                        : 'linear-gradient(90deg, var(--accent-mint), #00b894)';
            }

            if (budgetStatus) {
                budgetStatus.className = `budget-status ${overBudget ? 'danger' : usagePct > 80 ? 'warn' : 'good'}`;
                budgetStatus.innerHTML = overBudget
                    ? `<i class="fa-solid fa-triangle-exclamation"></i> Over budget by ${formatRs(Math.abs(remaining))}/month on ${recommended.label}`
                    : `<i class="fa-solid fa-circle-check"></i> ${formatRs(remaining)} left this month with ${recommended.label}`;
            }

            if (budgetModes) {
                budgetModes.replaceChildren();
                modeCosts.forEach(mode => {
                    const row = document.createElement('div');
                    row.className = `budget-mode-row${mode.key === recommended.key ? ' recommended' : ''}`;
                    const fits = mode.monthly <= monthlyBudget;
                    row.innerHTML = `
                        <div class="budget-mode-info">
                            <strong>${mode.label}</strong>
                            <span>${formatRs(mode.perTrip)}/trip · ${tripsPerMonth} round trips/mo</span>
                        </div>
                        <div class="budget-mode-stats">
                            <strong>${formatRs(mode.monthly)}</strong>
                            <small>Semester: ${formatRs(mode.semester)}</small>
                            <span class="budget-fit ${fits ? 'fits' : 'over'}">${fits ? 'Within budget' : 'Over budget'}</span>
                        </div>
                    `;
                    budgetModes.appendChild(row);
                });
            }

            const savings = modeCosts[modeCosts.length - 1].monthly - modeCosts[0].monthly;
            budgetOutput.textContent = `Route: ${latestPlan.originLabel} → ${latestPlan.campusLabel}. Switching to ${modeCosts[0].label} could save up to ${formatRs(savings)}/month.`;
        };

        [budgetInput, daysInput, weeksInput].forEach(el => {
            el?.addEventListener('input', renderBudget);
        });

        document.addEventListener('transit-calc-updated', e => {
            latestPlan = e.detail?.plan || null;
            renderBudget();
        });

        if (window.StudentSyncTransit?.getRoutePlan) {
            const origin = document.getElementById('origin-select');
            const dest = document.getElementById('dest-select');
            if (origin && dest) {
                latestPlan = window.StudentSyncTransit.getRoutePlan(origin.value, dest.value);
                renderBudget();
            }
        }
    }

    /* =========================================
       Feature 2: Peak Surge Departure Advisor
       ========================================= */
    if (surgePanel) {
        const surgeDay = document.getElementById('surge-day');
        const surgeChart = document.getElementById('surge-chart');
        const surgeBest = document.getElementById('surge-best-slot');
        const surgeNow = document.getElementById('surge-now-tip');
        const surgeSave = document.getElementById('surge-save-estimate');

        const dayProfiles = {
            monday: [1.0, 1.0, 1.05, 1.15, 1.35, 1.55, 1.48, 1.2, 1.05, 0.95, 0.9, 0.95, 1.1, 1.05, 0.95, 1.0, 1.15, 1.45, 1.35, 1.1, 0.95, 0.9, 0.85, 0.85],
            tuesday: [0.9, 0.85, 0.9, 1.0, 1.2, 1.4, 1.35, 1.15, 1.0, 0.95, 0.9, 0.95, 1.05, 1.0, 0.95, 1.05, 1.2, 1.4, 1.25, 1.05, 0.9, 0.85, 0.8, 0.8],
            wednesday: [0.95, 0.9, 0.95, 1.05, 1.25, 1.45, 1.42, 1.18, 1.02, 0.95, 0.92, 0.98, 1.08, 1.02, 0.98, 1.08, 1.22, 1.48, 1.3, 1.08, 0.92, 0.88, 0.85, 0.85],
            thursday: [0.9, 0.85, 0.9, 1.0, 1.18, 1.38, 1.32, 1.12, 0.98, 0.92, 0.88, 0.94, 1.02, 0.98, 0.92, 1.02, 1.18, 1.38, 1.22, 1.0, 0.88, 0.85, 0.82, 0.82],
            friday: [1.05, 1.0, 1.05, 1.15, 1.4, 1.6, 1.55, 1.28, 1.1, 1.0, 0.95, 1.05, 1.15, 1.1, 1.05, 1.15, 1.35, 1.55, 1.45, 1.2, 1.05, 1.0, 0.95, 0.95],
            saturday: [0.85, 0.8, 0.78, 0.8, 0.85, 0.95, 1.05, 1.1, 1.05, 0.98, 0.95, 0.98, 1.02, 1.0, 0.98, 1.05, 1.12, 1.2, 1.15, 1.05, 0.95, 0.9, 0.88, 0.85],
            sunday: [0.8, 0.78, 0.75, 0.78, 0.82, 0.9, 0.98, 1.05, 1.0, 0.92, 0.88, 0.9, 0.95, 0.92, 0.9, 0.95, 1.05, 1.12, 1.08, 0.98, 0.88, 0.85, 0.82, 0.8]
        };

        const formatHour = h => {
            const period = h >= 12 ? 'PM' : 'AM';
            const hour12 = h % 12 || 12;
            return `${hour12}:00 ${period}`;
        };

        const renderSurge = () => {
            const day = surgeDay?.value || 'monday';
            const profile = dayProfiles[day] || dayProfiles.monday;
            const morningWindow = profile.slice(6, 10);
            const minMorning = Math.min(...morningWindow);
            const bestHour = morningWindow.indexOf(minMorning) + 6;

            const baseCost = latestPlan?.options?.ride?.cost || 320;
            const peakCost = Math.round(baseCost * Math.max(...profile.slice(6, 9)));
            const bestCost = Math.round(baseCost * minMorning);
            const savings = peakCost - bestCost;

            if (surgeChart) {
                surgeChart.replaceChildren();
                profile.forEach((mult, hour) => {
                    const bar = document.createElement('div');
                    bar.className = 'surge-bar';
                    bar.title = `${formatHour(hour)} — ${Math.round(mult * 100)}% surge`;
                    const height = Math.round(mult * 70);
                    const isBest = hour === bestHour;
                    const isPeak = mult >= 1.45;
                    bar.innerHTML = `
                        <div class="surge-bar-fill ${isBest ? 'best' : isPeak ? 'peak' : ''}" style="height: ${height}%"></div>
                        <span>${hour % 12 || 12}${hour >= 12 ? 'p' : 'a'}</span>
                    `;
                    surgeChart.appendChild(bar);
                });
            }

            if (surgeBest) {
                surgeBest.innerHTML = `<i class="fa-solid fa-clock"></i> Best window: <strong>${formatHour(bestHour)} – ${formatHour(bestHour + 1)}</strong> · Est. ${formatRs(bestCost)} ride fare`;
            }

            const now = new Date();
            const currentMult = profile[now.getHours()];
            const currentCost = Math.round(baseCost * currentMult);
            if (surgeNow) {
                const advice = currentMult >= 1.4
                    ? 'Surge is high right now — wait 20–30 min or switch to bus/carpool.'
                    : currentMult <= 1.05
                        ? 'Good time to book a ride — fares are near normal.'
                        : 'Moderate surge — carpool or shuttle may be cheaper.';
                surgeNow.innerHTML = `<i class="fa-solid fa-bolt"></i> Right now (${formatHour(now.getHours())}): <strong>${Math.round(currentMult * 100)}%</strong> surge · ${formatRs(currentCost)} est. · ${advice}`;
            }

            if (surgeSave) {
                surgeSave.textContent = `Leave at ${formatHour(bestHour)} instead of peak to save ~${formatRs(savings)} per trip.`;
            }
        };

        surgeDay?.addEventListener('change', renderSurge);
        document.addEventListener('transit-calc-updated', e => {
            latestPlan = e.detail?.plan || latestPlan;
            renderSurge();
        });

        renderSurge();
    }
});
