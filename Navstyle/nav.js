$(document).ready(
    function () {
        $("#nav").hide()
        $("#close").click(
            function () 
            {
                $("#nav").hide();
            }
        );
        $("#menu").click(
            function () 
            {
                $("#nav").show();
            }
        );
    }
)