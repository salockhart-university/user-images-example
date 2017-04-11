'use strict';

const express = require('express');
const router = express.Router();
const request = require('request');

const cloudinaryService = require('../services/cloudinaryservice');

const bunyan = require('../utils/bunyan');

function auditLog(req) {
	bunyan.audit('image', req);
}

router.get('/:id', function (req, res) {
	auditLog(req);

	cloudinaryService.getImageFromID(req.params.id).then(function (image) {
		request(image.secure_url).pipe(res);	// http://stackoverflow.com/questions/26288055/how-to-send-a-file-from-remote-url-as-a-get-response-in-node-js-express-app
	}).catch(function (err) {
		bunyan.error(err, 'error in get image');
		res.sendStatus(404);
	});
});

module.exports = router;
