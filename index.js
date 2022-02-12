const express = require('express');
const app = express();
const cors = require('cors');
const port = '8080';
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const logger = require('./config/logger');
const config = require('./config/db');
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', indexRouter);
mongoose.connect(config.dbUrl, {useNewUrlParser: true});
const conn = mongoose.connection;
conn.on('connected', function() {
    logger.info('Database is connected successfully.');
});
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
})