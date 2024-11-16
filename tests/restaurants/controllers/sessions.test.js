import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/app.js';
import { faker } from '@faker-js/faker';
import db from '../../../src/models/index.js';
import { basicRestaurant } from '../factories/restaurants.js';
import { logIn } from '../utils/sessions.js';

const { Restaurant } = db;

beforeEach(async () => {
  await Restaurant.truncate({ cascade: true, force: true });
});

describe('Restaurant Sessions', () => {
  describe('Sign Up', () => {
    it('should sign up new restaurants', async() => {
      const restaurant = {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        email: faker.internet.email(),
        password: 'Password1!',
      };
  
      const response = await request(app)
        .post('/api/restaurant/sessions/sign_up')
        .send({restaurant});
  
      expect(response.status).to.equal(201);
    })
  });

  describe('Sign In', () => {
    it('should sign in an existing restaurant', async() => {
      const restaurant = await basicRestaurant();
  
      const response = await request(app)
        .post('/api/restaurant/sessions/sign_in')
        .send({email: restaurant.dataValues.email, password: 'Password1!'});
  
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('access_token');
    });
  
    it('should throw error for invalid credentials', async() => {
      const response = await request(app)
        .post('/api/restaurant/sessions/sign_in')
        .send({email: faker.internet.email(), password: faker.internet.password()});
  
      expect(response.status).to.equal(401);
    });
  });

  describe('Sign Out', () => {
    it('should sign out a restaurant', async() => {
      const restaurant = await basicRestaurant();
      const accessToken = await logIn(restaurant.dataValues.email);
  
      const response = await request(app)
        .delete('/api/restaurant/sessions/sign_out')
        .set('Authorization', `Bearer ${accessToken}`);
  
      expect(response.status).to.equal(204);
    });

    it('should throw error for invalid credentials', async() => {
      const response = await request(app)
        .delete('/api/restaurant/sessions/sign_out')
        .set('Authorization', `Bearer invalid_token`);

      expect(response.status).to.equal(401);
    });
  });
});