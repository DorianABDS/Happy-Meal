$(document).ready(function () {
    let recettes = []; 
    let recettesParPage = 9; 
    let pageActuelle = 1; 

    function afficherRecettes(recettesAffichees = recettes) {
        $("#recettes").empty(); 

        let debut = (pageActuelle - 1) * recettesParPage;
        let fin = debut + recettesParPage;
        let recettesPaginees = recettesAffichees.slice(debut, fin);

        recettesPaginees.forEach(function (recette) {
            let recetteHTML = `
                <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                    <img src="${recette.image}" alt="${recette.nom}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h2 class="text-xl font-bold text-gray-800">${recette.nom}</h2>
                        <p class="text-sm text-gray-600 mt-1">${recette.categorie} • ${recette.temps_preparation}</p>
                    </div>
                </div>
            `;

            let recetteElement = $(recetteHTML);
            recetteElement.click(function () {
                $("#modal-title").text(recette.nom);
                $("#modal-ingredients").html(
                    recette.ingredients.map(ing => `<li>${ing.nom} - ${ing.quantite}</li>`).join('')
                );
                $("#modal-etapes").html(
                    recette.etapes.map(etape => `<li>${etape}</li>`).join('')
                );
                $("#modal").removeClass("hidden");
            });

            $('#recettes').append(recetteElement);
        });

        afficherPagination(recettesAffichees); 
    }

    function afficherPagination(recettesAffichees = recettes) {
        let totalPages = Math.ceil(recettesAffichees.length / recettesParPage);
        $("#pagination").empty(); 

        if (pageActuelle > 1) {
            $("#pagination").append(`<button id="prev" class="bg-orange-100 px-2 py-1 rounded-md mr-2">Précédent</button>`);
        }

        for (let i = 1; i <= totalPages; i++) {
            let activeClass = i === pageActuelle ? "bg-orange-400 text-white" : "bg-orange-100";
            $("#pagination").append(`<button class="page-btn ${activeClass} px-2 py-1 rounded-md mx-1" data-page="${i}">${i}</button>`);
        }

        if (pageActuelle < totalPages) {
            $("#pagination").append(`<button id="next" class="bg-orange-100 px-2 py-1 rounded-md ml-2">Suivant</button>`);
        }

        $(".page-btn").click(function () {
            pageActuelle = parseInt($(this).attr("data-page"));
            afficherRecettes(recettesAffichees);
        });

        $("#prev").click(function () {
            if (pageActuelle > 1) {
                pageActuelle--;
                afficherRecettes(recettesAffichees);
            }
        });

        $("#next").click(function () {
            if (pageActuelle < totalPages) {
                pageActuelle++;
                afficherRecettes(recettesAffichees);
            }
        });
    }

    // 🔍 Gestion de la recherche
    function filtrerRecettes(searchTerm) {
        const recettesFiltrees = recettes.filter(recette =>
            recette.nom.toLowerCase().includes(searchTerm) ||
            recette.categorie.toLowerCase().includes(searchTerm) ||
            recette.ingredients.some(ing => ing.nom.toLowerCase().includes(searchTerm))
        );

        pageActuelle = 1; 
        afficherRecettes(recettesFiltrees);
        afficherSuggestions(searchTerm);
    }

    // 🔠 Autocomplétion
    function afficherSuggestions(searchTerm) {
        const suggestionsList = $("#suggestions-list-desktop, #suggestions-list-mobile");
        
        if (!searchTerm || searchTerm.length < 2) {
            suggestionsList.empty().addClass("hidden");
            return;
        }

        const suggestions = recettes
            .map(recette => recette.nom)
            .filter(nom => nom.toLowerCase().includes(searchTerm))
            .slice(0, 5);

        suggestionsList.html(
            suggestions.map(sug => `<li class="px-4 py-2 cursor-pointer hover:bg-gray-200">${sug}</li>`).join("")
        ).removeClass("hidden");

        suggestionsList.find("li").click(function () {
            const selected = $(this).text();
            $("#search-input-desktop, #search-input-mobile").val(selected);
            suggestionsList.empty().addClass("hidden");
            filtrerRecettes(selected.toLowerCase());
        });
    }

    // 🔍 Événement sur la barre de recherche
    $("#search-input-desktop, #search-input-mobile").on("input", function () {
        let searchTerm = $(this).val().toLowerCase();
        filtrerRecettes(searchTerm);
    });

    $.ajax({
        url: "/data/data.json",
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (!data.recettes || data.recettes.length === 0) {
                console.error("Aucune recette trouvée.");
                return;
            }
            recettes = data.recettes;
            afficherRecettes();
        },
        error: function (error) {
            console.error("Erreur lors du chargement des données :", error);
        }
    });

    $("#close-modal").click(function () {
        $("#modal").addClass("hidden");
    });
});
