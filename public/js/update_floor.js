// Get the objects we need to modify
let updateFloorForm = document.getElementById('update-floor-form-ajax');

// Modify the objects we need
updateFloorForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFloorName = document.getElementById("mySelect");
    let inputNewFloorName = document.getElementById("input-name-update");

    // Get the values from the form fields
    let floorNameValue = inputFloorName.value;
    let newFloorNameValue = inputNewFloorName.value;

    if(inputFloorName.value == "" || inputNewFloorName.value == "")
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        floorID: floorNameValue,
        floorName: newFloorNameValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-floor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, floorNameValue);

            inputFloorName.value = '';
            inputNewFloorName.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, floorID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("floor-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == floorID) {

            // Get the location of the row where we found the matching author ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of author name value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign author name to our new value
            td.innerHTML = parsedData[0].floorName; 
       }
    }
}