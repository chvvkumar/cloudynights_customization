// ==UserScript==
// @name         Cloudy Nights Collapsible Sidebar, Permalinks & Theme Toggle (Minified)
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  Optimized: Dark/Light themes with a selector, collapsible sidebar/header, permalinks. No FOUC.
// @author       chvvkumar
// @match        *://www.cloudynights.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration Constants ---

    // Key used to store the user's selected theme in localStorage
    const THEME_KEY = 'cnThemeMode';

    // List of all available themes. This array is crucial for theme validation and FOUC prevention.
    const THEMES = ['light', 'dark', 'material-gold', 'material-emerald', 'material-lime', 'material-redline', 'dark-teal', 'dark-orange', 'dark-pink', 'dark-sky', 'dark-red-astronomy'];

    // Theme configuration object (T_CFG) maps theme keys to their display properties.
    // 'i': Icon class (Font Awesome) displayed in the theme selector button.
    // 't': Display title/name of the theme.
    const T_CFG = {
        light: { i: 'fa-sun-o', t: 'Light Mode' }, dark: { i: 'fa-moon-o', t: 'Dark Slate' },
        'material-emerald': { i: 'fa-leaf', t: 'Material Emerald' },
        'material-redline': { i: 'fa-fire', t: 'Material Redline' }, 'dark-teal': { i: 'fa-tint', t: 'Dark Teal' },
        'dark-orange': { i: 'fa-flask', t: 'Dark Orange' }, 'dark-pink': { i: 'fa-heart', t: 'Dark Pink' },
        'dark-red-astronomy': { i: 'fa-globe', t: 'Astronomy' },
        'material-gold': { i: 'fa-trophy', t: 'Material Gold' },
        'dark-sky': { i: 'fa-star', t: 'Dark Sky' },
        'material-lime': { i: 'fa-bug', t: 'Material Lime' }
    };

    // --- FOUC Prevention: Apply Initial Theme ---

    /**
     * Reads the stored theme from localStorage and immediately applies it to the <html> element
     * using a `data-theme` attribute to prevent Flash of Unstyled Content (FOUC).
     * This function runs immediately at `document-start`.
     */
    const applyInitialTheme = () => {
        const theme = localStorage.getItem(THEME_KEY);
        // Determine the initial theme, falling back to 'material-gold' if none is stored or it's invalid.
        const initial = THEMES.includes(theme) ? theme : 'material-gold';
        // Apply theme to the root <html> element (fastest application)
        document.documentElement.setAttribute('data-theme', initial);

        const applyToBody = () => document.body?.setAttribute('data-theme', initial);

        // Apply theme to the <body> element once it exists.
        if (document.body) {
            applyToBody();
        } else {
            // Use MutationObserver if <body> hasn't been created yet.
            new MutationObserver((_, obs) => {
                if (document.body) {
                    applyToBody();
                    obs.disconnect();
                }
            }).observe(document.documentElement, { childList: true });
        }
    };
    applyInitialTheme();

    // --- CSS Injection (GM_addStyle) ---

    // Inject consolidated CSS rules using Tampermonkey's GM_addStyle.
    // This defines theme variables, global styles, component overrides, and layout collapse styles.
    GM_addStyle(`
/* Global Variables: Defines border radius constants */
:root { --radius-sm: 4px; --radius-md: 8px; }

/* Grouped Dark Theme Definitions (Default dark tones) */
[data-theme="dark"], [data-theme="dark-teal"], [data-theme="dark-orange"], [data-theme="dark-pink"], [data-theme="material-lime"] {
    --primary-bg: #1E1E1E; --secondary-bg: #2B2B2B; --tertiary-bg: #2B2B2B;
    --text-primary: #FFFFFF; --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #444444; --border-light: #555555;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.4); --shadow-md: 0 3px 6px rgba(0,0,0,0.6);
    --success: #10b981; --warning: #f59e0b; --error: #ef4444;
}
/* Specific Accent Overrides for standard dark themes */
[data-theme="dark-teal"] { --accent-primary: #00BCD4; --accent-secondary: #84FFFF; --accent-primary-rgb: 0, 188, 212; }
[data-theme="dark-orange"] { --accent-primary: #FF9800; --accent-secondary: #FFCC80; --accent-primary-rgb: 255, 152, 0; }
[data-theme="dark-pink"] { --accent-primary: #E91E63; --accent-secondary: #F48FB1; --accent-primary-rgb: 233, 30, 99; }
[data-theme="material-lime"] { --accent-primary: #AEEA00; --accent-secondary: #E6EE9C; --accent-primary-rgb: 174, 234, 0; }
[data-theme="dark"] { --accent-primary: #D9E2E8; --accent-secondary: #B5C8D3; --accent-primary-rgb: 217, 226, 232; }

/* Dark Sky Theme: Extremely dark background suitable for observing */
[data-theme="dark-sky"] {
    --primary-bg: #0A0A0A; --secondary-bg: #151515; --tertiary-bg: #151515;
    --accent-primary: #E83C00;
    --accent-secondary: #FF8A65;
    --accent-primary-rgb: 232, 60, 0;
    --text-primary: #C0C0C0;
    --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #333333; --border-light: #444444;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #10b981; --warning: #f59e0b; --error: #ef4444;
}

/* Dark Red Astronomy Theme: Monochrome red theme */
[data-theme="dark-red-astronomy"] {
    --primary-bg: #000; --secondary-bg: #1A0000; --tertiary-bg: #1A0000;
    --accent-primary: #D32F2F;
    --accent-secondary: #CC0000;
    --accent-primary-rgb: 211, 47, 47;
    --text-primary: #B73E3E;
    --text-secondary: #8A3333; --text-muted: #442222;
    --border-color: #330000; --border-light: #550000;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.6); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    color: var(--text-primary) !important;
}

/* Material Redline Theme */
[data-theme="material-redline"] {
    --primary-bg: #121212; --secondary-bg: #1E1E1E; --tertiary-bg: #2C2C2C;
    --text-primary: #FFFFFF; --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #383838; --border-light: #505050;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #66BB6A; --warning: #FFCA28; --error: #EF5350;
    --accent-primary: #FF3D00; --accent-secondary: #FF8A65; --accent-primary-rgb: 255, 61, 0;
}

/* Material Emerald Theme */
[data-theme="material-emerald"] {
    --primary-bg: #101515; --secondary-bg: #1A2424; --tertiary-bg: #283434;
    --accent-primary: #00C853; --accent-secondary: #69F0AE; --accent-primary-rgb: 0, 200, 83;
    --text-primary: #E0E0E0; --text-secondary: #A0A0A0; --text-muted: #787878;
    --border-color: #303A3A; --border-light: #485A5A;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #64DD17; --warning: #FFC400; --error: #FF5252;
}

/* Material Gold Theme (Default/Fallback) */
[data-theme="material-gold"] {
    --primary-bg: #181A1B; --secondary-bg: #222527; --tertiary-bg: #2C2F31;
    --accent-primary: #FFB300; --accent-secondary: #FFD740; --accent-primary-rgb: 255, 179, 0;
    --text-primary: #F0F0F0; --text-secondary: #B0B0B0; --text-muted: #888888;
    --border-color: #404040; --border-light: #606060;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5); --shadow-md: 0 3px 6px rgba(0,0,0,0.8);
    --success: #66BB6A; --warning: #FFCA28; --error: #EF5350;
}

/* Light Theme */
[data-theme="light"] {
    --primary-bg: #FFFFFF; --secondary-bg: #E8EDF1; --tertiary-bg: #E8EDF1;
    --accent-primary: #1976D2; --accent-secondary: #0D47A1; --accent-primary-rgb: 25, 118, 210;
    --text-primary: #263238; --text-secondary: #546E7A; --text-muted: #90A4AE;
    --border-color: #CFD8DC; --border-light: #B0BEC5;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.1); --shadow-md: 0 4px 8px rgba(0,0,0,0.1);
    --success: #4CAF50; --warning: #FF9800; --error: #F44336;
}

/* Consolidated Base Styles: Apply global styling to html and body */
html[data-theme], body[data-theme] {
    background-color: var(--primary-bg) !important;
    color: var(--text-primary) !important;
    font-family: 'Roboto','Helvetica Neue',Arial,sans-serif !important;
    transition: background-color 0.3s, color 0.3s; /* Smooth transition for theme change */
}
/* Ensure main layout wrappers use a transparent background to show body background */
body[data-theme] .ipsApp, #ipsLayout_contentArea, #ipsLayout_contentWrapper,
#ipsLayout_mainArea, .ipsLayout_mainArea > section { background-color: transparent !important; }

/* Consolidated Component Styles: Header and Navigation */
body[data-theme] #ipsLayout_header {
    background: var(--secondary-bg) !important;
    border-bottom: 1px solid var(--border-color) !important;
    box-shadow: var(--shadow-sm) !important;
}
body[data-theme] .ipsNavBar_primary, body[data-theme] .ipsButtonBar {
    background-color: var(--secondary-bg) !important;
    border-color: var(--border-color) !important;
}
/* Active navigation item indicator */
body[data-theme] .ipsNavBar_active { border-bottom: 2px solid var(--accent-primary) !important; }

/* Generate background color for active navigation items based on theme RGB (for opacity) */
${THEMES.map(t => {
    // Defines a mapping of theme keys to an RGBA value for the active tab background.
    const map = {
        'dark': 'rgba(217,226,232,0.15)', 'material-emerald': 'rgba(0,200,83,0.15)',
        'material-redline': 'rgba(255,61,0,0.15)', 'dark-teal': 'rgba(0,188,212,0.15)',
        'dark-orange': 'rgba(255,152,0,0.15)', 'dark-pink': 'rgba(233,30,99,0.15)',
        'dark-red-astronomy': 'rgba(255,51,51,0.2)',
        'material-gold': 'rgba(255,179,0,0.15)',
        'dark-sky': 'rgba(232, 60, 0, 0.15)',
        'material-lime': 'rgba(174, 234, 0, 0.15)',
        'light': 'rgba(25,118,210,0.1)'
    };
    return `[data-theme="${t}"] .ipsNavBar_active { background-color: ${map[t]} !important; }`;
}).join('\n')}

/* Boxes/Containers: Styles for main content blocks (widgets, forums) */
body[data-theme] .ipsBox {
    background-color: var(--secondary-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: var(--radius-md) !important;
    box-shadow: var(--shadow-sm) !important;
    transition: all 0.3s ease !important;
}
/* Unified hover effect: Adds a lift effect (transform) and a stronger shadow */
body[data-theme] .ipsBox:hover {
    box-shadow: var(--shadow-md) !important;
    border-color: var(--border-light) !important;
    transform: translateY(-1px) !important;
}
/* Styles for data items (forum rows, topics, posts) which often lack the .ipsBox class */
body[data-theme] .ipsDataItem, body[data-theme] .cTopic, body[data-theme] .cPost, body[data-theme] .cForumRow {
    background-color: var(--tertiary-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: var(--radius-md) !important;
    transition: all 0.3s ease !important;
}
/* Unified hover effect for data items */
body[data-theme] .ipsDataItem:hover, body[data-theme] .cTopic:hover, body[data-theme] .cPost:hover, body[data-theme] .cForumRow:hover {
    box-shadow: var(--shadow-md) !important;
    border-color: var(--border-light) !important;
    transform: translateY(-1px) !important;
}

/* Widget specific styling */
body[data-theme] .ipsWidget { background-color: var(--secondary-bg) !important; border: 1px solid var(--border-color) !important; }
body[data-theme] .ipsWidget_title {
    background: var(--tertiary-bg) !important;
    color: var(--text-primary) !important;
    border-bottom: 2px solid var(--accent-primary) !important;
}

/* Typography/Links: Styles for headings and links */
body[data-theme] h1, body[data-theme] h2, body[data-theme] h3, body[data-theme] h4, body[data-theme] h5, body[data-theme] h6,
body[data-theme] .ipsType_sectionTitle, body[data-theme] .ipsType_pageTitle, body[data-theme] .ipsDataItem_title {
    color: var(--text-primary) !important; font-weight: 700 !important;
}
body[data-theme] .ipsDataItem_title { font-weight: 600 !important; transition: color 0.2s ease !important; }

/* Link styling: Apply accent color and remove underline by default */
body[data-theme] .ipsDataItem_title:hover, body[data-theme] a {
    color: var(--accent-primary) !important;
    text-decoration: none !important;
    transition: all 0.2s ease !important;
}
/* Link hover state: Switch to secondary accent color on hover */
body[data-theme] a:hover { color: var(--accent-secondary) !important; text-decoration: none !important; }
/* Ensure action buttons that are links also lose underline */
body[data-theme] .ipsActionBar_aux .ipsButton:hover,
body[data-theme] .ipsActionBar_aux .ipsButton a:hover {
    text-decoration: none !important;
}

/* Button Styles: Unified appearance for all button types */
body[data-theme] .ipsButton, body[data-theme] .ipsButton_light, body[data-theme] .ipsButton_alternate,
body[data-theme] .ipsButton_primary, body[data-theme] .ipsButton_important {
    background-color: var(--tertiary-bg) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-light) !important;
    min-height: auto !important;
    padding: 6px 12px !important;
    line-height: 1.2 !important;
    box-shadow: var(--shadow-sm) !important;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.3s, transform 0.2s !important;
}
/* Button hover state: Change background/border/text color and add lift effect */
body[data-theme] .ipsButton:hover, body[data-theme] .ipsButton_light:hover, body[data-theme] .ipsButton_alternate:hover,
body[data-theme] .ipsButton_primary:hover, body[data-theme] .ipsButton_important:hover {
    background-color: var(--secondary-bg) !important;
    border-color: var(--accent-primary) !important;
    color: var(--accent-primary) !important;
    transform: translateY(-1px) !important;
    box-shadow: var(--shadow-md) !important;
}

/* Search Field Fixes: Ensure search inputs blend with the theme */
#elSearch, #elSearch form, body[data-theme] .ipsSearch_focus { background-color: transparent !important; }
body[data-theme] .ipsSearch input[type="search"] {
    background-color: var(--secondary-bg) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-color) !important;
}
body[data-theme] .ipsSearch button.ipsButton, body[data-theme] .cSearchFilter__text {
    background-color: var(--secondary-bg) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
    border-radius: var(--radius-sm) !important;
}

/* Astronomy Red Overrides: Specific rules for the dark-red-astronomy theme */
[data-theme="dark-red-astronomy"] {
    --link-color: var(--accent-primary) !important; --icon-color: var(--text-secondary) !important;
    --badge-bg: var(--secondary-bg) !important; --badge-color: var(--text-primary) !important;
    /* Apply a color filter to status icons for a monochrome red look */
    .ipsDataItem_status { filter: sepia(100%) hue-rotate(250deg) saturate(300%) !important; }
    /* Unread topic indicator bar */
    .ipsDataItem_unread .ipsDataItem_main { border-left-color: var(--accent-primary) !important; }
    /* General icon coloring */
    i.fa:not(.fa-spinner):not(.fa-spin) { color: var(--text-primary) !important; }
    /* Permalinks icons need to be secondary color */
    .cn-permalink-icon i.fa { color: var(--text-secondary) !important; }
    /* Cloudy Nights logo color override */
    #ipsLayout_header .cLogo, #ipsLayout_header .cLogo * { color: var(--accent-primary) !important; }
    /* Ensure buttons in this theme retain primary text color */
    .ipsButton_primary, .ipsButton_important, .ipsButton_light, .ipsButton_alternate {
        color: var(--text-primary) !important; border-color: var(--border-light) !important;
    }
}

/* Code & Blockquotes: Styling for code blocks (pre/code) and quotes */
/* Dark theme code block styling (GitHub Dark-like) */
[data-theme="dark"] pre, [data-theme="dark"] code,
[data-theme="material-gold"] pre, [data-theme="material-gold"] code, [data-theme="material-emerald"] pre, [data-theme="material-emerald"] code,
[data-theme="material-redline"] pre, [data-theme="material-redline"] code, [data-theme="dark-teal"] pre, [data-theme="dark-teal"] code,
[data-theme="dark-orange"] pre, [data-theme="dark-orange"] code, [data-theme="dark-pink"] pre, [data-theme="dark-pink"] code,
[data-theme="dark-sky"] pre, [data-theme="dark-sky"] code, [data-theme="material-lime"] pre, [data-theme="material-lime"] code {
    background-color: #0d1117 !important; border: 1px solid var(--border-color) !important; color: #79c0ff !important;
}
/* Specific code block style for the dark-red-astronomy theme */
[data-theme="dark-red-astronomy"] pre, [data-theme="dark-red-astronomy"] code {
    background-color: #0A0000 !important; border: 1px solid var(--border-color) !important; color: var(--text-primary) !important;
}
/* Light theme code block styling */
[data-theme="light"] pre, [data-theme="light"] code {
    background-color: #F8F8F8 !important; border: 1px solid var(--border-color) !important; color: #333 !important;
}
/* Blockquote styling with accent color border */
body[data-theme] blockquote {
    background-color: var(--tertiary-bg) !important;
    border-left: 4px solid var(--accent-primary) !important;
    color: var(--text-secondary) !important;
}

/* Permalinks & Collapse Styles */
body[data-theme] .cn-post-id-display { color: var(--text-muted) !important; }
body[data-theme] .cn-permalink-icon { color: var(--text-secondary) !important; }

/* Permalinks hover effect: remove box-shadow/background and apply text-shadow glow */
body[data-theme] .cn-permalink-container:hover {
    background-color: transparent;
    border-radius: initial;
    box-shadow: none;
}
body[data-theme] .cn-permalink-container:hover .cn-post-id-display,
body[data-theme] .cn-permalink-container:hover .cn-permalink-icon {
    color: var(--accent-primary) !important;
    text-shadow: 0 0 5px rgba(var(--accent-primary-rgb), 0.7); /* Subtle Text Glow */
}

/* Permalink Copy Notification */
#cn-permalink-notification {
    position: fixed; top: 10px; right: 10px; padding: 10px 15px; border-radius: 4px;
    z-index: 10000; opacity: 0; transition: opacity 0.3s, transform 0.3s;
    transform: translateX(100%); /* Start off-screen */
}
#cn-permalink-notification.show { opacity: 1; transform: translateX(0); }

/* Collapsible Header Styles */
.ipsPageHeader.ipsBox.ipsResponsive_pull { cursor: pointer; } /* Make the header clickable */
.cn-collapsed-header-content {
    /* Class applied to elements inside the header that should collapse */
    max-height: 0 !important; overflow: hidden !important; opacity: 0 !important;
    margin: 0 !important; padding: 0 !important; border: none !important;
    transition: max-height 0.4s ease, opacity 0.3s ease !important;
}

/* Collapsible Sidebar Styles */
#ipsLayout_sidebar { width: 300px; min-width: 300px; transition: all 0.3s ease-in-out; }
/* Class applied to the main content wrapper when sidebar is collapsed */
.cn-sidebar-collapsed #ipsLayout_sidebar {
    width: 0 !important; min-width: 0 !important; margin: 0 !important;
    padding: 0 !important; overflow: hidden; border: none !important;
}
.cn-sidebar-collapsed #ipsLayout_sidebar > * { display: none !important; } /* Hide all children inside collapsed sidebar */
/* Expand main content area to full width when sidebar is collapsed */
.cn-sidebar-collapsed #ipsLayout_mainArea {
    width: 100% !important; max-width: 100% !important; flex-basis: 100% !important;
}

/* Theme Selector Styling: Makes the native select element transparent and covers the button */
#cn-theme-selector-li button select {
    -webkit-appearance: none; -moz-appearance: none; appearance: none; /* Hide native selector styling */
    background: transparent !important; border: none !important; color: transparent !important;
    position: absolute; /* Allows it to cover the whole button area */
    top: 0; left: 0; width: 100%; height: 100%;
    padding: 0; margin: 0; cursor: pointer;
    z-index: 2; /* Ensure it is on top for clicks */
}
/* Theme Selector Button Styling */
#cn-theme-selector-li button {
    position: relative; /* Context for absolute positioning of select */
    display: flex; align-items: center;
    padding: 6px 12px !important;
}
    `);

    // --- Utility Functions ---

    /**
     * Shorthand for document.querySelector.
     * @param {string} s - The CSS selector string.
     * @param {HTMLElement} [c=document] - The context element to search within.
     * @returns {HTMLElement | null}
     */
    const $ = (s, c = document) => c.querySelector(s);

    /**
     * Shorthand for document.querySelectorAll.
     * @param {string} s - The CSS selector string.
     * @param {HTMLElement} [c=document] - The context element to search within.
     * @returns {NodeListOf<HTMLElement>}
     */
    const $$ = (s, c = document) => c.querySelectorAll(s);

    /**
     * Displays a temporary notification message in the top-right corner.
     * @param {string} msg - The message to display (e.g., "Permalink copied!").
     */
    const showMsg = (msg) => {
        let el = $('#cn-permalink-notification');
        if (!el) {
            // Create notification element if it doesn't exist
            el = document.createElement('div');
            el.id = 'cn-permalink-notification';
            el.className = 'cn-permalink-success';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.classList.add('show'); // Show the element (CSS transitions handle animation)
        // Hide the element after 2.5 seconds
        setTimeout(() => el.classList.remove('show'), 2500);
    };

    /**
     * Copies text to the clipboard, falling back to a temporary textarea element
     * if the modern Clipboard API fails (e.g., due to iframe restrictions).
     * @param {string} text - The text content (permalink URL) to copy.
     */
    const copyText = (text) => {
        // Try modern Clipboard API first
        (navigator.clipboard?.writeText(text) || Promise.reject())
            .then(() => showMsg("Permalink copied!"))
            .catch(() => {
                // Fallback method: use a temporary, hidden textarea
                const ta = document.createElement("textarea");
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                try {
                    // Deprecated but widely compatible copy command
                    document.execCommand('copy');
                    showMsg("Permalink copied!");
                } catch {
                    showMsg("Failed to copy.");
                }
                document.body.removeChild(ta);
            });
    };

    // --- Theme Selector Implementation ---

    /**
     * Creates and sets up the theme selection dropdown (which is styled as a button).
     * @param {HTMLElement} list - The `ipsToolList` element where the selector should be inserted.
     */
    const setupThemeSelector = (list) => {
        let theme = localStorage.getItem(THEME_KEY) || 'material-gold';

        // Element for the current icon display inside the button
        const iconEl = document.createElement('i');
        iconEl.style.marginRight = '8px';
        iconEl.style.color = 'var(--text-primary)';
        // Element for the current theme name display inside the button
        const textEl = document.createElement('span');
        textEl.style.color = 'var(--text-primary)';
        textEl.className = 'ipsResponsive_hidePhone'; // Hide text on small screens

        /**
         * Applies the selected theme globally and updates localStorage.
         * @param {string} t - The theme key to apply.
         */
        const apply = (t) => {
            document.documentElement.setAttribute('data-theme', t);
            document.body.setAttribute('data-theme', t);
            localStorage.setItem(THEME_KEY, t);
            // Update the visual elements (icon and text) of the selector button
            iconEl.className = `fa ${T_CFG[t].i}`;
            textEl.textContent = T_CFG[t].t;
        };

        const li = document.createElement('li');
        li.id = 'cn-theme-selector-li';

        // Logical grouping of themes for a cleaner dropdown menu
        const themeGroups = {
            'Light Theme': ['light'],
            'Standard Dark': ['dark'],
            'Material Accents': ['material-gold', 'material-emerald', 'material-lime', 'material-redline'],
            'Color Accents': ['dark-teal', 'dark-orange', 'dark-pink'],
            'Observing Mode': ['dark-sky', 'dark-red-astronomy']
        };

        let optionsHtml = '';
        // Generate <optgroup> and <option> tags based on the grouped configuration
        for (const [groupName, themeKeys] of Object.entries(themeGroups)) {
            optionsHtml += `<optgroup label="${groupName}">`;
            optionsHtml += themeKeys.map(key =>
                `<option value="${key}" ${key === theme ? 'selected' : ''}>${T_CFG[key].t}</option>`
            ).join('');
            optionsHtml += `</optgroup>`;
        }

        // Create the native <select> element (hidden and placed on top for functionality)
        const selector = document.createElement('select');
        selector.id = 'cn-theme-selector';
        selector.innerHTML = optionsHtml;

        // Create the visual <button> element
        const button = document.createElement('button');
        button.className = 'ipsButton ipsButton_light ipsButton_medium';
        button.type = 'button';

        // Attach visual elements (icon, text) and the functional <select> element to the button
        button.appendChild(iconEl);
        button.appendChild(textEl);
        button.appendChild(selector);

        li.appendChild(button);
        list.prepend(li); // Insert the theme selector list item

        // Attach change listener to the hidden select element
        selector.onchange = (e) => {
            apply(e.target.value);
        };

        // Ensure the initial visual state matches the stored theme
        apply(theme);
    };

    // --- Permalinks Feature ---

    /**
     * Injects a permalink button next to the "Quote" and "Report" buttons on each post.
     * It uses a `data-permalink-injected` attribute to avoid processing the same post multiple times.
     */
    const addPermalinks = () => {
        // Find all post wrappers with a comment ID that haven't been processed yet
        $$('div[data-commentid]:not([data-permalink-injected])').forEach(wrap => {
            const id = wrap.getAttribute('data-commentid');
            const tools = $('.ipsComment_tools', wrap); // Location where post tools are listed

            if (id && tools) {
                // Construct the permalink URL
                const link = `${window.location.href.split('#')[0]}#findComment-${id}`;
                const li = document.createElement('li');
                li.innerHTML = `<a href="${link}" title="Copy Permalink (Post ID ${id})" class="cn-permalink-container">
                    <span class="cn-post-id-display">#${id}</span>
                    <span class="cn-permalink-icon"><i class="fa fa-link"></i></span>
                </a>`;
                // Prevent navigation and trigger the copy function on click
                $('a', li).onclick = (e) => { e.preventDefault(); copyText(link); };
                tools.prepend(li); // Add the permalink item before other tools
                wrap.setAttribute('data-permalink-injected', 'true'); // Mark as processed
            }
        });
    };

    // --- Collapsible Header Feature ---

    /**
     * Sets up the main page header to collapse its contents (e.g., description, breadcrumbs)
     * when clicked, keeping only the title and action bar visible.
     */
    const setupHeader = () => {
        const header = $('.ipsPageHeader.ipsBox.ipsResponsive_pull');
        if (!header) return;

        // Find elements inside the header to collapse (all children except the title and tool list)
        const elements = Array.from(header.children).filter(c => !c.querySelector('ul.ipsToolList, h1'));
        if (!elements.length) return;

        const KEY = 'cnMainHeaderCollapsed';
        const isCollapsed = localStorage.getItem(KEY) === 'true';

        /**
         * Toggles the collapsed state of the header's contents.
         * @param {boolean} state - true to collapse, false to expand.
         */
        const toggle = (state) => {
            elements.forEach(el => el.classList.toggle('cn-collapsed-header-content', state));
            localStorage.setItem(KEY, state);
        };

        toggle(isCollapsed); // Apply initial state on load

        // Add click listener to the header element to toggle collapse/expand
        header.onclick = (e) => {
            // Ignore clicks on interactive elements inside the header
            if (e.target.closest('a, button, select')) return;
            // Determine current state by checking if any collapsible element has the class
            const state = elements.some(el => el.classList.contains('cn-collapsed-header-content'));
            toggle(!state);
        };
    };

    // --- Collapsible Sidebar & Initialization Setup ---

    /**
     * Sets up the sidebar collapse button and calls `setupThemeSelector`.
     */
    const setupSidebar = () => {
        const sidebar = $('#ipsLayout_sidebar');
        // Find the horizontal tool list in the header area
        const list = $('.ipsToolList_horizontal') || $('.ipsPageHeader + .ipsClearfix .ipsToolList');
        const content = $('#ipsLayout_contentArea');

        if (!sidebar || !list || !content) return;

        setupThemeSelector(list); // Insert the theme selector first

        const KEY = 'cnSidebarCollapsed';
        const isCollapsed = localStorage.getItem(KEY) === 'true';

        const li = document.createElement('li');
        li.id = 'cn-sidebar-toggle-li';

        /**
         * Toggles the collapsed state of the sidebar.
         * The collapse class is applied to the main content wrapper.
         * @param {boolean} state - true to collapse, false to expand.
         */
        const toggle = (state) => {
            content.classList.toggle('cn-sidebar-collapsed', state);
            // Update the button icon and text to reflect the *new* state action
            icon.className = `fa ${state ? 'fa-chevron-left' : 'fa-chevron-right'}`;
            span.textContent = ` ${state ? 'Expand' : 'Collapse'} Sidebar`;
            localStorage.setItem(KEY, state);
        };

        // Initial HTML for the sidebar toggle button
        li.innerHTML = `<button class="ipsButton ipsButton_important ipsButton_medium" type="button" title="Toggle Sidebar">
            <i class="fa ${isCollapsed ? 'fa-chevron-left' : 'fa-chevron-right'}"></i>
            <span class="ipsResponsive_hidePhone"> ${isCollapsed ? 'Expand' : 'Collapse'} Sidebar</span>
        </button>`;

        const themeBtn = $('#cn-theme-selector-li', list);
        // Insert the sidebar toggle button right after the theme selector
        themeBtn ? list.insertBefore(li, themeBtn.nextSibling) : list.prepend(li);

        const btn = $('button', li);
        const icon = $('i', li);
        const span = $('span', li);

        toggle(isCollapsed); // Apply initial state
        // Attach click listener to toggle the state
        btn.onclick = () => toggle(!content.classList.contains('cn-sidebar-collapsed'));
    };

    /**
     * Main initialization function called once the DOM is ready.
     */
    const init = () => {
        addPermalinks(); // Inject permalinks into existing posts
        setupHeader();   // Configure collapsible header
        setupSidebar();  // Configure collapsible sidebar and theme selector

        // Set up a MutationObserver to continuously look for new posts (dynamic loading)
        // and inject permalinks into them.
        const observer = new MutationObserver(addPermalinks);
        // Target the main content areas
        const target = $('#ipsLayout_mainArea') || $('#ipsLayout_contentArea') || document.body;
        observer.observe(target, { childList: true, subtree: true });
    };

    // Execute the main initialization function.
    // Check if the document is still loading; if so, wait for DOMContentLoaded, otherwise execute immediately.
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

})();
