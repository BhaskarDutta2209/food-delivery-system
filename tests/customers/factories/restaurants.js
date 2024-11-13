import { faker } from '@faker-js/faker';
import db from '../../../src/models/index.js';

const { Restaurant } = db;

export const basicRestaurant = async() => {
  const restaurant = await Restaurant.create({
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    email: faker.internet.email().toLowerCase(),
    password: 'Password1!',
  });

  return restaurant;
};