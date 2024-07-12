# Book Notes Web Application #
## Description ##
The Book Notes web application is designed to help users manage and track their read books. It allows users to store book details including title, author, ISBN, and user reviews. The application integrates with a PostgreSQL database to persist book data and reviews.

## Features ##
- View Books: See a list of all saved books with details such as title, author, and reviews.
- Add New Books: Add a new book by providing title, author, ISBN, review, and rating.
- Edit Books: Update existing book details including title, author, ISBN, review, and rating.
- Delete Books: Remove books from the database.
- Sort Books: Sort books by default (ID), title, author, rating, or date of save.
## Technologies Used
- Frontend: HTML, CSS, Bootstrap
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Dependencies: pg (PostgreSQL client for Node.js), method-override (HTTP method override middleware for Express.js)
## Installation

### Clone the repository:
git clone <repository-url>
cd <repository-name>

### Install dependencies:
npm install

### Set up PostgreSQL database:

- Create a PostgreSQL database named Library.
- Set up tables books and reviews using the provided SQL scripts.

## Configure database connection:

### Update the database connection details in server.js:
javascript
Copy code
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Library",
    password: "your-password",
    port: 5432,
});
db.connect();

### Start the server:
npm start

## Access the application:
Open your web browser and go to http://localhost:3000 to access the Book Notes application.

## Usage
- View Books: Upon accessing the application, the homepage displays a list of all saved books.
- Add New Book: Click on the "New +" button to add a new book with details.
- Edit Book: Click on the "Edit" button next to each book to update its details.
- Delete Book: Click on the "Delete" button to remove a book from the list.
- Sort Books: Use the dropdown menu to sort books by default (ID), title, author, rating, or date of save.
### Contributing
Contributions are welcome! Please fork the repository and create a pull request with your suggested changes.

---