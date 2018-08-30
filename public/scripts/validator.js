
// adds event listeners to each input
$('form').on('blur', 'div input[type="text"], div input[type="number"], div textarea', function(event) {
    event.preventDefault();
    validateField($(this));
  });
  
  $('form').on('submit', (event) => {
    event.preventDefault();
    let test = $('form input[type="text"], form input[type="number"], form textarea');
    test.each(value => validateField($(test[value])));
    if ($('.form-error').length) {
      $('.form-submit-error').show();
    } else {
      $('.form-submit-error').hide();
      $.post('/new/submit', )
    }
  });
  
  // universal field checker
  function validateField(field) {
    if ((field.attr('id') === 'author') || (field.attr('id') === 'title')) {
      individualValidator(field, validatorLength(field, 255));
    }
    if (field.attr('id') === 'isbn') {
      individualValidator(field, validatorLength(field, 13));
    }
    if (field.attr('id') === 'image_url') {
      individualValidator(field, validatorLength(field, 255));
      //TODO: run url validator
    }
    if (field.attr('id') === 'book_description') {
      individualValidator(field, validatorLength(field, 6000));
      // TODO: run word count validator
    }
  }
  
  // this runs the individual validator
  function individualValidator(field, validator) {
    field.siblings('label').children('span').hide();
    if (field.val().length === 0) {
      field.addClass('form-error');
      field.siblings('label').children('.form-empty-message').show();
    }
    else if (validator) {
      field.addClass('form-error');
      field.siblings('label').children('.form-error-message').show();
    } else {
      field.removeClass('form-error');
      field.siblings('label').children('span').hide();
    }
  }
  
  //validates length and returns t/f
  function validatorLength (field, max) {
    if (field.val().length > max) {
      return true;
    } else { return false; }
  }