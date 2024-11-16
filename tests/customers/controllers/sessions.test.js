import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/app.js';
import { faker } from '@faker-js/faker';
import db from '../../../src/models/index.js';
import { basicCustomer } from '../factories/customers.js';
import { logIn } from '../utils/sessions.js';

const { Customer } = db;

beforeEach(async () => {
  await Customer.truncate({ cascade: true, force: true });
});

describe('Customer Sessions', () => {
  describe('Sign Up', () => {
    it('should sign up new customers', async() => {
      const customer = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'Password1!',
      };
  
      const response = await request(app)
        .post('/api/customer/sessions/sign_up')
        .send({customer});
  
      expect(response.status).to.equal(201);
    })
  });

  describe('Sign In', () => {
    it('should sign in an existing customer', async() => {
      const customer = await basicCustomer();
  
      const response = await request(app)
        .post('/api/customer/sessions/sign_in')
        .send({email: customer.dataValues.email, password: 'Password1!'});
  
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('access_token');
    });
  
    it('should throw error for invalid credentials', async() => {
      const response = await request(app)
        .post('/api/customer/sessions/sign_in')
        .send({email: faker.internet.email(), password: faker.internet.password()});
  
      expect(response.status).to.equal(401);
    });
  });

  describe('Sign Out', () => {
    it('should sign out a customer', async() => {
      const customer = await basicCustomer();
      const accessToken = await logIn(customer.dataValues.email);
  
      const response = await request(app)
        .delete('/api/customer/sessions/sign_out')
        .set('Authorization', `Bearer ${accessToken}`);
  
      expect(response.status).to.equal(204);
    });

    it('should throw error for invalid credentials', async() => {
      const response = await request(app)
        .delete('/api/customer/sessions/sign_out')
        .set('Authorization', `Bearer invalid_token`);

      expect(response.status).to.equal(401);
    });
  });
});