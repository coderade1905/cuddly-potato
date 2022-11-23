var step = 1;
var fields = [];
var values = [];
var school_id;
$(document).ready(function(){
        var modal = document.getElementById("Modal");

        modal.style.display = "none";


        var span = document.getElementsByClassName("close")[0];


        span.onclick = function() {
        modal.style.display = "none";
        }
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
        $("#ic").click(function() {
            if ($("#pa").attr('type') == 'password')
            {
            $("#pa").attr('type', 'text');
            }
            else {
                $("#pa").attr('type', 'password');
            }
        });
        $("#sign-up").submit(function(e) {
            e.preventDefault();
            $("#sub").text("Next ...");
            $("#strong").text("");
            if (step == 1)
            {
                var email = $("#school-name").val();
                    $.ajax({
                        url: '/school-req',
                        type: 'POST',
                        data: {email : email, e : "n"},
                        dataType: 'JSON',
                        success: function(response)
                        {
                            $("#sub").text("Sign up");
                            $("#wrap").empty();
                            $("#wrap").append('<input type="text" name="FN" class="na mar" placeholder="Full Name" required autocomplete="off" maxlength="20"><br>');
                            $("#wrap").append("<input type='text' name='PhoneNumber' id='PhoneNumber' class='na mar' placeholder='Phone Number e.x (+12124567890)' required autocomplete='off' maxlength='20'><br>");
                            $("#wrap").append('<input type="password" name="Password"  class="pa mar" placeholder="Password" required autocomplete="off"  maxlength="100"><button type="button" class="ic" id="ic"><i class="bi bi-eye"></i></button><br>');
                            $("#wrap").append('<input type="password" name="C-Password"  class="pa mar" placeholder="Confirm Password" required autocomplete="off"  maxlength="100"><button type="button" class="ic" id="icc"><i class="bi bi-eye"></i></button><br></br>');
                            var options;
                            var options1;
                            var max;
                            school_id = response["id"];
                            for (var i = 0; i < response["data"].length; i++)
                            {
                                options = "";
                                options1 = "";
                                fields.push({Name : response["data"][i].Field_Name, Type : response["data"][i].Field_Type});
                                if (response["data"][i].Is_option == 0)
                                {
                                    if (response["data"][i].Field_Type == "number")
                                    {
                                        max = "max";
                                    }
                                    else{
                                        max = "maxlength"
                                    }
                                    $("#wrap").append("<input type='"+response["data"][i].Field_Type+"' autocomplete='off' class='na mar' required "+max+"='"+response["data"][i].Length+"' placeholder='"+response["data"][i].Field_Name+"' name='"+response["data"][i].Field_Name.replace(" ", "_")+"'><br>");
                                }
                                else{
                                    if (response["data"][i].Field_Type == "select")
                                    {
                                        options = response["data"][i].options.split(",");
                                        for (var j = 0; j < options.length; j++)
                                        {
                                            options1 += "<option value='"+options[j]+"'>"+options[j]+"</options>";
                                        }
                                        $("#wrap").append("<select class='na mar' required name='"+response["data"][i].Field_Name.replace(" ", "_")+"'><option selected hidden disabled>"+response["data"][i].Field_Name+"</option>"+options1+"</select><br>");
                                    }
                                    else if (response["data"][i].Field_Type == "radio")
                                    {
                                        options = response["data"][i].options.split(",");
                                        $("#wrap").append("<label for='"+response["data"][i].Field_Name.replace(" ", "_")+"'>"+response["data"][i].Field_Name+" : </label>")
                                        for (var j = 0; j < options.length; j++)
                                        {
                                            if (j == 0)
                                            {
                                                $("#wrap").append("<input type='"+response["data"][i].Field_Type+"' name='"+response["data"][i].Field_Name.replace(" ", "_")+"' value='"+options[j]+"' required><span class='gend'>"+options[j]+"</span>");
                                            }
                                            else{
                                                $("#wrap").append("<input type='"+response["data"][i].Field_Type+"' name='"+response["data"][i].Field_Name.replace(" ", "_")+"' value='"+options[j]+"'><span class='gend'>"+options[j]+"</span>");
                                            }
                                        }
                                        $("#wrap").append("<br>");
                                    }
                                }
                            }
                            step += 1;
                        }
                    })
                    $("#sub").text("Sign up");
            }
            else{
                $("#sub").text("Sign up ...");
                var PN = $("#PhoneNumber").val();
                $.ajax({
                    url: "/send-sms",
                    method : "POST",
                    dataType : "JSON",
                    data : {PN : PN},
                    success: function(response)
                    {
                        if (response.status == 200)
                        {
                            $("#sms-verc").text(response.message);
                            $("#sms-verc1").text(response.message1);
                            $("#Modal").css('display', 'block');
                        }
                        else{
                            $("#strong").css("color", "white");
                            $("#strong").text(response.message);
                        }
                    },
                    error: function(xhr, status, error) {
                        $("#strong").text(`Something Went Wrong Please Check Your Phone Number.`);
                    }
                    });
                    $("#sub").text("Sign up");
            }
    });
    $("#sms-btn").click(
        function () {
            values = [];
            var otp = $("#otp").val();
            for (var i = 0; i < fields.length; i++)
            {
                if (fields[i].Type == "select")
                {
                    values.push($("[name="+fields[i].Name.replace(" ", "_")+"] option:selected").text());
                }
                else
                {
                    values.push($("input[name="+fields[i].Name.replace(" ", "_")+"]").val());
                }
            }
            $.ajax({
                url: "/verify-sms-otp",
                method : "POST",
                dataType : "JSON",
                data : {FN : $("input[name=FN]").val(), phone : $("input[name=PhoneNumber]").val(), Pass : $("input[name=Password]").val(), CPass : $("input[name=C-Password]").val(), otp : otp, fields : fields, values : values, id : school_id},
                success: function(response)
                {
                    if (response.status == 200)
                    {
                        window.location.href = response.red;
                    }
                    else{
                        modal.style.display = "block";
                        $("#strong1").css("color", "red");
                        $("#strong1").text(response.message);
                    }
                },
                error: function(xhr, status, error) {
                    $("#strong1").css("color", "red");
                    $("#strong1").text(`Something Went Wrong Please Check Your Phone Number.`);
                }
                })
        }
    )
    
});