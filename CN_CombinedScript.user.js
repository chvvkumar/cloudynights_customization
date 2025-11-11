// ==UserScript==
// @name         Cloudy Nights Collapsible Sidebar, Permalinks & Theme Toggle (Minified)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Optimized: Dark/Light themes with a selector, collapsible sidebar/header, permalinks. No FOUC.
// @author       chvvkumar
// @match        *://www.cloudynights.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const THEME_KEY = 'cnThemeMode';
    // Organized theme list for clarity and FOUC prevention
    const THEMES = ['light', 'dark', 'material-gold', 'material-emerald', 'material-lime', 'material-redline', 'dark-teal', 'dark-orange', 'dark-pink', 'dark-sky', 'dark-red-astronomy'];

    // Theme config
    const T_CFG = {
        light: { i: 'fa-sun-o', t: 'Light Mode' }, dark: { i: 'fa-moon-o', t: 'Dark Slate' },
        'material-emerald': { i: 'fa-leaf', t: 'Material Emerald' },
        'material-redline': { i: 'fa-fire', t: 'Material Redline' }, 'dark-teal': { i: 'fa-tint', t: 'Dark Teal' },
        'dark-orange': { i: 'fa-flask', t: 'Dark Orange' }, 'dark-pink': { i: 'fa-heart', t: 'Dark Pink' },
        'dark-red-astronomy': { i: 'fa-globe', t: 'Astronomy' }, // Updated icon to fa-globe and name to 'Astronomy'
        'material-gold': { i: 'fa-trophy', t: 'Material Gold' },
        'dark-sky': { i: 'fa-star', t: 'Dark Sky' },
        'material-lime': { i: 'fa-bug', t: 'Material Lime' }
    };

    // --- FOUC Prevention: Apply Initial Theme ---
    const applyInitialTheme = () => {
        const theme = localStorage.getItem(THEME_KEY);
        // Fallback changed from 'material-dark' to 'material-gold'
        const initial = THEMES.includes(theme) ? theme : 'material-gold';
        document.documentElement.setAttribute('data-theme', initial);

        const applyToBody = () => document.body?.setAttribute('data-theme', initial);
        if (document.body) {
            applyToBody();
        } else {
            new MutationObserver((_, obs) => {
                if (document.body) {
                    applyToBody();
                    obs.disconnect();
                }
            }).observe(document.documentElement, { childList: true });
        }
    };
    applyInitialTheme();

    // Consolidated CSS
    GM_addStyle(`
:root { --radius-sm: 4px; --radius-md: 8px; }
/* Merged Theme Definitions - dark-sky moved to its own block below */
[data-theme="dark"], [data-theme="dark-teal"], [data-theme="dark-orange"], [data-theme="dark-pink"], [data-theme="material-lime"] {
    --primary-bg: #1E1E1E; --secondary-bg: #2B2B2B; --tertiary-bg: #2B2B2B;
    --text-primary: #FFFFFF; --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #444444; --border-light: #555555;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.4); --shadow-md: 0 3px 6px rgba(0,0,0,0.6);
    --success: #10b981; --warning: #f59e0b; --error: #ef4444;
}
[data-theme="dark-teal"] { --accent-primary: #00BCD4; --accent-secondary: #84FFFF; --accent-primary-rgb: 0, 188, 212; }
[data-theme="dark-orange"] { --accent-primary: #FF9800; --accent-secondary: #FFCC80; --accent-primary-rgb: 255, 152, 0; }
[data-theme="dark-pink"] { --accent-primary: #E91E63; --accent-secondary: #F48FB1; --accent-primary-rgb: 233, 30, 99; }
[data-theme="material-lime"] { --accent-primary: #AEEA00; --accent-secondary: #E6EE9C; --accent-primary-rgb: 174, 234, 0; }
[data-theme="dark"] { --accent-primary: #D9E2E8; --accent-secondary: #B5C8D3; --accent-primary-rgb: 217, 226, 232; }

/* --- DARK SKY: Deep background with Redline accent --- */
[data-theme="dark-sky"] {
    --primary-bg: #0A0A0A; --secondary-bg: #151515; --tertiary-bg: #151515;
    --accent-primary: #FF3D00; /* Redline Primary */
    --accent-secondary: #FF8A65; /* Redline Secondary */
    --accent-primary-rgb: 255, 61, 0; /* Redline RGB */
    --text-primary: #FFFFFF; --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #333333; --border-light: #444444;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #10b981; --warning: #f59e0b; --error: #ef4444;
}

[data-theme="dark-red-astronomy"] {
    --primary-bg: #000; --secondary-bg: #1A0000; --tertiary-bg: #1A0000;
    --accent-primary: #FF3333; --accent-secondary: #CC0000; --accent-primary-rgb: 255, 51, 51;
    --text-primary: #D44E4E; --text-secondary: #8A3333; --text-muted: #442222;
    --border-color: #330000; --border-light: #550000;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.6); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    color: var(--text-primary) !important;
}

/* Material Redline (Now defined separately from removed 'material-dark') */
[data-theme="material-redline"] {
    --primary-bg: #121212; --secondary-bg: #1E1E1E; --tertiary-bg: #2C2C2C;
    --text-primary: #FFFFFF; --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #383838; --border-light: #505050;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #66BB6A; --warning: #FFCA28; --error: #EF5350;
    --accent-primary: #FF3D00; --accent-secondary: #FF8A65; --accent-primary-rgb: 255, 61, 0;
}

[data-theme="material-emerald"] {
    --primary-bg: #101515; --secondary-bg: #1A2424; --tertiary-bg: #283434;
    --accent-primary: #00C853; --accent-secondary: #69F0AE; --accent-primary-rgb: 0, 200, 83;
    --text-primary: #E0E0E0; --text-secondary: #A0A0A0; --text-muted: #787878;
    --border-color: #303A3A; --border-light: #485A5A;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #64DD17; --warning: #FFC400; --error: #FF5252;
}

[data-theme="material-gold"] {
    --primary-bg: #181A1B; --secondary-bg: #222527; --tertiary-bg: #2C2F31;
    --accent-primary: #FFB300; --accent-secondary: #FFD740; --accent-primary-rgb: 255, 179, 0;
    --text-primary: #F0F0F0; --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #404040; --border-light: #606060;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #66BB6A; --warning: #FFCA28; --error: #EF5350;
}

[data-theme="light"] {
    --primary-bg: #FFFFFF; --secondary-bg: #E8EDF1; --tertiary-bg: #E8EDF1;
    --accent-primary: #1976D2; --accent-secondary: #0D47A1; --accent-primary-rgb: 25, 118, 210;
    --text-primary: #263238; --text-secondary: #546E7A; --text-muted: #90A4AE;
    --border-color: #CFD8DC; --border-light: #B0BEC5;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.1); --shadow-md: 0 4px 8px rgba(0,0,0,0.1);
    --success: #4CAF50; --warning: #FF9800; --error: #F44336;
}

/* Consolidated Base Styles */
html[data-theme], body[data-theme] {
    background-color: var(--primary-bg) !important; color: var(--text-primary) !important;
    font-family: 'Roboto','Helvetica Neue',Arial,sans-serif !important;
    transition: background-color 0.3s, color 0.3s;
}
body[data-theme] .ipsApp, #ipsLayout_contentArea, #ipsLayout_contentWrapper,
#ipsLayout_mainArea, .ipsLayout_mainArea > section { background-color: transparent !important; }

/* Consolidated Component Styles */
body[data-theme] #ipsLayout_header {
    background: var(--secondary-bg) !important; border-bottom: 1px solid var(--border-color) !important;
    box-shadow: var(--shadow-sm) !important;
}
body[data-theme] .ipsNavBar_primary, body[data-theme] .ipsButtonBar {
    background-color: var(--secondary-bg) !important; border-color: var(--border-color) !important;
}
body[data-theme] .ipsNavBar_active { border-bottom: 2px solid var(--accent-primary) !important; }
${THEMES.map(t => {
    // Generates active nav bar BG for each theme
    const map = {
        'dark': 'rgba(217,226,232,0.15)',
        'material-emerald': 'rgba(0,200,83,0.15)',
        'material-redline': 'rgba(255,61,0,0.15)',
        'dark-teal': 'rgba(0,188,212,0.15)',
        'dark-orange': 'rgba(255,152,0,0.15)',
        'dark-pink': 'rgba(233,30,99,0.15)',
        'dark-red-astronomy': 'rgba(255,51,51,0.2)',
        'material-gold': 'rgba(255,179,0,0.15)',
        'dark-sky': 'rgba(255, 61, 0, 0.15)',
        'material-lime': 'rgba(174, 234, 0, 0.15)',
        'light': 'rgba(25,118,210,0.1)'
    };
    return `[data-theme="${t}"] .ipsNavBar_active { background-color: ${map[t]} !important; }`;
}).join('\n')}

/* Boxes/Containers - Combined rules */
body[data-theme] .ipsBox {
    background-color: var(--secondary-bg) !important; border: 1px solid var(--border-color) !important;
    border-radius: var(--radius-md) !important; box-shadow: var(--shadow-sm) !important; transition: all 0.3s ease !important;
}
body[data-theme] .ipsBox:hover { box-shadow: var(--shadow-md) !important; border-color: var(--accent-primary) !important; }
body[data-theme] .ipsDataItem, body[data-theme] .cTopic, body[data-theme] .cPost, body[data-theme] .cForumRow {
    background-color: var(--tertiary-bg) !important; border: 1px solid var(--border-color) !important; border-radius: var(--radius-md) !important;
}
body[data-theme] .ipsWidget { background-color: var(--secondary-bg) !important; border: 1px solid var(--border-color) !important; }
body[data-theme] .ipsWidget_title { background: var(--tertiary-bg) !important; color: var(--text-primary) !important; border-bottom: 2px solid var(--accent-primary) !important; }

/* Typography/Links - Combined rules */
body[data-theme] h1, body[data-theme] h2, body[data-theme] h3, body[data-theme] h4, body[data-theme] h5, body[data-theme] h6,
body[data-theme] .ipsType_sectionTitle, body[data-theme] .ipsType_pageTitle, body[data-theme] .ipsDataItem_title {
    color: var(--text-primary) !important; font-weight: 700 !important;
}
body[data-theme] .ipsDataItem_title { font-weight: 600 !important; transition: color 0.2s ease !important; }

/* --- MODIFICATION 1: Remove underline on hover for all links and target buttons --- */
body[data-theme] .ipsDataItem_title:hover, body[data-theme] a {
    color: var(--accent-primary) !important; text-decoration: none !important; transition: all 0.2s ease !important;
}
body[data-theme] a:hover { color: var(--accent-secondary) !important; text-decoration: none !important; }
/* Ensure topic action buttons (Reply to this topic, Start new topic) also lose underline if they are simple <a> tags */
body[data-theme] .ipsActionBar_aux .ipsButton:hover,
body[data-theme] .ipsActionBar_aux .ipsButton a:hover {
    text-decoration: none !important;
}

/* Button Styles - Combined and simplified */
body[data-theme] .ipsButton, body[data-theme] .ipsButton_light, body[data-theme] .ipsButton_alternate,
body[data-theme] .ipsButton_primary, body[data-theme] .ipsButton_important {
    background-color: var(--tertiary-bg) !important; color: var(--text-primary) !important;
    border: 1px solid var(--border-light) !important; min-height: auto !important;
    padding: 6px 12px !important; line-height: 1.2 !important; box-shadow: var(--shadow-sm) !important;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s, transform 0.2s !important;
}
body[data-theme] .ipsButton:hover, body[data-theme] .ipsButton_light:hover, body[data-theme] .ipsButton_alternate:hover,
body[data-theme] .ipsButton_primary:hover, body[data-theme] .ipsButton_important:hover {
    background-color: var(--secondary-bg) !important; border-color: var(--accent-primary) !important;
    color: var(--accent-primary) !important; transform: translateY(-1px) !important; box-shadow: var(--shadow-md) !important;
}

/* Search Field Fixes - Consolidated rules */
#elSearch, #elSearch form, body[data-theme] .ipsSearch_focus { background-color: transparent !important; }
body[data-theme] .ipsSearch input[type="search"] {
    background-color: var(--secondary-bg) !important; color: var(--text-primary) !important;
    border: 1px solid var(--border-color) !important;
}
body[data-theme] .ipsSearch button.ipsButton, body[data-theme] .cSearchFilter__text {
    background-color: var(--secondary-bg) !important; color: var(--text-primary) !important;
    border-color: var(--border-color) !important; border-radius: var(--radius-sm) !important;
}

/* Astronomy Red Overrides - Simplified */
[data-theme="dark-red-astronomy"] {
    --link-color: var(--accent-primary) !important; --icon-color: var(--text-secondary) !important;
    --badge-bg: var(--secondary-bg) !important; --badge-color: var(--text-primary) !important;
    .ipsDataItem_status { filter: sepia(100%) hue-rotate(250deg) saturate(300%) !important; }
    .ipsDataItem_unread .ipsDataItem_main { border-left-color: var(--accent-primary) !important; }
    i.fa:not(.fa-spinner):not(.fa-spin) { color: var(--text-primary) !important; }
    .cn-permalink-icon i.fa { color: var(--text-secondary) !important; }
    #ipsLayout_header .cLogo, #ipsLayout_header .cLogo * { color: var(--accent-primary) !important; }
    .ipsButton_primary, .ipsButton_important, .ipsButton_light, .ipsButton_alternate {
        color: var(--text-primary) !important; border-color: var(--border-light) !important;
    }
}

/* Code & Blockquotes - Consolidated rules */
[data-theme="dark"] pre, [data-theme="dark"] code,
[data-theme="material-gold"] pre, [data-theme="material-gold"] code, [data-theme="material-emerald"] pre, [data-theme="material-emerald"] code,
[data-theme="material-redline"] pre, [data-theme="material-redline"] code, [data-theme="dark-teal"] pre, [data-theme="dark-teal"] code,
[data-theme="dark-orange"] pre, [data-theme="dark-orange"] code, [data-theme="dark-pink"] pre, [data-theme="dark-pink"] code,
[data-theme="dark-sky"] pre, [data-theme="dark-sky"] code, [data-theme="material-lime"] pre, [data-theme="material-lime"] code {
    background-color: #0d1117 !important; border: 1px solid var(--border-color) !important; color: #79c0ff !important;
}
[data-theme="dark-red-astronomy"] pre, [data-theme="dark-red-astronomy"] code {
    background-color: #0A0000 !important; border: 1px solid var(--border-color) !important; color: var(--text-primary) !important;
}
[data-theme="light"] pre, [data-theme="light"] code {
    background-color: #F8F8F8 !important; border: 1px solid var(--border-color) !important; color: #333 !important;
}
body[data-theme] blockquote {
    background-color: var(--tertiary-bg) !important; border-left: 4px solid var(--accent-primary) !important;
    color: var(--text-secondary) !important;
}

/* Permalinks & Collapse Styles - Minimized */
body[data-theme] .cn-post-id-display { color: var(--text-muted) !important; }
body[data-theme] .cn-permalink-icon { color: var(--text-secondary) !important; }

/* --- MODIFICATION 2: Apply text-shadow glow directly to text elements --- */
body[data-theme] .cn-permalink-container:hover {
    /* REMOVE RECTANGULAR BACKGROUND/BOX-SHADOW */
    background-color: transparent;
    border-radius: initial;
    box-shadow: none;
}
body[data-theme] .cn-permalink-container:hover .cn-post-id-display,
body[data-theme] .cn-permalink-container:hover .cn-permalink-icon {
    /* ADD TEXT-SHADOW GLOW */
    color: var(--accent-primary) !important;
    text-shadow: 0 0 5px rgba(var(--accent-primary-rgb), 0.7); /* Subtle Text Glow */
}

#cn-permalink-notification {
    position: fixed; top: 10px; right: 10px; padding: 10px 15px; border-radius: 4px;
    z-index: 10000; opacity: 0; transition: opacity 0.3s, transform 0.3s; transform: translateX(100%);
}
#cn-permalink-notification.show { opacity: 1; transform: translateX(0); }
.ipsPageHeader.ipsBox.ipsResponsive_pull { cursor: pointer; }
.cn-collapsed-header-content {
    max-height: 0 !important; overflow: hidden !important; opacity: 0 !important;
    margin: 0 !important; padding: 0 !important; border: none !important;
    transition: max-height 0.4s ease, opacity 0.3s ease !important;
}
#ipsLayout_sidebar { width: 300px; min-width: 300px; transition: all 0.3s ease-in-out; }
.cn-sidebar-collapsed #ipsLayout_sidebar {
    width: 0 !important; min-width: 0 !important; margin: 0 !important;
    padding: 0 !important; overflow: hidden; border: none !important;
}
.cn-sidebar-collapsed #ipsLayout_sidebar > * { display: none !important; }
.cn-sidebar-collapsed #ipsLayout_mainArea {
    width: 100% !important; max-width: 100% !important; flex-basis: 100% !important;
}
/* Style the new selector to blend with the UI */
#cn-theme-selector-li select {
    /* Hide default select arrow in favor of the fa-adjust icon */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: none !important;
}
    `);

    // --- Utility Functions (Simplified) ---
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => c.querySelectorAll(s);

    const showMsg = (msg) => {
        let el = $('#cn-permalink-notification');
        if (!el) {
            el = document.createElement('div');
            el.id = 'cn-permalink-notification';
            el.className = 'cn-permalink-success';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 2500);
    };

    const copyText = (text) => {
        (navigator.clipboard?.writeText(text) || Promise.reject())
            .then(() => showMsg("Permalink copied!"))
            .catch(() => {
                const ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    showMsg("Permalink copied!");
                } catch {
                    showMsg("Failed to copy.");
                }
                document.body.removeChild(ta);
            });
    };

    // --- Theme Selector (New Implementation) ---
    const setupThemeSelector = (list) => {
        let theme = localStorage.getItem(THEME_KEY) || 'material-gold';

        const iconEl = document.createElement('i');
        iconEl.style.marginRight = '8px';
        iconEl.style.color = 'var(--text-primary)';
        // Initialize the icon with the currently set theme's icon
        iconEl.className = `fa ${T_CFG[theme].i}`;

        const apply = (t) => {
            document.documentElement.setAttribute('data-theme', t);
            document.body.setAttribute('data-theme', t);
            localStorage.setItem(THEME_KEY, t);
            // Update the icon to reflect the new theme
            iconEl.className = `fa ${T_CFG[t].i}`;
        };

        const li = document.createElement('li');
        li.id = 'cn-theme-selector-li';

        // Define groups for logical display in the selector
        const themeGroups = {
            'Light Theme': ['light'],
            'Standard Dark': ['dark'],
            'Material Accents': ['material-gold', 'material-emerald', 'material-lime', 'material-redline'],
            'Color Accents': ['dark-teal', 'dark-orange', 'dark-pink'],
            'Observing Mode': ['dark-sky', 'dark-red-astronomy']
        };

        let optionsHtml = '';
        for (const [groupName, themeKeys] of Object.entries(themeGroups)) {
            optionsHtml += `<optgroup label="${groupName}">`;
            optionsHtml += themeKeys.map(key =>
                `<option value="${key}" ${key === theme ? 'selected' : ''}>${T_CFG[key].t}</option>`
            ).join('');
            optionsHtml += `</optgroup>`;
        }

        // Create the select element for theme choosing
        const selector = document.createElement('select');
        selector.id = 'cn-theme-selector';
        selector.className = 'ipsButton ipsButton_light ipsButton_medium';
        selector.style.cssText = 'background: transparent; border: none; padding: 0; margin: 0; color: var(--text-primary); cursor: pointer; height: 32px; font-size: 13px;';
        selector.innerHTML = optionsHtml;

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; align-items: center; padding: 4px 8px; background: var(--secondary-bg); border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); height: 40px;';

        container.appendChild(iconEl);
        container.appendChild(selector);
        li.appendChild(container);

        list.prepend(li);

        selector.onchange = (e) => {
            apply(e.target.value);
        };

        // Ensure the correct theme is applied on load
        apply(theme);
    };

    // --- Permalinks ---
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
                $('a', li).onclick = (e) => { e.preventDefault(); copyText(link); };
                tools.prepend(li);
                wrap.setAttribute('data-permalink-injected', 'true');
            }
        });
    };

    // --- Collapsible Header ---
    const setupHeader = () => {
        const header = $('.ipsPageHeader.ipsBox.ipsResponsive_pull');
        if (!header) return;

        // Use filter/map to get the elements to collapse
        const elements = Array.from(header.children).filter(c => !c.querySelector('ul.ipsToolList, h1'));
        if (!elements.length) return;

        const KEY = 'cnMainHeaderCollapsed';
        const isCollapsed = localStorage.getItem(KEY) === 'true';

        const toggle = (state) => {
            elements.forEach(el => el.classList.toggle('cn-collapsed-header-content', state));
            localStorage.setItem(KEY, state);
        };

        toggle(isCollapsed);

        header.onclick = (e) => {
            if (e.target.closest('a, button, select')) return;
            // Check if any element is collapsed (simple check)
            const state = elements.some(el => el.classList.contains('cn-collapsed-header-content'));
            toggle(!state);
        };
    };

    // --- Collapsible Sidebar & Init ---
    const setupSidebar = () => {
        const sidebar = $('#ipsLayout_sidebar');
        // Check both possible list locations
        const list = $('.ipsToolList_horizontal') || $('.ipsPageHeader + .ipsClearfix .ipsToolList');
        const content = $('#ipsLayout_contentArea');

        if (!sidebar || !list || !content) return;

        setupThemeSelector(list);

        const KEY = 'cnSidebarCollapsed';
        const isCollapsed = localStorage.getItem(KEY) === 'true';

        const li = document.createElement('li');
        li.id = 'cn-sidebar-toggle-li';

        const toggle = (state) => {
            content.classList.toggle('cn-sidebar-collapsed', state);
            icon.className = `fa ${state ? 'fa-chevron-left' : 'fa-chevron-right'}`;
            span.textContent = ` ${state ? 'Expand' : 'Collapse'} Sidebar`;
            localStorage.setItem(KEY, state);
        };

        // Initialize button content
        li.innerHTML = `<button class="ipsButton ipsButton_important ipsButton_medium" type="button" title="Toggle Sidebar">
            <i class="fa ${isCollapsed ? 'fa-chevron-left' : 'fa-chevron-right'}</i>
            <span class="ipsResponsive_hidePhone"> ${isCollapsed ? 'Expand' : 'Collapse'} Sidebar</span>
        </button>`;

        const themeBtn = $('#cn-theme-selector-li', list); // Look for the new selector element
        // Insert sidebar toggle next to theme selector or prepend
        themeBtn ? list.insertBefore(li, themeBtn.nextSibling) : list.prepend(li);

        const btn = $('button', li);
        const icon = $('i', li);
        const span = $('span', li);

        toggle(isCollapsed);
        btn.onclick = () => toggle(!content.classList.contains('cn-sidebar-collapsed'));
    };

    const init = () => {
        addPermalinks();
        setupHeader();
        setupSidebar();

        // Single MutationObserver for Permalinks on dynamic content
        const observer = new MutationObserver(addPermalinks);
        const target = $('#ipsLayout_mainArea') || $('#ipsLayout_contentArea') || document.body;
        observer.observe(target, { childList: true, subtree: true });
    };

    // Load on DOMContentLoaded or immediately if ready
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

})();
