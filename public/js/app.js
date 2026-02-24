let currentStep = 0;

const modulePaths = {
    1: 'modulo_1_identidad/index.html',
    2: 'modulo_2_territorio/index.html',
    3: 'modulo_3_economia/index.html',
    4: 'modulo_4_infraestructura/index.html',
    5: 'modulo_5_gobernanza/index.html',
    'dashboard': 'modulo_0_tablero/dashboard.html'
};

function startWizard() {
    currentStep = 1;
    document.getElementById('wizard-controls').style.display = 'flex';
    updateView();
}

function viewDashboard() {
    // Si queremos saltar directamente al tablero final
    currentStep = -1; // Usamos un flag especial para el dashboard final
    document.getElementById('wizard-controls').style.display = 'none';
    const container = document.getElementById('module-container');
    container.innerHTML = `<div class="welcome-hero fade-in"><h2>Cargando Tablero de Inversión...</h2></div>`;

    // Simulate Tablero load
    setTimeout(() => {
        container.innerHTML = `<iframe src="${modulePaths['dashboard']}" class="module-iframe fade-in"></iframe>`;

        // Agregar botón de volver fuera del iframe para que controle el wizard padre
        const restartBtn = document.createElement('button');
        restartBtn.className = 'btn btn-secondary fade-in';
        restartBtn.innerText = '← Volver al Inicio';
        restartBtn.style.marginTop = '16px';
        restartBtn.onclick = resetWizard;
        container.appendChild(restartBtn);
    }, 1000);

    // Ocultar tracker superior
    document.querySelector('.stepper').style.display = 'none';
}

function resetWizard() {
    currentStep = 0;
    document.querySelector('.stepper').style.display = 'block';
    document.getElementById('wizard-controls').style.display = 'none';
    const container = document.getElementById('module-container');
    container.innerHTML = `
        <div class="welcome-hero fade-in">
            <h2>Auditoría Paramétrica de Riesgo Municipal</h2>
            <p>Una herramienta diseñada para certificar la solvencia y capacidad técnica de su ciudad ante inversores y el Banco Interamericano de Desarrollo.</p>
            <button class="btn btn-primary" onclick="startWizard()">Comenzar Proceso de Carga</button>
            <button class="btn btn-secondary" onclick="viewDashboard()">Ver Tablero (Demo)</button>
        </div>
    `;
    updateStepperVisuals();
}

function updateView() {
    const container = document.getElementById('module-container');

    if (modulePaths[currentStep]) {
        container.innerHTML = `<iframe src="${modulePaths[currentStep]}" class="module-iframe fade-in"></iframe>`;
    }

    updateStepperVisuals();
    updateButtons();
}

function updateStepperVisuals() {
    const steps = document.querySelectorAll('.step');

    steps.forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));

        // Reset styles
        step.classList.remove('active', 'completed');

        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.add('active'); // Mantiene visibilidad
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });
}

function updateButtons() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    // prev btn
    if (currentStep === 1) {
        btnPrev.disabled = true;
    } else {
        btnPrev.disabled = false;
    }

    // next btn text transformation
    if (currentStep === 5) {
        btnNext.innerHTML = 'Finalizar Auditoría <i class="icon">✓</i>';
        btnNext.classList.remove('btn-primary');
        btnNext.classList.add('btn-success'); // add specific style later if needed
        btnNext.style.backgroundColor = 'var(--brand-success)';
    } else {
        btnNext.innerHTML = 'Continuar →';
        btnNext.style.backgroundColor = 'var(--brand-primary)';
    }
}

function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        updateView();
    } else if (currentStep === 5) {
        viewDashboard();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateView();
    }
}
