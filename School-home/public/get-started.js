var count2 = 0;
var dict = {};
var selected;
function removeme(c)
{
    $(`#ar${c}`).remove();
    $(`#i-text${c}`).remove();
    $(`#i-length${c}`).remove();
    $(`#i-type${c}`).remove();
    $(`#swrap2${c}`).remove();
    if (count1 > 1)
    {
        for (var i = count1; i > c; i--){
            var j = i-1;
            $(`#ar${i}`).attr("onclick", `removeme(${j})`);
            $(`#ar${i}`).attr("id", `ar${j}`);
            $(`#i-text${i}`).attr("id", `i-text${j}`);
            $(`#i-type${i}`).attr("id", `i-type${j}`);
            $(`#i-length${i}`).attr("id", `i-length${j}`);
            $(`#swrap2${i}`).attr("id", `swrap2${j}`);
        }
    }
    count1 -= 1;
};
function removeme1(c)
{
$(`#ar-option${c}`).remove();
$(`#i-option-text${c}`).remove();
$(`#swrap3${c}`).remove();
if (count2 > 1)
{
    for (var i = count2; i > c; i--){
        var j = i-1;
        $(`#ar-option${i}`).attr("onclick", `removeme1(${j})`);
        $(`#ar-option${i}`).attr("id", `ar-option${j}`);
        $(`#i-option-text${i}`).attr("id", `i-option-text${j}`);
        $(`#swrap3${i}`).attr("id", `swrap3${j}`);
    }
}
count2 -= 1;
};
function selchange(sel)
{
    if ($(`#i-type${sel}`).val() == "radio" || $(`#i-type${sel}`).val() == "select" )
    {
        $(`#length${sel}`).empty();
        $(`#length${sel}`).attr('class','wrwr1');
        $("#justadiv").empty();
        selected = sel;
        if (sel in dict1){
            count2 = dict1[sel].length;
            for (var i = 0; i < dict1[sel].length; i++)
            {
                var tobeadded2 = `<div class="swrap2" id="swrap3${i}">
                <div class="wrwr2">
                <input type="text" placeholder="option name ex: male" class="sw2na" id="i-option-text${i}" value="${dict1[sel][i]}" required>
                </div>
                <div class="wrwr2">
                <button class="ar" id="ar-option${i}" type="button" onclick="removeme1(${i})">Remove this option</button>
                </div>
                </div>`
                $("#justadiv").append(tobeadded2);
            }
        }
        $("#Modal").show();
        $("#justadiv").append();
    }
    else{
        $(`#length${sel}`).empty();
        if ($(`#i-type${sel}`).val() !== "file" && $(`#i-type${sel}`).val() !== "image")
        {
            $(`#length${sel}`).append(`<input type="number" placeholder="Length" class="sw2na" id="i-length${sel}" required>`);
            $(`#length${sel}`).attr('class','wrwr');;
        }
        else
        {
            $(`#length${sel}`).attr('class','wrwr1');
        }
    }
}
function cho(cho)
{
    $(document).ready(
        function () {
            $("#Modal").hide();
            $("#length").css('display', 'none');
            $("#form1").submit(
            function(event) {
                event.preventDefault();
                var arr = [];
                for (var k = 0; k < count2; k++){
                    arr.push($(`#i-option-text${k}`).val());
                }
                dict1[selected] = arr;
                console.log(dict1);
                $("#Modal").hide();
            }
            );
            $("#form").submit(
                function (event)
                {
                    event.preventDefault();
                    dict = {}
                    for (var k = 0; k < count1; k++){
                        if ($(`#i-length${k}`).val() == undefined)
                        {
                            arr = dict1[k];
                            dict[k] = {1: $(`#i-text${k}`).val(),2: $(`#i-type${k}`).val(), 3 : arr, ind : 1};
                        }
                        else{
                            dict[k] = {1: $(`#i-text${k}`).val(),2: $(`#i-type${k}`).val(), 3: $(`#i-length${k}`).val(), ind : 0};
                        }
                    }
                    $.ajax({
                        url: "/get-started",
                        type: 'POST',
                        data: {type : "s", otherChoices : dict, pn : getCookie("school-email"), pass : getCookie("school-pass"), type : cho},
                        dataType: 'JSON',
                        success: function(response){
                            if (response.status == 401 || response.status == 200)
                            {
                                window.location.href = response.red;
                            }
                        },
                        error: function(){
                            console.error("Something went wrong!");
                        }
                    })
                }
            );
            $("#addfi").click(
                function (event)
                {
                    event.preventDefault();
                    $("#next").text("Next");
                    var tobeadded = `<div class="swrap2" id="swrap2${count1}">
                    <div class="wrwr">
                    <input type="text" placeholder="field name ex: gender" class="sw2na" id="i-text${count1}" required>
                    </div>
                    <div class="wrwr1" id="length${count1}">
                    </div>
                    <div class="wrwr">
                    <select id="i-type${count1}" class="sw2sel" onchange="selchange(${count1})" required>
                        <option disabled selected hidden>Input type</option>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="radio">Radio</option>
                        <option value="select">Select</option>
                        <option value="file">File</option>
                        <option value="email">Email</option>
                        <option value="image">Image</option>
                        <option value="password">Password</option>
                    </select>
                    </div>
                    <div class="wrwr">
                    <button class="ar" id="ar${count1}" type="button" onclick="removeme(${count1})">Remove this field</button>
                    </div>
                </div>`
                $("#justw").append(tobeadded);
                count1 += 1;
                }
            )
            $("#addopt").click(
                function (event)
                {
                    event.preventDefault();
                    var tobeadded1 = `<div class="swrap2" id="swrap3${count2}">
                    <div class="wrwr2">
                    <input type="text" placeholder="option name ex: male" class="sw2na" id="i-option-text${count2}" required>
                    </div>
                    <div class="wrwr2">
                    <button class="ar" id="ar-option${count2}" type="button" onclick="removeme1(${count2})">Remove this option</button>
                    </div>
                </div>`
                $("#justadiv").append(tobeadded1);
                count2 += 1;
                }
            )
        
        }
    )
}