const inputScrollFactor = document.getElementById('scrollFactor');
const osText = document.getElementById('osDetected');
const customToggle = document.getElementById('customToggle');
const smoothToggle = document.getElementById('smoothToggle');

// Default scroll speed variables
const linuxSpeed = 1.9;
const windowsSpeed = 1.0;
const macSpeed = 1.0;

// Get local storage and set checkbox
chrome.storage.local.get('smoothToggle', function(items){
    if(items.smoothToggle == 'false') {
        smoothToggle.checked = false;
    } else {
        smoothToggle.checked = true;
    }
});

// Check if custom settings are enabled
chrome.storage.local.get('customToggle', function(items){
    if(items.customToggle == 'true') {
        customToggle.checked = true;
        inputScrollFactor.disabled = false;

        osText.innerHTML = 'Custom';
    } else {
        // Start OS detection
        detectOS();
        customToggle.checked = false;
        inputScrollFactor.disabled = true;
    }
});

// Detects OS and set scroll speed
function detectOS() {
    chrome.runtime.getPlatformInfo(function (info) {
    
        // Do not initiate if custom speed is checked
        if(customToggle.checked == false) {
            
            if(info.os == 'linux') {
                osText.innerHTML = 'Linux';
                chrome.storage.sync.set({'scrollFactor': linuxSpeed});
                inputScrollFactor.value = linuxSpeed;

                chrome.storage.local.set({'smoothToggle':'true'})
                smoothToggle.checked = true;
                smoothToggle.disabled = true;
            }
            if(info.os == 'win') {
                osText.innerHTML = 'Windows';
                chrome.storage.sync.set({'scrollFactor': windowsSpeed});
                inputScrollFactor.value = windowsSpeed

                chrome.storage.local.set({'smoothToggle':'false'})
                smoothToggle.checked = false;
                smoothToggle.disabled = true;
            }
            if(info.os == 'mac') {
                osText.innerHTML = 'Apple';
                chrome.storage.sync.set({'scrollFactor': macSpeed});
                inputScrollFactor.value = macSpeed
            }
        }
    });
}

// Listen on smooth toggle checkbox
smoothToggle.addEventListener('change', function() {

    // Store toggle settings locally
    if(smoothToggle.checked == true) {
        chrome.storage.local.set({'smoothToggle':'true'});
    } else {
        chrome.storage.local.set({'smoothToggle':'false'});
    }
});

// Listen on custom check toggle
customToggle.addEventListener('change', function() {

    if(customToggle.checked == true) {

        // Store toggle settings
        chrome.storage.local.set({'customToggle':'true'}, function(){
            customToggle.checked = true;
            inputScrollFactor.disabled = false;
            smoothToggle.disabled = false;

            osText.innerHTML = 'Custom';
        });
    } else {
        
        // Store toggle settings
        chrome.storage.local.set({'customToggle':'false'}, function(){
            customToggle.checked = false;
            inputScrollFactor.disabled = true;

            // Redetect OS for instant response
            detectOS();
        });
    }
});

function saveLocal(value) {
    chrome.storage.local.set({isToggled:value}, function() {

        console.log('Value is set to ' + value);
      });
}

chrome.storage.sync.get(function (items) {
    if (items['scrollFactor'] !== undefined) {
        inputScrollFactor.value = items['scrollFactor'];
    }
})

function updateScrollFactor() {
    const factor = parseFloat(inputScrollFactor.value);

    if (factor < 0 || factor > 1000) {
        return;
    }

    chrome.storage.sync.set({'scrollFactor': factor});

    chrome.tabs.query({ active: true, windowId: chrome.windows.WINDOW_ID_CURRENT }, function(tabs) {
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, {scrollFactor: factor, CSS: 'ChangeScrollSpeed'});
    });
}

inputScrollFactor.addEventListener('change', updateScrollFactor);
inputScrollFactor.addEventListener('keyup', updateScrollFactor);