document.addEventListener('DOMContentLoaded', function () {
    loadRecipes();
});

// Charger les recettes depuis le JSON avec $.ajax
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
        }
    });
}

// Fonction pour afficher les recettes
function displayRecipes(recipes) {
    let recipesContainer = document.getElementById('recettes');
    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {
        let recipeDiv = document.createElement('div');
        recipeDiv.classList.add('bg-white', 'p-4', 'shadow-md', 'rounded-lg', 'cursor-pointer');
        recipeDiv.setAttribute('data-id', recipe.id);

        recipeDiv.innerHTML = `
            <h3 class="text-xl font-bold">${recipe.nom}</h3>
            <button class="bg-blue-500 text-white px-4 py-2 rounded mt-2 add-favorite" data-id="${recipe.id}">
                Ajouter aux Favoris
            </button>
        `;

        // Ajout au clic pour ouvrir le modal
        recipeDiv.addEventListener('click', function (event) {
            if (!event.target.classList.contains('add-favorite')) {
                openRecipeModal(recipe);
            }
        });

        // Ajout au clic pour ajouter aux favoris
        recipeDiv.querySelector('.add-favorite').addEventListener('click', function (event) {
            event.stopPropagation(); // Empêche l'ouverture du modal lors du clic sur le bouton
            addToFavorites(recipe);
        });

        recipesContainer.appendChild(recipeDiv);
    });
}

// Ouvrir le modal de la recette
function openRecipeModal(recipe) {
    document.getElementById('modal-title').textContent = recipe.nom;
    document.getElementById('modal-ingredients').innerHTML = recipe.ingredients.map(ingredient => `<li>${ingredient.nom}</li>`).join('');
    document.getElementById('modal-etapes').innerHTML = recipe.etapes.map(etape => `<li>${etape}</li>`).join('');
    document.getElementById('modal').classList.remove('hidden');

    // Récupération du bouton et suppression des anciens événements
    const modalFavoriteButton = document.getElementById('modal-favorite');
    modalFavoriteButton.replaceWith(modalFavoriteButton.cloneNode(true));

    // Récupération du bouton cloné et ajout d'un nouvel événement
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

    // Vérifier si une recette avec le même nom existe déjà
    let exists = favorites.some(fav => fav.nom === recipe.nom);

    if (exists) {
        showMessage("Cette recette est déjà dans vos favoris.", 'warning');
    } else {
        favorites.push(recipe);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showMessage("Recette ajoutée aux favoris !", 'success');
        displayFavorites(); // Mettre à jour l'affichage
    }
}

// Fonction pour afficher un message de confirmation
function showMessage(message, type) {
    let messageContainer = document.getElementById('favorite-message');

    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'favorite-message';
        messageContainer.classList.add('fixed', 'bottom-4', 'right-4', 'p-3', 'rounded', 'shadow-md', 'text-white');
        document.body.appendChild(messageContainer);
    }

    // Reset des classes
    messageContainer.className = 'fixed bottom-4 right-4 p-3 rounded shadow-md text-white';

    // Appliquer le style en fonction du type de message
    if (type === 'success') {
        messageContainer.classList.add('bg-green-500');
    } else if (type === 'warning') {
        messageContainer.classList.add('bg-yellow-500');
    }

    messageContainer.textContent = message;
    messageContainer.style.display = 'block';

    // Disparition automatique du message après 3 secondes
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
}


// Afficher les favoris (facultatif : à ajouter dans une section dédiée)
function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let favoritesContainer = document.getElementById('favorites');
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
            `;
            favoritesContainer.appendChild(favoriteDiv);
        });
        
    }
}
