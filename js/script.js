$(document).ready(function() {
    $.ajax({
        url: '/data/data.json',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data);

            // Mélanger et prendre 3 recettes aléatoires
            let recettesAleatoires = data.recettes.sort(() => 0.5 - Math.random()).slice(0, 3);

            recettesAleatoires.forEach(function(recette) {
                let recetteHTML = `
                <div class="recette p-4 bg-white shadow rounded cursor-pointer">
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
});
