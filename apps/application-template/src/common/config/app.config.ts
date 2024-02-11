export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.APPLICATION_TEMPLATE__PORT) || 80,
  appName: 'Application Template',
  appDescription: 'Application Template',
  appVersion: process.env.APPLICATION_TEMPLATE__VERSION || 'localhost',
  cryptographPasswordSalt: Number(
    process.env.APPLICATION_TEMPLATE__CRYPTOGRAPH_PASSWORD_SALTS,
  ),
});
