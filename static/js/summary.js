function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

function copyData() {
    try {
        const customerName = document.querySelectorAll("#customerHeader")[0].querySelectorAll("div")[2].textContent.split("M: ")[0].trim(); // NAME
        const customerAcct = document.querySelectorAll("#customerHeader")[0].querySelectorAll("div")[5].textContent.trim(); // ACCOUNT NUM
        const customerAddr = titleCase(document.querySelectorAll("#customerHeader")[0].querySelectorAll("div")[14].textContent.trim()); // Address (Check for content 1 NO ADDRESS)
        var infoArea = document.createElement('textarea');
        infoArea.id = "stuff";
        infoArea.value = customerName + "\n" + customerAcct + "\n" + customerAddr;
        document.body.appendChild(infoArea);
        infoArea.style.height = "0px";
        infoArea.style.width = "0px";
        infoArea.style.opacity = "0";
        infoArea.select();
        document.execCommand("copy");
        console.log("Copied");
        return 0;
    }
    catch (err) {
        console.log("Error");
    }
}

document.onkeyup = function(e) {
    if (e.altKey && e.which == 67) {
        copyData();
    }
    else {
        void 0;
    }
}