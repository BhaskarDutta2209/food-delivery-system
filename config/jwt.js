export default { 
  accessToken: {
    secret: process.env.ACCESS_JWT_SECRET,
    options: {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN}
  },
  refreshToken: {
    secret: process.env.REFRESH_JWT_SECRET,
    options: {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN}
  },
};
