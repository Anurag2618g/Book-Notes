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
    res.render("index.ejs", {
        books: books,
    });
});

//New route
app.get("/add-book", (req,res) =>{
    res.render("new.ejs");
});

//Fetch data from API

//Route for search button
app.post("/search", (req,res) => {
    res.redirect("/");
});

//Save book
app.post("/save-book", (req,res) => {

    res.redirect("/");
});

//Edit review

//Delete book


app.listen(port, async() => {
    console.log(`Server running on port ${port}`);
});