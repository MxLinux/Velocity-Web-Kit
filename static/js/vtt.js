document.onkeyup = function(e) {
    console.log("Triggered");
    if (e.altKey && e.which == 83) {
        location.href = "javascript:__doPostBack('openTicketsGV','Sort$TickleDate')";
    }
    else {
        console.log("Bad" + e.code);
        void 0;
    }
}