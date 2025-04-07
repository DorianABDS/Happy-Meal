$(document).ready(function () {
    displayFavorites();
    displayShoppingList(); // Afficher la liste des ingrédients dès le chargement
});

function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let container = $("#favorites-list");

    container.html(""); // Nettoyer le conteneur

    if (favorites.length === 0) {
        container.append("<p class='text-center'>Aucune recette favorite.</p>");
        return;
    }

    favorites.forEach(recipe => {
        // Ignorer les objets invalides
        if (!recipe || !recipe.nom) return;

        let recipeDiv = document.createElement('div');
        recipeDiv.classList.add('bg-white', 'p-4', 'shadow-md', 'rounded-lg', 'cursor-pointer');
        recipeDiv.setAttribute('data-nom', recipe.nom);

        recipeDiv.innerHTML = `
            <img src="${recipe.image || 'placeholder.jpg'}" alt="${recipe.nom}" class="w-full h-48 object-cover rounded mb-2">
            <h3 class="text-xl font-bold">${recipe.nom}</h3>
            <button class="bg-red-500 text-white px-4 py-2 rounded mt-2 remove-favorite" data-nom="${recipe.nom}">
                Retirer des Favoris
            </button>
        `;

        recipeDiv.addEventListener('click', function (event) {
            if (!event.target.classList.contains('remove-favorite')) {
                console.log("Ouverture du modal pour :", recipe.nom);
                openRecipeModal(recipe);
            }
        });

        container.append(recipeDiv);
    });

    // Gestion du bouton "Retirer des Favoris"
    $(".remove-favorite").off("click").on("click", function (event) {
        event.stopPropagation();
        let recipeName = $(this).data("nom");

        console.log("Nom récupéré :", recipeName);

        if (!recipeName) {
            console.error("Erreur : le nom est undefined !");
            return;
        }

        removeFavorite(recipeName);
    });
}

function removeFavorite(recipeName) {
    if (!recipeName) {
        console.error("removeFavorite() : nom invalide !");
        return;
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    console.log("Avant suppression :", favorites.map(r => r.nom));

    favorites = favorites.filter(recipe => recipe.nom !== recipeName);

    console.log("Après suppression :", favorites.map(r => r.nom));

    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites(); // Mise à jour immédiate
}

// Dummy modal handler for now
function openRecipeModal(recipe) {
    $("#modal-title").text(recipe.nom);
    $("#modal-ingredients").html(recipe.ingredients?.map(i => `<li>${i}</li>`).join("") || "");
    $("#modal-etapes").html(recipe.etapes?.map(e => `<li>${e}</li>`).join("") || "");
    $("#modal").removeClass("hidden");
}

$("#close-modal").on("click", () => {
    $("#modal").addClass("hidden");
});

// Fonction pour récupérer la liste des ingrédients avec les quantités
function getShoppingList() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let shoppingList = [];

    favorites.forEach(recipe => {
        if (recipe && recipe.ingredients && Array.isArray(recipe.ingredients)) {
            recipe.ingredients.forEach(ingredient => {
                // Vérifie si l'ingrédient a une quantité et un nom
                let ingredientName = ingredient.nom || ingredient;
                let quantity = ingredient.quantite || 'Quantité non précisée';

                // Ajouter l'ingrédient à la liste
                shoppingList.push({ name: ingredientName, quantity: quantity });
            });
        }
    });

    // Supprimer les doublons tout en gardant les quantités
    shoppingList = shoppingList.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.name === value.name
        ))
    );

    return shoppingList;
}

// Fonction pour afficher la liste des ingrédients avec leurs quantités
function displayShoppingList() {
    let shoppingList = getShoppingList();
    let container = $("#shopping-list");

    container.html(""); // Nettoyer le conteneur

    if (shoppingList.length === 0) {
        container.append("<p class='text-center'>Aucun ingrédient ajouté.</p>");
        return;
    }

    shoppingList.forEach(item => {
        let ingredientDiv = document.createElement('div');
        ingredientDiv.classList.add('bg-white', 'p-2', 'shadow-md', 'rounded-lg', 'my-2');

        ingredientDiv.innerHTML = `
            <p>${item.name} - <strong>${item.quantity}</strong></p>
        `;

        container.append(ingredientDiv);
    });
}
