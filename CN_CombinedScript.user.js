// ==UserScript==
// @name         Cloudy Nights Collapsible Sidebar, Permalinks & Theme Toggle
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Optimized: Material Dark/Light/Dim themes with toggle, collapsible sidebar/header, permalinks. No FOUC.
// @author       chvvkumar
// @match        *://www.cloudynights.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const THEME_KEY = 'cnThemeMode';
    // Added three new material themes for variation
    const THEMES = ['light', 'dark', 'dim', 'material-dark', 'material-emerald', 'material-redline', 'material-purple'];
    
    // Apply theme immediately to prevent FOUC
    const applyInitialTheme = () => {
        const theme = localStorage.getItem(THEME_KEY);
        // Default to 'material-dark' for a strong material starting point
        const initial = THEMES.includes(theme) ? theme : 'material-dark'; 
        document.documentElement.setAttribute('data-theme', initial);
        
        const applyToBody = () => document.body?.setAttribute('data-theme', initial);
        document.body ? applyToBody() : new MutationObserver(() => {
            if (document.body) {
                applyToBody();
                observer.disconnect();
            }
        }).observe(document.documentElement, { childList: true });
    };
    
    applyInitialTheme();

    // Consolidated CSS with optimized theme variables
    GM_addStyle(`
/* Theme Variables */
:root {
    --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
}

/* Original Dark */
[data-theme="dark"] {
    --primary-bg: #1E1E1E; --secondary-bg: #2B2B2B; --tertiary-bg: #2B2B2B;
    --accent-primary: #D9E2E8; --accent-secondary: #B5C8D3;
    --text-primary: #FFFFFF; --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #444444; --border-light: #555555;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.4); --shadow-md: 0 3px 6px rgba(0,0,0,0.6);
    --success: #10b981; --warning: #f59e0b; --error: #ef4444;
}

/* Original Material Dark (Deep Blue) */
[data-theme="material-dark"] {
    --primary-bg: #121212; --secondary-bg: #1E1E1E; --tertiary-bg: #2C2C2C;
    --accent-primary: #3D5AFE; --accent-secondary: #8C9EFF;
    --text-primary: #FFFFFF; --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #383838; --border-light: #505050;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #66BB6A; --warning: #FFCA28; --error: #EF5350;
}

/* NEW: Material Dark (Emerald) - Tech/Nature feel with green accent */
[data-theme="material-emerald"] {
    --primary-bg: #101515;
    --secondary-bg: #1A2424;
    --tertiary-bg: #283434;
    --accent-primary: #00C853; /* Vibrant Emerald Green */
    --accent-secondary: #69F0AE;
    --text-primary: #E0E0E0;
    --text-secondary: #A0A0A0;
    --text-muted: #787878;
    --border-color: #303A3A;
    --border-light: #485A5A;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5);
    --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #64DD17;
    --warning: #FFC400;
    --error: #FF5252;
}

/* NEW: Material Dark (Redline) - High contrast and energetic with red accent */
[data-theme="material-redline"] {
    --primary-bg: #121212;
    --secondary-bg: #1E1E1E;
    --tertiary-bg: #2C2C2C;
    --accent-primary: #FF3D00; /* Deep Saturated Red/Orange */
    --accent-secondary: #FF8A65;
    --text-primary: #FFFFFF;
    --text-secondary: #B0B0B0;
    --text-muted: #888888;
    --border-color: #383838;
    --border-light: #505050;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5);
    --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #66BB6A;
    --warning: #FFCA28;
    --error: #EF5350;
}

/* NEW: Material Dark (Midnight Purple) - Softer contrast with a purple accent */
[data-theme="material-purple"] {
    --primary-bg: #1C1B22; /* Softer, purplish dark background */
    --secondary-bg: #25242D;
    --tertiary-bg: #32313A;
    --accent-primary: #7C4DFF; /* Mid-tone Deep Purple */
    --accent-secondary: #B388FF;
    --text-primary: #FFFFFF;
    --text-secondary: #C0C0C0;
    --text-muted: #A0A0A0;
    --border-color: #403E4D;
    --border-light: #555364;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
    --shadow-md: 0 3px 6px rgba(0,0,0,0.5);
    --success: #66BB6A;
    --warning: #FFCA28;
    --error: #EF5350;
}

/* Original Light */
[data-theme="light"] {
    --primary-bg: #FFFFFF; --secondary-bg: #E8EDF1; --tertiary-bg: #E8EDF1;
    --accent-primary: #1976D2; --accent-secondary: #0D47A1;
    --text-primary: #263238; --text-secondary: #546E7A; --text-muted: #90A4AE;
    --border-color: #CFD8DC; --border-light: #B0BEC5;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.1); --shadow-md: 0 4px 8px rgba(0,0,0,0.1);
    --success: #4CAF50; --warning: #FF9800; --error: #F44336;
}

/* Original Dim */
[data-theme="dim"] {
    --primary-bg: #2E353B; --secondary-bg: #39444D; --tertiary-bg: #39444D;
    --accent-primary: #3399CC; --accent-secondary: #1A79B3;
    --text-primary: #B5C8D3; --text-secondary: #909BA6; --text-muted: #71806A;
    --border-color: #4A5568; --border-light: #6A6D88;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.3); --shadow-md: 0 3px 6px rgba(0,0,0,0.5);
    --success: #68D391; --warning: #F6AD55; --error: #FC8181;
}

/* Base Styles */
html[data-theme], body[data-theme] {
    background-color: var(--primary-bg) !important;
    color: var(--text-primary) !important;
    font-family: 'Roboto','Helvetica Neue',Arial,sans-serif !important;
    transition: background-color 0.3s, color 0.3s;
}

body[data-theme] .ipsApp, #ipsLayout_contentArea, #ipsLayout_contentWrapper, 
#ipsLayout_mainArea, .ipsLayout_mainArea > section {
    background-color: transparent !important;
}

/* Headers & Navigation */
body[data-theme] #ipsLayout_header {
    background: var(--secondary-bg) !important;
    border-bottom: 1px solid var(--border-color) !important;
    box-shadow: var(--shadow-sm) !important;
}

body[data-theme] .ipsNavBar_active {
    border-bottom: 2px solid var(--accent-primary) !important;
}

[data-theme="dark"] .ipsNavBar_active { background-color: rgba(217,226,232,0.15) !important; }
[data-theme="material-dark"] .ipsNavBar_active { background-color: rgba(61,90,254,0.15) !important; }
[data-theme="material-emerald"] .ipsNavBar_active { background-color: rgba(0,200,83,0.15) !important; }
[data-theme="material-redline"] .ipsNavBar_active { background-color: rgba(255,61,0,0.15) !important; }
[data-theme="material-purple"] .ipsNavBar_active { background-color: rgba(124,77,255,0.15) !important; }
[data-theme="dim"] .ipsNavBar_active { background-color: rgba(51,153,204,0.15) !important; }
[data-theme="light"] .ipsNavBar_active { background-color: rgba(25,118,210,0.1) !important; }

/* Containers */
body[data-theme] .ipsBox {
    background-color: var(--secondary-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: var(--radius-md) !important;
    box-shadow: var(--shadow-sm) !important;
    transition: all 0.3s ease !important;
}

body[data-theme] .ipsBox:hover {
    box-shadow: var(--shadow-md) !important;
    border-color: var(--accent-primary) !important;
}

body[data-theme] .ipsDataItem, body[data-theme] .cTopic, 
body[data-theme] .cPost, body[data-theme] .cForumRow {
    background-color: var(--tertiary-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: var(--radius-md) !important;
}

body[data-theme] .ipsWidget {
    background-color: var(--secondary-bg) !important;
    border: 1px solid var(--border-color) !important;
}

body[data-theme] .ipsWidget_title {
    background: var(--tertiary-bg) !important;
    color: var(--text-primary) !important;
    border-bottom: 2px solid var(--accent-primary) !important;
}

/* Typography */
body[data-theme] h1, body[data-theme] h2, body[data-theme] h3, 
body[data-theme] h4, body[data-theme] h5, body[data-theme] h6,
body[data-theme] .ipsType_sectionTitle, body[data-theme] .ipsType_pageTitle {
    color: var(--text-primary) !important; font-weight: 700 !important;
}

body[data-theme] .ipsDataItem_title {
    color: var(--text-primary) !important;
    font-weight: 600 !important;
    transition: color 0.2s ease !important;
}

body[data-theme] .ipsDataItem_title:hover { color: var(--accent-primary) !important; }

/* Links */
body[data-theme] a {
    color: var(--accent-primary) !important;
    text-decoration: none !important;
    transition: all 0.2s ease !important;
}

body[data-theme] a:hover {
    color: var(--accent-secondary) !important;
    text-decoration: underline !important;
}

/* Buttons - All buttons use neutral style like theme toggle */
body[data-theme] .ipsButton,
body[data-theme] .ipsButton_primary,
body[data-theme] .ipsButton_important,
body[data-theme] .ipsButton_alternate,
body[data-theme] .ipsButton_light,
body[data-theme] .ipsButton_medium,
body[data-theme] .ipsButton_small,
body[data-theme] .ipsButton_verySmall {
    padding: 6px 12px !important;
    line-height: 1.2 !important;
    min-height: auto !important;
    border-radius: var(--radius-sm) !important;
    box-shadow: var(--shadow-sm) !important;
    background-color: var(--tertiary-bg) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-light) !important;
}

body[data-theme] .ipsButton:hover,
body[data-theme] .ipsButton_primary:hover,
body[data-theme] .ipsButton_important:hover,
body[data-theme] .ipsButton_alternate:hover,
body[data-theme] .ipsButton_light:hover {
    background-color: var(--secondary-bg) !important;
    border-color: var(--accent-primary) !important;
    transform: translateY(-1px) !important;
    box-shadow: var(--shadow-md) !important;
}

/* Forms */
body[data-theme] input[type="text"], body[data-theme] input[type="email"],
body[data-theme] input[type="password"], body[data-theme] input[type="search"],
body[data-theme] textarea, body[data-theme] select {
    background-color: var(--secondary-bg) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: var(--radius-sm) !important;
}

body[data-theme] input:focus, body[data-theme] textarea:focus, body[data-theme] select:focus {
    border-color: var(--accent-primary) !important;
    outline: none !important;
}

/* Code */
[data-theme="dark"] pre, [data-theme="dark"] code, [data-theme="dim"] pre, 
[data-theme="dim"] code, [data-theme*="material-"] pre, [data-theme*="material-"] code {
    background-color: #0d1117 !important;
    border: 1px solid var(--border-color) !important;
    color: #79c0ff !important;
}

[data-theme="light"] pre, [data-theme="light"] code {
    background-color: #F8F8F8 !important;
    border: 1px solid var(--border-color) !important;
    color: #333 !important;
}

/* Blockquotes */
body[data-theme] blockquote {
    background-color: var(--tertiary-bg) !important;
    border-left: 4px solid var(--accent-primary) !important;
    color: var(--text-secondary) !important;
}

/* Permalinks */
body[data-theme] .cn-post-id-display { color: var(--text-muted) !important; }
body[data-theme] .cn-permalink-icon { color: var(--text-secondary) !important; }
body[data-theme] .cn-permalink-container:hover .cn-post-id-display,
body[data-theme] .cn-permalink-container:hover .cn-permalink-icon {
    color: var(--accent-primary) !important;
}

#cn-permalink-notification {
    position: fixed; top: 10px; right: 10px;
    padding: 10px 15px; border-radius: 4px;
    z-index: 10000; opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    transform: translateX(100%);
}

#cn-permalink-notification.show { opacity: 1; transform: translateX(0); }

/* Collapsible Header */
.ipsPageHeader.ipsBox.ipsResponsive_pull { cursor: pointer; }
.cn-collapsed-header-content {
    max-height: 0 !important; overflow: hidden !important;
    opacity: 0 !important; margin: 0 !important; padding: 0 !important;
    border: none !important;
    transition: max-height 0.4s ease, opacity 0.3s ease !important;
}

/* Sidebar Collapse */
#ipsLayout_sidebar {
    width: 300px; min-width: 300px;
    transition: all 0.3s ease-in-out;
}

.cn-sidebar-collapsed #ipsLayout_sidebar {
    width: 0 !important; min-width: 0 !important;
    margin: 0 !important; padding: 0 !important;
    overflow: hidden; border: none !important;
}

.cn-sidebar-collapsed #ipsLayout_sidebar > * { display: none !important; }

.cn-sidebar-collapsed #ipsLayout_mainArea {
    width: 100% !important; max-width: 100% !important;
    flex-basis: 100% !important;
}
    `);

    // Theme Configuration
    const themeConfig = {
        light: { icon: 'fa-sun-o', text: 'Light Mode' },
        dark: { icon: 'fa-moon-o', text: 'Dark Mode' },
        dim: { icon: 'fa-adjust', text: 'Dim Mode' },
        'material-dark': { icon: 'fa-paint-brush', text: 'Material Blue' }, // Renamed for clarity
        'material-emerald': { icon: 'fa-leaf', text: 'Material Emerald' }, // New
        'material-redline': { icon: 'fa-fire', text: 'Material Redline' },   // New
        'material-purple': { icon: 'fa-magic', text: 'Material Purple' }   // New
    };

    // Utility Functions
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);
    
    const showMessage = (msg) => {
        let el = $('#cn-permalink-notification') || Object.assign(document.createElement('div'), {
            id: 'cn-permalink-notification',
            className: 'cn-permalink-success'
        });
        if (!el.parentNode) document.body.appendChild(el);
        el.textContent = msg;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 2500);
    };

    const copyText = (text) => {
        (navigator.clipboard?.writeText(text) || Promise.reject())
            .then(() => showMessage("Permalink copied!"))
            .catch(() => {
                const ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    showMessage("Permalink copied!");
                } catch {
                    showMessage("Failed to copy.");
                }
                document.body.removeChild(ta);
            });
    };

    // Theme Toggle
    const setupThemeToggle = (list) => {
        let theme = localStorage.getItem(THEME_KEY) || 'material-dark'; // Changed default to material-dark
        const li = document.createElement('li');
        li.id = 'cn-theme-toggle-li';
        
        const updateUI = (t) => {
            const cfg = themeConfig[t];
            icon.className = `fa ${cfg.icon}`;
            span.textContent = ` ${cfg.text}`;
            btn.title = `Toggle Theme: ${cfg.text}`;
        };
        
        const apply = (t) => {
            document.documentElement.setAttribute('data-theme', t);
            document.body.setAttribute('data-theme', t);
            localStorage.setItem(THEME_KEY, t);
            updateUI(t);
        };
        
        const cfg = themeConfig[theme];
        li.innerHTML = `<button class="ipsButton ipsButton_light ipsButton_medium" type="button" title="Toggle Theme: ${cfg.text}">
            <i class="fa ${cfg.icon}"></i>
            <span class="ipsResponsive_hidePhone"> ${cfg.text}</span>
        </button>`;
        
        list.prepend(li);
        const btn = $('button', li);
        const icon = $('i', li);
        const span = $('span', li);
        
        btn.onclick = () => {
            const currentTheme = document.body.getAttribute('data-theme') || 'material-dark';
            const idx = THEMES.indexOf(currentTheme);
            apply(THEMES[(idx + 1) % THEMES.length]);
        };
        
        apply(theme);
    };

    // Permalinks
    const addPermalinks = () => {
        $$('div[data-commentid]:not([data-permalink-injected])').forEach(wrap => {
            const id = wrap.getAttribute('data-commentid');
            const tools = $('.ipsComment_tools', wrap);
            
            if (id && tools) {
                const link = `${window.location.href.split('#')[0]}#findComment-${id}`;
                const li = document.createElement('li');
                li.innerHTML = `<a href="${link}" title="Copy Permalink (Post ID ${id})" class="cn-permalink-container">
                    <span class="cn-post-id-display">#${id}</span>
                    <span class="cn-permalink-icon"><i class="fa fa-link"></i></span>
                </a>`;
                
                $('a', li).onclick = (e) => {
                    e.preventDefault();
                    copyText(link);
                };
                
                tools.prepend(li);
                wrap.setAttribute('data-permalink-injected', 'true');
            }
        });
    };

    // Collapsible Header
    const setupHeader = () => {
        const header = $('.ipsPageHeader.ipsBox.ipsResponsive_pull');
        if (!header) return;
        
        const toolbar = $('ul.ipsToolList', header);
        const elements = Array.from(header.children).filter(c => 
            c !== toolbar && !c.querySelector('h1')
        );
        
        if (!elements.length) return;
        
        const KEY = 'cnMainHeaderCollapsed';
        let collapsed = localStorage.getItem(KEY) === 'true';
        
        const toggle = (state) => {
            elements.forEach(el => el.classList.toggle('cn-collapsed-header-content', state));
            localStorage.setItem(KEY, state);
        };
        
        toggle(collapsed);
        
        header.onclick = (e) => {
            if (e.target.closest('a, button')) return;
            const state = elements.some(el => el.classList.contains('cn-collapsed-header-content'));
            toggle(!state);
        };
    };

    // Collapsible Sidebar
    const setupSidebar = () => {
        const sidebar = $('#ipsLayout_sidebar');
        const list = $('.ipsToolList_horizontal') || $('.ipsPageHeader + .ipsClearfix .ipsToolList');
        const content = $('#ipsLayout_contentArea');
        
        if (!sidebar || !list || !content) return;
        
        setupThemeToggle(list);
        
        const KEY = 'cnSidebarCollapsed';
        let collapsed = localStorage.getItem(KEY) === 'true';
        
        const li = document.createElement('li');
        li.id = 'cn-sidebar-toggle-li';
        li.innerHTML = `<button class="ipsButton ipsButton_important ipsButton_medium" type="button" title="Toggle Sidebar">
            <i class="fa ${collapsed ? 'fa-chevron-left' : 'fa-chevron-right'}"></i>
            <span class="ipsResponsive_hidePhone"> ${collapsed ? 'Expand' : 'Collapse'} Sidebar</span>
        </button>`;
        
        const themeBtn = $('#cn-theme-toggle-li', list);
        themeBtn ? list.insertBefore(li, themeBtn.nextSibling) : list.prepend(li);
        
        const btn = $('button', li);
        const icon = $('i', li);
        const span = $('span', li);
        
        const toggle = (state) => {
            content.classList.toggle('cn-sidebar-collapsed', state);
            icon.className = `fa ${state ? 'fa-chevron-left' : 'fa-chevron-right'}`;
            span.textContent = ` ${state ? 'Expand' : 'Collapse'} Sidebar`;
            localStorage.setItem(KEY, state);
        };
        
        toggle(collapsed);
        btn.onclick = () => toggle(!content.classList.contains('cn-sidebar-collapsed'));
    };

    // Initialize
    const init = () => {
        addPermalinks();
        setupHeader();
        setupSidebar();
        
        const observer = new MutationObserver(addPermalinks);
        const target = $('#ipsLayout_mainArea') || $('#ipsLayout_contentArea') || document.body;
        observer.observe(target, { childList: true, subtree: true });
    };

    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', init)
        : init();

})();
