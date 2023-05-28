validate("school");
let ch = 0;
let ar = {};
let arr = {};
let arrr = {};
let arrrr = {};
let options = {};
let c = 0;
let lastcho;
let tra = {};
let arar = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
var url = new URL(window.location);
var id = url.searchParams.get("id");
$.ajax({
    url: '/fetch-test-exam',
    type: 'POST',
    data: {id : id},
    dataType: 'JSON',
    success: function(response) {
        for (let i = 0; i < response.data.length; i++)
        {
            ar[i] = response.data[i].Question; 
            arr[i] = response.data[i].Type;
            arrr[i] = response.data[i].Answer;
            if (response.data[i].Options != "NOTCHOOSE")
            {
                let newo = response.data[i].Options.split(",");
                tra[i] = newo.length;
                console.log(response.data[i].Options, i);
                options[i] = newo;
            } 
            $("#justw").append(`
                <div class="swrap2" id="swrap2${i}">
                <div class="wrwr">
                    <button class="ar" id="ar${i}" type="button" onclick="question(${i}, 1)">Question</button>
                </div>
                <div class="wrwr">
                    <button class="ar" id="arr${i}" type="button" onclick="question(${i}, 2)">Question Type</button>
                </div>
                <div class="wrwr">
                    <button class="ar" id="arrr${i}" type="button" onclick="question(${i}, 3)">Answer</button>
                </div>
                <div class="wrwr">
                <button class="ar" id="arrrr${i}" type="button" onclick="removeme(${i})">Remove this question</button>
                </div>
                </div>
            `);
            ch += 1;
        }
    },
    error: function(xhr, status, error) {
    }
});
function removeme(chh)
{
    $("#swrap2"+chh).remove();
    if (ch > 1)
    {
        for (var i = ch; i > chh; i--){
            var j = i-1;
            $(`#ar${i}`).attr("onclick", `question(${j}, 1)`);
            $(`#arr${i}`).attr("onclick", `question(${j}, 2)`);
            $(`#arrr${i}`).attr("onclick", `question(${j}, 3)`);
            $(`#arrrr${i}`).attr("onclick", `removeme(${j})`);
            $(`#ar${i}`).attr("id", `ar${j}`);
            $(`#arr${i}`).attr("id", `arr${j}`);
            $(`#arrr${i}`).attr("id", `arrr${j}`);
            $(`#arrrr${i}`).attr("id", `arrrr${j}`);
            $(`#swrap2${i}`).attr("id", `swrap2${j}`);
        }
    }
    ch -= 1;
}
function question(a, b){
    $("#justadiv").empty();
    $("#optwrap").empty();
    $("#addbtnwrap").empty();
    $("#close").attr("onclick", "closee(event, "+ a + "," + b +")");
    if (b == 1)
    {
        let value = "";
        $("#Modal").show();
        $("#wyq").text("Write your question");
        if (ar[a] !== undefined)
        {
            value = ar[a];
        }
        $("#justadiv").append(`<textarea id='txa${a}' style='width : 294px; z-index: -1; height : 149px' type='text' placeholder='Write your question'>${value}</textarea>`);
    }
    if (b == 2)
    {
        let value = "";
        $("#Modal").show();
        $("#wyq").text("Select question type");
        if (arr[a] !== undefined)
        {
            value = arr[a];
        }
        if (value == "tf")
        {
            $("#justadiv").append(`<input type="radio" class="rad" name="qtype${a}" value="tf" onclick="change(${a}, this)" required="" checked><span>true false</span><br><input type="radio" class="rad" name="qtype${a}" value="ch" onclick="change(${a}, this)" required=""><span>choose</span><br><input type="radio" class="rad" name="qtype${a}" value="sha" onclick="change(${a}, this)" required=""><span>short answer</span><br>`);
        }
        else if (value == "ch")
        {
            $("#justadiv").append(`<input type="radio" class="rad" name="qtype${a}" value="tf" onclick="change(${a}, this)" required=""><span>true false</span><br><input type="radio" class="rad" name="qtype${a}" value="ch" onclick="change(${a}, this)" required="" checked><span>choose</span><br><input type="radio" class="rad" name="qtype${a}" value="sha" onclick="change(${a}, this)" required=""><span>short answer</span><br>`);
            for (let i = 0; i < options[a].length; i++)
            {
                $("#optwrap").append(`<div class="swrap2" id="swrap3${i}">
                    <div class="wrwr2">
                    <input type="text" placeholder="choice ${arar[i]}" value="${options[a][i]}" class="sw2na" id="i-option-text${i}"  required="">
                    </div>
                    <div class="wrwr2">
                    <button class="ar" id="ar-option${i}" type="button" onclick="removeme1(${i}, ${a})">Remove this option</button>
                    </div>
                </div>`);
            }
        }
        else if (value == "sha")
        {
            $("#justadiv").append(`<input type="radio" class="rad" name="qtype${a}" value="tf" onclick="change(${a}, this)" required=""><span>true false</span><br><input type="radio" class="rad" name="qtype${a}" value="ch" onclick="change(${a}, this)" required=""><span>choose</span><br><input type="radio" class="rad" name="qtype${a}" value="sha" onclick="change(${a}, this)" required="" checked><span>short answer</span><br>`);
        }
        else {
            $("#justadiv").append(`<input type="radio" class="rad" name="qtype${a}" value="tf" onclick="change(${a}, this)" required=""><span>true false</span><br><input type="radio" class="rad" name="qtype${a}" value="ch" onclick="change(${a}, this)" required=""><span>choose</span><br><input type="radio" class="rad" name="qtype${a}" value="sha" onclick="change(${a}, this)" required=""><span>short answer</span><br>`);
        }
    }
    if (b == 3)
    {
        if (arr[a] == undefined || arr[a] == "")
        {
            alert('Please select question type first');
        }
        else{
            let value = "";
            $("#Modal").show();
            if (arrr[a] !== undefined || arrr[a] == "")
            {
                value = arrr[a];
                if (arr[a] == "tf")
                {
                    if (value == "True")
                    {
                        $("#justadiv").append(`<input type="radio"  name="qanstf${a}" value="True" required="" checked><span>True</span><br><input type="radio" name="qanstf${a}" value="False" required=""><span>False</span><br>`);
                    }
                    else if (value == "False")
                    {
                        $("#justadiv").append(`<input type="radio"  name="qanstf${a}" value="True" required=""><span>True</span><br><input type="radio" name="qanstf${a}" value="False" required="" checked><span>False</span><br>`)
                    }
                    else{
                        $("#justadiv").append(`<input type="radio"  name="qanstf${a}" value="True" required=""><span>True</span><br><input type="radio" name="qanstf${a}" value="False" required=""><span>False</span><br>`)
                    }
                }
                else if (arr[a] == "ch")
                {
                    for (let i = 0; i < tra[a]; i++)
                    {
                        if (value == arar[i])
                        {
                            $("#justadiv").append(`<input type="radio"  name="qansch${a}" value="${arar[i]}" required="" checked><span>${arar[i]}</span><br>`);
                        }
                        else{
                            $("#justadiv").append(`<input type="radio"  name="qansch${a}" value="${arar[i]}" required=""><span>${arar[i]}</span><br>`);
                        }
                    }
                }
                else
                {
                    $("#justadiv").append(`<textarea id="txaa${a}" style='width : 294px; z-index: -1; height : 149px' type='text' placeholder='Write the answer'>${value}</textarea>`);
                }
            }
            else{
                $("#justadiv").append(lastcho);
            }
        }
    }
}
function closee(e, a, b){
    e.preventDefault();
    $("#Modal").hide();
    if (b == 1)
    {
        ar[a] = $("#txa"+a).val();
    }
    if (b == 2)
    {
        lastcho = "";
        let preopt = [];
        arr[a] = $("input[name='qtype"+a+"']").val();
        let chosen = $("input[name='qtype"+a+"']:checked").val();
        arr[a] = chosen; 
        if (chosen == "tf")
        {
            $("#wyq").text("Choose the answer");
            lastcho = `<input type="radio"  name="qanstf${a}" value="True" required=""><span>True</span><br><input type="radio" name="qanstf${a}" value="False" required=""><span>False</span><br>`
        }
        else if (chosen == "ch")
        {
            $("#wyq").text("Choose an answer");
            for (let i = 0; i < tra[a]; i++)
            {
                preopt.push($("#i-option-text"+i).val());
                lastcho += `<input type="radio"  name="qansch${a}" value="${arar[i]}" required=""><span>${arar[i]}</span><br>`
            }
            options[a] = preopt;
        }
        else {
            $("#wyq").text("Write the answer");
            lastcho = `<textarea id="txaa${a}" style='width : 294px; z-index: -1; height : 149px' type='text' placeholder='Write the answer'></textarea>`
        }
    }
    if (b == 3)
    {
        if (arr[a] == "tf")
        {
            arrr[a] = $("input[name='qanstf"+a+"']:checked").val();
        }
        else if (arr[a] == "ch")
        {
            arrr[a] = $("input[name='qansch"+a+"']:checked").val();
        }
        else {
            arrr[a] = $("#txaa"+a).val();
        }
    }
}
function addfield()
{
    $("#justw").append(`
        <div class="swrap2" id="swrap2${ch}">
        <div class="wrwr">
            <button class="ar" id="ar${ch}" type="button" onclick="question(${ch}, 1)">Question</button>
        </div>
        <div class="wrwr">
            <button class="ar" id="arr${ch}" type="button" onclick="question(${ch}, 2)">Question Type</button>
        </div>
        <div class="wrwr">
            <button class="ar" id="arrr${ch}" type="button" onclick="question(${ch}, 3)">Answer</button>
        </div>
        <div class="wrwr">
        <button class="ar" id="arrrr${ch}" type="button" onclick="removeme(${ch})">Remove this question</button>
        </div>
        </div>
    `);
    ch += 1;
}
function change(a, t) {
    $("#addbtnwrap").empty();
    $("#optwrap").empty();
    if (t.value == "ch")
    {
        tra[a] = 0;
        for (let i = 0; i < 4; i++)
        {
            $("#optwrap").append(` <div class="swrap2" id="swrap3${tra[a]}">
                <div class="wrwr2">
                <input type="text" placeholder="choice ${arar[i]}" class="sw2na" id="i-option-text${i}"  required="">
                </div>
                <div class="wrwr2">
                <button class="ar" id="ar-option${tra[a]}" type="button" onclick="removeme1(${i}, ${a})">Remove this option</button>
                </div>
            </div>`);
            tra[a] += 1;
        }
        $("#addbtnwrap").append(`<div class="addbtnwrap" id="addbtnwrap"><button type="button" class="ar1" onclick="adopt(${a})">Add an option</button></div>  `);
    }
}
function adopt(a)
{
    $("#optwrap").append(` <div class="swrap2" id="swrap3${tra[a]}">
                <div class="wrwr2">
                <input type="text" placeholder="choice ${arar[tra[a]]}" class="sw2na" id="i-option-text${tra[a]}"  required="">
                </div>
                <div class="wrwr2">
                <button class="ar" id="ar-option${tra[a]}" type="button" onclick="removeme1(${tra[a]}, ${a})">Remove this option</button>
                </div>
            </div>`);
    tra[a] += 1;
}
function removeme1(chh, a)
{
    $("#swrap3"+chh).remove();
    if (tra[a] > 1)
    {
        for (var i = tra[a]; i > chh; i--){
            var j = i-1;
            $("#swrap3"+i).attr("id", `swrap3${j}`);
            $(`#i-option-text${i}`).attr("placeholder", `choice ${arar[j]}`);
            $(`#i-option-text${i}`).attr("id", `i-option-text${j}`);
            $(`#ar-option${i}`).attr("onclick", `removeme1(${j}, ${a})`);
            $(`#ar-option${i}`).attr("id", `ar-option${j}`);
        }
    }
    tra[a] -= 1;
}
function submit()
{
    let title = prompt("Please enter title for the test exam");
    $.ajax({
        url: '/make-test-exam',
        type: 'POST',
        data: {ar : ar, arr : arr, arrr : arrr, options, title : title, Sid : getCookie("teach-sid"), id : id},
        dataType: 'JSON',
        success: function(response) {
        
        },
        error: function(xhr, status, error) {
        }
    });
}