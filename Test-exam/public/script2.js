var d = new Date();
var year = d.getFullYear();
validate("student");
var url = new URL(window.location);
var id = url.searchParams.get("id");
let arar = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
let resp;
var acme;
function evaluatean()
{
    let answers = [];
    for (i = 0; i < resp.data.length; i++)
    {
        console.log(resp.data[i]);
        if (resp.data[i].Type == 'tf' || resp.data[i].Type == 'ch')
        {
           
            answers[i] = $("input[name='ans"+i+"']:checked").val();
        }
        else{
            answers[i] = $("#ans"+i).val();
        }
    }
        $("#div1").empty();
        $("#Modal").css('display', 'block');
        $("#div1").append('<h2>Evaluating your result</h2>');
        $.ajax({
            url: '/evaluate',
            type: 'POST',
            data: {id : id, answers : answers},
            dataType: 'JSON',
            success: function(response) {
                acme = response;
                let color = ["rgba(0, 255, 0, 0.6)", "rgba(255, 0, 0, 0.6)"];
                for (let i = 0; i < response.isr.length; i++)
                {
                    $("#quest"+i).css('background-color', color[response.isr[i]]);
                }
                $("#Modal").css('display', 'block');
                $("#div1").empty();
                $("#div1").append('<p>Result : '+response.count +' / '+ response.datal+"</p><br><br>");
                $("#div1").append('<p>Explanation : '+response.txtresp+"</p><br><br>");
                $("#div1").append('<p>Sources : </p><br>');
                for (let i = 0; i < response.sources.length; i++)
                {
                    $("#div1").append('<a href="'+ response.sources[i]["seeMoreUrl"] +'">'+response.sources[i]["providerDisplayName"]+"</a><br>");;
                }
            },
            error: function(xhr, status, error) {
            }
        });
}
$(document).ready(
    function () {
        $("#snay").text(getCookie("SN") + " "+ year);
        $("#gbfs").text("GO!  " + getCookie("FN") + " GO! THIS SHOULD BE EASY!");
        $("#nav").hide();
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
        $.ajax({
            url: '/fetch-test-exam',
            type: 'POST',
            data: {id : id},
            dataType: 'JSON',
            success: function(response) {
                for (let i = 0; i < response.data.length; i++)
                {
                    $("#box").append(`<div class='anscont' id='anscont${i}'><p class='quest-text'>Question ${i+1} : ${response.data[i].Question}</p></div>`)
                    if (response.data[i].Type == 'tf')
                    {
                        $("#box").append(`<div class="addbtnwrap" id="${'quest'+i}"><div><input type="radio"  name="ans${i}" value="True" required=""><span>True</span><br><input type="radio" name="ans${i}" value="False" required=""><span>False</span><br></div></div>`)
                    }
                    else if (response.data[i].Type == 'ch')
                    {
                        let opt = response.data[i].Options.split(",");
                        $("#box").append(`<div class="addbtnwrap" id="${'quest'+i}"><div id='smi${i}'></div></div>'`)
                        for (let j = 0; j < opt.length; j++)
                        {
                            $(`#smi${i}`).append(`<span>${arar[j]}</span> , <input type="radio"   name="ans${i}" value="${arar[j]}" required=""><span>${opt[j]}</span><br>`);
                        }
                    }
                    else{
                        $("#box").append(`<div class="addbtnwrap" id="${'quest'+i}"><textarea id="ans${i}" style='width : 294px;height : 149px' type='text' placeholder='Write your answer'></textarea><br></div>`);
                    }
                }
                resp = response;
                $("#box").append(`<div class="addbtnwrap"><button style='width: 180px;' class="ar" type="button" onclick="evaluatean()">Evaluate</button></div>`);
            },
            error: function(xhr, status, error) {
            }
        });
    }
);