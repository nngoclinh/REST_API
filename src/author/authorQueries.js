  const getAuthor = "SELECT * FROM author";
  const getAuthorById = "SELECT * FROM author WHERE author_id = $1";
  const addAuthor ="INSERT INTO author (author_name) VALUES ($1)";
  module.exports = {
    getAuthor,
    getAuthorById,
    addAuthor,
  };
