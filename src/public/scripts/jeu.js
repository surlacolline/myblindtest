let compteurTrack = -1;
let compteurPlaylist = 0;
let currentPlaylist;
let allPlaylists;
const lecteurDiv = document.getElementById("lecteur");
const lecteurAudio = document.getElementById("lecteurAudio");
const btnTry = document.getElementById("try");
const btnNextTrack = document.getElementById("nextTrack");
const btnNextPlaylist = document.getElementById("nextPlaylist");
const value = document.getElementById("valueToTry");
const result = document.getElementById("resultat");
const divavancement = document.getElementById("avancement");
const choixPlaylist = document.getElementById("choixPlaylist");
btnTry.addEventListener("click", tryValue);
btnNextTrack.addEventListener("click", lecturePlaylist);
btnNextPlaylist.addEventListener("click", nextPlaylist);
lecteurAudio.addEventListener("ended", lecturePlaylist);

function nextPlaylist(){
  compteurPlaylist ++;
  compteurTrack = -1;
  currentPlaylist = allPlaylists[compteurPlaylist];
  lecturePlaylist();
}
function getAllPlaylists() {
  httpGet("/api/playlists/all")
    .then((response) => response.json())
    .then((response) => {
       allPlaylists = response.playlists;
      currentPlaylist = allPlaylists[compteurPlaylist];
    })
    .then(() => {
      lecturePlaylist();
    });
}

function lecturePlaylist() {
  compteurTrack++;
  if (compteurTrack < currentPlaylist.tracks.length){
    lecteurAudio.src = currentPlaylist.tracks[compteurTrack].preview_url;
    lecteurAudio.autoplay = "true";
    const avancement = ' ' + (compteurTrack + 1) + ' / ' + currentPlaylist.tracks.length;
    const avancementPlaylist = ' ' + (compteurPlaylist + 1) + ' / ' + allPlaylists.length;
    divavancement.innerHTML = avancement;
    choixPlaylist.innerHTML = avancementPlaylist;
   }  else {
    lecteurAudio.src = null;
    lecteurAudio.autoplay = "false";
    result.innerHTML = "La partie est finie!"
    }
 

}

function tryValue() {
  if (value.value === currentPlaylist.tracks[compteurTrack].name || value.value === currentPlaylist.tracks[compteurTrack].artist ) {
    result.innerHTML = "Bravo !!";
    lecturePlaylist();
  } else {
    result.innerHTML = "Nope...";
  }
}

getAllPlaylists();