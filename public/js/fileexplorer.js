var url = "http://ec2-54-175-174-220.compute-1.amazonaws.com:8080"



$(function () {
	$('#logout').append(" (" + localStorage.getItem("username") + ")");
	$('#logout').click(function () {
		localStorage.removeItem("username");
		localStorage.removeItem("files");
		localStorage.removeItem("password");
	});
	$('#fileheader h2').html(localStorage.getItem("username") + "'s Bin");
	var files = localStorage.getItem("files");
	console.log(files);
	if (files) {
		var numFiles = files.length;
		for (var i = 0; i < numFiles; i++) {
			$('#files').append("<div class = \"fileentry\"><ul><li class = \"name\">" + files[i].name + "</li><li class = \"date\">" + files[i].date + "</li><li class = \"size\">" + files[i].size +"</li></ul></div>");
		}

	}
});



function uploadFile() {

	var reader = new FileReader();
	reader.readAsDataURL(($("#Field6"))[0].files[0]);
	reader.onload = loaded;

}

function loaded(evt) {  
    var data = evt.target.result;
    var file = $("#Field6").val();

	$.ajax({
		    type:   "POST",
		    url:    url + "/file/upload",
		    data: {
		    	"data":data,
		    	"filename":file
		    },
		    success: function(data) {
		    	document.getElementById('id02').style.display='none';
		    	//$('#files').append("<div class = \"fileentry\"><ul><li class = \"name\">" + data.name + "</li><li class = \"date\">" + data.date + "</li><li class = \"size\">" + data.size +"</li></ul></div>");
		    	$('#files').append("<div class = \"fileentry\"><ul><li class = \"name\">" + file.substring(12, file.length) + "</li><li class = \"date\"> 12/03/2016</li><li class = \"size\">4.5mb </li></ul></div>");
		   	}   
	});

}

function getFile() {

}
