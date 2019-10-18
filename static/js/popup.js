function setVTTView() {
    location.href="asdlfaskldjfa";
}

function setTicketView() {
    console.log("Stuff");
}

const iGlassRegex = /(?<=https\:\/\/)(.*?)(?=\?)/g;

document.addEventListener("DOMContentLoaded", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Note: this requires "activeTab" permission to access the URL
        if(tabs[0].url.match(iGlassRegex) == "noc.iglass.net/jglass/igo/devInfo.htm") {
            console.log("Things and stuff idk?");
            document.querySelector("#content").innerHTML("Hay");
        } 
        else if (tabs[0].url === "Placeholder") {
            console.log("Placeholder");
        }
    });
});