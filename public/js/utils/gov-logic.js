/**
 * Módulo 5: Gobernanza Digital - Lógica de Negocio
 */

window.govData = {
    // 7 Ejes de Digitalización (Booleanos)
    axes: {
        openData: false,      // Portal de Datos Abiertos
        eProcurement: false,   // Licitaciones Digitales
        singleWindow: false,   // Ventanilla Única de Trámites
        digitalTax: false,     // Pago de Tasas Online
        citizenApp: false,     // App Ciudadana de Reportes
        transparencyLaw: false,// Adhesión a Ley de Transparencia
        blockchainAudit: false // Auditoría en Blockchain
    },
    score: 0,
    reputation: 'NEUTRAL'
};

/**
 * Calcula el Score de Gobernanza basado en los 7 ejes
 */
function calculateGovScore() {
    const activeAxes = Object.values(window.govData.axes).filter(v => v).length;
    const score = Math.round((activeAxes / 7) * 100);
    window.govData.score = score;

    // Actualizar Reputación basada en Transparencia
    if (score >= 80) {
        window.govData.reputation = 'INSTITUCION_ABIERTA';
    } else if (score >= 40) {
        window.govData.reputation = 'EN_PROCESO';
    } else {
        window.govData.reputation = 'BUROCRACIA_ALTA';
    }

    updateUI();
    updateSBTReputation();
    syncTransparencyMetrics();
}

/**
 * Actualiza los elementos de la interfaz
 */
function updateUI() {
    const scoreVal = document.getElementById('govScoreVal');
    const gauge = document.getElementById('govGauge');
    const statusEl = document.getElementById('govStatus');
    const reportEl = document.getElementById('govReport');

    if (scoreVal) scoreVal.innerText = `${window.govData.score}%`;

    // Simulación de rotación de aguja o progreso
    if (gauge) {
        gauge.style.strokeDashoffset = 440 - (440 * window.govData.score) / 100;
    }

    if (statusEl) {
        let msg = '';
        let color = '';
        switch (window.govData.reputation) {
            case 'INSTITUCION_ABIERTA':
                msg = '🛡️ Institución Abierta (Bajo Riesgo)';
                color = '#10b981';
                break;
            case 'EN_PROCESO':
                msg = '⚡ Digitalización en Marcha';
                color = '#f59e0b';
                break;
            default:
                msg = '⚠️ Burocracia Analógica (Riesgo Alto)';
                color = '#ef4444';
        }
        statusEl.innerText = msg;
        statusEl.style.color = color;
    }

    if (reportEl) {
        const impact = (100 - window.govData.score) * 0.5; // Simulación de impacto en retrasos
        reportEl.innerText = `Impacto Estimado en Retrasos de Pagos: +${impact.toFixed(1)} días`;
    }
}

/**
 * Sincroniza el nivel de gobernanza con la capa global de reputación SBT.
 * El sistema multi-módulo (OSM + Gobernanza) alimenta el mismo token de reputación.
 */
function updateSBTReputation() {
    if (!window.sbtReputation) window.sbtReputation = {};

    window.sbtReputation.govScore = window.govData.score;
    window.sbtReputation.govStatus = window.govData.reputation;

    // Determina el tier final combinado (si OSM y Gobernanza están ambos verificados)
    const infraVerified = window.infraData && window.infraData.osmVerified &&
        window.infraData.reputation === 'VERIFIED_REALITY';
    const govOpen = window.govData.reputation === 'INSTITUCION_ABIERTA';

    window.sbtReputation.tier = (infraVerified && govOpen) ? 'GOLD' :
        (govOpen || infraVerified) ? 'SILVER' : 'BRONZE';

    console.log('[SBT] Reputación actualizada:', window.sbtReputation);
}

/**
 * Serializa los datos de gobernanza al objeto global de métricas del Dashboard.
 * Permite al Módulo 0 (Tablero) consumir los datos sin acoplamiento directo.
 */
function syncTransparencyMetrics() {
    if (!window.cityRiskMetrics) window.cityRiskMetrics = {};

    const paymentDelayDays = ((100 - window.govData.score) * 0.5).toFixed(1);

    window.cityRiskMetrics.governance = {
        score: window.govData.score,
        reputation: window.govData.reputation,
        paymentDelayImpact: parseFloat(paymentDelayDays),
        activeAxes: Object.values(window.govData.axes).filter(v => v).length,
        totalAxes: 7,
        timestamp: new Date().toISOString()
    };

    console.log('[METRICS] Transparencia sincronizada:', window.cityRiskMetrics.governance);
}

/**
 * Escucha cambios en los toggles
 */
function initToggles() {
    Object.keys(window.govData.axes).forEach(axis => {
        const toggle = document.getElementById(`${axis}Toggle`);
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                window.govData.axes[axis] = e.target.checked;
                calculateGovScore();
            });
        }
    });
}

// ─────────────────────────────────────────────────────────────────
// SUBTAREA 2: Payment Delay Validation System
// ─────────────────────────────────────────────────────────────────

window.paymentReports = [];

/**
 * Registra un reporte de retraso de pago con conversión de divisa y hash de integridad.
 */
async function submitPaymentDelay({ proveedor, montoARS, diasRetraso, descripcion }) {
    const usdRate = (window.exchangeRates && window.exchangeRates.USD) ? window.exchangeRates.USD : null;
    const montoUSD = usdRate ? (montoARS * usdRate).toFixed(2) : null;

    const payload = `${proveedor}|${montoARS}|${diasRetraso}|${new Date().toISOString()}`;
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
    const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);

    const report = {
        id: hash,
        proveedor,
        montoARS: parseFloat(montoARS),
        montoUSD: montoUSD ? parseFloat(montoUSD) : null,
        diasRetraso: parseInt(diasRetraso),
        descripcion,
        estado: 'PENDIENTE',
        rebuttal: null,
        weight: 1.0,
        timestamp: new Date().toLocaleString('es-AR')
    };

    window.paymentReports.push(report);
    calculatePRS();
    renderReportList();
}

/**
 * Calcula el Payment Reliability Score (PRS) — 0 a 100.
 * Mayor cantidad y más días de retraso → PRS más bajo.
 */
function calculatePRS() {
    if (!window.paymentReports.length) {
        window.govData.prs = 100;
    } else {
        const avgDays = window.paymentReports.reduce((acc, r) => acc + r.diasRetraso * r.weight, 0) /
            window.paymentReports.reduce((acc, r) => acc + r.weight, 0);
        const reportPenalty = Math.min(window.paymentReports.length * 5, 40);
        const daysPenalty = Math.min(avgDays * 0.8, 60);
        window.govData.prs = Math.max(0, Math.round(100 - reportPenalty - daysPenalty));
    }

    // Impacto en SBT tier si el PRS es crítico
    updateSBTReputation();

    // Escribir en métricas globales
    if (!window.cityRiskMetrics) window.cityRiskMetrics = {};
    window.cityRiskMetrics.paymentReliability = {
        prs: window.govData.prs,
        reports: window.paymentReports.length,
        timestamp: new Date().toISOString()
    };

    renderPRSBadge();
}

/**
 * Registra la respuesta oficial del municipio a un reporte.
 * Reduce el peso del reporte en el PRS a 50%.
 */
function municipalRebuttal(reportId, respuesta) {
    const report = window.paymentReports.find(r => r.id === reportId);
    if (report) {
        report.rebuttal = respuesta;
        report.estado = 'RESPONDIDO';
        report.weight = 0.5;
        calculatePRS();
        renderReportList();
    }
}

/**
 * Renderiza el badge del PRS en la UI.
 */
function renderPRSBadge() {
    const badge = document.getElementById('prsBadge');
    const prsVal = document.getElementById('prsVal');
    if (!badge || !prsVal) return;

    const prs = window.govData.prs;
    prsVal.innerText = `${prs}`;

    if (prs >= 70) {
        badge.style.background = '#ecfdf5';
        badge.style.color = '#059669';
        badge.style.borderColor = '#10b981';
        document.getElementById('prsLabel').innerText = '🟢 Pagador Confiable';
    } else if (prs >= 40) {
        badge.style.background = '#fffbeb';
        badge.style.color = '#d97706';
        badge.style.borderColor = '#fbbf24';
        document.getElementById('prsLabel').innerText = '🟡 Retrasos Moderados';
    } else {
        badge.style.background = '#fef2f2';
        badge.style.color = '#dc2626';
        badge.style.borderColor = '#f87171';
        document.getElementById('prsLabel').innerText = '🔴 Riesgo Crítico de Incumplimiento';
    }
}

/**
 * Renderiza la lista de reportes enviados con opción de réplica.
 */
function renderReportList() {
    const container = document.getElementById('reportList');
    if (!container) return;

    container.innerHTML = window.paymentReports.length === 0
        ? '<p style="color:#94a3b8; font-size:0.8rem;">Sin reportes registrados.</p>'
        : window.paymentReports.map(r => {
            const usdTxt = r.montoUSD ? ` ≈ <strong>U$D ${parseFloat(r.montoUSD).toLocaleString('en-US')}</strong>` : '';
            const estadoColor = r.estado === 'RESPONDIDO' ? '#10b981' : '#f59e0b';
            return `
            <div style="background:#fff; border-radius:10px; padding:12px; border:1px solid #e2e8f0; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <strong style="font-size:0.85rem;">${r.proveedor}</strong>
                    <span style="font-size:0.7rem; background:${estadoColor}20; color:${estadoColor}; padding:2px 8px; border-radius:10px; font-weight:600;">${r.estado}</span>
                </div>
                <div style="font-size:0.78rem; color:#475569;">
                    ARS ${r.montoARS.toLocaleString('es-AR')}${usdTxt} · ${r.diasRetraso} días de retraso
                </div>
                <div style="font-size:0.75rem; color:#94a3b8; margin-top:3px;">${r.descripcion}</div>
                ${r.rebuttal ? `<div style="font-size:0.75rem; color:#0284c7; margin-top:5px;">🏛️ Respuesta municipal: ${r.rebuttal}</div>` : `
                <div style="margin-top:8px; display:flex; gap:6px;">
                    <input id="rb_${r.id}" placeholder="Respuesta municipal..." style="flex:1; padding:4px 8px; border-radius:6px; border:1px solid #e2e8f0; font-size:0.75rem; font-family:inherit;">
                    <button onclick="municipalRebuttal('${r.id}', document.getElementById('rb_${r.id}').value)" style="background:#0284c7; color:white; border:none; border-radius:6px; padding:4px 10px; font-size:0.75rem; cursor:pointer;">Responder</button>
                </div>`}
            </div>`;
        }).join('');
}

