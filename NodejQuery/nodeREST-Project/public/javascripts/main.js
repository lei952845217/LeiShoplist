Notes = [];

changeName = '';
document.addEventListener("DOMContentLoaded", function (event) {

    let listUl = document.getElementById("listUl");
    UpdateDisplay(listUl);


    $(document).on('pagebeforeshow', '#Home', function () {
            let listUl = document.getElementById("listUl");
            UpdateItem(listUl);
        }
    );

    $(document).on('pagebeforeshow', '#Delete', function () {
            let deleteListUl = document.getElementById("deleteListUl");
            UpdateDisplay(deleteListUl);
            document.getElementById("deleteItem").value = "";
        }
    );


    $(document).on('pagebeforeshow', '#Add', function () {
            document.getElementById("type").value = "";
            document.getElementById("name").value = "";
            document.getElementById("qty").value = "";
            document.getElementById("price").value = "";
        }
    );

    $(document).on('pagebeforeshow', '#Change', function () {
            document.getElementById("changeQty").value = "";
        }
    );


    document.getElementById("newNote").addEventListener("click", function () {
        //      newNote.push( new Note( document.getElementById("type").value,
        //     document.getElementById("name").value,
        //     document.getElementById("qty").value ,
        //     document.getElementById("price").value) );

        // });

        let newNote = new Note(document.getElementById("type").value,
            document.getElementById("name").value,
            document.getElementById("qty").value,
            document.getElementById("price").value);
        $.ajax({
            url: "/AddNote",
            type: "POST",
            data: JSON.stringify(newNote),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                console.log(result);
            }
        });

    });

    document.getElementById("delete").addEventListener("click", function () {
        let which = document.getElementById("deleteItem").value;
        // let found = false;
        // for(var i = 0; i < Notes.length; i++)
        // {
        //     if(Notes[i].name === which){
        //         Notes.splice(i,1);
        //         found = true;
        //     }
        // }
        // if(!found){
        //     document.getElementById("deleteItem").value = "Sorry, could not find";
        // }

        $.ajax({
            type: "DELETE",
            url: "/DeleteNote/" + which,
            success: function (result) {
                console.log(result);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
                alert("Server could not delete Note with title " + which)
            }
        });

    });

    document.getElementById("change").addEventListener("click", function () {
        let qty = document.getElementById("changeQty").value;
        let name = changeName
        let found = false;
        for(var i = 0; i < Notes.length; i++)
        {
            if(Notes[i].name === changeName){
                Notes.push( new Note(Notes[i].type, Notes[i].name, qty,Notes[i].price));
                Notes.splice(i,1);
                found = true;
            }
        }
        // let listUl = document.getElementById("listUl");
        // UpdateDisplay(listUl);
        $.ajax({
            url: "/Change",
            type: "POST",
            data: JSON.stringify(Notes),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                console.log(result);
            }
        });

        // $.ajax({
        //     type: "POST",
        //     data:{note:JSON.stringify(Notes)},
        //     url: "/Change",
        //     success: function (result) {
        //         console.log(result);
        //     },
        //     error: function (xhr, textStatus, errorThrown) {
        //         console.log('Error in Operation');
        //     }
        //
        // });


    });


});


function Note(pType, pName, pQty, pPrice) {
    this.type = pType;
    this.name = pName;
    this.qty = pQty;
    this.price = pPrice;
}

function changeQtyName(name) {
    changeName = name;
}

function UpdateDisplay(whichElement) {
    console.log(Notes)
    whichElement.innerHTML = "";
    Notes.sort(function (a, b) {
        return (a.type) - (b.type);
    });
    Notes.forEach(function (item, index) {
        var li = document.createElement('li');
        whichElement.appendChild(li);
        li.innerHTML = li.innerHTML + item.type + ":  " + item.name + " *   " + item.qty + item.price + "   <a href='#Change' onclick=\"changeQtyName('" + item.name + "')\">Change Qty</a>";
    });
}

function UpdateItem(whichElement) {
    $.get("/getAllNotes", function (data, status) {  // AJAX get
        Notes = data;  // put the returned server json data into our local array
        console.log(Notes)

        whichElement.innerHTML = "";
        var toatalPrc = 0;
        Notes.sort(function (a, b) {
            return (a.type) - (b.type);
        });
        html = '<table>';
        Notes.forEach(function (item, index) {
            // html = html+"<tr>";
            // html = html+"<td>"+item.type+"</td>"+"<td>"+item.name+"</td>"+"<td>"+item.qty+"</td>"+"<td>"+item.price+"</td>"+"<td>"+"<a href='#Change' onclick=\"changeQtyName('" + item.name + "')\">Change Qty</a>"+"</td>"
            // html = html+"</tr>";
            // if(html) {
            //     document.getElementById("goodlist").innerHTML = html
            // }
            var li = document.createElement('li');
            whichElement.appendChild(li);
            var prc = parseFloat(item.qty) * parseFloat(item.price);
            toatalPrc = toatalPrc + prc;
            li.innerHTML = li.innerHTML + item.type + ":&nbsp;&nbsp;&nbsp;&nbsp;" + item.name + "&nbsp;&nbsp;&nbsp;" + item.qty + "&nbsp;&nbsp;&nbsp;" + item.price + "&nbsp;&nbsp;<a href='#Change' onclick=\"changeQtyName('" + item.name + "')\">Change Qty</a>";
            document.getElementById("TotalPrice").innerHTML = "The total price is " + toatalPrc;
        });
    });

}
