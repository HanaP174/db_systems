export class UserAuth {
  username: string = '';
  password: string = '';
}

export class User {
  name: string = '';
  surname: string = '';
  role: string = '';
  birthNumber: string = '';
  address: Address = new Address();
  username: string = '';
  password: string = '';
}

export class Address {
  street: string = '';
  zipcode: string = '';
  city: string = '';
  streetNumber: string = '';
}
