'use strict';

const mongoService = require('./mongoservice');

// https://mongodb.github.io/node-mongodb-native/2.2/api/

/*
User Structure:

{
	studentID: Number
	nickname: String
	images: [String]
}

 */

function getUserCollection() {
	return mongoService.connect().then(function (db) {
		return new Promise(function (resolve, reject) {
			db.collection('users', function (err, userCollection) {
				if (err) {
					return reject(err);
				}
				resolve(userCollection);
			});
		});
	});
}

module.exports = {
	getAllUsers: function () {
		return getUserCollection().then(function (userCollection) {
			return userCollection.find().toArray();
		});
	},

	getUser: function (studentID) {
		return getUserCollection().then(function (userCollection) {
			return userCollection.find({
				studentID
			}).limit(1).toArray().then(function (arr) {
				return arr[0];
			});
		});
	},

	insertUser: function (studentID) {
		const user = {
			studentID,
			nickname: '',
			images: []
		};

		return getUserCollection().then(function (userCollection) {
			return userCollection.insertOne(user);
		});
	},

	deleteUser: function (studentID) {
		return getUserCollection().then(function (userCollection) {
			return userCollection.findOneAndDelete({
				studentID
			});
		});
	},

	addImageToUser: function (studentID, imageID) {
		return getUserCollection().then(function (userCollection) {
			return userCollection.findOneAndUpdate({
				studentID
			}, {
				$push: {
					images: imageID
				}
			})
		});
	}
};