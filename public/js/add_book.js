let addBookForm = document.getElementById('add-book-form');

addBookForm.addEventListener("submit", function(e){
    e.preventDefault();

    let inputBookName = document.getElementById("input-bookName");
    let inputAuthorID = document.getElementById("input-authorName");
    let inputFloorID = document.getElementById("input-floorName");
    let inputPrice = document.getElementById("input-price");
    let inputBookCount = document.getElementById("input-bookCount");

    let bookNameValue = inputBookName.value;
    let authorNameValue = inputAuthorID.value;
    let floorNameValue = inputFloorID.value;
    let priceValue = inputPrice.value;
    let bookCountValue = inputBookCount.value;

    let data = {
        bookName: bookNameValue,
        authorID: authorNameValue,
        floorID: floorNameValue,
        price: priceValue,
        totalCount: bookCountValue
    };

    if(bookNameValue != '')
    {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if(xhttp.readyState == 4 && xhttp.status == 200){
            addRowToTable(xhttp.response);

            inputBookName.value = '';
            inputAuthorID.value = '';
            inputFloorID.value = '';
            inputPrice.value = '';
            inputBookCount.value = '';
        }
        else if(xhttp.readyState == 4 && xhttp.status != 200){
            console.log("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
    }
});

addRowToTable = (data) =>{

    let currentTable = document.getElementById("book-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let bookNameCell = document.createElement("TD");
    let authorNameCell = document.createElement("TD");
    let floorNameCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let totalCountCell = document.createElement("TD");

    let deleteCellCase = document.createElement("TD");

    idCell.innerText = newRow.bookID;
    bookNameCell.innerText = newRow.bookName;
    authorNameCell.innerText = newRow.authorName;
    floorNameCell.innerText = newRow.floorName;
    priceCell.innerText = newRow.price;
    totalCountCell.innerText = newRow.totalCount;

    let deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBook(newRow.bookID);
    };

    deleteCellCase.appendChild(deleteCell);
    row.appendChild(idCell);
    row.appendChild(bookNameCell);
    row.appendChild(authorNameCell);
    row.appendChild(floorNameCell);
    row.appendChild(priceCell);
    row.appendChild(totalCountCell);
    row.appendChild(deleteCellCase);
    row.setAttribute('data-value', newRow.bookID);

    currentTable.appendChild(row);


    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.bookName;
    option.value = newRow.bookID;
    selectMenu.add(option);

}