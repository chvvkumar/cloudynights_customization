// ==UserScript==
// @name         AstroBin to Stellarium & NINA (Optimized)
// @namespace    http://tampermonkey.net/
// @version      13.1
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

    // --- ASSETS & STYLES ---
    const ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE/0lEQVR4nO2WXUxbZRzGudJrvewLNOe09Lulh7YwAqWlLYl8rCibibotAbOhYzgkkxldtjHGpuDU9ZzS8jG+RNxkw8R9mBjQ7MKwyZjMjC2b88LEG+fmhXMXZhEecw6Uz56O069p0n/yJISWl+f3/p/3/75paalKVapS9b8oSzpnZGQ+HyPzzTCEfcgQFnHWQ2Ftme+4Kf24IW7GlUrf0wxhAwxhZxNgGuFkJr5/zIT163QHn4rdvIz9Nh6msuUsDDoOWoaDxjovLcMJvzPLRUBkvm9igjATXzAe5g06FhobJyqtlQcR7QYXfeZFYjM4OLFu8zqTuHHNKpmtHbDJ/WvilJ3h10sGEA5szDu/fvMaGwdTQQBtH46Hi9JH0gEIeyO0wOnRKxg5PQkp3eAzL8W8xsaBKQri6s07KLX3rVxPxl6PAsD3V2gB3vznI5MJ3X2NjYPL24/pWz/j/WMru2Am7INoOhBTfLRm6QDbG74QAM6NX1uzXtIBhFEpEaDzk+8EgEvXbv8HACzSzDvKT+DKzE8CwMT0reQBiB1iqRHqGZ4QzPM6Ozb95Dsg5RDvPXRh0Tyvo21jsQOUqAfgUfXDreqHU9kLO92NDfIALOlc2N1f3Qn+ecDfsI8z39R8QRidIfP8z2WOvvgAhJNH3Y/hoe+RJw+sowvid4GjondFbEIKd5HFFWC5nFm9yM3siAiRbfELN6zZHoCrsl8Ylfy0mbqxtOvTCxoauQxrJpc8gJD4eDEk/D/m3zb8ri6PyWpdvXlH+I6Y+YQD8CrO6oMlwy86mfjnAX/D8hPm8o+3hVl/dmxaOLDhMp90AF4uVR+sGZEjFa3SkgHAy63iOyEehUjKIxxKSQc2kyCqSSd2kC7sJN2oI92JATj56aRonNZrOoew8JAObCOdglExJa0DIRUKBzuyeSfxo5p0LZrcQwfRlvMxOovacbL0CM54W/DlC4dwflNzrAB98Kh7JAF41AOwiYxYC2GxiQTmjad347DJh6GSoxh/eT+u72zCr00N+LO5Dn+3vo7ZtlqgfYd0gALVPhgVG5FFm0BTNCiKAk2poaELwCi3oDCrGSXq/siTSdm7dqwSdjEu+3V+nCptxQ+1e/HHgV2ArwH4rA041wNcPANMnAcmvwamxqUD8IYfJxWdA6tyO1yqoChEbubSjW0jHGpIF+ozuuEv+ACXat7Bg5Y6YPAwMH4KmBoTzIZTQgBCUlBqoSsudWANgENxYuGwcthKOtEg78Lwc0fwy55GoGcfcHFU1HTSABZBaDVylNtWdIR/O/EPwCoSwJvyToxubMFvB3ZjJtiKr4LHMPDeQbS/3Yi3al9F9UsvYsvmKlR5K1BZUQ632w2XywW325UcgKWOaGBRVsOlmu+Ik2axVfcuXit5BTXeMngWjLkkSDIAf2BjgZjvSBbMhnzY7UWSDbuWyekomZMMoKZtc7ECLJfRaER+fj6Ki4vXbdzhcIBhGGg1hlnJAAb6+d/jCRCSUqmEyWRCbm4uCgsL4XQ6Vxi22+2w2WzQ6/VQKBTC3+i1uXclA1jo+t00Nb9AokXTtCCxzxhdeb1kgPkueO8nA4CKIL02715atLVB1/ishnI8elLm1SrjI6Ox/JmoAUIQBsp7P1lxohZiY9Dm3YvZ/PKyKHa9oacq76oo2xxNqeJuWqFQQJWlmeMPrFlTVhc346lKVapSlZbI+hcf/WQs2PjpSAAAAABJRU5ErkJggg==";

    const CSS = `
        .ab-nina-li { display: none; position: relative; z-index: 9999; }
        .ab-nina-wrap { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3px; height: 100%; padding: 0 12px; border-left: 1px solid #444; margin-left: 5px; }
        .ab-nina-coords { font-family: monospace; font-size: 10px; color: #bac2de; white-space: nowrap; line-height: 1; margin-bottom: 1px; }
        .ab-nina-pill { display: flex; align-items: center; justify-content: center; width: 34px; height: 20px; border-radius: 100px; background: #313244; border: 1px solid #45475a; transition: all 0.2s; box-sizing: border-box; }
        .ab-nina-pill:hover { border-color: #89b4fa; background: #45475a; }
        .ab-nina-btn { cursor: pointer; text-decoration: none; position: relative; display: inline-block; z-index: 10001; }
        .ab-s-wrap { display: inline-flex; align-items: center; cursor: pointer; margin-left: 5px; }
        .ab-s-icon { width: 18px; height: 18px; vertical-align: middle; }
        .ab-cfg-ol { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .ab-cfg-win { background: #1e1e2e; color: #cdd6f4; border-radius: 12px; padding: 24px; min-width: 420px; font-family: system-ui, sans-serif; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid #313244; }
        .ab-cfg-row { margin-bottom: 12px; padding: 12px; background: #313244; border-radius: 8px; display: grid; grid-template-columns: 30px 1fr 2fr; gap: 10px; align-items: center; }
        .ab-cfg-in { padding: 6px; background: #181825; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; font-size: 12px; width: 100%; }
        .ab-txt-blue { color: #89b4fa; }
        .ab-txt-pink { color: #f5c2e7; margin-left: 6px; }
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

    const CATALOG_REGEX = /\b(M|NGC|IC|Mel|Cr|Col|Sharpless|Sh2|LBN|LDN|Abell|HD|SAO|HIP|B|vdB|UGC|PGC|ESO|Mrk)\s*-?\s*(\d+)\b/ig;
    const processed = new Set();
    const ninaElements = [];
    let curCoords = null;

    const styleEl = document.createElement('style');
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    // --- UTILS ---
    const normalize = (t, n) => `${t.toUpperCase() === 'SHARPLESS' ? 'Sh2' : t} ${n}`;
    
    const http = (url, method, cb, errCb) => GM_xmlhttpRequest({
        method, url, onload: cb, onerror: errCb
    });

    const createEl = (tag, className, html = '') => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (html) el.innerHTML = html;
        return el;
    };

    // --- NINA ---
    function updateNinaUI() {
        if (!curCoords) return;
        let html = `<span class="ab-txt-blue">RA</span> ${curCoords.ra.toFixed(3)}° <span class="ab-txt-blue" style="margin-left:6px">DEC</span> ${curCoords.dec.toFixed(3)}°`;
        if (curCoords.rot !== null) html += `<span class="ab-txt-pink">ROT</span> ${curCoords.rot.toFixed(1)}°`;
        
        ninaElements.forEach(li => {
            if (document.body.contains(li)) {
                li.style.display = 'list-item';
                const lbl = li.querySelector('.ab-nina-coords');
                if (lbl) lbl.innerHTML = html;
            }
        });
    }

    function sendNina(host, ra, dec, pill) {
        if (!pill) return;
        pill.style.opacity = '0.5';
        const reset = () => setTimeout(() => pill.style.borderColor = '#45475a', 3000);
        
        http(`${host}/v2/api/framing/set-coordinates?RAangle=${ra}&DecAngle=${dec}`, "GET", (res) => {
            pill.style.opacity = '1';
            pill.style.borderColor = res.status === 200 ? '#a6e3a1' : '#f38ba8';
            if (res.status === 200 && curCoords?.rot !== null) {
                http(`${host}/v2/api/framing/set-rotation?rotation=${curCoords.rot}`, "GET", () => {});
            }
            reset();
        }, () => {
            pill.style.opacity = '1';
            pill.style.borderColor = '#f38ba8';
            reset();
        });
    }

    function injectConfig() {
        if (document.getElementById('ab-nina-script-injected')) return;
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

            const row = createEl('div');
            row.style.cssText = 'display:flex; align-items:center; gap:10px;';

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

    // --- STELLARIUM ---
    function sendStellarium(name, img) {
        if (img) img.style.opacity = '0.5';
        const anim = (col) => {
            if (!img) return;
            img.style.opacity = '1';
            img.style.filter = `sepia(100%) hue-rotate(${col}) saturate(500%)`;
            setTimeout(() => img.style.filter = "none", 2000);
        };

        http(`${SETTINGS.stellarium}/api/main/focus`, "POST", (res) => {
            if (res.status === 200) {
                http(`${SETTINGS.stellarium}/api/main/action`, "POST", 
                    () => anim("100deg"), () => anim("-50deg"), 
                    "id=actionSetTracking_True", { "Content-Type": "application/x-www-form-urlencoded" });
            } else anim("-50deg");
        }, () => anim("-50deg"))
        // Pass data via the 5th arg hack or just modify http wrapper? 
        // Modifying call for simplicity:
        .send(`target=${encodeURIComponent(name)}`);
    }
    
    // Fix for the specific POST data requirement of Stellarium that doesn't fit generic GET
    function postStellarium(url, data, img) {
        GM_xmlhttpRequest({
            method: "POST", url, data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload: (res) => {
                if (res.status === 200) {
                    if (url.includes('focus')) {
                        postStellarium(`${SETTINGS.stellarium}/api/main/action`, "id=actionSetTracking_True", img);
                    } else if (img) {
                        img.style.opacity = '1';
                        img.style.filter = "sepia(100%) hue-rotate(100deg) saturate(500%)";
                        setTimeout(() => img.style.filter = "none", 2000);
                    }
                } else if (img) {
                    img.style.opacity = '1'; img.style.filter = "sepia(100%) hue-rotate(-50deg) saturate(600%)";
                    setTimeout(() => img.style.filter = "none", 2000);
                }
            },
            onerror: () => { if(img) { img.style.opacity = '1'; img.style.filter = "sepia(100%) hue-rotate(-50deg) saturate(600%)"; setTimeout(() => img.style.filter = "none", 2000); }}
        });
    }

    function createIcon(name) {
        const wrap = createEl('span', 'ab-s-wrap');
        const img = createEl('img', 'ab-s-icon');
        img.src = ICON_SRC;
        img.title = `Center in Stellarium: ${name}`;
        wrap.appendChild(img);
        wrap.onclick = (e) => { e.preventDefault(); e.stopPropagation(); postStellarium(`${SETTINGS.stellarium}/api/main/focus`, `target=${name}`, img); };
        return wrap;
    }

    // --- SCANNERS ---
    function scan() {
        // Config Button
        injectConfig();

        // Header (H1)
        const h1 = document.querySelector('h1');
        if (h1 && !processed.has(h1)) {
            const matches = [...h1.innerText.matchAll(CATALOG_REGEX)];
            if (matches.length) {
                const c = createEl('span');
                c.style.fontSize = '0.6em';
                matches.forEach(m => c.appendChild(createIcon(normalize(m[1], m[2]))));
                h1.appendChild(c);
                processed.add(h1);
            }
        }

        // Links
        document.querySelectorAll('a').forEach(link => {
            if (processed.has(link)) return;
            const txt = link.innerText.trim();
            if (txt.length < 2 || txt.length > 30) return;
            
            // Fast regex check
            CATALOG_REGEX.lastIndex = 0; // Reset global regex
            const match = CATALOG_REGEX.exec(txt);
            if (match && match[0].length >= txt.length - 5) {
                const icon = createIcon(normalize(match[1], match[2]));
                link.parentNode.insertBefore(icon, link.nextSibling || link.parentNode.appendChild(icon));
                processed.add(link);
            }
        });

        // Coordinates
        const r = document.querySelector('abbr.ra-coordinates');
        const d = document.querySelector('abbr.dec-coordinates');
        if (r && d) {
            const ra = parseFloat(r.getAttribute('title'));
            const dec = parseFloat(d.getAttribute('title'));
            if (!isNaN(ra) && !isNaN(dec)) {
                let rot = null;
                document.querySelectorAll('strong.card-label').forEach(l => {
                    if (l.textContent.trim() === 'Orientation:') {
                        const m = l.parentElement.textContent.match(/([-\d.]+)\s*degrees/);
                        if (m) rot = parseFloat(m[1]);
                    }
                });
                curCoords = { ra, dec, rot };
                updateNinaUI();
            }
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
