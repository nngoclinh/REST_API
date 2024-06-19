const pool = require("../../db");
const queries = require("./authorQueries");

const getAuthor = (req, res) => {
  pool.query(queries.getAuthor, (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};

const getAuthorById = (req, res) => {
  const author_id = parseInt(req.params.author_id);
  console.log("getAuthorById $id is",author_id);
  pool.query(queries.getAuthorById, [author_id], (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};
const addAuthor = (req, res) => {
  pool.query(queries.addAuthor, (error, result) => {
    const { author_name } = req.body;
    pool.query(queries.addAuthor, [author_name], (error, result) => {
      if (error) throw error;
      res.status(201).json({ message: "Author added successfully" });
      console.log("Author created");
    });
  });
};

module.exports = {
  getAuthor,
  getAuthorById,
  addAuthor,
};
