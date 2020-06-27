let allPlaylists;
const divListe = document.getElementById('listePlaylist');
const btnPlaylist = document.getElementById('getUserPlaylists');
const btnGetCategories = document.getElementById('getSpotifyCategories');
const listUserPlaylists = document.getElementById('collapseOne');
const listCategories = document.getElementById('collapseTwo');
const listCategoryPlaylists = document.getElementById('collapseThree');
const divHero = document.getElementById('titre');

let paginationUsersPlaylist = 0;
let paginationCategories = 0;
let paginationCategoryPlaylists = 0;

function getAllPlaylists() {
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

  document.getElementById('cardCategoryPlaylists').style.display = 'none';
}

function deleteOnePlaylist(id) {
  httpDelete('/api/playlists/delete/' + id).then(() => {
    getAllPlaylists();
  });
}

function showUserPlaylists(e, blAfficherPlus) {
  if (blAfficherPlus) {
    paginationUsersPlaylist++;
  }

  let html = '';
  $.ajax({
    url: '/api/spotify/playlists',
    data: {
      startIndex: paginationUsersPlaylist * 20,
    },
  }).done(function (data) {
    if (data.data?.error?.status === 401) {
      listUserPlaylists.classList.remove('show');
      alert("Veuillez d'abord vous connecter à votre compte spotify");
      return;
    }
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

function showSpotifyCategories(e, blAfficherPlus) {
  if (blAfficherPlus) {
    paginationCategories++;
  }

  let html = '';
  $.ajax({
    url: '/api/spotify/categories',
    data: {
      startIndex: paginationCategories * 20,
    },
  }).done(function (data) {
    if (data.data?.error?.status === 401) {
      listCategories.classList.remove('show');
      alert("Veuillez d'abord vous connecter à votre compte spotify");
    }

    categories = data.data.categories.items;

    for (category of categories) {
      html += `<li onclick="getCategoryPlaylists('${category.id}', '${category.name}')">
          ${category.name}
        </li>`;
    }

    html += `<li onclick="getMoreCategories()">Plus de playlists</li></ul>`;
    html = `<ul>${html} </ul>`;
    listCategories.innerHTML = html;
  });
}

function showCategoryPlaylists(id, categoryName, blAfficherPlus) {
  if (blAfficherPlus) {
    paginationCategoryPlaylists++;
  }

  let html = '';
  $.ajax({
    url: '/api/spotify/CategoryPlaylists',
    data: {
      idCategory: id,
      startIndex: paginationCategoryPlaylists * 20,
    },
  }).done(function (data) {
    if (data.data?.error?.status === 401) {
      listCategoryPlaylists.classList.remove('show');
      alert("Veuillez d'abord vous connecter à votre compte spotify");
    }

    items = data.data.playlists.items;

    for (item of items) {
      html += `<li onclick="chargementOnePlaylist('${item.id}')">
          ${item.name}
        </li>`;
    }

    html += `<li onclick="afficherPlus()">Plus de playlists</li></ul>`;
    html = `<ul>${html} </ul>`;
    listCategoryPlaylists.innerHTML = html;
    document.getElementById(
      'collapseThreeTitle'
    ).innerHTML = `Choisir une playlist de la catégorie ${categoryName} v `;
    document.getElementById('cardCategoryPlaylists').style.display = 'block';

    listCategories.classList.remove('show');
    listCategoryPlaylists.classList.add('show');
  });
}
function getCategoryPlaylists(id, categoryName) {
  showCategoryPlaylists(id, categoryName, false);
}
function getMoreCategories() {
  showSpotifyCategories(undefined, true);
}

//Selection d'une playlist
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
    jouerOnePlaylist(playlistJson.id);
  });
}

function jouerOnePlaylist(id) {
  window.location = '/playlist/' + id;
}
const btnLogin = document.getElementById('loginSpotify');
function loginSpotify() {
  document.getElementById('loginSpotify').innerHTML = `Bienvenue`;
}
btnLogin.addEventListener('click', loginSpotify);
btnPlaylist.addEventListener('click', showUserPlaylists);
btnGetCategories.addEventListener('click', showSpotifyCategories);
//Lancement immédiat
getAllPlaylists();
