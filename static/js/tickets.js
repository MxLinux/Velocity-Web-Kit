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

                toggleLength = toggleList.length();
                for (i = 0; i < toggleLength; i++) {
                    chrome.storage.sync.get([toggleList[i]], function(response) {
                        switch (Object.keys(response)) {
                            case "AddiGlassButton":
                                if (Object.values(response) == "Yes") {
                                    formNode.insertAdjacentHTML('afterend', '<button id="iGlass" onclick="window.open(`https://noc.iglass.net/jglass/cpe/accountView.htm?account=' + locationNum + '`, `_blank`)"> Open in iGlass </button>');
                                    break;
                                }
                                else {
                                    // User disabled
                                    break;
                                }
                            case "AddSummaryButton":
                                if (Object.values(response) == "Yes") {
                                    formNode.insertAdjacentHTML('afterend', '<button id="Summary" onclick="window.open(`http://eusvr70/customersummary/CustomerPage.aspx?Customer=' + customerNum + '&Location=' + locationNum + '`, `_blank`)">Customer Summary</button>');
                                    break;
                                }
                                else {
                                    // User disabled
                                    break;
                                }
                            case "AddRPXButton":
                                if (Object.values(response) == "Yes") {
                                    formNode.insertAdjacentHTML('afterend', '<button id="RPX" onclick="window.open(`https://www.rpx-momentum.com/RPX/Account/SearchCustomer.aspx?quicksearch=' + locationNum + '`, `_blank`)">RPX Account</button>');
                                    break;
                                }
                                else {
                                    // User disabled
                                    // Also need to find a way to account for customer w no phone service
                                    break;
                                }
                            case "AddOMSButton":
                                if (Object.values(response) == "Yes") {
                                    formNode.insertAdjacentHTML('afterend', '<div id="OMS"><button type="button" onclick="window.open(`http://eusvr41/CustomerSummaryForms/OutageDetailForm.aspx?Location=' + locationNum + '&Customer=' + customerNum + '&Author=Barack%20Obama`, ``, `toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=800,height=450,left=40,top=50`)">Submit OMS</button></div>');
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
                }
            });