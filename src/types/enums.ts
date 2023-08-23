export const enum AdressCategories {
  Shipping = 'shipping',
  Billing = 'billing',
}

export const enum Countries {
  Belarus = 'Belarus',
  Spain = 'Spain',
  Netherlands = 'Netherlands',
}

export const enum CountryCodes {
  Belarus = 'BY',
  Spain = 'ES',
  Netherlands = 'NL',
}

export const enum PostalCodes {
  Belarus = 6,
  Spain = 5,
  Netherlands = 4,
}

export enum InputUserError {
  LettersError = 'This field must not contain special characters or numbers',
  AgeError = 'Please enter your date of birth in the format: DD.MM.YYYY',
  DateSyntaxError = 'You should enter only numbers and dots',
  InvalidDataError = 'Invalid data',
  TooManyCharactersError = 'This does not match the required format. Too many characters',
  PasswordError = 'Password must be at least 8 characters long, must contain at least one uppercase letter, must contain at least one lowercase letter, must contain at least one digit, must not contain leading or trailing whitespace',
  PostalCodeError = 'Postal code must have numeric characters only',
  EmailError = 'Incorrect email address! For example: @example.com',
  BirthdayFormatError = 'Please enter your date of birth in the format: DD.MM.YYYY',
  PasswordLengthError = 'Must contain at least 8 characters',
  EmptyFieldError = 'Please, fill out this field',
  CountryError = 'Please, select your country',
}

export enum FieldNames {
  Name = 'name',
  Surname = 'surname',
  Age = 'age',
  Email = 'email',
  LoginPassword = 'login-password',
  LoginEmail = 'login-email',
  Password = 'password',
  Country = 'country',
  City = 'city',
  Street = 'street',
  PostalCode = 'postal-code',
}

export enum CheckboxNames {
  DefaultAdress = 'default-adress',
  UseAsBillingAdress = 'use-as-billing-adress',
}
