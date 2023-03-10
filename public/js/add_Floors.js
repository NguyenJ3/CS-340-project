let addFloorForm = document.getElementById('add-floor-form');

addFloorForm.addEventListener("submit", function(e){
    e.preventDefault();

    let inputFloorName = document.getElementById("input-floorName");

    let floorNameValue = inputFloorName.value;

    let data = {
        floorName: floorNameValue
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-floor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            addRowToTable(xhttp.response);

            inputFloorName.value = '';
        }
        else if(xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});

addRowToTable = (data) =>{

    let currentTable = document.getElementById("floor-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let floorNameCell = document.createElement("TD");

    let deleteCellCase = document.createElement("TD");

    idCell.innerText = newRow.floorID;
    floorNameCell.innerText = newRow.floorName;

    let deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteFloor(newRow.floorID);
    };

}