'use strict';

let scrollFactor = 1.0;

// *** SETTINGS FETCHERS ***

// Get setting key variable
async function getSetting(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function(items){
                resolve(items);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}

async function getScrollFactor() {
    let result = await getSetting('scrollFactor');

    return result.scrollFactor;
}

async function getDisableExtension() {
    let result = await getSetting('disableExtension');
    const ignoredDomains = (await getSetting('ignoredDomains')).ignoredDomains ?? [];

    let pageIsIgnored = ignoredDomains.find(el => {
        if (el.endsWith('*')) {
            el = el.slice(0, -1);
            return window.location.href.startsWith(el);
        } else {
            el = el.split('?')[0];
            if ((`${window.location.origin}${window.location.pathname}` === el) || (window.location.host === el)) {
                return true;
            }
        }
    });
    
    if (pageIsIgnored) {
        return 'true';
    }

    return result.disableExtension;
}

async function getSmoothScroll() {
    const result = await getSetting('smoothScroll');
    
    return result.smoothScroll;
}

// *** INIT ***

init();

async function init() {
    let disableExtension = await getDisableExtension();
    let smoothScroll = await getSmoothScroll();

    // Check if extension is disabled. If not run main function.
    if(disableExtension == 'false') {  
        
        // Disable smooth scroll if needed
        if(smoothScroll == 'false') {
            try {
                window.onload = () => {
                    document.querySelectorAll("html")[0].style.scrollBehavior = "auto";
                    document.querySelector("body").style.scrollBehavior = "auto"
                }
            }
            catch(err) {
                console.log(err);
            }
        }
        
        // Run main function
        main();
    }
}

// Main function
async function main() {

    let smoothScroll = await getSmoothScroll();

    //Check for changes in html element to deal with banners changing smooth scrolling behavior
    let mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(async function() {
            
            smoothScroll = await getSmoothScroll();

            if(smoothScroll == 'false') {
                window.onload = () => {
                    document.querySelectorAll("html")[0].style.scrollBehavior = "auto";
                    document.querySelector("body").style.scrollBehavior = "auto"
                }

            }  
        });
    });

    try {
        mutationObserver.observe(document.querySelectorAll("html")[0], {
            attributes: true,
        }); 
    } catch (err) {
        console.log(err)
    }


    if (scrollFactor !== undefined) {
        scrollFactor = await getScrollFactor();
    }
    
    // This function runs every time a scroll is made
    function wheel(event) {
        const target = event.target;

        if (event.defaultPrevented || event.ctrlKey) {
            return true;
        }
    
        let deltaX = event.deltaX;
        let deltaY = event.deltaY;
    
        if (event.shiftKey && !(event.ctrlKey || event.altKey || event.metaKey)) {
            deltaX = deltaX || deltaY;
            deltaY = 0;
        }
    
        const xOnly = (deltaX && !deltaY);
    
        let element = overflowingAncestor(target, xOnly);

        if (element === getScrollRoot()) {
            element = window;
        }
    
        const isFrame = window.top !== window.self;

        if ( ! element) {
            if (isFrame) {

                if (event.preventDefault) {
                    // TODO
                    // Is there a better solution for the iFrames?
                    // Disabled due to cross site security blocking on some sites
                    // Will hopefully not cause issues
                }
            }
    
            return true;
        }

        /* SPECIAL SOLUTIONS */
        
        // Youtube fullscreen

        if (window.location.hostname === 'youtube.com') {
            youtubeFullScreen = element.getElementsByTagName('ytd-app')[0]

            if (youtubeFullScreen && window.document.fullscreenElement) {
                youtubeFullScreen.scrollBy({left: deltaX * scrollFactor, top: deltaY * scrollFactor, behavior:'auto'});
            }
        }

        else if (window.location.hostname === 'www.nexusmods.com') {
            getRealRoot().scrollBy({left: deltaX * scrollFactor, top: deltaY * scrollFactor, behavior:'auto'});
        }
        
        // Apply scrolling
        else {
            element.scrollBy({left: deltaX * scrollFactor, top: deltaY * scrollFactor, behavior:'auto'});
            
        }

        event.preventDefault();
    }
    
    function overflowingAncestor(element, horizontal) {
        const body = document.body;
        const root = window.document.documentElement
        const rootScrollHeight = root.scrollHeight;
        const rootScrollWidth = root.scrollWidth;
        const isFrame = window.top !== window.self;

        do {
            if (horizontal && rootScrollWidth === element.scrollWidth ||
                !horizontal && rootScrollHeight === element.scrollHeight) {
                const topOverflowsNotHidden = overflowNotHidden(root, horizontal) && overflowNotHidden(body, horizontal);
                const isOverflowCSS = topOverflowsNotHidden || overflowAutoOrScroll(root, horizontal);
    
                if (isFrame && isContentOverflowing(root, horizontal) || !isFrame && isOverflowCSS) {
                    
                    return getScrollRoot()
                }
            } else if (isContentOverflowing(element, horizontal) && overflowAutoOrScroll(element, horizontal)) {
                return element;
            }
        } while ((element = element.parentElement));
    }
    
    function isContentOverflowing(element, horizontal) {
        const client = horizontal ? element.clientWidth : element.clientHeight;
        const scroll = horizontal ? element.scrollWidth : element.scrollHeight;
    
        return (client + 10 < scroll);
    }
    
    function computedOverflow(element, horizontal) {
        return getComputedStyle(element, '').getPropertyValue(horizontal ? 'overflow-x' : 'overflow-y');
    }
    
    function overflowNotHidden(element, horizontal) {
        return computedOverflow(element, horizontal) !== 'hidden';
    }
    
    function overflowAutoOrScroll(element, horizontal) {
        return /^(scroll|auto)$/.test(computedOverflow(element, horizontal));
    }
    
    function getScrollRoot() {
        return (document.scrollingElement || document.body);
    }

    function getRealRoot() {
        return document.scrollingElement;
    }
    
    function message(message) {
        if (message.data.CSS !== 'ChangeScrollSpeed') {
            return;
        }
    
        let event = message.data;
        event.target = getFrameByEvent(message.source);
        wheel(event)
    }
    
    function getFrameByEvent(source) {
        const iframes = document.getElementsByTagName('iframe');
    
        return [].filter.call(iframes, function (iframe) {
            return iframe.contentWindow === source;
        })[0];
    }
    
    function chromeMessage(message) {
        if (message.scrollFactor) {
            scrollFactor = message.scrollFactor
        }
    }

    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    const el = (window.document || window.document.body || window)

    el.addEventListener(wheelEvent, wheel, {passive: false})

    function getIFrame(frame) {
        if((frame !== null) && (frame !== 'undefined') && (frame.width > 0)) {
            let el = frame;
            el.addEventListener(wheelEvent, wheel, {passive: false})
        }
    }

    getIFrame(window.document.querySelector('iframe'));

    window.addEventListener('message', message);

    chrome.runtime.onMessage.addListener(chromeMessage);
}