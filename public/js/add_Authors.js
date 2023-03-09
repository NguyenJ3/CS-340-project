let addAuthorForm = document.getElementById('add-author-form');

addAuthorForm.addEventListener("submit", function(e){
    e.preventDefault();

    let inputAuthorName = document.getElementById("input-authorName");

    let authorNameValue = inputAuthorName.value;

    let data = {
        authorName: authorNameValue
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            addRowToTable(xhttp.response);

            inputAuthorName.value = '';
        }
        else if(xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});

addRowToTable = (data) =>{

    let currentTable = document.getElementById("author-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let authorNameCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    idCell.innerText = newRow.authorID;
    authorNameCell.innerText = newRow.authorName;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteAuthor(newRow.authorID);
    };

    row.appendChild(idCell);
    row.appendChild(authorNameCell);

    row.appendChild(deleteCell);
    row.setAttribute('data-value', newRow.authorID);

    currentTable.appendChild(row);

}