import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import methodOverride from "method-override";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Library",
    password: "chained_86",
    port: 5432,
});
db.connect();

//Fetch saved books from database
app.get("/", async(req,res) => {
    try{
        const data = await db.query(
            "SELECT books.*, reviews.book_id, reviews.rating, reviews.review FROM books JOIN reviews ON books.id = reviews.book_id ORDER BY books.id"
        );
        const book = data.rows;
        res.render("index.ejs", {
            books: book,
        });
    }catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
    
});

//Add new books to the database
app.get("/add-book", async(req,res) =>{
    res.render("new.ejs");
});

app.post("/save-book", async(req,res) => {   
    try {
        const {isbn, title, author, review, rating} = req.body;
        const booksResult = await db.query(
            "INSERT INTO books (title, author, isbn) VALUES ($1, $2, $3) RETURNING id",[title, author, isbn]
        );
        const bookId = booksResult.rows[0].id;
        await db.query(
            "INSERT INTO reviews (book_id, rating, review) VALUES ($1, $2, $3)", [bookId, rating, review]
        );
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ error: 'Error saving book data' });
    }
});

//Search for books through openLibrary
app.post("/search", async(req,res) => {
    res.redirect("/");
});

//Edit Existing books
app.get("/edit/:id", async(req,res) => {
    const id = req.params.id;
    try {
        const data = await db.query(
            "SELECT books.*, reviews.book_id, reviews.rating, reviews.review FROM books JOIN reviews ON books.id = reviews.book_id WHERE books.id = $1", [id]
        );
        const result = data.rows[0];
        res.render("edit.ejs", {
            book: result,
        });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.patch("/update/:id", async(req,res) => {
    const id = req.params.id;
    const {isbn, title, author, review, rating} = req.body;
    try {
        await db.query(
            "UPDATE books SET title = $1, author = $2, isbn = $3 WHERE id = $4", [title,author,isbn,id]
        );
        await db.query("UPDATE reviews SET review = $1, rating = $2 WHERE book_id = $3", [review,rating,id]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }

});

//Delete books
app.delete("/delete/:id", async(req,res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM reviews WHERE book_id = $1", [id]);
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }    
});


app.listen(port, async() => {
    console.log(`Server running on port ${port}`);
});