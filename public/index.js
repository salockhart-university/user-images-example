'use strict';

function getUserList(studentID, success, error) {
	if (typeof studentID === "function") {
		success = studentID;
		studentID = undefined;
	}

	$.ajax({
		type: 'GET',
		url: studentID ? '/user/' + studentID : '/user',
		success,
		error
	});
}

function insertUser(studentID, success, error) {
	$.ajax({
		type: 'POST',
		url: '/user',
		data: JSON.stringify({
			studentID
		}),
		contentType: 'application/json',
		success,
		error
	});
}

function uploadRemoteFile(studentID, url, success, error) {
	$.ajax({
		type: 'POST',
		url: '/user/' + studentID + '/image?url=' + url,
		success,
		error
	});
}

function uploadLocalFile(studentID, file, success, error) {
	const data = new FormData();	// http://stackoverflow.com/questions/5392344/sending-multipart-formdata-with-jquery-ajax
	data.append('file', file);

	$.ajax({
		type: 'POST',
		url: '/user/' + studentID + '/image',
		data: data,
		contentType: false,
		success,
		error,
		cache: false,
		processData: false
	});
}

function deleteUser(studentID, success, error) {
	$.ajax({
		type: 'DELETE',
		url: '/user/' + studentID,
		success,
		error
	});
}

function userListToHTML(users, callback) {
	if (!Array.isArray(users)) {
		users = [users];
	}
	const html = users.map(function (user) {
		const li = $("<div>", {
			class: 'user-list-item'
		});

		li.append($("<p>Student ID: " + user.studentID + "</p>"));
		li.append($("<p>Student Nickname: " + user.nickname + "</p>"));

		li.append($("<p>Student Photos:</p>"));

		for (let i = 0; i < user.images.length; i++) {
			li.append($("<img>", {
				class: 'user-list-item-image',
				src: '/image/' + user.images[i]
			}));
		}

		return li;
	});
	callback(html);
}

function listAllUsers() {
	getUserList(function (users) {
		userListToHTML(users, function (html) {
			$('#user-list').html(html);
		});
	});
}

function registerCreateUser() {
	$('#create-user-form').submit(function (event) {
		$('#create-user-error').html('');
		event.preventDefault();
		const studentID = $('#create-user-id').val();
		insertUser(studentID, function () {
			listAllUsers();
		}, function (response) {
			if (response.status === 400) {
				$('#create-user-error').html('Error: Student ID must be unique and 3 decimal digits');
			} else {
				$('#create-user-error').html('Error: Internal Server Error');
			}
		});
	});
}

function registerInsertRemoteImage() {
	$('#insert-remote-image-form').submit(function (event) {
		$('#insert-remote-image-error').html('');
		event.preventDefault();
		const studentID = $('#insert-remote-image-id').val();
		const url = $('#insert-remote-image-url').val();
		uploadRemoteFile(studentID, url, function () {
			listAllUsers();
		}, function (response) {
			if (response.status >= 400) {
				$('#insert-remote-image-error').html('Error: Invalid URL');
			} else {
				$('#insert-remote-image-error').html('Error: Internal Server Error');
			}
		});
	});

}

function registerInsertLocalImage() {
	$('#insert-local-image-form').submit(function (event) {
		$('#insert-local-image-error').html('');
		event.preventDefault();
		const studentID = $('#insert-local-image-id').val();
		const image = $('#insert-local-image-file')[0].files[0];
		uploadLocalFile(studentID, image, function () {
			listAllUsers();
		}, function (response) {
			if (response.status >= 400) {
				$('#insert-local-image-error').html('Error: Invalid File');
			} else {
				$('#insert-local-image-error').html('Error: Internal Server Error');
			}
		});
	});
}

function registerViewUser() {
	$('#view-user-form').submit(function (event) {
		$('#view-user-error').html('');
		event.preventDefault();
		const studentID = $('#view-user-id').val();
		getUserList(studentID, function (users) {
			userListToHTML(users, function (html) {
				$('#view-user-result').html(html);
			});
		}, function (response) {
			if (response.status >= 400) {
				$('#view-user-error').html('Error: Invalid Student ID');
			} else {
				$('#view-user-error').html('Error: Internal Server Error');
			}
		});
	});
}

function registerDeleteUser() {
	$('#delete-user-form').submit(function (event) {
		event.preventDefault();
		const studentID = $('#delete-user-id').val();
		deleteUser(studentID, function () {
			listAllUsers();
		});
	});
}

$(document).ready(function () {
	listAllUsers();
	registerCreateUser();
	registerInsertRemoteImage();
	registerInsertLocalImage();
	registerViewUser();
	registerDeleteUser();
});