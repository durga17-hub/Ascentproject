const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");



const databasePath = path.join(__dirname, "ebooks.db");


const app = express();

app.use(express.json());  //is a method inbuilt in express recognize incoming req as JSON object

let database = null;

//InitalizeDbAndServer
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () =>
      console.log("Server Running at http://localhost:3001/")
    );
  } catch (error) {
    console.log("DB Error: ${error.message}");
    process.exit(1);
  }
};

initializeDbAndServer();


//CRUD OPERATIONS

//Reading  books
app.get("/books/", async (request, response) => {
    const getBooksQuery = `
      SELECT
        *
      FROM
        books;`;
    const booksArray = await database.all(getBooksQuery);
    response.send(booksArray);
  });
  
  //Creating a book
  app.post("/books/", async (request, response) => {
    const { id,title,author,price }=request.body;
    const addBookQuery = `
      INSERT INTO
        books (id,title,author,price)
      VALUES
        (
          ${id},
         '${title}',
         '${author}',
          ${price}
        );`;
  
    const dbResponse = await database.run(addBookQuery);
    const bookId = dbResponse.lastID;
    response.send({ id: id,
                   title:title,
                   author:author,
                   price:price });
  });
  
 //Updating book
  app.put("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;
    const { title,author,price }=request.body;
    const updateBookQuery = `
      UPDATE
        books
      SET
        
        title='${title}',
        author='${author}',
        price=${price}
      WHERE
        id = ${bookId};`;
    await database.run(updateBookQuery);
    response.send("Book Updated Successfully");
    console.log(updateBookQuery);
  }); 
  
  //Deleting a specific book
  app.delete("/books/:bookId/", async (request, response) => {
    const { bookId } = request.params;
    const deleteBookQuery = `
      DELETE FROM
        books
      WHERE
        id = ${bookId};`;
    await database.run(deleteBookQuery);
    response.send("Book Deleted Successfully");
  });

  module.exports = app;   
