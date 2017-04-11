'use strict';

// https://github.com/trentm/node-bunyan

const bunyan = require('bunyan');

let streams = process.env.NODE_ENV === 'local' ?  {
	stream: process.stdout
} : {
	path: './app.log',
};

const logger = bunyan.createLogger({
	name: 'csci4145',
	streams: [streams]
});

logger.audit = function (controller, req) {
	logger.info({
		route: `${req.route.stack[0].method.toUpperCase()} /${controller}${req.route.path}`,
		userAgent: req.headers['user-agent'],
		body: req.body,
		params: req.params,
		queries: req.query
	})
};

module.exports = logger;