// Helper object to convert weird iGlass DOCSIS designation to a usable version number
const docsisDict = {
    "docsis31": "3.1",
    "docsis30": "3.0",
    "docsis20": "2.0",
    "docsis11": "1.1",
    "docsis10": "1.0"
}

// Helper object to convert weird iGlass collection status designation to a usable collection status
const collectionDict = {
    "onlineTekAssigned": "Connected"
}

// Helper object to convert weird iGlass registration status designation to a usable registration status
const registrationDict = {
    "registrationComplete": "Online",
    "offline": "Rebooting",
    "unknown": "Cannot determine registration status"
}

// Variable names explain themselves. 
const _docsisVersion = document.querySelectorAll("span[title='Docsis Version']")[0].innerText.trim();
const docsisVersion = docsisDict[_docsisVersion];
const modemModel = document.querySelectorAll("span[title='Model']")[0].innerText.trim();
const modemMAC = document.querySelectorAll("div[data-toggle='modemToggle']")[0].innerText.slice(0,17);
const modemLAN = document.querySelectorAll("a[title='click to Ping']")[0].innerText.trim();
const modemUptime = document.querySelectorAll("label[for='muptime']")[0].parentNode.innerHTML.trim().split("    ")[0];
const _collectionStatus = document.querySelectorAll("label[for='status']")[1].parentNode.innerText.split("(")[0];
const collectionStatus = collectionDict[_collectionStatus];
const _registrationStatus = document.querySelectorAll("div[data-toggle='onlineToggle']")[0].innerText.split("\n")[0].trim();
const registrationStatus = registrationDict[_registrationStatus];
const eMTACapable = document.querySelectorAll("label[for='status']")[3].parentNode.innerText ? isMTA() : "No";

function isMTA() {
    if (document.querySelectorAll("label[for='status']")[3].innerText == "MTA Status") {
        return("Yes");
    }
    else {
        return("No");
    }
}

// Create an object. We'll use this later to redisplay data in a more meaningful manner.
const modemObj = {
    "model": modemModel,
    "docsis": docsisVersion,
    "macaddr": modemMAC,
    "lanip": modemLAN,
    "uptime": modemUptime,
    "collection": collectionStatus,
    "registration": registrationStatus,
    "emta": eMTACapable
};

// DEBUG: Remove me
console.log(modemObj);