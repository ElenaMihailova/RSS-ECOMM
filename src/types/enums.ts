export enum InputUserError {
  LettersError = 'This field must not contain special characters or numbers',
  AgeError = 'Please enter your date of birth in the format: DD.MM.YYYY',
  DateSyntaxError = 'You should enter only numbers and dots',
  DataError = 'Invalid',
  DateFormatError = 'The date does not match the required format. Too many characters',
  PasswordError = 'Password must be at least 8 characters long, must contain at least one uppercase letter, must contain at least one lowercase letter, must contain at least one digit, must not contain leading or trailing whitespace',
  PostalCodeError = 'Postal code must have numeric characters only',
  EmailError = 'Incorrect email address!',
  BirthdayError = 'Please enter your date of birth in the format: DD.MM.YYYY',
  PasswordLengthError = 'Must contain at least 8 characters',
  FieldError = 'Please, fill out this field',
  CountryError = 'Please, select your country',
}

export enum FieldNames {
  Name = 'name',
  Surname = 'surname',
  City = 'city',
  Age = 'age',
  Email = 'email',
  LoginPassword = 'login-password',
  LoginEmail = 'login-email',
  PostaCode = 'postal-code',
  Password = 'password',
}
