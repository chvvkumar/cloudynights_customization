// ==UserScript==
// @name         AstroBin to Stellarium (Seamless)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Adds a native-looking "Stellarium Targets" row to AstroBin.
// @author       Dev
// @match        https://www.astrobin.com/*
// @match        https://app.astrobin.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    // Standard port for Stellarium. You need the Remote Control plugin enabled in the app for this to work.
    const STELLARIUM_HOST = "http://localhost:8090";
    
    // Regex to scrape standard catalog IDs (Messier, NGC, IC, etc.).
    // We look for these anywhere on the page because AstroBin's layout changes, but the text is usually reliable.
    const catalogRegex = /\b(M|NGC|IC|Mel|Cr|Col|Sharpless|Sh2|LBN|LDN)\s*-?\s*(\d+)\b/ig;
    
    // Use a Set to dedup because sometimes the page mentions "M42" twelve times.
    const foundObjects = new Set();

    // Polling to wait for the page to load.
    // AstroBin is dynamic, so we can't just run once at document_end.
    const init = setInterval(() => {
        // We anchor everything to the "DEC center" line. If that's not there, we aren't on an image page.
        const anchor = document.querySelector('abbr.dec-coordinates, .dec-coordinates');
        
        // If we found the anchor and haven't injected our row yet, let's go.
        if (anchor && !document.querySelector('#stellarium-row')) {
            clearInterval(init);
            
            // Give it a sec (1000ms) to ensure all the plate-solved text is actually rendered.
            setTimeout(() => {
                scanPageForObjects();
                createSeamlessRow(anchor);
            }, 1000); 
        }
    }, 2000);

    // Scrapes the body text for those catalog IDs.
    function scanPageForObjects() {
        const textContent = document.body.innerText;
        let match;
        
        // Loop through every match found in the text
        while ((match = catalogRegex.exec(textContent)) !== null) {
            let type = match[1].toUpperCase();
            
            // Cleanup: Stellarium is picky. "M" needs to be "M " (with space) sometimes, 
            // and "Sharpless" is usually "Sh2" in their db.
            if (type === 'M') type = 'M '; 
            if (type === 'SHARPLESS') type = 'Sh2';
            
            // Add to our unique set: "NGC 2244"
            foundObjects.add(`${type.trim()} ${match[2]}`);
        }
    }

    // This builds the UI. We want it to look like it belongs on AstroBin, not like a hacked-on widget.
    function createSeamlessRow(anchorElement) {
        // 1. Container: No background, just a transparent div to hold our line.
        const container = document.createElement('div');
        container.id = 'stellarium-row';
        container.style.cssText = 'margin-top: 8px; margin-bottom: 8px; line-height: 1.5; font-size: 14px;';
        
        // 2. The Label: Styled exactly like the "RA center:" and "DEC center:" labels on the site.
        const label = document.createElement('strong');
        label.textContent = 'Stellarium: ';
        label.style.color = '#fff'; 
        container.appendChild(label);

        // 3. The Chips Container: Holds our clickable targets.
        const chipsContainer = document.createElement('span');
        container.appendChild(chipsContainer);

        // Styling for the chips: rounded pills, dark gray, turning orange on hover.
        const chipStyle = `
            display: inline-block;
            margin: 0 4px 4px 0;
            padding: 2px 8px;
            background-color: #333; 
            border: 1px solid #555;
            color: #ddd;
            border-radius: 12px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s;
            text-decoration: none;
        `;

        // If we found objects (like M42), make a chip for each one.
        if (foundObjects.size > 0) {
            foundObjects.forEach(objName => {
                const btn = document.createElement('a'); 
                btn.textContent = objName;
                btn.style.cssText = chipStyle;
                
                // Native-feeling hover effects
                btn.onmouseenter = () => {
                    btn.style.borderColor = '#e67e22'; // That specific AstroBin orange
                    btn.style.color = '#fff';
                    btn.style.backgroundColor = '#444';
                };
                btn.onmouseleave = () => {
                    btn.style.borderColor = '#555';
                    btn.style.color = '#ddd';
                    btn.style.backgroundColor = '#333';
                };

                btn.onclick = (e) => {
                    e.preventDefault();
                    sendToStellarium(objName, btn);
                };
                chipsContainer.appendChild(btn);
            });
        }

        // 4. Always add a "Coords" fallback. Even if we found IDs, sometimes the plate solve is wrong 
        // or the user just wants the exact center framing.
        const coordsText = foundObjects.size > 0 ? "Coords 📍" : "Send Coordinates";
        createCoordChip(chipsContainer, chipStyle, coordsText);

        // Injection logic: Try to insert after the parent block of the DEC line.
        // If that fails, just append to the parent directly.
        const parentBlock = anchorElement.closest('div, p'); 
        if (parentBlock) {
            parentBlock.after(container);
        } else {
            anchorElement.parentElement.appendChild(container);
        }
    }

    // Helper for the "Coords" button since it has slightly different styling (dashed border)
    function createCoordChip(container, style, text) {
        const btn = document.createElement('a');
        btn.textContent = text;
        btn.style.cssText = style;
        btn.style.borderStyle = 'dashed'; // Dashed helps distinguish it from "real" targets
        btn.style.opacity = '0.8';
        
        btn.onmouseenter = () => { btn.style.borderColor = '#e67e22'; btn.style.opacity = '1'; };
        btn.onmouseleave = () => { btn.style.borderColor = '#555'; btn.style.opacity = '0.8'; };
        
        btn.onclick = (e) => {
            e.preventDefault();
            const ra = document.querySelector('.ra-coordinates')?.textContent;
            const dec = document.querySelector('.dec-coordinates')?.textContent;
            if(ra && dec) sendCoords(ra, dec, btn);
        };
        container.appendChild(btn);
    }

    // --- API Stuff ---

    // Sends a Named Target (e.g., "M 42"). 
    // This is better for Oculars plugin because it locks onto the object metadata.
    async function sendToStellarium(name, btn) {
        const originalText = btn.textContent;
        btn.textContent = '...';
        
        // We use a direct script here. It's cleaner than chaining REST calls.
        // 1. Select it. 2. Turn on tracking. 3. Zoom in a bit so user sees it.
        const script = `
            var target = "${name}";
            core.selectObjectByName(target, true);
            StelMovementMgr.setFlagTracking(true); 
            StelMovementMgr.autoZoomIn(4);
        `;
        postScript(script, btn, originalText);
    }

    // Sends Raw Coordinates.
    // Useful if the object is obscure (no catalog ID) or if we just want the framing.
    async function sendCoords(ra, dec, btn) {
        const originalText = btn.textContent;
        btn.textContent = '...';
        
        const raDec = parseRAToDecimal(ra);
        const decDec = parseDECToDecimal(dec);
        
        // Move to J2000 coordinates and force tracking on.
        const script = `
            core.moveToRaDecJ2000("${raDec}", "${decDec}", 1);
            StelMovementMgr.setFlagTracking(true);
        `;
        postScript(script, btn, originalText);
    }

    // Generic POST handler to send the script to Stellarium's API
    function postScript(code, btn, origText) {
        const params = new URLSearchParams();
        params.append('code', code);
        
        GM_xmlhttpRequest({
            method: "POST",
            url: `${STELLARIUM_HOST}/api/scripts/direct`,
            data: params.toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: (res) => {
                const success = res.status === 200;
                // Visual feedback: Green check or Red X
                btn.style.borderColor = success ? '#27ae60' : '#c0392b';
                btn.textContent = success ? '✔' : '✘';
                
                // Reset button after 2 seconds
                setTimeout(() => { 
                    btn.textContent = origText; 
                    btn.style.borderColor = '#555'; 
                }, 2000);
            },
            onerror: () => {
                btn.textContent = 'Err';
                setTimeout(() => { btn.textContent = origText; }, 2000);
            }
        });
    }

    // Regex math to handle "12h 4m 2s" or "12h4m2.5s" -> Decimal Degrees
    function parseRAToDecimal(ra) {
        const normalized = ra.replace(/s\./i, '.'); // Handle annoying formats like "30s.5"
        const m = normalized.match(/(\d+)h\s*(\d+)m\s*([\d.]+)/i);
        // Standard formula: (H + M/60 + S/3600)
        return m ? (parseInt(m[1]) + parseInt(m[2]) / 60 + parseFloat(m[3]) / 3600).toFixed(6) : 0;
    }

    // Regex math for Declination. Handles the negative sign carefully.
    function parseDECToDecimal(dec) {
        const normalized = dec.replace(/(["″])\./, '.');
        const m = normalized.match(/([+\-−–]?)(\d+)[°dº]\s*(\d+)['m′]\s*([\d.]+)/i);
        if (!m) return 0;
        
        const sign = (m[1] === '-' || m[1] === '−' || m[1] === '–') ? -1 : 1;
        return (sign * (parseInt(m[2]) + parseInt(m[3]) / 60 + parseFloat(m[4]) / 3600)).toFixed(6);
    }
})();
