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

function formatRadio(radioObj) {
    radioDivs = radioObj.getElementsByTagName("div");
    if (radioDivs.length < 4) {
        return("Error, malformed radio data.");
    }
    else {
        var cleanRadioObj = {
            radioNum: radioObj.getElementsByTagName("legend")[0].innerText.trim(),
            radioChan: radioDivs[0].innerText.trim(),
            radioBand: radioDivs[1].innerText.trim(),
            radioOutPwr: radioDivs[3].innerText.trim()
        };

        for (var property in cleanRadioObj) {
            console.log(JSON.stringify(property));
        }
    }

}

function formatSSID(ssidObj) {

}

function formatClient(clientObj) {

}

if (document.getElementById("wirelessToggle") != null) {
    var clientDiv = document.getElementById("wirelessToggle").parentElement;
    var wirelessFields = clientDiv.getElementsByTagName("fieldset");
    console.log("Length of list is " + wirelessFields.length + " items");
    clientNum = 0;

    for (i = 0; i < wirelessFields.length; i++) {
        if (wirelessFields.item(i).getElementsByTagName("legend").item(0).innerText.substring(0, 5) === "Radio") {
            console.log("We found a radio item at item number " + i);
            console.log(wirelessFields.item(i));
            console.log(wirelessFields.item(i).getElementsByTagName("legend").item(0).innerText);
            formatRadio(wirelessFields[i]);
        }
        else {
            console.log(wirelessFields[i].innerHTML + "\n");
        }
    }

}

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
    var i;
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