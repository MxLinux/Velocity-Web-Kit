var contentDiv = document.getElementById("content");
var outageDiv = document.getElementById("outages");

if (typeof(outageDiv) != undefined && outageDiv != null) {
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
        // Split the outage time values by colon to get minute/hour/day values
        // We can't 
        var spanArray = spanStr.split(':');
        var hours = spanArray[0];
        var minutes = spanArray[1];
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
    }
    if (mTotal > 60) {
        var mHours = Math.floor(mTotal / 60);
        var mExcess = Math.floor(mTotal % 60);
        hTotal = Math.floor(mHours + hTotal)
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
    console.log(tArray);
    console.log(outageCount + " outages totaling approximately " + dTotal + " days, " + hTotal + " hours and " + mExcess + " minutes.");
}
else {
    console.log("No outages reported");
}

if (document.getElementsByClassName("clickForPopup").length > 0) {
    var signals = document.getElementsByClassName("clickForPopup");
    
    // Upstream
    var tx = signals[0].getElementsByTagName("span")[0].innerText;
    var usnr = signals[1].getElementsByTagName("span")[0].innerText;
    
    //DOWNSTREAM
    var rx = signals[2].getElementsByTagName("span")[0].innerText;
    var dsnr = signals[3].getElementsByTagName("span")[0].innerText;
    
    // As a string
    var upstr = "Upstream Power: " + tx + ", SNR: " + usnr;
    var downstr = "Downstream Power: " + rx + ", SNR: " + dsnr;
    var signalstr = upstr + " || " + downstr;
    
    var signalButton = "<button id='signalButton' class='ui-button ui-corner-all ui-widget' onclick='copyInfo(signalstr, \"signals\")'>Copy Signals</button>";
    document.getElementById('expandAll').insertAdjacentHTML('beforebegin', signalButton);
}

function copyInfo(values, name) {
    var infoArea = document.createElement('textarea');
    infoArea.id = name;
    infoArea.value = values;
    contentDiv.appendChild(infoArea);
    infoArea.style.height = "0px";
    infoArea.style.width = "0px";
    infoArea.style.opacity = "0";
    infoArea.select();
    document.execCommand("copy");
}