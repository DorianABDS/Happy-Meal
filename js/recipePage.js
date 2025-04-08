document.addEventListener('DOMContentLoaded', function () {
    loadRecipes();
});

// Variables globales
let allRecipes = [];
let currentPage = 1;
const recipesPerPage = 9;

// Charger les recettes depuis le JSON avec $.ajax
function loadRecipes() {
    $.ajax({
        url: '/data/data.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            allRecipes = data.recettes;
            displayRecipesByPage(currentPage);
            createPaginationButtons();
        },
        error: function (error) {
            console.error('Erreur lors du chargement des recettes:', error);
        }
    });
}

// Affiche les recettes pour une page donnée
function displayRecipesByPage(page) {
    let recipesContainer = document.getElementById('recettes');
    recipesContainer.innerHTML = '';

    let start = (page - 1) * recipesPerPage;
    let end = start + recipesPerPage;
    let recipesToShow = allRecipes.slice(start, end);

    recipesToShow.forEach(recipe => {
        let recipeDiv = document.createElement('div');
        recipeDiv.classList.add('bg-white', 'p-4', 'shadow-md', 'rounded-lg', 'cursor-pointer');
        recipeDiv.setAttribute('data-nom', recipe.nom);

        recipeDiv.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer relative">
          <img src="${recipe.image}" alt="${recipe.nom}" class="w-full h-48 object-cover ">
            <h3 class="text-xl font-bold">${recipe.nom}</h3>
            <button class="bg-amber-400 text-white center px-4 py-2 rounded mt-2 add-favorite" data-nom="${recipe.nom}">
                Ajouter aux Favoris
            </button>
        </div>
        `;

        recipeDiv.addEventListener('click', function (event) {
            if (!event.target.classList.contains('add-favorite')) {
                openRecipeModal(recipe);
            }
        });

        recipeDiv.querySelector('.add-favorite').addEventListener('click', function (event) {
            event.stopPropagation();
            addToFavorites(recipe);
        });

        recipesContainer.appendChild(recipeDiv);
    });
}

// Crée les boutons de pagination
function createPaginationButtons() {
    const totalPages = Math.ceil(allRecipes.length / recipesPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('px-3', 'py-1', 'm-1', 'rounded', 'bg-gray-200');

        if (i === currentPage) {
            btn.classList.add('bg-blue-500', 'text-white');
        }

        btn.addEventListener('click', function () {
            currentPage = i;
            displayRecipesByPage(currentPage);
            createPaginationButtons();
        });

        paginationContainer.appendChild(btn);
    }
}

// Ouvrir le modal de la recette
function openRecipeModal(recipe) {
    document.getElementById('modal-title').textContent = recipe.nom;
    document.getElementById('modal-ingredients').innerHTML = recipe.ingredients.map(ingredient => `<li>${ingredient.nom}</li>`).join('');
    document.getElementById('modal-etapes').innerHTML = recipe.etapes.map(etape => `<li>${etape}</li>`).join('');
    document.getElementById('modal').classList.remove('hidden');

    const modalFavoriteButton = document.getElementById('modal-favorite');
    modalFavoriteButton.replaceWith(modalFavoriteButton.cloneNode(true));

    document.getElementById('modal-favorite').addEventListener('click', function () {
        addToFavorites(recipe);
    });
}

// Fermer le modal
document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('modal').classList.add('hidden');
});

// Ajouter une recette aux favoris
function addToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    let exists = favorites.some(fav => fav.nom === recipe.nom);

    if (exists) {
        showMessage("Cette recette est déjà dans vos favoris.", 'warning');
    } else {
        favorites.push(recipe);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showMessage("Recette ajoutée aux favoris !", 'success');
        displayFavorites();
    }
}

// Afficher un message
function showMessage(message, type) {
    let messageContainer = document.getElementById('favorite-message');

    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'favorite-message';
        messageContainer.classList.add('fixed', 'bottom-4', 'right-4', 'p-3', 'rounded', 'shadow-md', 'text-white');
        document.body.appendChild(messageContainer);
    }

    messageContainer.className = 'fixed bottom-4 right-4 p-3 rounded shadow-md text-white';

    if (type === 'success') {
        messageContainer.classList.add('bg-green-500');
    } else if (type === 'warning') {
        messageContainer.classList.add('bg-yellow-500');
    }

    messageContainer.textContent = message;
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}

// Afficher les favoris
function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let favoritesContainer = document.getElementById('favorites');
    if (!favoritesContainer) return;

    favoritesContainer.innerHTML = '';

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>Aucune recette dans les favoris.</p>";
    } else {
        favorites.forEach(recipe => {
            let favoriteDiv = document.createElement('div');
            favoriteDiv.classList.add('favorite-recipe');
            favoriteDiv.innerHTML = `
                <h3>${recipe.nom}</h3>
                <p>Ingrédients : ${recipe.ingredients.map(ing => ing.nom).join(', ')}</p>
                <p>Étapes : ${recipe.etapes.join('. ')}</p>
                <button class="remove-favorite" data-nom="${recipe.nom}">Supprimer</button>
            `;
            favoriteDiv.querySelector('.remove-favorite').addEventListener('click', function () {
                removeFromFavorites(recipe.nom);
            });
            favoritesContainer.appendChild(favoriteDiv);
        });
    }
}

// Supprimer une recette des favoris
function removeFromFavorites(nom) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(recipe => recipe.nom !== nom);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showMessage("Recette retirée des favoris.", 'success');
    displayFavorites();
}


// Supprimer une recette des favoris
function removeFromFavorites(nom) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    console.log("Nom à supprimer :", nom);
    console.log("Liste des favoris :", favorites);

    favorites = favorites.filter(fav => {
        console.log("Comparaison avec :", fav.nom);
        return fav.nom !== nom;
    });

    localStorage.setItem('favorites', JSON.stringify(favorites));
    showMessage("Recette supprimée des favoris.", 'warning');
    displayFavorites();
}
// Fermer le modal avec jQuery
$("#close-modal").click(function () {
    $("#modal").addClass("hidden");
});
