var user = "technician";
var site = location.hostname;
// Some regex I totally stole from SO to check against Class A addresses
var regex = new RegExp("(10)(\.([2]([0-5][0-5]|[01234][6-9])|[1][0-9][0-9]|[1-9][0-9]|[0-9])){3}");
var match = site.match(regex);

if (match != null) {
    // Check if this is the web interface port, port 80 should be default with FEC counter
    if (location.port == 8080) { 
        // Wait 1 second before trying, elements on page take a while to load
        setTimeout(function() {
            var loginNode = document.getElementById("Login");
            // Make sure login div exists on this page/has loaded
            if (typeof(loginNode) != 'undefined' && loginNode != null) {
                // Send XHR to the POTD-Web flask server
                const xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = () => {
                    // Checks XHR status to determine that we have successfully loaded the POTD page
                    if (xhttp.readyState === 4) {
                        xhttp.status === 200 ? console.log(xhttp.responseText) : console.error('Error')
                        // Fill out credentials 
                        document.getElementById('Password').value = "" + xhttp.responseText;
                        document.getElementById('UserName').value = "technician";
                        // After filling out credentials, verify that our password has succesfully filled and is of proper length
                        // If yes, click the login button to automatically sign in
                        if (document.getElementById('Password').value != null && String(document.getElementById('Password').value).length == 10) {
                            document.querySelector('.submitBtn').click();                        
                        }
                    }
                }
                // Actually send our XHR request
                xhttp.open("GET", "http://127.0.0.1/potd", true);
                xhttp.send();
            }                    
        }, 1000);
    }
}