'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');

const userService = require('../services/userservice');
const cloudinaryService = require('../services/cloudinaryservice');

const bunyan = require('../utils/bunyan');

router.use(bodyParser.json());

router.use(busboy({immediate: true}));		// https://github.com/mscdex/connect-busboy

function auditLog(req) {
	bunyan.audit('user', req);
}

router.get('/', function (req, res) {
	auditLog(req);

	userService.getAllUsers().then(function (users) {
		res.status(200).send(users);
	}).catch(function (err) {
		bunyan.error(err, 'error in get users');
		res.sendStatus(500);
	});
});

router.post('/', function (req, res) {
	auditLog(req);

	if (!req.body.studentID) {
		return res.status(400).send('Bad Request studentID is required');
	}

	req.body.studentID = parseInt(req.body.studentID);

	if (isNaN(req.body.studentID) || req.body.studentID > 999 || req.body.studentID < 100) {
		return res.status(400).send('Bad Request studentID must be 3 decimal digits');
	}

	userService.insertUser(req.body.studentID).then(function () {
		return userService.getUser(req.body.studentID);
	}).then(function (user) {
		res.status(200).send(user);
	}).catch(function (err) {
		if (err.code === 11000) {
			return res.status(400).send('Bad Request studentID already in use');
		}
		bunyan.error(err, 'error in insert user');
		res.sendStatus(500);
	});
});

router.get('/:studentID', function (req, res) {
	auditLog(req);

	req.params.studentID = parseInt(req.params.studentID);

	if (isNaN(req.params.studentID)) {
		return res.status(400).send('Bad Request studentID must be 3 decimal digits');
	}

	userService.getUser(req.params.studentID).then(function (user) {
		if (!user) {
			return res.status(400).send('Bad Request user does not exist');
		}
		res.status(200).send(user);
	}).catch(function (err) {
		bunyan.error(err, 'error in get user');
		res.sendStatus(500);
	});
});

router.delete('/:studentID', function (req, res) {
	auditLog(req);

	req.params.studentID = parseInt(req.params.studentID);

	if (isNaN(req.params.studentID)) {
		return res.status(400).send('Bad Request studentID must be 3 decimal digits');
	}

	userService.deleteUser(req.params.studentID).then(function () {
		res.sendStatus(200);
	}).catch(function (err) {
		bunyan.error(err, 'error in delete user');
		res.sendStatus(500);
	});
});

router.post('/:studentID/image', function (req, res) {
	auditLog(req);

	req.params.studentID = parseInt(req.params.studentID);

	if (isNaN(req.params.studentID)) {
		return res.status(400).send('Bad Request studentID must be 3 decimal digits');
	}

	let promise;

	if (req.query.url) {
		promise = cloudinaryService.uploadImageFromUrl(req.query.url);
	} else {
		promise = cloudinaryService.uploadImageFromUpload(req.busboy);
	}

	promise.then(function (result) {
		return userService.addImageToUser(req.params.studentID, result.public_id);
	}).then(function () {
		res.sendStatus(200);
	}).catch(function (err) {
		if (err.error) {
			err = err.error;
		}
		if (err.http_code && err.http_code >= 400) {
			return res.status(400).send('Bad Request invalid URL or file');
		}
		bunyan.error(err, 'error in upload image');
		res.sendStatus(500);
	});
});

module.exports = router;
