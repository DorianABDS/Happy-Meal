document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour inclure le footer
    function includeFooter() {
        fetch('../components/footer.html')  // Le chemin vers ton fichier footer.html
            .then(response => response.text())  // Récupère le contenu HTML
            .then(data => {
                document.querySelector('footer').innerHTML = data; // Ajoute le footer dans l'élément <footer>
            })
            .catch(err => console.error('Erreur lors du chargement du footer:', err));
    }

    // Appel de la fonction pour inclure le footer sur chaque page
    includeFooter();
});
