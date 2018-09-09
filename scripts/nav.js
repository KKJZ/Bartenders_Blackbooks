//setup user in nav
function navSetup () {
	user = localStorage.getItem('userName');
	$('span.userAccount').html(`<span class='userName'>${user}</span>'s Account`)
};
navSetup();