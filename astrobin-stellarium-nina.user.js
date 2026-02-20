// ==UserScript==
// @name         AstroBin to Stellarium & NINA (Optimized)
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  Adds Stellarium focus icons and NINA framing buttons to AstroBin. Supports both classic and new Angular layouts.
// @author       Dev
// @match        https://www.astrobin.com/*
// @match        https://app.astrobin.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// @updateURL    https://raw.githubusercontent.com/chvvkumar/cloudynights_customization/main/astrobin-stellarium-nina.user.js
// @downloadURL  https://raw.githubusercontent.com/chvvkumar/cloudynights_customization/main/astrobin-stellarium-nina.user.js

// ==/UserScript==

(function() {
    'use strict';

    // --------------------------------------------------------------------------------
    // --- CONSTANTS AND CONFIGURATION ---
    // --------------------------------------------------------------------------------

    // Base64 encoded icon used for the Stellarium button.
    // This is embedded directly to avoid external dependencies or broken links.
    const ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE/0lEQVR4nO2WXUxbZRzGudJrvewLNOe09Lulh7YwAqWlLYl8rCibibotAbOhYzgkkxldtjHGpuDU9ZzS8jG+RNxkw8R9mBjQ7MKwyZjMjC2b88LEG+fmhXMXZhEecw6Uz56O069p0n/yJISWl+f3/p/3/75paalKVapS9b8oSzpnZGQ+HyPzzTCEfcgQFnHWQ2Ftme+4Kf24IW7GlUrf0wxhAwxhZxNgGuFkJr5/zIT163QHn4rdvIz9Nh6msuUsDDoOWoaDxjovLcMJvzPLRUBkvm9igjATXzAe5g06FhobJyqtlQcR7QYXfeZFYjM4OLFu8zqTuHHNKpmtHbDJ/WvilJ3h10sGEA5szDu/fvMaGwdTQQBtH46Hi9JH0gEIeyO0wOnRKxg5PQkp3eAzL8W8xsaBKQri6s07KLX3rVxPxl6PAsD3V2gB3vznI5MJ3X2NjYPL24/pWz/j/WMru2Am7INoOhBTfLRm6QDbG74QAM6NX1uzXtIBhFEpEaDzk+8EgEvXbv8HACzSzDvKT+DKzE8CwMT0reQBiB1iqRHqGZ4QzPM6Ozb95Dsg5RDvPXRh0Tyvo21jsQOUqAfgUfXDreqHU9kLO92NDfIALOlc2N1f3Qn+ecDfsI8z39R8QRidIfP8z2WOvvgAhJNH3Y/hoe+RJw+sowvid4GjondFbEIKd5HFFWC5nFm9yM3siAiRbfELN6zZHoCrsl8Ylfy0mbqxtOvTCxoauQxrJpc8gJD4eDEk/D/m3zb8ri6PyWpdvXlH+I6Y+YQD8CrO6oMlwy86mfjnAX/D8hPm8o+3hVl/dmxaOLDhMp90AF4uVR+sGZEjFa3SkgHAy63iOyEehUjKIxxKSQc2kyCqSSd2kC7sJN2oI92JATj56aRonNZrOoew8JAObCOdglExJa0DIRUKBzuyeSfxo5p0LZrcQwfRlvMxOovacbL0CM54W/DlC4dwflNzrAB98Kh7JAF41AOwiYxYC2GxiQTmjad347DJh6GSoxh/eT+u72zCr00N+LO5Dn+3vo7ZtlqgfYd0gALVPhgVG5FFm0BTNCiKAk2poaELwCi3oDCrGSXq/siTSdm7dqwSdjEu+3V+nCptxQ+1e/HHgV2ArwH4rA041wNcPANMnAcmvwamxqUD8IYfJxWdA6tyO1yqoChEbubSjW0jHGpIF+ozuuEv+ACXat7Bg5Y6YPAwMH4KmBoTzIZTQgBCUlBqoSsudWANgENxYuGwcthKOtEg78Lwc0fwy55GoGcfcHFU1HTSABZBaDVylNtWdIR/O/EPwCoSwJvyToxubMFvB3ZjJtiKr4LHMPDeQbS/3Yi3al9F9UsvYsvmKlR5K1BZUQ632w2XywW325UcgKWOaGBRVsOlmu+Ik2axVfcuXit5BTXeMngWjLkkSDIAf2BjgZjvSBbMhnzY7UWSDbuWyekomZMMoKZtc7ECLJfRaER+fj6Ki4vXbdzhcIBhGGg1hlnJAAb6+d/jCRCSUqmEyWRCbm4uCgsL4XQ6Vxi22+2w2WzQ6/VQKBTC3+i1uXclA1jo+t00Nb9AokXTtCCxzxhdeb1kgPkueO8nA4CKIL02715atLVB1/ishnI8elLm1SrjI6Ox/JmoAUIQBsp7P1lxohZiY9Dm3YvZ/PKyKHa9oacq76oo2xxNqeJuWqFQQJWlmeMPrFlTVhc346lKVapSlZbI+hcf/WQs2PjpSAAAAABJRU5ErkJggg==";

    // Color palette for consistent styling across the injected UI.
    const CLR = { 
        ok: '#a6e3a1',    // Green for success
        err: '#f38ba8',   // Red for error
        border: '#45475a',// Dark grey for borders
        text: '#cdd6f4',  // Light grey for text
        blue: '#89b4fa'   // Blue for highlights/links
    };

    // CSS styles to be injected into the page.
    // Handles layout for both classic AstroBin and the new Angular/SPA layout.
    const CSS = `
        /* Hidden by default, shown when injected */
        .ab-nina-li { display: none; }
        
        /* Wrapper for the classic layout injection */
        .ab-nina-wrap { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3px; height: 100%; padding: 0 12px; border-left: 1px solid #444; margin-left: 5px; pointer-events: auto; }
        
        /* Coordinate display text */
        .ab-nina-coords { font-family: monospace; font-size: 10px; color: #bac2de; white-space: nowrap; line-height: 1; margin-bottom: 1px; }
        
        /* Row container for buttons */
        .ab-nina-row { display: flex; align-items: center; justify-content: space-evenly; width: 100%; gap: 6px; }
        
        /* Pill-shaped buttons for NINA instances */
        .ab-nina-pill { display: flex; align-items: center; justify-content: center; width: 34px; height: 20px; border-radius: 100px; background: #313244; border: 1px solid ${CLR.border}; transition: border-color 0.2s, background 0.2s; box-sizing: border-box; }
        .ab-nina-pill:hover { border-color: ${CLR.blue}; background: #45475a; }
        .ab-nina-pill-wide { width: auto; padding: 0 8px; }
        
        /* General button styling */
        .ab-nina-btn { cursor: pointer; text-decoration: none; }
        
        /* Stellarium icon wrapper */
        .ab-s-wrap { display: inline-flex; align-items: center; cursor: pointer; margin-left: 5px; }
        .ab-s-icon { width: 18px; height: 18px; vertical-align: middle; }
        
        /* Pill internal icon and label */
        .ab-pill-icon { width: 14px; height: 14px; opacity: 0.9; }
        .ab-pill-label { font-size: 9px; font-weight: bold; color: ${CLR.text}; }
        
        /* Icons in titles */
        .ab-title-icons { font-size: 0.6em; }
        
        /* Cog/Settings icon container */
        .ab-cog-li { z-index: 9999; position: relative; }
        .ab-cog-link { cursor: pointer; display: flex; align-items: center; height: 100%; padding: 0 10px; position: relative; z-index: 10000; }
        .ab-cog-svg { width: 16px; height: 16px; fill: currentColor; }
        
        /* Configuration Modal Overlay */
        .ab-cfg-ol { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        
        /* Configuration Modal Window */
        .ab-cfg-win { background: #1e1e2e; color: ${CLR.text}; border-radius: 12px; padding: 24px; min-width: 420px; font-family: system-ui, sans-serif; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid #313244; }
        
        /* Config Title */
        .ab-cfg-title { margin: 0 0 20px; font-size: 18px; color: ${CLR.blue}; font-weight: 600; }
        
        /* Config Labels and Fields */
        .ab-cfg-label { display: block; font-size: 12px; color: #9399b2; margin-bottom: 6px; }
        .ab-cfg-field { margin-bottom: 20px; }
        
        /* Config Row (for NINA instances) */
        .ab-cfg-row { margin-bottom: 12px; padding: 12px; background: #313244; border-radius: 8px; display: grid; grid-template-columns: 30px 1fr 2fr; gap: 10px; align-items: center; }
        
        /* Config Inputs */
        .ab-cfg-in { padding: 6px; background: #181825; color: ${CLR.text}; border: 1px solid ${CLR.border}; border-radius: 4px; font-size: 12px; width: 100%; }
        
        /* Config Footer (Buttons) */
        .ab-cfg-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .ab-cfg-btn { padding: 8px 20px; background: transparent; color: #a6adc8; border: 1px solid ${CLR.border}; border-radius: 6px; cursor: pointer; }
        .ab-cfg-btn-save { padding: 8px 24px; background: ${CLR.blue}; color: #11111b; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
        
        /* Utility text colors */
        .ab-txt-blue { color: ${CLR.blue}; }
        .ab-txt-blue + .ab-txt-blue { margin-left: 6px; }
        .ab-txt-pink { color: #f5c2e7; margin-left: 6px; }
        
        /* New Layout Specifics */
        .ab-nina-meta-item, .ab-meta-cog { cursor: pointer; }
        .ab-nina-meta-item { display: none; }
        .ab-nina-meta-header { cursor: default; width: 100%; flex-basis: 100%; }
        .ab-meta-cog:hover { color: ${CLR.blue}; }
    `;

    // SVG for the settings cog icon.
    const COG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ab-cog-svg"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.1-28.2 18.2-44 24l-10.5 57.5c-1.7 9.3-8.9 16.5-18.2 17.8c-12.8 1.8-26 2.8-39.4 2.8s-26.5-.9-39.4-2.8c-9.4-1.3-16.5-8.5-18.2-17.8l-10.5-57.5c-15.8-5.8-30.7-13.9-44-24l-55.7 17.7c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.1 28.2-18.2 44-24l10.5-57.5c1.7-9.3 8.9-16.5 18.2-17.8C224.5 .9 237.7 0 251.1 0h9.8c12.8 0 26 .9 39.4 2.8c9.4 1.3 16.5 8.5 18.2 17.8l10.5 57.5c15.8 5.8 30.7 13.9 44 24l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>';

    // --- STATE & SETUP ---
    
    // CFG object holds the user configuration for Stellarium and NINA instances.
    // It retrieves values from Tampermonkey storage (GM_getValue) or defaults to localhosts.
    const CFG = {
        stellarium: GM_getValue('stellariumHost', "http://localhost:8090"),
        nina: JSON.parse(GM_getValue('ninaHosts', JSON.stringify([
            { name: "Localhost", url: "http://localhost:1888", enabled: true },
            { name: "Astromele2", url: "", enabled: false }, // Placeholder example
            { name: "Astromele3", url: "", enabled: false }, // Placeholder example
        ])))
    };

    // Regex to identify astronomical catalog names in text (e.g., M31, NGC 7000).
    const CATALOG_REGEX = /\b(M|NGC|IC|Mel|Cr|Col|Sharpless|Sh2|LBN|LDN|Abell|HD|SAO|HIP|B|vdB|UGC|PGC|ESO|Mrk|Gum|RCW)\s*-?\s*(\d+)\b/ig;
    
    // Set to track processed links to avoid duplicates.
    const seen = new Set();
    
    // Array to hold references to injected NINA UI elements for updates.
    const ninaEls = [];
    
    // Holds the currently detected coordinates (RA, DEC, Rotation).
    let coords = null;

    // Helper to detect if the page is using the new Angular layout (<astrobin-root>).
    const isNew = () => !!document.querySelector('astrobin-root');

    // Inject the CSS styles into the document head immediately.
    const styleEl = document.createElement('style');
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    // --------------------------------------------------------------------------------
    // --- UTILITIES ---
    // --------------------------------------------------------------------------------
    
    const log  = (...a) => console.log('[AB-Script]', ...a);
    const warn = (...a) => console.warn('[AB-Script]', ...a);
    const logErr = (...a) => console.error('[AB-Script]', ...a);

    // Wrapper for GM_xmlhttpRequest to simplify GET calls.
    const http = (url, method, cb, errCb) => GM_xmlhttpRequest({ method, url, onload: cb, onerror: errCb });

    // Standard headers for form data.
    const FORM_HDR = { "Content-Type": "application/x-www-form-urlencoded" };
    
    // Specialized wrapper for posting data to Stellarium API.
    const stelPost = (path, data, cb, errCb) => GM_xmlhttpRequest({
        method: "POST", url: `${CFG.stellarium}/api/${path}`, data, headers: FORM_HDR,
        onload: cb || (() => {}), onerror: errCb || (() => {})
    });

    // Helper to create DOM elements with class, innerHTML, and attributes.
    const createEl = (tag, cls, html = '', attrs = {}) => {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (html) el.innerHTML = html;
        Object.assign(el, attrs);
        return el;
    };

    // Helper to create a click handler that prevents default action and propagation.
    const stopAndRun = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };

    // Visual feedback for pill buttons.
    // Dims the button, then restores opacity and sets border color based on success/failure.
    const pillFeedback = (pill) => {
        pill.style.opacity = '0.5';
        return (color) => {
            pill.style.opacity = '1';
            pill.style.borderColor = color;
            setTimeout(() => { pill.style.borderColor = CLR.border; }, 3000);
        };
    };

    // Mirrors Angular's _ngcontent attributes from a source element to a destination element.
    // This allows injected elements to inherit Angular view encapsulation styles.
    const mirrorNg = (src, dst) => {
        for (const a of src.attributes)
            if (a.name.startsWith('_ngcontent')) dst.setAttribute(a.name, a.value);
    };

    // Formats catalog names for consistency (e.g., standardizing Sharpless names).
    const fmtName = (type, number) => {
        const t = type.toUpperCase();
        return (t === 'SHARPLESS' || t === 'SH2') ? `Sh 2-${number}` : `${t} ${number}`;
    };

    // Helper to safely parse float from a selector's text content.
    const qf = (parent, sel) => parseFloat(parent.querySelector(sel)?.textContent) || 0;

    // --------------------------------------------------------------------------------
    // --- BUTTON ACTIONS ---
    // --------------------------------------------------------------------------------

    /**
     * Sends coordinates to a specified NINA instance.
     * @param {string} host - The base URL of the NINA instance.
     * @param {number} ra - Right Ascension.
     * @param {number} dec - Declination.
     * @param {HTMLElement} pill - The UI element to update with feedback.
     */
    function sendNina(host, ra, dec, pill) {
        if (!pill) return;
        log(`Sending to NINA (${host}): RA=${ra}, DEC=${dec}`);
        const reset = pillFeedback(pill);
        
        // Step 1: Set Coordinates
        http(`${host}/v2/api/framing/set-coordinates?RAangle=${ra}&DecAngle=${dec}`, "GET", (res) => {
            log(`NINA Response (${host}): ${res.status} ${res.statusText}`);
            reset(res.status === 200 ? CLR.ok : CLR.err);
            
            // Step 2: Set Rotation (if available and step 1 succeeded)
            if (res.status === 200 && coords?.rot !== null) {
                log(`Sending Rotation to NINA: ${coords.rot}`);
                http(`${host}/v2/api/framing/set-rotation?rotation=${coords.rot}`, "GET", () => {});
            } else if (res.status !== 200) {
                logErr(`NINA Error Body: ${res.responseText}`);
            }
        }, (err) => {
            logErr('NINA Network Error:', err);
            reset(CLR.err);
        });
    }

    /**
     * Sends coordinates to Stellarium using its Remote Control API.
     * @param {number} ra - Right Ascension.
     * @param {number} dec - Declination.
     * @param {HTMLElement} pill - The UI element to update with feedback.
     */
    function sendStellariumCoords(ra, dec, pill) {
        if (!pill) return;
        log(`Sending Coords to Stellarium: RA=${ra}, DEC=${dec}`);
        const reset = pillFeedback(pill);
        
        // Execute a script in Stellarium to move the view.
        const script = `core.moveToRaDecJ2000("${ra.toFixed(6)}d", "${dec.toFixed(6)}d", 3);`;
        log(`Running Stellarium script: ${script}`);
        
        stelPost('scripts/direct', `code=${encodeURIComponent(script)}`, (res) => {
            log(`Script Response: ${res.status} ${res.statusText}`);
            if (res.status === 200) {
                reset(CLR.ok);
                // Adjust FOV after moving
                setTimeout(() => stelPost('main/fov', 'fov=20', () => log('FOV set to 20°')), 3000);
            } else {
                logErr('Script Error:', res.responseText);
                reset(CLR.err);
            }
        }, (err) => {
            logErr('Network Error:', err);
            reset(CLR.err);
        });
    }

    /**
     * Searches for an object by name in Stellarium and focuses on it.
     * @param {string} name - The object name (e.g., "M 31").
     * @param {HTMLElement} img - The icon element to animate.
     */
    function sendStellariumName(name, img) {
        if (img) img.style.opacity = '0.5';
        log(`Searching Object in Stellarium: ${name}`);
        
        // Animation helper for success/failure visual cue
        const anim = (ok) => {
            if (!img) return;
            img.style.opacity = '1';
            img.style.filter = ok
                ? 'sepia(100%) hue-rotate(100deg) saturate(500%)' // Greenish
                : 'sepia(100%) hue-rotate(-50deg) saturate(500%)'; // Reddish
            setTimeout(() => { img.style.filter = 'none'; }, 2000);
        };
        
        // Use Stellarium's focus API to find the object
        stelPost('main/focus', `target=${encodeURIComponent(name)}`, (res) => {
            log(`Object Search Response: ${res.status}`);
            if (res.status === 200) {
                log('Object Found. Enabling Tracking & Slew.');
                // If found, enable tracking and move to selection
                stelPost('main/action', 'id=actionSetTracking_True', () =>
                    stelPost('main/action', 'id=actionMoveToSelected', () => anim(true))
                );
            } else {
                warn(`Object NOT found: ${name} (Response: ${res.responseText})`);
                anim(false);
            }
        }, () => anim(false));
    }

    // --------------------------------------------------------------------------------
    // --- UI HELPERS ---
    // --------------------------------------------------------------------------------

    // Creates the small Stellarium icon appended to object links.
    function createIcon(name) {
        const wrap = createEl('span', 'ab-s-wrap');
        const img = createEl('img', 'ab-s-icon', '', { src: ICON_SRC, title: `Center in Stellarium: ${name}` });
        wrap.appendChild(img);
        wrap.onclick = stopAndRun(() => sendStellariumName(name, img));
        return wrap;
    }

    // Creates a pill-shaped button for the NINA interface.
    function makePill(label, wide) {
        const pill = createEl('div', 'ab-nina-pill' + (wide ? ' ab-nina-pill-wide' : ''),
            `<span class="ab-pill-label">${label}</span>`);
        return pill;
    }

    // --------------------------------------------------------------------------------
    // --- UI UPDATES ---
    // --------------------------------------------------------------------------------

    /**
     * Updates the injected UI elements with the latest coordinates.
     * This is called whenever the scan function finds valid coordinates.
     */
    function updateNinaUI() {
        if (!coords) return;
        
        // Build the HTML for the coordinate display
        let html = `<span class="ab-txt-blue">RA</span> ${coords.ra.toFixed(3)}° <span class="ab-txt-blue">DEC</span> ${coords.dec.toFixed(3)}°`;
        if (coords.rot !== null) html += `<span class="ab-txt-pink">ROT</span> ${coords.rot.toFixed(1)}°`;

        ninaEls.forEach(el => {
            if (!document.body.contains(el)) return;
            
            // Handle different layout structures
            if (el.classList.contains('ab-meta-section')) {
                // New layout: show hidden items
                el.querySelectorAll('.ab-nina-meta-item').forEach(item => item.style.removeProperty('display'));
                return;
            }
            
            // Classic layout: show list item and update text
            el.style.display = 'list-item';
            const lbl = el.querySelector('.ab-nina-coords');
            if (lbl) lbl.innerHTML = html;
        });
    }

    // --------------------------------------------------------------------------------
    // --- LAYOUT INJECTION ---
    // --------------------------------------------------------------------------------

    // Main entry point for UI injection. Detects layout type and dispatches.
    function injectConfig() {
        if (document.getElementById('ab-nina-script-injected')) return; // Prevent double injection
        isNew() ? injectNewLayoutUI() : injectClassicLayoutUI();
    }

    /**
     * Injects the UI for the new Angular-based AstroBin layout.
     * Hooks into the `.metadata-striped` container.
     */
    function injectNewLayoutUI() {
        const metaStrip = document.querySelector('div.metadata-striped');
        if (!metaStrip) return;

        const section = createEl('div', 'metadata-section ab-meta-section', '', { id: 'ab-nina-script-injected' });
        const activeHosts = CFG.nina.filter(h => h.enabled && h.url);

        if (activeHosts.length) {
            // 1. Create Header
            const header = createEl('div', 'metadata-header d-flex justify-content-between ab-nina-meta-item ab-nina-meta-header');
            const existingHeader = metaStrip.querySelector('.metadata-header');
            const headerSpan = createEl('span', '', ' Send coordinates to: ');
            
            // Attempt to mimic existing Angular styles
            if (existingHeader) {
                mirrorNg(existingHeader, header);
                const existingSpan = existingHeader.querySelector('span');
                if (existingSpan) mirrorNg(existingSpan, headerSpan);
            }
            header.appendChild(headerSpan);
            section.appendChild(header);

            // 2. Create Stellarium Button
            const stelItem = createEl('div', 'metadata-item ab-nina-meta-item', '', { title: 'Center Coordinates in Stellarium' });
            const stelImg = createEl('img', 'ab-s-icon', '', { src: ICON_SRC });
            stelItem.appendChild(stelImg);
            stelItem.onclick = stopAndRun(() => { if (coords) sendStellariumCoords(coords.ra, coords.dec, stelItem); });
            section.appendChild(stelItem);

            // 3. Create NINA Buttons
            activeHosts.forEach(host => {
                const item = createEl('div', 'metadata-item ab-nina-meta-item', '', { title: `Send to ${host.name}` });
                const iconDiv = createEl('div', 'metadata-icon');
                const pill = makePill(host.name[0].toUpperCase(), false);
                iconDiv.appendChild(pill);
                item.appendChild(iconDiv);
                item.onclick = stopAndRun(() => { if (coords) sendNina(host.url, coords.ra, coords.dec, pill); });
                section.appendChild(item);
            });

            ninaEls.push(section);
        }

        // 4. Config Cog Icon
        const cogItem = createEl('div', 'metadata-item ab-meta-cog', '', { title: 'Script Settings' });
        const cogIconDiv = createEl('div', 'metadata-icon');
        cogIconDiv.innerHTML = COG_SVG;
        cogItem.appendChild(cogIconDiv);
        cogItem.onclick = (e) => { e.preventDefault(); showConfig(); };
        section.appendChild(cogItem);
        metaStrip.appendChild(section);
    }

    /**
     * Injects the UI for the classic AstroBin layout.
     * Hooks near the `upload-button` in the sidebar/header area.
     */
    function injectClassicLayoutUI() {
        const uploadBtn = document.querySelector('a.upload-button');
        if (!uploadBtn) return;

        const parent = uploadBtn.parentElement;
        
        // 1. Create Config Cog
        const cogLi = createEl('li', 'd-none d-lg-block ab-cog-li', '', { id: 'ab-nina-script-injected' });
        const cog = createEl('a', 'ab-cog-link', '<i class="icon icon-cog"></i>');
        cog.onclick = (e) => { e.preventDefault(); showConfig(); };
        cogLi.appendChild(cog);
        parent.parentNode.insertBefore(cogLi, parent.nextSibling);

        const activeHosts = CFG.nina.filter(h => h.enabled && h.url);
        if (activeHosts.length) {
            // 2. Create Wrapper for Buttons
            const ninaLi = createEl('li', 'd-none d-lg-block ab-nina-li');
            const wrap = createEl('div', 'ab-nina-wrap');
            wrap.appendChild(createEl('div', 'ab-nina-coords')); // Coordinate display area

            const row = createEl('div', 'ab-nina-row');

            // 3. Stellarium Button
            const stelBtn = createEl('a', 'ab-nina-btn', '', { title: 'Center Coordinates in Stellarium' });
            const stelPill = createEl('div', 'ab-nina-pill');
            stelPill.appendChild(createEl('img', 'ab-pill-icon', '', { src: ICON_SRC }));
            stelBtn.appendChild(stelPill);
            stelBtn.onclick = stopAndRun(() => { if (coords) sendStellariumCoords(coords.ra, coords.dec, stelPill); });
            row.appendChild(stelBtn);

            // 4. NINA Buttons
            activeHosts.forEach(host => {
                const btn = createEl('a', 'ab-nina-btn', '', { title: `Send to ${host.name}` });
                const pill = makePill(host.name[0].toUpperCase(), false);
                btn.appendChild(pill);
                btn.onclick = stopAndRun(() => { if (coords) sendNina(host.url, coords.ra, coords.dec, pill); });
                row.appendChild(btn);
            });

            wrap.appendChild(row);
            ninaLi.appendChild(wrap);
            cogLi.parentNode.insertBefore(ninaLi, cogLi);
            ninaEls.push(ninaLi);
        }
    }

    // --------------------------------------------------------------------------------
    // --- SCANNER ---
    // --------------------------------------------------------------------------------

    /**
     * Scans the page for:
     * 1. Links containing astronomical object names (adds Stellarium icons).
     * 2. Coordinates (RA/DEC/Rotation) for the current image.
     */
    function scan() {
        injectConfig(); // Ensure UI is present

        // --- Link Scanning ---
        // Looks for text like "M31" or "NGC 7000" in <a> tags and appends the Stellarium icon.
        document.querySelectorAll('a').forEach(link => {
            if (seen.has(link)) return;
            const txt = (link.textContent || '').trim();
            if (txt.length < 2 || txt.length > 30) return; // Optimization: skip short/long text
            
            CATALOG_REGEX.lastIndex = 0;
            const match = CATALOG_REGEX.exec(txt);
            
            // Check if match covers most of the text to avoid false positives in long sentences
            if (match && match[0].length >= txt.length - 5) {
                const icon = createIcon(fmtName(match[1], match[2]));
                if (link.nextSibling) link.parentNode.insertBefore(icon, link.nextSibling);
                else link.parentNode.appendChild(icon);
                seen.add(link);
            }
        });

        // --- Coordinate Extraction ---
        let ra = null, dec = null, rot = null;

        // Method 1: Classic layout via <abbr> tags
        const rAbbr = document.querySelector('abbr.ra-coordinates');
        const dAbbr = document.querySelector('abbr.dec-coordinates');
        if (rAbbr && dAbbr) {
            ra = parseFloat(rAbbr.getAttribute('title'));
            dec = parseFloat(dAbbr.getAttribute('title'));
            
            // Orientation extraction
            const orientEl = [...document.querySelectorAll('strong.card-label')]
                .find(l => l.textContent.trim() === 'Orientation:');
            if (orientEl) {
                const m = orientEl.parentElement.textContent.match(/([-\d.]+)\s*degrees/);
                if (m) rot = parseFloat(m[1]);
            }
        }

        // Method 2: New layout via metadata components (HMS/DMS parsing)
        if (ra === null || dec === null || isNaN(ra) || isNaN(dec)) {
            const coordsEl = document.querySelector('span.coordinates');
            if (coordsEl) {
                const raEl = coordsEl.querySelector('span.ra');
                const decEl = coordsEl.querySelector('span.dec');
                if (raEl && decEl) {
                    // Convert HMS to Degrees
                    ra = qf(raEl, '.hours') * 15 + qf(raEl, '.minutes') * (15 / 60) + qf(raEl, '.seconds') * (15 / 3600);
                    
                    // Convert DMS to Degrees
                    const dDeg = qf(decEl, '.degrees');
                    const sign = dDeg < 0 ? -1 : 1;
                    dec = sign * (Math.abs(dDeg) + qf(decEl, '.minutes') / 60 + qf(decEl, '.seconds') / 3600);

                    // Rotation from location-arrow icon proximity
                    const locArrow = document.querySelector('fa-icon[icon="location-arrow"]');
                    if (locArrow) {
                        const metaItem = locArrow.closest('.metadata-item');
                        if (metaItem) {
                            const label = metaItem.querySelector('.metadata-label');
                            if (label) {
                                const rotMatch = label.textContent.trim().match(/([-\d.]+)/);
                                if (rotMatch) rot = parseFloat(rotMatch[1]);
                            }
                        }
                    }
                }
            }
        }

        // If valid coordinates found, update global state and UI
        if (ra !== null && dec !== null && !isNaN(ra) && !isNaN(dec)) {
            coords = { ra, dec, rot };
            updateNinaUI();
        }
    }

    // --------------------------------------------------------------------------------
    // --- CONFIG DIALOG ---
    // --------------------------------------------------------------------------------

    /**
     * Displays the configuration modal for setting API URLs and NINA instances.
     */
    function showConfig() {
        const ov = createEl('div', 'ab-cfg-ol');
        // Build modal HTML
        const d = createEl('div', 'ab-cfg-win', `
            <h3 class="ab-cfg-title">AstroBin Script Settings</h3>
            <div class="ab-cfg-field">
                <label class="ab-cfg-label">Stellarium API URL</label>
                <input id="cfg-stel" type="text" value="${CFG.stellarium}" class="ab-cfg-in">
            </div>
            <label class="ab-cfg-label" style="margin-bottom:10px">N.I.N.A. Instances</label>
            ${CFG.nina.map((h, i) => `
                <div class="ab-cfg-row">
                    <input id="cfg-e-${i}" type="checkbox" ${h.enabled ? 'checked' : ''} style="cursor:pointer">
                    <input id="cfg-n-${i}" type="text" value="${h.name}" placeholder="Name" class="ab-cfg-in">
                    <input id="cfg-u-${i}" type="text" value="${h.url}" placeholder="URL" class="ab-cfg-in">
                </div>
            `).join('')}
            <div class="ab-cfg-footer">
                <button id="cfg-x" class="ab-cfg-btn">Cancel</button>
                <button id="cfg-s" class="ab-cfg-btn-save">Save</button>
            </div>
        `);
        ov.appendChild(d);
        document.body.appendChild(ov);

        const $ = (sel) => d.querySelector(sel);
        
        // Cancel Action
        $('#cfg-x').onclick = () => ov.remove();
        
        // Save Action
        $('#cfg-s').onclick = () => {
            GM_setValue('stellariumHost', $('#cfg-stel').value.trim());
            GM_setValue('ninaHosts', JSON.stringify(
                CFG.nina.map((_, i) => ({
                    name: $(`#cfg-n-${i}`).value.trim() || `NINA ${i+1}`,
                    url: $(`#cfg-u-${i}`).value.trim(),
                    enabled: $(`#cfg-e-${i}`).checked
                }))
            ));
            ov.remove();
            location.reload(); // Reload to apply changes
        };
    }

    // --------------------------------------------------------------------------------
    // --- INITIALIZATION ---
    // --------------------------------------------------------------------------------

    // Debounce the scanner to avoid performance hits on rapid DOM changes (common in Angular apps).
    let scanTimer = null;
    const debouncedScan = () => { clearTimeout(scanTimer); scanTimer = setTimeout(scan, 300); };
    
    // Observer to detect page navigation and dynamic content loading.
    const observer = new MutationObserver(debouncedScan);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial scan run.
    scan();
})();
