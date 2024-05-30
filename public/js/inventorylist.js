'use strict' 
 

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplayList");
    // Set up the table labels
    let dataTable = '<thead>';
    dataTable += '<tr><th>Sorted Vehicle Information</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    // Set up the table body
    dataTable += '<tbody>';
    dataTable += `<tr>
        <td>Classification</td> 
        <td>Make</td>  
        <td>Model</td>
        <td>Color</td>
        <td>Year</td>
        <td>Miles</td>
        <td>Price</td>
    </tr>`;
    // Iterate over all vehicles in the array and put each in a row
    data.forEach(function (element) {
     console.log(element.inv_id + ", " + element.inv_model);
     dataTable += `<tr>
        <td>${element.classification_name}</td>
        <td>${element.inv_make}</td>
        <td>${element.inv_model}</td>
        <td>${element.inv_color}</td>
        <td>${element.inv_year}</td>
        <td>${element.inv_miles}</td>
        <td>${element.inv_price}</td>
    </tr>`;
    })
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable;
}


