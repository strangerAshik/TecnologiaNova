/*jQuery.noConflict();
jQuery(document).ready(function(){
jQuery("#btn").colorbox({ opacity:.5, inline: true, href: "#daEmail" });
});*/
function da_OpenEmail() {
    var dlg = jQuery("#daEmail");
    dlg.dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        width:500,
        overlay: { opacity: 0.2, background: "cyan" }

    });
    dlg.dialog('open');

    dlg.parent().appendTo(jQuery("form:first"));
}

function da_Watermark(id, watermark) 
{
    if ($("#"+id).val() == "") 
    {
        $("#"+id).val(watermark);
    }
    $("#"+id).focus(function() 
    {
        if (this.value == watermark) 
        {
            this.value = ""; 
        }
    })
    .blur(function() 
    {
        if (this.value == "") 
        {
            this.value = watermark; 
        }
    });    
}



$(document).ready(function () {
    var check = window.location.href.toLowerCase();
    if (check.indexOf("/search") != -1 || check.indexOf("/page") != -1 || check.indexOf("/sort") != -1 || check.indexOf("/custom") != -1
        || check.indexOf("/index") != -1) {
        jQuery("#ScrollTop").val(0);
        var element = document.getElementById("clear");
        if( element !=null )
            element.scrollIntoView(true);
    }
});