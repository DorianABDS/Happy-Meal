$(document).ready(function () {
    displayFavorites();
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
