const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	if (isValid(username)) {
		return res.status(403).json({ message: 'Username taken' });
	}
	users.push({ username, password });
	res.sendStatus(200);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
	return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	return res.json(books[req.params.isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	for (let i = 1; i < 11; i++) {
		if (books[i].author == req.params.author) {
			return res.json(books[i]);
		}
	}
	return res.json({});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	for (let i = 1; i < 11; i++) {
		if (books[i].title == req.params.title) {
			return res.json(books[i]);
		}
	}
	return res.json({});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	return res.json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
