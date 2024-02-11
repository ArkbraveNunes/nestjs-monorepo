export default () => ({
  database: {
    host: process.env.APPLICATION_TEMPLATE__DB_HOST,
    port: process.env.APPLICATION_TEMPLATE__DB_PORT,
    database: process.env.APPLICATION_TEMPLATE__DB_NAME,
    username: process.env.APPLICATION_TEMPLATE__DB_USER,
    password: process.env.APPLICATION_TEMPLATE__DB_PASS,
    type: process.env.APPLICATION_TEMPLATE__DB_TYPE,
  },
});
