$(document).ready(function(){
    $("body").change(function() {
        $('.item').each(function () {
            $(this).css('display', 'none');
        });
    });
});