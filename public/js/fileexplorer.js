$(function () {
	console.log("testestest")
	$('#logout').append(" (" + localStorage.getItem("username") + ")");
	$('#logout').click(function () {
		localStorage.removeItem("username");
	});
});