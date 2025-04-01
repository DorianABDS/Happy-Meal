$(document).ready(function() {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const categories = ["matin", "midi", "soir"];
    let favoriteRecipes = {};

    $.getJSON("/data.json", function(data) {
        favoriteRecipes = data.favoris;
        generateTable();
    }).fail(function() {
        $("#menu-table").html("<tr><td colspan='4' class='text-center text-red-500 p-3'>Erreur lors du chargement des recettes.</td></tr>");
    });

    function generateTable() {
        jours.forEach(jour => {
            categories.forEach(cat => {
                const select = $(`#menu-table tr[data-jour='${jour}'] select[data-cat='${cat}']`);
                select.empty().append("<option value=''>Sélectionner un repas</option>");
                
                if (favoriteRecipes[cat]) {
                    favoriteRecipes[cat].forEach(recipe => {
                        select.append(`<option value='${recipe.id}'>${recipe.nom}</option>`);
                    });
                }
            });
        });
    }
});