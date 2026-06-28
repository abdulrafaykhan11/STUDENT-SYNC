document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const departurePanel = document.getElementById('departure-clock');
    const safetyPanel = document.getElementById('safety-checker');
    if (!departurePanel && !safetyPanel) return;

    const areaTravelBase = {
        gulshan: 28,
        nazimabad: 34,
        malir: 32,
        defence: 38,
        johar: 30,
        north_nazimabad: 34,
        pechs: 30,
        clifton: 38
    };

    const areaSafetyBase = {
        gulshan: 78,
        nazimabad: 72,
        malir: 65,
        defence: 88,
        johar: 74,
        north_nazimabad: 72,
        pechs: 76,
        clifton: 85
    };

    const getOrigin = () => document.getElementById('route-origin')?.value || 'gulshan';
    const getDestName = () => {
        const sel = document.getElementById('route-dest');
        return sel?.options[sel.selectedIndex]?.text || 'Campus';
    };

    /* =========================================
       Feature 1: Class Rush Departure Clock
       ========================================= */
    if (departurePanel) {
        const classTime = document.getElementById('departure-class-time');
        const bufferSelect = document.getElementById('departure-buffer');
        const departureResult = document.getElementById('departure-result');
        const departureCountdown = document.getElementById('departure-countdown');
        const departureTimeline = document.getElementById('departure-timeline');
        let countdownTimer = null;

        const parseClassTime = () => {
            const val = classTime?.value || '08:30';
            const [h, m] = val.split(':').map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            if (d < new Date()) d.setDate(d.getDate() + 1);
            return d;
        };

        const getTravelMinutes = () => {
            const origin = getOrigin();
            const base = areaTravelBase[origin] || 30;
            const hour = new Date().getHours();
            const congestion = hour >= 7 && hour <= 9 ? 12 : hour >= 16 && hour <= 19 ? 10 : 4;
            const scanned = document.getElementById('result-time')?.textContent?.replace('m', '');
            const scannedMin = parseInt(scanned, 10);
            return Number.isFinite(scannedMin) && document.getElementById('route-results-state')?.style.display === 'block'
                ? scannedMin
                : base + congestion;
        };

        const renderDeparture = () => {
            const classAt = parseClassTime();
            const buffer = parseInt(bufferSelect?.value, 10) || 10;
            const travelMin = getTravelMinutes();
            const leaveAt = new Date(classAt.getTime() - (travelMin + buffer) * 60000);
            const now = new Date();
            const diffMs = leaveAt - now;
            const originLabel = document.getElementById('route-origin')?.options[document.getElementById('route-origin').selectedIndex]?.text || 'Your area';
            const destLabel = getDestName();

            if (departureResult) {
                const leaveStr = leaveAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                const classStr = classAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                departureResult.innerHTML = `
                    <div class="departure-hero">
                        <span class="departure-label">Leave by</span>
                        <strong class="departure-time">${leaveStr}</strong>
                        <span class="departure-sub">To reach <em>${destLabel}</em> by ${classStr}</span>
                    </div>
                `;
            }

            if (departureTimeline) {
                departureTimeline.innerHTML = `
                    <div class="departure-step"><i class="fa-solid fa-house"></i><div><strong>${originLabel}</strong><small>Depart ${leaveAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</small></div></div>
                    <div class="departure-step"><i class="fa-solid fa-road"></i><div><strong>${travelMin} min commute</strong><small>Includes current traffic estimate</small></div></div>
                    <div class="departure-step"><i class="fa-solid fa-mug-hot"></i><div><strong>${buffer} min buffer</strong><small>Find parking, reach class calmly</small></div></div>
                    <div class="departure-step"><i class="fa-solid fa-building-columns"></i><div><strong>${destLabel}</strong><small>Arrive by ${classAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</small></div></div>
                `;
            }

            if (departureCountdown) {
                if (diffMs <= 0) {
                    departureCountdown.className = 'departure-countdown late';
                    departureCountdown.innerHTML = `<i class="fa-solid fa-person-running"></i> You should have left already — leave now or you'll be ~${Math.ceil(Math.abs(diffMs) / 60000)} min late!`;
                } else if (diffMs <= 15 * 60000) {
                    departureCountdown.className = 'departure-countdown urgent';
                    departureCountdown.innerHTML = `<i class="fa-solid fa-bell"></i> Leave in ${Math.ceil(diffMs / 60000)} minutes — grab your bag!`;
                } else {
                    const hrs = Math.floor(diffMs / 3600000);
                    const mins = Math.floor((diffMs % 3600000) / 60000);
                    departureCountdown.className = 'departure-countdown calm';
                    departureCountdown.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ${hrs > 0 ? `${hrs}h ` : ''}${mins}m until you need to leave`;
                }
            }
        };

        classTime?.addEventListener('change', renderDeparture);
        bufferSelect?.addEventListener('change', renderDeparture);
        document.getElementById('route-origin')?.addEventListener('change', renderDeparture);
        document.getElementById('route-dest')?.addEventListener('change', renderDeparture);

        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = setInterval(renderDeparture, 30000);
        renderDeparture();

        const scanBtn = document.getElementById('scan-route-btn');
        scanBtn?.addEventListener('click', () => {
            setTimeout(renderDeparture, 3000);
        });
    }

    /* =========================================
       Feature 2: Night Safety Route Checker
       ========================================= */
    if (safetyPanel) {
        const nightToggle = document.getElementById('safety-night-mode');
        const safetyScore = document.getElementById('safety-score');
        const safetyRing = document.getElementById('safety-ring-fill');
        const safetyMetrics = document.getElementById('safety-metrics');
        const safetyTips = document.getElementById('safety-tips');
        const safetyAlt = document.getElementById('safety-alt-route');

        const nightRoutes = {
            gulshan: { alt: 'Via University Road service lane + main gate crowd zone', lit: 82, crowd: 74, cctv: 68 },
            nazimabad: { alt: 'Via Nazimabad No. 2 main road + Hyderi market corridor', lit: 76, crowd: 70, cctv: 62 },
            malir: { alt: 'Via Malir Cantt main road + avoid unlit side streets', lit: 58, crowd: 55, cctv: 48 },
            defence: { alt: 'Via Khayaban-e-Ittehad + DHA Phase 5 lit boulevard', lit: 92, crowd: 80, cctv: 85 },
            johar: { alt: 'Via Rashid Minhas main artery + university shuttle point', lit: 72, crowd: 68, cctv: 60 }
        };

        const renderSafety = () => {
            const origin = getOrigin();
            const isNight = nightToggle?.checked ?? false;
            const base = areaSafetyBase[origin] || 72;
            const nightData = nightRoutes[origin] || nightRoutes.gulshan;
            const dest = getDestName();

            const lit = isNight ? nightData.lit : Math.min(95, base + 8);
            const crowd = isNight ? nightData.crowd : Math.min(95, base + 5);
            const cctv = isNight ? nightData.cctv : Math.min(95, base);
            const score = Math.round((lit * 0.4) + (crowd * 0.35) + (cctv * 0.25));
            const grade = score >= 80 ? 'Safe' : score >= 65 ? 'Moderate' : 'Use Caution';
            const gradeColor = score >= 80 ? '#00d1b2' : score >= 65 ? '#ffbd2e' : '#ff5252';

            if (safetyScore) {
                safetyScore.innerHTML = `<span style="color:${gradeColor}">${score}</span><small>/100 · ${grade}</small>`;
            }

            if (safetyRing) {
                const circumference = 283;
                safetyRing.style.strokeDashoffset = String(circumference - (circumference * score / 100));
                safetyRing.style.stroke = gradeColor;
            }

            if (safetyMetrics) {
                safetyMetrics.innerHTML = `
                    <div class="safety-metric"><span>Well-lit streets</span><strong style="color:${lit >= 75 ? '#00d1b2' : '#ffbd2e'}">${lit}%</strong><div class="safety-mini-bar"><div style="width:${lit}%;background:${lit >= 75 ? '#00d1b2' : '#ffbd2e'}"></div></div></div>
                    <div class="safety-metric"><span>Crowd density</span><strong style="color:${crowd >= 70 ? '#00d1b2' : '#ffbd2e'}">${crowd}%</strong><div class="safety-mini-bar"><div style="width:${crowd}%;background:${crowd >= 70 ? '#00d1b2' : '#ffbd2e'}"></div></div></div>
                    <div class="safety-metric"><span>CCTV coverage</span><strong style="color:${cctv >= 65 ? '#00d1b2' : '#ff5252'}">${cctv}%</strong><div class="safety-mini-bar"><div style="width:${cctv}%;background:${cctv >= 65 ? '#00d1b2' : '#ff5252'}"></div></div></div>
                `;
            }

            if (safetyAlt) {
                safetyAlt.innerHTML = isNight && score < 80
                    ? `<i class="fa-solid fa-shield-halved"></i> <strong>Safer alternate:</strong> ${nightData.alt}`
                    : `<i class="fa-solid fa-check"></i> Route to <strong>${dest}</strong> looks ${grade.toLowerCase()} for ${isNight ? 'night' : 'daytime'} travel.`;
            }

            if (safetyTips) {
                const tips = isNight
                    ? [
                        'Share live location with a friend before leaving campus.',
                        'Prefer main roads with shops open — avoid empty service lanes.',
                        'Use verified carpools from StudentSync instead of unknown rides.',
                        score < 65 ? 'Consider waiting for campus shuttle if available after 8 PM.' : 'Stick to well-lit pickup points near the main gate.'
                    ]
                    : [
                        'Day routes are generally safer — still avoid flooded underpasses.',
                        'Check Route Scanner for protest or construction alerts before leaving.',
                        'Save your usual route for one-tap hazard alerts.',
                        'Morning routes: leave 10 min early to beat school rush hour.'
                    ];
                safetyTips.replaceChildren();
                tips.forEach(tip => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${tip}`;
                    safetyTips.appendChild(li);
                });
            }
        };

        nightToggle?.addEventListener('change', renderSafety);
        document.getElementById('route-origin')?.addEventListener('change', renderSafety);
        document.getElementById('route-dest')?.addEventListener('change', renderSafety);
        renderSafety();
    }
});
