// User information elements
const osText = document.getElementById('osDetected');
const statusText = document.getElementById('statusText');

// User input elements
const scrollFactorInput = document.getElementById('scrollFactorInput');
const customSettingButton = document.getElementById('customSettingButton');
const smoothScrollButton = document.getElementById('smoothScrollButton');
const ignoredDomainsTextArea = document.getElementById('ignoredDomains');

// Default scroll speed variables
const linuxSpeed = 1.9;
const windowsSpeed = 1.0;
const macSpeed = 1.0;

// *** INIT ***

init();

// Detects OS and set scroll speed
async function init() {
    let smoothScroll = await getSmoothScroll();
    let customSetting = await getCustomSetting();
    let disableExtension = await getDisableExtension();
    let os = await getOS();

    // Do not initiate if custom settings is checked
    if(customSetting !== 'true') {
        if(os == 'linux') {
            // Set Linux values
            osText.innerHTML = 'Linux';
            statusText.innerHTML = 'Enabled';
            
            scrollFactorInput.value = linuxSpeed;
            scrollFactorInput.disabled = true;

            smoothScrollButton.disabled = true;
            smoothScrollButton.checked = false;
            
            customSettingButton.checked = false;

            setScrollFactor(linuxSpeed);
        } else if(os == 'win') {
            // TODO Some buginess here with smoothscroll toggle
            // Set Windows values
            osText.innerHTML = 'Windows';
            statusText.innerHTML = 'Disabled';
            
            scrollFactorInput.value = windowsSpeed
            scrollFactorInput.disabled = true;
            
            smoothScrollButton.disabled = true;
            smoothScrollButton.checked = true;
            
            customSettingButton.checked = false;

            setScrollFactor(windowsSpeed);
        } else if(os == 'mac') {
            osText.innerHTML = 'MacOS';
            statusText.innerHTML = 'Disabled'
            
            scrollFactorInput.value = macSpeed
            scrollFactorInput.disabled = true;
            
            smoothScrollButton.disabled = true;
            smoothScrollButton.checked = true;
            
            customSettingButton.checked = false;
            
            setScrollFactor(macSpeed);
        }      
    } else {
        // Custom settings
        let scrollFactor = await getScrollFactor();

        osText.innerHTML = 'Custom';
        statusText.innerHTML = 'Enabled';
        
        scrollFactorInput.value = scrollFactor;
        scrollFactorInput.disabled = false;
        
        smoothScrollButton.disabled = false;
        
        customSettingButton.checked = true;

        if(smoothScroll == 'true') {
            smoothScrollButton.checked = true;
        } else {
            smoothScrollButton.checked = false;
        }
    }

    updateSmoothScroll();
    updateDisableExtension(disableExtension);

    ignoredDomainsTextArea.value = '';
    const {ignoredDomains} = await getSetting('ignoredDomains');
    if (ignoredDomains) {
        ignoredDomainsTextArea.value = ignoredDomains.join('\n');
    }
}

// Detect OS
async function getOS() {
    return new Promise((resolve, reject) => {
        try {
            chrome.runtime.getPlatformInfo(function (info) {
                resolve(info.os);
            })
        }
        catch (ex) {
            reject(ex)
        }
    });
}

// *** SETTINGS ***

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

// SCROLL FACTOR

async function getScrollFactor() {
    let result = await getSetting('scrollFactor');

    return result.scrollFactor;
}

function setScrollFactor(value) {

    if (value < 0 || value > 1000) {
        return;
    } else {
        chrome.storage.local.set({'scrollFactor': value});
    }

    updateScrollFactor();
}

async function updateScrollFactor() {
    let value = parseFloat(await getScrollFactor());

    chrome.tabs.query({windowType: "normal"}, function(tabs) {
        for(let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, {scrollFactor: value, CSS: 'ChangeScrollSpeed'});
        }
    });

}

// SMOOTH SCROLL

// Get smoothscroll variable
async function getSmoothScroll() {
    let result = await getSetting('smoothScroll');

    return result.smoothScroll;
}

// Set smoothscroll variable
function setSmoothScroll(value) {
    chrome.storage.local.set({'smoothScroll':value})
}

// Apply smooth scroll setting when button is pressed in popup.js
function updateSmoothScroll() {
    
    if(smoothScrollButton.checked == true) {
        setSmoothScroll('true');
        disableSmoothCSS(false);
    } else {
        setSmoothScroll('false');
        disableSmoothCSS(true);
    }
}

// This function disables and enables CSS smooth scrolling
function disableSmoothCSS(value) {

        if(value) {
            // Code to insert
            let code = `document.querySelectorAll("html")[0].style.scrollBehavior = "auto";`;

            // Loop through all tabs and insert code
            executeScriptAllTabs(code);

        } else {
            // Code to insert
            let code = `document.querySelectorAll("html")[0].style.scrollBehavior = "";`;

            // Loop through all tabs and insert code
            executeScriptAllTabs(code);

        }
}

function executeScriptAllTabs(code) {

    chrome.tabs.query({windowType: "normal"}, function(tabs) {

        for(let i = 0; i < tabs.length; i++) {
            try {
                if(tabs[i].url) {
                    chrome.tabs.executeScript(tabs[i].id, { code }, function() {
                        if(chrome.runtime.lastError) {} // Suppress error
                    });  
                }
            }
            catch(err) {
                console.log(err);
            }
        }
    });
}

// REFRESH TABS
function refreshTab(message) {

    if((message) && (confirm(message))) {
        chrome.tabs.getAllInWindow(null, function(tabs) {
            for(let i = 0; i < tabs.length; i++) {
                chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
            }
        });
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
    };
}

// CUSTOM SETTING

async function getCustomSetting() {
    let result = await getSetting('customSetting');

    return result.customSetting;
}

// Set custom setting variable
function setCustomSetting(value) {
    chrome.storage.local.set({'customSetting': value});
}

// Apply custom setting variable in popup.js
function updateCustomSetting() {
    
        // Enable custom settings
        if(customSettingButton.checked == true) {
            setCustomSetting('true');
        } else {
            setCustomSetting('false');
        }

        // Redetect settings
        init();
}

function updateIgnoredDomains() {
    const domains = ignoredDomainsTextArea.value.split('\n');
    for (let i = 0; i < domains.length; i++) {
        domains[i] = domains[i].trim();
    }

    chrome.storage.local.set({'ignoredDomains': domains})
}

// DISABLE EXTENSION

async function getDisableExtension() {
    let result = await getSetting('disableExtension');

    return result.disableExtension;
}

function setDisableExtension(value) {
    chrome.storage.local.set({'disableExtension':value});
}

function updateDisableExtension(previousValue) {

    if(statusText.innerHTML == 'Enabled') {
        setDisableExtension('false');
        
        // Previous value - do refresh
        if (previousValue == 'true') {
            refreshTab('A tab refresh is required to enable the extension. Do you want to refresh all tabs? Press "Cancel" to just refresh current tab.')
        }
    } else {
        setDisableExtension('true');

        if(previousValue == 'false') {
            refreshTab('A tab refresh is required to disable the extension. Do you want to refresh all tabs? Press "Cancel" to just refresh current tab.')
        }
    }
}

// *** LISTENERS ***

// Custom setting button
customSettingButton.addEventListener('change', updateCustomSetting);

// Smooth Scroll button
smoothScrollButton.addEventListener('change', updateSmoothScroll);

// Modified ignored domains list
ignoredDomainsTextArea.addEventListener('keyup', updateIgnoredDomains);

// Scroll factor input field
scrollFactorInput.addEventListener('change', () => {
    setScrollFactor(scrollFactorInput.value);
});

scrollFactorInput.addEventListener('keyup', () => {
    setScrollFactor(scrollFactorInput.value);
});