chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {schemes: ["https","http"]},
    })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

chrome.commands.onCommand.addListener(function(command) {
    if (command === "copypotd") {
        // Filler code to copy to clipboard
        var potd = "foo";
        var potdNode = document.createElement("input");
        document.body.appendChild(potdNode);
        potdNode.setAttribute("id", "potd_id");
        document.getElementById("potd_id").value=potd;
        potdNode.select();
        document.execCommand("copy");
        document.body.removeChild(potdNode);
    }
  });