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