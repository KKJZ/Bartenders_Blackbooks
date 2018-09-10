const API = "https://bartendersbestfriend.herokuapp.com";
//make event listener for button.home
function handleHomeButton () {
	$('button.home').on('click', (event) => {
		window.location = '../Main.html';
	});
};

//button logout
function handleLogoutButton() {
	$('button.logout').on('click', (event) => {
		console.log('Pressed logout')
		localStorage.clear();
		window.location = '../../Login.html';
	});
};

//handle form to make a drink
function handleMakeDrink () {
	$('#drink_register').on('submit', function() {
		event.preventDefault();
		console.log(`POSTing drink data`);
		let token = localStorage.getItem('jwt');
		let formData = new FormData($(this)[0]);
		console.log(`MY FORM DATA:${formData}`)
		postDrink(formData, token, renderMadeDrink);
	})
};
//post drink to db
function postDrink(data, jwt, callback) {
	console.log(`JWT: ${jwt}`);
	const options = {
		url: `${API}/drinks`,
		type: 'POST',
		data: data,
		cache: false,
		contentType: false,
		processData: false,
		success: callback,
		error: forPostDrinkFail,
		beforeSend: function (xhr) {xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);}
	}
	$.ajax(options);
};
//post drink fail
function forPostDrinkFail (err) {
	console.log(err);
	$('div.error').html(`
		<p style='color: red; text-align: center;'>${err.responseText}</p>`)
};
//return just made drink from db || lets make a new page for myDrinks
function renderMadeDrink (obj) {
	console.log(obj);
	$('form#drink_register').html('');
	window.location = '../MyDrinks/MyDrinks.html'
};
//----------------------------------------------------------------------------------------------------------------------
//onload
function onload () {
	handleMakeDrink();
	handleHomeButton();
	handleLogoutButton();
}
onload();
//------------------------------------------------------------------------------------------------------------------------------
//features still to add
//favorites
//editting 
//comments