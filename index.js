import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Library",
    password: "chained_86",
    port: 5432,
});
db.connect();

let books =[];

//Fetch data from database
app.get("/", async(req,res) => {
    const data = await db.query(
        "SELECT books.name, books.author, books.cover_id, book_reviews.rating, book_reviews.review_text, book_reviews.review_date FROM books JOIN book_reviews ON books.book_id = book_reviews.book_id"
        );
    books = data.rows;
    console.log(books);
    res.render("index.ejs", {
        books: books,
    });
});

//New route
app.get("/add-book", async(req,res) =>{
    res.render("new.ejs");
});

//Save book
app.post("/save-book", async(req,res) => {
    const { name, author, coverId } = req.body;
    try {
        const data = await db.query('INSERT INTO books (name, author, cover_id) VALUES ($1, $2, $3)',[name, author, coverId] );
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: 'Error saving book data' });
    }
});

//Route for search button
app.post("/search", async(req,res) => {
    res.redirect("/");
});

//Edit review

//Delete book


app.listen(port, async() => {
    console.log(`Server running on port ${port}`);
});