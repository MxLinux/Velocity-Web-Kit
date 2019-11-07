chrome.runtime.onInstalled.addListener(function(activeTab) {
    if (activeTab.reason == "install") {
        chrome.tabs.create({ 'url': chrome.extension.getURL('static/html/welcome.html') }, function(tab) {
            console.log("Extension installed with (most) features enabled. Thanks for installing!");
        })
    }
    chrome.storage.sync.get("iGlassEnabled", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
            console.log("Oops");
        }
        else {
            chrome.storage.sync.set({ "iGlassEnabled": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("iGlassThemeEnabled", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "iGlassThemeEnabled": "No" }, function() {});
        }
    });
    chrome.storage.sync.get("iGlassSignalFormat", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "iGlassSignalFormat": "TX: %tx, UpSNR: %usnr, RX: %rx, DownSNR: %dsnr, Micro: %micro" }, function() {});
        }
    });
    chrome.storage.sync.get("iGlassSignalCopyShortcut", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "iGlassSignalCopyShortcut": ["Alt", "C"] }, function() {});
        }
    });
    chrome.storage.sync.get("iGlassCopyToggle", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "iGlassCopyToggle": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("GatewayEnabled", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "GatewayEnabled": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("AutoLogin", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "AutoLogin": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("SummaryEnabled", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "SummaryEnabled": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("CustInfoCopyEnabled", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "CustInfoCopyEnabled": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("CustInfoCopyFormat", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "CustInfoCopyFormat": "%fullname %nl %accnumber %nl %fulladdress" }, function() {});
        }
    });
    chrome.storage.sync.get("CustInfoCopyShortcut", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "CustInfoCopyShortcut": ["Alt", "C"] }, function() {});
        }
    });
    chrome.storage.sync.get("TicketEnabled", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "TicketEnabled": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("AddiGlassButton", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "AddiGlassButton": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("AddSummaryButton", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "AddSummaryButton": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("AddRPXButton", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "AddRPXButton": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("AddOMSButton", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "AddOMSButton": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("VTTEnabled", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "VTTEnabled": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("SortByCallbackEnabled", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "SortByCallbackEnabled": "Yes" }, function() {});
        }
    });
    chrome.storage.sync.get("SortByCallbackShortcut", function(response) {
        if (response !== undefined) {
            // Don't do anything, we're already configured
        }
        else {
            chrome.storage.sync.set({ "SortByCallbackShortcut": ["Alt", "C"] }, function() {});
        }
    });
});