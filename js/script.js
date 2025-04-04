$(document).ready(function() {
    let recettes = [];

    // Charger les recettes depuis data.json
    $.ajax({
        url: '/data/data.json',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (!data.recettes || data.recettes.length === 0) {
                console.error("Aucune recette trouvée.");
                return;
            }
            recettes = data.recettes;

            console.log(data);

            // Mélanger et prendre 3 recettes aléatoires
            let recettesAleatoires = recettes.sort(() => 0.5 - Math.random()).slice(0, 3);

            recettesAleatoires.forEach(function(recette) {
                let recetteHTML = `
                <div class="recette w-full sm:w-72 md:w-80 lg:w-96 p-4 bg-white shadow cursor-pointer w-72 rounded">
                    <img src="${recette.image}" alt="${recette.nom}" class="w-full h-40 object-cover rounded">
                    <h2 class="text-lg font-bold mt-2">${recette.nom}</h2>
                    <p class="text-sm text-gray-600">${recette.categorie} - ${recette.temps_preparation}</p>
                </div>
                `;  
                let recetteElement = $(recetteHTML);
                recetteElement.click(function() {
                    $("#modal-title").text(recette.nom);
                    $("#modal-ingredients").html(recette.ingredients.map(ingredient => `<li>${ingredient.nom} - ${ingredient.quantite}</li>`).join(''));
                    $("#modal-etapes").html(recette.etapes.map(etape => `<li>${etape}</li>`).join(''));
                    $("#modal").removeClass("hidden");
                });
                $('#recettes').append(recetteElement);
            });
        },
        error: function(error) {
            console.log("Erreur lors du chargement des données :", error);
        }
    });

    $("#close-modal").click(function() {
        $("#modal").addClass("hidden");
    });

    // Fonction de recherche et autocomplétion
    function filtrerRecettes(motCle) {
        return recettes.filter(recette =>
            recette.nom.toLowerCase().includes(motCle.toLowerCase()) ||
            recette.ingredients.some(ingredient => ingredient.nom.toLowerCase().includes(motCle.toLowerCase()))
        );
    }

    function afficherSuggestions(inputId, suggestionsListId) {
        let motCle = $(inputId).val().trim().toLowerCase();
        let suggestions = filtrerRecettes(motCle).map(recette => recette.nom);

        let $suggestionsList = $(suggestionsListId);
        $suggestionsList.empty().hide();

        if (motCle.length > 0 && suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                let suggestionItem = `<li class="px-4 py-2 cursor-pointer hover:bg-gray-200">${suggestion}</li>`;
                $suggestionsList.append(suggestionItem);
            });
            $suggestionsList.show();
        }

        // Sélection d'une suggestion
        $suggestionsList.find("li").click(function () {
            $(inputId).val($(this).text());
            $suggestionsList.empty().hide();
            afficherRecettesCorrespondantes($(this).text());
        });
    }

    function afficherRecettesCorrespondantes(motCle) {
        let recettesFiltrees = filtrerRecettes(motCle);
        let $recettesContainer = $("#recettes");
        $recettesContainer.empty();

        if (recettesFiltrees.length === 0) {
            $recettesContainer.append("<p class='text-gray-500'>Aucune recette trouvée.</p>");
            return;
        }

        recettesFiltrees.forEach(recette => {
            let recetteHTML = `
                <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                    <img src="${recette.image}" alt="${recette.nom}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h2 class="text-xl font-bold text-gray-800">${recette.nom}</h2>
                        <p class="text-sm text-gray-600 mt-1">${recette.categorie} • ${recette.temps_preparation}</p>
                    </div>
                </div>
            `;
            $recettesContainer.append(recetteHTML);
        });
    }

    $("#search-input-desktop, #search-input-mobile").on("input", function () {
        let inputId = `#${$(this).attr("id")}`;
        let suggestionsListId = inputId === "#search-input-desktop" ? "#suggestions-list-desktop" : "#suggestions-list-mobile";
        afficherSuggestions(inputId, suggestionsListId);
    });

    $("#search-input-desktop, #search-input-mobile").on("keypress", function (event) {
        if (event.which === 13) {
            let motCle = $(this).val().trim();
            afficherRecettesCorrespondantes(motCle);
            $(".absolute.z-10").hide(); // Cacher les suggestions
        }
    });

    $(document).click(function (event) {
        if (!$(event.target).closest(".relative").length) {
            $(".absolute.z-10").hide();
        }
    });
});
