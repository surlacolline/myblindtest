const popupDiv = document.getElementById("popup1");

function httpGet(path) {
  return fetch(path, getOptions("GET"));
}

function httpPost(path, data) {
  return fetch(path, getOptions("POST", data));
}

function httpPut(path, data) {
  return fetch(path, getOptions("PUT", data));
}

function httpDelete(path) {
  return fetch(path, getOptions("DELETE"));
}

function getOptions(verb, data) {
  var options = {
    dataType: "json",
    method: verb,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return options;
}

function loadPopupDiv() {
  popupDiv.innerHTML = `
  <div class="popup">
      <a class="close" href="#">&times;</a>
      <div class="content">
        <h3>Bienvenue sur la V1 de My.Blind.Test!</h3>
        De futur améliorations sont prévues : 
        <br /><ul><li>
        Une V2 avec la possibilité de se connecter à son compte spotify pour
        jouer à partir d'une de ses propres playlists ou de choisir une playlist
        public spotify sans connexion.</li>
        <br />
        <li>Une V3, où il sera possible de jouer à plusieurs.</li></ul>
        <br />
        En attendant, si vous avez des remarques ou des idées vous pouvez me
        contacter sur
        <a href="https://www.linkedin.com/in/elise-juif-826b466a/">Linkedin.</a>
        <br />
      </div>
    </div>
  `;
}

loadPopupDiv();
