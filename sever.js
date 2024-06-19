const express = require("express");
const app = express();
const port = 3000;
const booksRoutes = require("./src/books/booksRoutes");
const authorRoutes = require("./src/author/authorRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/author", authorRoutes);
app.listen(port, () => console.log(`app listen on port ${port}`));
