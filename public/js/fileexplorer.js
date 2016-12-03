$(function () {
	console.log("testestest")
	$('#logout').append(" (" + localStorage.getItem("user").name + ")");
	$('#logout').click(function () {
		localStorage.removeItem("user");
	});
	$('#fileheader').append(localStorage.getItem("user").name + "'s Bin");
	var files = localStorage.getItem("user").files;
	var numFiles = files.length;
	// for (var i = 0; i < numFiles; i++) {
	// 	$('#fileentry').append("
	// 		<ul>
 //                <li class = \"name\">
 //                    " + files[i].name + "
 //                </li>
 //                <li class = \"date\">
 //                    " + files[i].date"
 //                </li>
 //                <li class = \"size\">
 //                    " + files[i].size +"
 //                </li>
 //            </ul>
 //            "
 //        );
	// }
});


