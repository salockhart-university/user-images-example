'use strict';

const cloudinary = require('cloudinary');

module.exports = {
	getAllImages: function () {
		return new Promise(function (resolve, reject) {
			cloudinary.api.resources(function (result) {	// http://cloudinary.com/documentation/admin_api
				if (result.error) {
					reject(result);
				}
				resolve(result.resources);
			});
		});
	},

	getImageFromID: function (id) {
		return new Promise(function (resolve, reject) {
			cloudinary.api.resource(id, function (result) {	// http://cloudinary.com/documentation/admin_api
				if (result.error) {
					reject(result);
				}
				resolve(result);
			});
		});
	},

	deleteImageFromID: function (id) {
		return new Promise(function (resolve, reject) {
			cloudinary.api.delete_resources([id], function (result) {	// http://cloudinary.com/documentation/admin_api
				if (result.deleted[id] === 'not_found') {
					reject(result);
				}
				resolve(result);
			});
		});
	},

	uploadImageFromUrl: function (url) {
		return new Promise(function (resolve, reject) {
			cloudinary.v2.uploader.upload(url, function (error, result) {	// http://cloudinary.com/documentation/node_integration
				if (error) {
					reject(error);
				}
				resolve(result);
			});
		});
	},

	uploadImageFromUpload: function (busboy) {
		return new Promise(function (resolve, reject) {
			const stream = cloudinary.uploader.upload_stream(function(result) {	// http://cloudinary.com/documentation/node_image_upload
				if (result.error) {
					reject(result);
				}
				resolve(result);
			});

			busboy.on('file', function (fieldname, file) {		// https://github.com/mscdex/connect-busboy
				file.pipe(stream);
			});
		});
	}
};
