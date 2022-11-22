$(document).ready(function(){
            window.onclick = function(event) {
            var cicho = document.getElementById("city-cho");
            if (event.target == modal) {
                modal.style.display = "none";
            }
                cicho.style.display = "none";
                $("#City").css("border-bottom-left-radius", "20px");
                $("#City").css("border-bottom-right-radius", "20px");
                $("#City").css("border-bottom", "2px solid #777");
            }
        $("#city-cho").hide();
        $("#ic").click(function() {
            if ($("#Password").attr('type') == 'password')
            {
            $("#Password").attr('type', 'text');
            }
            else {
                $("#Password").attr('type', 'password');
            }
        });
        $("#icc").click(function() {
            if ($("#C-Password").attr('type') == 'password')
            {
            $("#C-Password").attr('type', 'text');
            }
            else {
                $("#C-Password").attr('type', 'password');
            }
        });
        $("#register").submit(function(e) {
            e.preventDefault();
            var Email =  $("#Emad").val();
            var Sname =  $("#Sname").val();
            var Password =  $("#Password").val();
            var Cpassword =  $("#C-Password").val();
            var City =  $("#City").val();
            $.ajax({
            url: '/send-email',
            type: 'POST',
            dataType: 'JSON',
            data: {to : Email, Sname : Sname, Pass : Password, City: City, CPass : Cpassword},
            success: function(response) {
                if (response.status == 400 || response.status == 401)
                {
                    $("#strong1").text(response.error);
                }
                else
                {
                    if (response.status == 200)
                    {
                        modal.style.display = "block";
                        $("#email-verc").text(response.message);
                        $("#email-verc1").text(response.message1);
                    }
                    else{
                        modal.style.display = "block";
                        $("#strong").text(response.message);
                    }
                }
            },
            error: function(xhr, status, error) {
                $("#strong").text(`Something Went Wrong Please Check Your Email Address.`);
            }
        });
    });
    $("#email-btn").click(function () {
        let otp = $("#otp").val();
        let Email =  $("#Emad").val();
        var Sname =  $("#Sname").val();
        var Password =  $("#Password").val();
        var Cpassword =  $("#C-Password").val();
        var City =  $("#City").val();
        $("#email-btn").text("Verifing ...");
        $.ajax({
            url: '/verify-otp',
            type: 'POST',
            data: {email : Email, otp : otp, Pass : Password, City: City, CPass : Cpassword, Sname : Sname},
            dataType: 'JSON',
            success: function(response) {
                if (response.status == 200) {
                    $("#strong").css("color", "green");
                    $("#strong").text(response.message);
                    $.ajax({
                        url: '/register-school',
                        type: 'POST',
                        data: {Email : Email},
                        dataType: 'JSON',
                        success: function(response) {
                            if (response.status == 200) {
                            window.location.href = response.red;
                            }
                            else {
                            $("#strong").text(response.error);
                            }
                        },
                        error: function(xhr, status, error) {
                            $("#strong").text(`Something Went Wrong`);
                        }
                    });
                }
                else {
                    $("#strong").css("color", "red");
                    $("#strong").text(response.message);
                }
                $("#email-btn").text("Verify sss");
            },
            error: function(xhr, status, error) {
                $("#strong").css("color", "red");
                $("#strong").text("Something went wrong!");
                console.log(xhr, ststus, error);
                $("#email-btn").text("Verify uuu");
            }
        });
    })

    $("#City").keyup(function(e){
        $("#City").css("border-bottom-left-radius", "0px");
        $("#City").css("border-bottom-right-radius", "0px");
        $("#City").css("border-bottom", "none");
        $("#city-cho").show();
        $("#city-cho").empty();
        $("#city-cho").append("<p class='stat'>Loading ...</p>");
        let val = $("#City").val();
        if (val == "")
        {
            $("#city-cho").hide();
            $("#City").css("border-bottom-left-radius", "20px");
            $("#City").css("border-bottom-right-radius", "20px");
            $("#City").css("border-bottom", "2px solid #777");
        }
        $.ajax({
            url: 'https://api.teleport.org/api/cities/',
            type: 'GET',
            data: {search : val},
            dataType: 'JSON',
            success: function(response) {
                $("#city-cho").empty();
                for(i = 0; i < response._embedded["city:search-results"].length; i++)
                {
                    $("#city-cho").append(`<button type="button" value="${response._embedded["city:search-results"][i].matching_full_name}" id="city-b${i}">${response._embedded["city:search-results"][i].matching_full_name}</button>`);
                    $(`#city-b${i}`).click(
                        function ()
                        {
                            var t = $(this).val();
                            $("#City").val(t);
                        }
                    );
                }
            },
            error: function(xhr, status, error) {
                $("#city-cho").empty();
                $("#city-cho").append(`<p class="stat">Something Went Wrong</p>`);
            }
        });
        });
});