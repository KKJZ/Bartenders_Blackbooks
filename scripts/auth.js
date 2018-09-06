//Check/refresh jwt
function checkJWT () {
	console.log("User:", localStorage.getItem('userName'));
	$.ajax({
		url: `https://bartendersbestfriend.herokuapp.com/login/refresh`,
		type: "POST",
		dataType: "json",
		data: {userName: localStorage.getItem('userName')},
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
		<p style='color: red; text-align: center;'>ERROR: code ${err.status},
		<br>${err.responseText}`);
	};
};

checkJWT();