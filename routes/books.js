var express = require('express');
var router = express.Router();
var Book = require("../models").Book;

// Get book listing
router.get('/', function(req, res, next) {
    Book.findAll({ order: [
            ["title", "ASC"]
        ] }).then(function(books) {
        res.render("index", { books: books, title: "My Awesome Books" })
    }).catch(function(err) {
        res.sendStatus(500);
    });
});

// Show the create new form
router.get("/new", function(req, res, next) {
    res.render("new-book", { book: Book.build(), title: "Create New Book" });
});

// Post a new book to the database 
router.post("/new", function(req, res, next) {
    Book.create(req.body).then(function(book) {
        res.redirect("/");
    }).catch(function(err) {
        if (err.name === "SequelizeValidationError") {
            res.render("new-book", {
                book: Book.build(req.body),
                errors: err.errors
            });
        } else {
            throw err;
        }
    }).catch(function(err) {
        res.render('error', err);
        res.sendStatus(500);
    });
});

// Show book detail form
router.get("/:id", function(req, res, next) {
    Book.findByPk(req.params.id).then(function(books) {
        if (books) {
            res.render("update-book", { books: books, title: books.title })
        } else {
            next();
        }
    });
});

// Updates book info in the database
router.post("/:id", function(req, res, next) {
    Book.findByPk(req.params.id).then(function(books) {
        if (books) {
            return books.update(req.body);
        } else {
            next();
        }
    }).then(function(books) {
        res.redirect("/");
    }).catch(function(err) {
        if (err.name === "SequelizeValidationError") {
            var books = Book.build(req.body);
            books.id = req.params.id;
            res.render("update-book", {
                books: books,
                errors: err.errors
            });
        } else {
            throw err;
        }
    }).catch(function(err) {
        res.sendStatus(500);
    });
});

// Delete a book 
router.post("/:id/delete", function(req, res, next) {
    Book.findByPk(req.params.id).then(function(book) {
        if (book) {
            return book.destroy();
        } else {
            next();
        }
    }).then(function() {
        res.redirect("/");
    }).catch(function(err) {
        res.sendStatus(500);
    });
});

module.exports = router