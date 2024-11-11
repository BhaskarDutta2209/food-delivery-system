import { faker } from "@faker-js/faker";
import db from "../../../src/models/index.js";

const { Customer } = db;

export const basicCustomer = async() => {
  const customer = await Customer.create({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: 'Password1!',
  });

  return customer;
}