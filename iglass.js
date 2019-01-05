//UPSTREAM
var up = document.getElementsByClassName("ui-widget")[13]
var tx = up.getElementsByTagName("span")[1].innerText;
var usnr = up.getElementsByTagName("span")[3].innerText;

//DOWNSTREAM
var down = document.getElementsByClassName("ui-widget")[18];
var rx = down.getElementsByTagName("span")[1].innerText;
var dsnr = down.getElementsByTagName("span")[3].innerText;

// As a string
var upstr = "Upstream Power: " + tx + ", SNR: " + usnr;
var downstr = "Downstream Power: " + rx + ", SNR: " + dsnr;
var signalstr = upstr + " || " + downstr;
//alert(signalstr);

var signalButton = "<button id='signalButton' onclick='copySignal()'>Copy Signals</button>";
document.getElementById('expandAll').insertAdjacentHTML('beforebegin', signalButton);

var contentDiv = document.getElementById("content");

function copySignal() {
    var signalArea = document.createElement('textarea');
    signalArea.value = signalstr;
    contentDiv.appendChild(signalArea);
    signalArea.style.height = "0px";
    signalArea.style.width = "0px";
    signalArea.style.opacity = "0";
    signalArea.select();
    document.execCommand("copy");
    alert('executed');
}
