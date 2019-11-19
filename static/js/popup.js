function setVTTView() {
    location.href = "asdlfaskldjfa";
}

function setTicketView() {
    console.log("Stuff");
}

// Regex matching for various URLs
const VTTRegex = /http:\/\/eusvr41\/internettechsupport\/Overview\.aspx*/g;
const TicketRegex = /http:\/\/eusvr41\/internettechsupport\/SearchTicket\.aspx\?TicketID=*/g;
const CustSummRegex = /http:\/\/eusvr70\/customersummary\/CustomerPage\.aspx\?/g;
const iGlassRegex = /https:\/\/noc\.iglass\.net\/jglass\/igo\/devInfo.htm*/g;
// Web applications matching older ARRIS models 1670/2470/2472/etc.
const GatewayRegex = /https?:\/\/10.*:8080\/*/g;
// Web applications matching newer ARRIS models - 3450 is the only we currently use
const NewGatewayRegex = /https?:\/\/10\.*\/login\.php/g;


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentTab = tabs[0];
    var tabURL = currentTab.url;
    console.log(tabURL);
    if(tabURL.match(iGlassRegex)) {
        console.log("YEP!!!");
        document.querySelector("#title").innerText = "iGlass Settings";
    }
    else {
        console.log("NOPE, BUT KINDA YEP");
    }
})