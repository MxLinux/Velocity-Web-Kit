chrome.runtime.onInstalled.addListener(function() {
    // We should do some initial configuration stuff here
});

chrome.commands.onCommand.addListener(function(command) {
    if (command === "copypotd") {
        
    }
  });
