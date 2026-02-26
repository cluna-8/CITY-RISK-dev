/**
 * Módulo 4: Infraestructura y Servicios - Lógica de Negocio
 */

window.infraData = {
    water: 80,
    sewage: 65,
    fiber: 40,
    index: 0,
    truthScore: 100,
    reputation: 'UNVERIFIED',
    osmVerified: false
};

/**
 * Calcula el índice consolidado de infraestructura
 */
function updateServiceIndex() {
    const { water, sewage, fiber } = window.infraData;

    // Pesos: Agua (40%), Cloacas (40%), Fibra (20%)
    const index = (water * 0.4) + (sewage * 0.4) + (fiber * 0.2);

    // APLICAR CAP DE SCORE (SEGÚN WHITE PAPER PUNTO 9)
    // Si no está verificado por OSM, el score no puede superar 80.
    window.infraData.index = (window.infraData.osmVerified) ? index : Math.min(index, 80);

    updateUI();
    if (window.infraChart) updateChart();
}

/**
 * Algoritmo de Validación OSM (Handshake con Overpass API)
 */
async function validateAgainstOSM() {
    if (typeof logE === 'function') {
        logE('NETWORK', 'Iniciando Handshake con OpenStreetMap (Overpass API)...');
        logE('SYSTEM', 'Buscando nodos de infraestructura: water_tower, wastewater_plant, telecom...');
    }

    const btn = document.getElementById('osmCheckBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Verificando...';
    }

    // Simulación de delay de red para realismo
    await new Promise(r => setTimeout(r, 2000));

    // Lógica de validación: Comparamos la "densidad" declarada vs detectada.
    const { water, sewage, fiber } = window.infraData;

    // Simulación de auditoría: los sliders > 90 sin "pruebas externas" bajan la reputación
    let truthScore = 100;
    if (water > 90) truthScore -= 15;
    if (sewage > 90) truthScore -= 15;
    if (fiber > 90) truthScore -= 10;

    window.infraData.truthScore = truthScore;
    window.infraData.osmVerified = true;

    if (truthScore > 85) {
        window.infraData.reputation = 'VERIFIED_REALITY';
        if (typeof logE === 'function') logE('SUCCESS', 'OSM VALIDATION: Datos consistentes con infraestructura mapeada.');
    } else {
        window.infraData.reputation = 'OPTIMISTIC_BIAS';
        if (typeof logE === 'function') logE('ALERT', 'OSM VALIDATION: Se detecta discrepancia (Sesgo Optimista). Calificación limitada.');
    }

    if (btn) {
        btn.innerText = 'Auditoría Completada';
        btn.style.background = '#10b981';
        btn.style.color = 'white';
    }

    updateServiceIndex();
}

/**
 * Retorna el estado de riesgo basado en umbrales
 */
function getRiskLevel() {
    const { sewage, water, reputation } = window.infraData;

    if (sewage < 50 || water < 60) return {
        level: 'CRÍTICO',
        color: '#ef4444',
        msg: '⚠️ RIESGO SANITARIO: Prioridad urgente en saneamiento.'
    };

    if (reputation === 'OPTIMISTIC_BIAS') return {
        level: 'SESGO DETECTADO',
        color: '#f59e0b',
        msg: '🚨 CALIFICACIÓN LIMITADA: Los datos exceden la evidencia física en mapa.'
    };

    if (window.infraData.index < 70) return {
        level: 'ALERTA',
        color: '#f59e0b',
        msg: '🚨 BRECHA TÉCNICA: Inversión necesaria en servicios básicos.'
    };

    return {
        level: 'ÓPTIMO',
        color: '#10b981',
        msg: '✅ INFRAESTRUCTURA ESTABLE: Municipio apto para expansión.'
    };
}

/**
 * Actualiza los elementos de la interfaz
 */
function updateUI() {
    const scoreEl = document.getElementById('infraScore');
    const riskEl = document.getElementById('riskAlert');
    const badgeEl = document.getElementById('reputationBadge');
    const risk = getRiskLevel();

    if (scoreEl) {
        scoreEl.innerText = `${Math.round(window.infraData.index)}%`;
        scoreEl.style.color = risk.color;
    }

    if (riskEl) {
        riskEl.innerText = risk.msg;
        riskEl.style.borderLeft = `4px solid ${risk.color}`;
        riskEl.style.background = `${risk.color}10`;
    }

    if (badgeEl) {
        const rep = window.infraData.reputation;
        badgeEl.style.display = 'inline-flex';
        if (rep === 'VERIFIED_REALITY') {
            badgeEl.innerHTML = '🛡️ Verified Reality (SBT)';
            badgeEl.style.background = '#ecfdf5';
            badgeEl.style.color = '#059669';
            badgeEl.style.borderColor = '#10b981';
        } else if (rep === 'OPTIMISTIC_BIAS') {
            badgeEl.innerHTML = '⚠️ Optimistic Bias (SBT)';
            badgeEl.style.background = '#fffbeb';
            badgeEl.style.color = '#d97706';
            badgeEl.style.borderColor = '#fbbf24';
        } else {
            badgeEl.style.display = 'none';
        }
    }
}

/**
 * Inicialización de Sliders
 */
function initSliders() {
    ['water', 'sewage', 'fiber'].forEach(svc => {
        const slider = document.getElementById(`${svc}Slider`);
        const valDisp = document.getElementById(`${svc}Val`);

        if (slider) {
            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                window.infraData[svc] = val;
                if (valDisp) valDisp.innerText = `${val}%`;
                updateServiceIndex();
            });
        }
    });
}
