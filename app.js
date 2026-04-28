/**
 * EXPLORADOR PRO - MOVISTAR PROSEGUR ALARMAS
 * Versión de Restauración Premium "09h00"
 */

// --- Estado Global ---
let state = {
    user: null,
    leads: [],
    history: [],
    config: {
        phone: '',
        email: '',
        base: '',
        token: ''
    },
    lastSearchCenter: null,
    manualMode: false,
    searchCircle: null
};

let map = null;
let userMarker = null;
let currentLead = null;
let markersLayer = null;

// --- Mapeo del DOM ---
const dom = {
    // Screens
    loginScreen: document.getElementById('login-screen'),
    dashboardScreen: document.getElementById('dashboard-screen'),
    
    // Auth
    showLogin: document.getElementById('show-login'),
    showReg: document.getElementById('show-reg'),
    loginFields: document.getElementById('login-fields'),
    regFields: document.getElementById('reg-fields'),
    loginBtn: document.getElementById('login-btn'),
    regBtn: document.getElementById('reg-btn'),
    logName: document.getElementById('log-name'),
    logPass: document.getElementById('log-pass'),
    regName: document.getElementById('reg-name'),
    regPass: document.getElementById('reg-pass'),
    forgotPw: document.getElementById('forgot-pw-btn'),

    // Tabs
    tabBtns: document.querySelectorAll('.tab-link'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    
    // Navbar & User
    displayName: document.getElementById('display-name'),
    userDisplay: document.getElementById('user-display'),
    userDropdown: document.getElementById('user-dropdown'),
    dropdownBackdrop: document.getElementById('dropdown-backdrop'),
    logoutBtn: document.getElementById('logout-btn'),
    openConfig: document.getElementById('open-config'),
    
    // Discovery
    geoBtn: document.getElementById('geo-btn'),
    radiusSelect: document.getElementById('radius-select'),
    sectorFilter: document.getElementById('sector-filter'),
    searchInput: document.getElementById('lead-search-input'),
    interestFilter: document.getElementById('interest-filter'),
    interestVal: document.getElementById('interest-val'),
    statusFilter: document.getElementById('status-filter'),
    dateFilter: document.getElementById('date-filter'),
    emptyState: document.getElementById('empty-state'),
    leadsContainer: document.getElementById('leads-container'),
    
    // Map Tab
    resetMapBtn: document.getElementById('reset-map-btn'),
    forceGpsBtn: document.getElementById('force-gps-btn'),
    leadsGridHistory: document.getElementById('leads-grid'),
    
    // Modals
    modal: document.getElementById('detail-modal'),
    closeModal: document.getElementById('close-modal'),
    modalTitleInput: document.getElementById('modal-title-input'),
    modalFullAddress: document.getElementById('modal-full-address'),
    modalPhone: document.getElementById('modal-phone'),
    modalEmail: document.getElementById('modal-email'),
    modalCif: document.getElementById('modal-cif'),
    modalContactName: document.getElementById('modal-contact-name'),
    modalServices: document.getElementById('modal-services'),
    modalCp: document.getElementById('modal-cp'),
    modalCity: document.getElementById('modal-city'),
    modalBusinessName: document.getElementById('modal-business-name'),
    modalRrss: document.getElementById('modal-rrss'),
    modalAlarmCompany: document.getElementById('modal-alarm-company'),
    statusBtns: document.querySelectorAll('.status-btn-pick'),
    saveLeadBtn: document.getElementById('save-lead-btn'),
    modalUpdated: document.getElementById('modal-updated'),
    modalInterestBadge: document.getElementById('modal-interest-badge'),
    modalStatusBadge: document.getElementById('modal-status-badge'),
    modalMapsLink: document.getElementById('modal-maps-link'),

    // Config Modal
    configModal: document.getElementById('config-modal'),
    closeConfigModal: document.getElementById('close-config-modal'),
    saveConfigBtn: document.getElementById('save-config-btn'),
    userPhone: document.getElementById('user-phone'),
    userEmailDisplay: document.getElementById('user-email-display'),
    airBase: document.getElementById('air-base'),
    airToken: document.getElementById('air-token'),

    // Export Tools
    exportExcelBtn: document.getElementById('export-excel-btn'),
    exportAirtableBtn: document.getElementById('export-airtable-btn'),
    navDeleteBtn: document.getElementById('nav-delete-btn'),
    historyDeleteModal: document.getElementById('delete-history-modal'),
    cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
    confirmDeleteBtn: document.getElementById('confirm-delete-btn'),
    
    // Stats
    statTotal: document.getElementById('stat-total'),
    statHigh: document.getElementById('stat-high'),
    statFirmado: document.getElementById('stat-firmado'),
    statSeguimiento: document.getElementById('stat-seguimiento'),
    statVisita: document.getElementById('stat-visita'),
    statDescartado: document.getElementById('stat-descartado'),

    // Nuevos controles
    toggleManualBtn: document.getElementById('toggle-manual-btn'),
    addManualLeadBtn: document.getElementById('add-manual-lead-btn'),
    historyStatusFilter: document.getElementById('history-status-filter'),
    showRegBtn: document.getElementById('show-reg-btn'),
    forgotPasswordModal: document.getElementById('forgot-password-modal'),
    closeForgotModal: document.getElementById('close-forgot-modal'),
    forgotEmailInput: document.getElementById('forgot-email'),
    sendResetBtn: document.getElementById('send-reset-btn'),
    forgotFinishBtn: document.getElementById('forgot-finish-btn'),
    forgotInitState: document.getElementById('forgot-init-state'),
    forgotSendingState: document.getElementById('forgot-sending-state'),
    forgotSuccessState: document.getElementById('forgot-success-state'),
    sentEmailDisplay: document.getElementById('sent-email-display'),
    userAvatarImg: document.getElementById('user-avatar-img'),
    userAvatarInput: document.getElementById('user-avatar-input'),
    triggerAvatarUpload: document.getElementById('trigger-avatar-upload'),
    defaultAvatarIcon: document.getElementById('default-avatar-icon'),
    explorationResults: document.getElementById('exploration-results'),
    emptyExploration: document.getElementById('empty-state'),
    
    // Backup & Restore
    downloadBackupBtn: document.getElementById('download-backup-btn'),
    restoreBackupBtn: document.getElementById('restore-backup-btn'),
    importBackupInput: document.getElementById('import-backup-input')
};

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Cargado. Iniciando Explorador PRO...");
    window.dom = dom;
    window.state = state;
    
    try {
        setupEventListeners();
        console.log("Event listeners configurados.");
    } catch (e) {
        console.error("Error en setupEventListeners:", e);
    }

    try {
        initAuth();
        console.log("Auth iniciado.");
    } catch (e) {
        console.error("Error en initAuth:", e);
    }

    try {
        lucide.createIcons();
    } catch (e) {
        console.warn("Error cargando iconos Lucide:", e);
    }
});

function initAuth() {
    const savedUser = localStorage.getItem('pro_user');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
        enterApp();
    }
}

function setupEventListeners() {
    // Auth Toggles
    if (dom.showRegBtn) dom.showRegBtn.onclick = (e) => { e.preventDefault(); dom.loginFields.classList.add('hidden'); dom.regFields.classList.remove('hidden'); };
    if (dom.showLogin) dom.showLogin.onclick = (e) => { e.preventDefault(); dom.regFields.classList.add('hidden'); dom.loginFields.classList.remove('hidden'); };
    
    if (dom.loginBtn) dom.loginBtn.addEventListener('click', handleLogin);
    if (dom.regBtn) dom.regBtn.addEventListener('click', handleRegister);
    
    if (dom.forgotPw) {
        dom.forgotPw.addEventListener('click', (e) => {
            e.preventDefault();
            resetForgotModal();
            dom.forgotPasswordModal.classList.add('active');
        });
    }
    
    if (dom.closeForgotModal) dom.closeForgotModal.addEventListener('click', () => dom.forgotPasswordModal.classList.remove('active'));
    if (dom.forgotFinishBtn) dom.forgotFinishBtn.addEventListener('click', () => dom.forgotPasswordModal.classList.remove('active'));
    
    if (dom.sendResetBtn) dom.sendResetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleForgotPasswordReset();
    });

    // Header Actions
    if (dom.exportExcelBtn) dom.exportExcelBtn.onclick = exportToExcel;
    if (dom.exportAirtableBtn) dom.exportAirtableBtn.onclick = exportToAirtable;
    if (dom.navDeleteBtn) dom.navDeleteBtn.onclick = () => dom.historyDeleteModal.classList.add('active');
    if (dom.cancelDeleteBtn) dom.cancelDeleteBtn.onclick = () => dom.historyDeleteModal.classList.remove('active');
    if (dom.confirmDeleteBtn) {
        dom.confirmDeleteBtn.onclick = () => {
            const period = document.getElementById('delete-period').value;
            executeSelectiveDelete(period);
            dom.historyDeleteModal.classList.remove('active');
        };
    }

    // Tabs
    dom.tabBtns.forEach(btn => {
        btn.onclick = () => {
            dom.tabBtns.forEach(b => b.classList.remove('active'));
            dom.tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.tab + '-tab');
            if (target) {
                target.classList.add('active');
                if (btn.dataset.tab === 'map-history' && map) {
                    setTimeout(() => map.invalidateSize(), 150);
                }
            }
            window.scrollTo(0,0);
        };
    });

    // Profile Dropdown
    // Profile
    if (dom.triggerAvatarUpload) dom.triggerAvatarUpload.onclick = () => dom.userAvatarInput.click();
    if (dom.userAvatarInput) {
        dom.userAvatarInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const base64 = compressImage(img, 300); // Max 300px
                        dom.userAvatarImg.src = base64;
                        dom.userAvatarImg.classList.remove('hidden');
                        dom.defaultAvatarIcon.classList.add('hidden');
                        state.config.avatar = base64;
                        saveConfig(true); // Silent save
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // Profile Dropdown
    if (dom.userDisplay) {
        dom.userDisplay.onclick = (e) => {
            e.stopPropagation();
            if (dom.userDropdown) dom.userDropdown.classList.toggle('active');
            if (dom.dropdownBackdrop) dom.dropdownBackdrop.style.display = (dom.userDropdown && dom.userDropdown.classList.contains('active')) ? 'block' : 'none';
        };
    }
    
    if (dom.dropdownBackdrop) {
        dom.dropdownBackdrop.onclick = () => {
            if (dom.userDropdown) dom.userDropdown.classList.remove('active');
            dom.dropdownBackdrop.style.display = 'none';
        };
    }

    if (dom.logoutBtn) dom.logoutBtn.onclick = handleLogout;
    
    if (dom.openConfig) {
        dom.openConfig.onclick = () => {
            console.log("Abriendo configuración...", state.config, state.user);
            if (dom.configModal) dom.configModal.classList.add('active');
            if (dom.userPhone) dom.userPhone.value = state.config.phone || '';
            if (dom.userEmailDisplay) dom.userEmailDisplay.value = state.config.email || state.user.name || '';
            if (dom.airBase) dom.airBase.value = state.config.base || '';
            if (dom.airToken) dom.airToken.value = state.config.token || '';
            if (dom.userDropdown) dom.userDropdown.classList.remove('active');
            if (dom.dropdownBackdrop) dom.dropdownBackdrop.style.display = 'none';
        };
    }

    if (dom.closeConfigModal) dom.closeConfigModal.onclick = () => dom.configModal && dom.configModal.classList.remove('active');
    if (dom.saveConfigBtn) dom.saveConfigBtn.onclick = () => saveConfig();

    // Backup & Restore Events
    if (dom.downloadBackupBtn) dom.downloadBackupBtn.onclick = downloadFullBackup;
    if (dom.restoreBackupBtn) dom.restoreBackupBtn.onclick = () => dom.importBackupInput && dom.importBackupInput.click();
    if (dom.importBackupInput) dom.importBackupInput.onchange = importFullBackup;

    // Search & Discovery
    if (dom.geoBtn) dom.geoBtn.onclick = handleGeolocation;
    if (dom.resetMapBtn) dom.resetMapBtn.onclick = handleGeolocation;
    if (dom.forceGpsBtn) dom.forceGpsBtn.onclick = handleGeolocation;
    
    if (dom.radiusSelect) dom.radiusSelect.onchange = handleFiltering;
    if (dom.sectorFilter) dom.sectorFilter.onchange = handleFiltering;
    if (dom.searchInput) dom.searchInput.oninput = handleFiltering;
    if (dom.interestFilter) {
        dom.interestFilter.oninput = (e) => {
            if (dom.interestVal) dom.interestVal.innerText = e.target.value + '%';
            handleFiltering();
        };
    }
    if (dom.statusFilter) dom.statusFilter.onchange = handleFiltering;
    if (dom.dateFilter) dom.dateFilter.onchange = handleFiltering;
    if (dom.historyStatusFilter) dom.historyStatusFilter.onchange = renderLeads;

    // Map Extra Controls
    if (dom.toggleManualBtn) {
        dom.toggleManualBtn.onclick = () => {
            state.manualMode = !state.manualMode;
            dom.toggleManualBtn.classList.toggle('active', state.manualMode);
            dom.toggleManualBtn.querySelector('span').innerText = state.manualMode ? 'MANUAL: ON' : 'MANUAL: OFF';
        };
    }

    if (dom.addManualLeadBtn) {
        dom.addManualLeadBtn.onclick = () => {
            if (!state.lastSearchCenter) return alert("Primero ubícate en el mapa.");
            addNewManualLead(state.lastSearchCenter.lat, state.lastSearchCenter.lng);
        };
    }

    // Lead Details
    if (dom.closeModal) dom.closeModal.onclick = () => dom.modal.classList.remove('active');
    if (dom.saveLeadBtn) dom.saveLeadBtn.onclick = saveLeadChanges;
    if (dom.statusBtns) {
        dom.statusBtns.forEach(btn => {
            btn.onclick = () => updateLeadStatus(btn.dataset.status);
        });
    }

    // Tools
    if (dom.exportExcelBtn) dom.exportExcelBtn.onclick = exportToExcel;
    if (dom.exportAirtableBtn) dom.exportAirtableBtn.onclick = exportToAirtable;
    if (dom.navDeleteBtn) dom.navDeleteBtn.onclick = () => dom.historyDeleteModal.classList.add('active');
    if (dom.cancelDeleteBtn) dom.cancelDeleteBtn.onclick = () => dom.historyDeleteModal.classList.remove('active');
    if (dom.confirmDeleteBtn) {
        dom.confirmDeleteBtn.onclick = () => {
            const periodInput = document.querySelector('input[name="delete-period"]:checked');
            const period = periodInput ? periodInput.value : 'today';
            executeSelectiveDelete(period);
            dom.historyDeleteModal.classList.remove('active');
        };
    }
}

// --- Lógica de Auth ---
function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

function handleLogin() {
    const email = dom.logName.value.trim();
    if (!email || !validateEmail(email)) return alert("Por favor, introduce un email corporativo válido.");
    state.user = { name: email, pass: dom.logPass.value };
    localStorage.setItem('pro_user', JSON.stringify(state.user));
    enterApp();
}

function handleRegister() {
    const email = dom.regName.value.trim();
    if (!email || !validateEmail(email)) return alert("Por favor, introduce un email corporativo válido.");
    state.user = { name: email, pass: dom.regPass.value };
    localStorage.setItem('pro_user', JSON.stringify(state.user));
    enterApp();
}

function resetForgotModal() {
    dom.forgotInitState.classList.remove('hidden');
    dom.forgotSendingState.classList.add('hidden');
    dom.forgotSuccessState.classList.add('hidden');
    dom.forgotEmailInput.value = "";
}

function handleForgotPasswordReset() {
    const email = dom.forgotEmailInput.value.trim();
    if (!email || !validateEmail(email)) return alert("Introduce un email válido.");

    dom.forgotInitState.classList.add('hidden');
    dom.forgotSendingState.classList.remove('hidden');

    // Simulación de envío
    setTimeout(() => {
        dom.forgotSendingState.classList.add('hidden');
        dom.forgotSuccessState.classList.remove('hidden');
        dom.sentEmailDisplay.innerText = email;
    }, 2500);
}

function handleLogout() {
    localStorage.removeItem('pro_user');
    location.reload();
}

function enterApp() {
    dom.loginScreen.classList.remove('active');
    dom.dashboardScreen.style.display = 'block';
    dom.displayName.innerText = state.user.name;
    
    // Cargar datos
    const saved = localStorage.getItem('pro_leads_' + state.user.name);
    if (saved) state.leads = JSON.parse(saved);
    
    const savedConf = localStorage.getItem('pro_config_' + state.user.name);
    if (savedConf) {
        state.config = JSON.parse(savedConf);
        // Asegurar que el email está presente
        if (!state.config.email) state.config.email = state.user.name;
        
        if (state.config.avatar) {
            dom.userAvatarImg.src = state.config.avatar;
            dom.userAvatarImg.classList.remove('hidden');
            dom.defaultAvatarIcon.classList.add('hidden');
        }
    } else {
        // Inicializar config por defecto si es nuevo
        state.config.email = state.user.name;
    }

    initMap();
    updateStats();
    renderLeads();
}

// --- Lógica de Mapa ---
function initMap() {
    try {
        if (!document.getElementById('map')) return console.warn("Elemento #map no encontrado");
        
        map = L.map('map', { zoomControl: false }).setView([40.4167, -3.7033], 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '©OpenStreetMap'
        }).addTo(map);
        
        markersLayer = L.layerGroup().addTo(map);

        // Permitir clic en el mapa para búsqueda manual
        map.on('click', (e) => {
            if (!state.manualMode) return;
            onLocalSuccess(e.latlng.lat, e.latlng.lng);
        });
    } catch (err) {
        console.error("Error inicializando mapa Leaflet:", err);
    }
}

function handleGeolocation() {
    dom.geoBtn.innerHTML = '<i class="lucide-refresh-cw spin"></i> BUSCANDO...';
    
    const options = { timeout: 10000, enableHighAccuracy: true };
    
    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        onLocalSuccess(latitude, longitude);
        dom.geoBtn.innerHTML = '<i data-lucide="check"></i> ACTUALIZADO';
        lucide.createIcons();
        setTimeout(() => { dom.geoBtn.innerHTML = '<i data-lucide="maximize"></i> ACTUALIZAR ZONA'; lucide.createIcons(); }, 3000);
    }, (err) => {
        alert("Fallo GPS: " + err.message + ". Usando posición por defecto (Madrid).");
        onLocalSuccess(40.4167, -3.7033);
        dom.geoBtn.innerHTML = '<i data-lucide="maximize"></i> ACTUALIZAR ZONA'; lucide.createIcons();
    }, options);
}

async function onLocalSuccess(lat, lng) {
    state.lastSearchCenter = { lat, lng };
    
    if (!userMarker) {
        userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'user-marker-container',
                html: '<div class="user-marker"></div>',
                iconSize: [20, 20]
            })
        }).addTo(map);
    } else {
    userMarker.setLatLng([lat, lng]);
    }
    
    // Dibujar/Actualizar Círculo de Radio
    const r = parseInt(dom.radiusSelect.value);
    if (state.searchCircle) {
        state.searchCircle.setLatLng([lat, lng]);
        state.searchCircle.setRadius(r);
    } else {
        state.searchCircle = L.circle([lat, lng], {
            radius: r,
            color: 'var(--primary-yellow)',
            fillColor: 'var(--primary-yellow)',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '5, 10'
        }).addTo(map);
    }

    map.setView([lat, lng], 15);
    generateLeads(lat, lng, r);
}

// --- Motor de Búsqueda (Overpass Fix) ---
async function generateLeads(lat, lng, r) {
    if (dom.emptyExploration) dom.emptyExploration.style.display = 'none';
    
    // UI de Escaneo Activo
    dom.leadsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 5rem 2rem;">
            <div class="radar-container">
                <div class="radar-line" style="animation-duration: 1.5s;"></div>
                <div class="radar-circle"></div>
                <div class="radar-circle" style="animation-delay: 1s;"></div>
                <div class="radar-point" style="top: 30%; left: 40%; animation: pointFlicker 0.5s infinite;"></div>
            </div>
            <h3 class="btn-pulse" style="color: var(--primary-yellow); letter-spacing: 3px;">ESCANEANDO ZONA...</h3>
            <p id="scan-status" style="margin-top: 1rem; font-size: 0.8rem; font-weight: 800; color: var(--text-muted);">Sincronizando con satélites...</p>
        </div>`;

    const statusMsg = document.getElementById('scan-status');
    const steps = ["Conectando con base de datos...", "Analizando coordenadas térmicas...", "Detectando perímetros comerciales...", "Calculando potencial Prosegur..."];
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
        if (statusMsg && steps[stepIdx]) statusMsg.innerText = steps[stepIdx++];
        else clearInterval(stepInterval);
    }, 800);

    // Lista de servidores espejo para robustez
    const mirrors = [
        'https://overpass-api.de/api/interpreter',
        'https://lz4.overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter'
    ];

    const query = `[out:json][timeout:25];
        (
          node["amenity"~"restaurant|cafe|pharmacy|gym|clinic|bank|pub|hospital|bar|cinema"](around:${r},${lat},${lng});
          way["amenity"~"restaurant|cafe|pharmacy|gym|clinic|bank|pub|hospital|bar|cinema"](around:${r},${lat},${lng});
          node["shop"~"clothes|supermarket|beauty|bakery|hairdresser|convenience|kiosk|mobile_phone"](around:${r},${lat},${lng});
          way["shop"~"clothes|supermarket|beauty|bakery|hairdresser|convenience|kiosk|mobile_phone"](around:${r},${lat},${lng});
        );
        out center body;`;

    let data = null;
    for (let url of mirrors) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: "data=" + encodeURIComponent(query),
                timeout: 5000
            });
            if (response.ok) {
                data = await response.json();
                break;
            }
        } catch(e) { console.warn("Mirror fallido: " + url); }
    }

    if (!data || !data.elements || data.elements.length === 0) {
        dom.leadsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                <div class="radar-container" style="width: 100px; height: 100px; margin-bottom: 1.5rem; opacity: 0.5;">
                    <div class="radar-line"></div>
                </div>
                <h3 style="color: var(--danger);">SIN RESULTADOS</h3>
                <p style="opacity: 0.6;">No hemos detectado negocios en esta zona exacta. Prueba a aumentar el radio o moverte.</p>
            </div>`;
        lucide.createIcons();
        return;
    }

    const newLeads = data.elements.map(el => {
        const id = 'osm_' + el.id;
        const tags = el.tags || {};
        const name = tags.name || tags.operator || tags.brand || "Negocio sin nombre";
        const sector = tags.amenity || tags.shop || "Comercial";
        const address = tags['addr:street'] ? (tags['addr:street'] + ' ' + (tags['addr:housenumber'] || '')) : "Dirección no disponible";
        
        // Calcular interés simulado avanzado
        let interest = 40 + Math.floor(Math.random() * 40);
        if (tags.phone) interest += 10;
        if (tags.website) interest += 10;
        if (interest > 100) interest = 100;

        return {
            id,
            name,
            sector: sector.charAt(0).toUpperCase() + sector.slice(1),
            address,
            phone: tags.phone || "No disponible",
            email: tags.email || "No disponible",
            cif: "Pendiente identificar",
            contactName: "Pendiente",
            cp: tags['addr:postcode'] || "",
            city: tags['addr:city'] || "",
            rrss: tags.website || "",
            alarm: "NINGUNA",
            interest,
            status: 'visita',
            services: "Puntos detectados por satélite: " + Object.keys(tags).length,
            lat: el.lat || (el.center ? el.center.lat : 0),
            lng: el.lon || (el.center ? el.center.lon : 0),
            date: new Date().toLocaleDateString(),
            lastUpdate: '--'
        };
    });

    // Fusionar con existentes (evitar duplicados)
    newLeads.forEach(nl => {
        if (!state.leads.find(l => l.id === nl.id)) {
            state.leads.unshift(nl);
        }
    });

    localStorage.setItem('pro_leads_' + state.user.name, JSON.stringify(state.leads));
    renderLeads();
    renderMapPins();
    updateStats();
}

// --- Lógica de Renderizado ---
function renderLeads() {
    const filters = {
        radius: dom.radiusSelect ? parseInt(dom.radiusSelect.value) : 1000,
        sector: dom.sectorFilter ? dom.sectorFilter.value : 'all',
        search: dom.searchInput ? dom.searchInput.value.toLowerCase() : '',
        interest: dom.interestFilter ? parseInt(dom.interestFilter.value) : 0,
        status: dom.statusFilter ? dom.statusFilter.value : 'all',
        date: dom.dateFilter ? dom.dateFilter.value : 'all'
    };

    const filtered = state.leads.filter(l => {
        if (filters.sector !== 'all' && !l.sector.toLowerCase().includes(filters.sector.toLowerCase())) return false;
        if (filters.search && !l.name.toLowerCase().includes(filters.search) && !l.address.toLowerCase().includes(filters.search)) return false;
        if (l.interest < filters.interest) return false;
        if (filters.status !== 'all' && l.status !== filters.status) return false;
        
        if (filters.date === 'recent') {
            const parts = l.date.split('/');
            const date = new Date(parts[2], parts[1]-1, parts[0]);
            if ((Date.now() - date.getTime()) > 7*24*60*60*1000) return false;
        }
        return true;
    });

    dom.leadsContainer.innerHTML = '';
    dom.leadsGridHistory.innerHTML = '';

    if (filtered.length > 0) {
        if (dom.emptyExploration) dom.emptyExploration.style.display = 'none';
        filtered.forEach(lead => {
            const card = createLeadCard(lead);
            dom.leadsContainer.appendChild(card);
        });
    } else {
        if (dom.emptyExploration) dom.emptyExploration.style.display = 'block';
    }

    // Render Historial con su propio filtro
    const historyStatus = dom.historyStatusFilter.value;
    const historyLeads = state.leads.filter(l => {
        if (historyStatus !== 'all' && l.status !== historyStatus) return false;
        return true;
    });

    historyLeads.forEach(lead => {
        const cardH = createLeadCard(lead);
        dom.leadsGridHistory.appendChild(cardH);
    });
}

function createLeadCard(lead) {
    const div = document.createElement('div');
    div.className = 'lead-card-premium';
    
    // Color según interés
    let interestColor = '#94a3b8'; // Muted
    if (lead.interest >= 70) interestColor = '#22c55e'; // Green
    if (lead.interest >= 85) interestColor = 'var(--primary-yellow)'; // Gold
    if (lead.interest >= 95) interestColor = '#ef4444'; // Red

    div.innerHTML = `
        <div class="card-header-flex">
            <div class="lead-info-top">
                <h3 class="lead-name-premium" style="margin-bottom: 0.2rem;">${lead.name}</h3>
                <p class="lead-sector-premium" style="font-size: 0.65rem; color: var(--text-muted); font-weight: 800;">
                    <i data-lucide="briefcase" style="width: 12px; height: 12px;"></i> ${lead.sector.toUpperCase()}
                </p>
            </div>
            <span class="badge-status-premium ${lead.status}">
                ${lead.status.toUpperCase()}
            </span>
        </div>
        
        <div class="interest-progress-wrapper">
            <div class="interest-label-flex">
                <span style="color: ${interestColor}">POTENCIAL COMERCIAL</span>
                <span>${lead.interest}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${lead.interest}%; background: ${interestColor}; box-shadow: 0 0 10px ${interestColor}44;"></div>
            </div>
        </div>
        
        <p class="lead-address-premium" style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i> ${lead.address}
        </p>
        
        <div class="card-actions-premium" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
            <button class="btn btn-outline" style="padding: 0.6rem; font-size: 0.7rem;" onclick="window.openLeadByID('${lead.id}')">
                <i data-lucide="info" style="width: 14px;"></i> DETALLES
            </button>
            <button class="btn btn-primary" style="padding: 0.6rem; font-size: 0.7rem;" onclick="window.open('https://www.google.com/maps?q=${lead.lat},${lead.lng}', '_blank')">
                <i data-lucide="navigation" style="width: 14px;"></i> MAPS
            </button>
        </div>
    `;
    
    // Inicializar iconos de Lucide en la nueva tarjeta
    setTimeout(() => lucide.createIcons({ props: { "stroke-width": 2.5 } }), 0);
    
    return div;
}

function renderMapPins() {
    if (!markersLayer) return;
    markersLayer.clearLayers();
    
    state.leads.forEach(l => {
        let color = '#FED000'; // Gold standard
        if (l.interest >= 90) color = '#ef4444'; // Muy alto potencial (Rojo Prosegur)
        else if (l.interest >= 75) color = '#f97316'; // Alto potencial (Naranja)
        
        if (l.status === 'seguimiento') color = '#fce7d2';
        if (l.status === 'firmado') color = '#22c55e';
        if (l.status === 'descartado') color = '#64748b'; // Gris para descartados
        
        const pin = L.circleMarker([l.lat, l.lng], {
            radius: l.interest >= 80 ? 10 : 7, // Más grandes los de alto interés
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        });
        
        pin.bindPopup(`
            <div style="text-align: center; color: var(--bg-dark);">
                <b style="font-size: 1rem;">${l.name}</b><br>
                <span style="font-size: 0.8rem;">Potencial: ${l.interest}%</span><br>
                <button onclick="window.openLeadByID('${l.id}')" style="margin-top: 10px; background: #003399; color: white; border: none; padding: 8px 12px; border-radius: 2rem; font-weight: 800; cursor: pointer; width: 100%;">GESTIONAR</button>
            </div>
        `);
        markersLayer.addLayer(pin);
    });
}

function addNewManualLead(lat, lng) {
    const name = prompt("Nombre del nuevo local:");
    if (!name) return;
    
    const newLead = {
        id: 'manual_' + Date.now(),
        name,
        sector: "Añadido Manual",
        address: "Ubicación en mapa",
        phone: "No disponible",
        email: "No disponible",
        cif: "Pendiente",
        contactName: "Pendiente",
        cp: "",
        city: "",
        rrss: "",
        alarm: "NINGUNA",
        interest: 50,
        status: 'visita',
        services: "Local añadido manualmente por el agente en campo.",
        lat,
        lng,
        date: new Date().toLocaleDateString(),
        lastUpdate: '--'
    };
    
    state.leads.unshift(newLead);
    saveToDisk();
    renderLeads();
    renderMapPins();
    updateStats();
    alert("Local añadido al historial.");
}

// --- Detalle y Gestión ---
function openLead(lead) {
    currentLead = lead;
    dom.modalTitleInput.value = lead.name;
    dom.modalFullAddress.value = lead.address;
    dom.modalPhone.value = lead.phone;
    dom.modalEmail.value = lead.email;
    dom.modalCif.value = lead.cif || "";
    dom.modalContactName.value = lead.contactName || "";
    dom.modalServices.value = lead.services || "";
    if(dom.modalCp) dom.modalCp.value = lead.cp || "";
    if(dom.modalCity) dom.modalCity.value = lead.city || "";
    if(dom.modalBusinessName) dom.modalBusinessName.value = lead.name || "";
    if(dom.modalRrss) dom.modalRrss.value = lead.rrss || "";
    if(dom.modalAlarmCompany) dom.modalAlarmCompany.value = lead.alarm || "NINGUNA";
    dom.modalUpdated.innerText = lead.lastUpdate;
    
    // Color según interés en el modal
    let interestColor = '#94a3b8';
    if (lead.interest >= 70) interestColor = '#22c55e';
    if (lead.interest >= 85) interestColor = 'var(--primary-yellow)';
    if (lead.interest >= 95) interestColor = '#ef4444';
    
    dom.modalInterestBadge.innerText = lead.interest + '%';
    dom.modalInterestBadge.style.color = interestColor;
    dom.modalInterestBadge.style.borderColor = interestColor + '44'; // 44 es opacidad en hex

    dom.modalStatusBadge.innerText = lead.status.toUpperCase();
    dom.modalStatusBadge.className = 'badge-status-premium ' + lead.status;
    dom.modalMapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + lead.address)}`;
    
    updateStatusUI();
    dom.modal.classList.add('active');
}

window.openLeadByID = (id) => {
    const lead = state.leads.find(l => l.id === id);
    if (lead) openLead(lead);
};

function updateLeadStatus(status) {
    if (!currentLead) return;
    currentLead.status = status;
    currentLead.lastUpdate = new Date().toLocaleString();
    
    // Sync with array
    const idx = state.leads.findIndex(l => l.id === currentLead.id);
    if (idx !== -1) state.leads[idx] = { ...currentLead };
    
    saveToDisk();
    updateStatusUI();
    dom.modalStatusBadge.innerText = status.toUpperCase();
    dom.modalStatusBadge.className = 'badge-status-premium ' + status;
    updateStats();
    renderLeads();
    renderMapPins();
}

function saveLeadChanges() {
    if (!currentLead) return;
    currentLead.name = dom.modalTitleInput.value;
    currentLead.address = dom.modalFullAddress.value;
    currentLead.phone = dom.modalPhone.value;
    currentLead.email = dom.modalEmail.value;
    currentLead.cif = dom.modalCif.value;
    currentLead.contactName = dom.modalContactName.value;
    currentLead.services = dom.modalServices.value;
    if(dom.modalCp) currentLead.cp = dom.modalCp.value;
    if(dom.modalCity) currentLead.city = dom.modalCity.value;
    if(dom.modalRrss) currentLead.rrss = dom.modalRrss.value;
    if(dom.modalAlarmCompany) currentLead.alarm = dom.modalAlarmCompany.value;
    currentLead.lastUpdate = new Date().toLocaleString();
    
    const idx = state.leads.findIndex(l => l.id === currentLead.id);
    if (idx !== -1) state.leads[idx] = { ...currentLead };
    
    saveToDisk();
    renderLeads();
    renderMapPins();
    alert("Datos actualizados.");
}

function updateStatusUI() {
    dom.statusBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === currentLead.status);
    });
}

// --- Auxiliares ---
function saveConfig(silent = false) {
    state.config = {
        phone: dom.userPhone.value,
        email: dom.userEmailDisplay.value,
        base: dom.airBase.value,
        token: dom.airToken.value,
        avatar: state.config.avatar || ''
    };
    try {
        localStorage.setItem('pro_config_' + state.user.name, JSON.stringify(state.config));
        if (!silent) {
            dom.configModal.classList.remove('active');
            alert("Configuración guardada.");
        }
    } catch (e) {
        console.error("Error guardando config:", e);
        alert("Error: No se pudo guardar la configuración. Posiblemente por falta de espacio.");
    }
}

function updateStats() {
    dom.statTotal.innerText = state.leads.length;
    dom.statHigh.innerText = state.leads.filter(l => l.interest >= 80).length;
    dom.statFirmado.innerText = state.leads.filter(l => l.status === 'firmado').length;
    dom.statSeguimiento.innerText = state.leads.filter(l => l.status === 'seguimiento').length;
    dom.statVisita.innerText = state.leads.filter(l => l.status === 'visita').length;
    dom.statDescartado.innerText = state.leads.filter(l => l.status === 'descartado').length;
}

function saveToDisk() {
    try {
        localStorage.setItem('pro_leads_' + state.user.name, JSON.stringify(state.leads));
        console.log("Datos guardados correctamente: " + state.leads.length + " prospectos.");
    } catch (e) {
        console.error("Error crítico de guardado:", e);
        alert("¡ATENCIÓN! No se han podido guardar los datos en el navegador. Por favor, descarga un Backup inmediatamente para no perder tu trabajo.");
    }
}

// --- Utilidades de Datos ---
function compressImage(img, maxWidth) {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.7); // 70% calidad
}

function downloadFullBackup() {
    const backupData = {
        user: state.user,
        leads: state.leads,
        config: state.config,
        timestamp: new Date().toISOString(),
        version: "2.0"
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExploradorPRO_Backup_${state.user.name.split('@')[0]}_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
}

function importFullBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (!data.leads || !data.config) throw new Error("Formato inválido");

            if (confirm("¿Estás seguro? Se sobrescribirán tus datos actuales con los del backup.")) {
                state.leads = data.leads;
                state.config = data.config;
                
                // Forzar guardado
                localStorage.setItem('pro_leads_' + state.user.name, JSON.stringify(state.leads));
                localStorage.setItem('pro_config_' + state.user.name, JSON.stringify(state.config));
                
                alert("Backup restaurado con éxito. La página se recargará.");
                location.reload();
            }
        } catch (err) {
            alert("Error al importar: El archivo no es un backup válido.");
        }
    };
    reader.readAsText(file);
}

function executeSelectiveDelete(period) {
    if (period === 'all') {
        if (!confirm("¿ESTÁS SEGURO? Borrarás todos los clientes captados.")) return;
        state.leads = [];
    } else {
        const now = Date.now();
        const limit = period === 'today' ? 24*60*60*1000 : 7*24*60*60*1000;
        state.leads = state.leads.filter(l => {
            const parts = l.date.split('/');
            const date = new Date(parts[2], parts[1]-1, parts[0]);
            return (now - date.getTime()) > limit;
        });
    }
    saveToDisk();
    renderLeads();
    renderMapPins();
    updateStats();
    alert("Historial saneado.");
}

// --- Exportación ---
function exportToExcel() {
    console.log("Iniciando exportación Excel...", state.leads.length);
    if (state.leads.length === 0) return alert("No hay datos para exportar.");
    
    // Preparar datos para SheetJS
    const exportData = state.leads.map(l => ({
        "ID Sistema": l.id,
        "Nombre Negocio": l.name,
        "Sector": l.sector,
        "Dirección": l.address,
        "C. Postal": l.cp,
        "Población": l.city,
        "CIF / NIF": l.cif,
        "Persona Contacto": l.contactName,
        "Teléfono": l.phone,
        "Email": l.email,
        "Redes Sociales": l.rrss,
        "Compañía Alarma": l.alarm,
        "Potencial (%)": l.interest,
        "Estado Comercial": l.status.toUpperCase(),
        "Notas": l.services,
        "Última Interacción": l.lastUpdate !== '--' ? l.lastUpdate : l.date
    }));

    try {
        // Crear hoja de trabajo y libro
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Prospectos");
        
        // Ajustar ancho de columnas básico
        const colWidths = [
            { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 40 }, { wch: 15 },
            { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 20 }
        ];
        worksheet['!cols'] = colWidths;

        // Descargar archivo .xlsx
        const dateStr = new Date().toISOString().slice(0,10);
        const filename = `ExploradorPRO_Prospectos_${dateStr}.xlsx`;
        XLSX.writeFile(workbook, filename);
        
        alert("Exportación completada. Archivo Excel generado: " + filename);
    } catch (error) {
        console.error("Error exportando a Excel:", error);
        alert("Hubo un error al generar el archivo Excel. Verifica la consola.");
    }
}

async function exportToAirtable() {
    if (!state.config.base || !state.config.token) return alert("Configura Airtable en Ajustes primero.");
    if (state.leads.length === 0) return alert("No hay prospectos para sincronizar.");

    const confirmSync = confirm(`¿Sincronizar ${state.leads.length} prospectos con Airtable (Tabla: 'Prospectos')?`);
    if (!confirmSync) return;

    const baseId = state.config.base;
    const token = state.config.token;
    const tableName = "Prospectos"; // Nombre de tabla esperado
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    alert("Iniciando sincronización... Por favor, no cierres la app.");

    try {
        // Airtable permite máximo 10 registros por petición
        for (let i = 0; i < state.leads.length; i += 10) {
            const batch = state.leads.slice(i, i + 10).map(l => ({
                fields: {
                    "ID": l.id,
                    "Nombre": l.name,
                    "Sector": l.sector,
                    "Direccion": l.address,
                    "CP": l.cp,
                    "Poblacion": l.city,
                    "CIF": l.cif,
                    "Contacto": l.contactName,
                    "Telefono": l.phone,
                    "Email": l.email,
                    "RRSS": l.rrss,
                    "Alarma_Actual": l.alarm,
                    "Notas": l.services,
                    "Interes": l.interest,
                    "Estado": l.status,
                    "Ultima_Actualizacion": l.lastUpdate || l.date
                }
            }));

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ records: batch })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || "Error desconocido en Airtable");
            }
        }

        alert("¡Sincronización completada con éxito en Airtable!");
    } catch (err) {
        console.error("Error Airtable:", err);
        alert("Error de sincronización: " + err.message + "\n\nAsegúrate de que la tabla se llame 'Prospectos' y que los campos coincidan.");
    }
}

// Manejo de Registro Externo via URL (Opcional)
function handleFiltering() { renderLeads(); }
