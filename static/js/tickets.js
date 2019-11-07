chrome.storage.sync.get(["TicketEnabled"], function(value) {
            if (Object.values(value) == "Yes") {

                var tbl = document.getElementById('ticketDetailsView');
                var account = tbl.getElementsByTagName('td')[7];
                var locationNum = account.innerHTML.slice(-6);
                var customerNum = account.innerHTML.slice(0, 6);
                var formNode = document.getElementsByName('form1')[0];

                const toggleList = [
                    "AddiGlassButton",
                    "AddSummaryButton",
                    "AddRPXButton",
                    "AddOMSButton"
                ];
                
                // Check for re-open ticket button

                toggleLength = toggleList.length;
                formNode.insertAdjacentHTML('afterend', '<div id="extrabuttons"></div>');
                for (i = 0; i < toggleLength; i++) {
                    chrome.storage.sync.get([toggleList[i]], function(response) {
                        var buttonNode = document.querySelector("#extrabuttons");
                        switch (Object.keys(response)[0]) {
                            case "AddiGlassButton":
                                if (Object.values(response)[0] == "Yes") {
                                    console.log("if");
                                    buttonNode.insertAdjacentHTML('beforeend', '<div id="iGlass"><button onclick="window.open(`https://noc.iglass.net/jglass/cpe/accountView.htm?account=' + locationNum + '`, `_blank`)"> Open in iGlass </button></div>');
                                    chrome.storage.onChanged.addListener(function(response) {
                                        if (Object.values(response)[0].newValue == undefined) {
                                            buttonNode.insertAdjacentHTML('beforeend', '<div id="iGlass"><button onclick="window.open(`https://noc.iglass.net/jglass/cpe/accountView.htm?account=' + locationNum + '`, `_blank`)"> Open in iGlass </button></div>');
                                        }
                                        else {
                                            buttonNode.insertAdjacentHTML('beforeend', '<button onclick="window.open(`https://noc.iglass.net/jglass/cpe/accountView.htm?account=' + locationNum + '`, `_blank`)"> Open in iGlass </button>');
                                        }
                                    });
                                    break;
                                }
                                else {
                                    chrome.storage.onChanged.addListener(function(response) {
                                        console.log("else");
                                        if (Object.values(response)[0].newValue == undefined) {
                                            buttonNode.insertAdjacentHTML('beforeend', '<div id="iGlass"><button onclick="window.open(`https://noc.iglass.net/jglass/cpe/accountView.htm?account=' + locationNum + '`, `_blank`)"> Open in iGlass </button></div>');
                                        }
                                        else {
                                            buttonNode.querySelector("iGlass").innerHTML = "";
                                        }
                                    });
                                    break;
                                }
                            case "AddSummaryButton":
                                if (Object.values(response)[0] == "Yes") {
                                    buttonNode.insertAdjacentHTML('beforeend', '<div id="Summary"><button onclick="window.open(`http://eusvr70/customersummary/CustomerPage.aspx?Customer=' + customerNum + '&Location=' + locationNum + '`, `_blank`)">Customer Summary</button></div>');
                                    break;
                                }
                                else {
                                    // User disabled
                                    break;
                                }
                            case "AddRPXButton":
                                if (Object.values(response)[0] == "Yes") {
                                    buttonNode.insertAdjacentHTML('beforeend', '<div id="RPX"><button onclick="window.open(`https://www.rpx-momentum.com/RPX/Account/SearchCustomer.aspx?quicksearch=' + locationNum + '`, `_blank`)">RPX Account</button></div>');
                                    break;
                                }
                                else {
                                    // User disabled
                                    // Also need to find a way to account for customer w no phone service
                                    break;
                                }
                            case "AddOMSButton":
                                if (Object.values(response)[0] == "Yes") {
                                    buttonNode.insertAdjacentHTML('beforeend', '<div id="OMS"><button onclick="window.open(`http://eusvr41/CustomerSummaryForms/OutageDetailForm.aspx?Location=' + locationNum + '&Customer=' + customerNum + '&Author=Barack%20Obama`, ``, `toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=800,height=450,left=40,top=50`)">Submit OMS</button></div>');
                                    break;
                                }
                                else {
                                    // User disabled
                                    break;
                                }
                        }
                    });
                }
                } else {
                    console.log("Easton Velocity Web Kit: Ticket modifications are disabled.");
                    chrome.storage.onChanged.addListener(function(changes) {
                        console.log(Object.keys(changes));
                        console.log(Object.values(changes)[0].newValue);
                        if (Object.keys(changes) == "iGlassThemeEnabled" && Object.values(changes)[0].newValue == "Yes") {
                            document.documentElement.innerHTML = distributableData;
                            console.log("iGlass Theme Enabled");
                        }
                        else if (Object.keys(changes) == "iGlassThemeEnabled" && Object.values(changes)[0].newValue == "No") {
                            document.documentElement.innerHTML = currentPage;
                            console.log("iGlass Theme Disabled");
                        }
                        else {
                            // Nothing, we don't care.
                        }
                });
                }
            });