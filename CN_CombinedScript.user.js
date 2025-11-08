// ==UserScript==
// @name         Cloudy Nights Collapsible Sidebar, Permalinks & Blue Theme
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Applies a blue dark theme, makes the right sidebar collapsible, expands main content to screen edge, and adds permalinks. Adds collapsible main content headers.
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
COLOR VARIABLES & ROOT SETTINGS (From cn_blue.user.js)
======================================== */
:root {
    --primary-bg: #0f1419;
    --secondary-bg: #16202c;
    --tertiary-bg: #1c2938;
    --accent-primary: #4a9eff;
    --accent-secondary: #3182ce;
    --text-primary: #e8eaed;
    --text-secondary: #9ca3af;
    --text-muted: #6b7280;
    --border-color: #2d3748;
    --border-light: #374151;
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
}

/* ========================================
GLOBAL & BODY STYLES (From cn_blue.user.js)
======================================== */
body, html {
    background-color: var(--primary-bg) !important;
    color: var(--text-primary) !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    line-height: 1.3 !important;
}

.ipsApp {
    background-color: var(--primary-bg) !important;
}

/* ========================================
HEADER & NAVIGATION (From cn_blue.user.js)
======================================== */
#ipsLayout_header {
    background: linear-gradient(180deg, var(--secondary-bg) 0%, var(--tertiary-bg) 100%) !important;
    border-bottom: 1px solid var(--border-color) !important;
    box-shadow: var(--shadow-md) !important;
}

.ipsNavBar_primary {
    background-color: transparent !important;
}

.ipsNavBar_active {
    background-color: rgba(74, 158, 255, 0.15) !important;
    border-bottom: 2px solid var(--accent-primary) !important;
}

/* ========================================
CONTENT CONTAINERS & THEME LAYERING FIX
======================================== */
/* FIX: Ensure major wrappers use primary BG so content boxes stand out */
#ipsLayout_contentArea,
#ipsLayout_contentWrapper,
#ipsLayout_mainArea,
.ipsLayout_mainArea > section {
    background-color: transparent !important;
}

/* Base box color: slightly brighter than primary BG */
.ipsBox {
    background-color: var(--secondary-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: var(--radius-md) !important;
    box-shadow: var(--shadow-sm) !important;
    padding: 8px !important;
    margin-bottom: 4px !important;
    transition: all 0.3s ease !important;
}

.ipsBox:hover {
    box-shadow: var(--shadow-md) !important;
    border-color: var(--border-light) !important;
}

/* Post list items & thread backgrounds should use tertiary BG for visual nesting */
.ipsDataItem, .cTopic, .cPost {
    background-color: var(--tertiary-bg) !important;
}

.cForumRow {
    background-color: var(--secondary-bg) !important;
    border-radius: var(--radius-md) !important;
    border: 1px solid var(--border-color) !important;
    margin-bottom: 2px !important;
}

/* Fix for widget backgrounds */
.ipsWidget {
    background-color: var(--secondary-bg) !important;
    border: 1px solid var(--border-color) !important;
    border-radius: var(--radius-md) !important;
    box-shadow: var(--shadow-sm) !important;
    overflow: hidden !important;
}

.ipsWidget_title {
    background: linear-gradient(90deg, var(--tertiary-bg) 0%, var(--secondary-bg) 100%) !important;
    color: var(--text-primary) !important;
    border-bottom: 2px solid var(--accent-primary) !important;
}


/* ========================================
MAIN HEADER COLLAPSE LOGIC
======================================== */

.cn-collapsible-header-li {
    margin-right: 8px; /* Spacing for the button */
}

/* Apply transition to all children of the header for smooth collapse */
.ipsPageHeader.ipsBox.ipsResponsive_pull > * {
    transition: all 0.4s ease-in-out !important;
}

/* Rule to collapse individual child elements of the header */
.cn-collapsed-header-content {
    max-height: 0 !important;
    overflow: hidden !important;
    opacity: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    border: none !important;
    /* Ensure the elements themselves know how to collapse */
    transition: max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease, padding 0.3s ease !important;
}


/* ========================================
SIDEBAR APPEARANCE & COLLAPSE LOGIC
======================================== */
#ipsLayout_sidebar {
    width: 300px;
    min-width: 300px;
    flex-shrink: 0;
    background-color: transparent !important;
    transition: all 0.3s ease-in-out;
}

#ipsLayout_mainArea {
    flex-basis: 0;
    flex-grow: 1;
    min-width: 0;
    transition: all 0.3s ease-in-out;
}

.ipsLayout_contentArea {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
}

/* COLLAPSED STATE STYLES: Applies to parent (#ipsLayout_contentArea) */
.cn-sidebar-collapsed #ipsLayout_sidebar {
    width: 0 !important;
    min-width: 0 !important;
    margin: 0 !important;
    overflow: hidden;
    padding: 0 !important;
    border: none !important;
}

.cn-sidebar-collapsed #ipsLayout_sidebar > .ipsBox,
.cn-sidebar-collapsed #ipsLayout_sidebar > .cWidgetContainer {
    display: none;
}

/* FIX 1: Ensure main content takes all available width by overriding specific IPS styles */
.cn-sidebar-collapsed #ipsLayout_mainArea {
    width: 100% !important;
    max-width: 100% !important;
    margin-right: 0 !important;
    flex-basis: 100% !important; /* Ensure flex layout grabs all space */
    float: none !important;      /* Remove residual floats */
}

/* FIX 2: Override the padding added by the default layout when a sidebar is present */
.cn-sidebar-collapsed #ipsLayout_contentWrapper {
    padding-right: 0 !important;
    width: 100% !important;
    float: none !important;
}

/* FIX 3 (The Crucial Fix for wide screens): Override max-width on the primary container */
.cn-sidebar-collapsed #ipsLayout_body,
.cn-sidebar-collapsed .ipsLayout_container {
    max-width: none !important; /* Use 'none' for maximum width override */
    width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
}


/* --- Remaining Theme Styles (Unmodified for brevity) --- */
.ipsNavBar_primary > ul > li > a {color: var(--text-primary) !important;padding: 8px 12px !important;border-radius: var(--radius-sm) !important;transition: all 0.3s ease !important;font-weight: 500 !important;}
.ipsNavBar_primary > ul > li > a:hover {background-color: rgba(74, 158, 255, 0.1) !important;color: var(--accent-primary) !important;transform: translateY(-1px);}
.ipsDataItem:hover {background-color: rgba(74, 158, 255, 0.05) !important;border-left: 3px solid var(--accent-primary) !important;padding-left: 3px !important;}
.ipsDataItem_title {color: var(--text-primary) !important;font-size: 14px !important;font-weight: 600 !important;transition: color 0.2s ease !important;}
.ipsDataItem_title:hover {color: var(--accent-primary) !important;}
h1, h2, h3, h4, h5, h6,.ipsType_sectionTitle,.ipsType_pageTitle {color: var(--text-primary) !important;font-weight: 700 !important;letter-spacing: -0.02em !important;margin-top: 4px !important;margin-bottom: 4px !important;}
.ipsType_sectionTitle {background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)) !important;-webkit-background-clip: text !important;-webkit-text-fill-color: transparent !important;background-clip: text !important;padding: 4px 0 !important;font-size: 16px !important;}
.ipsType_light,.ipsType_minor {color: var(--text-secondary) !important;}
.ipsType_medium {color: var(--text-primary) !important;}
a {color: var(--accent-primary) !important;text-decoration: none !important;transition: all 0.2s ease !important;}
a:hover {color: var(--accent-secondary) !important;text-decoration: none !important;}
.ipsButton {border-radius: var(--radius-sm) !important;padding: 3px 10px !important;font-weight: 600 !important;font-size: 13px !important;transition: all 0.3s ease !important;border: none !important;box-shadow: var(--shadow-sm) !important;line-height: 1.2 !important;}
.ipsButton_primary, .ipsButton_important {background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%) !important;color: #ffffff !important;}
.ipsButton_primary:hover, .ipsButton_important:hover {background: linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%) !important;box-shadow: var(--shadow-md) !important;transform: translateY(-2px) !important;}
.ipsButton_alternate, .ipsButton_light {background-color: var(--tertiary-bg) !important;color: var(--text-primary) !important;border: 1px solid var(--border-light) !important;}
.ipsButton_alternate:hover, .ipsButton_light:hover {background-color: var(--border-light) !important;border-color: var(--accent-primary) !important;transform: translateY(-1px) !important;}
.ipsButton_veryLight {background-color: rgba(74, 158, 255, 0.1) !important;color: var(--accent-primary) !important;border: 1px solid rgba(74, 158, 255, 0.2) !important;}
.ipsButton_veryLight:hover {background-color: rgba(74, 158, 255, 0.2) !important;}
input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea, select {background-color: var(--tertiary-bg) !important;color: var(--text-primary) !important;border: 1px solid var(--border-color) !important;border-radius: var(--radius-sm) !important;padding: 6px 10px !important;transition: all 0.3s ease !important;}
input:focus, textarea:focus, select:focus {border-color: var(--accent-primary) !important;box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1) !important;outline: none !important;background-color: var(--secondary-bg) !important;}
blockquote {background-color: var(--secondary-bg) !important;border-left: 4px solid var(--accent-primary) !important;padding: 6px !important;border-radius: var(--radius-sm) !important;color: var(--text-secondary) !important;margin: 4px 0 !important;}
pre, code {background-color: #0d1117 !important;border: 1px solid var(--border-color) !important;border-radius: var(--radius-sm) !important;color: #79c0ff !important;padding: 6px !important;font-family: 'Fira Code', 'Consolas', monospace !important;}
.ipsBreadcrumb {background-color: transparent !important;padding: 4px 0 !important;}
.ipsBreadcrumb li {color: var(--text-secondary) !important;}
.ipsBreadcrumb a {color: var(--accent-primary) !important;transition: color 0.2s ease !important;}
.ipsBreadcrumb a:hover {color: var(--accent-secondary) !important;}
#ipsLayout_footer {background: linear-gradient(180deg, var(--secondary-bg) 0%, var(--primary-bg) 100%) !important;border-top: 1px solid var(--border-color) !important;padding: 12px 0 !important;margin-top: 12px !important;}
.cn-permalink-container {display: flex;align-items: center;padding: 0 4px;cursor: pointer;text-decoration: none !important;transition: all 0.2s;}
.cn-permalink-container:hover {opacity: 1.0 !important;color: var(--accent-primary) !important;text-shadow: 0 0 5px rgba(74, 158, 255, 0.3);}
.cn-post-id-display {font-size: 11px;color: var(--text-muted) !important;font-weight: 500;margin-right: 2px;transition: color 0.2s;}
.cn-permalink-container:hover .cn-post-id-display {color: var(--accent-primary) !important;}
.cn-permalink-icon {font-size: 14px;color: var(--text-secondary) !important;opacity: 0.7;transition: color 0.2s, opacity 0.2s;}
.cn-permalink-container:hover .cn-permalink-icon {opacity: 1.0;color: var(--accent-primary) !important;}
.cn-permalink-success {background-color: var(--success) !important;}
    `);

    // 2. PERMALINK FUNCTIONALITY (Optimized and Unchanged)
    function showSuccessMessage(message) {
        let msgElement = document.getElementById('cn-permalink-notification');
        if (!msgElement) {
            msgElement = document.createElement('div');
            msgElement.id = 'cn-permalink-notification';
            msgElement.className = 'cn-permalink-success';
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

    // 3. MAIN HEADER COLLAPSIBLE FUNCTIONALITY (V2.0 BUGGED VERSION)
    function setupCollapsibleHeader() {
        const headerContainer = document.querySelector('.ipsPageHeader.ipsBox.ipsResponsive_pull');
        const h1 = headerContainer ? headerContainer.querySelector('h1') : null;

        if (!headerContainer || !h1) {
            return;
        }

        // --- THIS BLOCK CONTAINS THE V2.0 BUG where filtering is too broad ---
        const headerChildren = Array.from(headerContainer.children);
        // In V2.0, this line was flawed and caused the header title to collapse:
        const collapsibleElements = headerChildren.slice(1);
        // --------------------------------------------------------------------

        if (collapsibleElements.length === 0) {
            return;
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
             const titleWrapper = headerContainer.querySelector('.ipsFlex-flex\\:11');
             if (titleWrapper) {
                 titleWrapper.appendChild(toggleButton);
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
                toggleButton.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i> Show Info';
            } else {
                toggleButton.innerHTML = '<i class="fa fa-chevron-up" aria-hidden="true"></i> Hide Info';
            }
            localStorage.setItem(HEADER_STATE_KEY, shouldCollapse);
        }

        // Apply initial state
        toggleHeader(isCollapsed);

        // Add click listener
        toggleButton.addEventListener('click', () => {
            let newState = collapsibleElements[0].classList.contains('cn-collapsed-header-content');
            toggleHeader(!newState);
        });
    }


    // 4. SIDEBAR TOGGLE FUNCTIONALITY (V2.0 BUGGED ARROW LOGIC VERSION + Layout Fix)
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

        // Check if sidebar and a valid insertion point exist
        if (!sidebar || !mainToolList || !contentArea || !mainArea) {
            return;
        }

        // Apply class to contentArea to enable flex layout and toggling CSS rules.
        contentArea.classList.add('cn-collapsible-container');

        const toggleListItem = document.createElement('li');
        toggleListItem.id = 'cn-sidebar-toggle-li';
        let isCollapsed = localStorage.getItem('cnSidebarCollapsed') === 'true';

        // Set initial icon and text state in the DOM creation (V2.0 BUGGED ARROW LOGIC)
        // Correct arrows: Left arrow (fa-chevron-left) should mean 'Expand Sidebar'
        // Right arrow (fa-chevron-right) should mean 'Collapse Sidebar'
        const initialIconClass = isCollapsed ? 'fa fa-chevron-left' : 'fa fa-chevron-right';
        const initialButtonText = isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar';

        toggleListItem.innerHTML = `<button class="ipsButton ipsButton_important ipsButton_medium" type="button">
            <i class="${initialIconClass}" aria-hidden="true"></i>
            <span class="ipsResponsive_hidePhone">&nbsp;${initialButtonText}</span>
        </button>`;


        // Insert it after the first item (Reply/Start New Topic)
        if (mainToolList.children.length > 0) {
            const isForumIndex = window.location.pathname === '/forums/' || window.location.pathname.match(/\/forums\/forum\/\d+-/);

            if (isForumIndex && mainToolList.children.length === 1) {
                 mainToolList.appendChild(toggleListItem);
            } else {
                 mainToolList.insertBefore(toggleListItem, mainToolList.children[1]);
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
    // Execute immediately after document parsing (document-idle) for best performance
    initPermalinks();
    setupCollapsibleHeader();
    setupCollapsibleSidebar();
})();
