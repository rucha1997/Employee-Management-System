const express = require('express');
const app = express();
const cors = require('cors');
const port = '8080';
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const logger = require('./config/logger');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', indexRouter);
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
})