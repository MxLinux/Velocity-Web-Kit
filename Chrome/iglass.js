var contentDiv = document.getElementById("content");
var outageDiv = document.getElementById("outages");

if (typeof(outageDiv) != undefined && outageDiv != null) {
    var outageCount = 0;
    for (i = 0; i < outageDiv.getElementsByTagName("li").length; i++) {
        // Get full outage string
        var liStr = outageDiv.getElementsByTagName("li")[i].innerText;
        var liHTML = outageDiv.getElementsByTagName("li")[i].innerHTML;
        // Get just the outage length in hh:mm format
        var spanStr = outageDiv.getElementsByTagName("span")[i].innerText;
        console.log(i + " : " + liHTML);
        console.log(spanStr);
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
    
    var signalButton = "<button id='signalButton' class='ui-button ui-corner-all ui-widget' onclick='copySignal()'>Copy Signals</button>";
    document.getElementById('expandAll').insertAdjacentHTML('beforebegin', signalButton);
}

function copySignal() {
    var signalArea = document.createElement('textarea');
    signalArea.value = signalstr;
    contentDiv.appendChild(signalArea);
    signalArea.style.height = "0px";
    signalArea.style.width = "0px";
    signalArea.style.opacity = "0";
    signalArea.select();
    document.execCommand("copy");
}