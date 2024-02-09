export default () => ({
  database: {
    host: process.env.APPLICATION_EXAMPLE__DB_HOST,
    port: process.env.APPLICATION_EXAMPLE__DB_PORT,
    database: process.env.APPLICATION_EXAMPLE__DB_NAME,
    username: process.env.APPLICATION_EXAMPLE__DB_USER,
    password: process.env.APPLICATION_EXAMPLE__DB_PASS,
    type: process.env.APPLICATION_EXAMPLE__DB_TYPE,
  },
});
