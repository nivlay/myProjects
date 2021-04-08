'use strict';

const KEY = 'books';

var gBooks;
_createBooks();

function getBooks() {
  return gBooks;
}

function getBookById(bookId) {
  var book = gBooks.find(function (book) {
    return bookId === book.id;
  });

  return book;
}

function deleteBook(bookId) {
  var bookIdx = gBooks.findIndex(function (book) {
    return bookId === book.id;
  });

  gBooks.splice(bookIdx, 1);
  _saveBooksToStorage();
}
function addBook(title, price) {
  var book = _createBook(title, price);
  gBooks.unshift(book);
  _saveBooksToStorage();
}

function updateBook(bookId, bookPrice) {
  var bookIdx = gBooks.findIndex(function (book) {
    return bookId === book.id;
  });
  gBooks[bookIdx].price = bookPrice;
  _saveBooksToStorage();
}

function _createBook(title, price) {
  return {
    id: makeId(),
    title,
    price,
    rate: 0,
    imgUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtfcsJm7Qsd7mblIQo4VLuPN6CfFc70mySwQ&usqp=CAU',
  };
}

function _createBooks() {
  var books = loadFromStorage(KEY);

  if (!books || !books.length) {
    books = [
      {
        id: makeId(),
        title: 'The lord of the ring',
        price: 18.9,
        rate: 9,
        imgUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51EstVXM1UL._SX331_BO1,204,203,200_.jpg',
      },
      {
        id: makeId(),
        title: 'Harry Potter',
        price: 15,
        rate: 9,
        imgUrl:
          'https://images-eu.ssl-images-amazon.com/images/I/51ifu1aebKL._SY264_BO1,204,203,200_QL40_FMwebp_.jpg',
      },
    ];
  }

  gBooks = books;
  _saveBooksToStorage();
}

function updateBookRating(bookId, bookRate) {
  var bookIdx = gBooks.findIndex(function (book) {
    return bookId === book.id;
  });

  gBooks[bookIdx].rate = bookRate;
  _saveBooksToStorage();
}

function _saveBooksToStorage() {
  saveToStorage(KEY, gBooks);
}
