var user = "technician";
var site = location.hostname;
// Some regex I totally stole from SO to check against Class A addresses
var regex = new RegExp("(10)(\.([2]([0-5][0-5]|[01234][6-9])|[1][0-9][0-9]|[1-9][0-9]|[0-9])){3}");
var match = site.match(regex);

if (match != null) {
    // Wait 1 second before trying, elements on page take a while to load
    setTimeout(function() {
        if (document.getElementById("Login") != 'undefined' && document.getElementById("Login") != null) {
            var loginNode_old = document.getElementById("Login");
            // Make sure login div exists on this page/has loaded
            // Send XHR to the POTD-Web flask server
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                // Checks XHR status to determine that we have successfully loaded the POTD page
                if (xhttp.readyState === 4) {
                    xhttp.status === 200 ? console.log(xhttp.responseText) : console.log('XHR error')
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
        else if (document.getElementById("login-block") != 'undefined' && document.getElementById("login-block") != null) {
            var loginNode_new = document.getElementsByClassName("login-block");
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = () => {
                // Checks XHR status to determine that we have successfully loaded the POTD page
                if (xhttp.readyState === 4) {
                    xhttp.status === 200 ? console.log(xhttp.responseText) : console.log('XHR error.')
                    // Fill out credentials 
                    document.getElementById('password').value = "" + xhttp.responseText;
                    document.getElementById('username').value = "technician";
                    // After filling out credentials, verify that our password has succesfully filled and is of proper length
                    // If yes, click the login button to automatically sign in
                    if (document.getElementById('password').value != null && String(document.getElementById('password').value).length == 10) {
                        document.querySelector('#loginbtn').click();
                    }
                }
            }
            // Actually send our XHR request
            xhttp.open("GET", "http://127.0.0.1/potd", true);
            xhttp.send();
        }
        else {
            // Not a login page, do nothing
            void 0;
        }
    }, 1000);
}