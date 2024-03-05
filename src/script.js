let selectedProductIndex; // Define a global variable
var items = [];
let productEntries = [];
let totalPrice = 0;
let divNumber;

document.addEventListener("DOMContentLoaded", function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/Assets/medicationInformation.txt', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = xhr.responseText;
                if (data) {
                    const products = parseProductData(data);
                    const dropdownItems = document.querySelectorAll('.dropdown-item');
                    dropdownItems.forEach((item, index) => {
                        item.addEventListener('click', () => {
                            selectedProductIndex = index; // Set selectedProductIndex
                            displayProduct(products[index], index); // Pass index to displayProduct
                        });
                    });

                    // Display the information of the first product on page load
                    if (products.length > 0) {
                        selectedProductIndex = 0; // Set selectedProductIndex to 0
                        displayProduct(products[0], 0); // Pass index to displayProduct
                    }
                }
            }
        }
    };
    xhr.send();
    
    // Function to parse product data from the text file
    function parseProductData(data) {
        if (!data) {
            return [];
        }
    
        const lines = data.trim().split('\n').map(line => line.replace(/\r$/, ''));
        const nonEmptyLines = lines.filter(line => line.trim() !== ''); // Filter out empty lines
        if (nonEmptyLines.length % 7 !== 0) {
            return [];
        }
    
        for (let i = 0; i < nonEmptyLines.length; i += 7) {
            const productImage = nonEmptyLines[i].trim();
            const productName = nonEmptyLines[i + 1].trim();
            const productPrice = nonEmptyLines[i + 2].trim();
            const productMaxQuantity = parseInt(nonEmptyLines[i + 3].trim());
            const productPIL = nonEmptyLines[i + 4].trim();
            const productHowToUse = nonEmptyLines[i + 5].trim();
            const productHowToUseTwo = nonEmptyLines[i + 6].trim();
            
            productEntries.push({ productImage, productName, productPrice, productMaxQuantity, productPIL, productHowToUse, productHowToUseTwo});
        }
        return productEntries;
    }
    

    // Function to display product information based on the selected product
    function displayProduct(product, index) {
        var url = window.location.pathname;
        var filename = url.substring(url.lastIndexOf('/')+1);
        if (filename != "basket.html" && filename != "billingInformation.html"){
            // Update Product Image
            const imageElement = document.getElementById('productImage');
            imageElement.src = product.productImage;

            // Update Product Name
            const nameElement = document.getElementById('productName');
            nameElement.textContent = product.productName;

            // Update Product Price
            const priceElement = document.getElementById('productPrice');
            priceElement.textContent = `£${product.productPrice}`;

            // Update Product Price
            const pilElement = document.getElementById('productPIL');
            pilElement.href = `${product.productPIL}`;

            // Update How To Use
            const howToUse = document.getElementById('howToUse');
            howToUse.innerHTML = `${product.productHowToUse}`;

            // Update How To Use Two
            const howToUseTwo = document.getElementById('howToUseTwo');
            if (product.productHowToUseTwo != "None"){
                howToUseTwo.innerHTML = `${product.productHowToUseTwo}`;
            }
            else{
                howToUseTwo.textContent = null;
            }
        }  
    }
});

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
            
            if ((productEntries[selectedProductIndex[i]].productName).includes("Capsules")){
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
            if ((productEntries[selectedProductIndex[i]].productName).includes("Capsules")){
                newImg.className = 'productImageLarge';
            }
            else{
                newImg.className = 'productImage';
            }
            newImg.src = productEntries[selectedProductIndex[i]].productImage;
            target.appendChild(newImg);

            // Creating Product Name inside of Div
            target = document.querySelector(`.${textColumn}`)
            var newName = document.createElement('h3');
            newName.className = 'productName d-inline';
            newName.textContent = productEntries[selectedProductIndex[i]].productName;
            target.appendChild(newName);

            // Creating Product Price inside of Div
            var newPrice = document.createElement('h5');
            newPrice.className = 'productPrice d-inline';
            newPrice.textContent = `£${productEntries[selectedProductIndex[i]].productPrice}`;
            target.appendChild(newPrice);

            // Add Remove Button inside of div
            var removeButton = document.createElement('a');
            removeButton.className = 'removeButton d-inline';
            removeButton.href = "#";
            removeButton.textContent = 'Remove';
            removeButton.id = div.id;
            //removeButton.onclick = removeItem(removeButton.id);
            target.appendChild(removeButton);  

            totalPrice = totalPrice + (parseFloat(productEntries[selectedProductIndex[i]].productPrice));
        }


        // Add Subtotal Information 
        var target = document.querySelector('#div0')
        var subtotalDiv = document.createElement('div');
        subtotalDiv.className = 'container-fluid subtotalContainer';
        target.parentNode.insertBefore(subtotalDiv, target.nextSibling);

        var subtotalHeading = document.createElement('h5');
        subtotalHeading.className = 'normalFont';
        subtotalHeading.textContent = `Subtotal: £${totalPrice}`;
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
}

function addItemToBasket() {
    if (typeof selectedProductIndex !== 'undefined') {
        console.log("Selected product index:", selectedProductIndex);

        items.push(selectedProductIndex);
        localStorage.setItem("item", JSON.stringify(items));
        alert(`Added ${productEntries[selectedProductIndex].productName} to your basket!`)
    } else {
        console.error("No product selected.");
    }
}

function getItemIndex() {
    var itemIndex = localStorage.getItem("item");

    // Parse the JSON string into an array
    return JSON.parse(itemIndex);
}

function removeItem(id){
    var itemToRemove = document.querySelector(`div${id}`)
    itemToRemove.remove();
}


