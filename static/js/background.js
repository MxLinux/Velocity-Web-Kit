chrome.runtime.onInstalled.addListener(function(activeTab) {
    if (activeTab.reason == "install") {
        chrome.tabs.create({'url': chrome.extension.getURL('static/html/welcome.html')}, function(tab) {
            console.log("Extension installed with all features enabled. Thanks for installing!");
        })
    }
    chrome.storage.sync.set({"iGlassEnabled": "Yes"}, function() {
    })
    chrome.storage.sync.set({"iGlassThemeEnabled": "No"}, function() {
    })
    chrome.storage.sync.set({"iGlassSignalFormat": "TX: %tx, UpSNR: %usnr, RX: %rx, DownSNR: %dsnr, Micro: %micro"}, function() {
    })
    chrome.storage.sync.set({"VTTEnabled": "Yes"}, function() {
    })
    chrome.storage.sync.set({"TicketEnabled": "Yes"}, function() {
    })
    chrome.storage.sync.set({"SummaryEnabled": "Yes"}, function() {
    })
    chrome.storage.sync.set({"GatewayEnabled": "Yes"}, function() {
    })
});

