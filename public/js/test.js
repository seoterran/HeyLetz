
$(function () {
    setIFrameSize();
    $(window).resize(function () {
        setIFrameSize();
    });
});

function setIFrameSize() {
    var parentDivWidth = $(window).width()*.9;//$("#testCallIframe").parent().width();
    var parentDivHeight =$(window).height()*.9; //$("#testCallIframe").parent().height();
    $("#testCallIframe")[0].setAttribute("width", parentDivWidth);
    $("#testCallIframe")[0].setAttribute("height", parentDivHeight);
}
