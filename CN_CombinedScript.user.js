// ==UserScript==
// @name         Cloudy Nights Collapsible Sidebar, Permalinks & Theme Toggle
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Applies a Material Dark/Light/Dim theme with toggle, makes the right sidebar collapsible, expands main content, and adds permalinks. Adds collapsible main content headers.
// @author       chvvkumar
// @match        *://www.cloudynights.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // 1. GLOBAL CSS STYLES
    GM_addStyle(`

/* ========================================
    THEME VARIABLES - DARK MODE (Simplified to two grey shades)
    Mapping:
    --primary-bg (Area 2 - Page BG) = Darkest Shade (#1E1E1E)
    --secondary-bg & --tertiary-bg (Area 1/3 - Surfaces) = Lighter Shade (#2B2B2B)
======================================== */
[data-theme="dark"] {
    /* Backgrounds: Using only two shades (Neutral Greys) */
    --primary-bg: #1E1E1E; /* Darkest shade (Page BG) */
    --secondary-bg: #2B2B2B; /* Lighter shade (Header & Cards) */
    --tertiary-bg: #2B2B2B; /* Lighter shade (Posts & Items) */

    /* Accent color updated to HSL(200, 15%, 85%) which is light blue-gray */
    --accent-primary: #D9E2E8; /* Light blue-gray accent */
    --accent-secondary: #B5C8D3; /* A calculated darker shade for hover */

    /* Text */
    --text-primary: #FFFFFF; /* Pure White text */
    --text-secondary: #B0B0B0; /* Light Gray for minor text */
    --text-muted: #888888; /* Muted/Placeholder text */

    /* Borders & Shadows */
    --border-color: #444444;
    --border-light: #555555;
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 3px 6px rgba(0, 0, 0, 0.6);

    /* Utility */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
}

/* ========================================
    THEME VARIABLES - LIGHT MODE (Simplified to two shades)
======================================== */
[data-theme="light"] {
    /* Backgrounds: Using only two shades (White + Lighter Gray) */
    --primary-bg: #FFFFFF; /* Darkest shade analog (Pure White) */
    --secondary-bg: #E8EDF1; /* Lighter shade analog (Off-white/light gray) */
    --tertiary-bg: #E8EDF1; /* Lighter shade analog (Off-white/light gray) */

    /* Accents (Blue) */
    --accent-primary: #1976D2; /* Google Blue equivalent */
    --accent-secondary: #0D47A1; /* Darker blue for hover */

    /* Text */
    --text-primary: #263238; /* Dark, nearly black text */
    --text-secondary: #546E7A; /* Medium gray for minor text */
    --text-muted: #90A4AE; /* Light gray/Muted text */

    /* Borders & Shadows */
    --border-color: #CFD8DC;
    --border-light: #B0BEC5;
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.12);

    /* Utility */
    --success: #4CAF50;
    --warning: #FF9800;
    --error: #F44336;
}

/* ========================================
    THEME VARIABLES - DIM MODE (Exact HSL conversion from style.postcss)
======================================== */
[data-theme="dim"] {
    /* Backgrounds: Using surface1-dim and surface2-dim */
    --primary-bg: #2E353B; /* surface1-dim (hsl(200, 10%, 20%)) - Page BG */
    --secondary-bg: #39444D; /* surface2-dim (hsl(200, 10%, 25%)) - Header & Cards */
    --tertiary-bg: #39444D; /* Using surface2-dim for consistency */

    /* Accents (Brand color from dim HSL: hsl(200, 80%, 40%)) */
    --accent-primary: #3399CC; /* brand-dim */
    --accent-secondary: #1A79B3; /* A calculated darker shade for hover */

    /* Text */
    --text-primary: #B5C8D3; /* text1-dim (hsl(200, 15%, 75%)) */
    --text-secondary: #909BA6; /* text2-dim (hsl(200, 10%, 61%)) */
    --text-muted: #71806A; /* Retaining existing muted for low contrast */

    /* Borders & Shadows */
    --border-color: #4A5568;
    --border-light: #6A6D88;
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 3px 6px rgba(0, 0, 0, 0.5);

    /* Utility */
    --success: #68D391;
    --warning: #F6AD55;
    --error: #FC8181;
}

/* Common variables (Radius, Transitions) */
:root {
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
}


/* ========================================
GLOBAL & BODY STYLES - Applies to body based on [data-theme]
======================================== */
body[data-theme] {
    background-color: var(--primary-bg) !important;
    color: var(--text-primary) !important;
    font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
    line-height: 1.5 !important;
    transition: background-color 0.3s, color 0.3s;
}

/* Apply theme colors to various IPs classes */
body[data-theme] .ipsApp {
    background-color: var(--primary-bg) !important;
}

/* --- Theme-dependent element styles (updated to use [data-theme] selector) --- */
/* HEADER & NAVIGATION */
body[data-theme] #ipsLayout_header {
    background: var(--secondary-bg) !important;
    border-bottom: 1px solid var(--border-color) !important;
    box-shadow: var(--shadow-sm) !important;
}

body[data-theme] .ipsNavBar_active {
    border-bottom: 2px solid var(--accent-primary) !important;
}

/* Adjust active bar background based on theme for better contrast */
[data-theme="dark"] .ipsNavBar_active {
    /* Use RGBA of dark's new accent (#D9E2E8) */
    background-color: rgba(217, 226, 232, 0.15) !important;
}
[data-theme="dim"] .ipsNavBar_active {
    /* Use RGBA of dim's blue accent (Calculated from #3399CC) */
    background-color: rgba(51, 153, 204, 0.15) !important;
}
[data-theme="light"] .ipsNavBar_active {
    /* Use RGBA of light's blue accent */
    background-color: rgba(25, 118, 210, 0.1) !important;
}


/* CONTENT CONTAINERS & THEME LAYERING */
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

body[data-theme] .ipsDataItem, body[data-theme] .cTopic, body[data-theme] .cPost {
    background-color: var(--tertiary-bg) !important;
    border: none !important;
}

/* Fix for widget backgrounds */
body[data-theme] .ipsWidget {
    background-color: var(--secondary-bg) !important;
    border: 1px solid var(--border-color) !important;
}

body[data-theme] .ipsWidget_title {
    background: var(--tertiary-bg) !important;
    color: var(--text-primary) !important;
    border-bottom: 2px solid var(--accent-primary) !important;
}

/* Data Items */
body[data-theme] .ipsDataItem:hover {border-left: 3px solid var(--accent-primary) !important;padding-left: 5px !important;}
[data-theme="light"] .ipsDataItem:hover {box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);}

/* Blockquotes & Code */
body[data-theme] blockquote {background-color: var(--tertiary-bg) !important;border-left: 4px solid var(--accent-primary) !important;color: var(--text-secondary) !important;}

[data-theme="dark"] pre, [data-theme="dark"] code,
[data-theme="dim"] pre, [data-theme="dim"] code {
    background-color: #0d1117 !important;
    border: 1px solid var(--border-color) !important;
    color: #79c0ff !important;
}
[data-theme="light"] pre, [data-theme="light"] code {
    background-color: #F8F8F8 !important;
    border: 1px solid var(--border-color) !important;
    color: #333 !important;
}

/* Apply theme colors to all remaining elements using the [data-theme] parent selector */
/* This block retains all original styling rules but targets [data-theme] */
body[data-theme] .ipsNavBar_primary > ul > li > a {color: var(--text-primary) !important;padding: 8px 12px !important;border-radius: var(--radius-sm) !important;transition: all 0.3s ease !important;font-weight: 500 !important;}
body[data-theme] .ipsNavBar_primary > ul > li > a:hover {background-color: rgba(var(--accent-primary), 0.15) !important;color: var(--accent-primary) !important;}
body[data-theme] .ipsDataItem_title {color: var(--text-primary) !important;font-size: 15px !important;font-weight: 600 !important;transition: color 0.2s ease !important;}
body[data-theme] .ipsDataItem_title:hover {color: var(--accent-primary) !important;}
body[data-theme] h1, body[data-theme] h2, body[data-theme] h3, body[data-theme] h4, body[data-theme] h5, body[data-theme] h6, body[data-theme] .ipsType_sectionTitle, body[data-theme] .ipsType_pageTitle {color: var(--text-primary) !important;font-weight: 700 !important;}
body[data-theme] .ipsType_sectionTitle {background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)) !important;-webkit-background-clip: text !important;-webkit-text-fill-color: transparent !important;background-clip: text !important;}
body[data-theme] .ipsType_light, body[data-theme] .ipsType_minor {color: var(--text-secondary) !important;}
body[data-theme] .ipsType_medium {color: var(--text-primary) !important;}
body[data-theme] a {color: var(--accent-primary) !important;text-decoration: none !important;transition: all 0.2s ease !important;}
body[data-theme] a:hover {color: var(--accent-secondary) !important;text-decoration: underline !important;}
body[data-theme] .ipsButton {border-radius: var(--radius-sm) !important;box-shadow: var(--shadow-sm) !important;}
body[data-theme] .ipsButton_primary, body[data-theme] .ipsButton_important {background: var(--accent-primary) !important;color: #ffffff !important;}
body[data-theme] .ipsButton_primary:hover, body[data-theme] .ipsButton_important:hover {background: var(--accent-secondary) !important;box-shadow: var(--shadow-md) !important;transform: translateY(-1px) !important;}
body[data-theme] .ipsButton_alternate, body[data-theme] .ipsButton_light {background-color: var(--tertiary-bg) !important;color: var(--text-primary) !important;border: 1px solid var(--border-light) !important;box-shadow: none !important;}
body[data-theme] .ipsButton_alternate:hover, body[data-theme] .ipsButton_light:hover {background-color: var(--border-light) !important;border-color: var(--accent-primary) !important;transform: translateY(-1px) !important;box-shadow: var(--shadow-sm) !important;}
body[data-theme] .ipsButton_veryLight {background-color: var(--tertiary-bg) !important;color: var(--accent-primary) !important;border: 1px solid var(--border-color) !important;}
body[data-theme] .ipsButton_veryLight:hover {background-color: var(--border-light) !important;}
body[data-theme] input[type="text"], body[data-theme] input[type="email"], body[data-theme] input[type="password"], body[data-theme] input[type="search"], body[data-theme] textarea, body[data-theme] select {background-color: var(--secondary-bg) !important;color: var(--text-primary) !important;border: 1px solid var(--border-color) !important;border-radius: var(--radius-sm) !important;}
body[data-theme] input:focus, body[data-theme] textarea:focus, body[data-theme] select:focus {border-color: var(--accent-primary) !important;box-shadow: 0 0 0 3px rgba(var(--accent-primary), 0.1) !important;outline: none !important;background-color: var(--secondary-bg) !important;}
body[data-theme] #ipsLayout_footer {background: var(--secondary-bg) !important;border-top: 1px solid var(--border-color) !important;}
body[data-theme] .cn-post-id-display {color: var(--text-muted) !important;}
body[data-theme] .cn-permalink-icon {color: var(--text-secondary) !important;}
body[data-theme] .cn-permalink-container:hover .cn-post-id-display, body[data-theme] .cn-permalink-container:hover .cn-permalink-icon {color: var(--accent-primary) !important;}

/* Other styles (non-theme-specific, like sidebar collapse) are unchanged but remain in this GM_addStyle block */
#ipsLayout_contentArea,
#ipsLayout_contentWrapper,
#ipsLayout_mainArea,
.ipsLayout_mainArea > section {
    background-color: transparent !important;
}
.cForumRow {
    background-color: var(--secondary-bg) !important;
    border-radius: var(--radius-md) !important;
    border: 1px solid var(--border-color) !important;
    margin-bottom: 4px !important;
}
/* COLLAPSE LOGIC CSS REMAINS UNCHANGED */
.cn-collapsible-header-li { margin-right: 8px; }
.ipsPageHeader.ipsBox.ipsResponsive_pull > * { transition: all 0.4s ease-in-out !important; }
.cn-collapsed-header-content { max-height: 0 !important; overflow: hidden !important; opacity: 0 !important; margin-top: 0 !important; margin-bottom: 0 !important; padding-top: 0 !important; padding-bottom: 0 !important; border: none !important; transition: max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease, padding 0.3s ease !important; }
#ipsLayout_sidebar { width: 300px; min-width: 300px; flex-shrink: 0; background-color: transparent !important; transition: all 0.3s ease-in-out; }
#ipsLayout_mainArea { flex-basis: 0; flex-grow: 1; min-width: 0; transition: all 0.3s ease-in-out; }
.ipsLayout_contentArea { display: flex; flex-direction: row; align-items: flex-start; }
.cn-sidebar-collapsed #ipsLayout_sidebar { width: 0 !important; min-width: 0 !important; margin: 0 !important; overflow: hidden; padding: 0 !important; border: none !important; }
.cn-sidebar-collapsed #ipsLayout_sidebar > .ipsBox, .cn-sidebar-collapsed #ipsLayout_sidebar > .cWidgetContainer { display: none; }
.cn-sidebar-collapsed #ipsLayout_mainArea { width: 100% !important; max-width: 100% !important; margin-right: 0 !important; flex-basis: 100% !important; float: none !important; }
.cn-sidebar-collapsed #ipsLayout_contentWrapper { padding-right: 0 !important; width: 100% !important; float: none !important; }
.cn-sidebar-collapsed #ipsLayout_body, .cn-sidebar-collapsed .ipsLayout_container { max-width: none !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }

    `);

    // 2. THEME TOGGLE FUNCTIONALITY (UNCHANGED)
    const THEME_STATE_KEY = 'cnThemeMode';
    const THEMES = ['light', 'dark', 'dim']; // Cycle order: light -> dark -> dim -> light

    function initializeTheme() {
        const storedTheme = localStorage.getItem(THEME_STATE_KEY);
        // Default to 'dark' if no preference is found, or use stored theme if valid
        let initialTheme = (storedTheme && THEMES.includes(storedTheme)) ? storedTheme : 'dark';

        document.body.setAttribute('data-theme', initialTheme);
    }

    function getThemeIndex(currentTheme) {
        return THEMES.indexOf(currentTheme);
    }

    function setupThemeToggle(mainToolList) {
        let currentTheme = localStorage.getItem(THEME_STATE_KEY) || 'dark';
        if (!THEMES.includes(currentTheme)) currentTheme = 'dark'; // Sanity check

        const toggleListItem = document.createElement('li');
        toggleListItem.id = 'cn-theme-toggle-li';

        // Helper to get icon and text based on theme
        function getThemeIconInfo(theme) {
            switch(theme) {
                case 'light': return { iconClass: 'fa fa-sun-o', text: 'Light Mode' };
                case 'dim': return { iconClass: 'fa fa-adjust', text: 'Dim Mode' };
                case 'dark':
                default: return { iconClass: 'fa fa-moon-o', text: 'Dark Mode' };
            }
        }

        const iconInfo = getThemeIconInfo(currentTheme);

        toggleListItem.innerHTML = `<button class="ipsButton ipsButton_light ipsButton_medium" type="button" title="Toggle Theme: ${iconInfo.text}">
            <i class="${iconInfo.iconClass}" aria-hidden="true"></i>
            <span class="ipsResponsive_hidePhone" id="cn-theme-span">&nbsp;${iconInfo.text}</span>
        </button>`;

        // Insert the theme toggle button next to where the sidebar collapse button is (prepended)
        mainToolList.prepend(toggleListItem);

        const toggleButton = toggleListItem.querySelector('button');
        const toggleIcon = toggleListItem.querySelector('i');
        const toggleSpan = toggleListItem.querySelector('#cn-theme-span');


        function applyTheme(theme) {
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem(THEME_STATE_KEY, theme);

            const info = getThemeIconInfo(theme);
            toggleIcon.className = info.iconClass;
            if (toggleSpan) toggleSpan.textContent = ' ' + info.text;
            toggleButton.title = `Toggle Theme: ${info.text}`;
        }

        toggleButton.addEventListener('click', () => {
            let current = document.body.getAttribute('data-theme') || 'dark';
            let currentIndex = getThemeIndex(current);

            // Calculate the next theme index in the cycle: light -> dark -> dim -> light
            let nextIndex = (currentIndex + 1) % THEMES.length;
            let nextTheme = THEMES[nextIndex];

            applyTheme(nextTheme);
        });

        // Ensure the button reflects the initialized theme
        applyTheme(currentTheme);
    }

    // 3. PERMALINK FUNCTIONALITY (UNCHANGED)
    function showSuccessMessage(message) {
        let msgElement = document.getElementById('cn-permalink-notification');
        if (!msgElement) {
            msgElement = document.createElement('div');
            msgElement.id = 'cn-permalink-notification';
            msgElement.className = 'cn-permalink-success';
            // Add style for fixed position notification (optional but recommended)
            GM_addStyle('#cn-permalink-notification { position: fixed; top: 10px; right: 10px; padding: 10px 15px; border-radius: 4px; z-index: 10000; opacity: 0; transition: opacity 0.3s, transform 0.3s; transform: translateX(100%); } #cn-permalink-notification.show { opacity: 1; transform: translateX(0); }');
            document.body.appendChild(msgElement);
        }
        msgElement.textContent = message;
        msgElement.classList.add('show');
        setTimeout(() => {
            msgElement.classList.remove('show');
        }, 2500);
    }

    function copyToClipboard(textToCopy) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showSuccessMessage("Permalink copied to clipboard!");
            }).catch(err => {
                console.error('Could not copy text: ', err);
                showSuccessMessage("Failed to copy link.");
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showSuccessMessage("Permalink copied to clipboard!");
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showSuccessMessage("Failed to copy link.");
            }
            document.body.removeChild(textArea);
        }
    }

    function addPermalinks() {
        const postWrappers = document.querySelectorAll('div[data-commentid]:not([data-permalink-injected])');
        postWrappers.forEach(wrap => {
            const postId = wrap.getAttribute('data-commentid');
            const toolsList = wrap.querySelector('ul.ipsComment_tools');

            if (postId && toolsList) {
                const permalinkAnchor = `#findComment-${postId}`;
                const currentBaseUrl = window.location.href.split('#')[0];
                const fullPermalink = currentBaseUrl + permalinkAnchor;

                const li = document.createElement('li');
                const clickableContainer = document.createElement('a');
                clickableContainer.title = 'Copy Permalink (Post ID ' + postId + ')';
                clickableContainer.className = 'cn-permalink-container';
                clickableContainer.href = fullPermalink;

                const idDisplay = document.createElement('span');
                idDisplay.className = 'cn-post-id-display';
                idDisplay.textContent = `#${postId}`;

                const iconElement = document.createElement('span');
                iconElement.className = 'cn-permalink-icon';
                iconElement.innerHTML = '<i class="fa fa-link"></i>';

                clickableContainer.addEventListener('click', (e) => {
                    e.preventDefault();
                    copyToClipboard(fullPermalink);
                });

                clickableContainer.appendChild(idDisplay);
                clickableContainer.appendChild(iconElement);
                li.appendChild(clickableContainer);

                toolsList.prepend(li);
                wrap.setAttribute('data-permalink-injected', 'true');
            }
        });
    }

    function initPermalinks() {
        addPermalinks();

        const targetNode = document.getElementById('ipsLayout_mainArea') || document.getElementById('ipsLayout_contentArea');
        if (targetNode) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        addPermalinks();
                    }
                });
            });
            observer.observe(targetNode, { childList: true, subtree: true });
        } else {
             const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        addPermalinks();
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // 4. MAIN HEADER COLLAPSIBLE FUNCTIONALITY (UNCHANGED)
    function setupCollapsibleHeader() {
        const headerContainer = document.querySelector('.ipsPageHeader.ipsBox.ipsResponsive_pull');
        const h1 = headerContainer ? headerContainer.querySelector('h1') : null;

        if (!headerContainer || !h1) {
            return;
        }

        const headerChildren = Array.from(headerContainer.children);
        const titleWrapper = headerContainer.querySelector('.ipsFlex-flex\\:11');

        let collapsibleElements = [];
        headerChildren.forEach(child => {
            // Only collapse elements that are NOT the main title wrapper
            if (child !== titleWrapper && child !== h1 && !h1.contains(child)) {
                collapsibleElements.push(child);
            }
        });

        if (collapsibleElements.length === 0) {
             if (headerChildren.length > 1) {
                 collapsibleElements = headerChildren.slice(1);
             } else {
                 return;
             }
        }

        const HEADER_STATE_KEY = 'cnMainHeaderCollapsed';
        let isCollapsed = localStorage.getItem(HEADER_STATE_KEY) === 'true';

        // 1. Create and insert the toggle button
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'ipsButton ipsButton_verySmall ipsButton_light';
        toggleButton.title = 'Toggle Header Visibility';

        // Target the existing toolbar
        let toolbarList = headerContainer.querySelector('ul.ipsToolList.ipsToolList_horizontal');

        if (toolbarList) {
             const li = document.createElement('li');
             li.className = 'cn-collapsible-header-li';
             li.appendChild(toggleButton);
             toolbarList.prepend(li);
        } else {
             const titleFlexWrapper = headerContainer.querySelector('.ipsFlex-flex\\:11');
             if (titleFlexWrapper) {
                 titleFlexWrapper.appendChild(toggleButton);
             } else {
                 headerContainer.prepend(toggleButton);
             }
        }

        // 2. Logic to apply the visual state and update the DOM
        function toggleHeader(shouldCollapse) {
            collapsibleElements.forEach(el => {
                if (shouldCollapse) {
                    el.classList.add('cn-collapsed-header-content');
                } else {
                    el.classList.remove('cn-collapsed-header-content');
                }
            });

            if (shouldCollapse) {
                toggleButton.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i> <span class="ipsResponsive_hidePhone">Show Info</span>';
            } else {
                toggleButton.innerHTML = '<i class="fa fa-chevron-up" aria-hidden="true"></i> <span class="ipsResponsive_hidePhone">Hide Info</span>';
            }
            localStorage.setItem(HEADER_STATE_KEY, shouldCollapse);
        }

        // Apply initial state
        toggleHeader(isCollapsed);

        // Add click listener
        toggleButton.addEventListener('click', () => {
            let newState = collapsibleElements.some(el => el.classList.contains('cn-collapsed-header-content'));
            toggleHeader(!newState);
        });
    }


    // 5. SIDEBAR TOGGLE FUNCTIONALITY (UNCHANGED logic, but relies on new theme toggle)
    function setupCollapsibleSidebar() {
        const sidebar = document.getElementById('ipsLayout_sidebar');

        // Find the main Tool List
        let mainToolList = document.querySelector('.ipsToolList_horizontal');

        // Fallback for forum/index pages. This selector is crucial for the button insertion.
        if (!mainToolList) {
            mainToolList = document.querySelector('.ipsPageHeader + .ipsClearfix .ipsToolList');
        }

        const contentArea = document.getElementById('ipsLayout_contentArea');
        const mainArea = document.getElementById('ipsLayout_mainArea');

        if (!sidebar || !mainToolList || !contentArea || !mainArea) {
            return;
        }

        // --- NEW: Setup the Theme Toggle first (prepended) ---
        setupThemeToggle(mainToolList);
        // -----------------------------------------------------

        contentArea.classList.add('cn-collapsible-container');

        const toggleListItem = document.createElement('li');
        toggleListItem.id = 'cn-sidebar-toggle-li';
        let isCollapsed = localStorage.getItem('cnSidebarCollapsed') === 'true';

        // FIX: Corrected Arrow Logic. Left arrow (<) means 'Expand Sidebar'
        // Right arrow (>) means 'Collapse Sidebar'
        const initialIconClass = isCollapsed ? 'fa fa-chevron-left' : 'fa fa-chevron-right';
        const initialButtonText = isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar';

        toggleListItem.innerHTML = `<button class="ipsButton ipsButton_important ipsButton_medium" type="button" title="Toggle Sidebar Visibility">
            <i class="${initialIconClass}" aria-hidden="true"></i>
            <span class="ipsResponsive_hidePhone">&nbsp;${initialButtonText}</span>
        </button>`;

        // Insert it after the theme toggle button (which is now the first child)
        if (mainToolList.children.length > 0) {
            const themeToggleLi = mainToolList.querySelector('#cn-theme-toggle-li');
            if (themeToggleLi) {
                 mainToolList.insertBefore(toggleListItem, themeToggleLi.nextSibling);
            } else {
                 mainToolList.prepend(toggleListItem);
            }
        } else {
            mainToolList.appendChild(toggleListItem);
        }

        const toggleButton = toggleListItem.querySelector('button');
        const toggleIcon = toggleListItem.querySelector('i');
        const toggleSpan = toggleListItem.querySelector('span');

        // Logic to apply the visual state and update the DOM
        function toggleSidebar(shouldCollapse) {
            if (shouldCollapse) {
                // State: Collapsed (sidebar hidden). Icon: < (fa-chevron-left)
                contentArea.classList.add('cn-sidebar-collapsed');
                toggleIcon.className = 'fa fa-chevron-left';
                if (toggleSpan) toggleSpan.textContent = ' Expand Sidebar';
            } else {
                // State: Expanded (sidebar visible). Icon: > (fa-chevron-right)
                contentArea.classList.remove('cn-sidebar-collapsed');
                toggleIcon.className = 'fa fa-chevron-right';
                if (toggleSpan) toggleSpan.textContent = ' Collapse Sidebar';
            }
            localStorage.setItem('cnSidebarCollapsed', shouldCollapse);
        }

        // Apply initial state
        toggleSidebar(isCollapsed);

        // Add click listener
        toggleButton.addEventListener('click', () => {
            let newState = contentArea.classList.contains('cn-sidebar-collapsed');
            toggleSidebar(!newState);
        });
    }

    // --- Initialization ---
    initializeTheme(); // Set the initial theme state immediately (light, dark, or dim)
    initPermalinks();
    setupCollapsibleHeader();
    setupCollapsibleSidebar(); // This function now also calls setupThemeToggle

})();
