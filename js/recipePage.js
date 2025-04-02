$(document).ready(function () {
    let recettes = []; // Tableau pour stocker toutes les recettes
    let recettesParPage = 9; // Nombre de recettes affichées par page
    let pageActuelle = 1; // Page en cours

    function afficherRecettes() {
        $("#recettes").empty(); // Effacer les anciennes recettes

        // Déterminer les recettes à afficher pour la page actuelle
        let debut = (pageActuelle - 1) * recettesParPage;
        let fin = debut + recettesParPage;
        let recettesAffichees = recettes.slice(debut, fin);

        // Générer le HTML pour chaque recette
        recettesAffichees.forEach(function (recette) {
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
                    recette.ingredients.map(ingredient => `<li>${ingredient.nom} - ${ingredient.quantite}</li>`).join('')
                );
                $("#modal-etapes").html(
                    recette.etapes.map(etape => `<li>${etape}</li>`).join('')
                );
                $("#modal").removeClass("hidden");
            });

            $('#recettes').append(recetteElement);
        });

        afficherPagination(); // Mettre à jour les boutons de pagination
    }

    function afficherPagination() {
        let totalPages = Math.ceil(recettes.length / recettesParPage);
        $("#pagination").empty(); // Vider la pagination existante

        // Bouton "Précédent"
        if (pageActuelle > 1) {
            $("#pagination").append(`<button id="prev" class="bg-orange-100 px-2 py-1 rounded-md mr-2">Précédent</button>`);
        }

        // Numéros de page
        for (let i = 1; i <= totalPages; i++) {
            let activeClass = i === pageActuelle ? "bg-orange-400 text-white" : "bg-orange-100";
            $("#pagination").append(`<button class="page-btn ${activeClass} px-2 py-1 rounded-md mx-1" data-page="${i}">${i}</button>`);
        }

        // Bouton "Suivant"
        if (pageActuelle < totalPages) {
            $("#pagination").append(`<button id="next" class="bg-orange-100 px-2 py-1 rounded-md ml-2">Suivant</button>`);
        }

        // Événements de clic sur les boutons
        $(".page-btn").click(function () {
            pageActuelle = parseInt($(this).attr("data-page"));
            afficherRecettes();
        });

        $("#prev").click(function () {
            if (pageActuelle > 1) {
                pageActuelle--;
                afficherRecettes();
            }
        });

        $("#next").click(function () {
            if (pageActuelle < totalPages) {
                pageActuelle++;
                afficherRecettes();
            }
        });
    }

    // Récupérer les données JSON et initialiser les recettes
    $.ajax({
        url: '/data/data.json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (!data.recettes || data.recettes.length === 0) {
                console.error("Aucune recette trouvée.");
                return;
            }
            recettes = data.recettes;
            afficherRecettes(); // Afficher la première page
        },
        error: function (error) {
            console.error("Erreur lors du chargement des données :", error);
        }
    });

    $("#close-modal").click(function () {
        $("#modal").addClass("hidden");
    });
});
