function dispRegister() {
   	document.getElementById('id01').style.display='none';
    document.getElementById('id02').style.display='block';
}

$(function() {
	if (localStorage.getItem("user")) {
		window.location.href = "fileexplorer.html";
	}

})

$(function() {
	$("#login").submit(function( event ) {
	  	event.preventDefault();
		var formData = $("#login").serializeArray();
		var username = formData[0].value;
		var password = formData[1].value;
		var jsonData = {
							"username":username,
							"password":password
						}
		$.ajax({
	    type:   "GET",
	    url:    "http://localhost:8080/user/" + username,
	    success: function(data) {
	    	localStorage.setItem("user", data);
	    	console.log("success!");
    		window.location.href = "fileexplorer.html";
	   	}   
	});

    // $.ajax({
    //     url: '/helloworld',
    //     type: 'POST',
    //     data: JSON.stringify(jsonData),
    //     dataType: 'json'
    // });
		//JSON.stringify()
	});
});


//Registering function
function register() {
	var username = $("#usernameinput").val();
	var email = $("#emailinput").val();
	var password = $("#passwordinput").val();
	console.log("testing");

	$.ajax({
	    type:   "POST",
	    url:    "http://localhost:8080/user",
	    data:   {
			"name":username,
			"email":email,
			"password":password
		},
	    success: function(data) {
	    	localStorage.setItem("user", data);
	    	console.log("success!");
    		window.location.href = "fileexplorer.html";
	   	}   
	});
}


console.log("herp");
