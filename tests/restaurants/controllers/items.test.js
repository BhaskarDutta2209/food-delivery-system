import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/app.js';
import { faker } from '@faker-js/faker';
import db from '../../../src/models/index.js';
import { basicRestaurant } from '../factories/restaurants.js';
import { logIn } from '../utils/sessions.js';
import { ITEM_TYPE } from '../../../src/models/Item.js';
import { toTitleCase } from '../../../src/utils/text-formatting.js';
import { v4 as uuidv4 } from 'uuid';
import { nonVegItem, vegItem } from '../factories/items.js';

const { Restaurant, Item } = db;

before(async() => {
  await Item.truncate({ cascade: true, force: true });
  await Restaurant.truncate({ cascade: true, force: true });
});

describe('Restaurant Items', () => {
  describe('Creating new Items', () => {
    it('only authenticated restaurants can create items', async() => {
      const response = await request(app).post('/api/restaurant/items');

      expect(response.status).to.equal(401);
    });

    it('should pass all the required fields', async() => {
      const restaurant = await basicRestaurant();
      const accessToken = await logIn(restaurant.dataValues.email);

      const response = await request(app)
        .post('/api/restaurant/items')
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.status).to.equal(422);
      expect(response.body).to.have.property('errors');
    });

    it('should create the item', async() => {
      const restaurant = await basicRestaurant();
      const accessToken = await logIn(restaurant.dataValues.email);

      const item = {
        name: faker.food.dish.name,
        description: faker.food.description(),
        price: faker.commerce.price(),
        type: ITEM_TYPE.NON_VEG
      }

      const response = await request(app)
        .post('/api/restaurant/items')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ item });

      expect(response.status).to.equal(201);
      expect(response.body.item.name).to.equal(toTitleCase(item.name));
      expect(response.body.item.description).to.equal(item.description);
      expect(response.body.item.price).to.equal(parseFloat(item.price));
      expect(response.body.item.type).to.equal(item.type);
    });
  });

  describe('Indexing items', () => {
    it('should be called by authenticated restaurants', async() => {
      const response = await request(app).get('/api/restaurant/items');

      expect(response.status).to.equal(401);
    });

    it('should return all the items owned by the restaurant', async() => {
      const restaurant = await basicRestaurant();
      const accessToken = await logIn(restaurant.dataValues.email);

      await vegItem(restaurant);
      await nonVegItem(restaurant);

      const items = await Item.findAll({ where: { restaurant_id: restaurant.id } });

      const response = await request(app)
        .get('/api/restaurant/items')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.items).to.have.lengthOf(items.length);
    });
  });

  describe('Getting item details', () => {
    it('should be called by authenticated restaurants', async() => {
      const response = await request(app).get('/api/restaurant/items/1');

      expect(response.status).to.equal(401);
    });

    it('should return 404 if item is not owned by the restaurant', async() => {
      const restaurant1 = await basicRestaurant();
      const restaurant2 = await basicRestaurant();

      const item = await vegItem(restaurant2);
      const accessToken = await logIn(restaurant1.dataValues.email);

      const response = await request(app)
        .get(`/api/restaurant/items/${item.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).to.equal(404);
    });

    it('should work if item is owned by the restaurant', async() => {
      const restaurant = await basicRestaurant();
      const accessToken = await logIn(restaurant.dataValues.email);

      const item = await vegItem(restaurant);

      const response = await request(app)
        .get(`/api/restaurant/items/${item.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.item.id).to.equal(item.id);
    });

    it('should return the item details', async() => {
      const restaurant = await basicRestaurant();
      const accessToken = await logIn(restaurant.dataValues.email);

      const item = await vegItem(restaurant);

      const response = await request(app)
        .get(`/api/restaurant/items/${item.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.item.id).to.equal(item.id);
      expect(response.body.item.name).to.equal(toTitleCase(item.name));
      expect(response.body.item.description).to.equal(item.description);
      expect(response.body.item.price).to.equal(item.price);
      expect(response.body.item.type).to.equal(item.type);
    });
  });

  describe('Updating item', () => {
    it('only authenticated restaurants can update items', async() => {
      const response = await request(app).put('/api/restaurant/items/1');

      expect(response.status).to.equal(401);
    });
    
    it('the item to be updated should be present', async() => {
      const restaurant = await basicRestaurant();
      const accessToken = await logIn(restaurant.dataValues.email);

      // Generate random uuid
      const response = await request(app)
        .put(`/api/restaurant/items/${uuidv4()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.status).to.equal(404);
    });

    it('restaurant should only be able to update item owned by it', async() => {
      const restaurant1 = await basicRestaurant();
      const restaurant2 = await basicRestaurant();

      const dish = await vegItem(restaurant2);

      const accessToken = await logIn(restaurant1.dataValues.email);

      const response = await request(app)
        .put(`/api/restaurant/items/${dish.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.status).to.equal(404);
    });

    it('should be able to update the item description', async() => {
      const restaurant = await basicRestaurant();
      const accessToken = await logIn(restaurant.dataValues.email);

      const item = await vegItem(restaurant);
      const newDescription = faker.food.description();

      const response = await request(app)
        .put(`/api/restaurant/items/${item.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: {
            description: newDescription
          }
        });
      
        const updatedItem = await Item.findByPk(item.id);

      expect(response.status).to.equal(200);
      expect(updatedItem.description).to.equal(newDescription);
    });

    it('should be able to update item price', async() => {
      const restaurant = await basicRestaurant();
      const accessToken = await logIn(restaurant.dataValues.email);

      const item = await vegItem(restaurant);
      const newPrice = faker.commerce.price();

      const response = await request(app)
        .put(`/api/restaurant/items/${item.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          item: {
            price: newPrice
          }
        });

      const updatedItem = await Item.findByPk(item.id);

      expect(response.status).to.equal(200);
      expect(updatedItem.price).to.equal(parseFloat(newPrice));
    });
  });
});