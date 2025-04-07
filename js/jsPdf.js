// Fonction pour générer et télécharger la liste des ingrédients au format PDF
function downloadShoppingListPDF() {
    const { jsPDF } = window.jspdf;  // Utilisation de jsPDF
    const doc = new jsPDF();

    // Titre du PDF
    doc.setFontSize(16);
    doc.text("Liste des ingrédients", 20, 20);

    let shoppingList = getShoppingList();  // Récupérer la liste des ingrédients
    let yPosition = 30;  // Position verticale initiale

    // Afficher chaque ingrédient avec sa quantité
    shoppingList.forEach(item => {
        doc.setFontSize(12);
        doc.text(`${item.name} - ${item.quantity}`, 20, yPosition);
        yPosition += 10;  // Augmenter la position verticale pour chaque ingrédient

        // Si la liste est trop longue et dépasse une page, on commence une nouvelle page
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;  // Réinitialiser la position verticale
        }
    });

    // Télécharger le fichier PDF
    doc.save('liste_des_ingredients.pdf');
}

// Ajouter un bouton pour télécharger le PDF
document.getElementById("download-btn").addEventListener("click", downloadShoppingListPDF);
