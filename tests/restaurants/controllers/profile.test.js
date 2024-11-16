import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { basicRestaurant } from '../factories/restaurants.js';
import { logIn } from '../utils/sessions.js';
import i18n from 'i18n';
import { faker } from '@faker-js/faker';

const { Restaurant } = db;

beforeEach(async () => {
  await Restaurant.truncate({ cascade: true, force: true });
});

describe('Restaurant Profile', () => {
  describe('Get Profile', () => {
    it('should fail for unauthenticated restaurants', async() => {
      const response = await request(app).get('/api/restaurant/profile');
  
      expect(response.status).to.equal(401);
    });

    it('should get profile for authorized restaurant', async() => {
      const restaurant = await basicRestaurant();
      const accessToken  = await logIn(restaurant.dataValues.email);

      const response = await request(app)
        .get('/api/restaurant/profile')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.restaurant).to.have.property('id');
      expect(response.body.restaurant).to.have.property('name');
      expect(response.body.restaurant).to.have.property('address');
      expect(response.body.restaurant).to.have.property('email');
    });
  });

  describe('Update Profile', () => {
    it('should fail for unauthorized user', async() => {
      const response = await request(app).put('/api/restaurant/profile');

      expect(response.status).to.equal(401);
    });
    
    it('should be able to update the name', async() => {
      const restaurant = await basicRestaurant();
      const accessToken  = await logIn(restaurant.dataValues.email);

      const newName = faker.company.name()
      const response = await request(app)
        .put('/api/restaurant/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          restaurant: {
            name: newName
          }
        });

      expect(response.status).to.equal(204);

      const updatedRestaurant = await Restaurant.findByPk(restaurant.dataValues.id);
      expect(updatedRestaurant.dataValues.name).to.equal(newName);
    });

    it('should be able to update the password', async() => {
      const restaurant = await basicRestaurant();
      const accessToken  = await logIn(restaurant.dataValues.email);

      const response = await request(app)
        .put('/api/restaurant/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          restaurant: {
            password: 'Password2!'
          }
        });

      expect(response.status).to.equal(204);

      const updatedRestaurant = await Restaurant.findByPk(restaurant.dataValues.id);

      expect((await updatedRestaurant.authenticated('Password2!'))).to.be.true;
    });

    it('should give error if trying to update to an invalid password', async() => {
      const restaurant = await basicRestaurant();
      const accessToken  = await logIn(restaurant.dataValues.email);

      const response = await request(app)
        .put('/api/restaurant/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          restaurant: {
            password: 'password'
          }
        });

      expect(response.status).to.equal(422);
      expect(response.body.errors).to.have.property('restaurant.password');
      expect(response.body.errors['restaurant.password']).to.equal(i18n.__('errors.validation.restaurant.password.invalid'));
    });
  });
});