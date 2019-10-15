chrome.storage.sync.get(["TicketEnabled"], function (value) {
    if (Object.values(value) == "Yes") {
        var tbl = document.getElementById('ticketDetailsView');
        var account = tbl.getElementsByTagName('td')[7];
        var locationNum = account.innerHTML.slice(-6);
        var customerNum = account.innerHTML.slice(0, 6);
        var formNode = document.getElementsByName('form1')[0];
        formNode.insertAdjacentHTML('afterend', '<div id="iGlass"><button type="button" onclick="window.open(`https://noc.iglass.net/jglass/cpe/accountView.htm?account=' + locationNum + '`, `_blank`)">Open in iGlass</button></div>');
        var iGlassNode = document.getElementById('iGlass');
        iGlassNode.insertAdjacentHTML('afterend', '<div id="Summary"><button type="button" onclick="window.open(`http://eusvr70/customersummary/CustomerPage.aspx?Customer=' + customerNum + '&Location=' + locationNum + '`, `_blank`)">Customer Summary</button></div>');
        var summaryNode = document.getElementById('Summary');
        summaryNode.insertAdjacentHTML('afterend', '<div id="RPX"><button type="button" onclick="window.open(`https://www.rpx-momentum.com/RPX/Account/SearchCustomer.aspx?quicksearch=' + locationNum + '`, `_blank`)">RPX Account</button></div>');
        var outageNode = document.getElementById('RPX');
        outageNode.insertAdjacentHTML('afterend', '<div id="OMS"><button type="button" onclick="window.open(`http://eusvr41/CustomerSummaryForms/OutageDetailForm.aspx?Location=' + locationNum + '&Customer=' + customerNum + '&Author=Barack%20Obama`, ``, `toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width=800,height=450,left=40,top=50`)">Submit OMS</button></div>');
    }
    else {
        console.log("Easton Velocity Web Kit: Ticket modifications are disabled.");
    }
});