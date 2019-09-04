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
const _docsisVersion = document.querySelectorAll("span[title='Docsis Version']")[0].innerText.trim();
const docsisVersion = docsisDict[_docsisVersion];
const modemModel = document.querySelectorAll("span[title='Model']")[0].innerText.trim();
const modemMAC = document.querySelectorAll("div[data-toggle='modemToggle']")[0].innerText.slice(0,17);
const modemLAN = document.querySelectorAll("a[title='click to Ping']")[0].innerText.trim();
const modemUptime = document.querySelectorAll("label[for='muptime']")[0].parentNode.innerText.trim().split("\n")[0];
const _collectionStatus = document.querySelectorAll("label[for='status']")[1].parentNode.innerText.split("(")[0];
const collectionStatus = collectionDict[_collectionStatus];
const _registrationStatus = document.querySelectorAll("div[data-toggle='onlineToggle']")[0].innerText.split("\n")[0].trim();
const registrationStatus = registrationDict[_registrationStatus];
const eMTACapable = document.querySelectorAll("label[for='status']")[3].parentNode.innerText ? isMTA() : "No";
const eMTAStatus = (eMTACapable === "Yes") ? eMTADict[document.querySelectorAll("label[for='status']")[3].parentNode.innerText.split("\n")[0].trim()] : "N/A"
const flapRaw = document.querySelectorAll("div[data-toggle='flapToggle']")[0].innerText.split("\n")[0].trim();
const flapNum = flapRaw.split(" ")[0];
const batteryStatus = (eMTACapable === "Yes") ? batteryDict[document.querySelectorAll("label[for='battery']")[0].parentNode.innerText.split("\n")[0].trim()] : "N/A";
const usPower = document.querySelectorAll("div[data-popupid='upPowerThreshold']")[0].getElementsByTagName("span")[0].innerText.trim();
const usSNR = document.querySelectorAll("div[data-popupid='upSnrThreshold']")[0].getElementsByTagName("span")[0].innerText.trim();
const usCorrected = document.querySelectorAll("div[title='Codewords per second during last poll interval.'")[0].getElementsByTagName("span")[0].innerText.trim();
const usErrored = document.querySelectorAll("div[title='Codewords per second during last poll interval.'")[0].getElementsByTagName("span")[1].innerText.trim();
const usOctets = document.querySelectorAll("div[title='Codewords per second during last poll interval.'")[0].innerText.split("/")[2].split("\n")[0].trim();
const usBWInUse = document.querySelectorAll("label[for='tx']")[0].parentNode.innerText.split("\n")[0].trim();
const usBWAllowed = document.querySelectorAll("label");

/*
const usBWInUse;
const usBWAllowed;
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
    "flapsfull": flapRaw,
    "flapsnum": flapNum,
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
    if (document.querySelectorAll("label[for='status']")[3].innerText == "MTA Status") {
        return("Yes");
    }
    else {
        return("No");
    }
}