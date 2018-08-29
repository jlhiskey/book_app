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
      res.render('master', {items:books, 'thisPage':'pages/home.ejs', 'thisPageTitle':'Saved Books'});
    })
    .catch(err => {
      errorHandling(req, res, err);
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
      res.render('master', {items:books, 'thisPage':'pages/show.ejs', 'thisPageTitle':'View Details'});
    })
    .catch(err => {
      errorHandling(req, res, err);
    });
});

app.use(express.static('./public'));

app.get('*', (req, res) => {
  errorHandling(req, res);
});

app.listen(PORT, () => console.log('Server is up on ', PORT));

function errorHandling(req, res, err) {
  if (err) { console.log(err); }
  res.render('master', {'thisPage':'pages/error.ejs', 'thisPageTitle':'Something broke!'});
}