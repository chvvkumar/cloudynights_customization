// ==UserScript==
// @name         CloudyNights Blue Theme
// @namespace    https://github.com/chvvkumar/cloudynights_customization
// @version      1.0.0
// @description  Modern blue dark theme for CloudyNights forum with improved readability and aesthetics
// @author       chvvkumar
// @match        https://www.cloudynights.com/*
// @match        https://cloudynights.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloudynights.com
// @grant        GM_addStyle
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/chvvkumar/cloudynights_customization/refs/heads/main/cloudynights-blue-theme.user.js
// @downloadURL  https://raw.githubusercontent.com/chvvkumar/cloudynights_customization/refs/heads/main/cloudynights-blue-theme.user.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
/* ========================================
COLOR VARIABLES & ROOT SETTINGS
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
GLOBAL & BODY STYLES
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
HEADER & NAVIGATION
======================================== */
#ipsLayout_header {
background: linear-gradient(180deg, var(--secondary-bg) 0%, var(--tertiary-bg) 100%) !important;
border-bottom: 1px solid var(--border-color) !important;
box-shadow: var(--shadow-md) !important;
}

.ipsNavBar_primary {
background-color: transparent !important;
}

.ipsNavBar_primary > ul > li > a {
color: var(--text-primary) !important;
padding: 8px 12px !important;
border-radius: var(--radius-sm) !important;
transition: all 0.3s ease !important;
font-weight: 500 !important;
}

.ipsNavBar_primary > ul > li > a:hover {
background-color: rgba(74, 158, 255, 0.1) !important;
color: var(--accent-primary) !important;
transform: translateY(-1px);
}

.ipsNavBar_active {
background-color: rgba(74, 158, 255, 0.15) !important;
border-bottom: 2px solid var(--accent-primary) !important;
}

/* ========================================
CONTENT CONTAINERS & BOXES
======================================== */
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

.ipsWidget {
background-color: var(--secondary-bg) !important;
border: 1px solid var(--border-color) !important;
border-radius: var(--radius-md) !important;
box-shadow: var(--shadow-sm) !important;
overflow: hidden !important;
}

.ipsWidget_inner {
background-color: transparent !important;
padding: 6px !important;
}

.ipsWidget_title {
background: linear-gradient(90deg, var(--tertiary-bg) 0%, var(--secondary-bg) 100%) !important;
color: var(--text-primary) !important;
padding: 8px 12px !important;
font-size: 14px !important;
font-weight: 600 !important;
letter-spacing: 0.3px !important;
border-bottom: 2px solid var(--accent-primary) !important;
}

/* ========================================
FORUM LIST & DATA ITEMS
======================================== */
.cForumRow {
background-color: var(--secondary-bg) !important;
border-radius: var(--radius-md) !important;
border: 1px solid var(--border-color) !important;
margin-bottom: 2px !important;
overflow: hidden !important;
transition: all 0.3s ease !important;
}

.cForumRow:hover {
border-color: var(--accent-primary) !important;
box-shadow: var(--shadow-md) !important;
transform: translateY(-2px) !important;
}

.ipsDataItem {
background-color: var(--tertiary-bg) !important;
border-bottom: 1px solid var(--border-color) !important;
padding: 6px !important;
transition: all 0.2s ease !important;
}

.ipsDataItem:hover {
background-color: rgba(74, 158, 255, 0.05) !important;
border-left: 3px solid var(--accent-primary) !important;
padding-left: 3px !important;
}

.ipsDataItem_title {
color: var(--text-primary) !important;
font-size: 14px !important;
font-weight: 600 !important;
transition: color 0.2s ease !important;
}

.ipsDataItem_title:hover {
color: var(--accent-primary) !important;
}

/* ========================================
TYPOGRAPHY
======================================== */
h1, h2, h3, h4, h5, h6,
.ipsType_sectionTitle,
.ipsType_pageTitle {
color: var(--text-primary) !important;
font-weight: 700 !important;
letter-spacing: -0.02em !important;
margin-top: 4px !important;
margin-bottom: 4px !important;
}

.ipsType_sectionTitle {
background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)) !important;
-webkit-background-clip: text !important;
-webkit-text-fill-color: transparent !important;
background-clip: text !important;
padding: 4px 0 !important;
font-size: 16px !important;
}

.ipsType_light,
.ipsType_minor {
color: var(--text-secondary) !important;
}

.ipsType_medium {
color: var(--text-primary) !important;
}

a {
color: var(--accent-primary) !important;
text-decoration: none !important;
transition: all 0.2s ease !important;
}

a:hover {
color: var(--accent-secondary) !important;
text-decoration: none !important;
}

/* ========================================
BUTTONS
======================================== */
.ipsButton {
border-radius: var(--radius-sm) !important;
padding: 3px 10px !important;
font-weight: 600 !important;
font-size: 13px !important;
transition: all 0.3s ease !important;
border: none !important;
box-shadow: var(--shadow-sm) !important;
line-height: 1.2 !important;
}

.ipsButton_primary,
.ipsButton_important {
background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%) !important;
color: #ffffff !important;
}

.ipsButton_primary:hover,
.ipsButton_important:hover {
background: linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%) !important;
box-shadow: var(--shadow-md) !important;
transform: translateY(-2px) !important;
}

.ipsButton_alternate,
.ipsButton_light {
background-color: var(--tertiary-bg) !important;
color: var(--text-primary) !important;
border: 1px solid var(--border-light) !important;
}

.ipsButton_alternate:hover,
.ipsButton_light:hover {
background-color: var(--border-light) !important;
border-color: var(--accent-primary) !important;
transform: translateY(-1px) !important;
}

.ipsButton_veryLight {
background-color: rgba(74, 158, 255, 0.1) !important;
color: var(--accent-primary) !important;
border: 1px solid rgba(74, 158, 255, 0.2) !important;
}

.ipsButton_veryLight:hover {
background-color: rgba(74, 158, 255, 0.2) !important;
}

/* ========================================
FORMS & INPUTS
======================================== */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="search"],
textarea,
select {
background-color: var(--tertiary-bg) !important;
color: var(--text-primary) !important;
border: 1px solid var(--border-color) !important;
border-radius: var(--radius-sm) !important;
padding: 6px 10px !important;
transition: all 0.3s ease !important;
}

input:focus,
textarea:focus,
select:focus {
border-color: var(--accent-primary) !important;
box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1) !important;
outline: none !important;
background-color: var(--secondary-bg) !important;
}

/* ========================================
POSTS & CONTENT
======================================== */
.cPost {
background-color: var(--secondary-bg) !important;
border: 1px solid var(--border-color) !important;
border-radius: var(--radius-md) !important;
margin-bottom: 3px !important;
box-shadow: var(--shadow-sm) !important;
}

.cPost:hover {
border-color: var(--border-light) !important;
box-shadow: var(--shadow-md) !important;
}

blockquote {
background-color: var(--tertiary-bg) !important;
border-left: 4px solid var(--accent-primary) !important;
padding: 6px !important;
border-radius: var(--radius-sm) !important;
color: var(--text-secondary) !important;
margin: 4px 0 !important;
}

pre, code {
background-color: #0d1117 !important;
border: 1px solid var(--border-color) !important;
border-radius: var(--radius-sm) !important;
color: #79c0ff !important;
padding: 6px !important;
font-family: 'Fira Code', 'Consolas', monospace !important;
}

/* ========================================
BREADCRUMBS
======================================== */
.ipsBreadcrumb {
background-color: transparent !important;
padding: 4px 0 !important;
}

.ipsBreadcrumb li {
color: var(--text-secondary) !important;
}

.ipsBreadcrumb a {
color: var(--text-secondary) !important;
transition: color 0.2s ease !important;
}

.ipsBreadcrumb a:hover {
color: var(--accent-primary) !important;
}

/* ========================================
SIDEBAR
======================================== */
#ipsLayout_sidebar {
background-color: transparent !important;
}

.ipsAreaBackground_reset {
background-color: var(--secondary-bg) !important;
border-radius: var(--radius-md) !important;
}

/* ========================================
FOOTER
======================================== */
#ipsLayout_footer {
background: linear-gradient(180deg, var(--secondary-bg) 0%, var(--primary-bg) 100%) !important;
border-top: 1px solid var(--border-color) !important;
padding: 12px 0 !important;
margin-top: 12px !important;
}

/* ========================================
NOTIFICATIONS & BADGES
======================================== */
.ipsNotificationCount {
background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
color: white !important;
border-radius: 12px !important;
padding: 1px 5px !important;
font-size: 10px !important;
font-weight: 700 !important;
box-shadow: var(--shadow-sm) !important;
}

.ipsItemStatus {
border-radius: 50% !important;
box-shadow: var(--shadow-sm) !important;
}

/* ========================================
MENUS & DROPDOWNS
======================================== */
.ipsMenu {
background-color: var(--secondary-bg) !important;
border: 1px solid var(--border-color) !important;
border-radius: var(--radius-md) !important;
box-shadow: var(--shadow-lg) !important;
padding: 2px !important;
}

.ipsMenu_item {
color: var(--text-primary) !important;
padding: 4px 10px !important;
border-radius: var(--radius-sm) !important;
transition: all 0.2s ease !important;
}

.ipsMenu_item:hover {
background-color: rgba(74, 158, 255, 0.1) !important;
color: var(--accent-primary) !important;
}

/* ========================================
TABLES
======================================== */
table {
background-color: var(--secondary-bg) !important;
border: 1px solid var(--border-color) !important;
border-radius: var(--radius-md) !important;
}

th {
background-color: var(--tertiary-bg) !important;
color: var(--text-primary) !important;
font-weight: 600 !important;
padding: 6px !important;
border-bottom: 2px solid var(--accent-primary) !important;
}

td {
padding: 6px !important;
border-bottom: 1px solid var(--border-color) !important;
color: var(--text-primary) !important;
}

tr:hover td {
background-color: rgba(74, 158, 255, 0.05) !important;
}

/* ========================================
PAGINATION
======================================== */
.ipsPagination {
background-color: var(--secondary-bg) !important;
border-radius: var(--radius-md) !important;
padding: 2px !important;
}

.ipsPagination a {
background-color: var(--tertiary-bg) !important;
color: var(--text-primary) !important;
border-radius: var(--radius-sm) !important;
padding: 3px 8px !important;
margin: 0 1px !important;
transition: all 0.2s ease !important;
line-height: 1.2 !important;
}

.ipsPagination a:hover {
background-color: var(--accent-primary) !important;
color: white !important;
transform: translateY(-1px) !important;
}

.ipsPagination_active a {
background-color: var(--accent-primary) !important;
color: white !important;
}

/* ========================================
SCROLLBAR STYLING
======================================== */
::-webkit-scrollbar {
width: 10px !important;
height: 10px !important;
}

::-webkit-scrollbar-track {
background: var(--primary-bg) !important;
}

::-webkit-scrollbar-thumb {
background: var(--tertiary-bg) !important;
border-radius: 5px !important;
border: 2px solid var(--primary-bg) !important;
}

::-webkit-scrollbar-thumb:hover {
background: var(--accent-primary) !important;
}

/* ========================================
UTILITY CLASSES
======================================== */
.ipsSpacer_bottom {
margin-bottom: 4px !important;
}

.ipsPad {
padding: 8px !important;
}

.ipsType_center {
text-align: center !important;
}

/* ========================================
RESPONSIVE ADJUSTMENTS
======================================== */
@media (max-width: 768px) {
.ipsBox {
padding: 6px !important;
border-radius: var(--radius-sm) !important;
}

.ipsWidget_title {
    padding: 6px 10px !important;
    font-size: 13px !important;
}

.ipsDataItem {
    padding: 6px !important;
}


}

/* ========================================
ANIMATIONS
======================================== */
@keyframes fadeIn {
from {
opacity: 0;
transform: translateY(10px);
}
to {
opacity: 1;
transform: translateY(0);
}
}

.ipsBox,
.ipsWidget,
.cForumRow {
animation: fadeIn 0.4s ease-out !important;
}

/* ========================================
LOADING STATES
======================================== */
.ipsLoading {
background: linear-gradient(90deg, var(--secondary-bg) 25%, var(--tertiary-bg) 50%, var(--secondary-bg) 75%) !important;
background-size: 200% 100% !important;
animation: loading 1.5s ease-in-out infinite !important;
}

@keyframes loading {
0% {
background-position: 200% 0;
}
100% {
background-position: -200% 0;
}
}

/* ========================================
CUSTOM LAYOUT (PERMANENT HIDE/FULL WIDTH)
======================================== */

/* Remove JavaScript-injected classes from the global layout style */
.ipsLayout_contentArea.ipsLayout_contentArea {
    /* Revert to default layout behavior, often block or auto */
    display: block !important; 
    flex-direction: initial; 
}

.cn-main-container {
    /* Revert to default behavior */
    display: block !important;
    flex: initial !important;
    width: auto !important;
}

.cn-main-content {
    /* Revert to default behavior */
    flex-grow: initial !important;
    width: auto !important;
    min-width: initial !important;
}

/* Target the toggle button added by JS and hide it globally */
#cn-sidebar-toggle-btn {
    display: none !important; 
}


/* Desktop Styles (Screen width >= 1000px) */
@media (min-width: 1000px) {
    
    /* 1. Permanently hide the sidebar container */
    #ipsLayout_sidebar {
        display: none !important;
        width: 0 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* 2. Override fixed layout width for edge-to-edge expansion */
    .ipsLayout_container,
    #ipsLayout_body {
        max-width: none !important; /* Allow layout to use full browser width */
    }

    /* 3. Ensure the main content area occupies the full width */
    #ipsLayout_mainArea {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important; /* Remove any centering/margin that might exist */
        padding-right: 20px !important; /* Apply standard right padding */
    }

    /* Important: Override any legacy floats/margins IPS might apply for the sidebar */
    #ipsLayout_contentWrapper {
        float: none !important;
        width: auto !important;
    }
}

/* Mobile/Narrow View (Keep standard IPS behavior but ensure sidebar remains hidden) */
@media (max-width: 1000px) {
    #ipsLayout_sidebar {
        display: none !important;
        width: 0 !important;
    }
    
    #ipsLayout_mainArea {
        width: 100% !important;
        padding-right: 20px !important;
    }
    
    .ipsLayout_container,
    #ipsLayout_body {
        max-width: none !important;
    }
}
/* ========================================
END OF CUSTOM LAYOUT (PERMANENT HIDE/FULL WIDTH)
======================================== */
    `;

    // Inject the CSS using GM_addStyle
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        // Fallback for browsers that don't support GM_addStyle
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }
})();
