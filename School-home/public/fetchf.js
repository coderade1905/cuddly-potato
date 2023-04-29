var count1 = 0;
var dict1 = {};
var sp = [];
function cho1(cho)
{
    $(document).ready(function () {
        $.ajax({
            url: "/school-req",
            type: 'POST',
            data: {email : getCookie("school-email"), e : "y", type : cho, uid : uid},
            dataType: 'JSON',
            success: function(response)
            {
                for (var i = 0; i < response["data"].length; i++)
                {
                    if (response["data"][i].options != "NOTANOPTION")
                    {
                        sp = response["data"][i].options.split(",");
                        dict1[i] = sp;
                    }
                    var tobeadded = `<div class="swrap2" id="swrap2${i}">
                    <div class="wrwr">
                    <input type="text" placeholder="field name ex: gender" class="sw2na" id="i-text${i}" value="`+response["data"][i].Field_Name+`" required>
                    </div>
                    `+(!["radio", "select"].includes(response["data"][i].Field_Type) ? `<div class="wrwr" id="length${i}"><input type="number" placeholder="Length" class="sw2na" id="i-length${i}" value="${response["data"][i].Length}" required></div>` : `<div class="wrwr1" id="length${i}"></div>` )+`
                    <div class="wrwr">
                    <select id="i-type${i}" class="sw2sel" onchange="selchange(${i})" required>
                        <option disabled selected hidden>Input type</option>
                        <option value="text"`+ (response["data"][i].Field_Type == "text" ? " selected" : "" ) +`>Text</option>
                        <option value="number"`+ (response["data"][i].Field_Type == "number" ? " selected" : "" ) +`>Number</option>
                        <option value="radio"`+ (response["data"][i].Field_Type == "radio" ? " selected" : "" ) +`>Radio</option>
                        <option value="select"`+ (response["data"][i].Field_Type == "select" ? " selected" : "" ) +`>Select</option>
                        <option value="file"`+ (response["data"][i].Field_Type == "file" ? " selected" : "" ) +`>File</option>
                        <option value="email"`+ (response["data"][i].Field_Type == "email" ? " selected" : "" ) +`>Email</option>
                        <option value="image"`+ (response["data"][i].Field_Type == "image" ? " selected" : "" ) +`>Image</option>
                        <option value="password"`+ (response["data"][i].Field_Type == "password" ? " selected" : "" ) +`>Password</option>
                    </select>
                    </div>
                    <div class="wrwr">
                    <button class="ar" id="ar${i}" type="button" onclick="removeme(${i})">Remove this field</button>
                    </div>
                </div>`
                    $("#justw").append(tobeadded);
                    count1 += 1;
                }
            }
        })
    });
}