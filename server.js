'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
const PORT = process.env.PORT || 3000;

const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);
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

// search for a new book
app.get('/search', (req, res) => {
  res.render('master', {'thisPage': 'pages/search.ejs', 'thisPageTitle': 'Search for a Book'});
});

app.post('/new/submit', (req, res) => {
  addNew(req, res);
});

app.post('/search/submit', (req, res) => {
  bookSearch(req, res);
});

app.use(express.static('./public'));

app.get('*', (req, res) => {
  pageNotFound(res);
});

app.listen(PORT, () => console.log('Server is up on ', PORT));

// Route Behavior

// visiting homepage (get)
function homePage(req, res) {
  let SQL = 'SELECT title, author, image_url, id FROM books';
  client.query(SQL)
    .then(data => {
      let books = data.rows;
      res.render('master', {items:books, 'thisPage':'pages/home.ejs', 'thisPageTitle':'Saved Books'});
    })
    .catch(err => {
      pageNotFound(req, res, err);
    });
}

// clicking view details on homepage (get)
function viewDetails(req, res) {
  let bookId = req.query.book;
  let SQL = `SELECT title, author, image_url, description, isbn FROM books WHERE id = $1 `;
  let values = [bookId];
  client.query(SQL, values)
    .then(data => {
      let books = data.rows;
      if (books.length > 0) {
        res.render('master', {items:books, 'thisPage':'pages/show.ejs', 'thisPageTitle':'View Details'});
      } else { throw ('database error'); }
    })
    .catch(err => {
      pageNotFound(res, err);
    });
}

// search + results (post)
function bookSearch(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  let queryType = '';
  if (req.body.searchBy === 'searchByAuthor') {
    queryType = 'inauthor';
  }
  if (req.body.searchBy === 'searchByTitle') {
    queryType = 'intitle';
  }

  url += queryType + ':' + req.body.searchquery;

  superagent.get(url)
    .then( results => {
      if (!results.body.items) { throw ('search error'); }
      let books = results.body.items.reduce( (acc, curr) => {
        let book = {
          title: curr.volumeInfo.title || '',
          author: curr.volumeInfo.authors[0] || '',
          isbn: curr.volumeInfo.industryIdentifiers[0].identifier || '',
          image_url: curr.volumeInfo.imageLinks.smallThumbnail,
          description: curr.volumeInfo.description || '',
        };
        acc.push(book);
        return acc;
      }, []);
      res.render('master', {items:books, 'thisPage':'pages/result.ejs', 'thisPageTitle':'Search Results'});
    })
    .catch(err => {
      searchError(req, res, err);
    });
}


// clicking submit on new book page (post)
function addNew(req, res) {
  let SQL = `INSERT INTO books (title, author, isbn, image_url, description) VALUES ( $1, $2, $3, $4, $5 )`;
  let values = [
    req.body.title,
    req.body.author,
    req.body.isbn,
    req.body.image_url,
    req.body.description
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
          description: req.body.description
        }]
      });
    })
    .catch( () => {
      formError(res);
    });
}

// Error behavior

function pageNotFound(res, err) {
  if (err) { console.log(err); }
  res.render('master', {'thisPage':'pages/errors/pagenotfound.ejs', 'thisPageTitle':'Something broke!'});
}

function formError(res, err) {
  if (err) { console.log(err); }
  res.render('master', {'thisPage':'pages/errors/formerror.ejs', 'thisPageTitle':'Something broke!'});
}

function searchError(req, res, err) {
  if (err) { console.log(err); }
  res.render('master', {'searchQuery': req.body.searchquery, 'thisPage':'pages/errors/searcherror.ejs', 'thisPageTitle':'Nothing Found!'});
}