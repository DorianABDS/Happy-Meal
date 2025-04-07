$(document).ready(function () {
    displayFavorites();
});

function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let container = $("#favorites-list");

    container.html(""); // Nettoyer le conteneur avant de réajouter les recettes

    if (favorites.length === 0) {
        container.append("<p>Aucune recette favorite.</p>");
        return;
    }

    favorites.forEach(recipe => {
        let recipeDiv = document.createElement('div');
        recipeDiv.classList.add('bg-white', 'p-4', 'shadow-md', 'rounded-lg', 'cursor-pointer');
        recipeDiv.setAttribute('data-id', recipe.id);

        recipeDiv.innerHTML = `
            <h3 class="text-xl font-bold">${recipe.nom}</h3>
            <button class="bg-red-500 text-white px-4 py-2 rounded mt-2 remove-favorite" data-id="${recipe.id}">
                Retirer des Favoris
            </button>
        `;

        // Gestion du clic pour ouvrir le modal
        recipeDiv.addEventListener('click', function (event) {
            if (!event.target.classList.contains('remove-favorite')) {
                console.log("Ouverture du modal pour :", recipe.nom);
                openRecipeModal(recipe);
            }
        });

        container.append(recipeDiv);
    });

    // Nettoyage des anciens événements avant d'ajouter les nouveaux
   $(".remove-favorite").off("click").on("click", function (event) {
    event.stopPropagation();
    let recipeId = $(this).data("id");
    
    console.log("ID récupéré :", recipeId); // ✅ Vérifie si l'ID est bien récupéré

    if (!recipeId) {
        console.error("Erreur : l'ID est undefined !");
        return; // On sort pour éviter l'erreur
    }

    removeFavorite(recipeId);
    displayFavorites(); // Mise à jour après suppression
});
}

function removeFavorite(recipeId) {
    if (!recipeId) {
        console.error("removeFavorite() : ID invalide !");
        return;
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    // Vérifie si les IDs sont bien comparés sous forme de chaînes
    favorites = favorites.filter(recipe => recipe.id && recipe.id.toString() !== recipeId.toString());

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

