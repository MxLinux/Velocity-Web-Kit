// Reasons back-end access would be better:
// 1. Faster than iGlass, faster than JavaScript
// 2. Does iGlass charge per account? Per CPE?
// 3. No stupid distracting averages of channel stats
// 4. iGlass displays microreflections in units of ??? negative decibles relative to carrier ??? what is a negative unit ??? Just say i.e., -30
//    Like why don't you want people to know what the data represents if they're supposed to be using it?
// 5. If viewing a modem showing an upstream impairment, we could immediately initiate and display a poll of the node/child node for similarities
//    This would help us determine whether the impairment is on the plant or customer premise
// 6. Integration with Active Directory maybe
// 7. Could definitely make it less ugly
// 8. Direct integration into ticketing system. i.e., we store previous monitoring results in NFS why not make it accessible from ticketing
//    And the current system of monitoring results is an email that gets dropped in a folder we don't have time to look at and sort through manually
// 9. More intuitive overview of MoCA and wireless infrastructures in customer homes; i.e., we know which MoCA devices are connected and which should be, but aren't.

// Anyways, moving on
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
    "unknown": "Cannot Determine Registration Status"
}

const eMTADict = {
    "telephony-RegComplete": "Registration Complete",
    "telephony-RegWithCallServer": "Registering with Call Server",
    "telephony-DHCP": "Obtaining eMTA IP Address",
    "telephony-TFTP": "Downloading eMTA Configuration",
    "unknown": "Cannot Determine Telephony Status"
}

const batteryDict = {
    "normal": "Healthy",
    "depleted": "Dead or Removed",
    "unknown": "Cannot Determine Battery Health"
}

const mocaDict = {
    "disabled": "Disabled",
    "linkUp": "Device(s) connected"
}

// Variable names explain themselves. 
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

const eMTACapable = document.querySelectorAll("label[for='status']")[3].parentElement.textContent ? isMTA() : "No";
const eMTAStatus = (eMTACapable === "Yes") ? eMTADict[document.querySelectorAll("label[for='status']")[3].parentElement.textContent.trim().split("\n")[0].split("MTA")[0].trim()] : "N/A"
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

const widgetMoCA = document.querySelectorAll("#mocaToggle")[0];

function hasMoCA() {
    const ifMoCA = (widgetMoCA !== "undefined") ? "Yes" : "No";
    return(ifMoCA);
}

function getMocaNodeInfo() {
    const mocaObject = {};
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
        return(mocaObject);
    }
}

function isGateway() {
    const wirelessToggle = document.querySelectorAll("#wirelessToggle")[0];
    const ifGateway = (wirelessToggle !== "undefined") ? "Yes" : "No";
    return(ifGateway);
}

function generateGatewayObject() {
    for (i = 0; i < wirelessDiv.length; i++) {
        const currentDiv = wirelessDiv[i];
        const wirelessItemLegendText = wirelessDiv[i].querySelectorAll("legend").textContent.trim().split("\n")[0];
        if (wirelessItemLegendText.split(0,4) === "Radio") {
            generateRadioObject(currentDiv);
        }
        else if (wirelessItemLegendText.split(0,3) === "SSID") {
            // thing
        }
        else if (wirelessItemLegendText.split(0,5) === "Client") {
            generateClientObject(currentDiv);
        }
    }

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
    "gatewaydata": (isGateway() === "Yes") ? getGatewayInfo() : "N/A"
};

// DEBUG: Remove me
console.log(modemObject);