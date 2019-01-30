var contentDiv = document.getElementById("content");
var outageDiv = document.getElementById("outages");

if (typeof(outageDiv) != undefined && outageDiv != null) {
    var outageCount = 0;
    var mTotal = 0;
    var hTotal = 0;
    var dTotal = 0;
    for (i = 0; i < outageDiv.getElementsByTagName("li").length; i++) {
        // Get full outage string
        var liStr = outageDiv.getElementsByTagName("li")[i].innerText;
        var liHTML = outageDiv.getElementsByTagName("li")[i].innerHTML;
        // Get just the outage length in hh:mm format
        var spanStr = outageDiv.getElementsByTagName("span")[i].innerText;
        console.log(i + " : " + liHTML);
        console.log(spanStr);
        // Split the outage time values by colon to get minute/hour/day values
        // We can't 
        var spanArray = spanStr.split(':');
        if (spanArray.length == 3) {
            var days = spanArray[0]; 
            var hours = spanArray[1];
            var minutes = spanArray[2];
        }
        else {
            var hours = spanArray[0];
            var minutes = spanArray[1];
        }
        mTotal += minutes
        hTotal += hours
        if (days != null && days != 0) {
            dTotal += days;
        }

        console.log(spanStr.split(':')[0] + ' this should be before colon');
        console.log(spanStr.split(':')[1] + ' this should be after colon');
        var timeArray = [0, 0, 0];
        outageCount++;
    }
    console.log(outageCount);
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