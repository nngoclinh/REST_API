const { Router } = require('express');
const controller = require('./authorController')

const router = Router();

router.get("/", controller.getAuthor);
router.get("/:author_id",controller.getAuthorById);   
router.post("/",controller.addAuthor)
module.exports = router;