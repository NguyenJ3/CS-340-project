// App.js


var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 10419;                 // Set a port number at the top so it's easy to change in the future

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
        res.render('Authors');
    });

    app.get('/books', function(req, res)
    {
        res.render('Books');
    });

    app.get("/floors", function(req,res){
        res.render('Floors');
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
        res.render('Book_Genres');
    });


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


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});