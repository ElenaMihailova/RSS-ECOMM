export const enum ProfileDataCategories {
  Personal = 'personal',
  Contact = 'contact',
  Address = 'address',
  Password = 'password',
}

export const enum ProfileFormELementsLabels {
  Name = 'Name:',
  Surname = 'Surname:',
  DateOfBirth = 'Date of birth:',
  Email = 'Email:',
  Country = 'Country:',
  City = 'City:',
  Street = 'Street:',
  PostalCode = 'Postal Code:',
  CurrentPassword = 'Enter your current password',
  NewPassword = 'Enter your new password',
  NewPasswordConfirm = 'Confirm your new password',
}

export const enum Mode {
  Edit = 'edit',
  Create = 'create',
  View = 'view',
}

export const enum ProfileDataContainersTitles {
  Personal = 'Personal data',
  Contact = 'Contact information',
  Password = 'Password',
  SavedAddress = 'Saved address',
  NewAddress = 'Your new address',
}

export const enum ProfileDataBtnsTitles {
  Personal = 'Change personal data',
  SaveAddress = 'Save address',
  Contact = 'Change contact information',
  EditAddress = 'Edit',
  RemoveAddress = 'Remove',
  Password = 'Change password',
}

export const enum ProfileDataBtns {
  Edit = 'edit',
  Remove = 'remove',
  Add = 'add',
  Save = 'save',
}

export const enum AddressCategories {
  Shipping = 'shipping',
  Billing = 'billing',
}

export const enum ProfilePageBtnsTitles {
  Profile = 'Profile',
  Addresses = 'Addresses',
  ChangePassword = 'Change password',
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
  EmailError = 'A correctly formatted email address: example@email.com',
  BirthdayFormatError = 'Please enter your date of birth in the format: DD.MM.YYYY',
  PasswordLengthError = 'Must contain at least 8 characters',
  EmptyFieldError = 'Please fill out this field',
  CountryError = 'Please select your country',
  ConfirmPasswordNoMatch = 'Does not match new password',
  ExistingEmailError = 'There is already an existing customer with the provided email',
}

export enum PopupMessages {
  SuccesfullyRegistered = 'Succesfully registered!',
  EmptyLoginFields = 'Please enter your username and password!',
  AddressSuccesfullyRemoved = 'Address was succesfully removed!',
  AddressSuccesfullyCreated = 'Address was succesfully created!',
  UnmarkedAdressCategory = 'Please mark the category of the address!',
  PersonalDataUpdated = 'Your personal data has been succesfully updated!',
  AddressDataUpdated = 'Your address has been succesfully updated!',
  ContactDataUpdated = 'Your contact information has been succesfully updated!',
  NewPasswordsNoMatch = "New password fields don't match",
  PasswordChanged = 'Your password has been successfully updated',
  ProfileCorrectData = 'Please enter the correct data!',
  SuccesfullyRemovedFromCart = 'Product has been removed from cart',
  SuccesfullyCartEmptied = 'Cart has been emptied',
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

export enum PasswordTypes {
  CurrentPassword = 'current-password',
  NewPassword = 'new-password',
  NewPasswordConfirm = 'new-password-confirm',
}

export enum CheckboxNames {
  DefaultAddress = 'default-address',
  UseAsBillingAddress = 'use-as-billing-address',
}

export enum CheckboxTypes {
  DefaultAddress = 'default-address',
  AddressCategory = 'address-category',
}
