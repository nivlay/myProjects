'use strict';

function onInit() {
  renderBooks();
}

function renderBooks() {
  var books = getBooks();
  var strHtmls = books.map(function (book) {
    return `
        <div class="table-cell">${book.id}</div>
        <div class="table-cell">${book.title}</div>
        <div class="table-cell">${book.price}</div>
        <div class="table-cell">
        <button onClick="onReadBook('${book.id}')">Read</button>
        <button onClick="onUpdateBook('${book.id}')">Update</button>
        <button onClick="onRemoveBook('${book.id}')">Delete</button>
        </div> 
        `;
  });

  document.querySelector('.book-container').innerHTML = strHtmls.join('');
}

function onRemoveBook(bookId) {
  deleteBook(bookId);
  renderBooks();
}

function onAddBook() {
  var title = document.querySelector('input[name=title]').value;
  var price = document.querySelector('input[name=price]').value;
  var elAddingBook = document.querySelector('.adding-book');
  elAddingBook.hidden = true;
  if (!title || !price) return;
  addBook(title, price);
  renderBooks();
}

function onUpdateBook(bookId) {
  var newPrice = +prompt('Book new price');
  // var newPrice = document.querySelector('input[name=updatePrice]').value;
  if (!newPrice) return;
  updateBook(bookId, newPrice);
  renderBooks();
}



function onReadBook(bookId) {
  var elModal = document.querySelector('.modal');
  var book = getBookById(bookId);
  var strHtml = `<h5>${book.title}</h5>
  <img src="${book.imgUrl}">
  <button onclick="onCloseModal()">Close</button>
  <label>Rating:</label>
  <input oninput="onUpdateBookRating(this,'${book.id}')" type="number" name="rating" value="${book.rate}" min="0" max="10">`;
  elModal.innerHTML = strHtml;
  elModal.hidden = false;
}

function onUpdateBookRating(elRateInput, bookId) {
  updateBookRating(bookId, elRateInput.value);
  renderBooks();
}

function onCloseModal() {
  var elModal = document.querySelector('.modal');
  elModal.hidden = true;
}

function onShowAdding() {
  var elAddingBook = document.querySelector('.adding-book');
  elAddingBook.hidden = elAddingBook.hidden ? false : true;
}


