chrome.storage.sync.get(["SummaryEnabled"], function (value) {
    if (Object.values(value) == "Yes") {

        function titleCase(str) {
            return str.toLowerCase().split(" ").map(function (word) {
                return (word.charAt(0).toUpperCase() + word.slice(1));
            }).join(" ");
        }

        function fixAddress(address) {
            const isolatedStreetAddr = address.split(", ")[0];
            const isolatedState = address.split(", ")[1].split(" ")[0];
            const isolatedZIP = address.split(", ")[1].split(" ")[1];
            const fixedZIP = isolatedZIP.substring(0, 5) + "-" + isolatedZIP.substring(5);
            const fixedState = isolatedState.toUpperCase();
            return (isolatedStreetAddr + ", " + fixedState + " " + fixedZIP);
        }

        function copyData() {
            try {
                chrome.storage.sync.get("CustInfoCopyEnabled", function (response) {
                    if (Object.values(response) == "Yes") {
                        //listener
                        chrome.storage.sync.get("CustInfoCopyFormat", function (response) {
                            const responseObj = Object.values(response)[0];
                            const newLineMatch = new RegExp("%nl", "g");
                            const fullNameMatch = new RegExp("%fullname", "g");
                            const accNumMatch = new RegExp("%accnumber", "g");
                            const fullAddrMatch = new RegExp("%fulladdress", "g");
                            const customerName = document.querySelectorAll("#customerHeader")[0].querySelectorAll("div")[3].querySelectorAll("label")[0].textContent.trim(); // NAME
                            const customerAcct = document.querySelectorAll("#customerHeader")[0].querySelectorAll(".large")[1].textContent.trim(); // ACCOUNT NUM
                            const customerAddr = titleCase(document.querySelectorAll("#customerHeader")[0].querySelectorAll("div")[1].querySelectorAll(".detail")[0].textContent.split(" |")[0]); // Address (Check for content 1 NO ADDRESS), may want to check for state 2-char string as well, as this is being title-cased with the rest of the str
                            const fixedAddress = fixAddress(customerAddr);
                            const matchNewLine = responseObj.replace(newLineMatch, "\n");
                            const matchFullName = matchNewLine.replace(fullNameMatch, customerName);
                            const matchAccount = matchFullName.replace(accNumMatch, customerAcct);
                            const matchAddress = matchAccount.replace(fullAddrMatch, fixedAddress);
                            const textareaDiv = document.querySelectorAll("#customerHeader")[0].querySelector("#stuff");
                            if (textareaDiv === null) {
                                var infoArea = document.createElement('textarea');
                                infoArea.id = "stuff";
                                infoArea.value = matchAddress;
                                document.querySelectorAll("#customerHeader")[0].appendChild(infoArea);
                                infoArea.style.height = "0px";
                                infoArea.style.width = "0px";
                                infoArea.style.opacity = "0";
                                infoArea.select();
                                document.execCommand("copy");
                                console.log("Copied");
                                return 0;
                            } else {
                                textareaDiv.value = matchAddress;
                                textareaDiv.select();
                                document.execCommand("copy");
                                console.log("Copied");
                                return 0;
                            }
                        })
                    }
                    else {
                        //listener
                    }
                });

            } catch (err) {
                console.log("summary.js copyData() Error: " + err);
            }
        }

        document.onkeyup = function (e) {
            if (e.altKey && e.which == 67) {
                copyData();
            } else {
                void 0;
            }
        }
    } else {
        console.log("Easton Velocity Web Kit: Customer summary modifications are disabled.");
    }
});