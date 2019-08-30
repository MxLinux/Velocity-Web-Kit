// Get values
// Let's start with getting the major elements containing important info
const allDiv = document.getElementsByClassName("ui-widget");
for (i = 0; i < allDiv.length; i++) {
    console.log(allDiv[i].innerHTML);
}
console.log(allDiv.length);