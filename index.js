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

app.get("/", async(req,res) => {
    res.render("index.ejs");
});

app.post("/search", async(req,res) => {
    res.render("new.ejs");
});

app.listen(port, async() => {
    console.log(`Server running on port ${port}`);
});