var user = "technician";
var site = location.hostname;
var regex = new RegExp("(10)(\.([2]([0-5][0-5]|[01234][6-9])|[1][0-9][0-9]|[1-9][0-9]|[0-9])){3}");
var match = site.match(regex);

function getPOTD() {
    var p = new Promise(function (resolve, reject) {
        chrome.storage.sync.get({
            potd
        }, function (items) {
            potd = items.potd;
            resolve(potd);
        });
    });
    p.then(function (potd) {
        if (potd == true) {
            // Maybe create a bookmark???
            alert("Until I find a workaround, you will have to manually open the current POTD file from network storage just once per day so this script can access the password.");
        }
        else {
            document.getElementById("Password").value = potd;
            var inputs = document.getElementsByTagName("input");
            for (i = 0; i < inputs.length; i++) {
                if (inputs[i].value === "Login") {
                    inputs[i].click();
                }
            }
        }
    });
}

if (match != null) {
    if (location.port == 8080) {
        var potd = true;
        getPOTD();
        document.getElementById('UserName').value = "technician";
    }

}
else {
    console.log("Not a gateway login.")
}