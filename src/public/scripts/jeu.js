let compteur = -1;
let objAudio;
const lecteurDiv = document.getElementById("lecteur");
const lecteurAudio = document.getElementById("lecteurAudio");
const btnTry = document.getElementById("try");
const btnNext = document.getElementById("next");
const value = document.getElementById("valueToTry");
const result = document.getElementById("resultat");
const divavancement = document.getElementById("avancement");
btnTry.addEventListener("click", tryValue);
btnNext.addEventListener("click", lecturePlaylist);
lecteurAudio.addEventListener("ended", lecturePlaylist);

function getAllPlaylists() {
  httpGet("/api/playlists/all")
    .then((response) => response.json())
    .then((response) => {
      var allPlaylists = response.playlists;
      objAudio = allPlaylists[2];
    })
    .then(() => {
      lecturePlaylist();
    });
}

function lecturePlaylist() {
  compteur++;
  if (compteur < objAudio.tracks.length){
    lecteurAudio.src = objAudio.tracks[compteur].preview_url;
    lecteurAudio.autoplay = "true";
    const avancement = ' ' + compteur + ' / ' + objAudio.tracks.length;
    divavancement.innerHTML = avancement;
   }  else {
    lecteurAudio.src = null;
    lecteurAudio.autoplay = "false";
    result.innerHTML = "La partie est finie!"
    }
 

}

function tryValue() {
  if (value.value === objAudio.tracks[compteur].name || value.value === objAudio.tracks[compteur].artist ) {
    result.innerHTML = "Bravo !!";
    lecturePlaylist();
  } else {
    result.innerHTML = "Nope...";
  }
}

getAllPlaylists();