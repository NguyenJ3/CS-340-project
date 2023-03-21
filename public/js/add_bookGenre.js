let addAuthorForm = document.getElementById('add-bookGenre-form');

addAuthorForm.addEventListener("submit", function(e){
    e.preventDefault();

    let inputbookName = document.getElementById("input-bookName");
    let inputgenreName = document.getElementById("input-genreName");
    let bookNameValue = inputbookName.value;
    let genreNameValue = inputgenreName.value;
    let data = {
        bookName: bookNameValue,
        genreName: genreNameValue
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-bookGenre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            addRowToTable(data);

            inputbookName.value = '';
            inputgenreName.value = '';
        }
        else if(xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});

addRowToTable = (data) =>{

    let currentTable = document.getElementById("bookGenre-table");

    let newRowIndex = currentTable.rows.length;


    let row = document.createElement("TR");
    let bookCell = document.createElement("TD");
    let genreCell = document.createElement("TD");

    let deleteCellCase = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    bookCell.innerText = data.bookName;
    genreCell.innerText = data.genreName;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        delete_bookGenre(data.bookID,data.genreID);
    };

    deleteCellCase.appendChild(deleteCell);
    row.appendChild(bookCell);
    row.appendChild(genreCell);
    row.appendChild(deleteCellCase);

    row.setAttribute('book-value', data.bookID);
    row.setAttribute('genre-value', data.genreID);
    currentTable.appendChild(row);

}