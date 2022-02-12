require('dotenv').config({path: '.env'});
const config = {};
config.dbUrl = process.env.MONGODB_URL;
module.exports = config;