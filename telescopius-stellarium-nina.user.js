// ==UserScript==
// @name         Telescopius to Stellarium & NINA
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds Stellarium and NINA send buttons to Telescopius target pages and observing lists.
// @author       Dev
// @match        https://telescopius.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// @sandbox      raw
// @updateURL    https://raw.githubusercontent.com/chvvkumar/cloudynights_customization/main/telescopius-stellarium-nina.user.js
// @downloadURL  https://raw.githubusercontent.com/chvvkumar/cloudynights_customization/main/telescopius-stellarium-nina.user.js
// ==/UserScript==

(function () {
    'use strict';

    // --------------------------------------------------------------------------------
    // --- CONSTANTS AND CONFIGURATION ---
    // --------------------------------------------------------------------------------

    const ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE/0lEQVR4nO2WXUxbZRzGudJrvewLNOe09Lulh7YwAqWlLYl8rCibibotAbOhYzgkkxldtjHGpuDU9ZzS8jG+RNxkw8R9mBjQ7MKwyZjMjC2b88LEG+fmhXMXZhEecw6Uz56O069p0n/yJISWl+f3/p/3/75paalKVapS9b8oSzpnZGQ+HyPzzTCEfcgQFnHWQ2Ftme+4Kf24IW7GlUrf0wxhAwxhZxNgGuFkJr5/zIT163QHn4rdvIz9Nh6msuUsDDoOWoaDxjovLcMJvzPLRUBkvm9igjATXzAe5g06FhobJyqtlQcR7QYXfeZFYjM4OLFu8zqTuHHNKpmtHbDJ/WvilJ3h10sGEA5szDu/fvMaGwdTQQBtH46Hi9JH0gEIeyO0wOnRKxg5PQkp3eAzL8W8xsaBKQri6s07KLX3rVxPxl6PAsD3V2gB3vznI5MJ3X2NjYPL24/pWz/j/WMru2Am7INoOhBTfLRm6QDbG74QAM6NX1uzXtIBhFEpEaDzk+8EgEvXbv8HACzSzDvKT+DKzE8CwMT0reQBiB1iqRHqGZ4QzPM6Ozb95Dsg5RDvPXRh0Tyvo21jsQOUqAfgUfXDreqHU9kLO92NDfIALOlc2N1f3Qn+ecDfsI8z39R8QRidIfP8z2WOvvgAhJNH3Y/hoe+RJw+sowvid4GjondFbEIKd5HFFWC5nFm9yM3siAiRbfELN6zZHoCrsl8Ylfy0mbqxtOvTCxoauQxrJpc8gJD4eDEk/D/m3zb8ri6PyWpdvXlH+I6Y+YQD8CrO6oMlwy86mfjnAX/D8hPm8o+3hVl/dmxaOLDhMp90AF4uVR+sGZEjFa3SkgHAy63iOyEehUjKIxxKSQc2kyCqSSd2kC7sJN2oI92JATj56aRonNZrOoew8JAObCOdglExJa0DIRUKBzuyeSfxo5p0LZrcQwfRlvMxOovacbL0CM54W/DlC4dwflNzrAB98Kh7JAF41AOwiYxYC2GxiQTmjad347DJh6GSoxh/eT+u72zCr00N+LO5Dn+3vo7ZtlqgfYd0gALVPhgVG5FFm0BTNCiKAk2poaELwCi3oDCrGSXq/siTSdm7dqwSdjEu+3V+nCptxQ+1e/HHgV2ArwH4rA041wNcPANMnAcmvwamxqUD8IYfJxWdA6tyO1yqoChEbubSjW0jHGpIF+ozuuEv+ACXat7Bg5Y6YPAwMH4KmBoTzIZTQgBCUlBqoSsudWANgENxYuGwcthKOtEg78Lwc0fwy55GoGcfcHFU1HTSABZBaDVylNtWdIR/O/EPwCoSwJvyToxubMFvB3ZjJtiKr4LHMPDeQbS/3Yi3al9F9UsvYsvmKlR5K1BZUQ632w2XywW325UcgKWOaGBRVsOlmu+Ik2axVfcuXit5BTXeMngWjLkkSDIAf2BjgZjvSBbMhnzY7UWSDbuWyekomZMMoKZtc7ECLJfRaER+fj6Ki4vXbdzhcIBhGGg1hlnJAAb6+d/jCRCSUqmEyWRCbm4uCgsL4XQ6Vxi22+2w2WzQ6/VQKBTC3+i1uXclA1jo+t00Nb9AokXTtCCxzxhdeb1kgPkueO8nA4CKIL02715atLVB1/ishnI8elLm1SrjI6Ox/JmoAUIQBsp7P1lxohZiY9Dm3YvZ/PKyKHa9oacq76oo2xxNqeJuWqFQQJWlmeMPrFlTVhc346lKVapSlZbI+hcf/WQs2PjpSAAAAABJRU5ErkJggg==";

    const NINA_ICON_SRC = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='22' fill='%231e1e2e' stroke='%2389b4fa' stroke-width='2.5'/%3E%3Cpath d='M16 34V14l16 20V14' stroke='%2389b4fa' stroke-width='3.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

    const CLR = { ok: '#a6e3a1', err: '#f38ba8', border: '#45475a', text: '#cdd6f4', blue: '#89b4fa' };

    // Telescopius renders inside nested shadow roots, so this sheet is adopted into
    // every root the script injects into (document + page + each list row).
    const CSS = `
        .tl-section { padding: 8px 10px; }
        .tl-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .tl-title { font-size: 12px; color: #a6adc8; font-weight: 600; }
        .tl-label { font-size: 11px; color: #6c7086; margin: 6px 0 4px; }
        .tl-row { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .tl-entry { display: inline-flex; align-items: center; gap: 4px; padding: 3px 7px; border-radius: 6px; cursor: pointer;
                    background: #313244; border: 1px solid ${CLR.border}; transition: border-color 0.2s, background 0.2s; line-height: 1; }
        .tl-entry:hover { border-color: ${CLR.blue}; background: #45475a; }
        .tl-icon { width: 16px; height: 16px; vertical-align: middle; }
        .tl-name { font-size: 11px; color: ${CLR.text}; white-space: nowrap; }
        .tl-cog { cursor: pointer; display: inline-flex; align-items: center; opacity: 0.5; transition: opacity 0.2s; color: ${CLR.text}; }
        .tl-cog:hover { opacity: 1; color: ${CLR.blue}; }
        .tl-cog svg { width: 13px; height: 13px; fill: currentColor; }
        .tl-cog-float { position: fixed; right: 14px; bottom: 14px; z-index: 99999; background: #1e1e2e; border: 1px solid ${CLR.border}; border-radius: 50%; padding: 8px; }
        /* List rows: compact pills in the card footer; "add notes" must never shrink. */
        .tl-list-row { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; flex: 1 1 auto; min-width: 0; }
        .tl-list-row .tl-row { display: contents; }
        .tl-list-row .tl-entry { padding: 2px 5px; gap: 3px; }
        .tl-list-row .tl-icon { width: 13px; height: 13px; }
        .tl-list-row .tl-name { font-size: 10px; }
        #footer #notes { flex-shrink: 0; white-space: nowrap; margin-left: 8px; }

        .tl-cfg-ol { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .tl-cfg-win { background: #1e1e2e; color: ${CLR.text}; border-radius: 12px; padding: 24px; min-width: 420px; font-family: system-ui, sans-serif; box-shadow: 0 20px 50px rgba(0,0,0,0.5); border: 1px solid #313244; }
        .tl-cfg-title { margin: 0 0 20px; font-size: 18px; color: ${CLR.blue}; font-weight: 600; }
        .tl-cfg-label { display: block; font-size: 12px; color: #9399b2; margin-bottom: 6px; }
        .tl-cfg-field { margin-bottom: 20px; }
        .tl-cfg-row { margin-bottom: 12px; padding: 12px; background: #313244; border-radius: 8px; display: grid; grid-template-columns: 30px 1fr 2fr; gap: 10px; align-items: center; }
        .tl-cfg-in { padding: 6px; background: #181825; color: ${CLR.text}; border: 1px solid ${CLR.border}; border-radius: 4px; font-size: 12px; width: 100%; box-sizing: border-box; }
        .tl-cfg-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
        .tl-cfg-btn, .tl-cfg-btn-save { padding: 8px 20px; border-radius: 6px; cursor: pointer; }
        .tl-cfg-btn { background: transparent; color: #a6adc8; border: 1px solid ${CLR.border}; }
        .tl-cfg-btn-save { padding: 8px 24px; background: ${CLR.blue}; color: #11111b; border: none; font-weight: 600; }
    `;

    const COG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.1-28.2 18.2-44 24l-10.5 57.5c-1.7 9.3-8.9 16.5-18.2 17.8c-12.8 1.8-26 2.8-39.4 2.8s-26.5-.9-39.4-2.8c-9.4-1.3-16.5-8.5-18.2-17.8l-10.5-57.5c-15.8-5.8-30.7-13.9-44-24l-55.7 17.7c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.1 28.2-18.2 44-24l10.5-57.5c1.7-9.3 8.9-16.5 18.2-17.8C224.5 .9 237.7 0 251.1 0h9.8c12.8 0 26 .9 39.4 2.8c9.4 1.3 16.5 8.5 18.2 17.8l10.5 57.5c15.8 5.8 30.7 13.9 44 24l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>';

    const CFG = {
        stellarium: GM_getValue('stellariumHost', "http://localhost:8090"),
        nina: JSON.parse(GM_getValue('ninaHosts', JSON.stringify([
            { name: "Localhost", url: "http://localhost:1888", enabled: true },
            { name: "NINA 2", url: "", enabled: false },
            { name: "NINA 3", url: "", enabled: false },
        ])))
    };
    const activeHosts = () => CFG.nina.filter(h => h.enabled && h.url);

    // Shared constructable stylesheet, adopted into each shadow root we touch.
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(CSS);
    const adopt = (root) => {
        if (!root.adoptedStyleSheets.includes(sheet)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    };
    adopt(document);

    // --------------------------------------------------------------------------------
    // --- UTILITIES ---
    // --------------------------------------------------------------------------------

    const log = (...a) => console.log('[TL-Script]', ...a);
    const logErr = (...a) => console.error('[TL-Script]', ...a);

    const httpGet = (url, cb, errCb) => GM_xmlhttpRequest({ method: 'GET', url, onload: cb, onerror: errCb });
    const FORM_HDR = { "Content-Type": "application/x-www-form-urlencoded" };
    const stelPost = (path, data, cb, errCb) => GM_xmlhttpRequest({
        method: "POST", url: `${CFG.stellarium}/api/${path}`, data, headers: FORM_HDR,
        onload: cb || (() => {}), onerror: errCb || (() => {})
    });

    const createEl = (tag, cls, html = '', attrs = {}) => {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        if (html) el.innerHTML = html;
        Object.assign(el, attrs);
        return el;
    };
    const stopAndRun = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };

    const pillFeedback = (pill) => {
        pill.style.opacity = '0.5';
        return (color) => {
            pill.style.opacity = '1';
            pill.style.borderColor = color;
            setTimeout(() => { pill.style.borderColor = CLR.border; }, 3000);
        };
    };

    const mkEntry = (icon, label, title) => {
        const e = createEl('span', 'tl-entry', '', { title });
        e.append(createEl('img', 'tl-icon', '', { src: icon }), createEl('span', 'tl-name', label));
        return e;
    };

    const mkCog = (cls) => {
        const cog = createEl('span', cls, COG_SVG, { title: 'Telescopius script settings' });
        cog.onclick = stopAndRun(showConfig);
        return cog;
    };

    // --------------------------------------------------------------------------------
    // --- COORDINATE EXTRACTION ---
    // --------------------------------------------------------------------------------

    const num = (v) => { const n = parseFloat(v); return isNaN(n) ? null : n; };
    const valid = (c) => c && c.ra !== null && c.dec !== null;

    // Fallback when element properties are not visible (sandboxed userscript world):
    // parse "2hr 40' 24\"" / "-1° 50' 30\"" text from a tlc-coordinate element.
    const parseCoordText = (el, isRa) => {
        const t = (el?.shadowRoot || el)?.textContent || '';
        const m = t.match(/(-?)\s*(\d+)[^\d]+(\d+)[^\d]+(\d+(?:\.\d+)?)/);
        if (!m) return null;
        const v = (+m[2]) + (+m[3]) / 60 + (+m[4]) / 3600;
        return (m[1] === '-' ? -1 : 1) * (isRa ? v * 15 : v);
    };

    // Target page: tlc-page-deep-sky-object.dso.__raw_data.dso { ra (hours), dec, ids[], names[] }
    function readTargetPage(page) {
        const d = page.dso?.__raw_data?.dso;
        if (d && num(d.ra) !== null) {
            return { ra: d.ra * 15, dec: d.dec, rot: null, names: [...(d.ids || []).slice(0, 1), ...(d.names || [])] };
        }
        const cs = page.shadowRoot?.querySelector('dso-data-sheet')?.shadowRoot?.querySelectorAll('tlc-coordinate');
        if (cs?.length >= 2) {
            return { ra: parseCoordText(cs[0], true), dec: parseCoordText(cs[1], false), rot: null, names: [page.mainShortTitle || document.title.split('·')[0].trim()] };
        }
        return null;
    }

    // List row: tlc-observing-list-target.target { name, ra_hr, dec, position_angle_east }
    function readListRow(row) {
        const t = row.target;
        if (t && num(t.ra_hr) !== null) {
            return { ra: num(t.ra_hr) * 15, dec: num(t.dec), rot: num(t.position_angle_east), names: [t.name] };
        }
        const sr = row.shadowRoot;
        if (!sr) return null;
        const ra = parseCoordText(sr.querySelector('tlc-coordinate[type="ra"]'), true);
        const dec = parseCoordText(sr.querySelector('tlc-coordinate[type="dec"]'), false);
        const name = sr.querySelector('tlc-target-teaser')?.shadowRoot?.querySelector('.main-link')?.getAttribute('href')?.split('/')[2]?.toUpperCase().replace('-', ' ');
        return { ra, dec, rot: null, names: name ? [name] : [] };
    }

    // --------------------------------------------------------------------------------
    // --- BUTTON ACTIONS ---
    // --------------------------------------------------------------------------------

    function sendNina(host, c, pill) {
        log(`Sending to NINA (${host}): RA=${c.ra}, DEC=${c.dec}, ROT=${c.rot}`);
        const reset = pillFeedback(pill);
        httpGet(`${host}/v2/api/framing/set-coordinates?RAangle=${c.ra}&DecAngle=${c.dec}`, (res) => {
            log(`NINA Response (${host}): ${res.status} ${res.statusText}`);
            reset(res.status === 200 ? CLR.ok : CLR.err);
            if (res.status === 200 && c.rot !== null) {
                httpGet(`${host}/v2/api/framing/set-rotation?rotation=${c.rot}`, () => {});
            } else if (res.status !== 200) {
                logErr(`NINA Error Body: ${res.responseText}`);
            }
        }, (err) => { logErr('NINA Network Error:', err); reset(CLR.err); });
    }

    function sendStellariumCoords(c, pill) {
        log(`Sending Coords to Stellarium: RA=${c.ra}, DEC=${c.dec}`);
        const reset = pillFeedback(pill);
        const script = `core.moveToRaDecJ2000("${c.ra.toFixed(6)}d", "${c.dec.toFixed(6)}d", 3);`;
        stelPost('scripts/direct', `code=${encodeURIComponent(script)}`, (res) => {
            if (res.status === 200) {
                reset(CLR.ok);
                setTimeout(() => stelPost('main/fov', 'fov=20'), 3000);
            } else { logErr('Script Error:', res.responseText); reset(CLR.err); }
        }, (err) => { logErr('Network Error:', err); reset(CLR.err); });
    }

    function sendStellariumName(name, pill) {
        log(`Searching Object in Stellarium: ${name}`);
        const reset = pillFeedback(pill);
        stelPost('main/focus', `target=${encodeURIComponent(name)}`, (res) => {
            if (res.status === 200) {
                stelPost('main/action', 'id=actionSetTracking_True', () =>
                    stelPost('main/action', 'id=actionMoveToSelected', () => reset(CLR.ok)));
            } else { logErr(`Object NOT found: ${name}`); reset(CLR.err); }
        }, () => reset(CLR.err));
    }

    // --------------------------------------------------------------------------------
    // --- UI BUILDERS ---
    // --------------------------------------------------------------------------------

    // Row of send buttons: Stellarium (coords) + one per enabled NINA host.
    function buildSendRow(getCoords) {
        const row = createEl('div', 'tl-row');
        const stel = mkEntry(ICON_SRC, 'Stellarium', 'Center coordinates in Stellarium');
        stel.onclick = stopAndRun(() => { const c = getCoords(); if (valid(c)) sendStellariumCoords(c, stel); });
        row.appendChild(stel);
        activeHosts().forEach(host => {
            const e = mkEntry(NINA_ICON_SRC, host.name, `Send to ${host.name}`);
            e.onclick = stopAndRun(() => { const c = getCoords(); if (valid(c)) sendNina(host.url, c, e); });
            row.appendChild(e);
        });
        return row;
    }

    // Row of "focus by name" Stellarium buttons.
    function buildNameRow(names) {
        const row = createEl('div', 'tl-row');
        names.forEach(n => {
            const e = mkEntry(ICON_SRC, n, `Focus in Stellarium: ${n}`);
            e.onclick = stopAndRun(() => sendStellariumName(n, e));
            row.appendChild(e);
        });
        return row;
    }

    // --------------------------------------------------------------------------------
    // --- INJECTION ---
    // --------------------------------------------------------------------------------

    // Resolve the active page element inside dso-app > tlc-router shadow roots.
    const findPage = () => document.querySelector('dso-app')?.shadowRoot
        ?.querySelector('tlc-router')?.shadowRoot
        ?.querySelector('tlc-page-deep-sky-object, tlc-page-observing-list');

    function injectTargetPage(page) {
        const sr = page.shadowRoot;
        if (!sr || sr.querySelector('.tl-section')) return;
        const c = readTargetPage(page);
        if (!valid(c)) return;
        // Prefer the action bar (under the native "Open in Stellarium" button); fall back to the data sheet card.
        const stelBtn = sr.querySelector('#actionBar tlc-goto-stellarium-button');
        const anchor = stelBtn || sr.querySelector('dso-data-sheet');
        if (!anchor) return;
        adopt(sr);

        const section = createEl('div', 'tl-section');
        const header = createEl('div', 'tl-header');
        header.append(createEl('span', 'tl-title', 'Send coordinates to:'), mkCog('tl-cog'));
        section.append(header, buildSendRow(() => readTargetPage(page)));
        if (c.names.length) section.append(createEl('div', 'tl-label', 'Focus in Stellarium:'), buildNameRow(c.names));
        anchor.insertAdjacentElement(stelBtn ? 'afterend' : 'beforebegin', section);
        log('Injected target page UI', c);
    }

    function injectListPage(page) {
        const sr = page.shadowRoot;
        if (!sr) return;
        // One cog for the whole list, next to the epoch selector; floating fallback.
        if (!sr.querySelector('.tl-cog') && !document.querySelector('.tl-cog-float')) {
            adopt(sr);
            const epoch = sr.querySelector('tlc-epoch-selector');
            if (epoch) epoch.insertAdjacentElement('afterend', mkCog('tl-cog'));
            else document.body.appendChild(mkCog('tl-cog tl-cog-float'));
        }
        sr.querySelectorAll('tlc-observing-list-target').forEach(row => {
            const rsr = row.shadowRoot;
            if (!rsr || rsr.querySelector('.tl-list-row')) return;
            // Footer row (left of "add notes") keeps the card height unchanged.
            const footer = rsr.querySelector('#footer');
            if (!footer) return;
            const c = readListRow(row);
            if (!valid(c)) return;
            adopt(rsr);
            const wrap = createEl('div', 'tl-list-row');
            wrap.appendChild(buildSendRow(() => readListRow(row)));
            if (c.names[0]) wrap.appendChild(buildNameRow(c.names));
            footer.insertBefore(wrap, footer.firstChild);
        });
    }

    function scan() {
        const page = findPage();
        if (!page) return;
        if (page.tagName === 'TLC-PAGE-DEEP-SKY-OBJECT') injectTargetPage(page);
        else injectListPage(page);
    }

    // --------------------------------------------------------------------------------
    // --- CONFIG DIALOG ---
    // --------------------------------------------------------------------------------

    function showConfig() {
        const ov = createEl('div', 'tl-cfg-ol');
        const d = createEl('div', 'tl-cfg-win', `
            <h3 class="tl-cfg-title">Telescopius Script Settings</h3>
            <div class="tl-cfg-field">
                <label class="tl-cfg-label">Stellarium API URL</label>
                <input id="cfg-stel" type="text" value="${CFG.stellarium}" class="tl-cfg-in">
            </div>
            <label class="tl-cfg-label" style="margin-bottom:10px">N.I.N.A. Instances</label>
            ${CFG.nina.map((h, i) => `
                <div class="tl-cfg-row">
                    <input id="cfg-e-${i}" type="checkbox" ${h.enabled ? 'checked' : ''} style="cursor:pointer">
                    <input id="cfg-n-${i}" type="text" value="${h.name}" placeholder="Name" class="tl-cfg-in">
                    <input id="cfg-u-${i}" type="text" value="${h.url}" placeholder="URL" class="tl-cfg-in">
                </div>
            `).join('')}
            <div class="tl-cfg-footer">
                <button id="cfg-x" class="tl-cfg-btn">Cancel</button>
                <button id="cfg-s" class="tl-cfg-btn-save">Save</button>
            </div>
        `);
        ov.appendChild(d);
        document.body.appendChild(ov);
        const $ = (sel) => d.querySelector(sel);
        $('#cfg-x').onclick = () => ov.remove();
        $('#cfg-s').onclick = () => {
            GM_setValue('stellariumHost', $('#cfg-stel').value.trim());
            GM_setValue('ninaHosts', JSON.stringify(CFG.nina.map((_, i) => ({
                name: $(`#cfg-n-${i}`).value.trim() || `NINA ${i + 1}`,
                url: $(`#cfg-u-${i}`).value.trim(),
                enabled: $(`#cfg-e-${i}`).checked
            }))));
            ov.remove();
            location.reload();
        };
    }

    // --------------------------------------------------------------------------------
    // --- INITIALIZATION ---
    // --------------------------------------------------------------------------------

    // MutationObserver on document.body cannot see inside shadow roots, so poll.
    // ponytail: 1s poll; swap for per-root observers if it ever shows up in profiles.
    setInterval(scan, 1000);
    scan();
})();
