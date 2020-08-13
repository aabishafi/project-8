const express = require('express');
const router = express.Router();

// Homepage will redirects to book directory
router.get('/', (req, res) => {
    res.redirect('/books');
});

module.exports = router;