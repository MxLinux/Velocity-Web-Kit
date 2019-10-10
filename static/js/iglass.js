const docsisDict = {
    "docsis31": "3.1",
    "docsis30": "3.0",
    "docsis20": "2.0",
    "docsis11": "1.1",
    "docsis10": "1.0"
}

const collectionDict = {
    "onlineTekAssigned": "Online, service permitted",
    "onlineKekAssigned": "Almost online, awaiting Traffic Encryption Key",
    "onlineNetAccessDisabled": "Online, collection disconnect",
    "offline(1)": "Rebooting"
}

const registrationDict = {
    "registrationComplete": "Online",
    "other": "Rebooting",
    "unknown": "Cannot determine registration status"
}

const eMTADict = {
    "telephony-RegComplete": "Registration Complete",
    "telephony-RegWithCallServer": "Registering with call server",
    "telephony-DHCP": "Obtaining eMTA IP address",
    "telephony-TFTP": "Downloading eMTA configuration",
    "unknown": "Cannot determine telephony status"
}

const batteryDict = {
    "normal": "Healthy",
    "depleted": "Dead or removed",
    "unknown": "Cannot determine battery health"
}

const mocaDict = {
    "disabled": "Disabled",
    "linkUp": "Device(s) connected"
}

const frequencyDict = {
    "n2dot4Ghz": "2.4 GHz",
    "n5Ghz": "5 GHz"
}

const modelDict = {
    "DG3450A": "3450",
    "TG2472GP2": "2472",
    "DG2470A": "2470",
    "CM8200A": "8200",
    "SB6190": "6190",
    "SB6183": "6183",
    "TM804G": "804",
    "CM820A": "820"
};

const _docsisVersion = document.querySelectorAll("span[title='Docsis Version']")[0].textContent.trim();
const docsisVersion = docsisDict[_docsisVersion];
const modemModel = document.querySelectorAll("span[title='Model']")[0].textContent.trim();
const modemMAC = document.querySelectorAll("div[data-toggle='modemToggle']")[0].textContent.trim().slice(0,17);
const modemLAN = document.querySelectorAll("a[title='click to Ping']")[0].textContent.trim();
const modemUptime = document.querySelectorAll("label[for='muptime']")[0].parentElement.textContent.trim().split("\n")[0].split("Uptime")[0].trim();
const _collectionStatus = document.querySelectorAll("label[for='status']")[1].parentElement.textContent.trim().split("(")[0];
const collectionStatus = collectionDict[_collectionStatus];
const _registrationStatus = document.querySelectorAll("div[data-toggle='onlineToggle']")[0].textContent.trim().split("\n")[0].trim();
const registrationStatus = registrationDict[_registrationStatus];

function isMTA() {
    if (document.querySelectorAll("label[for='status']")[3].textContent == "MTA Status") {
        return("Yes");
    }
    else {
        return("No");
    }
}

try {
    const eMTACapable = document.querySelectorAll("label[for='status']")[3].parentElement.textContent ? isMTA() : "No";
    const eMTAStatus = (eMTACapable === "Yes") ? eMTADict[document.querySelectorAll("label[for='status']")[3].parentElement.textContent.trim().split("\n")[0].split("MTA")[0].trim()] : "N/A"
}
catch (err) {
    const eMTACapable = "No";
}
const flapTotal = (document.querySelectorAll("div[data-toggle='flapToggle']")[0].textContent.trim().split("\n")[0].trim() === "Not on list") ? 0 : document.querySelectorAll("div[data-toggle='flapToggle']")[0].textContent.trim().split("\n")[0].trim();
const flapLast = (flapTotal instanceof String) ? document.querySelectorAll("div[data-toggle='flapToggle']")[0].textContent.trim().split("\n")[1].trim().split("(")[1].split(" ")[0] : "0";
const batteryStatus = (eMTACapable === "Yes") ? batteryDict[document.querySelectorAll("label[for='battery']")[0].parentElement.textContent.trim().split("\n")[0].trim()] : "N/A";

// Upstream
const upstreamDiv = document.querySelectorAll("#upstreamWidget")[0];
const upstreamChannels = document.querySelectorAll("#upstreamWidget fieldset");
const usBWInUse = upstreamDiv.querySelectorAll(".display-elem")[3].textContent.trim().split("\n")[0];
const usBWAllowed = upstreamDiv.querySelectorAll(".display-elem")[4].textContent.trim().split(" ")[0];
const upstreamObject = {
    "usbandwidth": usBWInUse,
    "usbandwidthallowed": usBWAllowed,
};

function getCMTSReceivePower(upstreamChannel) {
    const cmtsReceivePower = upstreamChannel.querySelectorAll(".display-elem")[0].textContent.trim().split(" ")[0];
    return(cmtsReceivePower);
}

function getTransmitChannelPower(upstreamChannel) {
    const transmitChannelPower = upstreamChannel.querySelectorAll(".display-elem")[1].textContent.trim().split(" ")[0];
    return(transmitChannelPower);
}

function getTransmitChannelSNR(upstreamChannel) {
    const transmitChannelSNR = upstreamChannel.querySelectorAll(".display-elem")[2].textContent.trim().split(" ")[0];
    return(transmitChannelSNR);
}

function getTransmitChannelFrequency(upstreamChannel) {
    const transmitChannelFrequency = upstreamChannel.querySelectorAll(".display-elem")[7].textContent.trim().split(" ")[0];
    return(transmitChannelFrequency);
}

function getTransmitChannelWidth(upstreamChannel) {
    const transmitChannelWidth = upstreamChannel.querySelectorAll(".display-elem")[8].textContent.trim().split(" ")[0];
    return(transmitChannelWidth);
}

function getTransmitChannelMicro(upstreamChannel) {
    const transmitChannelMicro = upstreamChannel.querySelectorAll(".display-elem")[10].textContent.trim().split(" ")[0];
    return(transmitChannelMicro);
}

function getTransmitCorrected(upstreamChannel) {
    const _transmitCorrected = upstreamChannel.querySelectorAll(".display-elem")[3];
    const transmitCorrected = _transmitCorrected.querySelectorAll("span")[0].textContent.trim().split(" ")[0];
    return(transmitCorrected);
}

function getTransmitErrored(upstreamChannel) {
    const _transmitErrored = upstreamChannel.querySelectorAll(".display-elem")[3];
    const transmitErrored = _transmitErrored.querySelectorAll("span")[1].textContent.trim().split(" ")[0];
    return(transmitErrored);
}

function getTransmitCodewords(upstreamChannel) {
    const _transmitCodewords = upstreamChannel.querySelectorAll(".display-elem")[3];
    const transmitCodewords = _transmitCodewords.textContent.split("/")[2].trim().split(" ")[0];
    return(transmitCodewords);
}

// Downstream
const downstreamDiv = document.querySelectorAll("#downstreamWidget")[0];
const downstreamChannels = document.querySelectorAll("#downstreamWidget fieldset");
const dsBWInUse = downstreamDiv.querySelectorAll(".display-elem")[4].textContent.trim().split("\n")[0];
const dsBWAllowed = downstreamDiv.querySelectorAll(".display-elem")[5].textContent.trim().split(" ")[0];
const downstreamObject = {
    "dsbandwidth": dsBWInUse,
    "dsbandwidthallowed": dsBWAllowed
};

function getReceiveChannelPower(downstreamChannel) {
    const receiveChannelPower = downstreamChannel.querySelectorAll(".display-elem")[0].textContent.trim().split(" ")[0];
    return(receiveChannelPower);
}

function getReceiveChannelSNR(downstreamChannel) {
    const receiveChannelSNR = downstreamChannel.querySelectorAll(".display-elem")[1].textContent.trim().split(" ")[0];
    return(receiveChannelSNR);
}

function getReceiveChannelFrequency(downstreamChannel) {
    const receiveChannelFrequency = downstreamChannel.querySelectorAll(".display-elem")[5].textContent.trim().split(" ")[0];
    return(receiveChannelFrequency);
}

function getReceiveChannelWidth(downstreamChannel) {
    const receiveChannelWidth = downstreamChannel.querySelectorAll(".display-elem")[6].textContent.trim().split(" ")[0];
    return(receiveChannelWidth);
}

function getReceiveChannelMicro(downstreamChannel) {
    const receiveChannelMicro = downstreamChannel.querySelectorAll(".display-elem")[3].textContent.trim().split(" ")[0];
    return(receiveChannelMicro);
}

function getReceiveCorrected(downstreamChannel) {
    const _transmitCorrected = downstreamChannel.querySelectorAll(".display-elem")[4];
    const receiveCorrected = _transmitCorrected.querySelectorAll("span")[0].textContent.trim().split(" ")[0];
    return(receiveCorrected);
}

function getReceiveErrored(downstreamChannel) {
    const _receiveErrored = downstreamChannel.querySelectorAll(".display-elem")[4];
    const receiveErrored = _receiveErrored.querySelectorAll("span")[1].textContent.trim().split(" ")[0];
    return(receiveErrored);
}

function getReceiveCodewords(downstreamChannel) {
    const _receiveCodewords = downstreamChannel.querySelectorAll(".display-elem")[4];
    const receiveCodewords = _receiveCodewords.textContent.split("/")[2].trim().split(" ")[0];
    return(receiveCodewords);
}

function getChannelStats(upstreamNodeList, downstreamNodeList) {
    for (i = 0; i < upstreamNodeList.length; i++){
        if(i != 0) {
            const channelIndex = "upstream" + i; // Channel 0 isn't really a thing, so...
            const currentChannel = upstreamNodeList[i];
            upstreamObject[channelIndex] = {};
            upstreamObject[channelIndex]["transmitfrequency"] = getTransmitChannelFrequency(currentChannel);
            upstreamObject[channelIndex]["transmitwidth"] = getTransmitChannelWidth(currentChannel)
            upstreamObject[channelIndex]["cmtsreceivepower"] = getCMTSReceivePower(currentChannel);
            upstreamObject[channelIndex]["transmitchannelpower"] = getTransmitChannelPower(currentChannel);
            upstreamObject[channelIndex]["transmitchannelsnr"] = getTransmitChannelSNR(currentChannel);
            upstreamObject[channelIndex]["transmitchannelmicro"] = getTransmitChannelMicro(currentChannel);
            upstreamObject[channelIndex]["transmitcorrected"] = getTransmitCorrected(currentChannel);
            upstreamObject[channelIndex]["transmiterrored"] = getTransmitErrored(currentChannel);
            upstreamObject[channelIndex]["transmitcodewords"] = getTransmitCodewords(currentChannel);
        }
    }

    for (i = 0; i < downstreamNodeList.length; i++) {
        if(i != 0) {
            const channelIndex = "downstream" + i; // Channel 0 isn't really a thing, so...
            const currentChannel = downstreamNodeList[i];
            downstreamObject[channelIndex] = {};
            downstreamObject[channelIndex]["receivefrequency"] = getReceiveChannelFrequency(currentChannel);
            downstreamObject[channelIndex]["receivewidth"] = getReceiveChannelWidth(currentChannel)
            downstreamObject[channelIndex]["receivechannelpower"] = getReceiveChannelPower(currentChannel);
            downstreamObject[channelIndex]["receivechannelsnr"] = getReceiveChannelSNR(currentChannel);
            downstreamObject[channelIndex]["receivechannelmicro"] = getReceiveChannelMicro(currentChannel);
            downstreamObject[channelIndex]["receivecorrected"] = getReceiveCorrected(currentChannel);
            downstreamObject[channelIndex]["receiveerrored"] = getReceiveErrored(currentChannel);
            downstreamObject[channelIndex]["receivecodewords"] = getReceiveCodewords(currentChannel);
        }
    }
}

getChannelStats(upstreamChannels, downstreamChannels);

function getInterfaceName(interfaceFieldset) {
    const interfaceName = interfaceFieldset.querySelectorAll("legend")[0].textContent.trim().split(" ")[0];
    return(interfaceName);
}

function getInterfaceMAC(interfaceFieldset) {
    const interfaceMAC = interfaceFieldset.querySelectorAll(".display-elem")[0].textContent.trim().split(" ")[0];
    return(interfaceMAC);
}

function getInterfaceStatus(interfaceFieldset) {
    const interfaceStatus = interfaceFieldset.querySelectorAll(".display-elem")[1].textContent.trim().split("\n")[0];
    return(interfaceStatus);
}

function getInterfaceIP(interfaceFieldset) {
    const interfaceIP = interfaceFieldset.querySelectorAll("div")[5].textContent.trim().split(" ")[0];
    return(interfaceIP);
}

function getInterfaceStats() {
    const interfaceObject = {};
    const _interfaceDiv = document.querySelectorAll("#interfaceToggle")[0];
    const interfaceDiv = _interfaceDiv.nextElementSibling;
    const interfaceFieldset = interfaceDiv.querySelectorAll("fieldset");
    for (i = 0; i < interfaceFieldset.length; i++) {
        const interfaceIndex = "interface" + i;
        interfaceObject[interfaceIndex] = {};
        interfaceObject[interfaceIndex]["interfacename"] = getInterfaceName(interfaceFieldset[i]);
        interfaceObject[interfaceIndex]["interfacemac"] = getInterfaceMAC(interfaceFieldset[i]);
        interfaceObject[interfaceIndex]["interfacestatus"] = getInterfaceStatus(interfaceFieldset[i]);
        if(isMTA() == "Yes") {
            interfaceObject[interfaceIndex]["interfaceip"] = getInterfaceIP(interfaceFieldset[i]);
        }
    }
    return(interfaceObject);
}

function getCustomerName(billingFieldset) {
    const customerName = billingFieldset.querySelectorAll(".display-elem")[2].textContent.trim().split(" Name")[0];
    return(customerName);
}

function getCustomerAddress(billingFieldset) {
    const customerAddress = billingFieldset.querySelectorAll(".display-elem")[1].textContent.trim().split(",")[0];
    return(customerAddress);
}

function getCustomerLocationNumber(billingFieldset) {
    const customerLocationNumber = billingFieldset.querySelectorAll(".display-elem")[0].textContent.trim().split(" ")[0];
    return(customerLocationNumber);
}

function getCustomerNode(billingFieldset) {
    const customerNode = billingFieldset.querySelectorAll(".display-elem")[3].textContent.trim().split(":::")[1].split(" ")[0];
    return(customerNode);
}

function getBillingStats() {
    const billingObject = {};
    const _billingDiv = document.querySelectorAll("#billToggle")[0];
    const billingDiv = _billingDiv.nextElementSibling;
    const billingFieldset = billingDiv.querySelectorAll("fieldset")[0];
    billingObject["customername"] = getCustomerName(billingFieldset);
    billingObject["customerlocation"] = getCustomerLocationNumber(billingFieldset);
    billingObject["customeraddress"] = getCustomerAddress(billingFieldset);
    billingObject["customernode"] = getCustomerNode(billingFieldset);
    return(billingObject);
}

function getCPEInfo() {
    const cpeObject = {};
    const deviceFields = document.querySelectorAll("#cpeToggle")[0].nextElementSibling.querySelectorAll("fieldset");
    const currentDevice = deviceFields[i];
    for (i = 0; i < deviceFields.length; i++) {
        const currentDevice = "cpe" + (i+1);
        cpeObject[currentDevice] = {};
        cpeObject[currentDevice]["ipaddress"] = deviceFields[i].querySelectorAll(".display-elem")[0].textContent.trim().split(" ")[0];
        const cpeMAC = deviceFields[i].querySelectorAll(".display-elem")[1].textContent.trim().split(" ")[0].split("\n")[0];
        const cpeVendor = deviceFields[i].querySelectorAll(".display-elem")[2].textContent.trim().split("  ")[0];
        if (cpeMAC !== "N/A") {
            cpeObject[currentDevice]["macaddress"] = cpeMAC;
            cpeObject[currentDevice]["vendor"] = cpeVendor;
        }
        else {
            // It's not impossible that another device may show "N/A" for MAC/Vendor but definitely unlikely, this should be safe
            // We just want to have the same MAC address for IPv6 of the gateway/router/firewall/whatever as the MAC for IPv4 of first value
            // Which has so far always been the CPE WAN IP
            cpeObject[currentDevice]["macaddress"] = deviceFields[0].querySelectorAll(".display-elem")[1].textContent.trim().split(" ")[0].split("\n")[0];
            cpeObject[currentDevice]["vendor"] = deviceFields[0].querySelectorAll(".display-elem")[2].textContent.trim().split("  ")[0];
        }
    }
    return(cpeObject);
}


function hasMoCA() {
    try {
        const widgetMoCA = document.querySelectorAll("#mocaToggle")[0];
        const ifMoCA = (widgetMoCA !== "undefined") ? "Yes" : "No";
        return(ifMoCA);
    }
    catch(err) {
        return("No")
    }
    
}

function getMocaNodeInfo() {
    try {
        const mocaObject = {};
        const widgetMoCA = document.querySelectorAll("#mocaToggle")[0];
        const mocaFields = widgetMoCA.nextElementSibling.querySelectorAll("fieldset");
        const mocaStatus = mocaDict[mocaFields[0].querySelectorAll(".display-elem")[1].textContent.trim().split(" ")[0]];
        if (mocaStatus === "Disabled") {
            mocaObject["mocastatus"] = mocaStatus;
            return(mocaObject);
        }
        else {
            mocaObject["mocastatus"] = mocaStatus;
            for (i = 1; i < mocaFields.length; i++) {
                const currentField = "node" + i;
                mocaObject[currentField] = {};
                const mocaElements = mocaFields[i].querySelectorAll(".display-elem");
                mocaObject[currentField]["macaddress"] = mocaElements[0].textContent.trim().split(" ")[0];
                mocaObject[currentField]["snr"] = mocaElements[1].textContent.trim().split(" ")[0];
                mocaObject[currentField]["rxpackets"] = mocaElements[2].textContent.trim().split(" ")[0];
                mocaObject[currentField]["rxdrops"] = mocaElements[3].textContent.trim().split(" ")[0];
            }
            if (mocaObject !== "undefined") {
                return(mocaObject);
            }
            else {
                return("N/A");
            }
        }
    }
    catch(err) {
        return("N/A");
    }

}

function isGateway() {
    const wirelessToggle = document.querySelectorAll("#wirelessToggle")[0];
    const ifGateway = (wirelessToggle !== "undefined") ? "Yes" : "No";
    return(ifGateway);
}

function getAPInfo() {
    const ssidLegendObject = {};
    const radioLegendObject = {};
    const clientLegendObject = {}
    const accessPointDiv = document.querySelectorAll("#wirelessToggle")[0].nextElementSibling;
    const accessPointFieldsets = accessPointDiv.querySelectorAll("fieldset");
    for (i=0; i < accessPointFieldsets.length; i++) {
        const accessPointLegend = accessPointFieldsets[i].querySelectorAll("legend")[0];
        if(accessPointLegend.textContent.trim().substring(0,5) == "Radio") {
            const currentRadio = "radio" + accessPointLegend.textContent.trim().split(" ")[1];
            radioLegendObject[currentRadio] = {};
            radioLegendObject[currentRadio]["channel"] = accessPointFieldsets[i].querySelectorAll("div")[0].textContent.trim().split(" ")[0];
            if (modelDict[modemModel] === "3450") {
                radioLegendObject[currentRadio]["power"] = accessPointFieldsets[i].querySelectorAll("div")[4].textContent.trim().split(" ")[0] + "%";
                radioLegendObject[currentRadio]["frequency"] = frequencyDict[accessPointFieldsets[i].querySelectorAll("div")[2].textContent.trim().split(" ")[0]];
            }
            else if(modelDict[modemModel] === "1670" || modelDict[modemModel] === "2470" || modelDict[modemModel] === "2472") {
                radioLegendObject[currentRadio]["power"] = accessPointFieldsets[i].querySelectorAll("div")[3].textContent.trim().split(" ")[0] + "%";
                radioLegendObject[currentRadio]["frequency"] = accessPointFieldsets[i].querySelectorAll("div")[1].textContent.trim().split("\n")[0];
            }
            else {
                radioObject[currentRadio]["unsupported"] = "Unsupported modem model";
            }
        }
        else if(accessPointLegend.textContent.trim().substring(0,4) == "SSID") {
            const currentSSID = "ssid" + accessPointLegend.textContent.trim().split("\n")[0].split("SSID ")[1];
            ssidLegendObject[currentSSID] = {};
            ssidLegendObject[currentSSID]["id"] = accessPointFieldsets[i].querySelectorAll("div")[0].textContent.trim().split("\n")[0].split(" ID")[0];
        }
        else if(accessPointLegend.textContent.trim().substring(0,6) == "Client") {
            const currentClient = "client" + accessPointLegend.textContent.trim().split(" ")[1];
            const clientSSID = accessPointLegend.textContent.trim();
            const matchInParen = /\((.*)\)/;
            clientLegendObject[currentClient] = {};
            if (modelDict[modemModel] === "3450") {
                clientLegendObject[currentClient]["rssi"] = accessPointFieldsets[i].querySelectorAll("div")[1].textContent.trim().split(" ")[0];
                clientLegendObject[currentClient]["macaddr"] = accessPointFieldsets[i].querySelectorAll("div")[0].textContent.trim().split(" ")[0];
                clientLegendObject[currentClient]["ssid"] = clientSSID.match(matchInParen)[1];
            }
            else if(modelDict[modemModel] === "1670" || modelDict[modemModel] === "2470" || modelDict[modemModel] === "2472") {
                clientLegendObject[currentClient]["rssi"] = accessPointFieldsets[i].querySelectorAll("div")[3].textContent.trim().split(" ")[0];
                clientLegendObject[currentClient]["macaddr"] = accessPointFieldsets[i].querySelectorAll("div")[2].textContent.trim().split(" ")[0];
                clientLegendObject[currentClient]["ssid"] = clientSSID.match(matchInParen)[1];
            }
        }
        else {
            console.log(accessPointLegend.textContent.trim());
        }
    }
    for (var client in clientLegendObject) {
        for (var ssid in ssidLegendObject) {
            if (clientLegendObject[client]["ssid"] === ssidLegendObject[ssid]["id"]) {
                clientLegendObject[client]["radionum"] = ssid.split("ssid")[1];
            }
            else {
                //console.log(ssidLegendObject[ssid]["id"] + ", " + clientLegendObject[client]["ssid"]);
            }
        }
    }

    const wirelessClientObject = {};

    if (Object.keys(radioLegendObject).length == 2 && Object.keys(ssidLegendObject).length == 2) {
        for (i = 0; i < Object.keys(clientLegendObject).length; i++) {
            currentClient = "client" + (i + 1);
            for (n = 0; n < Object.keys(ssidLegendObject).length; n++) {
                currentSSID = "ssid" + (n + 1);
                currentRadio = n;
                if(clientLegendObject[currentClient]["ssid"] == ssidLegendObject[currentSSID]["id"]) {
                    wirelessClientObject[currentClient] = {};
                    wirelessClientObject[currentClient]["macaddr"] = clientLegendObject[currentClient]["macaddr"];
                    wirelessClientObject[currentClient]["frequency"] = radioLegendObject[currentRadio["frequency"]];
                    wirelessClientObject[currentClient]["ssid"] = ssidLegendObject[currentSSID]["id"];
                    wirelessClientObject[currentClient]["rssi"] = clientLegendObject[currentClient]["rssi"];
                    console.log("mac is " + wirelessClientObject[currentClient]["macaddr"]);
                    console.log("freq is" + wirelessClientObject[currentClient]["frequency"]);
                    console.log("ssid is " + wirelessClientObject[currentClient]["ssid"]);
                    console.log("rssi is " + wirelessClientObject[currentClient]["rssi"]);
                }
                else {
                    // This problably doesn't matter it just means that the nth ssid we have stored didn't match the current client's ssid
                }
            }
        }
    }
    else if (Object.keys(radioLegendObject).length == 1 && Object.keys(ssidLegendObject).length == 1) {
        for (i = 0; i < Object.keys(clientLegendObject).length; i++) {
            for (n = 0; n < Object.keys(radioLegendObject).length; n++) {
                if(clientLegendObject[i]["ssid"] === ssidLegendObject[n]["id"]) {
                    currentClient = i;
                    wirelessClientObject[currentClient] = {};
                    wirelessClientObject[currentClient]["macaddr"] = clientLegendObject[currentClient]["macaddr"];
                    wirelessClientObject[currentClient]["frequency"] = Object.values(radioLegendObject[n])["frequency"];
                    wirelessClientObject[currentClient]["ssid"] = ssidLegendObject[n]["id"];
                    wirelessClientObject[currentClient]["rssi"] = clientLegendObject[currentClient]["rssi"];
                }
            }
        }
    }
    else {
        // Tell the world we can't process this
        // Either both bands have the same name, or one/both bands are disabled
        // It's also possible that additional SSIDs have been enabled. I believe all of our gateways support this via Web GUI. 
        console.log("bad");
    }
    return(wirelessClientObject);
}

const modemObject = {
    "model": modemModel,
    "docsis": docsisVersion,
    "macaddr": modemMAC,
    "lanip": modemLAN,
    "uptime": modemUptime,
    "collection": collectionStatus,
    "registration": registrationStatus,
    "emta": eMTACapable,
    "emtastatus": eMTAStatus,
    "lastflaps": flapLast,
    "flapstotal": flapTotal,
    "battery": batteryStatus,
    "upstream": upstreamObject,
    "downstream": downstreamObject,
    "interfaces": getInterfaceStats(),
    "billing": getBillingStats(),
    "cpe": getCPEInfo(),
    "hasmoca": hasMoCA(),
    "mocanodes": (hasMoCA() === "Yes") ? getMocaNodeInfo() : "N/A",
    "apdata": (isGateway() === "Yes") ? getAPInfo() : "N/A"
};

const modemData = {
    "model": modelDict[modemObject["model"]],
    "docsis": modemObject["docsis"],
    "macaddr": modemObject["macaddr"],
    "lanip": modemObject["lanip"],
    "uptime": modemObject["uptime"],
    "registration": modemObject["registration"]
}

const billingData = {
    "name": modemObject["billing"]["customername"],
    "address": modemObject["billing"]["customeraddress"],
    "location": modemObject["billing"]["customerlocation"],
    "node": modemObject["billing"]["customernode"]
}

// DEBUG: Remove me
//console.log(modemObject);
// Save the current page in case you want to switch back dynamically; need to incorporate message passing API for this I think
const currentPage = document.documentElement.outterHTML;

function prepData(dataObject) {
    var dataSpans = "";
    for (i = 0; i < Object.keys(dataObject).length; i++) {
        if (typeof(Object.values(dataObject)[i]) === 'object') {
            currentClient = i;
            for (n = 0; n < Object.keys(Object.keys(dataObject)[i]).length; n++) {
                // For every propery of wireless client
                dataSpans += "<span id='" + Object.keys(Object.values(dataObject)[i])[n] + "'>" + Object.values(Object.values(dataObject)[i])[n] + "</span><br />";
            }
        }
        else {
            dataSpans += "<span id='" + Object.keys(dataObject)[i] + "'>" + Object.values(dataObject)[i] + "</span><br />";
        }
    }
    return(dataSpans);
}

let distributableData = '<html lang="en-US">';
distributableData += '<head><title>iGlass [MODIFIED]</title></head>';
distributableData += '<body>';
distributableData += '<div id="content">';
distributableData += '<div id="modem">';
distributableData += prepData(modemData);
distributableData += '</div>';
distributableData += '<div id="billing">';
distributableData += prepData(billingData);
distributableData += '</div>';
distributableData += '<div id="wireless">';
if (isGateway() === "Yes") {
    distributableData += prepData(getAPInfo());
    //console.log(getAPInfo());
    //console.log(prepData(getAPInfo()));
    distributableData += '</div>';
}
distributableData += '</div>';
distributableData += '</body>';
distributableData += '</html>';
//document.documentElement.innerHTML = distributableData;

// Need to combine wireless clients by MAC address 