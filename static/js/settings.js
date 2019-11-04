chrome.storage.sync.get([
    "iGlassEnabled",
    "iGlassThemeEnabled",
    "iGlassSignalFormat",
    "iGlassCopyToggle",
    "iGlassSignalCopyShortcut",
    "GatewayEnabled",
    "AutoLogin",
    "SummaryEnabled",
    "CustInfoCopyToggle",
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
], function(settingObject) {

    function getCustInfoFormat() {
        return document.querySelector("#custinfocopyformat").value;
    }

    function getSignalFormat() {
        return document.querySelector("#signalformat").value;
    }

    for (i = 0; i < Object.keys(settingObject).length; i++) {
        switch (Object.keys(settingObject)[i]) {
            case "iGlassEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#iglasstoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "iGlassThemeEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("iglassthemetoggle").click();
                    break;
                } else if (Object.values(settingObject)[i] == "Disabled") {
                    document.querySelector("#iglassthemetoggle").checked = false;
                    document.querySelector("#iglassthemetoggle").disabled = true;
                    // TODO: Provide some indicator to the user that this field is disabled/why
                } else {
                    // Add a click listener probably
                    break;
                }
            case "iGlassCopyToggle":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#iglasscopytoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "iGlassSignalFormat":
                document.querySelector("#signalformat").value = Object.values(settingObject)[i];
                document.querySelector("#savesignalformat").addEventListener("click", function() {
                    chrome.storage.sync.set({ "iGlassSignalFormat": getSignalFormat() }, function() {});
                });
                break;
            case "iGlassSignalCopyShortcut":
                var kbdShortcut = "";
                for (n = 0; n < Object.values(settingObject)[i].length; n++) {
                    if (n < Object.values(settingObject)[i].length - 1) {
                        kbdShortcut += Object.values(settingObject)[i][n] + " + ";
                    } else {
                        kbdShortcut += Object.values(settingObject)[i][n];
                    }
                }
                document.querySelector("#signalcopyshortcut").value = kbdShortcut;
                break;
            case "GatewayEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#gatewaytoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "AutoLogin":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#autologintoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "SummaryEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#summarytoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "CustInfoCopyToggle":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#custinfocopytoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "CustInfoCopyFormat":
                document.querySelector("#custinfocopyformat").value = Object.values(settingObject)[i];
                document.querySelector("#saveciformat").addEventListener("click", function() {
                    chrome.storage.sync.set({ "CustInfoCopyFormat": getCustInfoFormat() }, function() {});
                });
                break;
            case "CustInfoCopyShortcut":
                var kbdShortcut = "";
                for (n = 0; n < Object.values(settingObject)[i].length; n++) {
                    if (n < Object.values(settingObject)[i].length - 1) {
                        kbdShortcut += Object.values(settingObject)[i][n] + " + ";
                    } else {
                        kbdShortcut += Object.values(settingObject)[i][n];
                    }
                }
                document.querySelector("#custinfocopyshortcut").value = kbdShortcut;
                break;
            case "TicketEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#tickettoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "AddiGlassButton":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#iglassbtntoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "AddSummaryButton":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#summarybtntoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "AddRPXButton":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#rpxbtntoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "AddOMSButton":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#omsbtntoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "VTTEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#vtttoggle").click();
                    break;
                } else {
                    // Add a click listener probably
                    break;
                }
            case "SortByCallbackEnabled":
                if (Object.values(settingObject)[i] == "Yes") {
                    document.querySelector("#cbshortcuttoggle").click();
                } else {
                    // Add a click listener probably
                    break;
                }
            case "SortByCallbackShortcut":
                var kbdShortcut = "";
                for (n = 0; n < Object.values(settingObject)[i].length; n++) {
                    if (n < Object.values(settingObject)[i].length - 1) {
                        kbdShortcut += Object.values(settingObject)[i][n] + " + ";
                    } else {
                        kbdShortcut += Object.values(settingObject)[i][n];
                    }
                }
                document.querySelector("#sortbycbshortcut").value = kbdShortcut;
                break;
        }
    }
});