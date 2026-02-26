/**
 * Logic for Module 3: Solvencia Económica
 * Handles budget calculations and persistence.
 */

function calculateFinancialMetrics() {
    const revenue = parseFloat(document.getElementById('revenueInput').value) || 0;
    const currentExpenses = parseFloat(document.getElementById('expensesInput').value) || 0;
    const capitalInvestment = parseFloat(document.getElementById('investmentInput').value) || 0;
    const publicDebt = parseFloat(document.getElementById('debtInput').value) || 0;

    // Primary Balance = Revenue - Current Expenses
    const primaryBalance = revenue - currentExpenses;
    const totalExpenses = currentExpenses + capitalInvestment + publicDebt;
    const netFiscalResult = revenue - totalExpenses;

    // Investment Capacity %
    let investmentCapacity = 0;
    if (revenue > 0) {
        investmentCapacity = ((revenue - currentExpenses - publicDebt) / revenue) * 100;
    }

    // Update UI Metrics
    document.getElementById('primaryBalanceVal').innerText = primaryBalance.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    document.getElementById('primaryBalanceVal').className = primaryBalance >= 0 ? 'metric-val positive' : 'metric-val negative';

    document.getElementById('capacityVal').innerText = investmentCapacity.toFixed(1) + '%';

    // Validator & Deficit Alert
    const hasDeficit = netFiscalResult < 0;
    if (hasDeficit) {
        triggerDeficitAlert(netFiscalResult);
    } else {
        clearDeficitAlert();
    }

    // Score Calculation
    const score = calculateRiskScore(revenue, primaryBalance, investmentCapacity, hasDeficit);
    document.getElementById('currentScoreTier').innerText = score;

    // Log to terminal
    if (typeof logE === 'function') {
        if (hasDeficit) logE('CRITICAL', `Déficit fiscal detectado: ${netFiscalResult.toLocaleString()}`);
        logE('FINANCIAL-ENGINE', `Score recalculado: Tier ${score}`);
    }

    // Persist data
    const financialData = {
        revenue, currentExpenses, capitalInvestment, publicDebt,
        primaryBalance, netFiscalResult, investmentCapacity,
        score, hasDeficit,
        year: document.getElementById('budgetYear').value,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('cityRisk_financials', JSON.stringify(financialData));

    // Update International Values if active
    if (window.isInternationalView) {
        updateInternationalValues();
    }
}

// Currency Conversion Logic
window.exchangeRates = null;
window.exchangeRatesDate = null;
window.isInternationalView = false;

/**
 * MIDDLEWARE: Core conversion function.
 */
function convertCurrency(amountLocal, fromCur, toCur) {
    if (!window.exchangeRates) return 0;
    if (toCur === 'USD') return amountLocal * window.exchangeRates.USD;
    if (toCur === 'EUR') return amountLocal * window.exchangeRates.EUR;
    return amountLocal;
}

async function fetchExchangeRates() {
    const cacheKey = 'cityRisk_rates_cache';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        const data = JSON.parse(cached);
        const age = (Date.now() - new Date(data.timestamp).getTime()) / (1000 * 60 * 60);
        if (age < 24) {
            window.exchangeRates = data.rates;
            window.exchangeRatesDate = data.date; // Load stored date
            if (typeof logE === 'function') logE('SYSTEM', 'Tasas de cambio cargadas desde caché.');
            return;
        }
    }

    try {
        if (typeof logE === 'function') logE('NETWORK', 'Consultando API de divisas (ExchangeRate-API)...');
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const val = await response.json();

        if (val.result === 'success') {
            const usdToArs = val.rates.ARS;
            const usdToEur = val.rates.EUR;

            window.exchangeRates = {
                USD: 1 / usdToArs,
                EUR: usdToEur / usdToArs,
                rawUsd: usdToArs,
                rawEur: (1 / usdToEur) * usdToArs
            };
            window.exchangeRatesDate = new Date().toLocaleDateString('es-AR');

            localStorage.setItem(cacheKey, JSON.stringify({
                rates: window.exchangeRates,
                date: window.exchangeRatesDate,
                timestamp: new Date().toISOString()
            }));

            if (typeof logE === 'function') logE('SUCCESS', 'Tasas de cambio actualizadas.');
        }
    } catch (err) {
        if (typeof logE === 'function') logE('ERROR', 'No se pudo conectar con el servicio de divisas.');
        console.error(err);
    }
}

function toggleInternationalView() {
    window.isInternationalView = !window.isInternationalView;
    const btn = document.getElementById('currencyToggleBtn');

    if (window.isInternationalView) {
        btn.innerText = 'Ver en ARS';
        btn.classList.add('active-toggle');
        if (!window.exchangeRates) {
            fetchExchangeRates().then(updateInternationalValues);
        } else {
            updateInternationalValues();
        }
    } else {
        btn.innerText = 'Ver en USD/EUR';
        btn.classList.remove('active-toggle');
        // Re-run standard calculation to restore ARS formatting
        calculateFinancialMetrics();
    }
}

function updateInternationalValues() {
    if (!window.exchangeRates) return;

    // INPUT: Capturamos el valor ARS
    const revenue = parseFloat(document.getElementById('revenueInput').value) || 0;
    const currentExpenses = parseFloat(document.getElementById('expensesInput').value) || 0;
    const primaryBalanceARS = revenue - currentExpenses;

    // MIDDLEWARE: Procesamos la conversión
    const pbUsdVal = convertCurrency(primaryBalanceARS, 'ARS', 'USD') || 0;
    const pbEurVal = convertCurrency(primaryBalanceARS, 'ARS', 'EUR') || 0;

    // OUTPUT: Formateamos para el Dashboard
    const montoOriginal = primaryBalanceARS.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    const montoUsd = pbUsdVal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const montoEur = pbEurVal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

    // Cotizaciones para el tooltip (Safe fallback if raw values missing from old cache)
    const rawUsd = window.exchangeRates.rawUsd || (1 / (window.exchangeRates.USD || 1));
    const rawEur = window.exchangeRates.rawEur || (1 / (window.exchangeRates.EUR || 1));

    document.getElementById('primaryBalanceVal').innerHTML = `
        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 5px;">Monto Original: ${montoOriginal}</div>
        <div style="font-size: 1.1rem; font-weight: 700;">Monto Inversor: ${montoUsd} / ${montoEur}</div>
        <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 5px; display: flex; align-items: center; justify-content: center;">
            (Tasa de cambio: ${window.exchangeRatesDate || 'Reciente'})
            <span class="info-icon">ⓘ
                <div class="exchange-tooltip">
                    <strong>Cotización:</strong><br>
                    1 USD = ${rawUsd.toLocaleString('es-AR')} ARS<br>
                    1 EUR = ${rawEur.toLocaleString('es-AR')} ARS
                </div>
            </span>
        </div>
    `;

    if (typeof logE === 'function') logE('UI', 'Dashboard actualizado con vista dual.');
}

function calculateRiskScore(revenue, primaryBalance, investmentCapacity, hasDeficit) {
    if (revenue === 0) return 'N/A';
    if (hasDeficit) return 'C-'; // Hard penalty for deficit

    const surplusRatio = (primaryBalance / revenue) * 100;

    if (surplusRatio > 20 && investmentCapacity > 15) return 'A+';
    if (surplusRatio > 10) return 'A';
    if (surplusRatio > 0) return 'B';
    return 'C';
}

function triggerDeficitAlert(amount) {
    const alertBox = document.getElementById('deficitAlert');
    if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.querySelector('.alert-amount').innerText = Math.abs(amount).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    }
}

function clearDeficitAlert() {
    const alertBox = document.getElementById('deficitAlert');
    if (alertBox) alertBox.style.display = 'none';
}

async function runRemoteValidation() {
    if (typeof logE !== 'function') return;

    // DATA INPUT (International Context)
    const revenueARS = parseFloat(document.getElementById('revenueInput').value) || 0;
    const currentExpensesARS = parseFloat(document.getElementById('expensesInput').value) || 0;
    const debtARS = parseFloat(document.getElementById('debtInput').value) || 0;

    // Evaluation MUST be in USD to avoid volatility
    const revenueUSD = convertCurrency(revenueARS, 'ARS', 'USD');
    const expensesUSD = convertCurrency(currentExpensesARS, 'ARS', 'USD');
    const debtUSD = convertCurrency(debtARS, 'ARS', 'USD');
    const investmentCapacity = parseFloat(document.getElementById('capacityVal').innerText) || 0;

    if (revenueARS === 0) {
        logE('VALIDATOR', 'Error: No hay ingresos declarados para validar.');
        return;
    }

    logE('NETWORK', 'Iniciando conexión segura con nodo validador remoto...');
    await new Promise(r => setTimeout(r, 1200));

    logE('NETWORK', 'Sincronizando registros fiscales (Evaluación en USD)...');
    await new Promise(r => setTimeout(r, 1000));

    logE('SYSTEM', 'Validando estándares internacionales de solvencia...');
    await new Promise(r => setTimeout(r, 1500));

    const primaryBalanceUSD = revenueUSD - expensesUSD;
    const debtRatio = (debtUSD / revenueUSD) * 100;

    const isPrimaryPositive = primaryBalanceUSD > 0;
    const isCapacityOk = investmentCapacity > 10;
    const isDebtOk = debtRatio < 30;

    const isValid = isPrimaryPositive && isCapacityOk && isDebtOk;

    // Blockchain Anchoring (Simulated Hash)
    const timestamp = new Date().toISOString();
    const payload = `CITY-RISK|${revenueUSD}|${primaryBalanceUSD}|${isValid}|${timestamp}`;
    const hash = await generateSimulatedHash(payload);

    if (isValid) {
        window.alphaCoefficient = 1.0; // Max Solvency
        updateAlphaUI();
        logE('SUCCESS', `VERIFICACIÓN EXITOSA. Alpha (α) seteado en ${window.alphaCoefficient.toFixed(1)}`);
        logE('BLOCKCHAIN', `Certificación anclada: ${hash.substring(0, 16)}...`);
        showValidationResult(true, hash);
    } else {
        window.alphaCoefficient = 0.4; // High Risk
        updateAlphaUI();
        logE('ALERT', `VERIFICACIÓN RECHAZADA. Alpha (α) reducido a ${window.alphaCoefficient.toFixed(1)}`);
        logE('BLOCKCHAIN', `Memo de rechazo anclado: ${hash.substring(0, 16)}...`);
        showValidationResult(false, hash);
    }
}

function updateAlphaUI() {
    const alphaEl = document.getElementById('alphaCoefficientVal');
    if (alphaEl) {
        alphaEl.innerText = window.alphaCoefficient.toFixed(1);
        alphaEl.style.color = window.alphaCoefficient > 0.7 ? '#10b981' : '#ef4444';
    }
}
async function generateSimulatedHash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function showValidationResult(success, hash) {
    const seal = document.getElementById('solvencySeal');
    if (!seal) return;

    seal.style.display = 'flex';
    const shortHash = hash ? hash.substring(0, 24) : 'PENDING';

    if (success) {
        seal.innerHTML = `
            <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 20px; width: 100%; text-align: center; color: #065f46; animation: scaleUp 0.5s ease-out;">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">🛡️</div>
                <strong style="display: block; font-size: 1rem; margin-bottom: 5px;">CERTIFICADO DE SOLVENCIA</strong>
                <span style="font-size: 0.6rem; opacity: 0.8; font-family: monospace; word-break: break-all;">HASH: ${shortHash}...</span>
                <div style="margin-top: 15px; font-size: 0.6rem; border-top: 1px solid #10b981; padding-top: 10px; display: flex; justify-content: space-between;">
                    <span>Protocol v1.4 (USD)</span>
                    <span>α: 1.0</span>
                </div>
            </div>
        `;
    } else {
        seal.innerHTML = `
            <div style="background: #fff1f2; border: 2px solid #ef4444; border-radius: 12px; padding: 20px; width: 100%; text-align: center; color: #991b1b; animation: shake 0.5s;">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">❌</div>
                <strong style="display: block; font-size: 1rem; margin-bottom: 5px;">CERTIFICACIÓN DENEGADA</strong>
                <span style="font-size: 0.6rem; opacity: 0.8; font-family: monospace; word-break: break-all;">HASH: ${shortHash}...</span>
                <div style="margin-top: 10px; font-size: 0.75rem;">α: 0.4 (Riesgo Crítico)</div>
            </div>
        `;
    }
}

function loadSavedFinancials() {
    const saved = localStorage.getItem('cityRisk_financials');
    if (saved) {
        const data = JSON.parse(saved);
        if (document.getElementById('revenueInput')) {
            document.getElementById('revenueInput').value = data.revenue;
            document.getElementById('expensesInput').value = data.currentExpenses;
            document.getElementById('investmentInput').value = data.capitalInvestment;
            document.getElementById('debtInput').value = data.publicDebt;
            document.getElementById('budgetYear').value = data.year;
            calculateFinancialMetrics();
        }
    }
}
