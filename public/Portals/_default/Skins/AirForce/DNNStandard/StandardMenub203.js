(function ($) {
    $(document).ready(function () {

        function HoverOver() { $(this).addClass('hover'); }
        function HoverOut() { $(this).removeClass('hover'); }

        var config = {
            sensitivity: 2,
            interval: 5,
            over: HoverOver,
            timeout: 5,
            out: HoverOut
        };

        if ($.browser.msie && parseInt($.browser.version) == 7) {
            $("#dnnMenu li.haschild").hoverIntent(config);
        }
        else {
            $("#dnnMenu .topLevel > li.haschild").hoverIntent(config);
            $(".subLevel li.haschild").hover(HoverOver, HoverOut);
        }
    });
}(jQuery));