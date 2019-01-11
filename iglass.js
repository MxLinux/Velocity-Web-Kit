var contentDiv = document.getElementById("content");
var headerText = document.getElementsByClassName("ui-widget-header")[0].innerText;

if (document.getElementsByClassName("clickForPopup").length > 0) {
    var tx = document.getElementsByClassName("clickForPopup")[0].getElementsByTagName("span")[0].innerText;
    var usnr = document.getElementsByClassName("clickForPopup")[1].getElementsByTagName("span")[0].innerText;
    
    //DOWNSTREAM
    var rx = document.getElementsByClassName("clickForPopup")[2].getElementsByTagName("span")[0].innerText;
    var dsnr = document.getElementsByClassName("clickForPopup")[3].getElementsByTagName("span")[0].innerText;
    
    // As a string
    var upstr = "Upstream Power: " + tx + ", SNR: " + usnr;
    var downstr = "Downstream Power: " + rx + ", SNR: " + dsnr;
    var signalstr = upstr + " || " + downstr;
    
    var signalButton = "<button id='signalButton' class='ui-button ui-corner-all ui-widget' onclick='copySignal()'>Copy Signals</button>";
    document.getElementById('expandAll').insertAdjacentHTML('beforebegin', signalButton);
}
else if (headerText.substring(0,12) === "Modem Events"){
    document.getElementsByTagName("span").style.setAttribute("style", "background: #FFFFFF;")
    console.log("Beep");
}
else {
    console.log("Not a modem page");
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