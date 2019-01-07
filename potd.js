// We can load all the POTD files as an array and check them one at a time
// if (location == file) can be nested in a for loop where file is then file[i]

file = "file:///home/shea/potd.txt";

var date = new Date();
var month = (date.getMonth() + 1).toString();
if (month.length < 2) {
    month = "0" + month;
}
var day = date.getDate().toString();
if (day.length < 2) {
    day = "0" + day;
}
var year = (date.getFullYear().toString()).slice(-2);
var dateStr = month + "/" + day + "/" + year;
if (location == file) {
    var content = new XMLSerializer().serializeToString(document);
    var lines = content.split('\n');
    for (var i = 2; i < 10; i++) {
        var potd = lines[i].substr(10);
        if (lines[i].substr(0, 8) == dateStr) {
            alert(potd);
            if (!potd) {
                console.log("Something went wrong, no POTD stored...");
            }
            else {
                chrome.storage.sync.set({'potd': potd}, function() {
                });
            }
        }
    }
}