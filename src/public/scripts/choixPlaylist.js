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

const btnPlaylist = document.getElementById('getUserPlaylists');
const btnGetCategories = document.getElementById('getSpotifyCategories');
const listUserPlaylists = document.getElementById('collapseOne');
const listCategories = document.getElementById('collapseTwo');
const listCategoryPlaylists = document.getElementById('collapseThree');

btnPlaylist.addEventListener('click', showUserPlaylists);
btnGetCategories.addEventListener('click', showSpotifyCategories);
let pagination = 0;

function showUserPlaylists(e, blAfficherPlus) {
  if (blAfficherPlus) {
    pagination++;
  }

  let html = '';
  $.ajax({
    url: '/api/spotify/playlists',
    data: {
      startIndex: pagination * 20,
    },
  }).done(function (data) {
    items = data.data.items;

    for (item of items) {
      html += `<li onclick="chargementOnePlaylist('${item.id}')">
          ${item.name}
        </li>`;
    }

    html += `<li onclick="afficherPlus()">Plus de playlists</li></ul>`;
    html = `<ul>${html} </ul>`;
    listUserPlaylists.innerHTML = html;
  });
}

function afficherPlus() {
  showUserPlaylists(undefined, true);
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

function showSpotifyCategories(e, blAfficherPlus) {
  if (blAfficherPlus) {
    pagination++;
  }

  let html = '';
  $.ajax({
    url: '/api/spotify/categories',
    data: {
      startIndex: pagination * 20,
    },
  }).done(function (data) {
    categories = data.data.categories.items;

    for (category of categories) {
      html += `<li onclick="getCategoryPlaylists('${category.id}')">
          ${category.name}
        </li>`;
    }

    html += `<li onclick="getMoreCategories()">Plus de playlists</li></ul>`;
    html = `<ul>${html} </ul>`;
    listCategories.innerHTML = html;
  });
}

function showCategoryPlaylists(id, blAfficherPlus) {
  if (blAfficherPlus) {
    pagination++;
  }

  let html = '';
  $.ajax({
    url: '/api/spotify/CategoryPlaylists',
    data: {
      idCategory: id,
      startIndex: pagination * 20,
    },
  }).done(function (data) {
    items = data.data.playlists.items;

    for (item of items) {
      html += `<li onclick="chargementOnePlaylist('${item.id}')">
          ${item.name}
        </li>`;
    }

    html += `<li onclick="afficherPlus()">Plus de playlists</li></ul>`;
    html = `<ul>${html} </ul>`;
    listCategoryPlaylists.innerHTML = html;
  });
}
function getCategoryPlaylists(id) {
  let html = showCategoryPlaylists(id, false);
  listCategoryPlaylists.innerHTML = 'test';
}
function getMoreCategories() {
  showSpotifyCategories(undefined, true);
}
//Lancement immédiat
getAllPlaylists();
