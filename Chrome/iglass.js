/*
    This file responsible for modifying the contents of the modem/gateway views
    in iGlass. My goal is more readable and more quickly accessible information.
    Currently implemented:
        * Pulling upstream/downstream signals (this will require work for buggy 3450 SNMP)
        * Pulling outage data from "Overall Box Status" (this will require work to accomodate modems with multiple day long outages)
        * Active work on sorting wireless client data for gateways. As it stands, iGlass
          will show a single connecting client 3 times. IPv4, IPv6, IPv6 link-local. I would like to combine all client IPs into information
          that describes the client, rather than independent entries for each IP. This should be easily managed by checking MAC addresses
*/

function copyData(values, name) {
    var infoArea = document.createElement('textarea');
    infoArea.id = name;
    infoArea.value = values;
    contentDiv.appendChild(infoArea);
    infoArea.style.height = "0px";
    infoArea.style.width = "0px";
    infoArea.style.opacity = "0";
    infoArea.select();
    document.execCommand("copy");
    return 0;
}

// * * * * * * * * * * * * * * * * * * * * //
//     Working for 1670/2470/2472/3450     //
// * * * * * * * * * * * * * * * * * * * * //

function translateFrequency(frequencyValue) {
    // This will translate n2dot4Ghz or n5GHz to 2.4GHz or 5GHz respectively
    // This might later be used to translate the frequency for exactness based on channel #
    if (frequencyValue === "n2dot4Ghz") {
        return("2.4GHz");
    }
    else if (frequencyValue === "n5Ghz") {
        return("5GHz");
    }
    else {
        return("Error, malformed frequency data: " + JSON.stringify(frequencyValue));
    }
}

function formatRadio(radioObj) {
    radioDivs = radioObj.getElementsByTagName("div");
    // Not all of the radio divs loaded, or we tried to format something
    // that doesn't contain radio info.
    if (radioDivs.length < 4) {
        return("Error, malformed radio data: " + JSON.stringify(radioDivs));
    }
    else if (radioDivs.length == 4) {
        var cleanRadioObj = {
            radioNum: ["Radio Number", radioObj.getElementsByTagName("legend")[0].innerText.trim().split(" ")[1]],
            radioChan: ["Wireless Channel", radioDivs[0].innerText.trim().split(" ")[0]],
            radioBand: ["Wireless Frequency", radioDivs[1].innerText.trim().split(" ")[0] + "GHz"],
            radioOutPwr: ["Transmit Power", radioDivs[3].innerText.trim().split(" ")[0] + "%"]
        };
        for (property in cleanRadioObj) {
            console.log(cleanRadioObj[property][0] + ": " + cleanRadioObj[property][1]);
        }
    }
    else if (radioDivs.length == 5) {
        var cleanRadioObj = {
            radioNum: ["Radio Number", radioObj.getElementsByTagName("legend")[0].innerText.trim().split(" ")[1]],
            radioChan: ["Wireless Channel", radioDivs[0].innerText.trim().split(" ")[0]],
            radioBand: ["Wireless Frequency", translateFrequency(radioDivs[2].innerText.trim().split(" ")[0])],
            radioOutPwr: ["Transmit Power", radioDivs[4].innerText.trim().split(" ")[0] + "%"]
        };
        for (property in cleanRadioObj) {
            console.log(cleanRadioObj[property][0] + ": " + cleanRadioObj[property][1]);
        }
    }
}

function formatSSID(ssidObj) {
    // Not checked for completeness with all models, should be universal with our equipment thus far
    ssidDivs = ssidObj.getElementsByTagName("div");
    if (ssidDivs.length !== 2) {
        console.log("Error, malformed SSID data: " + JSON.stringify(ssidDivs));
    }
    else {
        var cleanSSIDObj = {
            // TODO: Trim "ID" from apName
            apName: ["SSID", ssidDivs[0].innerText.trim()],
            apSec: ["Security", ssidDivs[1].innerText.trim().split(" ")[0]]
        };
        for (property in cleanSSIDObj) {
            console.log(cleanSSIDObj[property][0] + ": " + cleanSSIDObj[property][1]);
        }
    }
}

function formatClient(clientObj) {
    clientDivs = clientObj.getElementsByTagName("div");
    if (clientDivs.length === 7) {
        var cleanClientObj = {
            clientMAC: ["MAC Address", clientDivs[2].innerText.trim().split(" ")[0]],
            clientHostname: ["Hostname", clientDivs[0].innerText.trim().split(" ")[0]],
            clientIPv4: ["IPv4"],
            clientIPv6: ["IPv6"],
            clientIPv6LinkLocal: ["IPv6 Link-Local"],
            clientRSSI: ["RSSI"],
            clientOnline: ["Online Status"]
        };
    }
    else if (clientDivs.length == 5) {
        var cleanClientObj = {
            clientMAC: ["MAC Address"],
            clientRSSI: ["RSSI"],
            clientRetransmit: ["Retransmitted Packets"]
        };
    }
    else {
        console.log("Error, malformed SSID data: " + JSON.stringify(ssidDivs));
    }
}

if (document.getElementById("wirelessToggle") != null) {
    var clientDiv = document.getElementById("wirelessToggle").parentElement;
    var wirelessFields = clientDiv.getElementsByTagName("fieldset");
    clientNum = 0;
 
    for (i = 0; i < wirelessFields.length; i++) {
        if (wirelessFields.item(i).getElementsByTagName("legend").item(0).innerText.substring(0, 5) === "Radio") {
            // further conditional processing required for radio #, so we can throw it in w the corresponding ssid #
            formatRadio(wirelessFields.item(i));
        }
        else if (wirelessFields.item(i).getElementsByTagName("legend").item(0).innerText.substring(0, 4) === "SSID") {
            formatSSID(wirelessFields.item(i));
        }
        else if (wirelessFields.item(i).getElementsByTagName("legend").item(0).innerText.substring(0, 5) === "Client") {
            formatClient(wirelessFields.item(i));
        }
    }
}

// * * * * * * * * * * * * * * * * * * * * //

var contentDiv = document.getElementById("content");
var outageDiv = document.getElementById("outages");

if (document.getElementsByClassName("clickForPopup").length > 0) {
    var signals = document.getElementsByClassName("clickForPopup");
    // Upstream
    var tx = signals[0].getElementsByTagName("span")[0].innerText;
    var usnr = signals[1].getElementsByTagName("span")[0].innerText;
    //DOWNSTREAM
    var rx = signals[2].getElementsByTagName("span")[0].innerText;
    var dsnr = signals[3].getElementsByTagName("span")[0].innerText;
    // As a string
    // TODO: This should just give values and the output should be 
    var upstr = "TX: " + tx + ", uSNR: " + usnr;
    var downstr = "RX: " + rx + ", dSNR: " + dsnr;
    var signalStr = upstr + ", " + downstr;
    console.log(signalStr);
    var signalButton = "<button id='signalButton' class='ui-button ui-corner-all ui-widget'>Copy Signals</button>";
    document.getElementById('expandAll').insertAdjacentHTML('beforebegin', signalButton);
    document.getElementById('signalButton').onclick = function() {
        copyData(signalStr, 'signals');
    };
}

if (typeof(outageDiv) !== undefined && outageDiv !== null) {
    var outageCount = 0;
    var mTotal = 0;
    var hTotal = 0;
    var dTotal = 0;
    var min = 0;
    var max = 0;
    // Define an empty array of arrays for storing hour/minute pairs
    // We'll use this to check for max and min outage time
    var tArray = [[]];
    for (i = 0; i < outageDiv.getElementsByTagName("li").length; i++) {
        // Get full outage string
        var liStr = outageDiv.getElementsByTagName("li")[i].innerText;
        var liHTML = outageDiv.getElementsByTagName("li")[i].innerHTML;
        // Get just the outage length in hh:mm format
        var spanStr = outageDiv.getElementsByTagName("span")[i].innerText;
        // Split the outage time values by colon to get minute/hour/day values as an array
        //TODO: Handle outage events in days
        var spanArray = spanStr.split(':');
        var hours = spanArray[0];
        var minutes = spanArray[1];
        var date = liStr.substr(4,8);
        mTotal = Math.floor(parseInt(mTotal) + parseInt(minutes));
        hTotal = Math.floor(parseInt(hTotal) + parseInt(hours));
        outageCount++;
        // Add values to our array of arrays
        // Assuming outage 1 is 0 hours 0 minutes and
        // Assuming outage 2 is 0 hours 15 minutes and
        // Assuming outage 3 is 4 hours 0 minutes this would look like
        // [[0, 0, 0], [1, 0, 15], [2, 4, 0]]
        tArray[i] = [];
        tArray[i][0] = i;
        tArray[i][1] = hours;
        tArray[i][2] = minutes;
        tArray[i][3] = date;
    }

	if (mTotal > 60) {
        var mHours = Math.floor(mTotal / 60);
        var mExcess = Math.floor(mTotal % 60);
        hTotal = Math.floor(mHours + hTotal);
    }
    else {
        var mHours = 0;
        var mExcess = mTotal;
    }
    if (hTotal > 24) {
        var hDays = Math.floor(hTotal / 24);
        var hExcess = Math.floor(hTotal % 24);
        dTotal = hDays;
    }
    else {
        var hExcess = hTotal;
        dTotal = 0;
    }
    var outageStr = outageCount + " outages totaling approximately " + dTotal + " days, " + hExcess + " hours and " + mExcess + " minutes. First occurence: " + tArray[0][3] + ", last occurence: " + tArray[tArray.length - 1][3] + ".";
    console.log(outageStr);
    var outageButton = "<button id='outageButton' class='ui-button ui-corner-all ui-widget'>Copy Outage Info</button>";
    document.getElementById('expandAll').insertAdjacentHTML('beforebegin', outageButton);
    document.getElementById('outageButton').onclick = function() {
        copyData(outageStr, 'outagetxt');
    };
}