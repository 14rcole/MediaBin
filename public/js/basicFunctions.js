function dispRegister() {
   	document.getElementById('id01').style.display='none';
    document.getElementById('id02').style.display='block';
}

$(function() {
	if (localStorage.getItem("username")) {
		console.log(localStorage.getItem("username"));
		window.location.href = "fileexplorer.html";
	}

})

$(function() {
	$("#login").submit(function( event ) {
		console.log(($(this).attr("id")));
	  	event.preventDefault();
		var formData = $("#login").serializeArray();
		var username = formData[0].value;
		var password = formData[1].value;
		var jsonData = {
							"username":username,
							"password":password
						}
		console.log(jsonData);

    // $.ajax({
    //     url: '/helloworld',
    //     type: 'POST',
    //     data: JSON.stringify(jsonData),
    //     dataType: 'json'
    // });
    localStorage.setItem("username","tjs418");
    window.location.href = "fileexplorer.html";
		//JSON.stringify()
	});
});


//Registering function
function register() {
	var username = $("#usernameinput").val();
	var email = $("#emailinput").val();
	var password = $("#passwordinput").val();
	var jsonData = {
						"username":username,
						"email":email,
						"password":password
					}
	console.log(jsonData);
	console.log("testing");

    $.ajax({
        url: 'http://localhost:8080/user/new',
        type: 'POST',
   		contentType:'application/json',
        data: JSON.stringify(jsonData),
        dataType: 'jsonp',
        success: function(data, status, xhttp) {
        	console.log(data);
        	console.log(status);
        	console.log(xhttp);
        }     
    });
}


console.log("herp");