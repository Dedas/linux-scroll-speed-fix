'use strict';

let scrollFactor = 1.0;

//console.log(document.querySelectorAll("html"));

//Disable scroll smothing by setting smooth to auto
chrome.storage.local.get('smoothToggle', function(items) {
    if(items.smoothToggle !== 'false') {
        document.querySelectorAll("html")[0].style.scrollBehavior = "auto";

        //Extra surveillance for naughty changes
        mutationObserver.observe(document.querySelectorAll("html")[0], {
            attributes: true,
        }); 
    }
});

//Check for changes in html element to deal with banners changing smooth scrolling behavior
let mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function() {
        document.querySelectorAll("html")[0].style.scrollBehavior = "auto";
    });
});

chrome.storage.sync.get(function (items) {
    if (items['scrollFactor'] !== undefined) {
        scrollFactor = items['scrollFactor'];
    }
})

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

    if (element === getScrollRoot() || element === document.body) {
        element = window;
    }

    const isFrame = window.top !== window.self;
    
    if ( ! element) {
        if (isFrame) {
            parent.postMessage({
                deltaX: deltaX,
                deltaY: deltaY,
                CSS: 'ChangeScrollSpeed'
            }, '*');

            if (event.preventDefault) {
                // TODO
                // Is there a better solution for the iFrames?
                // Disabled due to cross site security blocking on some sites
                // Will hopefully not cause issues

                //event.preventDefault();
            }
        }

        return true;
    }

    element.scrollBy(deltaX * scrollFactor, deltaY * scrollFactor);

    if (event.preventDefault) {
        event.preventDefault();
    }
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
    return getComputedStyle(element, '')
        .getPropertyValue(horizontal ? 'overflow-x' : 'overflow-y');
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

window.addEventListener('message', message);

chrome.runtime.onMessage.addListener(chromeMessage);