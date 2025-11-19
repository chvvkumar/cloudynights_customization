// ==UserScript==
// @name         Cloudy Nights Collapsible Sidebar & Theme Toggle (Optimized)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Optimized: Dark/Light themes, collapsible sidebar/header. Enhanced performance, smaller size, cleaner code.
// @author       chvvkumar
// @match        *://www.cloudynights.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // CONFIGURATION
    // ============================================================================

    const CONFIG = {
        THEME_KEY: 'cnThemeMode',
        SIDEBAR_KEY: 'cnSidebarCollapsed',
        HEADER_KEY: 'cnMainHeaderCollapsed',
        DEFAULT_THEME: 'material-gold',
        
        THEMES: {
            light: { i: 'fa-sun-o', t: 'Light Mode' },
            dark: { i: 'fa-moon-o', t: 'Dark Slate' },
            'material-gold': { i: 'fa-trophy', t: 'Material Gold' },
            'material-emerald': { i: 'fa-leaf', t: 'Material Emerald' },
            'material-lime': { i: 'fa-bug', t: 'Material Lime' },
            'material-redline': { i: 'fa-fire', t: 'Material Redline' },
            'dark-teal': { i: 'fa-tint', t: 'Dark Teal' },
            'dark-orange': { i: 'fa-flask', t: 'Dark Orange' },
            'dark-pink': { i: 'fa-heart', t: 'Dark Pink' },
            'dark-sky': { i: 'fa-star', t: 'Dark Sky' },
            'dark-red-astronomy': { i: 'fa-globe', t: 'Astronomy' }
        },

        GROUPS: {
            'Light Theme': ['light'],
            'Standard Dark': ['dark'],
            'Material Accents': ['material-gold', 'material-emerald', 'material-lime', 'material-redline'],
            'Color Accents': ['dark-teal', 'dark-orange', 'dark-pink'],
            'Observing Mode': ['dark-sky', 'dark-red-astronomy']
        }
    };

    // ============================================================================
    // UTILITIES
    // ============================================================================

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => c.querySelectorAll(s);

    const storage = {
        get: (key, fallback = null) => localStorage.getItem(key) ?? fallback,
        set: (key, val) => localStorage.setItem(key, val),
        getBool: (key) => localStorage.getItem(key) === 'true'
    };

    // ============================================================================
    // FOUC PREVENTION - Apply theme immediately
    // ============================================================================

    const initTheme = () => {
        const theme = storage.get(CONFIG.THEME_KEY, CONFIG.DEFAULT_THEME);
        const validTheme = theme in CONFIG.THEMES ? theme : CONFIG.DEFAULT_THEME;
        const html = document.documentElement;
        
        html.setAttribute('data-theme', validTheme);

        if (document.body) {
            document.body.setAttribute('data-theme', validTheme);
        } else {
            const obs = new MutationObserver(() => {
                if (document.body) {
                    document.body.setAttribute('data-theme', validTheme);
                    obs.disconnect();
                }
            });
            obs.observe(html, { childList: true });
        }
    };

    initTheme();

    // ============================================================================
    // STYLES - Consolidated and minified
    // ============================================================================

    GM_addStyle(`
:root{--radius-sm:4px;--radius-md:8px}
[data-theme="dark"],[data-theme="dark-teal"],[data-theme="dark-orange"],[data-theme="dark-pink"],[data-theme="material-lime"]{--primary-bg:#1E1E1E;--secondary-bg:#2B2B2B;--tertiary-bg:#2B2B2B;--text-primary:#FFF;--text-secondary:#B0B0B0;--text-muted:#888;--border-color:#444;--border-light:#555;--shadow-sm:0 1px 3px rgba(0,0,0,.4);--shadow-md:0 3px 6px rgba(0,0,0,.6);--success:#10b981;--warning:#f59e0b;--error:#ef4444}
[data-theme="dark-teal"]{--accent-primary:#00BCD4;--accent-secondary:#84FFFF;--accent-primary-rgb:0,188,212}
[data-theme="dark-orange"]{--accent-primary:#FF9800;--accent-secondary:#FFCC80;--accent-primary-rgb:255,152,0}
[data-theme="dark-pink"]{--accent-primary:#E91E63;--accent-secondary:#F48FB1;--accent-primary-rgb:233,30,99}
[data-theme="material-lime"]{--accent-primary:#AEEA00;--accent-secondary:#E6EE9C;--accent-primary-rgb:174,234,0}
[data-theme="dark"]{--accent-primary:#D9E2E8;--accent-secondary:#B5C8D3;--accent-primary-rgb:217,226,232}
[data-theme="dark-sky"]{--primary-bg:#0A0A0A;--secondary-bg:#151515;--tertiary-bg:#151515;--accent-primary:#E83C00;--accent-secondary:#FF8A65;--accent-primary-rgb:232,60,0;--text-primary:#C0C0C0;--text-secondary:#B0B0B0;--text-muted:#888;--border-color:#333;--border-light:#444;--shadow-sm:0 1px 3px rgba(0,0,0,.5);--shadow-md:0 3px 6px rgba(0,0,0,.8);--success:#10b981;--warning:#f59e0b;--error:#ef4444}
[data-theme="dark-red-astronomy"]{--primary-bg:#000;--secondary-bg:#000;--tertiary-bg:#000;--accent-primary:#F00;--accent-secondary:#D32F2F;--accent-primary-rgb:255,0,0;--text-primary:#F00;--text-secondary:#C00;--text-muted:#900;--border-color:#440000;--border-light:#660000;--shadow-sm:0 1px 3px rgba(0,0,0,.8);--shadow-md:0 3px 6px #000;color:var(--text-primary)!important}
[data-theme="material-redline"]{--primary-bg:#121212;--secondary-bg:#1E1E1E;--tertiary-bg:#2C2C2C;--text-primary:#FFF;--text-secondary:#B0B0B0;--text-muted:#888;--border-color:#383838;--border-light:#505050;--shadow-sm:0 1px 3px rgba(0,0,0,.5);--shadow-md:0 3px 6px rgba(0,0,0,.8);--success:#66BB6A;--warning:#FFCA28;--error:#EF5350;--accent-primary:#FF3D00;--accent-secondary:#FF8A65;--accent-primary-rgb:255,61,0}
[data-theme="material-emerald"]{--primary-bg:#101515;--secondary-bg:#1A2424;--tertiary-bg:#283434;--accent-primary:#00C853;--accent-secondary:#69F0AE;--accent-primary-rgb:0,200,83;--text-primary:#E0E0E0;--text-secondary:#A0A0A0;--text-muted:#787878;--border-color:#303A3A;--border-light:#485A5A;--shadow-sm:0 1px 3px rgba(0,0,0,.5);--shadow-md:0 3px 6px rgba(0,0,0,.8);--success:#64DD17;--warning:#FFC400;--error:#FF5252}
[data-theme="material-gold"]{--primary-bg:#181A1B;--secondary-bg:#222527;--tertiary-bg:#2C2F31;--accent-primary:#FFB300;--accent-secondary:#FFD740;--accent-primary-rgb:255,179,0;--text-primary:#F0F0F0;--text-secondary:#B0B0B0;--text-muted:#888;--border-color:#404040;--border-light:#606060;--shadow-sm:0 1px 3px rgba(0,0,0,.5);--shadow-md:0 3px 6px rgba(0,0,0,.8);--success:#66BB6A;--warning:#FFCA28;--error:#EF5350}
[data-theme="light"]{--primary-bg:#FFF;--secondary-bg:#E8EDF1;--tertiary-bg:#E8EDF1;--accent-primary:#1976D2;--accent-secondary:#0D47A1;--accent-primary-rgb:25,118,210;--text-primary:#263238;--text-secondary:#546E7A;--text-muted:#90A4AE;--border-color:#CFD8DC;--border-light:#B0BEC5;--shadow-sm:0 1px 3px rgba(0,0,0,.1);--shadow-md:0 4px 8px rgba(0,0,0,.1);--success:#4CAF50;--warning:#FF9800;--error:#F44336}
html[data-theme],body[data-theme]{background-color:var(--primary-bg)!important;color:var(--text-primary)!important;font-family:Roboto,'Helvetica Neue',Arial,sans-serif!important;transition:background-color .3s,color .3s}
body[data-theme] .ipsApp,#ipsLayout_contentArea,#ipsLayout_contentWrapper,#ipsLayout_mainArea,.ipsLayout_mainArea>section{background-color:transparent!important}
body[data-theme] #ipsLayout_header{background:var(--secondary-bg)!important;border-bottom:1px solid var(--border-color)!important;box-shadow:var(--shadow-sm)!important}
body[data-theme] .ipsNavBar_primary,body[data-theme] .ipsButtonBar{background-color:var(--secondary-bg)!important;border-color:var(--border-color)!important}
body[data-theme] .ipsNavBar_active{border-bottom:2px solid var(--accent-primary)!important}
[data-theme="dark"] .ipsNavBar_active{background-color:rgba(217,226,232,.15)!important}
[data-theme="material-emerald"] .ipsNavBar_active{background-color:rgba(0,200,83,.15)!important}
[data-theme="material-redline"] .ipsNavBar_active{background-color:rgba(255,61,0,.15)!important}
[data-theme="dark-teal"] .ipsNavBar_active{background-color:rgba(0,188,212,.15)!important}
[data-theme="dark-orange"] .ipsNavBar_active{background-color:rgba(255,152,0,.15)!important}
[data-theme="dark-pink"] .ipsNavBar_active{background-color:rgba(233,30,99,.15)!important}
[data-theme="dark-red-astronomy"] .ipsNavBar_active{background-color:rgba(255,51,51,.2)!important}
[data-theme="material-gold"] .ipsNavBar_active{background-color:rgba(255,179,0,.15)!important}
[data-theme="dark-sky"] .ipsNavBar_active{background-color:rgba(232,60,0,.15)!important}
[data-theme="material-lime"] .ipsNavBar_active{background-color:rgba(174,234,0,.15)!important}
[data-theme="light"] .ipsNavBar_active{background-color:rgba(25,118,210,.1)!important}
body[data-theme] .ipsBox{background-color:var(--secondary-bg)!important;border:1px solid var(--border-color)!important;border-radius:var(--radius-md)!important;box-shadow:var(--shadow-sm)!important;transition:all .3s ease!important}
body[data-theme] .ipsBox:hover{box-shadow:var(--shadow-md)!important;border-color:var(--border-light)!important;transform:translateY(-1px)!important}
body[data-theme] .ipsDataItem,body[data-theme] .cTopic,body[data-theme] .cPost,body[data-theme] .cForumRow,body[data-theme] .ipsStreamItem{background-color:var(--tertiary-bg)!important;border:1px solid var(--border-color)!important;border-radius:var(--radius-md)!important;transition:all .3s ease!important}
body[data-theme] .ipsDataItem:hover,body[data-theme] .cTopic:hover,body[data-theme] .cPost:hover,body[data-theme] .cForumRow:hover,body[data-theme] .ipsStreamItem:hover{box-shadow:var(--shadow-md)!important;border-color:var(--border-light)!important;transform:translateY(-1px)!important}
body[data-theme] .ipsWidget{background-color:var(--secondary-bg)!important;border:1px solid var(--border-color)!important}
body[data-theme] .ipsWidget_title{background:var(--tertiary-bg)!important;color:var(--text-primary)!important;border-bottom:2px solid var(--accent-primary)!important}
body[data-theme] h1,body[data-theme] h2,body[data-theme] h3,body[data-theme] h4,body[data-theme] h5,body[data-theme] h6,body[data-theme] .ipsType_sectionTitle,body[data-theme] .ipsType_pageTitle,body[data-theme] .ipsDataItem_title{color:var(--text-primary)!important;font-weight:700!important}
body[data-theme] .ipsDataItem_title{font-weight:600!important;transition:color .2s ease!important}
body[data-theme] .ipsDataItem_title:hover,body[data-theme] a{color:var(--accent-primary)!important;text-decoration:none!important;transition:all .2s ease!important}
body[data-theme] a:hover{color:var(--accent-secondary)!important;text-decoration:none!important}
body[data-theme] .ipsActionBar_aux .ipsButton:hover,body[data-theme] .ipsActionBar_aux .ipsButton a:hover{text-decoration:none!important}
body[data-theme] .ipsButton,body[data-theme] .ipsButton_light,body[data-theme] .ipsButton_alternate,body[data-theme] .ipsButton_primary,body[data-theme] .ipsButton_important{background-color:var(--tertiary-bg)!important;color:var(--text-primary)!important;border:1px solid var(--border-light)!important;min-height:auto!important;padding:6px 12px!important;line-height:1.2!important;box-shadow:var(--shadow-sm)!important;transition:background-color .3s,border-color .3s,color .3s,box-shadow .3s,transform .2s!important}
body[data-theme] .ipsButton:hover,body[data-theme] .ipsButton_light:hover,body[data-theme] .ipsButton_alternate:hover,body[data-theme] .ipsButton_primary:hover,body[data-theme] .ipsButton_important:hover{background-color:var(--secondary-bg)!important;border-color:var(--accent-primary)!important;color:var(--accent-primary)!important;transform:translateY(-1px)!important;box-shadow:var(--shadow-md)!important}
#elSearch,#elSearch form,body[data-theme] .ipsSearch_focus{background-color:transparent!important}
body[data-theme] .ipsSearch input[type="search"]{background-color:var(--secondary-bg)!important;color:var(--text-primary)!important;border:1px solid var(--border-color)!important}
body[data-theme] .ipsSearch button.ipsButton,body[data-theme] .cSearchFilter__text{background-color:var(--secondary-bg)!important;color:var(--text-primary)!important;border-color:var(--border-color)!important;border-radius:var(--radius-sm)!important}
[data-theme="dark-red-astronomy"]{--link-color:var(--accent-primary)!important;--icon-color:var(--text-secondary)!important;--badge-bg:var(--secondary-bg)!important;--badge-color:var(--text-primary)!important}
[data-theme="dark-red-astronomy"] .ipsDataItem_status{filter:sepia(100%) hue-rotate(250deg) saturate(300%)!important}
[data-theme="dark-red-astronomy"] .ipsDataItem_unread .ipsDataItem_main{border-left-color:var(--accent-primary)!important}
[data-theme="dark-red-astronomy"] i.fa:not(.fa-spinner):not(.fa-spin){color:var(--text-primary)!important}
[data-theme="dark-red-astronomy"] #ipsLayout_header .cLogo,[data-theme="dark-red-astronomy"] #ipsLayout_header .cLogo *{color:var(--accent-primary)!important}
[data-theme="dark-red-astronomy"] .ipsButton_primary,[data-theme="dark-red-astronomy"] .ipsButton_important,[data-theme="dark-red-astronomy"] .ipsButton_light,[data-theme="dark-red-astronomy"] .ipsButton_alternate{color:var(--text-primary)!important;border-color:var(--border-light)!important}
[data-theme="dark"] pre,[data-theme="dark"] code,[data-theme="material-gold"] pre,[data-theme="material-gold"] code,[data-theme="material-emerald"] pre,[data-theme="material-emerald"] code,[data-theme="material-redline"] pre,[data-theme="material-redline"] code,[data-theme="dark-teal"] pre,[data-theme="dark-teal"] code,[data-theme="dark-orange"] pre,[data-theme="dark-orange"] code,[data-theme="dark-pink"] pre,[data-theme="dark-pink"] code,[data-theme="dark-sky"] pre,[data-theme="dark-sky"] code,[data-theme="material-lime"] pre,[data-theme="material-lime"] code{background-color:#0d1117!important;border:1px solid var(--border-color)!important;color:#79c0ff!important}
[data-theme="dark-red-astronomy"] pre,[data-theme="dark-red-astronomy"] code{background-color:#0A0000!important;border:1px solid var(--border-color)!important;color:var(--text-primary)!important}
[data-theme="light"] pre,[data-theme="light"] code{background-color:#F8F8F8!important;border:1px solid var(--border-color)!important;color:#333!important}
body[data-theme] blockquote{background-color:var(--tertiary-bg)!important;border-left:4px solid var(--accent-primary)!important;color:var(--text-secondary)!important}
.ipsPageHeader.ipsBox.ipsResponsive_pull{cursor:pointer}
.cn-collapsed-header-content{max-height:0!important;overflow:hidden!important;opacity:0!important;margin:0!important;padding:0!important;border:none!important;transition:max-height .4s ease,opacity .3s ease!important}
#ipsLayout_sidebar{width:300px;min-width:300px;transition:all .3s ease-in-out}
.cn-sidebar-collapsed #ipsLayout_sidebar{width:0!important;min-width:0!important;margin:0!important;padding:0!important;display:none!important}
.cn-sidebar-collapsed #ipsLayout_mainArea{width:100%!important;max-width:100%!important;flex:1 1 100%!important;margin-right:0!important;padding-right:0!important;display:block!important}
#cn-theme-selector-li button select{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:transparent!important;border:none!important;color:transparent!important;position:absolute;top:0;left:0;width:100%;height:100%;padding:0;margin:0;cursor:pointer;z-index:2}
#cn-theme-selector-li button{position:relative;display:flex;align-items:center;padding:6px 12px!important}
#cn-theme-selector-li button select optgroup,#cn-theme-selector-li button select option{background-color:#1E1E1E!important;color:#FFF!important}
`);

    // ============================================================================
    // THEME SELECTOR
    // ============================================================================

    const createThemeSelector = (list) => {
        const currentTheme = storage.get(CONFIG.THEME_KEY, CONFIG.DEFAULT_THEME);
        
        // Create elements
        const li = document.createElement('li');
        li.id = 'cn-theme-selector-li';

        const btn = document.createElement('button');
        btn.className = 'ipsButton ipsButton_light ipsButton_medium';
        btn.type = 'button';

        const icon = document.createElement('i');
        icon.style.cssText = 'margin-right:8px;color:var(--text-primary)';

        const text = document.createElement('span');
        text.className = 'ipsResponsive_hidePhone';
        text.style.color = 'var(--text-primary)';

        const select = document.createElement('select');
        select.id = 'cn-theme-selector';

        // Build options
        let html = '';
        for (const [groupName, themes] of Object.entries(CONFIG.GROUPS)) {
            html += `<optgroup label="${groupName}">`;
            for (const key of themes) {
                const cfg = CONFIG.THEMES[key];
                html += `<option value="${key}"${key === currentTheme ? ' selected' : ''}>${cfg.t}</option>`;
            }
            html += '</optgroup>';
        }
        select.innerHTML = html;

        // Apply theme function
        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            document.body.setAttribute('data-theme', theme);
            storage.set(CONFIG.THEME_KEY, theme);
            
            const cfg = CONFIG.THEMES[theme];
            icon.className = `fa ${cfg.i}`;
            text.textContent = cfg.t;
        };

        // Assemble
        btn.append(icon, text, select);
        li.appendChild(btn);
        list.prepend(li);

        // Event
        select.onchange = (e) => applyTheme(e.target.value);
        
        // Initialize
        applyTheme(currentTheme);
    };

    // ============================================================================
    // COLLAPSIBLE HEADER
    // ============================================================================

    const setupCollapsibleHeader = () => {
        const header = $('.ipsPageHeader.ipsBox.ipsResponsive_pull');
        if (!header) return;

        const elements = Array.from(header.children).filter(c => 
            !c.querySelector('ul.ipsToolList, h1')
        );
        
        if (!elements.length) return;

        const isCollapsed = storage.getBool(CONFIG.HEADER_KEY);

        const toggle = (collapsed) => {
            elements.forEach(el => 
                el.classList.toggle('cn-collapsed-header-content', collapsed)
            );
            storage.set(CONFIG.HEADER_KEY, collapsed);
        };

        toggle(isCollapsed);

        header.onclick = (e) => {
            if (e.target.closest('a, button, select')) return;
            const current = elements[0]?.classList.contains('cn-collapsed-header-content') ?? false;
            toggle(!current);
        };
    };

    // ============================================================================
    // COLLAPSIBLE SIDEBAR
    // ============================================================================

    const setupCollapsibleSidebar = () => {
        const sidebar = $('#ipsLayout_sidebar');
        const content = $('#ipsLayout_contentArea');
        if (!sidebar || !content) return;

        // Find or create toolbar
        let list = $('.ipsToolList_horizontal') ||
                   $('.ipsPageHeader .ipsToolList') ||
                   $('.ipsPageHeader + .ipsClearfix .ipsToolList');

        if (!list) {
            const header = $('.ipsPageHeader');
            if (header) {
                list = document.createElement('ul');
                list.className = 'ipsToolList ipsToolList_horizontal ipsPos_right';
                list.style.marginTop = '0';
                header.appendChild(list);
            }
        }

        if (!list) list = $('.ipsToolList');
        if (!list) return;

        // Setup theme selector first
        createThemeSelector(list);

        // Create sidebar toggle
        const isCollapsed = storage.getBool(CONFIG.SIDEBAR_KEY);

        const li = document.createElement('li');
        li.id = 'cn-sidebar-toggle-li';

        const btn = document.createElement('button');
        btn.className = 'ipsButton ipsButton_important ipsButton_medium';
        btn.type = 'button';
        btn.title = 'Toggle Sidebar';

        const icon = document.createElement('i');
        const span = document.createElement('span');
        span.className = 'ipsResponsive_hidePhone';

        btn.append(icon, span);
        li.appendChild(btn);

        // Insert after theme selector
        const themeBtn = $('#cn-theme-selector-li', list);
        themeBtn ? list.insertBefore(li, themeBtn.nextSibling) : list.prepend(li);

        // Toggle function
        const toggle = (collapsed) => {
            content.classList.toggle('cn-sidebar-collapsed', collapsed);
            icon.className = `fa ${collapsed ? 'fa-chevron-left' : 'fa-chevron-right'}`;
            span.textContent = ` ${collapsed ? 'Expand' : 'Collapse'} Sidebar`;
            storage.set(CONFIG.SIDEBAR_KEY, collapsed);
        };

        // Initialize
        toggle(isCollapsed);

        // Event
        btn.onclick = () => {
            toggle(!content.classList.contains('cn-sidebar-collapsed'));
        };
    };

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    const init = () => {
        setupCollapsibleHeader();
        setupCollapsibleSidebar();
    };

    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
