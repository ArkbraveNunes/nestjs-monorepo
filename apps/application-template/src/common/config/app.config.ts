export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.APPLICATION_TEMPLATE__PORT) || 80,
  appName: 'Application Template',
  appDescription: 'Application Template',
  appVersion: process.env.APPLICATION_TEMPLATE__VERSION || 'localhost',
  cryptographPasswordSalt: Number(
    process.env.APPLICATION_TEMPLATE__CRYPTOGRAPH_PASSWORD_SALTS,
  ),
  accessTokenSecret: process.env.APPLICATION_TEMPLATE__ACCESS_TOKEN_SECRET,
  accessTokenTime: Number(
    process.env.APPLICATION_TEMPLATE__ACCESS_TOKEN_TIME_SECONDS,
  ),
  refreshTokenSecret: process.env.APPLICATION_TEMPLATE__REFRESH_TOKEN_SECRET,
  refreshTokenTime: Number(
    process.env.APPLICATION_TEMPLATE__REFRESH_TOKEN_TIME_SECONDS,
  ),
});
