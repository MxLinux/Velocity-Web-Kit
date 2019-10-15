chrome.tabs.getSelected(null, function(tab) {
    tabID = tab.id;
    document.getElementById("content").textContent = "Current tab: " + tabID;
})

// maybe send a message to tab requesting any script features, display their respective toggles and settings