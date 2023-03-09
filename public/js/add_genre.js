let addGenreForm = document.getElementById('add-genre-form');

addGenreForm.addEventListener("submit", function(e){
    e.preventDefault();

    let inputGenreName = document.getElementById("input-genreName");
    let inputFloorName = document.getElementById("input-floorName");

    let genreNameValue = inputGenreName.value;
    let floorNameValue = inputFloorName.value;

    let data = {
        genreName: genreNameValue,
        floorName: floorNameValue
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            addRowToTable(xhttp.response);

            inputGenreName.value = '';
            inputFloorName.value = '';
        }
        else if(xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});

addRowToTable = (data) =>{

    let currentTable = document.getElementById("genre-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let genreNameCell = document.createElement("TD");
    let floorNameCell = document.createElement("TD");

    let deleteCellCase = document.createElement("TD");

    idCell.innerText = newRow.genreID;
    genreNameCell.innerText = newRow.genreName;
    floorNameCell.innerText = newRow.floorName;

    let deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteGenre(newRow.genreID);
    };

    deleteCellCase.appendChild(deleteCell);
    row.appendChild(idCell);
    row.appendChild(genreNameCell);
    row.appendChild(floorNameCell);
    row.appendChild(deleteCellCase);
    row.setAttribute('data-value', newRow.genreID);

    currentTable.appendChild(row);


    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.genreName;
    option.value = newRow.genreID;
    selectMenu.add(option);

}