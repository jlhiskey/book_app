'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');

let app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
const PORT = process.env.PORT || 3000;

const conString = process.env.DATABASE_URL;
let client = new pg.Client(conString);
client.connect();

// Routes

// home
app.get('/', (req, res) => {
  homePage(req, res);
});

// when clicking 'view details' on homepage
app.get('/show', (req, res) => {
  viewDetails(req, res);
});

// add new book
app.get('/new', (req, res) => {
  res.render('master', {'thisPage': 'pages/new.ejs', 'thisPageTitle': 'Add a New Book'});
});

app.post('/new/submit', (req, res) => {
  addNew(req, res);
});

app.use(express.static('./public'));

app.get('*', (req, res) => {
  errorHandling(res);
});

app.listen(PORT, () => console.log('Server is up on ', PORT));

// Route Behavior

function errorHandling(res, err) {
  if (err) { console.log(err); }
  res.render('master', {'thisPage':'pages/error.ejs', 'thisPageTitle':'Something broke!'});
}

function homePage(req, res) {
  let SQL = 'SELECT title, author, image_url, id FROM books';
  client.query(SQL)
    .then(data => {
      let books = data.rows;
      res.render('master', {items:books, 'thisPage':'pages/home.ejs', 'thisPageTitle':'Saved Books'});
    })
    .catch(err => {
      errorHandling(req, res, err);
    });
}

function viewDetails(req, res) {
  let bookId = req.query.book;
  let SQL = `SELECT title, author, image_url, book_description, isbn FROM books WHERE id = $1 `;
  let values = [bookId];
  client.query(SQL, values)
    .then(data => {
      let books = data.rows;
      res.render('master', {items:books, 'thisPage':'pages/show.ejs', 'thisPageTitle':'View Details'});
    })
    .catch(err => {
      errorHandling(res, err);
    });
}

function addNew(req, res) {
  let SQL = `INSERT INTO books (title, author, isbn, image_url, book_description) VALUES ( $1, $2, $3, $4, $5 )`;
  let values = [
    req.body.title,
    req.body.author,
    req.body.isbn,
    req.body.image_url,
    req.body.book_description
  ];
  client.query(SQL, values)
    .then( () => {
      res.render('master', {
        'thisPage': 'pages/submit.ejs',
        'thisPageTitle': 'Submitted!',
        items: [{title: req.body.title,
          author: req.body.author,
          isbn: req.body.isbn,
          image_url: req.body.image_url,
          book_description: req.body.book_description
        }]
      });
    })
    .catch( () => {
      errorHandling(res);
    });
}