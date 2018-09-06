//Check/refresh jwt
function checkJWT () {
	let user = localStorage.getItem('userName');
	$.ajax({
		url: `https://bartendersbestfriend.herokuapp.com/login/refresh`,
		type: "POST",
		dataType: "json",
		data: {"userName": + user},
		success: (obj) => localStorage.setItem('jwt', obj.token),
		error: (err) => errorJwt(err),
		beforeSend: function (xhr) {xhr.setRequestHeader("Authorization", 'Bearer '+ localStorage.getItem('jwt'));}
	})
};
//error jwt
function errorJwt(err) {
	if (err.status === 403){
		localStorage.clear();
		localStorage.setItem('error', 'Please Relogin.');
		window.location ="../../login.html";
	}else {
	console.log(err);
	$('div.error').html(`
		<p style='color: red; text-align: center;'>ERROR: code ${err.status}, ${err.responseText}`);
	};
};

checkJWT();