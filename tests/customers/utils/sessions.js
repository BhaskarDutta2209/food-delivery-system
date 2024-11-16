import request from 'supertest';
import app from '../../../src/app.js';

export const logIn = async (email) => {
  const response = await request(app).post('/api/customer/sessions/sign_in').send({
    email: email,
    password: 'Password1!',
  });

  return response.body.access_token;
};

export const logOut = async (accessToken, refreshToken) => {
  await request(app)
    .delete('/api/restaurants/sessions/sign_out')
    .set('Cookie', [`refresh_token=${refreshToken}`])
    .set('Authorization', 'Bearer ' + accessToken);
};
