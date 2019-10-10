document.onkeyup = function(e) {
    if (e.altKey && e.which == 83) {
        __doPostBack('openTicketsGV','Sort$TickleDate')
    }
    else {
        void 0;
    }
}