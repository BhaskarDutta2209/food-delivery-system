import passport from 'passport';
import jwtConfig from '../../config/jwt.js';
import db from '../models/index.js';
// const { User, Admin } = db;
// import { User, Admin } from '../models/index.js';
import redisClient from '../../config/redis.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtConfig.accessToken.secret;
opts.passReqToCallback = true;

passport.use(new JwtStrategy(opts, async (req, jwt_payload, done) => {
  // const accessToken = req.headers.authorization.split(' ')[1];
  // const loggedOutAccessToken = await redisClient.get(accessToken);
  // if (loggedOutAccessToken) return done(null, null);
  // if(jwt_payload.type == 'user'){
  //   if(req.baseUrl.startsWith('/api/admin/')) return done(null, false);
  //   User.findByPk(jwt_payload.id).then( user => {
  //     if(user){
  //       const requestParams = {};
  //       if(
  //         (req.baseUrl == '/api/v1/sessions' && req.route.methods.delete) ||
  //         (req.baseUrl + req.path == '/api/v1/users/update_password' && req.route.methods.post)
  //       ) {
  //         requestParams.accessExpire = jwt_payload.exp;
  //         requestParams.accessToken = accessToken;
  //       }
  //       return done(null, user, requestParams);
  //     }else{
  //       return done(null, null);
  //     }
  //   }).catch( error => {
  //     return done(error, false);
  //   });
  // }else if(jwt_payload.type == 'admin'){
  //   if(!req.baseUrl.startsWith('/api/admin/')) return done(null, false);
  //   Admin.findByPk(jwt_payload.id).then( admin => {
  //     if(admin){
  //       const requestParams = {};
  //       if(req.baseUrl == '/api/admin/v1/sessions' && req.route.methods.delete){
  //         requestParams.accessExpire = jwt_payload.exp;
  //         requestParams.accessToken = accessToken;
  //       }
  //       return done(null, admin, requestParams);
  //     }else{
  //       return done(null, null);
  //     }
  //   }).catch( error => {
  //     return done(error, false);
  //   });
  // }
}));
