const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const styleMap = {
    'margin-bottom: 0.5rem;': 'u-mb-05',
    'margin-bottom: 0.8rem;': 'u-mb-05',
    'margin-bottom: 1.5rem;': 'u-mb-15',
    'margin-bottom: 1.2rem;': 'u-mb-15',
    'margin-bottom: 1rem;': 'u-mb-1',
    'margin-bottom: 2rem;': 'u-mb-2',
    'margin-top: 0.5rem;': 'u-mt-05',
    'margin-top: 0.2rem;': 'u-mt-05',
    'margin-top: 1rem;': 'u-mt-1',
    'margin-top: 1.5rem;': 'u-mt-15',
    'margin-top: 2rem;': 'u-mt-2',
    'margin-top: 2.5rem;': 'u-mt-2',
    'margin-top: 3rem;': 'u-mt-2',
    'font-size: 0.8rem;': 'u-font-small',
    'font-size: 0.9rem;': 'u-font-medium',
    'font-size: 0.6rem;': 'u-font-tiny',
    'font-size: 0.65rem;': 'u-font-tiny',
    'font-size: 0.7rem;': 'u-font-tiny',
    'font-size: 0.75rem;': 'u-font-tiny',
    'font-size: 1rem;': 'u-font-medium',
    'font-size: 1.2rem;': 'u-font-large',
    'font-size: 1.5rem;': 'u-font-large',
    'font-size: 2.5rem;': 'u-font-giant',
    'width: 100%;': 'u-w-full',
    'text-align: center;': 'u-text-center',
    'text-align: left;': 'u-text-left',
    'display: flex; gap: 0.5rem;': 'u-flex-center u-gap-05',
    'display: flex; align-items: center; gap: 0.5rem;': 'u-flex-center u-gap-05',
    'opacity: 0.5;': 'u-opacity-05',
    'opacity: 0.6;': 'u-opacity-06',
    'opacity: 0.4;': 'u-opacity-05',
    'opacity: 0.8;': 'u-opacity-08',
    'opacity: 0.3;': 'u-opacity-05',
    'font-weight: 800;': 'u-bold',
    'font-weight: 900;': 'u-bold',
    'font-weight: 700;': 'u-bold',
    'font-weight: 600;': 'u-bold',
    'letter-spacing: 1px;': 'u-tracking-wide',
    'letter-spacing: 2px;': 'u-tracking-wider',
    'display: none;': 'u-hidden',
    'width: 14px;': 'u-icon-14',
    'width: 12px;': 'u-icon-12',
    'width: 18px;': 'u-icon-18',
    'height: 12px;': 'u-icon-12',
    'color: var(--primary-yellow);': 'u-color-yellow',
    'color: var(--danger);': 'u-color-danger',
    'color: var(--success);': 'u-color-success',
    'color: var(--text-muted);': 'u-color-muted',
    'color: #60a5fa;': 'u-color-blue',
    'color: #fb923c;': 'u-text-orange',
    'color: white;': 'u-color-white',
    'text-decoration: none;': 'u-no-decoration',
    'border: none;': 'u-border-none',
    'background: none;': 'u-bg-none',
    'background: var(--bg-dark);': 'u-bg-dark',
    'background: var(--danger);': 'u-color-danger',
    'cursor: pointer;': 'u-cursor-pointer',
    'padding: 1rem;': 'u-p-1',
    'padding: 1.2rem;': 'u-p-12',
    'padding: 2rem;': 'u-p-2',
    'border-radius: 1rem;': 'u-rounded-1',
    'border-radius: 1.5rem;': 'u-rounded-15',
    'border-radius: 2rem;': 'u-rounded-2',
    'line-height: 1.6;': 'u-lh-16',
    'line-height: 1.4;': 'u-lh-14',
    'text-transform: uppercase;': 'u-text-uppercase',
    'display: flex; flex-direction: column; gap: 1.5rem;': 'u-flex-column u-gap-15',
    'display: flex; flex-direction: column; gap: 1rem;': 'u-flex-column u-gap-1',
    'display: flex; flex-direction: column; gap: 0.8rem;': 'u-flex-column u-gap-1',
    'display: flex; flex-direction: column; gap: 0.5rem;': 'u-flex-column u-gap-05',
    'display: flex; flex-direction: column; gap: 0.4rem;': 'u-flex-column u-gap-05',
    'display: block;': 'u-block',
    'position: relative;': 'u-relative',
    'position: static;': 'u-static'
};

const complexMap = [
    { from: 'style="top: 20%; left: 30%; animation-delay: 0.5s;"', to: 'class="map-dot-1"' },
    { from: 'style="top: 40%; left: 80%; animation-delay: 2.1s;"', to: 'class="map-dot-2"' },
    { from: 'style="top: 60%; left: 70%; animation-delay: 1.2s;"', to: 'class="map-dot-3"' },
    { from: 'style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem;"', to: 'class="modal-header-flex"' },
    { from: 'style="font-size: 1.6rem; width: 80%;"', to: 'class="modal-title-input-fix"' },
    { from: 'style="position: static; font-size: 1rem;"', to: 'class="stats-badge-static"' },
    { from: 'style="background: #4285F4; color: white;"', to: 'class="u-bg-google"' },
    { from: 'style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);"', to: 'class="u-bg-red-dim"' },
    { from: 'style="background: rgba(34, 197, 94, 0.1); color: #22c55e; border-color: rgba(34, 197, 94, 0.2);"', to: 'class="u-bg-green-dim"' },
    { from: 'style="background: rgba(255,255,255,0.02); padding: 1.5rem;"', to: 'class="u-bg-glass-card"' },
    { from: 'style="background: rgba(255,255,255,0.03); border: 1px solid var(--border);"', to: 'class="u-bg-glass-card-border"' },
    { from: 'style="background: rgba(255,255,255,0.05); padding: 0.8rem; border: 1px solid var(--border);"', to: 'class="u-bg-glass-button"' },
    { from: 'style="height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden;"', to: 'class="u-avatar-wrap"' },
    { from: 'style="height: 100%; object-fit: cover;"', to: 'class="u-img-cover"' },
    { from: 'style="position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.2);"', to: 'class="u-backdrop-dim"' },
    { from: 'style="max-width: 200px;"', to: 'class="u-max-w-200"' },
    { from: 'style="max-width: 300px; margin: 1rem auto;"', to: 'class="u-max-w-300"' },
    { from: 'style="margin: 0.5rem 0; opacity: 0.1;"', to: 'class="u-opacity-05" style="margin: 0.5rem 0;"' }
];

content = content.replace(/(<[a-z0-9-]+[^>]*?)\s+style="([^"]+)"([^>]*?>)/gi, (match, prefix, styles, suffix) => {
    let newClasses = [];
    let remainingStyles = [];
    
    styles.split(';').map(s => s.trim()).filter(s => s).forEach(s => {
        const fullStyle = s + ';';
        if (styleMap[fullStyle]) {
            newClasses.push(styleMap[fullStyle]);
        } else {
            remainingStyles.push(s);
        }
    });
    
    let result = prefix;
    if (newClasses.length > 0) {
        if (result.includes(' class="')) {
            result = result.replace(' class="', ` class="${newClasses.join(' ')} `);
        } else {
            result += ` class="${newClasses.join(' ')}"`;
        }
    }
    
    if (remainingStyles.length > 0) {
        result += ` style="${remainingStyles.join('; ')};"`;
    }
    
    result += suffix;
    return result;
});

complexMap.forEach(r => {
    content = content.split(r.from).join(r.to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Limpieza masiva TOTAL completada.');
