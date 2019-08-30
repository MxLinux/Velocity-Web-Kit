chrome.runtime.onInstalled.addListener(function(activeTab) {
    chrome.tabs.create({'url': chrome.extension.getURL('static/html/install.html')}, function(tab) {
    })
});