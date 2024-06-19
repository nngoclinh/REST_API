const pool = require("../../db");
const queries = require("./booksQueries");
const A_queries = require("../author/authorQueries");
const getBooks = (req, res) => {
  pool.query(queries.getBooks, (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};
//add
const addBooks = (req, res) => {
  const{book_name, publish_date,author_id} = req.body;
  console.log(author_id);
  pool.query(A_queries.getAuthorById, [author_id], (error, result) => {
    const noAuthorFound = !result.rows.length;
    if (noAuthorFound) {
      res.send("No author found!");
    } else {
      pool.query(
        queries.addBooks,
        [book_name, publish_date, author_id],
        (error, result) => {
          if (error) throw error;
          res.status(201).json({ message: "Books added successfully" });
          console.log("Books created");
        }
      );
    }
  });
};

module.exports = {
  getBooks,
  addBooks,
  
};
