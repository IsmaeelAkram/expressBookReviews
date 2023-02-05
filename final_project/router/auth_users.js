const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	return users.filter((user) => user.username == username).length > 0;
};

const authenticatedUser = (username, password) => {
	return users.filter((user) => user.username == username && user.password == password).length > 0;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 * 10 });
		req.session.authorization = { accessToken, username };
		return res.status(200).json({ message: 'User logged in!', accessToken });
	} else {
		return res.status(403).json({ message: 'Invalid username or password' });
	}
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	const isbn = Number(req.params.isbn);
	const review = req.query.review;

	books[isbn].reviews[req.session.authorization.username] = review;
	return res.status(200).json({ message: 'Review added!' });
});
// Deleting a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = Number(req.params.isbn);

	books[isbn].reviews[req.session.authorization.username] = undefined;
	return res.status(200).json({ message: 'Review deleted!' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
