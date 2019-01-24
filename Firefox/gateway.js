var user = "technician";
var site = location.hostname;
var regex = new RegExp("(10)(\.([2]([0-5][0-5]|[01234][6-9])|[1][0-9][0-9]|[1-9][0-9]|[0-9])){3}");
var match = site.match(regex);

if (match != null) {
    if (location.port == 8080) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                xhttp.status === 200 ? console.log(xhttp.responseText) : console.error('Error')
                setTimeout(function() {
                    var login_node = document.getElementById("Login");
                    if (typeof(login_node) != 'undefined' && login_node != null) {
                        document.getElementById('Password').value = "" + xhttp.responseText;
                        document.getElementById('UserName').value = "technician";
                    }
                    else {
                        console.log("Not a gateway login...");
                    }
                }, 1000);
            }
        }
        xhttp.open("GET", "http://127.0.0.1/potd", true);
        xhttp.send();
    }
}
else {
    console.log("Not a gateway login.")
}