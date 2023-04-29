$(document).ready(
    function() {
        $("#vs").click(
            function ()
            {
                var modal = document.getElementById("Modal");
                modal.style.display = "block";
                $.ajax({
                    url: '/total-result',
                    type: 'POST',
                    data: {id : getCookie("STID"), Sid : getCookie("sid")},
                    dataType: 'JSON',
                    success: function(response) {
                        $("#modal-main").empty();
                        $("#modal-main").append(`<div class="main-main" id="main-main" style="background-color: #444;"><p style="color: #fff;">Subject</p><p style='border-left: 1px solid #fff; border-right: 1px solid #fff; color: #fff;'>Exam Type</p><p style="color: #fff;">Value</p></div>`);
                        for (let i = 0; i < response.data.length; i++)
                        {
                            $("#modal-main").append(`<div class="main-main" id="main-main"><p>${response.data[i][0]}</p><p style='border-left: 1px solid #000; border-right: 1px solid #000;'>${response.data[i][1]}</p><p>${response.data[i][2]}</p></div>`);   
                        }
                    },
                    error: function(xhr, status, error) {
                        
                    }
                })
            }
        )
        $("#vs1").click(
            function ()
            {
                $("#modal-main").empty();
                $("#modal-main").append(`<div class="main-main" id="main-main" style="background-color: #444;"><p style="color: #fff;">Subject</p><p style='border-left: 1px solid #fff; border-right: 1px solid #fff; color: #fff;'>Rank</p><p style="color: #fff;">Your Avarage - Class's Avarage</p></div>`);
                var modal = document.getElementById("Modal");
                modal.style.display = "block";
                $.ajax({
                    url: '/ranking',
                    type: 'POST',
                    data: {id : getCookie("STID"), Sid : getCookie("sid")},
                    dataType: 'JSON',
                    success: function(response) {
                        for (let i = 0; i < response.data.length; i++)
                        {
                            $("#modal-main").append(`<div class="main-main" id="main-main"><p>${response.data[i][1]}</p><p style='border-left: 1px solid #000; border-right: 1px solid #000;'>${response.data[i][0]}</p><p style="color : ${(response.data[i][2]-response.data[i][3] >= 0 ? "rgb(0, 143, 0)" : "rgb(143, 0, 0)")} ">${response.data[i][2]-response.data[i][3]}</p></div>`);
                        }
                    },
                    error: function(xhr, status, error) {
                        
                    }
                })
            }
        )
    }
)
