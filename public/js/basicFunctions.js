var url = "http://ec2-54-175-174-220.compute-1.amazonaws.com:8080"

function dispRegister() {
   	document.getElementById('id01').style.display='none';
    document.getElementById('id02').style.display='block';
}

$(function() {
	if (localStorage.getItem("username")) {
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
	    url:    url + "/user/" + username,
	    success: function(data) {

	    	if (password === data.password) {
	    		localStorage.setItem("username", data.name);
		    	localStorage.setItem("files", data.files);
		    	localStorage.setItem("password", data.password);
		    	console.log("success!");
	    		window.location.href = "fileexplorer.html";
	    	}
	    	else {
	    		$("#pwdLabel").html("Password <span class = \"wrong\">(Incorrect Password)</span>");
	    	}
		    	
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
	    url:    url + "/user",
	    data:   {
			"name":username,
			"email":email,
			"password":password
		},
	    success: function(data) {
	    	localStorage.setItem("username", data.name);
	    	localStorage.setItem("files", data.files);
	    	localStorage.setItem("password", data.password);
	    	console.log("success!");
    		window.location.href = "fileexplorer.html";
	   	}   
	});
}


console.log("herp");
