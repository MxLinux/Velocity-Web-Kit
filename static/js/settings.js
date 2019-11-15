chrome.storage.sync.get([
    "iGlassEnabled",
    "iGlassThemeEnabled",
    "iGlassSignalFormat",
    "iGlassCopyToggle",
    "iGlassSignalCopyShortcut",
    "GatewayEnabled",
    "AutoLogin",
    "SummaryEnabled",
    "CustInfoCopyEnabled",
    "CustInfoCopyFormat",
    "CustInfoCopyShortcut",
    "TicketEnabled",
    "AddiGlassButton",
    "AddSummaryButton",
    "AddRPXButton",
    "AddOMSButton",
    "VTTEnabled",
    "SortByCallbackEnabled",
    "SortByCallbackShortcut",
], function (settingObject) {

    function getCustInfoFormat() {
        return document.querySelector("#custinfocopyformat").value;
    }

    function getSignalFormat() {
        return document.querySelector("#signalformat").value;
    }

    function checkboxClicked(obj) {
        const parentToggles = [
            "iGlassEnabled",
            "iGlassCopyToggle",
            "GatewayEnabled",
            "SummaryEnabled",
            "CustInfoCopyEnabled",
            "TicketEnabled",
            "VTTEnabled"
        ];
        const className = obj.className;
        const objChecked = obj.checked;

        if (objChecked === true) {
            chrome.storage.sync.set({
                [className]: "Yes"
            }, function () { });
        }
        else if (objChecked == false) {
            chrome.storage.sync.set({
                [className]: "No"
            }, function () {});
        }
        else {
            console.log(objChecked);
        }
    }

    for (i = 0; i < Object.keys(settingObject).length; i++) {
        switch (Object.keys(settingObject)[i]) {
            case "iGlassEnabled":
                const div = document.querySelector(".iGlassEnabled");
                if (Object.values(settingObject)[i] == "Yes") {
                    div.checked = true;
                    div.addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    div.checked = false;
                    div.addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    document.querySelector(".iGlassTheme").style.display = "none";
                    document.querySelector(".iGlassCopy").style.display = "none";
                    document.querySelector(".SignalFormat").style.display = "none";
                    document.querySelector(".SignalShortcut").style.display = "none";
                    break;
                }
            case "iGlassThemeEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#iglassthemetoggle").checked = true;
                    document.querySelector("#iglassthemetoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else if (Object.values(settingObject)[i] == "Disabled") {
                    document.querySelector("#iglassthemetoggle").checked = false;
                    document.querySelector("#iglassthemetoggle").disabled = true;
                }
                else {
                    document.querySelector("#iglassthemetoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
            case "iGlassCopyToggle":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#iglasscopytoggle").checked = true;
                    document.querySelector("#iglasscopytoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else if (Object.values(settingObject)[i] == "Disabled") {
                    document.querySelector("#iglasscopytoggle").checked = false;
                    document.querySelector("#iglasscopytoggle").disabled = true;
                }
                else {
                    document.querySelector("#iglasscopytoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    document.querySelector(".SignalFormat").style.display = "none";
                    document.querySelector(".SignalShortcut").style.display = "none";
                    break;
                }
            case "iGlassSignalFormat":
                if (Object.values(settingObject)[i] == "Disabled") {
                    document.querySelector("#signalformat").value = "Disabled";
                    document.querySelector("#signalformat").disabled = true;
                }
                else {
                    document.querySelector("#signalformat").value = Object.values(settingObject)[i];
                    document.querySelector("#signalformat").addEventListener("input", function () {
                        chrome.storage.sync.set({ "iGlassSignalFormat": getSignalFormat() }, function () { });
                    });
                }
                break;
            case "iGlassSignalCopyShortcut":
                var kbdShortcut = "";
                for (n = 0; n < Object.values(settingObject)[i].length; n++) {
                    if (n < Object.values(settingObject)[i].length - 1) {
                        kbdShortcut += Object.values(settingObject)[i][n] + " + ";
                    }
                    else {
                        kbdShortcut += Object.values(settingObject)[i][n];
                    }
                }
                document.querySelector("#signalcopyshortcut").value = kbdShortcut;
                break;
            case "GatewayEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#gatewaytoggle").checked = true;
                    document.querySelector("#gatewaytoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#gatewaytoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    document.querySelector(".Login").style.display = "none";
                    break;
                }
            case "AutoLogin":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#autologintoggle").checked = true;
                    document.querySelector("#autologintoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#autologintoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
            case "SummaryEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#summarytoggle").checked = true;
                    document.querySelector("#summarytoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#summarytoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    document.querySelector(".InfoCopy").style.display = "none";
                    document.querySelector(".InfoFormat").style.display = "none";
                    document.querySelector(".InfoShortcut").style.display = "none";
                    break;
                }
            case "CustInfoCopyEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#custinfocopytoggle").checked = true;
                    document.querySelector("#custinfocopytoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#custinfocopytoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    document.querySelector(".InfoFormat").style.display = "none";
                    document.querySelector(".InfoShortcut").style.display = "none";
                    break;
                }
            case "CustInfoCopyFormat":
                document.querySelector("#custinfocopyformat").value = Object.values(settingObject)[i];
                document.querySelector(".CustInfoCopyFormat").addEventListener("input", function () {
                    chrome.storage.sync.set({ "CustInfoCopyFormat": getCustInfoFormat() }, function () { });
                });
                break;
            case "CustInfoCopyShortcut":
                var kbdShortcut = "";
                for (n = 0; n < Object.values(settingObject)[i].length; n++) {
                    if (n < Object.values(settingObject)[i].length - 1) {
                        kbdShortcut += Object.values(settingObject)[i][n] + " + ";
                    }
                    else {
                        kbdShortcut += Object.values(settingObject)[i][n];
                    }
                }
                document.querySelector("#custinfocopyshortcut").value = kbdShortcut;
                break;
            case "TicketEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#tickettoggle").checked = true;
                    document.querySelector("#tickettoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#tickettoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    document.querySelector(".iGlassButton").style.display = "none";
                    document.querySelector(".SummaryButton").style.display = "none";
                    document.querySelector(".RPXButton").style.display = "none";
                    document.querySelector(".OMSButton").style.display = "none";
                    break;
                }
            case "AddiGlassButton":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#iglassbtntoggle").checked = true;
                    document.querySelector("#iglassbtntoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#iglassbtntoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
            case "AddSummaryButton":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#summarybtntoggle").checked = true;
                    document.querySelector("#summarybtntoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#summarybtntoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
            case "AddRPXButton":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#rpxbtntoggle").checked = true;
                    document.querySelector("#rpxbtntoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#rpxbtntoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
            case "AddOMSButton":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#omsbtntoggle").checked = true;
                    document.querySelector("#omsbtntoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#omsbtntoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
            case "VTTEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#vtttoggle").checked = true;
                    document.querySelector("#vtttoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    break;
                }
                else {
                    document.querySelector("#vtttoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    document.querySelector(".CBSort").style.display = "none";
                    document.querySelector(".CBShortcut").style.display = "none";
                    break;
                }
            case "SortByCallbackEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#cbshortcuttoggle").checked = true;
                    document.querySelector("#cbshortcuttoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                }
                else {
                    document.querySelector("#cbshortcuttoggle").addEventListener("click", function () {
                        checkboxClicked(this);
                    }, true);
                    document.querySelector(".CBShortcut").style.display = "none";
                    break;
                }
            case "SortByCallbackShortcut":
                var kbdShortcut = "";
                for (n = 0; n < Object.values(settingObject)[i].length; n++) {
                    if (n < Object.values(settingObject)[i].length - 1) {
                        kbdShortcut += Object.values(settingObject)[i][n] + " + ";
                    }
                    else {
                        kbdShortcut += Object.values(settingObject)[i][n];
                    }
                }
                document.querySelector("#sortbycbshortcut").value = kbdShortcut;
                break;
        }
    }
});

chrome.storage.onChanged.addListener(function (changedItem) {
    switch (Object.keys(changedItem)[0]) {
        case "iGlassEnabled":
            chrome.storage.sync.get("iGlassCopyToggle", function (response) {
                if (changedItem.iGlassEnabled.newValue == "Yes") {
                    if (changedItem.iGlassEnabled.oldValue == "No") {
                        if (Object.values(response)[0] == "Yes") {
                            document.querySelector(".SignalFormat").style.display = "flex";
                            document.querySelector(".SignalShortcut").style.display = "flex";
                        }
                        document.querySelector(".iGlassTheme").style.display = "flex";
                        document.querySelector(".iGlassCopy").style.display = "flex";
                    }
                }
                else {
                    document.querySelector(".iGlassTheme").style.display = "none";
                    document.querySelector(".iGlassCopy").style.display = "none";
                    document.querySelector(".SignalFormat").style.display = "none";
                    document.querySelector(".SignalShortcut").style.display = "none";
                }
            });
            break;
        case "iGlassCopyToggle":
            if (changedItem.iGlassCopyToggle.newValue == "Yes") {
                if (changedItem.iGlassCopyToggle.oldValue == "No") {
                    document.querySelector(".SignalFormat").style.display = "flex";
                    document.querySelector(".SignalShortcut").style.display = "flex";
                }
            }
            else {
                document.querySelector(".SignalFormat").style.display = "none";
                document.querySelector(".SignalShortcut").style.display = "none";
            }
            break;
        case "GatewayEnabled":
            if (changedItem.GatewayEnabled.newValue == "Yes") {
                if (changedItem.GatewayEnabled.oldValue == "No") {
                    document.querySelector(".Login").style.display = "flex";
                }
            }
            else {
                document.querySelector(".Login").style.display = "none";
            }
            break;
        case "SummaryEnabled":
            chrome.storage.sync.get("CustInfoCopyEnabled", function (response) {
                console.log(changedItem.SummaryEnabled.oldValue + " => " + changedItem.SummaryEnabled.newValue)
                if (changedItem.SummaryEnabled.newValue == "Yes") {
                    if (changedItem.SummaryEnabled.oldValue == "No") {
                        console.log(Object.values(response)[0]);
                        if (Object.values(response)[0] == "Yes") {
                            document.querySelector(".InfoFormat").style.display = "flex";
                            document.querySelector(".InfoShortcut").style.display = "flex";
                        }
                        document.querySelector(".InfoCopy").style.display = "flex";
                    }
                }
                else {
                    document.querySelector(".InfoCopy").style.display = "none";
                    document.querySelector(".InfoFormat").style.display = "none";
                    document.querySelector(".InfoShortcut").style.display = "none";
                }
            });
            break;
        case "CustInfoCopyEnabled":
            console.log(changedItem.CustInfoCopyEnabled.oldValue + " => " + changedItem.CustInfoCopyEnabled.newValue);
            if (changedItem.CustInfoCopyEnabled.newValue == "Yes") {
                if (changedItem.CustInfoCopyEnabled.oldValue == "No") {
                    document.querySelector(".InfoFormat").style.display = "flex";
                    document.querySelector(".InfoShortcut").style.display = "flex";
                }
            }
            else {
                document.querySelector(".InfoFormat").style.display = "none";
                document.querySelector(".InfoShortcut").style.display = "none";
            }
            break;
        case "TicketEnabled":
            if (changedItem.TicketEnabled.newValue == "Yes") {
                if (changedItem.TicketEnabled.oldValue == "No") {
                    document.querySelector(".iGlassButton").style.display = "flex";
                    document.querySelector(".SummaryButton").style.display = "flex";
                    document.querySelector(".RPXButton").style.display = "flex";
                    document.querySelector(".OMSButton").style.display = "flex";
                }
            }
            else {
                document.querySelector(".iGlassButton").style.display = "none";
                document.querySelector(".SummaryButton").style.display = "none";
                document.querySelector(".RPXButton").style.display = "none";
                document.querySelector(".OMSButton").style.display = "none";
            }
            break;
        case "VTTEnabled":
            chrome.storage.sync.get("SortByCallbackEnabled", function (response) {
                if (changedItem.VTTEnabled.newValue == "Yes") {
                    if (changedItem.VTTEnabled.oldValue == "No") {
                        if (Object.values(response)[0] == "Yes") {
                            document.querySelector(".CBShortcut").style.display = "flex";
                        }
                        document.querySelector(".CBSort").style.display = "flex";
                    }
                }
                else {
                    document.querySelector(".CBSort").style.display = "none";
                    document.querySelector(".CBShortcut").style.display = "none";
                }
            });
            break;
        case "SortByCallbackEnabled":
            if (changedItem.SortByCallbackEnabled.newValue == "Yes") {
                if (changedItem.SortByCallbackEnabled.oldValue == "No") {
                    document.querySelector(".CBShortcut").style.display = "flex";
                    document.querySelector(".CBShortcut").style.display = "flex";
                }
                console.log("On")
            }
            else {
                document.querySelector(".CBShortcut").style.display = "none";
                console.log("Off")
            }
            break;
    }
});