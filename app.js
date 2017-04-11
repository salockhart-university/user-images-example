'use strict';

const express = require('express');
const app = express();

const imageController = require('./src/controllers/imagecontroller');
const userController = require('./src/controllers/usercontroller');

const bunyan = require('./src/utils/bunyan');

app.use(express.static('public'));
app.use('/image', imageController);
app.use('/user', userController);

app.listen(3000, function () {
	bunyan.info('Listening on port 3000!');
});

