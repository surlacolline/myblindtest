//Init var
let compteurTrack = -1;
let compteurPlaylist = 0;
let score = 0;
function templateScore(score) {
  return `Score : ${score}/${currentPlaylist.tracks.length}`;
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
const toggleBtn = document.querySelector('.switch');
function blModeSoiree() {
  const checked = document.querySelector('.switch input:checked');
  if (checked == null) {
    return false;
  } else {
    return true;
  }
}
function toggleDisplay() {
  if (blModeSoiree()) {
    textEditValue.placeholder = `Clique ici pour voir la réponse`;
    btnTry.innerHTML = `J'ai la bonne réponse!`;
    textEditValue.readOnly = true;
    btnNextTrack.innerHTML = 'Raté!';
    document.querySelector('.tooltiptext').innerText =
      'Désactiver le mode soirée';
  } else {
    textEditValue.placeholder = `Une idée du nom de la chanson ou de l'artiste?`;
    btnTry.innerHTML = `Je me lance!`;
    textEditValue.readOnly = false;
    btnNextTrack.innerHTML = 'Aucune idée, Chanson suivante!';
    document.querySelector('.tooltiptext').innerText = 'Activer le mode soirée';
  }
}

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
  window.location = '/';
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
  if (blModeSoiree()) {
    textEditValue.value = '';
    snackResponse('Bravo!');
    score++;
    divscore.innerHTML = templateScore(score);
    lecturePlaylist();
    return;
  }
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
    textEditValue.focus();
    textEditValue.value = '';
    snackResponse('Bravo!');
    score++;
    divscore.innerHTML = templateScore(score);
    lecturePlaylist();
  } else {
    launch_toast(`Nope...`);
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
function snackResponse(message) {
  const nom = currentPlaylist.tracks[compteurTrack].name;
  const titre = currentPlaylist.tracks[compteurTrack].artist;
  message === undefined ? (message = '') : (message = message);
  launch_toast(`${message} C'était ${nom} de ${titre}`);
}
const snackBarProcess = [];
function launch_toast(message) {
  // Get the snackbar DIV
  var x = document.getElementById('snackbar');
  x.innerHTML = message;
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

  blModeSoiree ? textEditValue.blur() : textEditValue.focus();

  snackResponse();
  lecturePlaylist();
});
textEditValue.addEventListener('click', () => {
  if (!blModeSoiree()) {
    return;
  }
  if (textEditValue.value.indexOf("C'est ") != -1) {
    textEditValue.value = '';
  } else {
    const nom = currentPlaylist.tracks[compteurTrack].name;
    const titre = currentPlaylist.tracks[compteurTrack].artist;

    const result = `C'est ${nom} de ${titre}`;
    textEditValue.value = result;
  }
});
btnChangerPlaylist.addEventListener('click', changerPlaylist);
lecteurAudio.addEventListener('ended', () => {
  snackResponse();
  lecturePlaylist();
});
lecteurAudio.addEventListener('timeupdate', progressMove);
btnPlayPause.addEventListener('click', playMusique);
progressBar.addEventListener('click', clearText);
toggleBtn.addEventListener('click', toggleDisplay);

jouerOnePlaylist();
