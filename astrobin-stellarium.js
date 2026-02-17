// ==UserScript==
// @name         AstroBin to Stellarium (Focus API)
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Injects custom Stellarium icons next to object names in titles and links.
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
    const catalogRegex = /\b(M|NGC|IC|Mel|Cr|Col|Sharpless|Sh2|LBN|LDN|Abell)\s*-?\s*(\d+)\b/ig;

    // Custom User-Provided Icon (Base64 PNG)
    const STELLARIUM_ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE/0lEQVR4nO2WXUxbZRzGudJrvewLNOe09Lulh7YwAqWlLYl8rCibibotAbOhYzgkkxldtjHGpuDU9ZzS8jG+RNxkw8R9mBjQ7MKwyZjMjC2b88LEG+fmhXMXZhEecw6Uz56O069p0n/yJISWl+f3/p/3/75paalKVapS9b8oSzpnZGQ+HyPzzTCEfcgQFnHWQ2Ftme+4Kf24IW7GlUrf0wxhAwxhZxNgGuFkJr5/zIT163QHn4rdvIz9Nh6msuUsDDoOWoaDxjovLcMJvzPLRUBkvm9igjATXzAe5g06FhobJyqtlQcR7QYXfeZFYjM4OLFu8zqTuHHNKpmtHbDJ/WvilJ3h10sGEA5szDu/fvMaGwdTQQBtH46Hi9JH0gEIeyO0wOnRKxg5PQkp3eAzL8W8xsaBKQri6s07KLX3rVxPxl6PAsD3V2gB3vznI5MJ3X2NjYPL24/pWz/j/WMru2Am7INoOhBTfLRm6QDbG74QAM6NX1uzXtIBhFEpEaDzk+8EgEvXbv8HACzSzDvKT+DKzE8CwMT0reQBiB1iqRHqGZ4QzPM6Ozb95Dsg5RDvPXRh0Tyvo21jsQOUqAfgUfXDreqHU9kLO92NDfIALOlc2N1f3Qn+ecDfsI8z39R8QRidIfP8z2WOvvgAhJNH3Y/hoe+RJw+sowvid4GjondFbEIKd5HFFWC5nFm9yM3siAiRbfELN6zZHoCrsl8Ylfy0mbqxtOvTCxoauQxrJpc8gJD4eDEk/D/m3zb8ri6PyWpdvXlH+I6Y+YQD8CrO6oMlwy86mfjnAX/D8hPm8o+3hVl/dmxaOLDhMp90AF4uVR+sGZEjFa3SkgHAy63iOyEehUjKIxxKSQc2kyCqSSd2kC7sJN2oI92JATj56aRonNZrOoew8JAObCOdglExJa0DIRUKBzuyeSfxo5p0LZrcQwfRlvMxOovacbL0CM54W/DlC4dwflNzrAB98Kh7JAF41AOwiYxYC2GxiQTmjad347DJh6GSoxh/eT+u72zCr00N+LO5Dn+3vo7ZtlqgfYd0gALVPhgVG5FFm0BTNCiKAk2poaELwCi3oDCrGSXq/siTSdm7dqwSdjEu+3V+nCptxQ+1e/HHgV2ArwH4rA041wNcPANMnAcmvwamxqUD8IYfJxWdA6tyO1yqoChEbubSjW0jHGpIF+ozuuEv+ACXat7Bg5Y6YPAwMH4KmBoTzIZTQgBCUlBqoSsudWANgENxYuGwcthKOtEg78Lwc0fwy55GoGcfcHFU1HTSABZBaDVylNtWdIR/O/EPwCoSwJvyToxubMFvB3ZjJtiKr4LHMPDeQbS/3Yi3al9F9UsvYsvmKlR5K1BZUQ632w2XywW325UcgKWOaGBRVsOlmu+Ik2axVfcuXit5BTXeMngWjLkkSDIAf2BjgZjvSBbMhnzY7UWSDbuWyekomZMMoKZtc7ECLJfRaER+fj6Ki4vXbdzhcIBhGGg1hlnJAAb6+d/jCRCSUqmEyWRCbm4uCgsL4XQ6Vxi22+2w2WzQ6/VQKBTC3+i1uXclA1jo+t00Nb9AokXTtCCxzxhdeb1kgPkueO8nA4CKIL02715atLVB1/ishnI8elLm1SrjI6Ox/JmoAUIQBsp7P1lxohZiY9Dm3YvZ/PKyKHa9oacq76oo2xxNqeJuWqFQQJWlmeMPrFlTVhc346lKVapSlZbI+hcf/WQs2PjpSAAAAABJRU5ErkJggg==";

    const processedElements = new Set(); // Keep track to avoid double injection

    // --- INITIALIZATION LOOP ---
    const init = setInterval(() => {
        // Scan Header (H1)
        scanAndInjectHeader();
        
        // Scan Links (A tags)
        scanAndInjectLinks();
    }, 2000);

    // --- HELPER: NORMALIZE OBJECT NAMES ---
    function getNormalizedObject(type, number) {
        // Standardize "Sharpless" to "Sh2"
        if (type.toUpperCase() === 'SHARPLESS') type = 'Sh2';

        let finalID;
        if (type.toUpperCase().includes('SH')) {
            finalID = `Sh2-${number}`;
        } else {
            // M 42, NGC 2244 usually prefer space in Stellarium Search
            finalID = `${type} ${number}`;
        }
        return finalID;
    }

    // --- PART 1: HEADER & LINK INJECTION ---

    function createIcon(objectName) {
        const img = document.createElement('img');
        img.src = STELLARIUM_ICON_SRC;
        img.title = `Center in Stellarium: ${objectName}`;
        img.style.width = '18px';
        img.style.height = '18px';
        img.style.verticalAlign = 'middle';
        img.style.marginLeft = '5px';
        img.style.cursor = 'pointer';
        img.style.border = 'none'; // Remove browser default borders
        img.style.display = 'inline-block';
        
        // Simple hover effect
        img.onmouseenter = () => { img.style.opacity = '0.8'; };
        img.onmouseleave = () => { img.style.opacity = '1.0'; };
        
        // Wrap in a span to act as the button controller
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.appendChild(img);

        // Click Logic
        wrapper.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent opening the link if it's inside an <a> tag
            sendFocus(objectName, wrapper);
        };

        return wrapper;
    }

    function scanAndInjectHeader() {
        // Find the H1 title
        const h1 = document.querySelector('h1');
        if (h1 && !processedElements.has(h1)) {
            const text = h1.innerText;
            let match;
            catalogRegex.lastIndex = 0; 
            
            const matches = [];
            while ((match = catalogRegex.exec(text)) !== null) {
                matches.push(getNormalizedObject(match[1], match[2]));
            }

            if (matches.length > 0) {
                const container = document.createElement('span');
                container.style.fontSize = '0.6em'; 
                container.style.verticalAlign = 'middle';
                
                matches.forEach(objName => {
                    const icon = createIcon(objName);
                    container.appendChild(icon);
                });
                
                h1.appendChild(container);
                processedElements.add(h1);
            }
        }
    }

    function scanAndInjectLinks() {
        const links = document.querySelectorAll('a');

        links.forEach(link => {
            if (processedElements.has(link)) return;

            // Limit scan to short strings to avoid scanning long paragraphs
            const text = link.innerText.trim();
            if (text.length > 30 || text.length < 2) return; 

            catalogRegex.lastIndex = 0;
            const match = catalogRegex.exec(text);

            if (match) {
                const objName = getNormalizedObject(match[1], match[2]);
                
                // Safety check: is this likely an object link?
                // We check if the text is mostly just the object name (e.g. "IC 1805")
                // or if it's inside the 'Contains' section shown in your screenshot.
                if (match[0].length >= text.length - 5) { 
                    const icon = createIcon(objName);
                    
                    // Insert immediately after the link
                    if (link.nextSibling) {
                        link.parentNode.insertBefore(icon, link.nextSibling);
                    } else {
                        link.parentNode.appendChild(icon);
                    }
                    processedElements.add(link);
                }
            }
        });
    }

    // --- API LOGIC ---

    async function sendFocus(name, uiElement) {
        // Visual feedback: reduce opacity while processing
        uiElement.style.opacity = '0.5';

        // 1. FOCUS Request
        const focusParams = new URLSearchParams();
        focusParams.append('target', name);

        GM_xmlhttpRequest({
            method: "POST",
            url: `${STELLARIUM_HOST}/api/main/focus`,
            data: focusParams.toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: (res) => {
                if (res.status === 200) {
                    enableTracking(uiElement);
                } else {
                    fail(uiElement);
                }
            },
            onerror: () => fail(uiElement)
        });
    }

    function enableTracking(uiElement) {
        const trackParams = new URLSearchParams();
        trackParams.append('id', 'actionSetTracking_True');

        GM_xmlhttpRequest({
            method: "POST",
            url: `${STELLARIUM_HOST}/api/main/action`,
            data: trackParams.toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: () => success(uiElement),
            onerror: () => success(uiElement)
        });
    }

    function success(uiElement) {
        const img = uiElement.querySelector('img');
        uiElement.style.opacity = '1';
        // Green filter effect for success
        if(img) img.style.filter = "sepia(100%) hue-rotate(100deg) saturate(500%)"; 
        setTimeout(() => {
            if(img) img.style.filter = "none";
        }, 2000);
    }

    function fail(uiElement) {
        const img = uiElement.querySelector('img');
        uiElement.style.opacity = '1';
        // Red filter effect for failure
        if(img) img.style.filter = "sepia(100%) hue-rotate(-50deg) saturate(600%)"; 
        setTimeout(() => {
            if(img) img.style.filter = "none";
        }, 2000);
    }

})();
