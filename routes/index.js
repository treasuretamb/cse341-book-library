const router = require('express').Router();

router.use('/books', require('./books'));
router.use('/authors', require('./authors'));
router.use('/auth', require('./auth'));

module.exports = router;