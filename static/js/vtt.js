chrome.storage.sync.get(["TicketEnabled"], function (value) {
    if (Object.values(value) == "Yes") {
        document.onkeyup = function (e) {
            if (e.altKey && e.which == 83) {
                location.href = "javascript:__doPostBack('openTicketsGV','Sort$TickleDate')";
            }
            else {
                void 0;
            }
        }
    }
    else {
        console.log("Easton Velocity Web Kit: VTT modifications are disabled.")
    }
});