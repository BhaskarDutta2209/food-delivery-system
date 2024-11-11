import i18n from 'i18n';
import db from '../../models/index.js';
import ms from 'ms';
import jwtConfig from '../../../config/jwt.js';
import redisClient from '../../../config/redis.js';
import jwt from 'jsonwebtoken';

const { Customer, RefreshToken } = db;

export const signUp = async (req, res, next) => {
  try {
    // Verify no pre-existing account with the same email
    const preExistingCustomer = await Customer.findOne({
      where: { email: req.params.customer.email },
      paranoid: false,
    });
    if(preExistingCustomer) return res.status(403).send({ errors: { email: i18n.__('errors.customer.email_already_exists') } });
    
    // Create the account
    await Customer.create(req.params.customer);

    return res.sendStatus(201);
  } catch(error) {
    next(error);
  }
};

export const signIn = async(req, res, next) => {
  try {
    // Verify the admin account is present and validated
    const customer = await Customer.findOne({
      where: {
        email: req.params.email
      }
    })
    
    if(!customer) return res.status(401).send({ errors: { email: i18n.__('errors.customer.invalid_credentials') } });
    if(!(await customer.authenticated(req.params.password))) return res.status(401).send({ errors: { email: i18n.__('errors.customer.invalid_credentials') } });

    if(!customer.active) return res.status(403).send({ errors: { email: i18n.__('errors.customer.account_disabled') } });
    
    // Generate Refresh Token
    const refreshToken = await customer.generateAndCreateRefreshToken();
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: ms(jwtConfig.refreshToken.options.expiresIn)
    })

    // Generate Access Token
    const accessToken = customer.generateAccessToken();
    await redisClient.set(`customer:${customer.id}:access_token`, accessToken);
    await redisClient.expireAt(
      `customer:${customer.id}:access_token`, 
      parseInt((new Date().getTime() + ms(jwtConfig.accessToken.options.expiresIn)) / 1000)
    );

    return res.status(200).send({ access_token: accessToken });
  } catch(error) {
    next(error);
  }
};

export const refreshAccessToken = async(req, res, next) => {
  try {
    if(!req.cookies.refresh_token) return res.sendStatus(401);
    const refreshToken = req.cookies.refresh_token;
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });

    const customer = await Customer.findWithRefreshToken(refreshToken);
    if(!customer) return res.sendStatus(401);

    if(!customer.active) return res.status(403).send({ errors: { email: i18n.__('errors.customer.account_disabled') } });

    await customer.destroyRefreshToken(refreshToken);

    // Verify the refresh token is still valid. If yes generate new token sets
    jwt.verify(
      refreshToken,
      jwtConfig.refreshToken.secret,
      async (err, decoded) => {
        if(err || customer.id !== decoded.id) return res.sendStatus(401);

        const newRefreshToken = await customer.generateAndCreateRefreshToken();
        res.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          maxAge: ms(jwtConfig.refreshToken.options.expiresIn)
        });

        const accessToken = customer.generateAccessToken();
        await redisClient.set(`customer:${customer.id}:access_token`, accessToken);
        await redisClient.expireAt(
          `customer:${customer.id}:access_token`, 
          parseInt((new Date().getTime() + ms(jwtConfig.accessToken.options.expiresIn)) / 1000)
        );

        return res.status(200).send({ access_token: accessToken });
      }
    )
  } catch(error) {
    next(error);
  }
};

export const signOut = async(req, res, next) => {
  // Mark the concerned access token as logged out and remove the refresh token
  const accessToken = req.headers.authorization.split(' ')[1];
  const expiry = parseInt(
    (new Date().getTime() + ms(jwtConfig.accessToken.options.expiresIn)) / 1000
  );
  await redisClient.set(accessToken, expiry);
  await redisClient.expireAt(accessToken, expiry);
  await redisClient.del('customer:' + req.user.id + ':access_token');

  const refreshToken = req.cookies.refresh_token;
  if(refreshToken) {
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });
    RefreshToken.destroy({ where: { token: refreshToken } });
  }

  return res.sendStatus(204);
};