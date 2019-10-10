document.onkeyup = function(e) {
    if (e.altKey && e.which == 83) {
        location.href = "javascript:__doPostBack('openTicketsGV','Sort$TickleDate')";
    }
    else {
        void 0;
    }
}