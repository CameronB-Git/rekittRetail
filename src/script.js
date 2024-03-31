let selectedProductIndex; // Define a global variable
let products; // Define a global variable to hold product data
let product;
var items = [];
let selectedProduct;
let firstItemId;
let totalPrice = 0;
let unNeededPages = ["index.html", "basket.html", "checkout.html", "confirmation.html", "billingInformation.html"];
let ibuprofenContaining = [9, 10, 11, 12, 13];
let paracetamolContaining = [14, 15, 16, 17, 18];

document.addEventListener("DOMContentLoaded", function() {
    // Load product data from JSON
    fetch('/src/products.json')
    .then(response => response.json())
    .then(data => {
        // Assign product data to the global variable products
        products = data.products;

        // Initialize selected product index and load first product
        loadProductInfo(selectedProductIndex);        
    })
    .catch(error => console.error('Error loading product data:', error));
    
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/')+1);
    if (unNeededPages.includes(filename) == false){
        var dropdownProductItems = document.querySelectorAll('#productOption .dropdown-item');
        var firstDropdownItem = document.querySelector('#productOption .dropdown-item');
        firstItemId = parseInt(firstDropdownItem.id);

        dropdownProductItems.forEach(function(item) {
            item.addEventListener('click', function() {
                selectedProductIndex = item.id;
                loadProductInfo(selectedProductIndex);
            });
        });

        document.getElementById('addToBasketBtn').addEventListener('click', function() {
            if (selectedProductIndex === undefined) {
                selectedProductIndex = firstItemId;
            }

            // Call a function to add the product to the basket, passing the selected product ID as a parameter
            addItemToBasket(selectedProductIndex);
            
        });
    }
});


// Function to load product information based on selected product index
function loadProductInfo(selectedProductIndex) {
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/')+1);
    if (unNeededPages.includes(filename) == false){
        if (selectedProductIndex === undefined) {
            // Get the first dropdown item and retrieve its ID
            var firstDropdownItem = document.querySelector('#productOption .dropdown-item');
            var firstItemId = parseInt(firstDropdownItem.id);
            selectedProductIndex = firstItemId;
            selectedProduct = products[selectedProductIndex]; // Get the selected product
        }
        
        selectedProduct = products[selectedProductIndex]; // Get the selected product
    
        // Update product image, name, price, and other relevant information
        document.getElementById('productImage').src = selectedProduct.imageLocation;
        document.getElementById('productImage').alt = `${selectedProduct.name} (Product) Image`; // Set Alt Text for Image
        document.getElementById('productImage').title = selectedProduct.name; // Set Title for Product Name
        document.getElementById('productName').innerText = selectedProduct.name;
        document.getElementById('productPrice').innerText = '£' + selectedProduct.price.toFixed(2); // Set Price to 2 Decimal Places
        document.getElementById('howToUse').innerHTML = selectedProduct.howToUse;
        document.getElementById('productPIL').href = selectedProduct.pilLocation;
        document.getElementById('hazardsCautions').innerHTML = selectedProduct.hazardsCautions;
        
    
        // If product has a 2nd/3rd how to use, display it
        if (selectedProduct.howToUseTwo != undefined) {
            document.getElementById('howToUseTwo').innerHTML = selectedProduct.howToUseTwo;
        }
        else{
            document.getElementById('howToUseTwo').innerHTML = "";
        }
    
        if(selectedProduct.howToUseThree != undefined) {
            document.getElementById('howToUseThree').innerHTML = selectedProduct.howToUseThree;
        }
        else{
            document.getElementById('howToUseThree').innerHTML = "";
        }
    }
}

function addItemToBasket() {
    // Retrieve current basket items from local storage or initialize an empty array
    let basketItems = JSON.parse(localStorage.getItem('basket')) || [];

    // Setting the Item to Add as the 'selectedProductIndex'
    let item = selectedProductIndex; 
    item = parseInt(item);

    // Set Number of Ibuprofen/Paracetamol Products Found to 0
    var ibuprofenProductsFound = 0;
    var paracetamolProductsFound = 0;

    if (ibuprofenContaining.includes(item)){
        for (let i = 0; i < basketItems.length; i++){
            if (ibuprofenContaining.includes(basketItems[i])){
                ibuprofenProductsFound++;
                if (ibuprofenProductsFound >= 2){
                    alert("You cannot add more than two Ibuprofen products to your basket.");
                    return;
                }  
            }
        }
    }  
    
    if (paracetamolContaining.includes(item)){
        for (let i = 0; i < basketItems.length; i++){
            if (paracetamolContaining.includes(basketItems[i])){
                paracetamolProductsFound++;
                if (paracetamolProductsFound >= 2){
                    alert("You cannot add more than two Paracetamol products to your basket.");
                    return;
                }  
            }
        }
    }  

    // Update Basket --> Adds index of selected product to the basket
    basketItems.push(item);

    // Store the updated basket in local storage
    localStorage.setItem('basket', JSON.stringify(basketItems));
    alert(`Added ${selectedProduct.name} to your basket!`)
}

function displayProductsInBasket() {
    selectedProductIndex = getItemIndex();

    // If selectedProductInded = Array AND contains >1 product, loop through each.
    if (Array.isArray(selectedProductIndex) && selectedProductIndex.length > 0) {
        for (let i = 0; i < selectedProductIndex.length; i++) {

            // Creating Div (Product Box)
            var target = document.querySelector('#productHeader');
            var div = document.createElement('div');
            div.className = 'container-fluid productBox';
            div.id = `div${i}`;
            target.parentNode.insertBefore(div, target.nextSibling);
            
            // Create Row
            var target = document.querySelector('.container-fluid.productBox');
            var divRow = document.createElement('div');
            divRow.className = 'row';
            target.appendChild(divRow);
            
            selectedProduct = products[selectedProductIndex[i]]; // Get the selected product

            // Set Column Widths --> Helps with Responsiveness
            if ((selectedProduct.name).includes("Capsules")){
                imageColumn = 'col-sm-3';
                textColumn = 'col-sm-9';
            }
            else{
                imageColumn = 'col-sm-2';
                textColumn = 'col-sm-10';
            }

            // Create Two Divs inside of DivRow
            var target = document.querySelector('.row');
            var divLeft = document.createElement('div');
            divLeft.className = imageColumn;
            target.appendChild(divLeft);

            var divRight = document.createElement('div');
            divRight.className = textColumn;
            target.appendChild(divRight);

            // Creating Image inside of Div
            var target = document.querySelector(`.${imageColumn}`);
            var newImg = document.createElement('img');
            if ((selectedProduct.name).includes("Capsules")){
                newImg.className = 'productImageLarge';
            }
            else{
                newImg.className = 'productImage';
            }
            newImg.src = selectedProduct.imageLocation;
            target.appendChild(newImg);

            // Creating Product Name inside of Div
            target = document.querySelector(`.${textColumn}`)
            var newName = document.createElement('h3');
            newName.className = 'productName d-inline';
            newName.textContent = selectedProduct.name;
            target.appendChild(newName);

            // Creating Product Price inside of Div
            var newPrice = document.createElement('h5');
            newPrice.className = 'productPrice d-inline';
            newPrice.textContent = `£${selectedProduct.price.toFixed(2)}`;
            target.appendChild(newPrice);

            // Add Remove Button inside of div
            var removeButton = document.createElement('a');
            removeButton.className = 'removeButton d-inline';
            removeButton.href = "#";
            removeButton.textContent = 'Remove';
            removeButton.id = selectedProductIndex[i];
            removeButton.onclick = function() {
                removeParentElement(selectedProductIndex);
            };
            target.appendChild(removeButton);  

            totalPrice = totalPrice + (parseFloat(selectedProduct.price));
        }

        // Add Subtotal Container 
        var target = document.querySelector('#div0')
        var subtotalDiv = document.createElement('div');
        subtotalDiv.className = 'container-fluid subtotalContainer';
        target.parentNode.insertBefore(subtotalDiv, target.nextSibling);

        // TODO: NEED TO DISPLAY THIS CHANGE TO THE USER INDICATING IT WORKS
        if (totalPrice > 25.0){
            totalPrice -= 10;
        }
        // TODO: ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

        // Add Subtotal Heading + Value
        var subtotalHeading = document.createElement('h5');
        subtotalHeading.className = 'normalFont';
        subtotalHeading.textContent = `Subtotal: £${totalPrice.toFixed(2)}`;
        subtotalDiv.appendChild(subtotalHeading)

        // Add "Checkout Now" Button
        var checkoutButton = document.createElement('button');
        checkoutButton.className = 'btn btn-secondary buttonTemplate mb-5';
        checkoutButton.innerHTML = "<b>Checkout Now</b>";
        checkoutButton.onclick = function() {
            window.location.href = "/checkout.html";
        }
        subtotalDiv.appendChild(checkoutButton)
    } else {
        // Displays if user has Zero(0) Products in Basket
        var target = document.querySelector('#productHeader');
        var h2 = document.createElement('h2');
        h2.classList.add('text-center', 'mt-5');
        h2.textContent = "You currently have no items in your basket.";
        target.parentNode.insertBefore(h2, target.nextSibling);
    }

    // If < 2 Products in Basket, Footer is Fixed to Bottom
    if (selectedProductIndex.length < 2){
        footer = document.querySelector('footer');
        footer.style.position = 'fixed';
    }
}

function getItemIndex() {
    var itemIndex = localStorage.getItem("basket");

    // Parse the JSON string into an array
    return JSON.parse(itemIndex);
}

function removeParentElement() {
    removeButton = document.querySelector('.removeButton');
    // Get the selected product index associated with the clicked remove button
    let itemIndex = parseInt(removeButton.id);

    // Retrieve current basket items from local storage or initialize an empty array
    let basketItems = JSON.parse(localStorage.getItem('basket'));

    // Find the index of the item to remove in the basket array
    let indexToRemove = basketItems.indexOf(itemIndex);

    // Check if the item exists in the basket array
    if (indexToRemove !== -1) {
        // Remove the item from the basket array
        basketItems.splice(indexToRemove, 1);

        // Store the updated basket in local storage
        localStorage.setItem('basket', JSON.stringify(basketItems));
    }

    // Get the parent element of the remove button
    var parentElement = removeButton.parentNode.parentNode.parentNode;
    
    // Remove the parent element
    parentElement.parentNode.removeChild(parentElement);

    window.location.reload(); // Reload the page to reflect the changes
}
