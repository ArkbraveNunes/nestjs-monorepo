export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.APPLICATION_EXAMPLE__PORT) || 80,
  appName: 'Application Example',
  appDescription: 'Application Example',
  appVersion: process.env.APPLICATION_EXAMPLE__VERSION || 'localhost',
  cryptographPasswordSalt: Number(
    process.env.APPLICATION_EXAMPLE__CRYPTOGRAPH_PASSWORD_SALTS,
  ),
});
