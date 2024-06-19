const { Router } = require('express');
const controller = require('./booksController')

const router = Router();

router.get("/", controller.getBooks);
router.post("/",controller.addBooks);   
module.exports = router;