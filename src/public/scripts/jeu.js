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
const btnChangerPlaylist= document.getElementById("changerPlaylist");
const btnNextPlaylist = document.getElementById("nextPlaylist");
const value = document.getElementById("valueToTry");
const result = document.getElementById("resultat");
const divavancement = document.getElementById("avancement");
const choixPlaylist = document.getElementById("choixPlaylist");
const sectionChoix = document.getElementById("choix");
const sectionJeu = document.getElementById("jeu");

//Ajout events
btnTry.addEventListener("click", tryValue);
btnNextTrack.addEventListener("click", lecturePlaylist);
btnNextPlaylist.addEventListener("click", nextPlaylist);
btnChangerPlaylist.addEventListener("click", changerPlaylist);
lecteurAudio.addEventListener("ended", lecturePlaylist);



function changerPlaylist(){
  sectionJeu.style.visibility = "hidden";
  sectionChoix.style.visibility = "visible";
}
function nextPlaylist(){
  compteurPlaylist ++;
  compteurTrack = -1;
  currentPlaylist = allPlaylists[compteurPlaylist];
  lecturePlaylist();
}
function getAllPlaylists() {
  //Masquer la partie jeu
  sectionJeu.style.visibility = "hidden";
  sectionChoix.style.visibility = "visible";
  //
  httpGet("/api/playlists/all")
       .then((response) => response.json())
       .then((response) => {
         allPlaylists = response.playlists;

         let html = '<ul>';

      for (playlist of allPlaylists){
        html+= '<li onclick="jouerOnePlaylist(\''+playlist.id  +  '\')"> '  + playlist.name + ' </li>' 
        }
        html +=  '</ul>'

sectionChoix.innerHTML = html;

       });
      };

       function jouerOnePlaylist(id){
        sectionJeu.style.visibility = "visible";
        sectionChoix.style.visibility =  "hidden"; 
        idCurrentPlaylist = id;
        currentPlaylist = getPlaylistFromId(idCurrentPlaylist);
        lecturePlaylist();

       }

       function getPlaylistFromId(id){
        for (playlist of allPlaylists){
          if (playlist.id == id){
        return playlist
          }
          }
       }
//   httpGet("/api/playlists/all")
//     .then((response) => response.json())
//     .then((response) => {
//        allPlaylists = response.playlists;
//       currentPlaylist = allPlaylists[compteurPlaylist];
//     })
//     .then(() => {
//       lecturePlaylist();
//     });
// }

function lecturePlaylist() {
  compteurTrack++;
  if (compteurTrack < currentPlaylist.tracks.length){
    lecteurAudio.src = currentPlaylist.tracks[compteurTrack].preview_url;
    lecteurAudio.autoplay = "false";
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
};

getAllPlaylists();