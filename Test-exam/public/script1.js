function Open(id){
    window.location = "/starttest?id="+id;
}
$(document).ready(function(){
    $("#search").on('submit', function (e) {
        e.preventDefault();
        let query = $("#searchinp").val();
        $.ajax({
            url: '/search-test-exam',
            type: 'POST',
            data: {query : query},
            dataType: 'JSON',
            success: function(response) {
                $("#cont").empty();
                for(i = 0; i < response.data.length; i++)
                {
                    $("#cont").append(`
                    <div class="ccont">
                        <div class="ccontm" onClick="Open('${response.data[i].Id}')">
                            <img src="/uploads/testexam.jpg" width="100%" height="100%" >
                            </div>
                        <div class="ccontf">
                            <h4>${unescape(response.data[i].Name)}</h4>
                            <p>Made by : ${response.arr[i]}</p>
                        </div>
                    </div>`)
                }
            },
            error: function(xhr, status, error) {
            }
        });
    })
})