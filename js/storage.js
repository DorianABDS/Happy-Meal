/**
 * Charge les recettes depuis le localStorage ou, si elles n'existent pas encore,
 * depuis un fichier JSON externe
 */
function loadRecipes() {
    // Tente de récupérer les recettes depuis le localStorage
    let recipes = getFromLocalStorage('recettes');

    if (recipes) {
        // Si les recettes existent déjà dans le localStorage
        console.log('Données récupérées du localStorage :', recipes);
    } else {
        // Si aucune recette n'est trouvée dans le localStorage
        console.log('Chargement depuis le fichier JSON...');
        $.ajax({
            url: '/data/data.json',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                // Transforme les données reçues en format adapté
                recipes = data.map(recipe => ({
                    id: recipe.id,
                    title: recipe.title,
                    ingredients: recipe.ingredients,
                    instructions: recipe.instructions,
                    category: recipe.category,
                    image: recipe.image
                }));
                // Stocke les recettes dans le localStorage pour les utilisations futures
                localStorage.setItem('recettes', JSON.stringify(recipes));
                console.log('Données stockées dans le localStorage :', recipes);
            },
            error: function (xhr, status, error) {
                // Gestion des erreurs de chargement
                console.error('Erreur lors du chargement des données :', error);
            }
        });
    }
}

/**
 * Ajoute ou supprime une recette des favoris
 * @param {number|string} recipeId - L'identifiant de la recette
 */
function toggleFavorite(recipeId) {
    // Récupère la liste des favoris ou crée un tableau vide
    let favorites = getFromLocalStorage('favorite') || [];
    if (favorites.includes(recipeId)) {
        // Si la recette est déjà dans les favoris, la retirer
        favorites = favorites.filter(id => id !== recipeId);
    } else {
        // Sinon, l'ajouter aux favoris
        favorites.push(recipeId);
    }
    // Sauvegarde la liste mise à jour
    saveToLocalStorage('favorite', favorites);
}

/**
 * Ajoute un ingrédient à la liste de courses s'il n'y est pas déjà
 * @param {string} ingredient - L'ingrédient à ajouter
 */
function addToShoppingList(ingredient) {
    // Récupère la liste de courses existante ou crée un tableau vide
    let list = getFromLocalStorage('shoppingList') || [];
    if (!list.includes(ingredient)) {
        // Ajoute l'ingrédient seulement s'il n'est pas déjà présent
        list.push(ingredient);
        saveToLocalStorage('shoppingList', list);
    }
}

/**
 * Ajoute une recette au plan de repas
 * @param {number|string} recipeId - L'identifiant de la recette à ajouter
 */
function addToMealPlan(recipeId) {
    // Récupère le plan de repas existant ou crée un tableau vide
    let mealPlan = getFromLocalStorage('mealPlan') || [];
    // Ajoute la recette au plan de repas
    mealPlan.push({recipeId});
    // Sauvegarde le plan mis à jour
    saveToLocalStorage('mealPlan', mealPlan);
}

/**
 * Initialise l'application au chargement de la page
 */
$(() => {
    // Charge les recettes dès que le document est prêt
    loadRecipes();
});