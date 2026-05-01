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
    addMode: false,
    searchCircle: null
};

// --- CONFIGURACIÓN GLOBAL ---
const AI_MOCK_MODE = true;
const AI_CONFIG = {
    model: "gpt-4o", // Preparado para el futuro
    endpoint: "https://vjzyxtwzxpjxxtxvjxxt.supabase.co/functions/v1/prosegur-ai-agent"
};

// --- Configuración Supabase ---
const SUPABASE_URL = 'https://iwxxixyjaxenojckohml.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eHhpeHlqYXhlbm9qY2tvaG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjEyMjMsImV4cCI6MjA5MjkzNzIyM30.NO3dG4HALVF81bXZoGRsiDxbwuYzi53pjNyGt4O85lA';
let sb = null;

let map = null;
let userMarker = null;
let currentLead = null;
let markersLayer = null;

// --- Mapeo del DOM ---
let dom = {};

function initDom() {
    dom = {
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
        searchCityBtn: document.getElementById('search-city-btn'),
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
        modalInterestBadge: document.getElementById('modal-interest-badge'),
        modalStatusBadge: document.getElementById('modal-status-badge'),
        modalCreated: document.getElementById('modal-created'),
        modalUpdated: document.getElementById('modal-updated'),
        modalMapsLink: document.getElementById('modal-maps-link'),
        modalSector: document.getElementById('modal-sector'),
        deleteLeadBtn: document.getElementById('delete-lead-btn'),

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
        
        // Add Lead Modal (Manual)
        addLeadModal: document.getElementById('add-lead-modal'),
        closeAddModal: document.getElementById('close-add-modal'),
        addLeadName: document.getElementById('add-lead-name'),
        addLeadSector: document.getElementById('add-lead-sector'),
        confirmAddLeadBtn: document.getElementById('confirm-add-lead-btn'),
        
        // Backup & Restore
        downloadBackupBtn: document.getElementById('download-backup-btn'),
        restoreBackupBtn: document.getElementById('restore-backup-btn'),
        importBackupInput: document.getElementById('import-backup-input'),
        
        // Supabase Sync UI
        cloudSyncStatus: document.getElementById('cloud-sync-status'),
        forceSyncBtn: document.getElementById('force-sync-btn'),
        downloadCloudBtn: document.getElementById('download-cloud-btn'),
        lastSyncText: document.getElementById('last-sync-text'),
        
        // --- AI Assistant Elements ---
        assistantTab: document.getElementById('assistant-tab'),
        aiUserInput: document.getElementById('ai-user-input'),
        aiChatHistory: document.getElementById('ai-chat-history'),
        aiCurrentLeadName: document.getElementById('ai-current-lead-name'),
        aiContextPanel: document.getElementById('ai-context-panel'),
        aiProbBadgeContainer: document.getElementById('ai-prob-badge-container'),
        aiAnalysisContent: document.getElementById('ai-analysis-content'),
        aiAnalysisEmpty: document.getElementById('ai-analysis-empty'),
        aiAnalysisLoading: document.getElementById('ai-analysis-loading'),
        aiAnalysisResult: document.getElementById('ai-analysis-result'),
    };
}

// --- Inicialización Robusta ---
function bootstrapApp() {
    console.log("🚀 Iniciando Explorador PRO (Bootstrap)...");
    try {
        initDom();
        window.dom = dom;
        window.state = state;
        
        // Supabase
        const supabaseLib = window.supabase || (typeof supabase !== 'undefined' && (window.supabase !== supabase) ? supabase : null);
        if (supabaseLib && typeof supabaseLib.createClient === 'function') {
            sb = supabaseLib.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("✅ Supabase cliente inicializado.");
        }

        setupEventListeners();
        initAuth();
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        console.log("✨ App lista y operativa.");
    } catch (e) {
        console.error("❌ Error crítico en el inicio:", e);
    }
}

// Asegurar que el DOM está listo antes de arrancar (Crucial para Cloudflare)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
    bootstrapApp();
}

function initAuth() {
    const savedUser = localStorage.getItem('pro_user');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
        enterApp();
    }
}

function setupEventListeners() {
    // Auth Toggles
    // Auth Toggles (Login <-> Registro)
    if (dom.showRegBtn) {
        dom.showRegBtn.onclick = (e) => { 
            e.preventDefault(); 
            if (dom.loginFields) dom.loginFields.classList.add('hidden'); 
            if (dom.regFields) dom.regFields.classList.remove('hidden'); 
        };
    }
    if (dom.showLogin) {
        dom.showLogin.onclick = (e) => { 
            e.preventDefault(); 
            if (dom.regFields) dom.regFields.classList.add('hidden'); 
            if (dom.loginFields) dom.loginFields.classList.remove('hidden'); 
        };
    }
    
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
            const periodInput = document.querySelector('input[name="delete-period"]:checked');
            const period = periodInput ? periodInput.value : 'today';
            executeSelectiveDelete(period);
            dom.historyDeleteModal.classList.remove('active');
        };
    }

    // Manual Add Lead Modal
    if (dom.closeAddModal) dom.closeAddModal.onclick = () => dom.addLeadModal.classList.remove('active');
    if (dom.confirmAddLeadBtn) dom.confirmAddLeadBtn.onclick = saveNewManualLead;
    if (dom.deleteLeadBtn) dom.deleteLeadBtn.onclick = deleteCurrentLead;

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
    if (dom.forceSyncBtn) dom.forceSyncBtn.onclick = forceSync;
    if (dom.downloadCloudBtn) dom.downloadCloudBtn.onclick = downloadFromSupabase;

    // Search & Discovery
    if (dom.searchCityBtn) {
        dom.searchCityBtn.onclick = async () => {
            const query = prompt("Introduce la ciudad, calle o código postal para buscar prospectos:");
            if (!query) return;
            dom.searchCityBtn.innerHTML = '<i class="lucide-loader spin"></i> <span class="hide-mobile">BUSCANDO...</span>';
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    onLocalSuccess(parseFloat(data[0].lat), parseFloat(data[0].lon), true);
                } else {
                    alert("No se encontró esa ubicación.");
                }
            } catch (e) {
                alert("Error de red al buscar ubicación.");
            }
            dom.searchCityBtn.innerHTML = '<i data-lucide="search"></i> <span class="hide-mobile">IR A CALLE</span>';
            if (window.lucide) lucide.createIcons();
        };
    }
    if (dom.geoBtn) dom.geoBtn.onclick = () => handleGeolocation(true); // Actualizar zona (Buscar)
    if (dom.resetMapBtn) dom.resetMapBtn.onclick = () => handleGeolocation(false); // Solo Centrado GPS
    if (dom.forceGpsBtn) dom.forceGpsBtn.onclick = () => handleGeolocation(true); // Buscar Aquí
    
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
            state.addMode = false; // Desactivar modo añadir si activamos manual
            dom.toggleManualBtn.classList.toggle('active', state.manualMode);
            if (dom.addManualLeadBtn) dom.addManualLeadBtn.classList.remove('active');
            dom.toggleManualBtn.querySelector('span').innerText = state.manualMode ? 'MANUAL: ON' : 'MANUAL: OFF';
            console.log("Modo Manual:", state.manualMode);
        };
    }

    if (dom.addManualLeadBtn) {
        dom.addManualLeadBtn.onclick = () => {
            state.addMode = !state.addMode;
            state.manualMode = false; // Desactivar manual si activamos añadir
            dom.addManualLeadBtn.classList.toggle('active', state.addMode);
            if (dom.toggleManualBtn) dom.toggleManualBtn.classList.remove('active');
            
            const btnSpan = dom.addManualLeadBtn.querySelector('span');
            if (state.addMode) {
                btnSpan.innerText = 'TOCA EL MAPA...';
            } else {
                btnSpan.innerText = 'AÑADIR LOCAL';
            }
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
    if (!dom.logName || !dom.logPass) return console.error("Elementos de login no encontrados");
    const email = dom.logName.value.trim();
    if (!email || !validateEmail(email)) return alert("Por favor, introduce un email corporativo válido.");
    state.user = { name: email, pass: dom.logPass.value };
    localStorage.setItem('pro_user', JSON.stringify(state.user));
    enterApp();
}

function handleRegister() {
    if (!dom.regName || !dom.regPass) return console.error("Elementos de registro no encontrados");
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

// --- Utilidades ---
function formatDate(dateStr) {
    if (!dateStr || dateStr === '--') return dateStr;
    // Si es formato ISO (YYYY-MM-DD), convertir a europeo (DD/MM/YYYY)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }
    return dateStr;
}

// --- Lógica de Mapa ---
function initMap() {
    try {
        if (!document.getElementById('map')) return console.warn("Elemento #map no encontrado");
        
        map = L.map('map', { 
            zoomControl: true,
            scrollWheelZoom: true,
            touchZoom: true
        }).setView([40.4167, -3.7033], 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '©OpenStreetMap'
        }).addTo(map);
        
        markersLayer = L.layerGroup().addTo(map);

        map.on('click', (e) => {
            if (state.addMode) {
                openAddLeadModal(e.latlng.lat, e.latlng.lng);
                state.addMode = false;
                if (dom.addManualLeadBtn) {
                    dom.addManualLeadBtn.classList.remove('active');
                    dom.addManualLeadBtn.querySelector('span').innerText = 'AÑADIR LOCAL';
                }
            } else if (state.manualMode) {
                onLocalSuccess(e.latlng.lat, e.latlng.lng, true);
            }
        });
    } catch (err) {
        console.error("Error inicializando mapa Leaflet:", err);
    }
}

function handleGeolocation(triggerSearch = true) {
    if (dom.geoBtn) dom.geoBtn.innerHTML = '<i class="lucide-refresh-cw spin"></i> BUSCANDO...';
    
    const options = { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 };
    
    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        onLocalSuccess(latitude, longitude, triggerSearch);
        
        if (dom.geoBtn) {
            dom.geoBtn.innerHTML = '<i data-lucide="crosshair"></i> CENTRADO';
            lucide.createIcons();
            setTimeout(() => { 
                dom.geoBtn.innerHTML = '<i data-lucide="crosshair"></i> CENTRADO GPS'; 
                lucide.createIcons(); 
            }, 3000);
        }
    }, (err) => {
        console.error("Error GPS:", err);
        // Si falla, al menos intentamos centrar donde estuviéramos
        if (state.lastSearchCenter) {
            map.setView([state.lastSearchCenter.lat, state.lastSearchCenter.lng], 15);
        }
    }, options);
}

async function onLocalSuccess(lat, lng, triggerSearch = true) {
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

    map.setView([lat, lng], map.getZoom() || 15);
    if (triggerSearch) generateLeads(lat, lng, r);
}

// --- Motor de Búsqueda (Overpass Fix) ---
async function generateLeads(lat, lng, r) {
    if (dom.emptyExploration) dom.emptyExploration.style.display = 'none';
    
    // UI de Escaneo Activo
    dom.leadsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 5rem 2rem;">
            <div class="radar-container">
                <div class="radar-line" style="animation-duration: 1.5s;"></div>
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
            date: new Date().toISOString().split('T')[0], // Formato ISO YYYY-MM-DD
            lastUpdate: '--'
        };
    });

    // Fusionar con existentes (evitar duplicados)
    newLeads.forEach(nl => {
        if (!state.leads.find(l => l.id === nl.id)) {
            state.leads.unshift(nl);
        }
    });

    saveToDisk();
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
        if (filters.search && !l.name.toLowerCase().includes(filters.search) && !l.address.toLowerCase().includes(filters.search) && !(l.cif && l.cif.toLowerCase().includes(filters.search))) return false;
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
            // El botón 'DETALLES' ya maneja la apertura, evitamos clics accidentales al hacer scroll
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
                ${lead.status === 'descartado' ? 'DESCARTADO' : lead.status.toUpperCase()}
            </span>
        </div>
        
        <div class="interest-progress-wrapper">
            <div class="interest-label-flex">
                <span style="color: ${interestColor}">${lead.aiAnalysis ? 'POTENCIAL IA' : 'POTENCIAL COMERCIAL'}</span>
                <span>${lead.aiAnalysis ? lead.aiAnalysis.probability : lead.interest}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${lead.aiAnalysis ? lead.aiAnalysis.probability : lead.interest}%; background: ${interestColor}; box-shadow: 0 0 10px ${interestColor}44;"></div>
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
        let prob = l.aiAnalysis ? l.aiAnalysis.probability : l.interest;
        let color = '#FED000'; // Gold standard
        if (prob >= 90) color = '#ef4444'; // Muy alto potencial (Rojo Prosegur)
        else if (prob >= 75) color = '#f97316'; // Alto potencial (Naranja)
        if (l.status === 'seguimiento') color = '#fce7d2';
        if (l.status === 'firmado') color = '#22c55e';
        if (l.status === 'descartado') color = '#64748b'; // Gris para descartados
        
        const pin = L.circleMarker([l.lat, l.lng], {
            radius: prob >= 80 ? 10 : 7, // Más grandes los de alto interés
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        });
        
        pin.bindPopup(`
            <div style="text-align: center; color: var(--bg-dark);">
                <b style="font-size: 1rem;">${l.name}</b><br>
                <span style="font-size: 0.8rem;">Potencial: ${prob}% ${l.aiAnalysis ? '(IA)' : ''}</span><br>
                <button onclick="window.openLeadByID('${l.id}')" style="margin-top: 10px; background: #003399; color: white; border: none; padding: 8px 12px; border-radius: 2rem; font-weight: 800; cursor: pointer; width: 100%;">GESTIONAR</button>
            </div>
        `);
        markersLayer.addLayer(pin);
    });
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
    if(dom.modalSector) dom.modalSector.value = lead.sector || "";
    if(dom.modalCreated) dom.modalCreated.innerText = formatDate(lead.date);
    dom.modalUpdated.innerText = lead.lastUpdate;
    
    // Color según interés en el modal
    let interestColor = '#94a3b8';
    if (lead.interest >= 70) interestColor = '#22c55e';
    if (lead.interest >= 85) interestColor = 'var(--primary-yellow)';
    if (lead.interest >= 95) interestColor = '#ef4444';
    
    dom.modalInterestBadge.innerText = lead.interest + '%';
    dom.modalInterestBadge.style.color = interestColor;
    dom.modalInterestBadge.style.borderColor = interestColor + '44'; // 44 es opacidad en hex

    dom.modalStatusBadge.innerText = lead.status === 'descartado' ? 'DESCARTADO' : lead.status.toUpperCase();
    dom.modalStatusBadge.className = 'badge-status-premium ' + lead.status;
    dom.modalMapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + lead.address)}`;
    
    updateStatusUI();
    
    // --- Lógica de IA para el lead abierto ---
    if (dom.aiContextPanel) {
        dom.aiContextPanel.classList.remove('hidden');
        dom.aiCurrentLeadName.innerText = lead.name;
    }
    
    // Resetear estados de análisis en el modal
    dom.aiAnalysisEmpty.classList.remove('hidden');
    dom.aiAnalysisLoading.classList.add('hidden');
    dom.aiAnalysisResult.classList.add('hidden');
    dom.aiProbBadgeContainer.innerHTML = "";

    // Si ya tiene análisis IA, renderizarlo
    if (lead.aiAnalysis) {
        dom.aiAnalysisEmpty.classList.add('hidden');
        renderAIAnalysisResult(lead.aiAnalysis, "Probabilidad Inteligente");
        
        // Badge de probabilidad IA
        dom.aiProbBadgeContainer.innerHTML = `
            <span class="badge-interest-premium" style="color: var(--primary-yellow); border-color: var(--primary-yellow);">
                ${lead.aiAnalysis.probability}% <small>IA</small>
            </span>
        `;
    } else if (lead.interest) {
        // Retrocompatibilidad: Mostrar interés antiguo si no hay IA
        dom.aiProbBadgeContainer.innerHTML = `
            <span class="badge-interest-premium" style="color: #94a3b8; border-color: rgba(255,255,255,0.1);">
                ${lead.interest}% <small>EST.</small>
            </span>
        `;
    }

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
    if(dom.modalSector) currentLead.sector = dom.modalSector.value;
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
    dom.statHigh.innerText = state.leads.filter(l => {
        let prob = l.aiAnalysis ? l.aiAnalysis.probability : l.interest;
        return prob >= 80;
    }).length;
    dom.statFirmado.innerText = state.leads.filter(l => l.status === 'firmado').length;
    dom.statSeguimiento.innerText = state.leads.filter(l => l.status === 'seguimiento').length;
    dom.statVisita.innerText = state.leads.filter(l => l.status === 'visita').length;
    dom.statDescartado.innerText = state.leads.filter(l => l.status === 'descartado').length;
}

function saveToDisk() {
    try {
        localStorage.setItem('pro_leads_' + state.user.name, JSON.stringify(state.leads));
        console.log("Datos guardados correctamente: " + state.leads.length + " prospectos.");
        
        // Actualizar indicador a PENDIENTE (Recordatorio para el usuario)
        if (dom.cloudSyncStatus) {
            dom.cloudSyncStatus.classList.remove('success', 'syncing', 'error');
            dom.cloudSyncStatus.classList.add('pending');
            dom.cloudSyncStatus.innerHTML = '<i data-lucide="cloud-off"></i> <span class="hide-mobile">PENDIENTE</span>';
            if (window.lucide) lucide.createIcons();
        }
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
        "Última Interacción": l.lastUpdate !== '--' ? l.lastUpdate : formatDate(l.date)
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

// Manejo de Filtros
function handleFiltering() { renderLeads(); }

// --- MÓDULO ASISTENTE IA (MODO MOCK) ---

window.fillAIInput = (type) => {
    const templates = {
        objecion: "Ayúdame a responder esta objeción del cliente: [escribe aquí la objeción]. Dame una respuesta natural, breve y comercial.",
        sector: "Dame un argumento comercial breve y potente para vender una alarma a este tipo de negocio: [tipo de negocio]. Incluye una frase de entrada y una pregunta de avance.",
        competencia: "El cliente me compara con otra empresa de alarmas o dice que ya trabaja con la competencia. Dame una respuesta ética, profesional y orientada al valor, sin atacar a nadie.",
        normativa: "Explícame de forma sencilla y prudente este tema de seguridad privada o alarmas: [tema]. No des asesoramiento jurídico definitivo.",
        whatsapp: "Redáctame un WhatsApp breve y profesional para este cliente/lead: [contexto]. Objetivo del mensaje: [primer contacto / seguimiento / retomar conversación / cierre].",
        cierre: "Dame una frase de cierre natural para avanzar con un cliente que está interesado pero duda."
    };
    if (dom.aiUserInput && templates[type]) {
        dom.aiUserInput.value = templates[type];
        dom.aiUserInput.focus();
    }
};

window.sendAIMessage = async () => {
    const text = dom.aiUserInput.value.trim();
    if (!text) return;

    // Renderizar mensaje del usuario
    renderAIMessage('user', text);
    dom.aiUserInput.value = "";

    // Preparar payload
    const payload = {
        mode: "general_chat",
        text: text,
        lead: currentLead ? {
            name: currentLead.name,
            sector: currentLead.sector,
            address: currentLead.address,
            alarm: currentLead.alarm,
            services: currentLead.services
        } : null
    };

    // Respuesta del asistente (con loader simulado)
    const response = await callAssistantAPI(payload);
    if (response.ok) {
        renderAIMessage('assistant', response.answer);
    } else {
        renderAIMessage('assistant', "Lo siento, ha ocurrido un error al procesar tu solicitud.");
    }
};

function renderAIMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ${role}`;
    msgDiv.innerText = text;
    dom.aiChatHistory.appendChild(msgDiv);
    dom.aiChatHistory.scrollTop = dom.aiChatHistory.scrollHeight;
}

async function callAssistantAPI(payload) {
    if (AI_MOCK_MODE) {
        // Simular latencia de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (payload.mode === "general_chat") {
            return {
                ok: true,
                mode: "general_chat",
                answer: "Respuesta simulada del Asistente IA. He recibido tu mensaje: \"" + payload.text + "\". En la fase real, aquí aparecerá la ayuda comercial basada en inteligencia artificial."
            };
        }

        if (payload.mode === "lead_analysis") {
            return {
                ok: true,
                mode: "lead_analysis",
                analysis: {
                    summary: "Lead con posible oportunidad comercial según tipo de negocio y datos disponibles.",
                    opportunityType: "Media-Alta",
                    confidence: "Media",
                    positivePoints: [
                        "Negocio físico con exposición al público.",
                        "Puede tener bienes o stock protegible.",
                        "Existe oportunidad de revisar su sistema actual."
                    ],
                    risks: [
                        "Puede tener proveedor actual.",
                        "Puede ser sensible al precio."
                    ],
                    likelyObjection: "Ya tengo alarma o ahora no quiero más gastos.",
                    recommendedOpening: "Estoy visitando negocios de la zona para revisar si tienen bien cubierta la protección fuera de horario.",
                    usefulQuestions: [
                        "¿Actualmente tiene alarma conectada o solo cámaras?",
                        "¿Quién recibe el aviso si ocurre algo fuera de horario?",
                        "¿Está satisfecho con el sistema actual?"
                    ],
                    nextAction: "Visita presencial breve con pregunta inicial sobre su sistema actual.",
                    note: "Este análisis es orientativo y se basa en los datos disponibles."
                }
            };
        }

        if (payload.mode === "lead_probability") {
            return {
                ok: true,
                mode: "lead_probability",
                analysis: {
                    probability: 68,
                    level: "Medio-Alto",
                    confidence: "Media",
                    summary: "Lead con potencial razonable por tipo de negocio y exposición comercial.",
                    positiveReasons: [
                        "Negocio físico con exposición al público.",
                        "Puede tener stock, caja o elementos protegibles.",
                        "La protección fuera de horario puede ser un argumento relevante."
                    ],
                    risks: [
                        "Puede tener proveedor actual.",
                        "No hay datos suficientes sobre interés real.",
                        "Puede ser sensible al precio."
                    ],
                    likelyObjection: "Ya tengo alarma o ahora no quiero más gastos.",
                    recommendedArgument: "Enfocar la conversación en tranquilidad, protección fuera de horario y respuesta rápida.",
                    nextAction: "Visita presencial breve preguntando por su sistema actual.",
                    note: "Esta probabilidad es una estimación comercial orientativa basada en los datos disponibles, no una garantía de conversión."
                }
            };
        }
    }

    // Futura llamada real a Supabase Edge Function
    try {
        const response = await fetch(AI_CONFIG.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

window.analyzeAILead = async () => {
    if (!currentLead) return alert("Primero selecciona un lead para poder analizarlo.");
    
    // UI Loading
    dom.aiAnalysisEmpty.classList.add('hidden');
    dom.aiAnalysisLoading.classList.remove('hidden');
    dom.aiAnalysisResult.classList.add('hidden');

    const response = await callAssistantAPI({ mode: "lead_analysis", lead: currentLead });
    
    dom.aiAnalysisLoading.classList.add('hidden');
    if (response.ok) {
        renderAIAnalysisResult(response.analysis, "Análisis de Lead");
    } else {
        alert("Error al analizar el lead.");
        dom.aiAnalysisEmpty.classList.remove('hidden');
    }
};

window.calculateAIProbability = async () => {
    if (!currentLead) return alert("Primero selecciona un lead para calcular su probabilidad.");
    
    // UI Loading
    dom.aiAnalysisEmpty.classList.add('hidden');
    dom.aiAnalysisLoading.classList.remove('hidden');
    dom.aiAnalysisResult.classList.add('hidden');

    const response = await callAssistantAPI({ mode: "lead_probability", lead: currentLead });
    
    dom.aiAnalysisLoading.classList.add('hidden');
    if (response.ok) {
        // Guardar resultado de forma compacta en el lead
        currentLead.aiAnalysis = {
            probability: response.analysis.probability,
            level: response.analysis.level,
            confidence: response.analysis.confidence,
            summary: response.analysis.summary,
            updatedAt: new Date().toISOString()
        };
        
        // Actualizar en el array global
        const idx = state.leads.findIndex(l => l.id === currentLead.id);
        if (idx !== -1) state.leads[idx] = { ...currentLead };
        
        saveToDisk();
        renderAIAnalysisResult(response.analysis, "Probabilidad Inteligente");
    } else {
        alert("Error al calcular la probabilidad.");
        dom.aiAnalysisEmpty.classList.remove('hidden');
    }
};

function renderAIAnalysisResult(analysis, title) {
    dom.aiAnalysisResult.classList.remove('hidden');
    
    const isProb = analysis.probability !== undefined;
    
    let html = `
        <div class="ai-prob-card">
            <div class="ai-prob-header">
                ${isProb ? `
                    <div class="ai-prob-circle">
                        <span class="ai-prob-val">${analysis.probability}</span>
                        <span class="ai-prob-unit">%</span>
                    </div>
                ` : `
                    <div class="ai-prob-circle" style="border-color: #3b82f6;">
                        <i data-lucide="brain-circuit" style="width: 24px; color: #3b82f6;"></i>
                    </div>
                `}
                <div class="ai-prob-meta">
                    <span class="ai-prob-level">${isProb ? analysis.level : analysis.opportunityType}</span>
                    <span class="ai-prob-confidence">Confianza ${analysis.confidence}</span>
                </div>
            </div>

            <div class="ai-summary-text">
                ${analysis.summary}
            </div>

            <div class="ai-analysis-grid">
                <div class="ai-analysis-box">
                    <h5><i data-lucide="check-circle" style="width: 12px;"></i> PUNTOS POSITIVOS</h5>
                    <ul class="ai-analysis-list">
                        ${(analysis.positivePoints || analysis.positiveReasons).map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
                <div class="ai-analysis-box">
                    <h5><i data-lucide="alert-triangle" style="width: 12px; color: var(--danger);"></i> RIESGOS</h5>
                    <ul class="ai-analysis-list risks">
                        ${analysis.risks.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div style="margin-bottom: 1rem;">
                <h5 style="font-size: 0.65rem; font-weight: 900; color: var(--primary-yellow); margin-bottom: 0.4rem; text-transform: uppercase;">OBJECIÓN PROBABLE</h5>
                <p style="font-size: 0.75rem; font-style: italic; opacity: 0.8; background: rgba(0,0,0,0.2); padding: 0.8rem; border-radius: 0.8rem; border-left: 3px solid var(--danger);">
                    "${analysis.likelyObjection}"
                </p>
            </div>

            <div class="ai-action-box">
                <p style="font-size: 0.65rem; font-weight: 900; opacity: 0.6; margin-bottom: 4px; text-transform: uppercase; color: #22c55e;">SIGUIENTE ACCIÓN RECOMENDADA</p>
                <p>${analysis.nextAction || analysis.recommendedArgument}</p>
            </div>
            
            <p style="font-size: 0.6rem; color: var(--text-muted); text-align: center; margin-top: 1.5rem;">
                * ${analysis.note}
            </p>
        </div>
    `;
    
    dom.aiAnalysisResult.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

// --- Gestión de Prospectos Manuales ---


function openAddLeadModal(lat, lng) {
    state.tempManualCoords = { lat, lng };
    if (dom.addLeadName) dom.addLeadName.value = "";
    if (dom.addLeadSector) dom.addLeadSector.value = "";
    if (dom.addLeadModal) dom.addLeadModal.classList.add('active');
    setTimeout(() => dom.addLeadName && dom.addLeadName.focus(), 300);
}

function saveNewManualLead() {
    const name = dom.addLeadName.value.trim();
    const sector = dom.addLeadSector.value.trim() || "Comercial";
    
    if (!name) return alert("Por favor, introduce el nombre del negocio.");
    if (!state.tempManualCoords) return;

    const { lat, lng } = state.tempManualCoords;
    
    const newLead = {
        id: 'manual_' + Date.now(),
        name,
        sector,
        address: "Añadido Manual",
        phone: "No disponible",
        email: "No disponible",
        cif: "Pendiente",
        cp: "",
        city: "",
        contactName: "",
        rrss: "",
        alarm: "NINGUNA",
        interest: 50,
        status: 'visita',
        lat,
        lng,
        date: new Date().toISOString().split('T')[0], // Formato ISO
        lastUpdate: new Date().toLocaleString()
    };
    
    state.leads.unshift(newLead);
    saveToDisk();
    renderLeads();
    renderMapPins();
    updateStats();
    
    dom.addLeadModal.classList.remove('active');
    
    // Abrir automáticamente la ficha para completar datos
    setTimeout(() => openLead(newLead), 500);
}

function deleteCurrentLead() {
    if (!currentLead) return;
    if (!confirm("¿Estás seguro de que quieres eliminar este prospecto permanentemente? Esta acción no se puede deshacer.")) return;
    
    state.leads = state.leads.filter(l => l.id !== currentLead.id);
    saveToDisk();
    renderLeads();
    renderMapPins();
    updateStats();
    dom.modal.classList.remove('active');
}

// --- Integración Supabase (Offline-First Backup) ---
async function syncToSupabase(isManual = false) {
    if (!sb || !state.user || state.leads.length === 0) {
        if (isManual) alert("No hay datos para sincronizar o Supabase no está configurado.");
        
        // Si no hay configuración, mostrar un estado de "aviso" en el icono
        if (!sb && dom.cloudSyncStatus) {
            dom.cloudSyncStatus.innerHTML = '<i data-lucide="cloud-off"></i> <span class="hide-mobile">NO CONFIG</span>';
            if (window.lucide) lucide.createIcons();
        }
        return;
    }
    
    // UI Feedback Start
    if (dom.cloudSyncStatus) {
        dom.cloudSyncStatus.classList.add('syncing');
        dom.cloudSyncStatus.classList.remove('success', 'error');
        dom.cloudSyncStatus.innerHTML = '<i class="lucide-refresh-cw spin"></i> <span class="hide-mobile">SYNC...</span>';
    }
    if (isManual && dom.forceSyncBtn) {
        dom.forceSyncBtn.innerHTML = '<i class="lucide-loader spin"></i> SINCRONIZANDO...';
        dom.forceSyncBtn.disabled = true;
    }
    
    try {
        const leadsToUpsert = state.leads.map(l => ({
            id: l.id,
            name: l.name,
            address: l.address,
            sector: l.sector,
            status: l.status,
            interest: l.interest,
            cif: l.cif || '',
            cp: l.cp || '',
            city: l.city || '',
            contact_name: l.contactName || '',
            phone: l.phone || '',
            email: l.email || '',
            rrss: l.rrss || '',
            alarm: l.alarm || '',
            services: l.services || '',
            lat: l.lat || null,
            lng: l.lng || null,
            date: l.date,
            last_update: l.lastUpdate || null,
            user_id: state.user.name 
        }));

        const { error } = await sb
            .from('leads')
            .upsert(leadsToUpsert, { onConflict: 'id' });

        if (error) throw error;

        // Success
        console.log("Backup en Supabase completado con éxito.");
        if (dom.cloudSyncStatus) {
            dom.cloudSyncStatus.classList.remove('syncing', 'pending', 'error');
            dom.cloudSyncStatus.classList.add('success');
            dom.cloudSyncStatus.innerHTML = '<i data-lucide="cloud-check"></i> <span class="hide-mobile">SINCRO</span>';
            if (window.lucide) lucide.createIcons();
        }
        
        const now = new Date().toLocaleString();
        if (dom.lastSyncText) dom.lastSyncText.innerText = "Última sincronización: " + now;
        
        if (isManual) alert("¡Sincronización exitosa con Supabase!");

    } catch (e) {
        console.error("Error sincronizando con Supabase:", e);
        if (dom.cloudSyncStatus) {
            dom.cloudSyncStatus.classList.remove('syncing');
            dom.cloudSyncStatus.classList.add('error');
            dom.cloudSyncStatus.innerHTML = '<i data-lucide="cloud-off"></i> <span class="hide-mobile">ERROR</span>';
            if (window.lucide) lucide.createIcons();
        }
        if (isManual) alert("Error al sincronizar: " + (e.message || "Problema de conexión"));
    } finally {
        if (isManual && dom.forceSyncBtn) {
            dom.forceSyncBtn.innerHTML = '<i data-lucide="refresh-cw"></i> SINCRONIZAR AHORA CON SUPABASE';
            dom.forceSyncBtn.disabled = false;
            if (window.lucide) lucide.createIcons();
        }
    }
}

async function forceSync() {
    await syncToSupabase(true);
}

async function downloadFromSupabase() {
    if (!sb || !state.user) return alert("Supabase no está configurado o no has iniciado sesión.");
    
    if (dom.downloadCloudBtn) {
        dom.downloadCloudBtn.innerHTML = '<i class="lucide-loader spin"></i> DESCARGANDO...';
        dom.downloadCloudBtn.disabled = true;
    }

    try {
        console.log("Descargando datos para el usuario:", state.user.name);
        const { data, error } = await sb
            .from('leads')
            .select('*')
            .eq('user_id', state.user.name);

        if (error) throw error;

        if (!data || data.length === 0) {
            alert("No se han encontrado datos en la nube para este usuario.");
        } else {
            if (confirm(`Se han encontrado ${data.length} registros en la nube. ¿Deseas importarlos? (Se fusionarán con tus datos actuales evitando duplicados)`)) {
                
                data.forEach(cloudLead => {
                    // Mapear de vuelta los campos si es necesario (ej: contact_name -> contactName)
                    const mappedLead = {
                        id: cloudLead.id,
                        name: cloudLead.name,
                        address: cloudLead.address,
                        sector: cloudLead.sector,
                        status: cloudLead.status,
                        interest: cloudLead.interest,
                        cif: cloudLead.cif,
                        cp: cloudLead.cp,
                        city: cloudLead.city,
                        contactName: cloudLead.contact_name,
                        phone: cloudLead.phone,
                        email: cloudLead.email,
                        rrss: cloudLead.rrss,
                        alarm: cloudLead.alarm,
                        services: cloudLead.services,
                        lat: cloudLead.lat,
                        lng: cloudLead.lng,
                        date: cloudLead.date,
                        lastUpdate: cloudLead.last_update
                    };

                    if (!state.leads.find(l => l.id === mappedLead.id)) {
                        state.leads.push(mappedLead);
                    }
                });

                saveToDisk();
                renderLeads();
                renderMapPins();
                updateStats();
                alert("¡Datos recuperados con éxito!");
            }
        }
    } catch (e) {
        console.error("Error descargando de Supabase:", e);
        alert("Error al descargar datos: " + (e.message || "Problema de conexión"));
    } finally {
        if (dom.downloadCloudBtn) {
            dom.downloadCloudBtn.innerHTML = '<i data-lucide="cloud-download"></i> DESCARGAR DATOS DE LA NUBE';
            dom.downloadCloudBtn.disabled = false;
            if (window.lucide) lucide.createIcons();
        }
    }
}
