$(window).resize( function() {
  $('nav input').prop('checked', false);
});

$('form').on('blur', 'input, textarea', function(event) {
  event.preventDefault;
  validateField($(this));
});

function validateField(field) {
  if ((field === $('#author')) || (field === $('title'))) {
    individualValidator(field, validator);
  }
  if (field === $('#isbn')) {
  //stuff in here
  }
}

function validatorLength (field, max) {
  if (field.val().length > max) {
    return true;
  }
}


function individualValidator(field, validator) {
  if (field.val().length === 0) {
    field.sibling('label').children('.form-empty-message').show();
  }
  else if (validator) {
    field.sibling('label').children('.form-error-message').show();
  }
}