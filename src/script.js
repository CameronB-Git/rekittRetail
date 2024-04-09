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
        products = data.products; // Assign product data to the global variable products

        loadProductInfo(selectedProductIndex); // Initialize selected product index and load first product  
        getTwoRandomProducts(products);    
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
            if (selectedProductIndex === undefined) selectedProductIndex = firstItemId;

            // Call a function to add the product to the basket, passing the selected product ID as a parameter
            addItemToBasket([selectedProductIndex]);
            
        });

        document.getElementById('addAllThreeToBasketBtn').addEventListener('click', function() {
            if (selectedProductIndex === undefined) selectedProductIndex = firstItemId;

            var secondItem = parseInt(document.querySelector('.secondProduct').id);
            var thirdItem = parseInt(document.querySelector('.thirdProduct').id);

            selectedProductIndex = [selectedProductIndex, secondItem, thirdItem];

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

        if (selectedProduct.brand == "gaviscon"){
            document.getElementById('productPrice').innerHTML = `WAS: £${selectedProduct.price.toFixed(2)}`;
            document.getElementById('productPriceNow').innerHTML = `NOW: £${(selectedProduct.price * 0.8).toFixed(2)}`;
        }
        else document.getElementById('productPrice').innerText = '£' + selectedProduct.price.toFixed(2); // Set Price to 2 Decimal Places           

        document.getElementById('howToUse').innerHTML = selectedProduct.howToUse;
        document.getElementById('productPIL').href = selectedProduct.pilLocation;
        document.getElementById('hazardsCautions').innerHTML = selectedProduct.hazardsCautions;
    
        // If product has a 2nd/3rd how to use, display it
        if (selectedProduct.howToUseTwo != undefined) document.getElementById('howToUseTwo').innerHTML = selectedProduct.howToUseTwo;
        else document.getElementById('howToUseTwo').innerHTML = "";
    
        if(selectedProduct.howToUseThree != undefined) document.getElementById('howToUseThree').innerHTML = selectedProduct.howToUseThree;
        else document.getElementById('howToUseThree').innerHTML = "";
    
        // Update FBT Section 'Initial Product' Image
        document.querySelector('.initialProduct').src = selectedProduct.imageLocation;
    }
}

function addItemToBasket(selectedProductIndex) {
    // Retrieve current basket items from local storage or initialize an empty array
    let basketItems = JSON.parse(localStorage.getItem('basket')) || [];

    // Setting the Item to Add as the 'selectedProductIndex'
    for (let i = 0; i < selectedProductIndex.length; i++){
        let item = selectedProductIndex[i]; 
        item = parseInt(item);

        // Set Number of Ibuprofen/Paracetamol Products Found to 0
        var ibuprofenProductsFound = 0;
        var paracetamolProductsFound = 0;
    
        if (ibuprofenContaining.includes(item)){
            for (let i = 0; i < basketItems.length; i++){
                if (ibuprofenContaining.includes(basketItems[i])){
                    ibuprofenProductsFound++;
                    if (ibuprofenProductsFound >= 2) alert("You cannot add more than two Ibuprofen products to your basket."); return;  
                }
            }
        }  
        
        if (paracetamolContaining.includes(item)){
            for (let i = 0; i < basketItems.length; i++){
                if (paracetamolContaining.includes(basketItems[i])){
                    paracetamolProductsFound++;
                    if (paracetamolProductsFound >= 2) alert("You cannot add more than two Paracetamol products to your basket."); return;
                }
            }
        }  
    
        // Update Basket --> Adds index of selected product to the basket
        basketItems.push(item);
    
        // Store the updated basket in local storage
        alert(`Added ${products[item].name} to your basket!`)
    }

    localStorage.setItem('basket', JSON.stringify(basketItems));
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

            // TWO ROWS IN CONTAINER --> Create Two Divs inside of DivRow
            var target = document.querySelector('.row');
            var divLeft = document.createElement('div');
            divLeft.className = imageColumn;
            target.appendChild(divLeft);

            var divRight = document.createElement('div');
            divRight.className = textColumn;
            target.appendChild(divRight);

            // PRODUCT IMAGE --> Creating Image inside of Div
            var target = document.querySelector(`.${imageColumn}`);
            var newImg = document.createElement('img');
            if ((selectedProduct.name).includes("Capsules")) newImg.className = 'productImageLarge';
            else newImg.className = 'productImage';
            newImg.src = selectedProduct.imageLocation;
            target.appendChild(newImg);

            // PRODUCT NAME --> Creating Product Name inside of Div
            target = document.querySelector(`.${textColumn}`)
            var newName = document.createElement('h3');
            newName.className = 'productName d-inline';
            newName.textContent = selectedProduct.name;
            target.appendChild(newName);

            // PRODUCT PRICE --> Creating Product Price inside of Div
            var newPrice = document.createElement('h5');
            newPrice.className = 'productPrice d-inline';
            newPrice.textContent = `£${selectedProduct.price.toFixed(2)}`;
            target.appendChild(newPrice);

            // REMOVE BUTTON --> Add Remove Button inside of div
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
        h2.className = 'text-center noItems';
        h2.style.marginTop = '6rem';
        h2.textContent = "You currently have no items in your basket.";
        target.parentNode.insertBefore(h2, target.nextSibling);
    }
}

function displayOrderSummary(){
    selectedProductIndex = getItemIndex();
    var standardDelivery = 5.99;
    var itemPrice = document.querySelector('.totalItemPrice');
    var deliveryFee = document.querySelector('.deliveryFee');
    
    // Get Total Price for Items in Basket
    if (Array.isArray(selectedProductIndex) && selectedProductIndex.length > 0) {
        for (let i = 0; i < selectedProductIndex.length; i++) {
            selectedProduct = products[selectedProductIndex[i]]; // Get the selected product
            totalPrice = totalPrice + (parseFloat(selectedProduct.price));
        }
    }

    itemPrice.innerHTML = `Items: £${totalPrice.toFixed(2)}`;
    deliveryFee.innerHTML = `Delivery Fee: £${standardDelivery}`;

    if (totalPrice > 15){
        var promotionApplied = document.createElement('h5');
        promotionApplied.className = 'mt-3'
        promotionApplied.innerHTML = `Promotion #2 Applied: -£${standardDelivery}`
        deliveryFee.appendChild(promotionApplied);
    }
    else totalPrice += standardDelivery;

    // Special Offer #3 //
    if (totalPrice > 25.0){
        totalPrice -= 10;

        // Create New HTML Heading for New Promotion Applied
        var promotionApplied = document.createElement('h5');
        promotionApplied.className = 'mt-3'
        promotionApplied.innerHTML = 'Promotion #3 Applied: -£10.00';
        deliveryFee.appendChild(promotionApplied);
    }
    
    var orderTotal = document.querySelector('.orderTotal');
    orderTotal.innerHTML = `Order Total: £${totalPrice.toFixed(2)}`;
}

function getTwoRandomProducts(products) {
    var [randomIndexOne, randomIndexTwo] = [0, 0];
    var productIDs = [];

    // Filter Products for Lemsip, Strepsils, Nurofen
    var productsForRandom = products.filter(product => product.brand === "lemsip" || product.brand === "strepsils" || product.brand === "nurofen");
    for (i = 0; i < productsForRandom.length; i++) productIDs.push(parseInt((productsForRandom[i].id) - 1));

    selectedProductIndex = document.querySelector('#productOption .dropdown-item').id;

    while (randomIndexOne == randomIndexTwo || randomIndexOne == selectedProductIndex || randomIndexTwo == selectedProductIndex) {
        var randomIndexOne = productIDs[Math.floor(Math.random()*productIDs.length)];
        var randomIndexTwo = productIDs[Math.floor(Math.random()*productIDs.length)];
    }

    while (products[randomIndexOne].brand == "lemsip" && products[randomIndexTwo].brand == "lemsip" || products[randomIndexOne].brand == "nurofen" && products[randomIndexTwo].brand == "nurofen"){        
        randomIndexTwo = productIDs[Math.floor(Math.random()*productIDs.length)];
    }

    document.querySelector('.secondProduct').id = randomIndexOne;
    document.querySelector('.thirdProduct').id = randomIndexTwo;

    document.querySelector('.secondProduct').src = products[randomIndexOne].imageLocation;
    document.querySelector('.thirdProduct').src = products[randomIndexTwo].imageLocation;

    document.querySelector('.totalPriceForThree').innerHTML = `Total Price: £${(products[randomIndexOne].price + products[randomIndexTwo].price).toFixed(2)}`;
}

function removeParentElement() {
    removeButton = document.querySelector('.removeButton');

    let itemIndex = parseInt(removeButton.id); // Get selectedProductIndex assosciated with the clicked removed button

    let basketItems = JSON.parse(localStorage.getItem('basket')); // Get Basket from localStorage

    let indexToRemove = basketItems.indexOf(itemIndex); // Find Index

    // If item exists in arr --> Remove Item + Update Basket in localStorage
    if (indexToRemove !== -1) {
        basketItems.splice(indexToRemove, 1);
        localStorage.setItem('basket', JSON.stringify(basketItems));
    }

    var parentElement = removeButton.parentNode.parentNode.parentNode; // Get Entire Container of Remove Button
    
    parentElement.parentNode.removeChild(parentElement); // Remove It

    window.location.reload(); // Reload the page to reflect the changes
}

function getItemIndex() {
    var itemIndex = localStorage.getItem("basket");

    return JSON.parse(itemIndex); // Parse JSON String --> Arr
}
