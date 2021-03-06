function setVTTView() {
    
}

function setCustSummaryView() {

}

function setiGlassView() {

}

function setGatewayView() {

}

function setNewGatewayView() {
    
}

// Regex matching for various URLs
const VTTRegex = /http:\/\/eusvr41\/internettechsupport\/Overview\.aspx*/g;
const CustSummRegex = /http:\/\/eusvr70\/customersummary\/CustomerPage\.aspx\?/g;
const iGlassRegex = /https:\/\/noc\.iglass\.net\/jglass\/igo\/devInfo.htm*/g;
// Web applications matching older ARRIS models 1670/2470/2472/etc.
const GatewayRegex = /https?:\/\/10.*:8080\/*/g;
// Web applications matching newer ARRIS models - 3450 is the only we currently use
const NewGatewayRegex = /https?:\/\/10\.*\/login\.php/g;


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentTab = tabs[0];
    var tabURL = currentTab.url;
    if (tabURL.match(iGlassRegex)) {
        document.querySelector("#title").innerText = "iGlass Settings";
    }
    else if (tabURL.match(VTTRegex)) {
        document.querySelector("#title").innerText = "VTT Settings";
    }
    else if (tabURL.match(CustSummRegex)) {
        document.querySelector("#title").innerText = "Customer Summary Settings";
    }
    else if (tabURL.match(GatewayRegex) || tabURL.match(NewGatewayRegex)) {
        document.querySelector("#title").innerText = "Gateway Settings";
    }
    else {
        // Nothing else we're interested in
    }
})