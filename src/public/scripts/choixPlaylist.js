let allPlaylists;

const sectionChoix = document.getElementById("choix");
const divListe = document.getElementById("listePlaylist");

const divHero = document.getElementById("titre");

function getAllPlaylists() {
  //Masquer la partie jeu

  compteurTrack = 0;

  //
  httpGet("/api/playlists/all")
    .then((response) => response.json())
    .then((response) => {
      allPlaylists = response.playlists;

      let html = "<ul>";

      for (playlist of allPlaylists) {
        html +=
          "<li onclick=\"jouerOnePlaylist('" +
          playlist.id +
          "')\"> <a>" +
          playlist.name +
          " </a></li>";
      }
      html += "</ul>";

      divListe.innerHTML = html;
    });
}

function jouerOnePlaylist(id) {
  //appel ajax
  window.location = "/playlist/" + id;
}

//Lancement immédiat
getAllPlaylists();
