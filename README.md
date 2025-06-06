# Book Review API 

A RESTful API for managing books, reviews, and user authentication. This project allows users to browse books, add reviews, and manage user accounts. Built using **Node.js**, **Express**, and **Sequelize** (ORM for MySQL).


## ✨ Features

### User Authentication
- Secure signup and login using **JWT** (JSON Web Tokens).

### Book Management
- Add new books.
- View a paginated list of all books.
- Filter books by author and genre.
- Search books by title or author.
- Get detailed info about a single book, including reviews and average rating.
- Update and delete books (authentication required).

### Review Management
- Add reviews for books (one review per user per book).
- Update and delete personal reviews.

### Database
- Uses **MySQL** with Sequelize ORM for easy interaction and model syncing.



## 💻 Technologies Used

- **Node.js** — JavaScript runtime environment
- **Express.js** — Web framework for Node.js
- **Sequelize** — Promise-based ORM for MySQL
- **MySQL** — Relational database
- **bcryptjs** — Password hashing
- **jsonwebtoken (JWT)** — Secure authentication
- **dotenv** — Environment variable management



## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- MySQL Server installed and running
- npm (Node Package Manager)

### Installation

1.  **Clone the repository**

    Bash

    ```
    git clone https://github.com/nishant-deshmukh/book-review-api.git
    cd book-review-api

    ```

2.  **Install dependencies**

    Bash

    ```
    npm install

    ```

3.  **Setup Environment Variables** Create a file named `.env` in the root of your project directory and add the following content:

    ```
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=book_review_db
    JWT_SECRET=your_secret_jwt_key_here

    ```

    -   **Replace `your_mysql_password`** with your actual MySQL password.
    -   **Replace `your_secret_jwt_key_here`** with a strong, unique secret string for JWTs.
4.  **Create the MySQL Database** Make sure your MySQL server is running. Then, log in to your MySQL client (e.g., MySQL Workbench, command line) and create the database:

    SQL

    ```
    CREATE DATABASE book_review_db;

    ```

    *The necessary tables (`users`, `books`, `reviews`) will be automatically created and synchronized by Sequelize when you run the server, thanks to `sequelize.sync({ alter: true })`.*



### Start the Server

Bash

```
npm start

```


⚡ API Endpoints
-------------

Use tools like **Postman**, **Insomnia**, or **curl** to test these endpoints.
The API will run on the port specified in your `.env` file (default: `http://localhost:3000`).

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register a new user (name, email, password) |
| POST | `/api/auth/login` | Login (email, password) |


### Books

| Method | Endpoint | Description | Auth Required? |
| --- | --- | --- | --- |
| POST | `/api/books` | Add a new book | Yes |
| GET | `/api/books` | Get all books (pagination and optional filters: `?page=1&limit=5&author=...&genre=...`) | No |
| GET | `/api/books/search?q=keyword` | Search books by title or author | No |
| GET | `/api/books/books-with-reviews` | Get all books including their reviews | No |
| GET | `/api/books/:id` | Get details of a single book including average rating and paginated reviews | No |
| PUT | `/api/books/:id` | Update a book by ID | Yes |
| DELETE | `/api/books/:id` | Delete a book by ID | Yes |



### Reviews

| Method | Endpoint | Description | Auth Required? |
| --- | --- | --- | --- |
| POST | `/api/reviews/:bookId` | Add a review for a book | Yes |
| PUT | `/api/reviews/:id` | Update your review by ID | Yes |
| DELETE | `/api/reviews/:id` | Delete your review by ID | Yes |


🔒 Authentication Details
----------------------

-   Protected routes require a **JWT token** sent in the HTTP `Authorization` header as:\
    `Authorization: Bearer <your_token_here>`


📄 License
-------

MIT License © Nishant Deshmukh



