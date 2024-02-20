let selectedProductIndex; // Define a global variable
var items = [];

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
        if (nonEmptyLines.length % 5 !== 0) {
            return [];
        }
    
        const productEntries = [];
        for (let i = 0; i < nonEmptyLines.length; i += 5) {
            const productImage = nonEmptyLines[i].trim();
            const productName = nonEmptyLines[i + 1].trim();
            const productPrice = nonEmptyLines[i + 2].trim();
            const productMaxQuantity = parseInt(nonEmptyLines[i + 3].trim());
            const productPIL = nonEmptyLines[i + 4].trim();
            
            productEntries.push({ productImage, productName, productPrice, productMaxQuantity, productPIL});
            console.log(productMaxQuantity);
        }
        return productEntries;
    }
    

    // Function to display product information based on the selected product
    function displayProduct(product, index) {
        console.log("Selected product:", product); // Log selected product
        console.log("Selected product index:", index); // Log selected product index
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
    }
});

function displayProductsInBasket(itemIndex){
    
}

function addItemToBasket() {
    if (typeof selectedProductIndex !== 'undefined') {
        // Your code to add the product to the basket goes here
        console.log("Selected product index:", selectedProductIndex);
    } else {
        console.error("No product selected.");
    }

    items.push(selectedProductIndex);
    localStorage.setItem("item", JSON.stringify(items))
}

function getItemIndex(){
    var itemIndex = localStorage.getItem("item")
    console.log(itemIndex);
}


