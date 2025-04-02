document.addEventListener("DOMContentLoaded", function () {
    // Charger les recettes depuis data.json
    fetch("../data/data.json")
        .then(response => response.json())
        .then(data => {
            const recettes = data.recettes.map(recette => recette.nom); // Récupère uniquement les noms des recettes

            // Définir les champs de recherche pour mobile et desktop
            const searchInputs = [
                { input: document.getElementById("search-input-mobile"), list: document.getElementById("suggestions-list-mobile") },
                { input: document.getElementById("search-input-desktop"), list: document.getElementById("suggestions-list-desktop") }
            ];

            searchInputs.forEach(({ input, list }) => {
                let selectedIndex = -1;

                // Gestion de l'input dans la barre de recherche
                input.addEventListener("input", () => {
                    const query = input.value.toLowerCase();
                    list.innerHTML = "";
                    selectedIndex = -1;

                    if (query.length > 1) {
                        const filteredSuggestions = recettes.filter(recette =>
                            recette.toLowerCase().includes(query)
                        );

                        filteredSuggestions.forEach(suggestion => {
                            const li = document.createElement("li");
                            li.textContent = suggestion;
                            li.classList.add("suggestion-item");

                            li.addEventListener("click", () => {
                                input.value = suggestion;
                                list.innerHTML = "";
                                afficherRecetteSelectionnee(suggestion, data.recettes);
                            });

                            list.appendChild(li);
                        });
                    }
                });

                // Gestion de la navigation au clavier (flèches et entrée)
                input.addEventListener("keydown", (e) => {
                    const items = list.querySelectorAll(".suggestion-item");

                    if (e.key === "ArrowDown") {
                        selectedIndex = (selectedIndex + 1) % items.length;
                    } else if (e.key === "ArrowUp") {
                        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                    } else if (e.key === "Enter" && selectedIndex >= 0) {
                        input.value = items[selectedIndex].textContent;
                        list.innerHTML = "";
                        return;
                    }

                    items.forEach((item, index) => {
                        item.classList.toggle("active", index === selectedIndex);
                    });
                });

                // Fermer la liste des suggestions si on clique ailleurs
                document.addEventListener("click", (e) => {
                    if (!input.contains(e.target) && !list.contains(e.target)) {
                        list.innerHTML = "";
                    }
                });
            });
        })
        .catch(error => console.error("Erreur de chargement des recettes :", error));

    // Fonction pour inclure le header
    function includeHeader() {
        fetch('../components/header.html')  // Le chemin vers ton fichier header.html
            .then(response => response.text())  // Convertir la réponse en texte (HTML)
            .then(data => {
                // Insérer le contenu dans l'élément <header> sans effacer le reste de la page
                const headerElement = document.querySelector('header');
                headerElement.innerHTML = data;
                initializeMenuBurger();  // Initialise le menu burger après avoir chargé le header
            })
            .catch(err => console.error('Erreur lors du chargement du header:', err));
    }

    // Charger le header après le chargement initial
    includeHeader();
});

// Fonction pour afficher une recette sélectionnée
function afficherRecetteSelectionnee(nomRecette, recettes) {
    const recetteSelectionnee = recettes.find(recette => recette.nom === nomRecette);
    if (!recetteSelectionnee) return;

    const recettesContainer = document.getElementById("recettes-container");
    recettesContainer.innerHTML = `
        <div>
            <h2>${recetteSelectionnee.nom}</h2>
            <h3>Liste d'ingrédients</h3>
            <ul>
                ${recetteSelectionnee.ingredients.map(ingredient => `<li>${ingredient.nom}</li>`).join('')}
            </ul>
            <h3>Étapes de préparation</h3>
            <ul>
                ${recetteSelectionnee.etapes.map(etape => `<li>${etape}</li>`).join('')}
            </ul>
        </div>
    `;
}

function initializeMenuBurger() {
    const menuToggle = document.getElementById("menu-toggle");
    const navbarMenu = document.getElementById("navbar-menu");

    // Vérifier si les éléments existent dans le DOM
    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener("click", function () {
            navbarMenu.classList.toggle("hidden"); // Toggle the visibility of the mobile menu
            navbarMenu.classList.toggle("block"); // Show the menu as a block under the navbar
        });
    } else {
        console.error("Le menuToggle ou navbarMenu n'a pas été trouvé dans le DOM.");
    }
}
