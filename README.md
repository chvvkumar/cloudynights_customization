# Tampermonkey scripts

## CN_CombinedScript.user.js

Customisations for the CloudyNights forums.

## astrobin-stellarium-nina.user.js

Adds "send coordinates" buttons to AstroBin image pages. Reads the plate-solved RA, Dec and rotation from the page and sends them to Stellarium (Remote Control plugin) or one or more N.I.N.A. instances (Advanced API plugin, framing tab).

## telescopius-stellarium-nina.user.js

Same buttons for Telescopius.

- Target pages (`/deep-sky-objects/...`): a "Send coordinates to" block under the native "Open in Stellarium" button, plus "Focus in Stellarium" buttons for each catalog name.
- Observing lists (`/observing-lists/<id>`): a button row in the footer of every target card, left of "add notes". Rows render lazily, so buttons appear as you scroll.
- Settings cog (next to the buttons on target pages, next to the epoch toggle on lists): Stellarium URL and up to three N.I.N.A. instances. Saving reloads the page.

Coordinates are read from the Polymer element properties (J2000, RA converted from hours to degrees). Camera position angle on list targets, when set, is sent to N.I.N.A. as rotation. Telescopius renders in nested shadow roots, so the script polls once per second instead of using a MutationObserver.

Requirements:

- Stellarium: Remote Control plugin enabled, default port 8090.
- N.I.N.A.: Advanced API plugin, default port 1888. Framing tab must be open to see the result.
- Tampermonkey: install from the raw GitHub URL so `@updateURL` keeps it current.
