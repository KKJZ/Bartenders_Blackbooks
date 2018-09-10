const API = "https://bartendersbestfriend.herokuapp.com";

//handle login
function handleLogin () {
	$('form#login').on('submit', function (event) {
		$('div.user_results').html('');
		event.preventDefault();
		let form = $(this);
		let data = {
			userName: form[0][1].value,
			password: form[0][2].value
		};
		$('div.error').html('');
		login(data, loadMainPage)
	});
};
//handle login requests
function login (objData, callback) {
	$.ajax({
	url: `${API}/login`,
	type: 'POST',
	dataType: 'json',
	data: JSON.stringify(objData),
	contentType: "application/json; charset=utf-8",
	success: callback,
	error: loginError
	})

};

function loginError (err) {
	console.log(err.responseText, err.status);
	$('div.error').html(`
		<p style='color: red; text-align: center;'>${err.responseText}</p>`)
};
//handle register button
function handleRegister () {
	$('button.register').on('click', function (event) {
		event.preventDefault();
		$('div.login').addClass('hidden');
		$('div.register').removeClass('hidden');
		$('div.error').html('');
	})
};

function handleBack () {
	$('input.login').on('click', function(event) {
		$('div.login').removeClass('hidden');
		$('div.register').addClass('hidden');
	})
};

function handleRegisterSubmit () {
	$('form#register').on('submit', function (event) {
		event.preventDefault();
		$('div.user_results').html('');	
		let data = $(this);
		let userData = {
			userName: data[0][1].value,
			password: data[0][2].value,
			email: data[0][3].value
		};
		console.log(userData);
		registerUser(userData, loadMainPage);
	})
};
//register the user in the db
function registerUser (data, callback) {
	const options = {
		url: `${API}/users`,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		success: callback,
		error: errorRegister
	};
	$.ajax(options);
};
//on error register
function errorRegister (err) {
	console.log(err.responseText, err.status);
	$('div.error').html(`
		<p style='color: red; text-align: center;'>${err.responseText}</p>`);
};

function loadMainPage (data) {
	console.log(data);
	localStorage.setItem('jwt', data.token);
	localStorage.setItem('userName', data.userName);
	window.location = "./Main/Main.html";
};
//if error diplay in here
function logoutError() {
	let error = localStorage.getItem('error');
	if (!(error === null)){
		$('div.error').html(`
			<p style='color: red; text-align: center;'>${error}`);
	}else {
		console.log('no error');
	};
	localStorage.clear();
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------

//onload
function onload () {
	handleRegister();
	handleLogin();
	handleBack();
	handleRegisterSubmit();
	logoutError();
}
onload();
//------------------------------------------------------------------------------------------------------------------------------