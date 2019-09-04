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
    "onlineTekAssigned": "Service Permitted",
    "onlineNetAccessDisabled": "Collection Disconnect",
    "offline(1)": "Rebooting"
}

// Helper object to convert weird iGlass registration status designation to a usable registration status
const registrationDict = {
    "registrationComplete": "Online",
    "other": "Rebooting",
    "unknown": "Cannot determine registration status"
}

const eMTADict = {
    "telephony-RegComplete": "Registration Complete",
    "telephony-DHCP": "Obtaining eMTA IP Address",
    "unknown": "Unknown"
}

const batteryDict = {
    "normal": "Healthy",
    "depleted": "Dead or Removed",
    "unknown": "Unknown"
}

// Variable names explain themselves. 
const _docsisVersion = document.querySelectorAll("span[title='Docsis Version']")[0].textContent.trim();
const docsisVersion = docsisDict[_docsisVersion];
const modemModel = document.querySelectorAll("span[title='Model']")[0].textContent.trim();
const modemMAC = document.querySelectorAll("div[data-toggle='modemToggle']")[0].textContent.trim().slice(0,17);
const modemLAN = document.querySelectorAll("a[title='click to Ping']")[0].textContent.trim();
const modemUptime = document.querySelectorAll("label[for='muptime']")[0].parentNode.textContent.trim().split("\n")[0].split("Uptime")[0].trim();
const _collectionStatus = document.querySelectorAll("label[for='status']")[1].parentNode.textContent.trim().split("(")[0];
const collectionStatus = collectionDict[_collectionStatus];
const _registrationStatus = document.querySelectorAll("div[data-toggle='onlineToggle']")[0].textContent.trim().split("\n")[0].trim();
const registrationStatus = registrationDict[_registrationStatus];
const eMTACapable = document.querySelectorAll("label[for='status']")[3].parentNode.textContent ? isMTA() : "No";
const eMTAStatus = (eMTACapable === "Yes") ? eMTADict[document.querySelectorAll("label[for='status']")[3].parentNode.textContent.trim().split("\n")[0].split("MTA")[0].trim()] : "N/A"
const flapLast = document.querySelectorAll("div[data-toggle='flapToggle']")[0].textContent.trim().split("\n")[1].trim().split("(")[1].split(" ")[0];
const flapTotal = document.querySelectorAll("div[data-toggle='flapToggle']")[0].textContent.trim().split("\n")[0].trim();
const batteryStatus = (eMTACapable === "Yes") ? batteryDict[document.querySelectorAll("label[for='battery']")[0].parentNode.textContent.trim().split("\n")[0].trim()] : "N/A";
const usPower = document.querySelectorAll("div[data-popupid='upPowerThreshold']")[0].getElementsByTagName("span")[0].textContent.trim();
const usSNR = document.querySelectorAll("div[data-popupid='upSnrThreshold']")[0].getElementsByTagName("span")[0].textContent.trim();
const usCorrected = document.querySelectorAll("div[title='Codewords per second during last poll interval.'")[0].getElementsByTagName("span")[0].textContent.trim();
const usErrored = document.querySelectorAll("div[title='Codewords per second during last poll interval.'")[0].getElementsByTagName("span")[1].textContent.trim();
const usOctets = document.querySelectorAll("div[title='Codewords per second during last poll interval.'")[0].textContent.split("/")[2].trim().split(" ")[0];
const usBWInUse = document.querySelectorAll("label[for='tx']")[0].parentNode.textContent.trim().split("\n")[0];
const usBWAllowed = getElementsByText("Max Bandwidth (Mb/s)")[0].parentNode.textContent.trim().split("\n")[0].split(" ")[0];

// Need to account for flaps showing as "Not on list"; This impacts flapLast and flapTotal. flapLast will have to be "N/A" if flapTotal is set to 0
// Make more dicts for that lol

/*
const dsPower;
const dsSNR;
const dsCorrected;
const dsErrored;
const dsOctets;
const dsBWInUse;
const dsBWAllowed;
const histGraphObj = {}; // graphName:httpLink
const ifEth = {}; // Some modems have more than one Ethernet interface
const ifRF = {};
const ifUSB = {};
const ifMTA = {};
const customerEquipment = {};
const eMTAInfo = {};
const billingInfo = {};
*/

// Create an object. We'll use this later to redisplay data in a more meaningful manner.
const modemObj = {
    "model": modemModel,
    "docsis": docsisVersion,
    "macaddr": modemMAC,
    "lanip": modemLAN,
    "uptime": modemUptime,
    "collection": collectionStatus,
    "registration": registrationStatus,
    "emta": eMTACapable,
    "emtastatus": eMTAStatus,
    "flaps": flapLast,
    "flapstotal": flapTotal,
    "battery": batteryStatus,
    "uspower": usPower,
    "ussnr" : usSNR,
    "uscorrected": usCorrected,
    "userrored": usErrored,
    "usoctets": usOctets,
    "usbandwidth": usBWInUse,
    "usbandwidthallowed": usBWAllowed
};

// DEBUG: Remove me
console.log(modemObj);

// Functions
function isMTA() {
    if (document.querySelectorAll("label[for='status']")[3].textContent == "MTA Status") {
        return("Yes");
    }
    else {
        return("No");
    }
}

function getElementsByText(str, tag = "label") {
    if(typeof(str) !== undefined) {
        return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim());
    }
}