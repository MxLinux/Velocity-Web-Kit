chrome.runtime.onInstalled.addListener(function(activeTab) {
    if (activeTab.reason == "install") {
        chrome.tabs.create({ 'url': chrome.extension.getURL('static/html/welcome.html') }, function(tab) {
            console.log("Extension installed with (most) features enabled. Thanks for installing!");
        })
    }
    chrome.storage.sync.set({ "iGlassEnabled": "Yes" }, function() {});
    chrome.storage.sync.set({ "iGlassThemeEnabled": "Yes" }, function() {});
    chrome.storage.sync.set({ "iGlassSignalFormat": "TX: %tx, UpSNR: %usnr, RX: %rx, DownSNR: %dsnr, Micro: %micro" }, function() {});
    chrome.storage.sync.set({ "iGlassSignalCopyShortcut": ["Alt", "C"] }, function() {});
    chrome.storage.sync.set({ "iGlassCopyToggle": "Yes" }, function() {});
    chrome.storage.sync.set({ "GatewayEnabled": "Yes" }, function() {});
    chrome.storage.sync.set({ "AutoLogin": "Yes" }, function() {});
    chrome.storage.sync.set({ "SummaryEnabled": "Yes" }, function() {});
    chrome.storage.sync.set({ "CustInfoCopyEnabled": "Yes" }, function() {});
    chrome.storage.sync.set({ "CustInfoCopyFormat": "%fullname %nl %accnumber %nl %fulladdress" }, function() {});
    chrome.storage.sync.set({ "CustInfoCopyShortcut": ["Alt", "C"] }, function() {});
    chrome.storage.sync.set({ "TicketEnabled": "Yes" }, function() {});
    chrome.storage.sync.set({ "AddiGlassButton": "Yes" }, function() {});
    chrome.storage.sync.set({ "AddSummaryButton": "Yes" }, function() {});
    chrome.storage.sync.set({ "AddRPXButton": "Yes" }, function() {});
    chrome.storage.sync.set({ "AddOMSButton": "Yes" }, function() {});
    chrome.storage.sync.set({ "VTTEnabled": "Yes" }, function() {});
    chrome.storage.sync.set({ "SortByCallbackEnabled": "Yes" }, function() {});
    chrome.storage.sync.set({ "SortByCallbackShortcut": ["Alt", "C"] }, function() {});
});