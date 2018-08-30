# New book form validation

## Title
- 255 characters

## Author
- 255 characters

## isbn
- 13 characters
- only numbers

## image URL
- 255 characters
- use regex to validate for url

## Description
- 1000 words max (use string.split to test)
- 6000 characters max


## On form field blur:
- if: check if field validates.
- if validates, remove class form-error from field, hide sibling form error message class
- if does not validate, add class form-error to field, show sibling form error message class

## on form submit
- if: checks if all fields validate
- if validates, submit
- else: show message that says to check fields, do not submit.