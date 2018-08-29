'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');

let app = express();
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

const conString = process.env.DATABASE_URL;
let client = new pg.Client(conString);
client.connect();

// home
app.get('/', (req, res) => {
  let SQL = 'SELECT title, author, image_url, id FROM books';
  client.query(SQL)
    .then(data => {
      let books = data.rows;
      books.page = 'pages/home.ejs';
      books.pageTitle = 'Saved Books';
      res.render('master', {items:books});
    })
    .catch(err => {
      console.log(err);
      res.render('pages/error');
    });
});

// when clicking 'view details' on homepage
app.get('/show', (req, res) => {
  let bookId = req.query.book;
  let SQL = `SELECT title, author, image_url, book_description, isbn FROM books WHERE id = $1 `;
  let values = [bookId];
  client.query(SQL, values)
    .then(data => {
      let books = data.rows;
      books.page = 'pages/show.ejs';
      books.pageTitle = 'View Details';
      res.render('master', {items:books});
    })
    .catch(err => {
      console.log(err);
      res.render('pages/error');
    });
});

app.use(express.static('./public'));

app.get('*', (req, res) => {
  res.render('pages/error');
});

app.listen(PORT, () => console.log('Server is up on ', PORT));