function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}
// cookie val
function validate(type)
{
    var datat;
    if (type == "school")
    {
        datat = {email : getCookie("school-email"), pass : getCookie("school-pass"), type : type};
    }
    if (type == "student")
    {
        datat = {pn : getCookie("phonenumber"), pass : getCookie("pass"), type : type, sid : getCookie("sid")};
    }
    if (type == "teacher")
    {
        datat = {pn : getCookie("teach-phonenumber"), pass : getCookie("teach-pass"), type : type, sid : getCookie("teach-sid")};
    }
    $.ajax(
        {
            url : "/cookie-validate",
            type : "POST",
            dataType : "JSON",
            data : datat,
            success : function(response)
            {
                if (response.status == 400)
                {
                    window.location.href = response.red;
                }
                return response;
            },
            error : function(response)
            {
                console.error(response);
            }
        }
    );
}