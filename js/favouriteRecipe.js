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
                shoppingList.push({ name: ingredientName, quantity: quantity, recipeId: recipe.id });
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


// Fonction pour sauvegarder la nouvelle quantité dans le localStorage
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


// Fonction pour afficher la liste des ingrédients avec leurs quantités
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


        // Retirer l'unité "g" ou tout autre caractère non numérique de la quantité
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


// Initialiser l'affichage avec la première page
$(document).ready(function() {
    displayShoppingList(1, 9); // Afficher la première page par défaut
});
