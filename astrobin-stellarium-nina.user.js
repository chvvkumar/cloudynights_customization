// ==UserScript==
// @name         AstroBin to Stellarium & NINA (Optimized)
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  Adds Stellarium focus icons and NINA framing buttons to AstroBin. Supports both classic and new layouts.
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

    // --- ASSETS & STYLES ---
    const ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE/0lEQVR4nO2WXUxbZRzGudJrvewLNOe09Lulh7YwAqWlLYl8rCibibotAbOhYzgkkxldtjHGpuDU9ZzS8jG+RNxkw8R9mBjQ7MKwyZjMjC2b88LEG+fmhXMXZhEecw6Uz56O069p0n/yJISWl+f3/p/3/75paalKVapS9b8oSzpnZGQ+HyPzzTCEfcgQFnHWQ2Ftme+4Kf24IW7GlUrf0wxhAwxhZxNgGuFkJr5/zIT163QHn4rdvIz9Nh6msuUsDDoOWoaDxjovLcMJvzPLRUBkvm9igjATXzAe5g06FhobJyqtlQcR7QYXfeZFYjM4OLFu8zqTuHHNKpmtHbDJ/WvilJ3h10sGEA5szDu/fvMaGwdTQQBtH46Hi9JH0gEIeyO0wOnRKxg5PQkp3eAzL8W8xsaBKQri6s07KLX3rVxPxl6PAsD3V2gB3vznI5MJ3X2NjYPL24/pWz/j/WMru2Am7INoOhBTfLRm6QDbG74QAM6NX1uzXtIBhFEpEaDzk+8EgEvXbv8HACzSzDvKT+DKzE8CwMT0reQBiB1iqRHqGZ4QzPM6Ozb95Dsg5RDvPXRh0Tyvo21jsQOUqAfgUfXDreqHU9kLO92NDfIALOlc2N1f3Qn+ecDfsI8z39R8QRidIfP8z2WOvvgAhJNH3Y/hoe+RJw+sowvid4GjondFbEIKd5HFFWC5nFm9yM3siAiRbfELN6zZHoCrsl8Ylfy0mbqxtOvTCxoauQxrJpc8gJD4eDEk/D/m3zb8ri6PyWpdvXlH+I6Y+YQD8CrO6oMlwy86mfjnAX/D8hPm8o+3hVl/dmxaOLDhMp90AF4uVR+sGZEjFa3SkgHAy63iOyEehUjKIxxKSQc2kyCqSSd2kC7sJN2oI92JATj56aRonNZrOoew8JAObCOdglExJa0DIRUKBzuyeSfxo5p0LZrcQwfRlvMxOovacbL0CM54W/DlC4dwflNzrAB98Kh7JAF41AOwiYxYC2GxiQTmjad347DJh6GSoxh/eT+u72zCr00N+LO5Dn+3vo7ZtlqgfYd0gALVPhgVG5FFm0BTNCiKAk2poaELwCi3oDCrGSXq/siTSdm7dqwSdjEu+3V+nCptxQ+1e/HHgV2ArwH4rA041wNcPANMnAcmvwamxqUD8IYfJxWdA6tyO1yqoChEbubSjW0jHGpIF+ozuuEv+ACXat7Bg5Y6YPAwMH4KmBoTzIZTQgBCUlBqoSsudWANgENxYuGwcthKOtEg78Lwc0fwy55GoGcfcHFU1HTSABZBaDVylNtWdIR/O/EPwCoSwJvyToxubMFvB3ZjJtiKr4LHMPDeQbS/3Yi3al9F9UsvYsvmKlR5K1BZUQ632w2XywW325UcgKWOaGBRVsOlmu+Ik2axVfcuXit5BTXeMngWjLkkSDIAf2BjgZjvSBbMhnzY7UWSDbuWyekomZMMoKZtc7ECLJfRaER+fj6Ki4vXbdzhcIBhGGg1hlnJAAb6+d/jCRCSUqmEyWRCbm4uCgsL4XQ6Vxi22+2w2WzQ6/VQKBTC3+i1uXclA1jo+t00Nb9AokXTtCCxzxhdeb1kgPkueO8nA4CKIL02715atLVB1/ishnI8elLm1SrjI6Ox/JmoAUIQBsp7P1lxohZiY9Dm3YvZ/PKyKHa9oacq76oo2xxNqeJuWqFQQJWlmeMPrFlTVhc346lKVapSlZbI+hcf/WQs2PjpSAAAAABJRU5ErkJggg==";

    const CSS = `
        .ab-nina-li { display: none; position: relative; z-index: 9999; }
        .ab-nina-wrap { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3px; height: 100%; padding: 0 12px; border-left: 1px solid #444; margin-left: 5px; }
        .ab-nina-coords { font-family: monospace; font-size: 10px; color: #bac2de; white-space: nowrap; line-height: 1; margin-bottom: 1px; }
        .ab-nina-row { display: flex; align-items: center; justify-content: space-evenly; width: 100%; gap: 6px; }
        .ab-nina-pill { display: flex; align-items: center; justify-content: center; width: 34px; height: 20px; border-radius: 100px; background: #313244; border: 1px solid #45475a; transition: all 0.2s; box-sizing: border-box; }
        .ab-nina-pill:hover { border-color: #89b4fa; background: #45475a; }
        .ab-nina-btn { cursor: pointer; text-decoration: none; position: relative; display: inline-block; z-index: 10001; }
        .ab-pill-icon { width: 14px; height: 14px; opacity: 0.9; }
        .ab-s-wrap { display: inline-flex; align-items: center; cursor: pointer; margin-left: 5px; }
        .ab-s-icon { width: 18px; height: 18px; vertical-align: middle; }
        .ab-cfg-ol { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .ab-cfg-win { background: #1e1e2e; color: #cdd6f4; border-radius: 12px; padding: 24px; min-width: 420px; font-family: system-ui, sans-serif; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid #313244; }
        .ab-cfg-row { margin-bottom: 12px; padding: 12px; background: #313244; border-radius: 8px; display: grid; grid-template-columns: 30px 1fr 2fr; gap: 10px; align-items: center; }
        .ab-cfg-in { padding: 6px; background: #181825; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; font-size: 12px; width: 100%; }
        .ab-txt-blue { color: #89b4fa; }
        .ab-txt-pink { color: #f5c2e7; margin-left: 6px; }
        .ab-nina-meta-item { cursor: pointer; }
        .ab-meta-cog { cursor: pointer; }
        .ab-meta-cog:hover { color: #89b4fa; }
    `;

    // --- STATE & SETUP ---
    const SETTINGS = {
        stellarium: GM_getValue('stellariumHost', "http://localhost:8090"),
        nina: JSON.parse(GM_getValue('ninaHosts', JSON.stringify([
            { name: "Localhost", url: "http://localhost:1888", enabled: true },
            { name: "Astromele2", url: "", enabled: false },
            { name: "Astromele3", url: "", enabled: false },
        ])))
    };

    const CATALOG_REGEX = /\b(M|NGC|IC|Mel|Cr|Col|Sharpless|Sh2|LBN|LDN|Abell|HD|SAO|HIP|B|vdB|UGC|PGC|ESO|Mrk|Gum|RCW)\s*-?\s*(\d+)\b/ig;
    const processed = new Set();
    const ninaElements = [];
    let curCoords = null;

    // Layout detection: new Angular layout (app.astrobin.com) vs classic (www.astrobin.com)
    const isNewLayout = () => !!document.querySelector('astrobin-root');

    // Inline SVG cog icon for new layout (FontAwesome gear)
    const COG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:16px;height:16px;fill:currentColor;"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.1-28.2 18.2-44 24l-10.5 57.5c-1.7 9.3-8.9 16.5-18.2 17.8c-12.8 1.8-26 2.8-39.4 2.8s-26.5-.9-39.4-2.8c-9.4-1.3-16.5-8.5-18.2-17.8l-10.5-57.5c-15.8-5.8-30.7-13.9-44-24l-55.7 17.7c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.1 28.2-18.2 44-24l10.5-57.5c1.7-9.3 8.9-16.5 18.2-17.8C224.5 .9 237.7 0 251.1 0h9.8c12.8 0 26 .9 39.4 2.8c9.4 1.3 16.5 8.5 18.2 17.8l10.5 57.5c15.8 5.8 30.7 13.9 44 24l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>';

    const styleEl = document.createElement('style');
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    // --- UTILS ---
    const http = (url, method, cb, errCb) => GM_xmlhttpRequest({
        method, url, onload: cb, onerror: errCb
    });

    const createEl = (tag, className, html = '') => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (html) el.innerHTML = html;
        return el;
    };

    // Format catalog names for Stellarium search
    const formatStellariumName = (type, number) => {
        const t = type.toUpperCase();
        // Sharpless: Stellarium MUST have hyphen e.g. "Sh 2-240"
        if (t === 'SHARPLESS' || t === 'SH2') return `Sh 2-${number}`;
        // Common catalogs needing spaces
        if (['LBN', 'LDN', 'PGC', 'UGC', 'GUM', 'RCW', 'ABEL'].includes(t)) return `${t} ${number}`;
        // Standard catalogs
        return `${t} ${number}`;
    };

    // --- BUTTON ACTIONS ---
    function sendNina(host, ra, dec, pill) {
        if (!pill) return;
        console.log(`[AB-Script] Sending to NINA (${host}): RA=${ra}, DEC=${dec}`);
        
        pill.style.opacity = '0.5';
        const reset = () => setTimeout(() => pill.style.borderColor = '#45475a', 3000);

        http(`${host}/v2/api/framing/set-coordinates?RAangle=${ra}&DecAngle=${dec}`, "GET", (res) => {
            console.log(`[AB-Script] NINA Response (${host}): ${res.status} ${res.statusText}`);
            pill.style.opacity = '1';
            pill.style.borderColor = res.status === 200 ? '#a6e3a1' : '#f38ba8';
            if (res.status === 200 && curCoords?.rot !== null) {
                console.log(`[AB-Script] Sending Rotation to NINA: ${curCoords.rot}`);
                http(`${host}/v2/api/framing/set-rotation?rotation=${curCoords.rot}`, "GET", () => {});
            } else if (res.status !== 200) {
                 console.error(`[AB-Script] NINA Error Body: ${res.responseText}`);
            }
            reset();
        }, (err) => {
            console.error(`[AB-Script] NINA Network Error:`, err);
            pill.style.opacity = '1';
            pill.style.borderColor = '#f38ba8';
            reset();
        });
    }

    function sendStellariumCoords(ra, dec, pill) {
        if (!pill) return;
        console.log(`[AB-Script] Sending Coords to Stellarium: RA=${ra}, DEC=${dec}`);

        pill.style.opacity = '0.5';
        const reset = (color) => {
            pill.style.opacity = '1';
            pill.style.borderColor = color;
            setTimeout(() => pill.style.borderColor = '#45475a', 3000);
        };

        // Use Stellarium scripting API for smooth slew (3 second duration)
        // RA/DEC in degrees with 'd' suffix for StelUtils::getDecAngle()
        const script = `core.moveToRaDecJ2000("${ra.toFixed(6)}d", "${dec.toFixed(6)}d", 3);`;
        console.log(`[AB-Script] Running Stellarium script: ${script}`);

        GM_xmlhttpRequest({
            method: "POST",
            url: `${SETTINGS.stellarium}/api/scripts/direct`,
            data: `code=${encodeURIComponent(script)}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: (res) => {
                console.log(`[AB-Script] Script Response: ${res.status} ${res.statusText}`);
                if (res.status === 200) {
                    reset('#a6e3a1');
                    // Zoom to 20° FOV after slew completes
                    setTimeout(() => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: `${SETTINGS.stellarium}/api/main/fov`,
                            data: "fov=20",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            onload: () => console.log("[AB-Script] FOV set to 20°"),
                            onerror: () => {}
                        });
                    }, 3000);
                } else {
                    console.error(`[AB-Script] Script Error:`, res.responseText);
                    reset('#f38ba8');
                }
            },
            onerror: (err) => {
                console.error(`[AB-Script] Network Error:`, err);
                reset('#f38ba8');
            }
        });
    }

    // --- UI UPDATES ---
    function updateNinaUI() {
        if (!curCoords) return;
        let html = `<span class="ab-txt-blue">RA</span> ${curCoords.ra.toFixed(3)}° <span class="ab-txt-blue" style="margin-left:6px">DEC</span> ${curCoords.dec.toFixed(3)}°`;
        if (curCoords.rot !== null) html += `<span class="ab-txt-pink">ROT</span> ${curCoords.rot.toFixed(1)}°`;

        ninaElements.forEach(el => {
            if (!document.body.contains(el)) return;

            // New layout: el is a metadata-section, show its hidden items
            if (el.classList.contains('ab-meta-section')) {
                el.querySelectorAll('.ab-nina-meta-item').forEach(item => {
                    item.style.removeProperty('display');
                });
                return;
            }

            // Classic layout: el is an <li>
            el.style.display = 'list-item';
            const lbl = el.querySelector('.ab-nina-coords');
            if (lbl) lbl.innerHTML = html;
        });
    }

    function injectConfig() {
        if (document.getElementById('ab-nina-script-injected')) return;

        if (isNewLayout()) {
            injectNewLayoutUI();
        } else {
            injectClassicLayoutUI();
        }
    }

    // New Angular layout: inject into div.metadata-striped as native metadata-items
    function injectNewLayoutUI() {
        const metaStrip = document.querySelector('div.metadata-striped');
        if (!metaStrip) return;

        const section = createEl('div', 'metadata-section ab-meta-section');
        section.id = 'ab-nina-script-injected';

        const activeHosts = SETTINGS.nina.filter(h => h.enabled && h.url);

        if (activeHosts.length) {
            // "Send coordinates to:" header matching native "Integration" header style
            const header = createEl('div', 'metadata-header d-flex justify-content-between ab-nina-meta-item');
            header.style.cssText = 'display:none;cursor:default;width:100%;flex-basis:100%;';
            const existingHeader = metaStrip.querySelector('.metadata-header');
            if (existingHeader) {
                Array.from(existingHeader.attributes).forEach(attr => {
                    if (attr.name.startsWith('_ngcontent')) header.setAttribute(attr.name, attr.value);
                });
            }
            const headerSpan = createEl('span', '', ' Send coordinates to: ');
            if (existingHeader) {
                const existingSpan = existingHeader.querySelector('span');
                if (existingSpan) {
                    Array.from(existingSpan.attributes).forEach(attr => {
                        if (attr.name.startsWith('_ngcontent')) headerSpan.setAttribute(attr.name, attr.value);
                    });
                }
            }
            header.appendChild(headerSpan);
            section.appendChild(header);

            // Stellarium coordinate button (hidden until coords available)
            const stelItem = createEl('div', 'metadata-item ab-nina-meta-item');
            stelItem.style.display = 'none';
            stelItem.title = 'Center Coordinates in Stellarium';
            const stelIconDiv = createEl('div', 'metadata-icon');
            const stelPill = createEl('div', 'ab-nina-pill');
            stelPill.style.cssText = 'width:auto;padding:0 8px;';
            stelPill.innerHTML = '<span style="font-size:9px;font-weight:bold;color:#cdd6f4;">Stellarium</span>';
            stelIconDiv.appendChild(stelPill);
            stelItem.appendChild(stelIconDiv);
            stelItem.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                if (curCoords) sendStellariumCoords(curCoords.ra, curCoords.dec, stelPill);
            };
            section.appendChild(stelItem);

            // NINA host buttons (hidden until coords available)
            activeHosts.forEach(host => {
                const item = createEl('div', 'metadata-item ab-nina-meta-item');
                item.style.display = 'none';
                item.title = `Send to ${host.name}`;
                const iconDiv = createEl('div', 'metadata-icon');
                const pill = createEl('div', 'ab-nina-pill');
                pill.innerHTML = `<span style="font-size:9px;font-weight:bold;color:#cdd6f4;">${host.name[0].toUpperCase()}</span>`;
                iconDiv.appendChild(pill);
                item.appendChild(iconDiv);
                item.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (curCoords) sendNina(host.url, curCoords.ra, curCoords.dec, pill);
                };
                section.appendChild(item);
            });

            ninaElements.push(section);
        }

        // Config cog (always visible)
        const cogItem = createEl('div', 'metadata-item ab-meta-cog');
        cogItem.title = 'Script Settings';
        const cogIconDiv = createEl('div', 'metadata-icon');
        cogIconDiv.innerHTML = COG_SVG;
        cogItem.appendChild(cogIconDiv);
        cogItem.onclick = (e) => { e.preventDefault(); showConfig(); };
        section.appendChild(cogItem);

        metaStrip.appendChild(section);
    }

    // Classic layout: inject into navbar next to upload button
    function injectClassicLayoutUI() {
        const uploadBtn = document.querySelector('a.upload-button');
        if (!uploadBtn) return;

        const parent = uploadBtn.parentElement;
        const cogLi = createEl('li', 'd-none d-lg-block');
        cogLi.id = 'ab-nina-script-injected';
        cogLi.style.zIndex = "9999";

        const cog = createEl('a', '', '<i class="icon icon-cog"></i>');
        cog.style.cssText = 'cursor:pointer; display:flex; align-items:center; height:100%; padding:0 10px; position:relative; z-index:10000;';
        cog.onclick = (e) => { e.preventDefault(); showConfig(); };
        cogLi.appendChild(cog);
        parent.parentNode.insertBefore(cogLi, parent.nextSibling);

        const activeHosts = SETTINGS.nina.filter(h => h.enabled && h.url);
        if (activeHosts.length) {
            const ninaLi = createEl('li', 'd-none d-lg-block ab-nina-li');
            const wrap = createEl('div', 'ab-nina-wrap');
            wrap.style.pointerEvents = 'auto';
            wrap.appendChild(createEl('div', 'ab-nina-coords'));

            const row = createEl('div', 'ab-nina-row');

            // Stellarium Button (Coordinates)
            const stelBtn = createEl('a', 'ab-nina-btn');
            stelBtn.title = "Center Coordinates in Stellarium";
            const stelPill = createEl('div', 'ab-nina-pill');
            const stelIcon = createEl('img', 'ab-pill-icon');
            stelIcon.src = ICON_SRC;
            stelPill.appendChild(stelIcon);
            stelBtn.appendChild(stelPill);
            stelBtn.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                if (curCoords) sendStellariumCoords(curCoords.ra, curCoords.dec, stelPill);
            };
            row.appendChild(stelBtn);

            // NINA Buttons
            activeHosts.forEach(host => {
                const btn = createEl('a', 'ab-nina-btn');
                btn.title = `Send to ${host.name}`;
                const pill = createEl('div', 'ab-nina-pill', `<span style="font-size:9px; font-weight:bold; color:#cdd6f4;">${host.name[0].toUpperCase()}</span>`);
                btn.appendChild(pill);
                btn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (curCoords) sendNina(host.url, curCoords.ra, curCoords.dec, pill);
                };
                row.appendChild(btn);
            });

            wrap.appendChild(row);
            ninaLi.appendChild(wrap);
            cogLi.parentNode.insertBefore(ninaLi, cogLi);
            ninaElements.push(ninaLi);
        }
    }

    // --- STELLARIUM (Object Name) ---
    function sendStellariumName(name, img) {
        if (img) img.style.opacity = '0.5';
        console.log(`[AB-Script] Searching Object in Stellarium: ${name}`);
        
        const anim = (col) => {
            if (!img) return;
            img.style.opacity = '1';
            img.style.filter = `sepia(100%) hue-rotate(${col}) saturate(500%)`;
            setTimeout(() => img.style.filter = "none", 2000);
        };

        // 1. Focus (Select)
        GM_xmlhttpRequest({
            method: "POST",
            url: `${SETTINGS.stellarium}/api/main/focus`,
            data: `target=${encodeURIComponent(name)}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: (res) => {
                console.log(`[AB-Script] Object Search Response: ${res.status}`);
                if (res.status === 200) {
                    console.log(`[AB-Script] Object Found. Enabling Tracking & Slew.`);
                    
                    // 2. Enable Tracking
                    GM_xmlhttpRequest({
                        method: "POST", url: `${SETTINGS.stellarium}/api/main/action`,
                        data: "id=actionSetTracking_True", headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        onload: () => {
                            // 3. FORCE Move (Slew) to Selected
                            GM_xmlhttpRequest({
                                method: "POST", url: `${SETTINGS.stellarium}/api/main/action`,
                                data: "id=actionMoveToSelected", headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                onload: () => anim("100deg")
                            });
                        }
                    });

                } else {
                    console.warn(`[AB-Script] Object NOT found: ${name} (Response: ${res.responseText})`);
                    anim("-50deg");
                }
            },
            onerror: (err) => {
                console.error(`[AB-Script] Object Search Network Error:`, err);
                anim("-50deg");
            }
        });
    }

    function createIcon(name) {
        const wrap = createEl('span', 'ab-s-wrap');
        const img = createEl('img', 'ab-s-icon');
        img.src = ICON_SRC;
        img.title = `Center in Stellarium: ${name}`;
        wrap.appendChild(img);
        wrap.onclick = (e) => { e.preventDefault(); e.stopPropagation(); sendStellariumName(name, img); };
        return wrap;
    }

    // --- SCANNERS ---
    function scan() {
        injectConfig();

        // Title scanning: h1 (generic), h3.image-title (classic), .image-viewer-title h2 (new)
        const titleEl = document.querySelector('h1') || document.querySelector('.image-viewer-title h2') || document.querySelector('h3.image-title');
        if (titleEl && !processed.has(titleEl)) {
            const matches = [...titleEl.innerText.matchAll(CATALOG_REGEX)];
            if (matches.length) {
                const c = createEl('span');
                c.style.fontSize = '0.6em';
                matches.forEach(m => c.appendChild(createIcon(formatStellariumName(m[1], m[2]))));
                titleEl.appendChild(c);
                processed.add(titleEl);
            }
        }

        document.querySelectorAll('a').forEach(link => {
            if (processed.has(link)) return;
            const txt = link.innerText.trim();
            if (txt.length < 2 || txt.length > 30) return;

            CATALOG_REGEX.lastIndex = 0;
            const match = CATALOG_REGEX.exec(txt);
            if (match && match[0].length >= txt.length - 5) {
                const icon = createIcon(formatStellariumName(match[1], match[2]));
                link.parentNode.insertBefore(icon, link.nextSibling || link.parentNode.appendChild(icon));
                processed.add(link);
            }
        });

        // --- Coordinate extraction (classic + new layout) ---
        let ra = null, dec = null, rot = null;

        // Classic layout: abbr elements with decimal degrees in title attribute
        const rAbbr = document.querySelector('abbr.ra-coordinates');
        const dAbbr = document.querySelector('abbr.dec-coordinates');
        if (rAbbr && dAbbr) {
            ra = parseFloat(rAbbr.getAttribute('title'));
            dec = parseFloat(dAbbr.getAttribute('title'));

            // Classic orientation: strong.card-label "Orientation:" text
            document.querySelectorAll('strong.card-label').forEach(l => {
                if (l.textContent.trim() === 'Orientation:') {
                    const m = l.parentElement.textContent.match(/([-\d.]+)\s*degrees/);
                    if (m) rot = parseFloat(m[1]);
                }
            });
        }

        // New layout fallback: parse HMS/DMS from span.coordinates
        if (ra === null || dec === null || isNaN(ra) || isNaN(dec)) {
            const coordsEl = document.querySelector('span.coordinates');
            if (coordsEl) {
                const raEl = coordsEl.querySelector('span.ra');
                const decEl = coordsEl.querySelector('span.dec');
                if (raEl && decEl) {
                    const raH = parseFloat(raEl.querySelector('.hours')?.textContent) || 0;
                    const raM = parseFloat(raEl.querySelector('.minutes')?.textContent) || 0;
                    const raS = parseFloat(raEl.querySelector('.seconds')?.textContent) || 0;
                    ra = raH * 15 + raM * (15 / 60) + raS * (15 / 3600);

                    const decDeg = parseFloat(decEl.querySelector('.degrees')?.textContent) || 0;
                    const decM = parseFloat(decEl.querySelector('.minutes')?.textContent) || 0;
                    const decS = parseFloat(decEl.querySelector('.seconds')?.textContent) || 0;
                    const sign = decDeg < 0 ? -1 : 1;
                    dec = sign * (Math.abs(decDeg) + decM / 60 + decS / 3600);

                    // New layout orientation: metadata-label next to fa-icon[icon="location-arrow"]
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

        if (ra !== null && dec !== null && !isNaN(ra) && !isNaN(dec)) {
            curCoords = { ra, dec, rot };
            updateNinaUI();
        }
    }

    // --- UI ---
    function showConfig() {
        const ov = createEl('div', 'ab-cfg-ol');
        const d = createEl('div', 'ab-cfg-win', `
            <h3 style="margin:0 0 20px;font-size:18px;color:#89b4fa;font-weight:600;">AstroBin Script Settings</h3>
            <div style="margin-bottom:20px;">
                <label style="display:block;margin-bottom:6px;font-size:12px;color:#9399b2;">Stellarium API URL</label>
                <input id="cfg-stel" type="text" value="${SETTINGS.stellarium}" class="ab-cfg-in">
            </div>
            <label style="display:block;margin-bottom:10px;font-size:12px;color:#9399b2;">N.I.N.A. Instances</label>
            ${SETTINGS.nina.map((h, i) => `
                <div class="ab-cfg-row">
                    <input id="cfg-e-${i}" type="checkbox" ${h.enabled ? 'checked' : ''} style="cursor:pointer;">
                    <input id="cfg-n-${i}" type="text" value="${h.name}" placeholder="Name" class="ab-cfg-in">
                    <input id="cfg-u-${i}" type="text" value="${h.url}" placeholder="URL" class="ab-cfg-in">
                </div>
            `).join('')}
            <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px;">
                <button id="cfg-x" style="padding:8px 20px;background:transparent;color:#a6adc8;border:1px solid #45475a;border-radius:6px;cursor:pointer;">Cancel</button>
                <button id="cfg-s" style="padding:8px 24px;background:#89b4fa;color:#11111b;border:none;border-radius:6px;cursor:pointer;font-weight:600;">Save</button>
            </div>
        `);
        ov.appendChild(d);
        document.body.appendChild(ov);
        d.querySelector('#cfg-x').onclick = () => ov.remove();
        d.querySelector('#cfg-s').onclick = () => {
            GM_setValue('stellariumHost', d.querySelector('#cfg-stel').value.trim());
            const hosts = SETTINGS.nina.map((_, i) => ({
                name: d.querySelector(`#cfg-n-${i}`).value.trim() || `NINA ${i+1}`,
                url: d.querySelector(`#cfg-u-${i}`).value.trim(),
                enabled: d.querySelector(`#cfg-e-${i}`).checked
            }));
            GM_setValue('ninaHosts', JSON.stringify(hosts));
            ov.remove();
            location.reload();
        };
    }

    // --- INIT ---
    setInterval(scan, 2000);
})();
