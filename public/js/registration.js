$(document).ready(function() {
	$('#reg-form input').on('change', function(evt) {
		if($(evt.currentTarget).hasClass('form-error')) {
			$(evt.currentTarget).removeClass('form-error')
		}
	});
	$('#reg-form').on('submit', function(evt) {
		var form = $('#reg-form'),
			name = form.find('input[name="name"]').val(),
			email = form.find('input[name="email"]').val(),
			password = form.find('input[name="password"]').val(),
			repeatPassword = form.find('input[name="cnfpassword"]').val();

		if(!name) {
			form.find('input[name="name"]').addClass('form-error');
			evt.preventDefault();
		}
		if(!email) {
			form.find('input[name="email"]').addClass('form-error');
			evt.preventDefault();
		}
		if(!password) {
			form.find('input[name="password"]').addClass('form-error');
			evt.preventDefault();
		}
		if(password !== repeatPassword) {
			form.find('input[name="cnfpassword"]').addClass('form-error');
			evt.preventDefault();
		}
	});
});