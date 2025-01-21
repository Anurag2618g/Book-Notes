import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

let currentId = 1;

let books = [
    {
        id: currentId++,
        isbn: "978-0131103627",
        title: "The C Programming Language",
        author: "Brian W. Kernighan, Dennis M. Ritchie",
        saved_date: new Date("2023-12-01").toISOString(),
    },
    {
        id: currentId++,
        isbn: "020161622X",
        title: "The Pragmatic Programmer",
        author: "Andy Hunt, David Thomas, Dave Thomas, and Andrew Hunt",
        saved_date: new Date("2023-12-02").toISOString(),
    },
    {
        id: currentId++,
        isbn: "978-0132350884",
        title: "Clean Code",
        author: "Robert C. Martin",
        saved_date: new Date("2023-12-03").toISOString(),
    },
];

let reviews = [
    {
        book_id: 1,
        review: "Język C jest językiem ogólnego stosowania ... Jednak C nie jest przywiązany do żadnego systemu operacyjnego lub maszyny. Wprawdzie nazwano go językiem programowania systemowego, jest bowiem wygodnym narzędziem do konstruowania kompilatorów systemów operacyjnych, ale okazało się, że nadawał się równie dobrze do napisania ważniejszych programów z wielu różnych dziedzin.added by Adam Byrtek.",
        rating: 5,
    },
    {
        book_id: 2,
        review: "You are reading this book for two reasons. First, you are a programmer. Second, you want to be a better programmer. Good. We need better programmers added anonymously",
        rating: 4,
    },
    {
        book_id: 3,
        review: " Their official sale date and then racing against one another to release the material for free. Warez: The Infrastructure and Aesthetics of Piracy is the first scholarly research book about this underground subculture, which began life in the pre-internet era Bulletin Board Systems and moved to internet File Transfer Protocol servers in the mid- to late-1990s. Is highly illegal in almost every aspect of its operations. The term Warez itself refers to pirated media, a derivative of software. Taking a deep dive in the documentary evidence produced by the Scene itself, Warez describes the operations and infrastructures an underground culture with its own norms and rules of participation, its own forms of sociality, and its own artistic forms. Even though forms of digital piracy are often framed within ideological terms of equal access to knowledge and culture, Eve uncovers in the Warez Scene a culture of competitive ranking and one-upmanship that is at odds with the often communalist interpretations of piracy. Broad in scope and novel in its approach, Warez is indispensible reading for anyone interested in recent developments in digital culture, access to knowledge and culture, and the infrastructures that support our digital age.",
        rating: 5,
    },
];

// Home Page
app.get("/", (req, res) => {
    try {
        res.render("home.ejs");
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


// Fetch saved books
app.get("/books", (req, res) => {
    try {
        const sortBy = req.query.sort;
        let sortedBooks = [...books];

        if (sortBy === "rating") {
            sortedBooks.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "date") {
            sortedBooks.sort((a, b) => new Date(b.saved_date) - new Date(a.saved_date));
        }

        const combinedData = sortedBooks.map(book => ({
            ...book,
            reviews: reviews.filter(review => review.book_id === book.id),
        }));

        res.render("index.ejs", { books: combinedData });
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

// Add new books
app.get("/add-book", (req, res) => {
    res.render("new.ejs");
});

app.post("/save-book", (req, res) => {
    try {
        const { isbn, title, author, review, rating } = req.body;

        const newBook = {
            id: currentId++,
            isbn,
            title,
            author,
            saved_date: new Date().toISOString(),
        };
        books.push(newBook);

        if (review || rating) {
            reviews.push({
                book_id: newBook.id,
                review,
                rating: parseInt(rating, 10),
            });
        }

        res.redirect("/");
    } catch (error) {
        res.status(500).json({ error: "Error saving book data" });
    }
});

// Edit existing books
app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const book = books.find(b => b.id === id);
        const bookReviews = reviews.filter(r => r.book_id === id);

        if (book) {
            res.render("edit.ejs", { book: { ...book, reviews: bookReviews } });
        } else {
            res.status(404).send("Book not found");
        }
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.patch("/update/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { isbn, title, author, review, rating } = req.body;

    try {
        const bookIndex = books.findIndex(b => b.id === id);
        if (bookIndex !== -1) {
            books[bookIndex] = { ...books[bookIndex], isbn, title, author };

            const reviewIndex = reviews.findIndex(r => r.book_id === id);
            if (reviewIndex !== -1) {
                reviews[reviewIndex] = { book_id: id, review, rating: parseInt(rating, 10) };
            } else {
                reviews.push({ book_id: id, review, rating: parseInt(rating, 10) });
            }

            res.redirect("/");
        } else {
            res.status(404).send("Book not found");
        }
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

// Delete books
app.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        books = books.filter(book => book.id !== id);
        reviews = reviews.filter(review => review.book_id !== id);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});