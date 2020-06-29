//Init var
let compteurTrack = -1;
let compteurPlaylist = 0;
let score = 0;
function templateScore(score) {
  return `Score : ${score}/20`;
}

let currentPlaylist;
let allPlaylists;
let idCurrentPlaylist;

//select element DOM
const lecteurDiv = document.getElementById('lecteur');
const lecteurAudio = document.getElementById('lecteurAudio');
const btnTry = document.getElementById('try');
const btnNextTrack = document.getElementById('nextTrack');
const btnChangerPlaylist = document.getElementById('changerPlaylist');
const btnNextPlaylist = document.getElementById('nextPlaylist');
const textEditValue = document.getElementById('valueToTry');
const result = document.getElementById('resultat');
const divavancement = document.getElementById('avancement');
const divscore = document.getElementById('score');
const sectionJeu = document.getElementById('jeu');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const btnPlayPause = document.getElementById('PlayPause');
const toast = document.querySelector('.toast');

//Function
function clearText() {
  if (textEditValue.innerText.includes('Une idée du nom de la chanson ou de')) {
    textEditValue.innerText = '';
  }
}
function progressMove() {
  if (lecteurAudio.paused) {
  } else {
    const width = (lecteurAudio.currentTime * 100) / lecteurAudio.duration;
    progress.style.width = '' + width + '%';
  }
}
function playMusique() {
  btnPlayPause.classList.toggle('paused');
  if (lecteurAudio.paused) {
    lecteurAudio.volume = 0.1;
    lecteurAudio.play();
  } else {
    lecteurAudio.pause();
  }
}

function changerPlaylist() {
  window.location = '/playlist';
}
function nextPlaylist() {
  compteurPlaylist++;
  compteurTrack = -1;
  currentPlaylist = allPlaylists[compteurPlaylist];
  lecturePlaylist();
}

function getPlaylistFromId(id) {
  if (!allPlaylists) {
    httpGet('/api/playlists/all')
      .then((response) => response.json())
      .then((response) => {
        allPlaylists = response.playlists;
      })
      .then(() => {
        return playPlaylist(id);
      });
  } else {
    return playPlaylist(id);
  }
}

function getPlaylistFromSessionStorage(id) {
  let playlist = JSON.parse(sessionStorage.getItem(id));

  currentPlaylist = playlist;
  if (!playlist) {
    return;
  }
  lecturePlaylist();
  return playlist;
}
function playPlaylist(id) {
  for (playlist of allPlaylists) {
    if (playlist.id == id) {
      currentPlaylist = playlist;
      lecturePlaylist();
      return playlist;
    }
  }
}

function lecturePlaylist() {
  compteurTrack++;
  result.innerHTML = '';
  textEditValue.value = '';
  divscore.innerHTML = templateScore(score);
  if (compteurTrack < currentPlaylist.tracks.length) {
    lecteurAudio.src = currentPlaylist.tracks[compteurTrack].preview_url;
    lecteurAudio.autoplay = 'true';
    //lecteurAudio.pause();

    const avancement =
      ' ' + (compteurTrack + 1) + ' / ' + currentPlaylist.tracks.length;

    divavancement.innerHTML = avancement;
  } else {
    lecteurAudio.src = null;
    lecteurAudio.autoplay = 'false';
    result.innerHTML =
      'La partie est finie! Bravo, votre score  est de ' + `${score}/20`;
  }
}
function pressEnterToTryValue(e) {
  if (e.key === 'Enter') {
    tryValue();
  }
}

function tryValue() {
  if (
    comparaisonSouple(
      textEditValue.value,
      currentPlaylist.tracks[compteurTrack].name
    ) ||
    comparaisonSouple(
      textEditValue.value,
      currentPlaylist.tracks[compteurTrack].artist
    )
  ) {
    result.innerText = 'Bravo !!';
    textEditValue.focus();
    textEditValue.value = '';
    score++;
    divscore.innerHTML = templateScore(score);
    lecturePlaylist();
  } else {
    result.innerText = 'Nope...';
    textEditValue.focus();
  }
}

function comparaisonSouple(valueToTry, valueToCompare) {
  if (hammingDistance(valueToTry, valueToCompare) <= 1) {
    return true;
  } else {
    return false;
  }
}
function hammingDistance(valueToTry, valueToCompare) {
  var dist = 0;
  valueToTry = valueToTry.toLowerCase();
  valueToCompare = valueToCompare.toLowerCase();
  for (
    var i = 0, j = Math.max(valueToTry.length, valueToCompare.length);
    i < j;
    i++
  ) {
    if (
      !valueToTry[i] ||
      !valueToCompare[i] ||
      valueToTry[i] !== valueToCompare[i]
    ) {
      dist++;
    }
  }
  return dist;
}

function getAllPlaylists() {
  compteurTrack = 0;

  //
}

function jouerOnePlaylist() {
  const adresseActuelle = window.location;

  const words = adresseActuelle.pathname.split('/');

  idCurrentPlaylist = words[words.length - 1];
  currentPlaylist = getPlaylistFromSessionStorage(idCurrentPlaylist);
  if (currentPlaylist == undefined) {
    currentPlaylist = getPlaylistFromId(idCurrentPlaylist);
  }
}
const snackBarProcess = [];
function launch_toast() {
  const nom = currentPlaylist.tracks[compteurTrack].name;
  const titre = currentPlaylist.tracks[compteurTrack].artist;
  document.getElementById('snackbar').innerHTML = `C'était ${nom} de ${titre}`;
  // Get the snackbar DIV
  var x = document.getElementById('snackbar');

  // Add the "show" class to DIV
  x.className = 'show';
  snackBarProcess.forEach((p) => clearTimeout(p));
  // After 3 seconds, remove the show class from DIV
  snackBarProcess.push(
    setTimeout(function () {
      x.className = x.className.replace('show', '');
    }, 5000)
  );
}

const templateToast = ``;
//Ajout events
btnTry.addEventListener('click', tryValue);
textEditValue.addEventListener('keypress', pressEnterToTryValue);
btnNextTrack.addEventListener('click', () => {
  textEditValue.value = '';
  textEditValue.focus();

  launch_toast();
  lecturePlaylist();
});
btnChangerPlaylist.addEventListener('click', changerPlaylist);
lecteurAudio.addEventListener('ended', () => {
  launch_toast();
  lecturePlaylist();
});
lecteurAudio.addEventListener('timeupdate', progressMove);
btnPlayPause.addEventListener('click', playMusique);
progressBar.addEventListener('click', clearText);

jouerOnePlaylist();
