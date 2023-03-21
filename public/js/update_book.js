// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookName = document.getElementById("mySelect");
    let inputAuthorName = document.getElementById("input-author-update");
    let inputFloorName = document.getElementById("input-floor-update");
    let inputPrice = document.getElementById("input-price-update");
    let inputBookCount = document.getElementById("input-bookCount-update");

    // Get the values from the form fields
    let bookNameValue = inputBookName.value;
    let authorNameValue = inputAuthorName.value;
    let floorNameValue = inputFloorName.value;
    let priceValue = inputPrice.value;
    let bookCountValue = inputBookCount.value;
    

    if (isNaN(floorNameValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        book: bookNameValue,
        author: authorNameValue,
        floor: floorNameValue,
        price: priceValue,
        bookCount: bookCountValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            //updateRow(xhttp.response, bookNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, genreID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("genre-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == genreID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].floorName; 
       }
    }
}