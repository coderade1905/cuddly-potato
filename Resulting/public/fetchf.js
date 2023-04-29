let count = 0;
let arr = [[], []];
$(document).ready(function () {
    $.ajax({
        url: '/resstruct',
        type: 'POST',
        data: {tid : getCookie("teach-STID"), Sid : getCookie("teach-sid")},
        dataType: 'JSON',
        success: function(response) {
            for(let i = 0; i < response.data.length; i++)
            {
                arr[0].push(response.data[i].Type);
                arr[1].push(parseInt(response.data[i].Value));
                count += 1;
            }
        },
        error: function(xhr, status, error) {

        }
    });
});