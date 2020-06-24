let allPlaylists;

const sectionChoix = document.getElementById('choix');
const divListe = document.getElementById('listePlaylist');

const divHero = document.getElementById('titre');

function getAllPlaylists() {
  //Masquer la partie jeu

  compteurTrack = 0;

  //
  httpGet('/api/playlists/all')
    .then((response) => response.json())
    .then((response) => {
      allPlaylists = response.playlists;

      let html = '';
      for (playlist of allPlaylists) {
        html +=
          '<li onclick="jouerOnePlaylist(\'' +
          playlist.id +
          '\')"> <a>' +
          playlist.name +
          ' </a></li> ';
        // <button onclick=\"deleteOnePlaylist('" +
        // playlist.id +
        // "')\">  Supprimer </button>"
      }

      html = `<ul>${html}</ul>`;
      divListe.innerHTML = html;
    });
}

function jouerOnePlaylist(id) {
  window.location = '/playlist/' + id;
}

function deleteOnePlaylist(id) {
  httpDelete('/api/playlists/delete/' + id).then(() => {
    getAllPlaylists();
  });
}

const btnPlaylist = document.getElementById('getPlaylistsUser');
const listPlaylists = document.getElementById('collapseOne');

btnPlaylist.addEventListener('click', chargement);
let pagination = 0;
function chargement(e, pagination) {
  pagination = 20;
  $.ajax({
    url: '/api/spotify/playlists',
    data: {
      startIndex: pagination,
    },
  }).done(function (data) {
    listPlaylists.innerHTML = '';
    items = data.data.items;
    listPlaylists.innerHTML = '<ul>';
    for (item of items) {
      listPlaylists.innerHTML += `<li onclick="chargementOnePlaylist(${item.id})">
          ${item.name}
        </li>`;
    }

    listPlaylists.innerHTML += `<li onclick="chargement(${pagination})">Plus de playlists</li></ul>`;
  });
}

function chargementOnePlaylist(id) {
  $.ajax({
    url: '/api/spotify/user/playlist',
    data: {
      idPlaylist: id,
    },
  }).done(function (data) {
    playlistJson = JSON.parse(data.data);
    sessionStorage.setItem(
      playlistJson.id.toString(),
      JSON.stringify(playlistJson)
    );
    window.location = '/playlist/' + playlistJson.id;
  });
}

//Lancement immédiat
getAllPlaylists();
