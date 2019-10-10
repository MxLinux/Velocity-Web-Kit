chrome.runtime.onInstalled.addListener(function(activeTab) {
    if (activeTab.reason == "install") {
        chrome.tabs.create({'url': chrome.extension.getURL('static/html/welcome.html')}, function(tab) {
        })
    }
});