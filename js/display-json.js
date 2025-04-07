$(document).ready(function () {
    loadRecipes();
    displayFavorites();
});

// Charger les recettes avec $.ajax
function loadRecipes() {
    $.ajax({
        url: '/data/data.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            displayRecipes(data.recettes);
        },
        error: function (error) {
            console.error('Erreur lors du chargement des recettes:', error);
            alert('Impossible de charger les recettes.');
        }
    });
}

// Afficher les recettes
function displayRecipes(recipes) {
    let recipesContainer = $('#recettes');
    recipesContainer.empty();

    recipes.forEach(recipe => {
        let recipeDiv = $(`
            <div class="bg-white p-4 shadow-md rounded-lg cursor-pointer" data-id="${recipe.id}">
                <h3 class="text-xl font-bold">${recipe.nom}</h3>
                <button class="bg-blue-500 text-white px-4 py-2 rounded mt-2 add-favorite">
                    Ajouter aux Favoris
                </button>
            </div>
        `);

        // Ouvrir le modal au clic sauf sur le bouton
        recipeDiv.on('click', function (event) {
            if (!$(event.target).hasClass('add-favorite')) {
                openRecipeModal(recipe);
            }
        });

        // Ajouter aux favoris
        recipeDiv.find('.add-favorite').on('click', function (event) {
            event.stopPropagation();
            addToFavorites(recipe); // Passer l'objet complet
        });

        recipesContainer.append(recipeDiv);
    });
}

// Ouvrir le modal d'une recette
function openRecipeModal(recipe) {
    $('#modal-title').text(recipe.nom);
    $('#modal-ingredients').html(recipe.ingredients.map(ing => `<li>${ing.nom}</li>`).join(''));
    $('#modal-etapes').html(recipe.etapes.map(etape => `<li>${etape}</li>`).join(''));
    $('#modal').removeClass('hidden');
}

// Fermer le modal
$('#close-modal').on('click', function () {
    $('#modal').addClass('hidden');
});

// Ajouter une recette aux favoris (stocke toute la recette)
function addToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Vérifier si la recette est déjà dans les favoris
    if (!favorites.some(fav => fav.id === recipe.id)) {
        favorites.push(recipe); // Ajouter l'objet entier
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Sauvegarde dans localStorage
        alert(`${recipe.nom} a été ajouté aux favoris !`);
    } else {
        alert("Cette recette est déjà dans vos favoris.");
    }
}

// Afficher les favoris dans la page principale
function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let favoritesList = $('#favorites-list');
    favoritesList.empty();

    if (favorites.length === 0) {
        favoritesList.append("<li>Aucune recette dans vos favoris.</li>");
        return;
    }

    favorites.forEach(recipe => {
        let recipeItem = $(`
            <li class="bg-white p-4 shadow-md rounded-lg">
                <h3 class="text-xl font-bold">${recipe.nom}</h3>
                <p class="text-gray-700">${recipe.description || 'Aucune description disponible.'}</p>
                <button class="mt-2 bg-red-500 text-white px-4 py-2 rounded remove-favorite" data-id="${recipe.id}">
                    Retirer des Favoris
                </button>
            </li>
        `);

        // Supprimer des favoris
        recipeItem.find('.remove-favorite').on('click', function () {
            removeFromFavorites(recipe.id);
        });

        favoritesList.append(recipeItem);
    });
}

// Supprimer une recette des favoris
function removeFromFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}
