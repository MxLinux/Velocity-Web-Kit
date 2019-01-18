chrome.runtime.onInstalled.addListener(function() {
    let txt = '';
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.status == 200 && xmlhttp.readyState == 4){
                txt = xmlhttp.responseText;
                alert(txt);
            }
    };
    xmlhttp.open("GET", "http://127.0.0.1:5000/potd", true);
    xmlhttp.send();
    alert(xmlhttp.responseText);
});
