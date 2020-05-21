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
const sectionChoix = document.getElementById("choix");
const divListe = document.getElementById("listePlaylist")
const sectionJeu = document.getElementById("jeu");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");
const btnPlayPause = document.getElementById("PlayPause");
const divHero = document.getElementById("titre");

//Ajout events
btnTry.addEventListener("click", tryValue);
btnNextTrack.addEventListener("click", lecturePlaylist);
//btnNextPlaylist.addEventListener("click", nextPlaylist);
btnChangerPlaylist.addEventListener("click", changerPlaylist);
lecteurAudio.addEventListener("ended", lecturePlaylist);
lecteurAudio.addEventListener("timeupdate", progressMove);
btnPlayPause.addEventListener("click", playMusique )
progressBar.addEventListener("click", clearText)

function clearText(){
 if (value.innerText.includes('Une idée du nom de la chanson ou de')){
  value.innerText = '';
 }
 
}
function progressMove(){
  if (lecteurAudio.paused){
    
  }else{
    const width = lecteurAudio.currentTime *100 / lecteurAudio.duration
    progress.style.width = ""+width+"%";
  }
}
function playMusique(){
  btnPlayPause.classList.toggle("paused");
  if (lecteurAudio.paused){
    lecteurAudio.volume =0.1;
    lecteurAudio.play();

   
  }else{
    lecteurAudio.pause();
  }
}

function changerPlaylist(){
  sectionJeu.style.display = "none";
  sectionChoix.style.display = "flex";
}
function nextPlaylist(){
  compteurPlaylist ++;
  compteurTrack = -1;
  currentPlaylist = allPlaylists[compteurPlaylist];
  lecturePlaylist();
}
function getAllPlaylists() {
  //Masquer la partie jeu
  lecteurAudio.pause();
  compteurTrack = 0;
  sectionJeu.style.display = "none";
  sectionChoix.style.display = "block";
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

        divListe.innerHTML = html;

       });
      };
       function jouerOnePlaylist(id){
      
        sectionJeu.style.display = "block";
        masquerListe()
        idCurrentPlaylist = id;
        currentPlaylist = getPlaylistFromId(idCurrentPlaylist);
        lecturePlaylist();
       }
function masquerListe(){
  sectionChoix.style.display = "none";
  divListe.style.display = "none";
  divHero.style.display = "none";
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
  result.innerHTML = '';
  if (compteurTrack < currentPlaylist.tracks.length){
    lecteurAudio.src = currentPlaylist.tracks[compteurTrack].preview_url;
    lecteurAudio.autoplay = "false";
    lecteurAudio.pause();
    
    const avancement = ' ' + (compteurTrack + 1) + ' / ' + currentPlaylist.tracks.length;
    const avancementPlaylist = ' ' + (compteurPlaylist + 1) + ' / ' + allPlaylists.length;
    divavancement.innerHTML = avancement;

   }  else {
    lecteurAudio.src = null;
    lecteurAudio.autoplay = "false";
    result.innerHTML = "La partie est finie!"
    }
 

}

function tryValue() {
  if (value.value === currentPlaylist.tracks[compteurTrack].name || value.value === currentPlaylist.tracks[compteurTrack].artist ) {
    result.innerText = "Bravo !!";
    lecturePlaylist();
  } else {
    result.innerText = "Nope...";
  }
};

getAllPlaylists();