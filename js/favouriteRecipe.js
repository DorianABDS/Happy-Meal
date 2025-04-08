// Affichage des favoris et des ingrédients dès que la page est chargée
$(document).ready(function () {
    console.log("Chargement de la page, affichage des favoris...");
    displayFavorites(); // Affiche les favoris
    displayShoppingList(); // Affiche la liste des ingrédients dès le chargement
});

// Fonction pour afficher les favoris
function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log("Favoris récupérés : ", favorites);  // Ajouter un log pour vérifier les favoris

    let container = $("#favorites-list");
    container.html(""); // Nettoyer le conteneur

    if (favorites.length === 0) {
        container.append("<p class='text-center'>Aucune recette favorite.</p>");
        return;
    }

    favorites.forEach(recipe => {
        if (!recipe || !recipe.nom) return; // Ignore les objets invalides

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
                openRecipeModal(recipe);  // Vérifie que recipe contient les ingrédients
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

        removeFavorite(recipeName); // Supprime la recette des favoris
    });
}

// Fonction pour retirer une recette des favoris
function removeFavorite(recipeName) {
    if (!recipeName) {
        console.error("removeFavorite() : nom invalide !");
        return;
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log("Avant suppression :", favorites.map(r => r.nom));

    favorites = favorites.filter(recipe => recipe.nom !== recipeName); // Retirer le favori par nom

    console.log("Après suppression :", favorites.map(r => r.nom));

    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites(); // Mise à jour immédiate de l'affichage des favoris
}

// Fonction pour ouvrir le modal et afficher les détails d'une recette
function openRecipeModal(recipe) {
    $("#modal-title").text(recipe.nom);
    $("#modal-ingredients").html(recipe.ingredients?.map(i => `<li>${i.nom} - ${i.quantite} ${i.unite || ''}</li>`).join("") || "");
    $("#modal-etapes").html(recipe.etapes?.map(e => `<li>${e}</li>`).join("") || "");
    $("#modal").removeClass("hidden");
}

// Fermer le modal
$("#close-modal").on("click", () => {
    $("#modal").addClass("hidden");
});

// Fonction pour récupérer la liste des ingrédients avec leurs quantités
function getShoppingList() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let shoppingList = [];

    favorites.forEach(recipe => {
        if (recipe && recipe.ingredients && Array.isArray(recipe.ingredients)) {
            recipe.ingredients.forEach(ingredient => {
                let ingredientName = ingredient.nom || ingredient;
                let quantity = ingredient.quantite || 'Quantité non précisée';

                shoppingList.push({ name: ingredientName, quantity: quantity, recipeId: recipe.id });
            });
        }
    });

    // Supprimer les doublons
    shoppingList = shoppingList.filter((value, index, self) =>
        index === self.findIndex((t) => (t.name === value.name))
    );

    return shoppingList;
}

// Fonction pour afficher la liste des ingrédients
function displayShoppingList(page = 1, itemsPerPage = 9) {
    let shoppingList = getShoppingList();
    let container = $("#shopping-list");

    container.html(""); // Nettoyer le conteneur

    if (shoppingList.length === 0) {
        container.append("<p class='text-center'>Aucun ingrédient ajouté.</p>");
        return;
    }

    // Pagination: découper la liste en pages
    let start = (page - 1) * itemsPerPage;
    let paginatedList = shoppingList.slice(start, start + itemsPerPage);

    paginatedList.forEach(item => {
        let ingredientDiv = document.createElement('div');
        ingredientDiv.classList.add('bg-white', 'p-2', 'shadow-md', 'rounded-lg', 'my-2', 'd-flex', 'justify-content-between', 'align-items-center');

        let quantity = item.quantity;
        let numericQuantity = quantity ? quantity.replace(/[^\d.-]/g, '') : ''; // Retirer toute unité de mesure

        ingredientDiv.innerHTML = `
            <p class="ingredient-name">${item.name} - <strong>${item.quantity}</strong></p>
            <input type="number" class="quantity-input form-control" value="${numericQuantity}" data-ingredient="${item.name}" />
        `;

        // Événement pour changer la quantité
        $(ingredientDiv).find('.quantity-input').on('change', function() {
            let newQuantity = $(this).val();
            let ingredientName = $(this).data('ingredient');
            updateQuantity(ingredientName, newQuantity); // Mettre à jour la quantité
            displayShoppingList(page, itemsPerPage); // Recharger la liste avec la nouvelle quantité
        });

        container.append(ingredientDiv);
    });

    // Affichage de la pagination
    let totalPages = Math.ceil(shoppingList.length / itemsPerPage);
    let paginationContainer = $('#pagination');
    paginationContainer.html(""); // Nettoyer la pagination

    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.append(`<button class="pagination-button btn btn-primary" data-page="${i}">${i}</button>`);
    }

    // Événement de pagination
    $(".pagination-button").on("click", function() {
        let pageNumber = $(this).data('page');
        displayShoppingList(pageNumber, itemsPerPage); // Afficher la page sélectionnée
    });
}

// Fonction pour mettre à jour la quantité d'un ingrédient
function updateQuantity(ingredientName, newQuantity) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.forEach(recipe => {
        if (recipe && recipe.ingredients) {
            recipe.ingredients.forEach(ingredient => {
                if (ingredient.nom === ingredientName) {
                    ingredient.quantite = newQuantity; // Mettre à jour la quantité
                }
            });
        }
    });

    // Sauvegarder les modifications dans le localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));
}