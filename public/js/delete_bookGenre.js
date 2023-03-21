function delete_bookGenre(bookID,genreID){
    // Put our data we want to send in a javascript object
    let data = {
        bookID: bookID,
        genreID: genreID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-bookGenre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(bookID,genreID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(bookID, genreID){
    let table = document.getElementById("bookGenre-table");
    for(let i = 0, row; row = table.rows[i];i++){
        if(table.rows[i].getAttribute("genre-value") == genreID){
            if(table.rows[i].getAttribute("book-value") == bookID)
            {
                table.deleteRow(i);
                break;
            }
        }
    }
}