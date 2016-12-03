$(function () {
	console.log("testestest")
	$('#logout').append(" (" + localStorage.getItem("user").name + ")");
	$('#logout').click(function () {
		localStorage.removeItem("user");
	});
});
