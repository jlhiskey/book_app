'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');

let app = express();
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;

const conString = process.env.DATABASE_URL
//'postgres://jasonlhiskey:7559@localhost:5432/book_app'
;
let client = new pg.Client(conString);
client.connect();

app.get('/', (req, res) => {
  let SQL = 'SELECT title, author, image_url FROM books';
  client.query(SQL)
    .then(data => {
      let books = data.rows;
      res.render('master', {items:books});
    })
    .catch(err => {
      console.log(err);
      res.render('error');
    });
});

app.use(express.static('./public'));

app.get('*', (req, res) => {
  res.render('error');
});

app.listen(PORT, () => console.log('Server is up on ', PORT));