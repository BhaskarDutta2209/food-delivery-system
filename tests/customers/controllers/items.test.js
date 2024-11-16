import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { itemWithCustomName, nonVegItem, vegItem, vegItem } from '../factories/items.js';
import { basicRestaurant } from '../factories/restaurants.js';

const { Item } = db;

before(async() => {
  await Item.truncate({ cascade: true, force: true });
});

describe('Customer Items', () => {
  describe('Customer browsing items', () => {
    it('should return all items even for not logged in user', async() => {
      const restaurant = await basicRestaurant();

      // Generate random items
      const itemCount = Math.floor(Math.random() * 1000);
      for(let i = 0; i < itemCount; i++) {
        if(i % 2 === 0) await vegItem(restaurant);
        else await nonVegItem(restaurant);
      }

      const response = await request(app).get('/api/customer/items');

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('items');
      expect(response.body.items).to.have.length(itemCount);
    });

    it('should return items based on search query', async() => {
      const restaurant = await basicRestaurant();
      
      await itemWithCustomName(restaurant, 'Biriyani', 200);
      await vegItem(restaurant);

      const response = await request(app).get('/api/customer/items?search=biriyani');

      expect(response.status).to.equal(200);
      expect(response.body.items).to.have.length(1);
      expect(response.body.items[0].name).to.equal('Biriyani');
    });

    it('should return item based on price range filter', async() => {
      const restaurant = await basicRestaurant();

      const item1 = await vegItem(restaurant, 100);
      const item2 = await nonVegItem(restaurant, 200);

      const response = await request(app).get('/api/customer/items?min_price=150');

      expect(response.status).to.equal(200);
      expect(response.body.items).to.have.length(1);
      expect(response.body.items[0].id).to.equal(item2.id);
    });

    it('should return item based on type filter', async() => {
      const restaurant = await basicRestaurant();

      const veg = await vegItem(restaurant);
      await nonVegItem(restaurant);
      await nonVegItem(restaurant);

      const response = await request(app).get('/api/customer/items?onlyVeg=true');

      expect(response.status).to.equal(200);
      expect(response.body.items).to.have.length(1);
      expect(response.body.items[0].id).to.equal(veg.id);
    });

    it('should return data based on two filters', async() => {
      const restaurant = await basicRestaurant();
      const item1 = await vegItem(restaurant, 100)
      const item2 = await nonVegItem(restaurant, 200);

      const response = await request(app).get('/api/customer/items?onlyVeg=true&min_price=150');

      expect(response.status).to.equal(200);
      expect(response.body.items).to.have.length(0);
    });
  });
});