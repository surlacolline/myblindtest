//Init var
let compteurTrack = -1;
let compteurPlaylist = 0;
let currentPlaylist;
let allPlaylists;
let idCurrentPlaylist;

//select element DOM
const lecteurDiv = document.getElementById("lecteur");
const lecteurAudio = document.getElementById("lecteurAudio");
const btnTry = document.getElementById("try");
const btnNextTrack = document.getElementById("nextTrack");
const btnChangerPlaylist = document.getElementById("changerPlaylist");
const btnNextPlaylist = document.getElementById("nextPlaylist");
const value = document.getElementById("valueToTry");
const result = document.getElementById("resultat");
const divavancement = document.getElementById("avancement");

const sectionJeu = document.getElementById("jeu");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");
const btnPlayPause = document.getElementById("PlayPause");

//Function
function clearText() {
  if (value.innerText.includes("Une idée du nom de la chanson ou de")) {
    value.innerText = "";
  }
}
function progressMove() {
  if (lecteurAudio.paused) {
  } else {
    const width = (lecteurAudio.currentTime * 100) / lecteurAudio.duration;
    progress.style.width = "" + width + "%";
  }
}
function playMusique() {
  btnPlayPause.classList.toggle("paused");
  if (lecteurAudio.paused) {
    lecteurAudio.volume = 0.1;
    lecteurAudio.play();
  } else {
    lecteurAudio.pause();
  }
}

function changerPlaylist() {
  sectionJeu.style.display = "none";
  afficherListe();
}
function nextPlaylist() {
  compteurPlaylist++;
  compteurTrack = -1;
  currentPlaylist = allPlaylists[compteurPlaylist];
  lecturePlaylist();
}

// sectionJeu.style.display = "block";
// masquerListe();
// idCurrentPlaylist = id;
// currentPlaylist = getPlaylistFromId(idCurrentPlaylist);
// lecturePlaylist();

function masquerListe() {
  sectionChoix.style.display = "none";
  divListe.style.display = "none";
  divHero.style.display = "none";
}

function afficherListe() {
  window.location = "/playlist";
  sectionChoix.style.display = "flex";
  divListe.style.display = "";
  divHero.style.display = "";
}

function getPlaylistFromId(id) {
  if (!allPlaylists) {
    httpGet("/api/playlists/all")
      .then((response) => response.json())
      .then((response) => {
        allPlaylists = response.playlists;
      })
      .then(() => {
        playPlaylist(id);
      });
  } else {
    playPlaylist(id);
  }
}

function playPlaylist(id) {
  for (playlist of allPlaylists) {
    if (playlist.id == id) {
      currentPlaylist = playlist;
      lecturePlaylist();
    }
  }
}

function lecturePlaylist() {
  compteurTrack++;
  result.innerHTML = "";
  if (compteurTrack < currentPlaylist.tracks.length) {
    lecteurAudio.src = currentPlaylist.tracks[compteurTrack].preview_url;
    lecteurAudio.autoplay = "false";
    lecteurAudio.pause();

    const avancement =
      " " + (compteurTrack + 1) + " / " + currentPlaylist.tracks.length;
    const avancementPlaylist =
      " " + (compteurPlaylist + 1) + " / " + allPlaylists.length;
    divavancement.innerHTML = avancement;
  } else {
    lecteurAudio.src = null;
    lecteurAudio.autoplay = "false";
    result.innerHTML = "La partie est finie!";
  }
}

function tryValue() {
  if (
    value.value === currentPlaylist.tracks[compteurTrack].name ||
    value.value === currentPlaylist.tracks[compteurTrack].artist
  ) {
    result.innerText = "Bravo !!";
    lecturePlaylist();
  } else {
    result.innerText = "Nope...";
  }
}
function getAllPlaylists() {
  //Masquer la partie jeu

  compteurTrack = 0;

  //
}

function jouerOnePlaylist() {
  const adresseActuelle = window.location;

  const words = adresseActuelle.pathname.split("/");

  idCurrentPlaylist = words[words.length - 1];
  currentPlaylist = getPlaylistFromId(idCurrentPlaylist);
}

//Ajout events
btnTry.addEventListener("click", tryValue);
btnNextTrack.addEventListener("click", () => {
  value.innerText = "";
  value.focus();
  lecturePlaylist();
});
btnChangerPlaylist.addEventListener("click", changerPlaylist);
lecteurAudio.addEventListener("ended", lecturePlaylist);
lecteurAudio.addEventListener("timeupdate", progressMove);
btnPlayPause.addEventListener("click", playMusique);
progressBar.addEventListener("click", clearText);

jouerOnePlaylist();
