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
    "unknown": "Cannot determine registration status"
}

const eMTADict = {
    "telephony-RegComplete": "Registration Complete",
    "telephony-RegWithCallServer": "Registering with Call Server",
    "telephony-DHCP": "Obtaining eMTA IP Address",
    "telephony-TFTP": "Downloading eMTA Configuration",
    "unknown": "Unknown"
}

const batteryDict = {
    "normal": "Healthy",
    "depleted": "Dead or Removed",
    "unknown": "Unknown"
}

// Potentially global functions

// https://stackoverflow.com/a/45089849
function getElementsByText(str, tag = "label") {
    if(typeof(str) !== undefined) {
        return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent.trim() === str.trim());
    }
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
const upstreamObj = {
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
const downstreamObj = {
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
            upstreamObj[channelIndex] = {};
            upstreamObj[channelIndex]["transmitfrequency"] = getTransmitChannelFrequency(currentChannel);
            upstreamObj[channelIndex]["transmitwidth"] = getTransmitChannelWidth(currentChannel)
            upstreamObj[channelIndex]["cmtsreceivepower"] = getCMTSReceivePower(currentChannel);
            upstreamObj[channelIndex]["transmitchannelpower"] = getTransmitChannelPower(currentChannel);
            upstreamObj[channelIndex]["transmitchannelsnr"] = getTransmitChannelSNR(currentChannel);
            upstreamObj[channelIndex]["transmitchannelmicro"] = getTransmitChannelMicro(currentChannel);
            upstreamObj[channelIndex]["transmitcorrected"] = getTransmitCorrected(currentChannel);
            upstreamObj[channelIndex]["transmiterrored"] = getTransmitErrored(currentChannel);
            upstreamObj[channelIndex]["transmitcodewords"] = getTransmitCodewords(currentChannel);
        }
    }

    for (i = 0; i < downstreamNodeList.length; i++) {
        if(i != 0) {
            const channelIndex = "downstream" + i; // Channel 0 isn't really a thing, so...
            const currentChannel = downstreamNodeList[i];
            downstreamObj[channelIndex] = {};
            downstreamObj[channelIndex]["receivefrequency"] = getReceiveChannelFrequency(currentChannel);
            downstreamObj[channelIndex]["receivewidth"] = getReceiveChannelWidth(currentChannel)
            downstreamObj[channelIndex]["receivechannelpower"] = getReceiveChannelPower(currentChannel);
            downstreamObj[channelIndex]["receivechannelsnr"] = getReceiveChannelSNR(currentChannel);
            downstreamObj[channelIndex]["receivechannelmicro"] = getReceiveChannelMicro(currentChannel);
            downstreamObj[channelIndex]["receivecorrected"] = getReceiveCorrected(currentChannel);
            downstreamObj[channelIndex]["receiveerrored"] = getReceiveErrored(currentChannel);
            downstreamObj[channelIndex]["receivecodewords"] = getReceiveCodewords(currentChannel);
        }
    }
}

getChannelStats(upstreamChannels, downstreamChannels);

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
    "lastflaps": flapLast,
    "flapstotal": flapTotal,
    "battery": batteryStatus,
    "upstream": upstreamObj,
    "downstream": downstreamObj
};

// DEBUG: Remove me
console.log(modemObj);