if (localStorage.getItem('recettes')) {
    console.log('Données récupérées du localStorage :');
    console.log(JSON.parse(localStorage.getItem('recettes')));
  } else {
    console.log('Chargement depuis le fichier JSON...');
    $.ajax({
      url: '/data/data.json',
      method: 'GET',
      dataType: 'json',
      success: function (data) {

        localStorage.setItem('recettes', JSON.stringify(data));
        console.log('Données stockées dans le localStorage :', data);

      },
      error: function (xhr, status, error) {
        console.error('Erreur lors du chargement des données :', error);
      }
    });
  }

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

$(document).ready(async () => {
  try {
    const recettes = await getRecettes();
    displayRecettes(recettes);
  } catch (error) {
    console.error('Impossible de charger les recettes :', error)
  }
});