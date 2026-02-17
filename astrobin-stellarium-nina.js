// ==UserScript==
// @name         AstroBin to Stellarium & NINA
// @namespace    http://tampermonkey.net/
// @version      12.6
// @description  Adds Stellarium focus icons and NINA framing buttons to AstroBin.
// @author       Dev
// @match        https://www.astrobin.com/*
// @match        https://app.astrobin.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    const SETTINGS = {
        stellariumHost: GM_getValue('stellariumHost', "http://localhost:8090"),
        ninaHosts: JSON.parse(GM_getValue('ninaHosts', JSON.stringify([
            { name: "Localhost", url: "http://localhost:1888", enabled: true },
            { name: "Astromele2", url: "", enabled: false },
            { name: "Astromele3", url: "", enabled: false },
        ]))),
    };

    let pageCoordinates = null;
    const ninaBtnElements = [];

    // --- MAIN INJECTION LOGIC ---

    function injectConfigButton() {
        if (document.getElementById('ab-nina-script-injected')) {
            return;
        }

        const uploadLi = document.querySelector('li.d-none.d-lg-block > a.upload-button');
        if (!uploadLi) return;

        const uploadLiParent = uploadLi.parentElement;

        // --- CONFIG BUTTON ---
        const cogLi = document.createElement('li');
        cogLi.className = 'd-none d-lg-block';
        cogLi.id = 'ab-nina-script-injected';
        cogLi.style.zIndex = "9999";

        const cogBtn = document.createElement('a');
        cogBtn.href = '#';
        cogBtn.title = 'Configure AstroBin Script';
        cogBtn.innerHTML = '<i class="icon icon-cog"></i>';
        cogBtn.style.cssText = 'cursor:pointer; display:flex; align-items:center; height:100%; padding: 0 10px; position: relative; z-index: 10000;';
        cogBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openConfigDialog();
        });
        cogLi.appendChild(cogBtn);

        uploadLiParent.parentNode.insertBefore(cogLi, uploadLiParent.nextSibling);

        // --- NINA BUTTONS ---
        const enabledHosts = SETTINGS.ninaHosts.filter(h => h.enabled && h.url);
        if (enabledHosts.length > 0) {
            const ninaLi = document.createElement('li');
            ninaLi.className = 'd-none d-lg-block';
            ninaLi.style.cssText = 'display:none; position: relative; z-index: 9999;';

            const ninaWrapper = document.createElement('div');
            ninaWrapper.style.cssText = 'display:flex; flex-direction:column; justify-content:center; align-items:center; gap:3px; height:100%; padding: 0 12px; border-left: 1px solid #444; margin-left: 5px; pointer-events: auto;';

            // Coordinates Label
            const coordLabel = document.createElement('div');
            coordLabel.className = 'nina-coord-label';
            coordLabel.style.cssText = 'font-family: monospace; font-size:10px; color:#bac2de; white-space:nowrap; line-height:1; margin-bottom: 1px;';
            ninaWrapper.appendChild(coordLabel);

            // Icons Container
            const iconsRow = document.createElement('div');
            // Increased gap to 10px
            iconsRow.style.cssText = 'display:flex; align-items:center; gap:10px;';

            enabledHosts.forEach((host) => {
                const btn = document.createElement('a');
                btn.href = '#';
                btn.title = `Send to ${host.name}`;
                btn.style.cssText = 'cursor:pointer; text-decoration:none; position:relative; display:inline-block; z-index: 10001;';

                const iconPill = document.createElement('div');
                // Updated Style: Width 34px, Height 20px, Border-Radius 100px (Pill)
                iconPill.style.cssText = 'display:flex; align-items:center; justify-content:center; width:34px; height:20px; border-radius:100px; background:#313244; border:1px solid #45475a; transition: all 0.2s; box-sizing: border-box;';

                const displayChar = host.name.charAt(0).toUpperCase();
                iconPill.innerHTML = `
                    <span style="font-size:9px; font-weight:bold; color:#cdd6f4; z-index:1; letter-spacing: 0.5px;">${displayChar}</span>`;

                btn.appendChild(iconPill);

                btn.addEventListener('mouseenter', () => {
                    iconPill.style.borderColor = '#89b4fa';
                    iconPill.style.background = '#45475a';
                });
                btn.addEventListener('mouseleave', () => {
                    iconPill.style.borderColor = '#45475a';
                    iconPill.style.background = '#313244';
                });

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (pageCoordinates) {
                        sendToNina(pageCoordinates.ra, pageCoordinates.dec, iconPill, host.url);
                    }
                });
                iconsRow.appendChild(btn);
            });

            ninaWrapper.appendChild(iconsRow);
            ninaLi.appendChild(ninaWrapper);

            cogLi.parentNode.insertBefore(ninaLi, cogLi);
            ninaBtnElements.push(ninaLi);
        }
    }

    function showNinaButtons() {
        let coordHTML = '';
        if (pageCoordinates) {
            coordHTML = `<span style="color:#89b4fa">RA</span> ${pageCoordinates.ra.toFixed(3)}° <span style="color:#89b4fa; margin-left:6px">DEC</span> ${pageCoordinates.dec.toFixed(3)}°`;
            if (pageCoordinates.orientation !== null) {
                coordHTML += ` <span style="color:#f5c2e7; margin-left:6px">ROT</span> ${pageCoordinates.orientation.toFixed(1)}°`;
            }
        }

        ninaBtnElements.forEach(li => {
            if(document.body.contains(li)) {
                li.style.display = 'list-item';
                const label = li.querySelector('.nina-coord-label');
                if (label) label.innerHTML = coordHTML;
            }
        });
    }

    function sendToNina(ra, dec, iconPill, hostUrl) {
        if (!iconPill || !iconPill.style) return;

        iconPill.style.opacity = '0.5';
        GM_xmlhttpRequest({
            method: "GET",
            url: `${hostUrl}/v2/api/framing/set-coordinates?RAangle=${ra}&DecAngle=${dec}`,
            onload: (res) => {
                const color = res.status === 200 ? '#a6e3a1' : '#f38ba8';
                iconPill.style.borderColor = color;
                iconPill.style.opacity = '1';

                if (res.status === 200 && pageCoordinates?.orientation !== null) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${hostUrl}/v2/api/framing/set-rotation?rotation=${pageCoordinates.orientation}`,
                        onload: () => { /* maintain green */ }
                    });
                }
                setTimeout(() => { iconPill.style.borderColor = '#45475a'; }, 3000);
            },
            onerror: () => {
                iconPill.style.borderColor = '#f38ba8';
                iconPill.style.opacity = '1';
                setTimeout(() => { iconPill.style.borderColor = '#45475a'; }, 3000);
            }
        });
    }

    // --- CONFIG DIALOG ---
    function openConfigDialog() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:999999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

        const dialog = document.createElement('div');
        dialog.style.cssText = 'background:#1e1e2e;color:#cdd6f4;border-radius:12px;padding:24px;min-width:420px;font-family: system-ui, -apple-system, sans-serif;box-shadow:0 20px 50px rgba(0,0,0,0.5); border: 1px solid #313244;';

        dialog.innerHTML = `
            <h3 style="margin:0 0 20px;font-size:18px;color:#89b4fa;font-weight:600;">AstroBin Script Settings</h3>
            <div style="margin-bottom:20px;">
                <label style="display:block;margin-bottom:6px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#9399b2;">Stellarium API URL</label>
                <input id="cfg-stellarium" type="text" value="${SETTINGS.stellariumHost}" style="width:100%;padding:10px;background:#181825;color:#cdd6f4;border:1px solid #45475a;border-radius:6px;outline:none;">
            </div>
            <label style="display:block;margin-bottom:10px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#9399b2;">N.I.N.A. Instances</label>
            ${SETTINGS.ninaHosts.map((h, i) => `
                <div style="margin-bottom:12px;padding:12px;background:#313244;border-radius:8px; display:grid; grid-template-columns: 30px 1fr 2fr; gap:10px; align-items:center;">
                    <input id="cfg-nina-enabled-${i}" type="checkbox" ${h.enabled ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;">
                    <input id="cfg-nina-name-${i}" type="text" value="${h.name}" placeholder="Name" style="padding:6px;background:#181825;color:#cdd6f4;border:1px solid #45475a;border-radius:4px;font-size:12px;width:100%;">
                    <input id="cfg-nina-url-${i}" type="text" value="${h.url}" placeholder="http://localhost:1888" style="padding:6px;background:#181825;color:#cdd6f4;border:1px solid #45475a;border-radius:4px;font-size:12px;width:100%;">
                </div>
            `).join('')}
            <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px;">
                <button id="cfg-cancel" style="padding:8px 20px;background:transparent;color:#a6adc8;border:1px solid #45475a;border-radius:6px;cursor:pointer;font-size:13px;">Cancel</button>
                <button id="cfg-save" style="padding:8px 24px;background:#89b4fa;color:#11111b;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;">Save Settings</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        dialog.querySelector('#cfg-cancel').addEventListener('click', () => overlay.remove());
        dialog.querySelector('#cfg-save').addEventListener('click', () => {
            const newStellarium = dialog.querySelector('#cfg-stellarium').value.trim();
            GM_setValue('stellariumHost', newStellarium);
            const newHosts = [];
            for (let i = 0; i < 3; i++) {
                newHosts.push({
                    name: dialog.querySelector(`#cfg-nina-name-${i}`).value.trim() || `NINA ${i + 1}`,
                    url: dialog.querySelector(`#cfg-nina-url-${i}`).value.trim(),
                    enabled: dialog.querySelector(`#cfg-nina-enabled-${i}`).checked,
                });
            }
            GM_setValue('ninaHosts', JSON.stringify(newHosts));
            overlay.remove();
            location.reload();
        });
    }

    // --- STELLARIUM & COORDINATE SCANNERS ---
    const catalogRegex = /\b(M|NGC|IC|Mel|Cr|Col|Sharpless|Sh2|LBN|LDN|Abell|HD|SAO|HIP)\s*-?\s*(\d+)\b/ig;
    const processedElements = new Set();
    const STELLARIUM_ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE/0lEQVR4nO2WXUxbZRzGudJrvewLNOe09Lulh7YwAqWlLYl8rCibibotAbOhYzgkkxldtjHGpuDU9ZzS8jG+RNxkw8R9mBjQ7MKwyZjMjC2b88LEG+fmhXMXZhEecw6Uz56O069p0n/yJISWl+f3/p/3/75paalKVapS9b8oSzpnZGQ+HyPzzTCEfcgQFnHWQ2Ftme+4Kf24IW7GlUrf0wxhAwxhZxNgGuFkJr5/zIT163QHn4rdvIz9Nh6msuUsDDoOWoaDxjovLcMJvzPLRUBkvm9igjATXzAe5g06FhobJyqtlQcR7QYXfeZFYjM4OLFu8zqTuHHNKpmtHbDJ/WvilJ3h10sGEA5szDu/fvMaGwdTQQBtH46Hi9JH0gEIeyO0wOnRKxg5PQkp3eAzL8W8xsaBKQri6s07KLX3rVxPxl6PAsD3V2gB3vznI5MJ3X2NjYPL24/pWz/j/WMru2Am7INoOhBTfLRm6QDbG74QAM6NX1uzXtIBhFEpEaDzk+8EgEvXbv8HACzSzDvKT+DKzE8CwMT0reQBiB1iqRHqGZ4QzPM6Ozb95Dsg5RDvPXRh0Tyvo21jsQOUqAfgUfXDreqHU9kLO92NDfIALOlc2N1f3Qn+ecDfsI8z39R8QRidIfP8z2WOvvgAhJNH3Y/hoe+RJw+sowvid4GjondFbEIKd5HFFWC5nFm9yM3siAiRbfELN6zZHoCrsl8Ylfy0mbqxtOvTCxoauQxrJpc8gJD4eDEk/D/m3zb8ri6PyWpdvXlH+I6Y+YQD8CrO6oMlwy86mfjnAX/D8hPm8o+3hVl/dmxaOLDhMp90AF4uVR+sGZEjFa3SkgHAy63iOyEehUjKIxxKSQc2kyCqSSd2kC7sJN2oI92JATj56aRonNZrOoew8JAObCOdglExJa0DIRUKBzuyeSfxo5p0LZrcQwfRlvMxOovacbL0CM54W/DlC4dwflNzrAB98Kh7JAF41AOwiYxYC2GxiQTmjad347DJh6GSoxh/eT+u72zCr00N+LO5Dn+3vo7ZtlqgfYd0gALVPhgVG5FFm0BTNCiKAk2poaELwCi3oDCrGSXq/siTSdm7dqwSdjEu+3V+nCptxQ+1e/HHgV2ArwH4rA041wNcPANMnAcmvwamxqUD8IYfJxWdA6tyO1yqoChEbubSjW0jHGpIF+ozuuEv+ACXat7Bg5Y6YPAwMH4KmBoTzIZTQgBCUlBqoSsudWANgENxYuGwcthKOtEg78Lwc0fwy55GoGcfcHFU1HTSABZBaDVylNtWdIR/O/EPwCoSwJvyToxubMFvB3ZjJtiKr4LHMPDeQbS/3Yi3al9F9UsvYsvmKlR5K1BZUQ632w2XywW325UcgKWOaGBRVsOlmu+Ik2axVfcuXit5BTXeMngWjLkkSDIAf2BjgZjvSBbMhnzY7UWSDbuWyekomZMMoKZtc7ECLJfRaER+fj6Ki4vXbdzhcIBhGGg1hlnJAAb6+d/jCRCSUqmEyWRCbm4uCgsL4XQ6Vxi22+2w2WzQ6/VQKBTC3+i1uXclA1jo+t00Nb9AokXTtCCxzxhdeb1kgPkueO8nA4CKIL02715atLVB1/ishnI8elLm1SrjI6Ox/JmoAUIQBsp7P1lxohZiY9Dm3YvZ/PKyKHa9oacq76oo2xxNqeJuWqFQQJWlmeMPrFlTVhc346lKVapSlZbI+hcf/WQs2PjpSAAAAABJRU5ErkJggg==";

    function getNormalizedObject(type, number) {
        if (type.toUpperCase() === 'SHARPLESS') type = 'Sh2';
        return `${type} ${number}`;
    }

    function createStellariumIcon(objectName) {
        const img = document.createElement('img');
        img.src = STELLARIUM_ICON_SRC;
        img.title = `Center in Stellarium: ${objectName}`;
        img.style.cssText = "width:18px; height:18px; vertical-align:middle; margin-left:5px; cursor:pointer; display:inline-block;";
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.onclick = (e) => { e.preventDefault(); e.stopPropagation(); sendStellariumFocus(objectName, wrapper); };
        return wrapper;
    }

    function scanAndInjectHeader() {
        const h1 = document.querySelector('h1');
        if (h1 && !processedElements.has(h1)) {
            const text = h1.innerText;
            let match; catalogRegex.lastIndex = 0;
            const matches = [];
            while ((match = catalogRegex.exec(text)) !== null) { matches.push(getNormalizedObject(match[1], match[2])); }
            if (matches.length > 0) {
                const container = document.createElement('span');
                container.style.fontSize = '0.6em';
                matches.forEach(objName => container.appendChild(createStellariumIcon(objName)));
                h1.appendChild(container);
                processedElements.add(h1);
            }
        }
    }

    function scanAndInjectLinks() {
        document.querySelectorAll('a').forEach(link => {
            if (processedElements.has(link)) return;
            const text = link.innerText.trim();
            if (text.length > 30 || text.length < 2) return;
            catalogRegex.lastIndex = 0;
            const match = catalogRegex.exec(text);
            if (match && match[0].length >= text.length - 5) {
                const icon = createStellariumIcon(getNormalizedObject(match[1], match[2]));
                link.parentNode.insertBefore(icon, link.nextSibling);
                processedElements.add(link);
            }
        });
    }

    function scanAndInjectCoordinates() {
        const raAbbr = document.querySelector('abbr.ra-coordinates');
        const decAbbr = document.querySelector('abbr.dec-coordinates');
        if (raAbbr && decAbbr) {
            const ra = parseFloat(raAbbr.getAttribute('title'));
            const dec = parseFloat(decAbbr.getAttribute('title'));
            if (!isNaN(ra) && !isNaN(dec)) {
                let orientation = null;
                document.querySelectorAll('strong.card-label').forEach(label => {
                    if (label.textContent.trim() === 'Orientation:') {
                        const match = label.parentElement.textContent.match(/([-\d.]+)\s*degrees/);
                        if (match) orientation = parseFloat(match[1]);
                    }
                });
                pageCoordinates = { ra, dec, orientation };
                showNinaButtons();
            }
        }
    }

    function sendStellariumFocus(name, uiElement) {
        const params = new URLSearchParams(); params.append('target', name);
        GM_xmlhttpRequest({
            method: "POST",
            url: `${SETTINGS.stellariumHost}/api/main/focus`,
            data: params.toString(),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: (res) => {
                if (res.status === 200) {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `${SETTINGS.stellariumHost}/api/main/action`,
                        data: "id=actionSetTracking_True",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                    });
                }
            }
        });
    }

    setInterval(() => {
        injectConfigButton();
        scanAndInjectHeader();
        scanAndInjectLinks();
        scanAndInjectCoordinates();
    }, 2000);

})();
