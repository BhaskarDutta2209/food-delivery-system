import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/app.js';
import db from '../../../src/models/index.js';
import { basicCustomer } from '../factories/customers.js';
import { logIn } from '../utils/sessions.js';
import i18n from 'i18n';

const { Customer } = db;

beforeEach(async () => {
  await Customer.truncate({ cascade: true, force: true });
});

describe('Customer Profile', () => {
  describe('Get Profile', () => {
    it('should fail for unauthenticated customers', async() => {
      const response = await request(app).get('/api/customer/profile');
  
      expect(response.status).to.equal(401);
    });

    it('should get profile for authorized customer', async() => {
      const customer = await basicCustomer();
      const accessToken  = await logIn(customer.dataValues.email);

      const response = await request(app)
        .get('/api/customer/profile')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.customer).to.have.property('id');
      expect(response.body.customer).to.have.property('first_name');
      expect(response.body.customer).to.have.property('last_name');
      expect(response.body.customer).to.have.property('email');
    });
  });

  describe('Update Profile', () => {
    it('should fail for unauthorized user', async() => {
      const response = await request(app).put('/api/customer/profile');

      expect(response.status).to.equal(401);
    });
    
    it('should be able to update the first name', async() => {
      const customer = await basicCustomer();
      const accessToken  = await logIn(customer.dataValues.email);

      const response = await request(app)
        .put('/api/customer/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          customer: {
            first_name: 'John'
          }
        });

      expect(response.status).to.equal(204);

      const updatedCustomer = await Customer.findByPk(customer.dataValues.id);
      expect(updatedCustomer.dataValues.first_name).to.equal('john');
    });

    it('should be able to update the password', async() => {
      const customer = await basicCustomer();
      const accessToken  = await logIn(customer.dataValues.email);

      const response = await request(app)
        .put('/api/customer/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          customer: {
            password: 'Password2!'
          }
        });

      expect(response.status).to.equal(204);

      const updatedCustomer = await Customer.findByPk(customer.dataValues.id);

      expect((await updatedCustomer.authenticated('Password2!'))).to.be.true;
    });

    it('should give error if trying to update to an invalid password', async() => {
      const customer = await basicCustomer();
      const accessToken  = await logIn(customer.dataValues.email);

      const response = await request(app)
        .put('/api/customer/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          customer: {
            password: 'password'
          }
        });

      expect(response.status).to.equal(422);
      expect(response.body.errors).to.have.property('customer.password');
      expect(response.body.errors['customer.password']).to.equal(i18n.__('errors.validation.customer.password.invalid'));
    });
  });
});