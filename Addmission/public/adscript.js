var d = new Date();
var s;
var year = d.getFullYear();
var email = getCookie("school-email");
var num = 0;
var url;
var detail = {};
$("#snay").text(getCookie("SSN") + " "+ year);
function load(ur) {
    url = ur;
    $("#mainn").empty();
    $.ajax({
        url: url,
        type: "POST",
        data: {email : email},
        dataType: 'JSON',
        success: function(response)
        {
            for (var i = 0; i < response.length; i++)
            {
                if (url == "/admission")
                {
                    detail[response[i].detail.Student_id] = response[i].detail;
                $("#mainn").append("<div class='slist'><h4>"+response[i].firstname+"</h4><button class='vd' data-sid='"+response[i].detail.Student_id+"'>View Detail</button><button class='dc' data-sid='"+response[i].detail.Student_id+"'>Decide</button></div>");
                }
                else{
                    detail[response[i].detail.Teacher_id] = response[i].detail;
                    $("#mainn").append("<div class='slist'><h4>"+response[i].firstname+"</h4><button class='vd' data-sid='"+response[i].detail.Teacher_id+"'>View Detail</button><button class='dc' data-sid='"+response[i].detail.Teacher_id+"'>Decide</button></div>");
                }
            }
        }
    })
}
function viewdetail(id)
    { 
        $("#fdec").empty();
        for (const [key, value] of Object.entries(detail[id])) {
            $("#fdec").append("<div class='slist'><h4>"+key+"</h4><h4>"+value+"</h4></div>");
          }
    }
$(document).on('click', '.vd', function() {
    num = $(this).data("sid");
    $("#ti").text("Detail");
    $("#ti").css("border-bottom", "1px #000 solid");
    $("#fdec").css("margin-top", "0px");
    $("#Modal").show();
    $("#fdec").html("");
    viewdetail(num);
    });
$(document).on('click', '.dc', function() {
    num = $(this).data("sid");
    $("#Modal").show();
    $("#fdec").css("margin-top", "80px");
    $("#ti").text("Decision");
    $("#fdec").html("<div style='width: 100%; display: flex; justify-content: space-around;'><button class='dbs' id='acc'>Accept</button><button class='dbs' id='dny'>Deny</button>");
    });
$(document).on('click', '.dbs', function() {
    s = prompt("Enter 1 to confirm!");
    if (s == 1 && $(this).attr("id") == "acc")
    {
        $.ajax({
            url: "/accept",
            type: "POST",
            data: {email : email, sid : num, url : url},
            dataType: 'JSON',
            success: function(response)
            {
                load(url);
            },
            error: function(xhr, status, error) {
                console.log(xhr.text);
            }
        })
    }
    if (s == 1 && $(this).attr("id") == "dny")
    {
        $.ajax({
            url: "/deny",
            type: "POST",
            data: {email : email, sid : num, url : url},
            dataType: 'JSON',
            success: function(response)
            {
                load(url);
            },
            error: function(xhr, status, error) {
                console.log(xhr.text);
            }
        })
    }
    });