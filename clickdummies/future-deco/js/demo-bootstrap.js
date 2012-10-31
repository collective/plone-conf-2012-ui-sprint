(function($){
    $(document).ready(function(){
        $("#toggle").click(function () {
            if ($("#panel-maincolumn").hasClass("implicit")) {
                $("#panel-maincolumn").removeClass("implicit");
                $(this).attr("value", "Explicit mode (click for implicit)");
            } else {
                $("#panel-maincolumn").addClass("implicit");
                $(this).attr("value", "Implicit mode (click for explicit)");
            }
        });
        var modal = $('#optionsModal').removeClass('hide').modal({
            backdrop: false,
            show: false
        });
        $('.deco-layout').delegate('.deco-info-icon', 'click', function(){
            modal.modal('show');
        });
        $('.modal-footer a').click(function(){
            modal.modal('hide');
        });
    });
})(jQuery);
