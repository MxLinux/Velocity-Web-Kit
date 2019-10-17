const query = { active: true, currentWindow: true };

function callback(tabs) {
    var currentTab = tabs[0];
    console.log("tab is " +currentTab.url);
    return(currentTab);
}

var tabQuery = chrome.tabs.query(query, callback);
console.log("tab query: " + JSON.stringify(tabQuery));
var tabURL = tabQuery.url;
var tabID = tabQuery.id;

/*function setVTTView() {
    location.href="asdlfaskldjfa";
}

function setTicketView() {
    console.log("Stuff");
}

const iGlassRegex = /(?<=https\:\/\/)(.*?)(?=\?)/g;


if (tabURL === "http://eusvr41/internettechsupport/Overview.aspx") {
    window.location.reload();
}
else if (tabURL.match(iGlassRegex) === "noc.iglass.net/jglass/igo/devInfo.htm") {
    console.log("Yay!");
}
console.log("oof" +tabURL);
console.log("uuf" +iGlassRegex);

// maybe send a message to tab requesting any script features, display their respective toggles and settings
*/