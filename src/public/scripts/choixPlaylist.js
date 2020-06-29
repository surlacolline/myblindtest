let allPlaylists;
const divListe = document.getElementById('listePlaylist');
const btnBDDPlaylist = document.getElementById('getBDDPlaylist');
const btnPlaylist = document.getElementById('getUserPlaylists');
const btnGetCategories = document.getElementById('getSpotifyCategories');
const listUserPlaylists = document.getElementById('collapseOne');
const listCategories = document.getElementById('collapseTwo');
const listCategoryPlaylists = document.getElementById('collapseThree');
const divHero = document.getElementById('titre');
const btnSpotify = document.getElementById('loginSpotify');

let paginationUsersPlaylist = 0;
let paginationCategories = 0;
let paginationCategoryPlaylists = 0;

function getAllPlaylists() {
  //
  httpGet('/api/spotify/APILogin').then((response) => {
    console.log('APILogin');
  });
  httpGet('/api/playlists/all')
    .then((response) => response.json())
    .then((response) => {
      allPlaylists = response.playlists;

      let html = '';
      for (playlist of allPlaylists) {
        html += `
        <li  class='cursor-pointer' onclick="jouerOnePlaylist('${playlist.id}')">
          <a>${playlist.name}</a>
        </li> `;
        // <button onclick=\"deleteOnePlaylist('" +
        // playlist.id +
        // "')\">  Supprimer </button>"
      }

      html = `<ul>${html}</ul>`;
      divListe.innerHTML = html;
    });

  document.getElementById('cardCategoryPlaylists').style.display = 'none';
  const name = getCookie('display_name');
  if (name !== null) {
    document.getElementById(
      'loginSpotify'
    ).innerHTML = `${name}     <i class="icon-spotify"></i>`;
  }
}

function deleteOnePlaylist(id) {
  httpDelete('/api/playlists/delete/' + id).then(() => {
    getAllPlaylists();
  });
}

function showUserPlaylists(e, blAfficherPlus) {
  const id = getCookie('id');
  if (id === null) {
    listUserPlaylists.classList.remove('show');
    alert("Veuillez d'abord vous connecter à votre compte spotify");
    return;
  }
  if (blAfficherPlus) {
    paginationUsersPlaylist++;
  }
  paginationUsersPlaylist === -1
    ? (paginationUsersPlaylist = 0)
    : paginationUsersPlaylist;
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
    let blAfficherPlusOption = true;
    if (items.length < 20) {
      paginationUsersPlaylist <= 0
        ? (blAfficherPlusOption = false)
        : blAfficherPlusOption;
      paginationUsersPlaylist = -1;
    }
    for (item of items) {
      html += `<li  class='cursor-pointer'  onclick="chargementOnePlaylist('${item.id}')">
          ${item.name}
        </li>`;
    }
    blAfficherPlusOption
      ? (html += `<li  class='cursor-pointer'  onclick="afficherPlus()">Plus de playlists</li></ul>`)
      : (html = html);

    html = `<ul>${html} </ul>`;
    listUserPlaylists.innerHTML = html;
    // toggleIconCircle(btnPlaylist.getElementsByTagName('i')[0]);
  });
}

function afficherPlus() {
  showUserPlaylists(undefined, true);
}
function afficherPlusCat(id, categoryName) {
  showCategoryPlaylists(id, categoryName, true);
}

function showSpotifyCategories(e, blAfficherPlus) {
  if (blAfficherPlus) {
    paginationCategories++;
  }
  paginationCategories === -1
    ? (paginationCategories = 0)
    : paginationCategories;

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
    let blAfficherPlusOption = true;
    categories = data.data.categories.items;
    if (categories.length < 20) {
      paginationCategories <= 0
        ? (blAfficherPlusOption = false)
        : blAfficherPlusOption;
      paginationCategories = -1;
    }
    for (category of categories) {
      html += `<li  class='cursor-pointer'  onclick="getCategoryPlaylists('${category.id}', '${category.name}')">
          ${category.name}
        </li>`;
    }
    blAfficherPlusOption
      ? (html += `<li  class='cursor-pointer'  onclick="getMoreCategories()">Plus de catégories</li></ul>`)
      : (html = html);

    html = `<ul>${html} </ul>`;
    listCategories.innerHTML = html;

    // toggleIconCircle(btnGetCategories.getElementsByTagName('i')[0]);
  });
}
// function toggleIconCircle(iconeTag) {
//   if (iconeTag?.classList.contains('icon-circle-down')) {
//     iconeTag.classList.remove('icon-circle-down');
//     iconeTag.classList.add('icon-circle-up');
//   } else if (iconeTag?.classList.contains('icon-circle-up')) {
//     iconeTag.classList.remove('icon-circle-up');
//     iconeTag.classList.add('icon-circle-down');
//   }
// }

function showCategoryPlaylists(id, categoryName, blAfficherPlus) {
  if (blAfficherPlus) {
    paginationCategoryPlaylists++;
  }
  paginationCategoryPlaylists === -1
    ? (paginationCategoryPlaylists = 0)
    : paginationCategoryPlaylists;
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
    let blAfficherPlusOption = true;

    items = data.data.playlists.items;
    if (items.length < 20) {
      paginationCategoryPlaylists <= 0
        ? (blAfficherPlusOption = false)
        : blAfficherPlusOption;
      paginationCategoryPlaylists = -1;
    }
    for (item of items) {
      html += `<li class='cursor-pointer' onclick="chargementOneAPIPlaylist('${item.id}')">
          ${item.name}
        </li>`;
    }
    blAfficherPlusOption
      ? (html += `<li  class='cursor-pointer'  onclick="afficherPlusCat('${id}','${categoryName}')">Plus de playlists</li></ul>`)
      : (html = html);
    html = `<ul>${html} </ul>`;
    listCategoryPlaylists.innerHTML = html;
    document.getElementById(
      'collapseThreeTitle'
    ).innerHTML = `Choisis une playlist de la catégorie ${categoryName} <i class="icon-circle-down"> `;
    document.getElementById('cardCategoryPlaylists').style.display = 'block';

    listCategories.classList.remove('show');
    listCategoryPlaylists.classList.add('show');
    // toggleIconCircle(btnPlaylist.getElementsByTagName('i')[0]);
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

function chargementOneAPIPlaylist(id) {
  $.ajax({
    url: '/api/spotify/playlistAPI',
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
function loginOrDisconnectSpotify() {
  const id = getCookie('id');
  if (id !== null) {
    //deconexion
    deleteCookie('id');
    deleteCookie('display_name');
    deleteCookie('Token');
    document.getElementById(
      'loginSpotify'
    ).innerHTML = `Connexion <i class="icon-spotify"></i
    >`;
    btnSpotify.href = '';
  } else {
    btnGetCategories.href = '/api/spotify/login';
  }
}
btnLogin.addEventListener('click', loginOrDisconnectSpotify);
btnPlaylist.addEventListener('click', showUserPlaylists);
// btnBDDPlaylist.addEventListener(
//   'click'
//   //  toggleIconCircle(btnPlaylist.getElementsByTagName('i')[0])
// );
btnGetCategories.addEventListener('click', showSpotifyCategories);
//Lancement immédiat
getAllPlaylists();
