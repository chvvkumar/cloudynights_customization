// ==UserScript==
// @name         Cloudy Nights - Enhanced Features
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Adds post permalinks, collapsible stream header, and collapsible sidebar for Cloudy Nights
// @author       You
// @match        https://www.cloudynights.com/*
// @match        https://*.cloudynights.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloudynights.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // PART 1: POST PERMALINK FUNCTIONALITY (Unchanged)
    // ========================================

    /**
     * Injects CSS styles for permalinks using standard DOM methods.
     */
    function injectPermalinkStyles() {
        const style = document.createElement('style');
        style.id = 'cn-permalink-styles';
        style.textContent = `
            /* The overall clickable container for ID and Icon */
            .cn-permalink-container {
                display: flex;
                align-items: center;
                padding: 0 4px;
                cursor: pointer;
                text-decoration: none !important;
                transition: all 0.2s;
            }
            /* Apply hover effect to the whole container for visual feedback */
            .cn-permalink-container:hover {
                opacity: 1.0 !important;
                color: var(--accent-primary, #4a9eff) !important;
                text-shadow: 0 0 5px rgba(74, 158, 255, 0.3);
            }
            /* Style for the displayed post ID number */
            .cn-post-id-display {
                font-size: 11px;
                color: var(--text-muted, #6b7280) !important;
                font-weight: 500;
                margin-right: 2px;
                transition: color 0.2s;
            }
            .cn-permalink-container:hover .cn-post-id-display {
                color: var(--accent-primary, #4a9eff) !important;
            }
            /* Style for the link icon */
            .cn-permalink-icon {
                font-size: 14px;
                color: var(--text-secondary, #9ca3af) !important;
                opacity: 0.7;
                transition: color 0.2s, opacity 0.2s;
            }
            .cn-permalink-container:hover .cn-permalink-icon {
                opacity: 1.0;
                color: var(--accent-primary, #4a9eff) !important;
            }
            /* Style for the success message (non-disruptive feedback) */
            .cn-permalink-success {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--success, #10b981);
                color: white;
                padding: 12px 20px;
                border-radius: var(--radius-md, 8px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.5s, transform 0.5s;
                transform: translateY(100px);
            }
            .cn-permalink-success.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Copies text to the clipboard and shows a temporary success notification.
     * @param {string} textToCopy The URL or text to be copied.
     */
    function copyToClipboard(textToCopy) {
        // Use modern clipboard API if available, fallback to legacy method
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showSuccessMessage("Permalink copied to clipboard!");
            }).catch(err => {
                console.error('Could not copy text: ', err);
                showSuccessMessage("Failed to copy link.");
            });
        } else {
            // Fallback for non-secure contexts or older browsers
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showSuccessMessage("Permalink copied to clipboard!");
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showSuccessMessage("Failed to copy link.");
            }
            document.body.removeChild(textArea);
        }
    }

    /**
     * Shows a transient success message on the screen.
     * @param {string} message The message to display.
     */
    function showSuccessMessage(message) {
        let msgElement = document.getElementById('cn-permalink-notification');
        if (!msgElement) {
            msgElement = document.createElement('div');
            msgElement.id = 'cn-permalink-notification';
            msgElement.className = 'cn-permalink-success';
            document.body.appendChild(msgElement);
        }

        msgElement.textContent = message;
        msgElement.classList.add('show');

        // Hide the message after a timeout
        setTimeout(() => {
            msgElement.classList.remove('show');
        }, 2500);
    }

    /**
     * The main function to find posts and inject the permalink button.
     */
    function addPermalinks() {
        // Selector targets the wrapper containing the comment data, excluding already processed ones
        const postWrappers = document.querySelectorAll('div[data-commentid]:not([data-permalink-injected])');

        postWrappers.forEach(wrap => {
            // Extract the unique comment ID from the data attribute
            const postId = wrap.getAttribute('data-commentid');

            // Find the list where the 'More Options' ellipsis button lives
            const toolsList = wrap.querySelector('ul.ipsComment_tools');

            if (postId && toolsList) {
                // The anchor ID for a specific post is consistently prefixed with 'findComment-'
                const permalinkAnchor = `#findComment-${postId}`;

                // Construct the full URL by taking the current page URL (up to the hash) and adding the anchor
                const currentBaseUrl = window.location.href.split('#')[0];
                const fullPermalink = currentBaseUrl + permalinkAnchor;

                // 1. Create the new list item container
                const li = document.createElement('li');

                // 2. Create the unified clickable container (an <a> tag)
                const clickableContainer = document.createElement('a');
                clickableContainer.title = 'Copy Permalink (Post ID ' + postId + ')';
                clickableContainer.className = 'cn-permalink-container';
                clickableContainer.href = fullPermalink; // Set href for correct link handling (right-click, etc.)

                // 3. Create the element to display the post ID number
                const idDisplay = document.createElement('span');
                idDisplay.className = 'cn-post-id-display';
                idDisplay.textContent = `#${postId}`; // Display the ID prefixed with '#'

                // 4. Create the link icon element
                const iconElement = document.createElement('span');
                iconElement.className = 'cn-permalink-icon';
                iconElement.innerHTML = '<i class="fa fa-link"></i>'; // Font Awesome link icon

                // 5. Attach the click event to copy the URL
                clickableContainer.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent navigation
                    copyToClipboard(fullPermalink);
                });

                // 6. Assemble and inject
                clickableContainer.appendChild(idDisplay);
                clickableContainer.appendChild(iconElement);
                li.appendChild(clickableContainer);

                // Prepend the new list item before the ellipsis menu item
                toolsList.prepend(li);

                // Mark as injected to prevent reprocessing
                wrap.setAttribute('data-permalink-injected', 'true');
            }
        });
    }

    /**
     * Initialize permalink functionality
     */
    function initPermalinks() {
        // Inject styles
        injectPermalinkStyles();

        // Initial run on load
        addPermalinks();

        // Set up a MutationObserver to handle dynamically loaded content (e.g., infinite scroll)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // If new nodes were added, check if any of them are post wrappers
                    mutation.addedNodes.forEach(node => {
                        // Check if the added node or its children contain a post wrapper
                        if (node.nodeType === 1 && (node.matches('div[data-commentid]') || node.querySelector('div[data-commentid]'))) {
                            addPermalinks();
                        }
                    });
                }
            });
        });

        // Target the main post feed container (Invision Community uses 'elPostFeed' or similar wrapper)
        const targetNode = document.getElementById('elPostFeed');
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        } else {
            // Fallback or attempt to target the entire document body if specific container is hard to find
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // ========================================
    // PART 2: STREAM HEADER COLLAPSE FUNCTIONALITY
    // ========================================
    // Note: The CSS for collapsing the stream header is intentionally kept in the JS
    // due to the specific, complex nature of the CSS required to hide elements 
    // within the IPS container structure on discover/forum pages.
    
    /**
     * Collapses the entire stream header section (title, description, buttons, and filters)
     * by default and adds a toggle button to expand/collapse it
     */
    function initFilterCollapse() {
        // Wait a bit for the page to load
        setTimeout(function() {
            findAndCollapseFilters();
        }, 100);
    }

    function findAndCollapseFilters() {
        const isDiscoverPage = window.location.pathname.startsWith('/discover/');

        // Selectors for the main header containing filters/title
        const possibleSelectors = [
            '.ipsPageHeader.ipsBox',
            '.ipsPageHeader',
            'section[data-streamID] > .ipsPageHeader',
        ];

        let headerContainer = null;

        for (const selector of possibleSelectors) {
            const found = document.querySelector(selector);
            if (found) {
                headerContainer = found;
                break;
            }
        }

        if (headerContainer) {
            // On the discover page, we only want to collapse the filter bar, not the title
            // The filter form is inside the header container
            let collapseTarget = headerContainer.querySelector('#elStreamFilterForm');
            let buttonInsertTarget = headerContainer.querySelector('.ipsFlex.ipsFlex-jc\\:between.ipsFlex-ai\\:start');

            // Fallback for non-discover pages (like forums, where we collapse the whole header)
            if (!isDiscoverPage || !collapseTarget) {
                 collapseTarget = headerContainer;
                 buttonInsertTarget = headerContainer.parentNode.querySelector('.ipsPageHeader.ipsResponsive_pull');
                 if (!buttonInsertTarget) {
                    // Fallback to inserting before the header itself
                    buttonInsertTarget = headerContainer;
                 }
            }
            
            // On discover pages, we sometimes need to make sure the stream body isn't blocked
            if (isDiscoverPage && headerContainer) {
                 // Check if the stream body exists and is currently being blocked
                const streamBody = document.querySelector('[data-role="streamBody"]');
                if (streamBody) {
                    // Set z-index to ensure the stream body is clickable even if the filter bar is collapsed
                    streamBody.style.position = 'relative';
                    streamBody.style.zIndex = '5';
                }
            }
            
            if (collapseTarget && buttonInsertTarget) {
                setupCollapse(collapseTarget, buttonInsertTarget);
            }
        }
    }

    function setupCollapse(collapseTarget, buttonInsertTarget) {
        // Add unique class to avoid duplicate processing
        if (collapseTarget.classList.contains('cn-filter-processed')) {
            return;
        }
        collapseTarget.classList.add('cn-filter-processed');

        // Inject styles first
        injectFilterStyles();

        // Create wrapper for toggle button
        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'cn-filter-toggle-wrapper';

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'cn-filter-toggle';
        toggleBtn.innerHTML = '<i class="fa fa-chevron-down"></i><span>Show Stream Info</span>';
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-label', 'Toggle stream header visibility');
        toggleBtn.type = 'button'; // Prevent form submission
        
        toggleWrapper.appendChild(toggleBtn);

        // Insert toggle button before the filter container
        buttonInsertTarget.parentNode.insertBefore(toggleWrapper, buttonInsertTarget);

        // Initially collapse the filters
        collapseTarget.classList.add('cn-collapsed');

        // Toggle functionality
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isCollapsed = collapseTarget.classList.contains('cn-collapsed');

            if (isCollapsed) {
                collapseTarget.classList.remove('cn-collapsed');
                collapseTarget.classList.add('cn-expanded');
                toggleBtn.innerHTML = '<i class="fa fa-chevron-up"></i><span>Hide Stream Info</span>';
                toggleBtn.setAttribute('aria-expanded', 'true');
            } else {
                collapseTarget.classList.add('cn-collapsed');
                collapseTarget.classList.remove('cn-expanded');
                toggleBtn.innerHTML = '<i class="fa fa-chevron-down"></i><span>Show Stream Info</span>';
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function injectFilterStyles() {
        // Check if styles already injected
        if (document.getElementById('cn-stream-header-collapse-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'cn-stream-header-collapse-styles';
        style.textContent = `
            /* Fix: Ensure stream content is clickable below the header on discover pages */
            .ipsPageHeader.ipsBox {
                z-index: 10; /* Ensure header controls are clickable */
            }

            /* Toggle button wrapper: Important for positioning on different pages */
            .cn-filter-toggle-wrapper {
                margin-bottom: 8px !important;
            }

            /* Toggle button styling for stream header collapse */
            .cn-filter-toggle {
                background: linear-gradient(135deg, var(--accent-primary, #4a9eff) 0%, var(--accent-secondary, #3182ce) 100%) !important;
                color: white !important;
                border: none !important;
                border-radius: var(--radius-sm, 6px) !important;
                padding: 3px 10px !important;
                font-size: 13px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.3)) !important;
                font-family: inherit !important;
                line-height: 1.2 !important;
            }

            .cn-filter-toggle:hover {
                background: linear-gradient(135deg, var(--accent-secondary, #3182ce) 0%, var(--accent-primary, #4a9eff) 100%) !important;
                box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.4)) !important;
                transform: translateY(-1px) !important;
            }

            .cn-filter-toggle:active {
                transform: translateY(0) !important;
            }

            .cn-filter-toggle i {
                font-size: 12px !important;
                transition: transform 0.3s ease !important;
            }

            .cn-filter-toggle[aria-expanded="true"] i {
                transform: rotate(180deg) !important;
            }

            /* Collapsed state for stream header */
            .cn-collapsed {
                max-height: 0 !important;
                overflow: hidden !important;
                opacity: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                border: none !important;
                display: block !important;
                visibility: hidden !important;
                transition: max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease, padding 0.3s ease, visibility 0.3s !important;
            }

            /* Expanded state */
            .cn-expanded {
                max-height: 2000px !important;
                opacity: 1 !important;
                overflow: visible !important;
                visibility: visible !important;
                display: block !important;
                transition: max-height 0.4s ease, opacity 0.3s ease, visibility 0.3s !important;
            }

            /* Ensure stream header container has transition when not collapsed */
            .cn-filter-processed {
                transition: max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease, padding 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // PART 3: UNIVERSAL SIDEBAR TOGGLE FUNCTIONALITY
    // ========================================
    
    // Store sidebar state globally using localStorage
    const SIDEBAR_STATE_KEY = 'cn_sidebar_collapsed';

    function initSidebarToggle() {
        // 1. Create the toggle button (relying entirely on cn.CSS for styling)
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'cn-sidebar-toggle-btn';
        toggleBtn.title = 'Toggle Sidebar';
        // Note: The icon rotation is handled by CSS based on the body class
        toggleBtn.innerHTML = '<i class="fa fa-chevron-right"></i>';

        // 2. Insert the button into the body
        // Only insert the button if the sidebar element exists
        const sidebar = document.getElementById('ipsLayout_sidebar');
        if (!sidebar) return;
        
        document.body.appendChild(toggleBtn);
        
        // 3. Wrap the main content and sidebar in a flex container for consistent DOM structure
        const mainArea = document.getElementById('ipsLayout_mainArea');
        const contentArea = document.getElementById('ipsLayout_contentArea');
        
        if (mainArea && contentArea) {
             mainArea.classList.add('cn-main-content');
             
             // Create a new container to wrap the main and sidebar sections
             const wrapper = document.createElement('div');
             wrapper.classList.add('cn-main-container');

             const parent = mainArea.parentNode;
             
             // Move mainArea and sidebar into the wrapper
             wrapper.appendChild(mainArea);
             wrapper.appendChild(sidebar);
             
             // Insert the wrapper back into the original parent
             parent.appendChild(wrapper);
        }


        // 4. Load saved state and apply initial classes
        const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
        const isCollapsed = savedState === 'true';

        if (isCollapsed) {
            document.body.classList.add('cn-sidebar-collapsed');
        } else {
            document.body.classList.remove('cn-sidebar-collapsed');
        }

        // 5. Add event listener to toggle state
        toggleBtn.addEventListener('click', () => {
            const isCurrentlyCollapsed = document.body.classList.toggle('cn-sidebar-collapsed');
            localStorage.setItem(SIDEBAR_STATE_KEY, isCurrentlyCollapsed);
        });
    }


    // ========================================
    // INITIALIZATION
    // ========================================

    function initializeFeatures() {
        // Initialize sidebar toggle
        initSidebarToggle();
        
        // Only run stream header collapse on pages that use it (discover/forums/topics)
        const isDiscoverPage = window.location.pathname.startsWith('/discover/');
        const isTopicPage = window.location.pathname.includes('/forums/topic/');
        
        if (isDiscoverPage || isTopicPage) {
            initFilterCollapse();
            setTimeout(initFilterCollapse, 500); // Rerun for dynamic content
        }

        initPermalinks(); // Permalink is useful everywhere
        console.log('Cloudy Nights Enhanced Features loaded (v2.3)');
    }

    // Initialize both features immediately (script runs at document-end)
    initializeFeatures();

})();

