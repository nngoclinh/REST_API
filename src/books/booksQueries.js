const getBooks = "SELECT * FROM books";
const addBooks ="INSERT INTO books (book_name, publish_date, author_id) VALUES ($1,$2,$3)";
module.exports = {
  getBooks,
  addBooks,
};
