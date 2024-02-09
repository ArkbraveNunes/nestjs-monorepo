export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.APPLICATION_EXAMPLE__PORT) || 80,
  appName: 'Application Example',
  appDescription: 'Application Example',
  appVersion: process.env.APPLICATION_EXAMPLE_VERSION || 'localhost',
});
