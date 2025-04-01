document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Charger le header
        const response = await fetch('components/header.html'); // Vérifie le chemin
        if (!response.ok) throw new Error("Erreur de chargement du header.");

        const content = await response.text();
        document.getElementById('header-container').innerHTML = content;

        // Ajouter les événements après que le DOM soit mis à jour
        attachEventListeners();

    } catch (error) {
        console.error("Erreur lors de l'inclusion du header :", error);
    }

    // Charger les recettes et configurer la barre de recherche
    const searchInputs = [
        { input: document.getElementById("search-input-mobile"), list: document.getElementById("suggestions-list-mobile") },
        { input: document.getElementById("search-input-desktop"), list: document.getElementById("suggestions-list-desktop") }
    ];

    try {
        const response = await fetch("data/data.json");
        const data = await response.json();
        const recettes = data.recettes.map(recette => recette.nom); // Récupère uniquement les noms des recettes

        searchInputs.forEach(({ input, list }) => {
            let selectedIndex = -1;

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

            document.addEventListener("click", (e) => {
                if (!input.contains(e.target) && !list.contains(e.target)) {
                    list.innerHTML = "";
                }
            });
        });

    } catch (error) {
        console.error("Erreur de chargement des recettes :", error);
    }
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

// Ajouter les écouteurs d'événements sur les éléments du DOM
function attachEventListeners() {
    const searchInput = document.getElementById("search-input-desktop");
    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            console.log("Recherche :", event.target.value);
        });
    } else {
        console.warn("Le champ de recherche n'est pas encore disponible.");
    }
}
