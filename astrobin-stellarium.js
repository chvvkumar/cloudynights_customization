// ==UserScript==
// @name         AstroBin to Stellarium (Focus API)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Uses the 'main/focus' endpoint with the 'target' parameter.
// @author       Dev
// @match        https://www.astrobin.com/*
// @match        https://app.astrobin.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    const STELLARIUM_HOST = "http://localhost:8090";
    
    // Regex for standard deep sky objects
    const catalogRegex = /\b(M|NGC|IC|Mel|Cr|Col|Sharpless|Sh2|LBN|LDN)\s*-?\s*(\d+)\b/ig;
    
    const foundObjects = new Set();

    const init = setInterval(() => {
        const metadataBlock = document.querySelector('div.subtitle');
        const anchor = document.querySelector('abbr.dec-coordinates, .dec-coordinates');
        
        if (metadataBlock && anchor && !document.querySelector('#stellarium-row')) {
            clearInterval(init);
            setTimeout(() => {
                scanMetadata(metadataBlock);
                createSeamlessRow(anchor);
            }, 1000); 
        }
    }, 2000);

    function scanMetadata(element) {
        const text = element.innerText;
        let match;
        
        while ((match = catalogRegex.exec(text)) !== null) {
            let type = match[1];
            let number = match[2];
            
            // Reconstruct strictly as found, or normalize if needed.
            // The user report suggests "Sh2-240" works, so we keep the hyphen if found, 
            // or construct it standardly.
            
            // Standardize "Sharpless" to "Sh2" to match your successful test
            if (type.toUpperCase() === 'SHARPLESS') type = 'Sh2';
            
            // Construct the ID. 
            // If the original text had a hyphen (captured in regex logic implicit in match), 
            // we usually just want "Type-Number" or "Type Number".
            // Let's try sending it exactly as standard Stellarium search string: "Sh2 240" or "Sh2-240"
            
            // Note: Your curl example used "Sh2-240". 
            // The regex might have split "Sh2" and "240". 
            // We'll join them with a hyphen if it's Sh2, space for others if safe.
            
            let finalID;
            if (type.toUpperCase().includes('SH')) {
                finalID = `Sh2-${number}`; // Mimic your curl success
            } else {
                finalID = `${type} ${number}`; // M 42, NGC 2244 usually prefer space
            }
            
            foundObjects.add(finalID);
        }
    }

    function createSeamlessRow(anchorElement) {
        const container = document.createElement('div');
        container.id = 'stellarium-row';
        container.style.cssText = 'margin-top: 8px; margin-bottom: 8px; line-height: 1.5; font-size: 14px;';
        
        const label = document.createElement('strong');
        label.textContent = 'Stellarium: ';
        label.style.color = '#fff'; 
        container.appendChild(label);

        const chipsContainer = document.createElement('span');
        container.appendChild(chipsContainer);

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

        if (foundObjects.size > 0) {
            foundObjects.forEach(objName => {
                const btn = document.createElement('a'); 
                btn.textContent = objName;
                btn.style.cssText = chipStyle;
                
                btn.onmouseenter = () => {
                    btn.style.borderColor = '#e67e22';
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
                    sendFocus(objName, btn);
                };
                chipsContainer.appendChild(btn);
            });
        } else {
            const msg = document.createElement('span');
            msg.textContent = "No targets in metadata.";
            msg.style.cssText = "color: #777; font-style: italic; padding-left: 5px;";
            chipsContainer.appendChild(msg);
        }

        const parentBlock = anchorElement.closest('div, p'); 
        if (parentBlock) {
            parentBlock.after(container);
        } else {
            anchorElement.parentElement.appendChild(container);
        }
    }

    // --- NEW API LOGIC ---
    
    async function sendFocus(name, btn) {
        const originalText = btn.textContent;
        btn.textContent = '...';

        // 1. FOCUS Request (POST target=NAME)
        // Mimics: curl -X POST http://localhost:8090/api/main/focus -d "target=Sh2-240"
        const focusParams = new URLSearchParams();
        focusParams.append('target', name);

        GM_xmlhttpRequest({
            method: "POST",
            url: `${STELLARIUM_HOST}/api/main/focus`,
            data: focusParams.toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: (res) => {
                if (res.status === 200) {
                    // Success! Now let's try to lock tracking for Oculars
                    // We send a follow-up action to ensure it stays centered
                    enableTracking(btn, originalText);
                } else {
                    fail(btn, originalText);
                }
            },
            onerror: () => fail(btn, originalText)
        });
    }

    function enableTracking(btn, originalText) {
        // Send 'action' to set tracking true
        const trackParams = new URLSearchParams();
        trackParams.append('id', 'actionSetTracking_True');
        
        GM_xmlhttpRequest({
            method: "POST",
            url: `${STELLARIUM_HOST}/api/main/action`,
            data: trackParams.toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: () => success(btn, originalText),
            onerror: () => success(btn, originalText) // Even if this fails, focus might have worked
        });
    }

    function success(btn, origText) {
        btn.style.borderColor = '#27ae60';
        btn.textContent = '✔';
        setTimeout(() => { 
            btn.textContent = origText; 
            btn.style.borderColor = '#555'; 
        }, 2000);
    }

    function fail(btn, origText) {
        btn.style.borderColor = '#c0392b';
        btn.textContent = '✘';
        setTimeout(() => { 
            btn.textContent = origText; 
            btn.style.borderColor = '#555'; 
        }, 2000);
    }

})();
