import { faker } from '@faker-js/faker';
import db from '../../../src/models/index.js';
import { ITEM_TYPE } from '../../../src/models/Item.js';

const { Item } = db;

export const vegItem = async(restaurant) => {
  const item = await Item.create({
    restaurant_id: restaurant.id,
    name: faker.food.dish.name.toLowerCase(),
    description: faker.food.description(),
    price: faker.commerce.price(),
    type: ITEM_TYPE.VEG
  });

  return item;
};

export const nonVegItem = async(restaurant) => {
  const item = await Item.create({
    name: faker.food.dish.name.toLowerCase(),
    restaurant_id: restaurant.id,
    description: faker.food.description(),
    price: faker.commerce.price(),
    type: ITEM_TYPE.NON_VEG
  });

  return item;
};