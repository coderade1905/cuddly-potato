$(document).ready(function(){
    $("#ic").click(function() {
        if ($("#pa").attr('type') == 'password')
        {
        $("#pa").attr('type', 'text');
        }
        else {
            $("#pa").attr('type', 'password');
        }
    });
    $("#city-cho").hide();
        $("#school-name").focusout(function() {
            $("#city-cho").mouseup(function ()
            {
                $("#city-cho").hide();
                $("#school-name").css("border-bottom-left-radius", "20px");
                $("#school-name").css("border-bottom-right-radius", "20px");
                $("#school-name").css("border-bottom", "2px solid #777");
            })
        });
    $("#school-name").keyup(function(e){
        $("#school-name").css("border-bottom-left-radius", "0px");
        $("#school-name").css("border-bottom-right-radius", "0px");
        $("#school-name").css("border-bottom", "none");
        $("#city-cho").show();
        $("#city-cho").empty();
        $("#city-cho").append("<p class='stat'>Loading ...</p>");
        let val = $("#school-name").val();
        if (val == "")
        {
            $("#city-cho").hide();
            $("#school-name").css("border-bottom-left-radius", "20px");
            $("#school-name").css("border-bottom-right-radius", "20px");
            $("#school-name").css("border-bottom", "2px solid #777");
        }
        $.ajax({
            url: '/search-school',
            type: 'POST',
            data: {search : val},
            dataType: 'JSON',
            success: function(response) {
                $("#city-cho").empty();
                for(i = 0; i < response.length; i++)
                {
                    $("#city-cho").append(`<button type="button" value="${response[i].school_email}" id="school-b${i}">${response[i].school_name}</button>`);
                    $(`#school-b${i}`).click(
                        function ()
                        {
                            var t = $(this).val();
                            $("#school-name").val(t);
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
    $("#login").submit(function(e) {
      e.preventDefault();
      var PN = $("#Phonenumber").val();
      var Password =  $("#pa").val();
      var Email =  $("#school-name").val();
      var type = $("#type").val();
      $("#strong").empty();
     $.ajax({
        url: '/login',
        type: 'POST',
        data: {PhoneNumber: PN, Pass : Password, Email : Email, type : type},
        dataType: 'JSON',
        success: function(response) {
            if (response.status == 200) {
            var d = new Date();
            d.setTime(d.getTime() + (360*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = "sid=" + response.Sid + ";"  + expires + ";path=/;";
            document.cookie = "STID=" + response.Stid + ";"  + expires + ";path=/;";
            document.cookie = "user=" + response.User + ";"  + expires + ";path=/;";
            document.cookie = "FN=" + response.FN + ";"  + expires + ";path=/;";
            document.cookie = "SN=" + response.SN + ";"  + expires + ";path=/;";
            document.cookie = "phonenumber=" + response.PN + ";"  + expires + ";path=/;";
            document.cookie = "pass=" + response.Pass + ";"  + expires + ";path=/;";
            window.location.href = response.red;
            }
            else {
                $("#strong").append(response.message);
            }
        },
        error: function(xhr, status, error) {
            $("#strong").append(`Something Went Wrong`);
        }
    });
});
});