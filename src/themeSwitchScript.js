function toggleMode(){
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') { // If current theme is Dark, switch to Light
        document.documentElement.setAttribute('data-bs-theme','light')
        var text = document.getElementById("btnSwitch");
        
        collapseMenu(); // Collapse Burger Menu if open

        text.textContent = "Dark Mode"; // Change button text to "Dark Mode"
        localStorage.setItem("mode", "Light"); // Store mode in local storage
    }
    else { 
        document.documentElement.setAttribute('data-bs-theme','dark') // If current theme is Light, switch to Dark
        var text = document.getElementById("btnSwitch");

        collapseMenu(); // Collapse Burger Menu if open

        text.textContent = "Light Mode"; // Change button text to "Light Mode"
        localStorage.setItem("mode", "Dark"); // Store mode in local storage
    }
}

// Loads the mode from local storage
function loadMode(){
var mode = localStorage.getItem("mode"); // Gets the mode from local storage
if (mode == "Light"){
    document.documentElement.setAttribute('data-bs-theme','light') // If mode is Light, set theme to Light
    var text = document.getElementById("btnSwitch");
    text.textContent = "Dark Mode"; // Change button text to "Dark Mode"
}
else{
    document.documentElement.setAttribute('data-bs-theme','dark') // If mode is Dark, set theme to Dark
    var text = document.getElementById("btnSwitch");
    text.textContent = "Light Mode"; // Change button text to "Light Mode"
}
}

// Collapses the Burger Menu
function collapseMenu(){
if (document.documentElement.clientWidth < 992){
    const navbar = document.getElementById("navbarNav");
    navbar.setAttribute('class', 'navbar-collapse collapse')
}
}