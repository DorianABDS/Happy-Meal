$(document).ready(function() {
    $.ajax({
        url: '/data/data.json',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log(data);

            // Mélanger le tableau des recettes et prendre les 3 premières
            let recettesAleatoires = data.recettes.sort(() => 0.5 - Math.random()).slice(0, 3);

            recettesAleatoires.forEach(function(recette) {
                let recetteHTML = `
                <div class="recette p-4 bg-white shadow rounded cursor-pointer">
                    <h2 class="text-lg font-bold">${recette.nom}</h2>
                </div>
                `;  
                let recetteElement = $(recetteHTML);
                recetteElement.click(function() {
                    $("#modal-title").text(recette.nom);
                    $("#modal-ingredients").html(recette.ingredients.map(ingredient => `<li>${ingredient.nom}</li>`).join(''));
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
