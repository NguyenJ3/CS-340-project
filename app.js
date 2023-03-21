// App.js


var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        =  10419;               // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

var db = require('./database/db-connector')


/*
    ROUTES
*/
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.render('Homepage');
    });                                         // requesting the web site.

    app.get('/authors', function(req, res)
    {
        let query1 = "SELECT * FROM Authors ORDER BY authorID ASC;";

        db.pool.query(query1, function(error, rows, fields){
            res.render('Authors',{data: rows}); 
        })
    });

    app.get('/books', function(req, res)
    {
        //let query1 = "SELECT Books.bookID as bookID, Books.bookName as bookName, Authors.authorName as authorName, Genres.genreName as genreName, Books.price as price, Books.totalCount as totalCount FROM Book_Genres JOIN Books on Book_Genres.bookID = Books.bookID JOIN Genres on Book_Genres.genreID = Genres.genreID JOIN Authors on Books.authorID = Authors.authorID ORDER BY Books.bookID ASC";
        let query1 = "SELECT Books.bookID as bookID, Books.bookName as bookName, Authors.authorName as authorName, Floors.floorName as floorName, Books.price as price, Books.totalCount as totalCount FROM Books JOIN Authors on Books.authorID = Authors.authorID JOIN Floors on Books.floorID = Floors.floorID ORDER BY Books.bookID ASC;";
        let query2 = "SELECT * FROM Authors;";
        let query3 = "SELECT * FROM Floors;";


        db.pool.query(query1, function(error,rows,fields){
            let book = rows;
            db.pool.query(query2, function(error, rows, fields){
                let author = rows;
                db.pool.query(query3, function(error,rows,fields){
                    let floor = rows;
                    res.render('Books',{data: book, authors: author, floors: floor});
                })

            })

        })
    });

    app.get('/floors', function(req, res)
{
    let query1 = "SELECT * FROM Floors ORDER BY floorID ASC;";

    db.pool.query(query1, function(error, rows, fields){
        res.render('Floors', {data: rows}); 
    });
});

    app.get('/genres', function(req,res)
    {
        let query1 = "SELECT Genres.genreID as genreID, Genres.genreName as genreName, Floors.floorName as floorName FROM Genres JOIN Floors on Genres.floorID = Floors.floorID GROUP BY Genres.genreID ORDER BY Genres.genreID ASC;";
        
        let query2 = "SELECT * FROM Floors;";

        db.pool.query(query1, function(error, rows, fields){
            let genre = rows;
            db.pool.query(query2, (error,rows, fields) =>{
                let floors = rows;
                res.render('index',{data: genre, floors: floors}); 
            })

        })
    });

    app.get('/bookGenres', function(req,res)
    {
        let query1 = "SELECT Book_Genres.bookID as bookID, Book_Genres.genreID as genreID, Books.bookName as bookName, Genres.genreName as genreName FROM Book_Genres JOIN Books on Book_Genres.bookID = Books.bookID JOIN Genres on Book_Genres.genreID = Genres.genreID;";
        
        let query2 = "SELECT * FROM Books;";
        let query3 = "SELECT * FROM Genres;";
        
        db.pool.query(query1, function(error,rows,fields){
            let table = rows;
            db.pool.query(query2, (error,rows, fields) =>{
                let books = rows;
                db.pool.query(query3, (error,rows, fields) =>{
                    let genres = rows;
                    res.render('Book_Genres',{data: table, books: books, genre: genres});
                })
            })
        })
    });


//post is for add
app.post('/add-genre-ajax', function(req, res)
{
    let data = req.body;

    let query1 = `INSERT INTO Genres(genreName,floorID) VALUES ('${data.genreName}',(SELECT floorID FROM Floors WHERE floorName = '${data.floorName}'));`;
    db.pool.query(query1, function(error, rows, fields){
        if(error){
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            let query2 = `SELECT Genres.genreID as genreID, Genres.genreName as genreName, Floors.floorName as floorName FROM Genres JOIN Floors on Genres.floorID = Floors.floorID GROUP BY Genres.genreID ORDER BY Genres.genreID ASC;`;
            db.pool.query(query2,function(error,rows,fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    });
});

app.post('/add-book-ajax', function(req, res)
{
    let data = req.body;

    let query1 = `INSERT INTO Books(bookName, authorID, floorID, totalCount, price) VALUES ('${data.bookName}', ${data.authorID}, ${data.floorID}, ${data.totalCount}, ${data.price});`;
    db.pool.query(query1, function(error, rows, fields){
        if(error){
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            let query2 = `SELECT Books.bookID as bookID, Books.bookName as bookName, Authors.authorName as authorName, Floors.floorName as floorName, Books.price as price, Books.totalCount as totalCount FROM Books JOIN Authors on Books.authorID = Authors.authorID JOIN Floors on Books.floorID = Floors.floorID ORDER BY Books.bookID ASC;`;
            db.pool.query(query2,function(error,rows,fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    });
});



app.post('/add-bookGenre-ajax', function(req, res)
{
    let data = req.body;

    let query1 = `INSERT INTO Book_Genres(bookID,genreID) VALUES ((SELECT bookID FROM Books WHERE bookName = '${data.bookName}' LIMIT 1),(SELECT genreID FROM Genres WHERE genreName = '${data.genreName}' LIMIT 1));`;
    db.pool.query(query1, function(error, rows, fields){
        if(error){
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            let query2 = `SELECT Book_Genres.bookID as bookID, Book_Genres.genreID as genreID, Books.bookName as bookName, Genres.genreName as genreName FROM Book_Genres JOIN Books on Book_Genres.bookID = Books.bookID JOIN Genres on Book_Genres.genreID = Genres.genreID ORDER BY Book_Genres.BookID ASC;`;
            db.pool.query(query2,function(error,rows,fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    });
});




app.post('/add-authors-ajax', function(req, res) {
    let data = req.body;
  
    let query1 = `INSERT INTO Authors(authorName) VALUES ('${data.authorName}');`;
  
    db.pool.query(query1, function(error, rows, fields){
        if(error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            let query2 = `SELECT authorID, authorName FROM Authors ORDER BY Authors.authorID ASC;`;
  
            db.pool.query(query2, function(error, rows, fields) {
                if(error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
  });

  app.post('/add-floors-ajax', function(req, res) {
    let data = req.body;
  
    let query = `INSERT INTO Floors(floorName) VALUES ('${data.floorName}');`;
    db.pool.query(query, function(error, rows, fields) {
      if (error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        let query = `SELECT * FROM Floors;`;
        db.pool.query(query, function(error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            res.send(rows);
          }
        });
      }
    });
  });

//Delete is for delete
app.delete('/delete-genre-ajax', function(req,res,next){
    let data = req.body;
    let genreID = parseInt(data.id);
    let deleteBook_Genres = `DELETE FROM Book_Genres WHERE genreID = ?`;
    let deleteGenres = `DELETE FROM Genres WHERE genreID = ?`;

    db.pool.query(deleteBook_Genres, [genreID], function(error,rows,fields){
        if(error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            db.pool.query(deleteGenres, [genreID], function(error,rows,fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.sendStatus(204)
                }
            });
        }
    });

});

app.delete('/delete-book-ajax', function(req,res,next){
    let data = req.body;
    let bookID = parseInt(data.id);
    let deleteBook_Genres = `DELETE FROM Book_Genres WHERE bookID = ?`;
    let deleteBook = `DELETE FROM Books WHERE bookID = ?`;

    db.pool.query(deleteBook_Genres, [bookID], function(error,rows,fields){
        if(error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            db.pool.query(deleteBook, [bookID], function(error,rows,fields){
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.sendStatus(204)
                }
            });
        }
    });

});

app.delete('/delete-authors-ajax', function(req, res) {
    let data = req.body;
  
    let query1 = `DELETE FROM Authors WHERE authorID = ?`;
  
    db.pool.query(query1, [data.id], function(error, rows, fields){
      if(error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    });
  });
  
  
  
  app.delete('/delete-floors-ajax', function(req, res) {
    let data = req.body;
  
    let query1 = `DELETE FROM Floors WHERE floorID = ?`;
  
    db.pool.query(query1, [data.id], function(error, rows, fields){
      if(error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    });
});

app.delete('/delete-bookGenre-ajax', function(req, res) {
    let data = req.body;
  
    let query1 = `DELETE FROM Book_Genres WHERE bookID = ${data.bookID} AND genreID = ${data.genreID}`;
  
    db.pool.query(query1, function(error, rows, fields){
      if(error) {
        console.log(error);
        res.sendStatus(400);
      } else {
        res.sendStatus(204);
      }
    });
  });



//Put is for UPDATE
app.put('/put-genre-ajax', function(req,res,next){
    let data = req.body;
    let floor = parseInt(data.floor);
    let genre = parseInt(data.genre);

    let queryUpdateFloor = `UPDATE Genres SET floorID = ? WHERE genreID = ?`;
    let selectFloor = `SELECT * FROM Floors WHERE floorID = ?`;

    db.pool.query(queryUpdateFloor,[floor, genre], function(error,rows,fields){
        if(error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            // Run the second query
            db.pool.query(selectFloor, [floor], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })

})

app.put('/put-book-ajax', function(req,res,next){
    let data = req.body;
    let floor = parseInt(data.floor);
    let book = parseInt(data.book); 
    let author = parseInt(data.author);
    let bookCount = parseInt(data.bookCount);
    let price = parseFloat(data.price);


    let queryExtraData = `SELECT Books.authorID, Books.floorID, Books.price, Books.totalCount FROM Books WHERE BookID = ?`;
    let queryUpdateBook = `UPDATE Books SET floorID = ?, authorID = ?, price = ?, totalCount = ? WHERE bookID = ?`;
    let selectInfo = `SELECT Authors.authorName, Floors.floorName, Books.price, Books.totalCount FROM Books JOIN Authors on Books.authorID = Authors.authorID JOIN Floors on Books.floorID = Floors.floorID WHERE BookID = ?`;

    db.pool.query(queryExtraData,[book], function(error,rows,fields){
        if(isNaN(floor))
        {floor = rows[0].floorID}

        if(isNaN(author))
        {author = rows[0].authorID}

        if(isNaN(bookCount))
        {bookCount = rows[0].totalCount}

        if(isNaN(price))
        {price = rows[0].price}
    db.pool.query(queryUpdateBook,[floor, author, price, bookCount, book], function(error,rows,fields){
        if(error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            // Run the second query
            db.pool.query(selectInfo, [book], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
    })
})

app.put('/put-author-ajax', function(req,res,next){
    let data = req.body;
    let author = parseInt(data.authorID);

    let queryUpdateFloor = `UPDATE Authors SET authorName = ? WHERE authorID = ?`;
    let selectFloor = `SELECT * FROM Authors WHERE authorID = ?`;

    db.pool.query(queryUpdateFloor,[data.authorName, author], function(error,rows,fields){
        if(error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            // Run the second query
            db.pool.query(selectFloor, [author], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })

})

app.put('/put-floor-ajax', function(req,res,next){
    let data = req.body;
    let floor = parseInt(data.floorID);

    let queryUpdateFloor = `UPDATE Floors SET floorName = ? WHERE floorID = ?`;
    let selectFloor = `SELECT * FROM Floors WHERE floorID = ?`;

    db.pool.query(queryUpdateFloor,[data.floorName, floor], function(error,rows,fields){
        if(error){
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            // Run the second query
            db.pool.query(selectFloor, [floor], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })

})

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});