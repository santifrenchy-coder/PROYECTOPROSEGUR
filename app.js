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

// --- Configuración Supabase ---
const SUPABASE_URL = 'https://iwxxixyjaxenojckohml.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eHhpeHlqYXhlbm9qY2tvaG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjEyMjMsImV4cCI6MjA5MjkzNzIyM30.NO3dG4HALVF81bXZoGRsiDxbwuYzi53pjNyGt4O85lA';
let sb = null;

// --- Configuración IA ---
const AI_MOCK_MODE = false;
const AI_ENDPOINT = `${SUPABASE_URL}/functions/v1/prosegur-ai-agent`;

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
        showReg: document.getElementById('show-reg-btn'),
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
        statusFilter: document.getElementById('status-filter'),
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

        // AI Assistant
        aiChatLog: document.getElementById('ai-chat-log'),
        aiInput: document.getElementById('ai-input'),
        aiSendBtn: document.getElementById('ai-send-btn'),
        aiChips: document.querySelectorAll('.ai-chip-btn'),
        toggleChipsBtn: document.getElementById('toggle-chips-btn'),
        chipsContent: document.getElementById('chips-content'),
        chipsChevron: document.getElementById('chips-chevron'),
        aiMicBtn: document.getElementById('ai-mic-btn')
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
        initVoiceRecognition();
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

    // AI Assistant Events
    if (dom.toggleChipsBtn) {
        dom.toggleChipsBtn.onclick = () => {
            if (dom.chipsContent) {
                const isHidden = dom.chipsContent.classList.toggle('hidden');
                dom.toggleChipsBtn.classList.toggle('expanded', !isHidden);
            }
        };
    }

    if (dom.aiSendBtn) {
        dom.aiSendBtn.onclick = () => handleAIQuery(dom.aiInput.value);
    }
    if (dom.aiInput) {
        dom.aiInput.onkeypress = (e) => {
            if (e.key === 'Enter') handleAIQuery(dom.aiInput.value);
        };
    }
    if (dom.aiChips) {
        dom.aiChips.forEach(chip => {
            chip.onclick = () => {
                const query = chip.dataset.query;
                let text = "";
                switch(query) {
                    case 'objeciones': text = "Dime cómo rebatir las objeciones más comunes."; break;
                    case 'sector': text = "Dame argumentos de venta por sector."; break;
                    case 'normativa': text = "Explícame la normativa de seguridad privada."; break;
                    case 'competencia': text = "Comparativa contra la competencia."; break;
                    case 'whatsapp': text = "Escribe un mensaje de WhatsApp para un cliente."; break;
                    case 'cierre': text = "Enséñame técnicas de cierre comercial."; break;
                }
                handleAIQuery(text);
            };
        });
    }

    // Tabs
    if (dom.tabBtns) {
        dom.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = btn.getAttribute('data-tab');
                
                // Desactivar todo
                dom.tabBtns.forEach(b => b.classList.remove('active'));
                dom.tabPanes.forEach(p => p.classList.remove('active'));
                
                // Activar actual
                btn.classList.add('active');
                const target = document.getElementById(tabId + '-tab');
                if (target) {
                    target.classList.add('active');
                    if (tabId === 'map-history' && map) {
                        setTimeout(() => map.invalidateSize(), 150);
                    }
                }
                window.scrollTo(0,0);
            });
        });
    }

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
            if (dom.dropdownBackdrop) {
                if (dom.userDropdown && dom.userDropdown.classList.contains('active')) {
                    dom.dropdownBackdrop.classList.remove('hidden');
                } else {
                    dom.dropdownBackdrop.classList.add('hidden');
                }
            }
        };
    }
    
    if (dom.dropdownBackdrop) {
        dom.dropdownBackdrop.onclick = () => {
            if (dom.userDropdown) dom.userDropdown.classList.remove('active');
            dom.dropdownBackdrop.classList.add('hidden');
        };
    }

    if (dom.logoutBtn) dom.logoutBtn.onclick = handleLogout;
    
    if (dom.openConfig) {
        dom.openConfig.onclick = () => {
            if (dom.configModal) dom.configModal.classList.add('active');
            if (dom.userPhone) dom.userPhone.value = state.config.phone || '';
            if (dom.userEmailDisplay) dom.userEmailDisplay.value = state.config.email || state.user?.name || '';
            if (dom.airBase) dom.airBase.value = state.config.base || '';
            if (dom.airToken) dom.airToken.value = state.config.token || '';
            if (dom.userDropdown) dom.userDropdown.classList.remove('active');
            if (dom.dropdownBackdrop) dom.dropdownBackdrop.classList.add('hidden');
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
    if (dom.forceGpsBtn) dom.forceGpsBtn.onclick = () => {
        if (!map) return;
        const center = map.getCenter();
        onLocalSuccess(center.lat, center.lng, true);
    }; // Buscar Aquí (Usa el centro del mapa)
    
    if (dom.radiusSelect) dom.radiusSelect.onchange = handleFiltering;
    if (dom.sectorFilter) dom.sectorFilter.onchange = handleFiltering;
    if (dom.searchInput) dom.searchInput.oninput = handleFiltering;
    if (dom.statusFilter) dom.statusFilter.onchange = handleFiltering;
    if (dom.historyStatusFilter) dom.historyStatusFilter.onchange = renderLeads;

    // Map Extra Controls
    if (dom.toggleManualBtn) {
        dom.toggleManualBtn.onclick = () => {
            state.manualMode = !state.manualMode;
            state.addMode = false; // Desactivar modo añadir si activamos manual
            dom.toggleManualBtn.classList.toggle('active', state.manualMode);
            if (dom.addManualLeadBtn) dom.addManualLeadBtn.classList.remove('active');
            dom.toggleManualBtn.querySelector('span').innerText = state.manualMode ? 'MANUAL: ON' : 'MANUAL: OFF';
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
    dom.dashboardScreen.classList.remove('hidden');
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
    if (dom.emptyExploration) dom.emptyExploration.classList.add('hidden');
    
    // UI de Escaneo Activo
    dom.leadsContainer.innerHTML = `
        <div class="u-grid-full u-text-center u-p-5-2">
            <div class="radar-container">
                <div class="radar-line u-anim-1-5"></div>
                <div class="radar-circle u-anim-delay-1"></div>
                <div class="radar-point u-point-flicker"></div>
            </div>
            <h3 class="btn-pulse u-color-yellow u-ls-3">ESCANEANDO ZONA...</h3>
            <p id="scan-status" class="u-mt-1 u-fs-0-8 u-fw-800 u-color-muted">Sincronizando con satélites...</p>
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
          node["shop"](around:${r},${lat},${lng});
          way["shop"](around:${r},${lat},${lng});
          node["office"](around:${r},${lat},${lng});
          way["office"](around:${r},${lat},${lng});
          node["craft"](around:${r},${lat},${lng});
          way["craft"](around:${r},${lat},${lng});
          node["amenity"~"restaurant|cafe|fast_food|bar|pub|pharmacy|clinic|hospital|dentist|veterinary|bank|atm|car_rental|car_wash|fuel"](around:${r},${lat},${lng});
          way["amenity"~"restaurant|cafe|fast_food|bar|pub|pharmacy|clinic|hospital|dentist|veterinary|bank|atm|car_rental|car_wash|fuel"](around:${r},${lat},${lng});
        );
        out center body;`;

    let data = null;
    for (let url of mirrors) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos máximo por mirror
            const response = await fetch(url, {
                method: 'POST',
                body: "data=" + encodeURIComponent(query),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (response.ok) {
                data = await response.json();
                break;
            }
        } catch(e) { console.warn("Mirror fallido o lento: " + url); }
    }

    if (!data || !data.elements || data.elements.length === 0) {
        dom.leadsContainer.innerHTML = `
            <div class="u-grid-full u-text-center u-p-4-2">
                <div class="radar-container u-w-100-h-100 u-mb-1-5 u-opacity-05">
                    <div class="radar-line"></div>
                </div>
                <h3 class="u-color-danger">SIN RESULTADOS</h3>
                <p class="u-opacity-06">No hemos detectado negocios en esta zona exacta. Prueba a aumentar el radio o moverte.</p>
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
        
        // Lógica de interés refinada (simulando análisis previo IA)
        let interest = 50; 
        const highRiskSectors = ['banco', 'joyería', 'estanco', 'farmacia', 'clínica', 'restaurante'];
        if (highRiskSectors.some(s => sector.toLowerCase().includes(s))) interest += 20;
        if (tags.phone) interest += 5;
        if (tags.website) interest += 5;
        if (tags.opening_hours) interest += 5;
        interest += Math.floor(Math.random() * 10); // Variabilidad
        if (interest > 98) interest = 98; // Dejar margen para el análisis manual 100%

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
        status: dom.statusFilter ? dom.statusFilter.value : 'all'
    };

    const filtered = state.leads.filter(l => {
        if (filters.sector !== 'all' && !l.sector.toLowerCase().includes(filters.sector.toLowerCase())) return false;
        if (filters.search && !l.name.toLowerCase().includes(filters.search) && !l.address.toLowerCase().includes(filters.search) && !(l.cif && l.cif.toLowerCase().includes(filters.search))) return false;
        if (filters.status !== 'all' && l.status !== filters.status) return false;
        
        return true;
    });

    // Ordenar por fecha (descendente) de forma robusta
    filtered.sort((a, b) => {
        const da = a.date.includes('/') ? new Date(a.date.split('/').reverse().join('-')) : new Date(a.date);
        const db = b.date.includes('/') ? new Date(b.date.split('/').reverse().join('-')) : new Date(b.date);
        return db - da;
    });

    dom.leadsContainer.innerHTML = '';
    dom.leadsGridHistory.innerHTML = '';

    if (filtered.length > 0) {
        if (dom.emptyExploration) dom.emptyExploration.classList.add('hidden');
        filtered.forEach(lead => {
            const card = createLeadCard(lead);
            // El botón 'DETALLES' ya maneja la apertura, evitamos clics accidentales al hacer scroll
            dom.leadsContainer.appendChild(card);
        });
    } else {
        if (dom.emptyExploration) dom.emptyExploration.classList.remove('hidden');
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
    
    // Clase según interés
    let intClass = 'muted';
    if (lead.interest >= 70) intClass = 'green';
    if (lead.interest >= 85) intClass = 'gold';
    if (lead.interest >= 95) intClass = 'red';

    div.innerHTML = `
        <div class="card-header-flex">
            <div class="lead-info-top">
                <h3 class="lead-name-premium u-mb-0-2">${lead.name}</h3>
                <p class="lead-sector-premium u-fs-0-65 u-color-muted u-fw-800">
                    <i data-lucide="briefcase" class="u-icon-12"></i> ${lead.sector.toUpperCase()}
                </p>
            </div>
            <span class="badge-status-premium ${lead.status}">
                ${lead.status === 'descartado' ? 'DESCARTADO' : lead.status.toUpperCase()}
            </span>
        </div>
        
        <div class="interest-progress-wrapper">
            <div class="interest-label-flex">
                <span class="interest-level-${intClass}">POTENCIAL COMERCIAL</span>
                <span>${lead.interest}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill ${intClass}" style="width: ${lead.interest}%;"></div>
            </div>
        </div>
        
        <p class="lead-address-premium u-fs-0-75 u-color-muted u-mb-1-5 u-flex-center-gap-05">
            <i data-lucide="map-pin" class="u-icon-14"></i> ${lead.address}
        </p>
        
        <div class="card-actions-premium u-grid-2col-08">
            <button class="btn btn-outline u-fs-0-7 u-p-08" onclick="window.openLeadByID('${lead.id}')">
                <i data-lucide="info" class="u-icon-14"></i> DETALLES
            </button>
            <button class="btn btn-primary u-fs-0-7 u-p-08" onclick="window.analyzeLeadWithAI('${lead.id}')">
                <i data-lucide="bot" class="u-icon-14"></i> ANALIZAR IA
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
        let color = '#FED000'; // Visita (Yellow)
        if (l.status === 'seguimiento') color = '#f97316';
        else if (l.status === 'firmado') color = '#22c55e';
        else if (l.status === 'descartado') color = '#e2e8f0'; // Bright silver/white para que destaque
        
        const pin = L.circleMarker([l.lat, l.lng], {
            radius: l.interest >= 80 ? 10 : 7, // Tamaño indica interés
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        });
        
        pin.bindPopup(`
            <div class="u-text-center u-color-dark">
                <b class="u-fs-1">${l.name}</b><br>
                <span class="u-fs-0-8">Potencial: ${l.interest}%</span><br>
                <button onclick="window.openLeadByID('${l.id}')" class="u-mt-10px u-btn-google-maps">GESTIONAR</button>
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
    
    // Clase según interés en el modal
    let intClass = 'muted';
    if (lead.interest >= 70) intClass = 'green';
    if (lead.interest >= 85) intClass = 'gold';
    if (lead.interest >= 95) intClass = 'red';
    
    dom.modalInterestBadge.innerText = lead.interest + '%';
    dom.modalInterestBadge.className = 'u-static u-font-medium badge-interest interest-level-' + intClass;

    dom.modalStatusBadge.innerText = lead.status === 'descartado' ? 'DESCARTADO' : lead.status.toUpperCase();
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
    dom.statHigh.innerText = state.leads.filter(l => l.interest >= 80).length;
    dom.statFirmado.innerText = state.leads.filter(l => l.status === 'firmado').length;
    dom.statSeguimiento.innerText = state.leads.filter(l => l.status === 'seguimiento').length;
    dom.statVisita.innerText = state.leads.filter(l => l.status === 'visita').length;
    dom.statDescartado.innerText = state.leads.filter(l => l.status === 'descartado').length;
}

function saveToDisk() {
    if (!state.user || !state.user.name) return;
    try {
        localStorage.setItem('pro_leads_' + state.user.name, JSON.stringify(state.leads));
        
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

window.searchLeadWeb = function() {
    if (!currentLead) return;
    const location = currentLead.city || currentLead.address || "";
    const query = `${currentLead.name} ${location} contacto email instagram facebook`.trim();
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
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

// --- Lógica del Asistente IA ---

async function callAssistantAPI(payload) {
    if (AI_MOCK_MODE) {
        console.log("🤖 MOCK_MODE: Simulando llamada a la API con payload:", payload);
        return new Promise(resolve => {
            setTimeout(() => {
                let response = "";
                const q = payload.query ? payload.query.toLowerCase() : "";
                
                if (q.includes("objecion")) response = "Para la objeción 'Ya tengo alarma', recuerda destacar que Movistar Prosegur ofrece Triple Seguridad (Antihurto, Anti-Inhibición y Anti-Sabotaje) y que somos la única con la Red de Custodios propia.";
                else if (q.includes("sector")) response = "En el sector de hostelería, el punto clave es el control de empleados y la seguridad nocturna. Destaca nuestras cámaras inteligentes con analítica de vídeo.";
                else if (q.includes("normativa")) response = "La Ley de Seguridad Privada exige que cualquier sistema conectado a central deba ser instalado por una empresa homologada como Prosegur. Esto evita multas al propietario.";
                else if (q.includes("competencia")) response = "Contra Securitas, destaca que nosotros no cobramos por el mantenimiento de la batería y que nuestra respuesta de patrulla es un 30% más rápida en zonas urbanas.";
                else if (q.includes("whatsapp")) response = "Texto sugerido: 'Hola [Nombre], soy Santiago de Prosegur. He pasado por tu local y me gustaría comentarte un punto de mejora en seguridad que he detectado. ¿Te viene bien mañana a las 10:00?'";
                else if (q.includes("cierre")) response = "Usa el cierre de alternativa: '¿Prefieres que la instalación la hagamos el martes por la mañana o el miércoles por la tarde?'";
                else if (payload.action === 'analyze_lead') {
                    resolve({
                        probability: 85,
                        level: "Alto",
                        reasons: ["Ubicación en zona caliente", "Sin sistema visible", "Sector de alto riesgo"],
                        risks: ["Posible contrato previo no detectado"],
                        advice: "Céntrate en la protección de escaparates."
                    });
                    return;
                }
                else response = "Entiendo perfectamente. Mi recomendación es que enfoques la venta en el valor de la placa de Prosegur como elemento disuasorio número uno en España.";

                resolve({ response });
            }, 1500);
        });
    }

    try {
        // En producción, esto llamará a la Edge Function de Supabase
        const response = await fetch(AI_ENDPOINT, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (err) {
        console.error("Error AI API:", err);
        return { error: "No se pudo conectar con el asistente." };
    }
}

function addChatMessage(text, type) {
    if (!dom.aiChatLog) return;
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;
    msg.innerHTML = `<p>${text}</p>`;
    dom.aiChatLog.appendChild(msg);
    dom.aiChatLog.scrollTop = dom.aiChatLog.scrollHeight;
}

async function handleAIQuery(text) {
    if (!text.trim()) return;
    
    addChatMessage(text, 'user');
    dom.aiInput.value = "";
    
    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'chat-message ai thinking';
    thinkingMsg.innerHTML = '<p><i class="lucide-loader spin"></i> El agente está pensando...</p>';
    dom.aiChatLog.appendChild(thinkingMsg);
    if (window.lucide) lucide.createIcons();
    dom.aiChatLog.scrollTop = dom.aiChatLog.scrollHeight;

    const result = await callAssistantAPI({ query: text, action: 'chat' });
    
    thinkingMsg.remove();
    if (result.error) {
        addChatMessage("Lo siento, he tenido un problema al conectar. Prueba de nuevo en un momento.", 'ai');
    } else {
        addChatMessage(result.response || "No he podido procesar esa consulta.", 'ai');
    }
}

async function analyzeLeadWithAI(leadId) {
    const lead = state.leads.find(l => l.id === leadId);
    if (!lead) return;

    // Abrir pestaña IA
    const aiTabBtn = document.querySelector('[data-tab="ai-assistant"]');
    if (aiTabBtn) aiTabBtn.click();
    
    addChatMessage(`Analizando lead: **${lead.name}**...`, 'user');
    
    const result = await callAssistantAPI({ 
        action: 'analyze_lead',
        lead_data: {
            name: lead.name,
            sector: lead.sector,
            address: lead.address,
            alarm: lead.alarm,
            notes: lead.services
        }
    });

    if (result.probability) {
        lead.interest = result.probability;
        saveToDisk();
        renderLeads();
        renderMapPins(); // Actualizar pines en el mapa
        updateStats();
        
        let report = `
            <div class="ai-report-premium">
                <div class="report-header">
                    <span class="report-badge ${result.level.toLowerCase()}">Nivel: ${result.level}</span>
                    <span class="report-prob">${result.probability}% Probabilidad</span>
                </div>
                <div class="report-body">
                    <p><strong><i data-lucide="check-circle"></i> Puntos Fuertes:</strong> ${result.reasons.join(", ")}</p>
                    <p><strong><i data-lucide="info"></i> Táctica Recomendada:</strong> ${result.advice}</p>
                </div>
                <div class="report-footer">
                    <small>Ficha actualizada automáticamente</small>
                </div>
            </div>
        `;
        addChatMessage(report, 'ai');
        if (window.lucide) lucide.createIcons();
    } else {
        addChatMessage("No he podido realizar el análisis técnico de este lead. Revisa los datos (sector, notas...) e inténtalo de nuevo.", 'ai');
    }
}

window.analyzeLeadWithAI = analyzeLeadWithAI;

let speechRecognition = null;
let isListening = false;

function initVoiceRecognition() {
    if (!dom.aiMicBtn) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Web Speech API no está soportada en este navegador.");
        dom.aiMicBtn.title = "Dictado de voz no soportado en este navegador";
        dom.aiMicBtn.style.opacity = "0.3";
        dom.aiMicBtn.style.cursor = "not-allowed";
        dom.aiMicBtn.onclick = () => {
            alert("El dictado por voz no está soportado en este navegador. Te recomendamos usar Google Chrome o Safari.");
        };
        return;
    }
    
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = false; // Detener cuando el usuario deja de hablar
    speechRecognition.interimResults = false; // Solo resultados finales
    speechRecognition.lang = 'es-ES'; // Idioma español
    
    speechRecognition.onstart = () => {
        isListening = true;
        dom.aiMicBtn.classList.add('listening');
        if (dom.aiInput) dom.aiInput.placeholder = "Escuchando... Habla ahora";
    };
    
    speechRecognition.onend = () => {
        isListening = false;
        dom.aiMicBtn.classList.remove('listening');
        if (dom.aiInput) dom.aiInput.placeholder = "Pregunta algo al agente...";
    };
    
    speechRecognition.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        isListening = false;
        dom.aiMicBtn.classList.remove('listening');
        if (dom.aiInput) dom.aiInput.placeholder = "Pregunta algo al agente...";
        
        if (e.error === 'not-allowed') {
            alert("Permiso de micrófono denegado. Por favor, habilita el acceso al micrófono en los ajustes de tu navegador.");
        }
    };
    
    speechRecognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (dom.aiInput) {
            const currentText = dom.aiInput.value.trim();
            dom.aiInput.value = currentText ? `${currentText} ${transcript}` : transcript;
            dom.aiInput.focus();
        }
    };
    
    dom.aiMicBtn.onclick = () => {
        if (isListening) {
            speechRecognition.stop();
        } else {
            try {
                speechRecognition.start();
            } catch (err) {
                console.error("Error al iniciar reconocimiento:", err);
            }
        }
    };
}
