function initializeMenuBurger() {
    const menuToggle = document.getElementById("menu-toggle");
    const navbarMenu = document.getElementById("navbar-menu");

    // Vérifier si les éléments existent dans le DOM
    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener("click", function () {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !isExpanded);
            navbarMenu.classList.toggle("hidden");
        });
        
    } else {
        console.error("Le menuToggle ou navbarMenu n'a pas été trouvé dans le DOM.");
    }
};

document.addEventListener("DOMContentLoaded", initializeMenuBurger);
 