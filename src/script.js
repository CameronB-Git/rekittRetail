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
                            displayProduct(products[index]);
                        });
                    });

                    // Display the information of the first product on page load
                    if (products.length > 0) {
                        displayProduct(products[0]);
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
        if (nonEmptyLines.length % 4 !== 0) {
            return [];
        }
    
        const productEntries = [];
        for (let i = 0; i < nonEmptyLines.length; i += 4) {
            const productImage = nonEmptyLines[i].trim();
            const productName = nonEmptyLines[i + 1].trim();
            const productPrice = parseFloat(nonEmptyLines[i + 2].trim());
            const productMaxQuantity = parseInt(nonEmptyLines[i + 3].trim());
    
            productEntries.push({ productImage, productName, productPrice, productMaxQuantity });
            console.log(productMaxQuantity);
        }
        return productEntries;
    }
    

    // Function to display product information based on the selected product
    function displayProduct(product) {
        console.log("Selected product:", product); // Log selected product
        // Update Product Image
        const imageElement = document.getElementById('productImage');
        imageElement.src = product.productImage;
    
        // Update Product Name
        const nameElement = document.getElementById('productName');
        nameElement.textContent = product.productName;
    
        // Update Product Price
        const priceElement = document.getElementById('productPrice');
        priceElement.textContent = `£${product.productPrice}`;
    }
});
