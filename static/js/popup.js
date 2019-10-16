chrome.tabs.getSelected(null, function(tab) {
    tabID = tab.id;
    document.getElementById("content").textContent = "Current tab: " + tabID;
})

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
});

// maybe send a message to tab requesting any script features, display their respective toggles and settings
// popup possibly tabbed by "this page", "settings", and feature toggle