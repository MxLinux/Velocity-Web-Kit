chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {schemes: ["https","http"]},
    })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

// UPSTREAM
// var up = document.getElementsByClassName("ui-widget")[13]
// var tx = up.getElementsByTagName("span")[1].innerText;
// var usnr = up.getElementsByTagName("span")[3].innerText;
// DOWNSTREAM
// var down = document.getElementsByClassName("ui-widget")[18];
// var rx = down.getElementsByTagName("span")[1].innerText;
// var dsnr = down.getElementsByTagName("span")[3].innerText;